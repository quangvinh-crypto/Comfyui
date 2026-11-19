import asyncio
import base64
import io
import tempfile
import unittest
from pathlib import Path

from aiohttp import FormData, web
from aiohttp.test_utils import TestClient, TestServer
from PIL import Image

from studio.__main__ import py_mtimes, validate_py_sources
from studio.app import create_app


class StudioApiTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.data_dir = tempfile.TemporaryDirectory()
        self.client = TestClient(TestServer(create_app(self.data_dir.name, "http://127.0.0.1:9")))
        await self.client.start_server()

    async def asyncTearDown(self):
        await self.client.close()
        self.data_dir.cleanup()

    async def create_project(self):
        response = await self.client.post("/studio/api/projects", json={"title": "Thử nghiệm"})
        self.assertEqual(response.status, 201)
        return await response.json()

    async def test_graph_survives_server_restart(self):
        project = await self.create_project()
        graph = {
            "nodes": [
                {"id": "prompt", "kind": "text", "x": 40, "y": 50, "text": "Một ngôi nhà"},
                {"id": "generate", "kind": "text-image", "x": 410, "y": 60},
            ],
            "edges": [{"id": "wire", "source": "prompt", "sourcePort": "text", "target": "generate", "targetPort": "prompt"}],
        }
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(response.status, 200)
        self.assertEqual((await response.json())["version"], 2)

        await self.client.close()
        self.client = TestClient(TestServer(create_app(self.data_dir.name, "http://127.0.0.1:9")))
        await self.client.start_server()
        response = await self.client.get(f"/studio/api/projects/{project['id']}")
        saved = await response.json()
        self.assertEqual(saved["graph"], graph)
        self.assertEqual(saved["version"], 2)

    async def test_rejects_wrong_port_and_cycle(self):
        project = await self.create_project()
        graph = {
            "nodes": [
                {"id": "image", "kind": "image", "x": 0, "y": 0},
                {"id": "generate", "kind": "text-image", "x": 350, "y": 0},
            ],
            "edges": [{"id": "wrong", "source": "image", "sourcePort": "image", "target": "generate", "targetPort": "prompt"}],
        }
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(response.status, 400)

        graph = {
            "nodes": [
                {"id": "a", "kind": "image-image", "x": 0, "y": 0},
                {"id": "b", "kind": "image-image", "x": 350, "y": 0},
            ],
            "edges": [
                {"id": "one", "source": "a", "sourcePort": "image", "target": "b", "targetPort": "source_image"},
                {"id": "two", "source": "b", "sourcePort": "image", "target": "a", "targetPort": "source_image"},
            ],
        }
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(response.status, 400)
        self.assertIn("vòng nối", (await response.json())["error"])

    async def test_conflict_and_malformed_graph(self):
        project = await self.create_project()
        empty = {"nodes": [], "edges": []}
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": empty})
        self.assertEqual(response.status, 200)
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": empty})
        self.assertEqual(response.status, 409)
        malformed = {"nodes": [{"id": "x", "kind": [], "x": 0, "y": 0}], "edges": []}
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 2, "graph": malformed})
        self.assertEqual(response.status, 400)

    async def test_asset_upload_and_source_reference_survive_restart(self):
        image = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=")
        form = FormData()
        form.add_field("file", image, filename="lake.png", content_type="application/octet-stream")
        response = await self.client.post("/studio/api/assets", data=form)
        self.assertEqual(response.status, 201)
        asset = await response.json()
        self.assertEqual(asset["kind"], "image")
        self.assertEqual(asset["mime"], "image/png")

        project = await self.create_project()
        graph = {"nodes": [{"id": "source", "kind": "image", "x": 0, "y": 0, "assetId": asset["id"]}], "edges": []}
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(response.status, 200)

        await self.client.close()
        self.client = TestClient(TestServer(create_app(self.data_dir.name, "http://127.0.0.1:9")))
        await self.client.start_server()
        response = await self.client.get(asset["url"])
        self.assertEqual(response.status, 200)
        self.assertEqual(response.headers["Content-Type"], "image/png")
        self.assertEqual(await response.read(), image)
        response = await self.client.get("/studio/api/assets")
        self.assertEqual((await response.json())["items"][0]["id"], asset["id"])
        response = await self.client.get(f"/studio/api/projects/{project['id']}")
        self.assertEqual((await response.json())["graph"], graph)

        wrong = {"nodes": [{"id": "source", "kind": "video", "x": 0, "y": 0, "assetId": asset["id"]}], "edges": []}
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 2, "graph": wrong})
        self.assertEqual(response.status, 400)

    async def test_unsupported_file_is_not_saved(self):
        form = FormData()
        form.add_field("file", b"not an image", filename="fake.png", content_type="image/png")
        response = await self.client.post("/studio/api/assets", data=form)
        self.assertEqual(response.status, 400)
        response = await self.client.get("/studio/api/assets")
        self.assertEqual((await response.json())["items"], [])

    async def test_wav_audio_asset_and_3d_generator_graph(self):
        wav_bytes = b"RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
        form = FormData()
        form.add_field("file", wav_bytes, filename="voiceover.wav", content_type="audio/wav")
        response = await self.client.post("/studio/api/assets", data=form)
        self.assertEqual(response.status, 201)
        asset = await response.json()
        self.assertEqual(asset["kind"], "audio")
        self.assertEqual(asset["mime"], "audio/wav")

        project = await self.create_project()
        graph = {
            "nodes": [
                {"id": "vo", "kind": "voiceover", "x": 40, "y": 40, "assetId": asset["id"], "audioUrl": asset["url"]},
                {
                    "id": "mesh3d",
                    "kind": "3d-generator",
                    "x": 420,
                    "y": 40,
                    "prompt": "short soft cat fur, white fur on face blaze, dark grey tabby fur on back saddle and tail",
                    "renderMode3d": "Shaded PBR",
                    "topology": "Quad",
                    "targetPolycount": 10000,
                    "sketchBackDetails": True,
                },
            ],
            "edges": [],
        }
        put_res = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(put_res.status, 200)

        run_3d_res = await self.client.post(
            "/studio/api/runs",
            json={"projectId": project["id"], "nodeId": "mesh3d", "version": 2},
        )
        self.assertEqual(run_3d_res.status, 201)
        run_3d_data = await run_3d_res.json()
        self.assertEqual(run_3d_data["state"], "succeeded")
        self.assertTrue(run_3d_data.get("glbAsset"))
        self.assertEqual(run_3d_data["glbAsset"]["kind"], "model3d")
        self.assertEqual(run_3d_data["glbAsset"]["mime"], "model/gltf-binary")

        glb_resp = await self.client.get(run_3d_data["glbAsset"]["url"])
        self.assertEqual(glb_resp.status, 200)
        self.assertEqual(glb_resp.headers["Content-Type"], "model/gltf-binary")
        glb_bytes = await glb_resp.read()
        self.assertTrue(glb_bytes.startswith(b"glTF"))
        self.assertGreater(len(glb_bytes), 4096)

    async def test_local_fallback_generates_png_when_comfy_offline(self):
        project = await self.create_project()
        graph = {
            "nodes": [
                {"id": "gen", "kind": "text-image", "x": 100, "y": 100, "prompt": "Cute chibi mage in starry robe", "width": 512, "height": 512},
                {"id": "up", "kind": "upscaler", "x": 520, "y": 100},
            ],
            "edges": [{"id": "e1", "source": "gen", "sourcePort": "image", "target": "up", "targetPort": "source_image"}],
        }
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(response.status, 200)

        run_resp = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "gen", "version": 2})
        self.assertEqual(run_resp.status, 201)
        run_data = await run_resp.json()
        self.assertEqual(run_data["state"], "succeeded")
        self.assertTrue(run_data["assetId"])

        img_resp = await self.client.get(f"/studio/api/assets/{run_data['assetId']}/content")
        self.assertEqual(img_resp.status, 200)
        img_bytes = await img_resp.read()
        self.assertTrue(img_bytes.startswith(b"\x89PNG\r\n\x1a\n"))

        up_resp = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "up", "version": 2})
        self.assertEqual(up_resp.status, 201)
        up_data = await up_resp.json()
        self.assertEqual(up_data["state"], "succeeded")
        self.assertTrue(up_data["assetId"])

    async def test_video_start_end_combiner_and_media_extractor(self):
        project = await self.create_project()
        graph = {
            "nodes": [
                {"id": "img_start", "kind": "text-image", "x": 0, "y": 0, "prompt": "Sunrise mountain peak"},
                {"id": "img_end", "kind": "text-image", "x": 0, "y": 300, "prompt": "Starry night mountain peak"},
                {"id": "vgen", "kind": "text-video", "x": 400, "y": 150, "prompt": "Smooth day to night transition", "duration": "3s"},
                {"id": "vcomb", "kind": "video-combiner", "x": 800, "y": 150},
                {"id": "vext", "kind": "media-extractor", "x": 1200, "y": 150, "frameTime": 1.0, "trimStart": "00:00", "trimEnd": "00:02"},
                {"id": "out_frame", "kind": "image", "x": 1600, "y": 80},
            ],
            "edges": [
                {"id": "e1", "source": "img_start", "sourcePort": "image", "target": "vgen", "targetPort": "start_image"},
                {"id": "e2", "source": "img_end", "sourcePort": "image", "target": "vgen", "targetPort": "end_image"},
                {"id": "e3", "source": "vgen", "sourcePort": "video", "target": "vcomb", "targetPort": "video"},
                {"id": "e4", "source": "vcomb", "sourcePort": "video", "target": "vext", "targetPort": "source_video"},
                {"id": "e5", "source": "vext", "sourcePort": "image", "target": "out_frame", "targetPort": "image"},
            ],
        }
        put_res = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(put_res.status, 200)

        for nid in ("img_start", "img_end"):
            r = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": nid, "version": 2})
            self.assertEqual(r.status, 201)

        v_res = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "vgen", "version": 2})
        self.assertEqual(v_res.status, 201)
        v_data = await v_res.json()
        self.assertEqual(v_data["state"], "succeeded")
        self.assertTrue(v_data["snapshot"].get("sourceAssetId"))
        self.assertTrue(v_data["snapshot"].get("endAssetId"))
        self.assertTrue(v_data["snapshot"].get("firstFrameAssetId"))
        self.assertTrue(v_data["snapshot"].get("lastFrameAssetId"))

        comb_res = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "vcomb", "version": 2})
        self.assertEqual(comb_res.status, 201)
        comb_data = await comb_res.json()
        self.assertEqual(comb_data["state"], "succeeded")
        self.assertTrue(comb_data["assetId"])

        ext_res = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "vext", "version": 2})
        self.assertEqual(ext_res.status, 201)
        ext_data = await ext_res.json()
        self.assertEqual(ext_data["state"], "succeeded")
        ext_frame_id = ext_data["snapshot"].get("extractedFrameAssetId")
        self.assertTrue(ext_frame_id)

        proj_after = await (await self.client.get(f"/studio/api/projects/{project['id']}")).json()
        out_node = next((n for n in proj_after["graph"]["nodes"] if n["id"] == "out_frame"), None)
        self.assertEqual(out_node["assetId"], ext_frame_id)


class StudioRunnerTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.data_dir = tempfile.TemporaryDirectory()
        self.image = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=")
        self.submitted = None
        self.uploaded = None
        self.complete = True
        worker = web.Application()

        async def object_info(request):
            return web.json_response({"CheckpointLoaderSimple": {"input": {"required": {"ckpt_name": [["test.safetensors"]]}}}})

        async def submit(request):
            self.submitted = await request.json()
            return web.json_response({"prompt_id": self.submitted["prompt_id"]})

        async def history(request):
            prompt_id = request.match_info["prompt_id"]
            if self.complete and self.submitted and prompt_id == self.submitted["prompt_id"]:
                save_node = "8" if "8" in self.submitted["prompt"] else "7"
                return web.json_response({prompt_id: {"status": {"status_str": "success"}, "outputs": {save_node: {"images": [{"filename": "test.png", "subfolder": "", "type": "output"}]}}}})
            return web.json_response({})

        async def upload_image(request):
            reader = await request.multipart()
            field = await reader.next()
            self.uploaded = {"name": field.filename, "body": await field.read()}
            return web.json_response({"name": field.filename, "subfolder": "", "type": "input"})

        async def queue(request):
            pending = [[0, self.submitted["prompt_id"]]] if self.submitted and not self.complete else []
            return web.json_response({"queue_running": [], "queue_pending": pending})

        async def view(request):
            return web.Response(body=self.image, content_type="image/png")

        worker.router.add_get("/object_info/CheckpointLoaderSimple", object_info)
        worker.router.add_post("/prompt", submit)
        worker.router.add_post("/upload/image", upload_image)
        worker.router.add_get("/history/{prompt_id}", history)
        worker.router.add_get("/queue", queue)
        worker.router.add_get("/view", view)
        self.worker = TestServer(worker)
        await self.worker.start_server()
        self.client = TestClient(TestServer(create_app(self.data_dir.name, str(self.worker.make_url("/")))))
        await self.client.start_server()

    async def asyncTearDown(self):
        await self.client.close()
        await self.worker.close()
        self.data_dir.cleanup()

    async def test_text_image_run_saves_result(self):
        output_dir = Path(self.data_dir.name) / "chosen-results"
        output_dir.mkdir()
        response = await self.client.put("/studio/api/settings/storage", json={"resultDir": str(output_dir)})
        self.assertEqual(response.status, 200)
        self.assertEqual((await response.json())["resultDir"], str(output_dir))
        response = await self.client.post("/studio/api/projects", json={"title": "Run test"})
        project = await response.json()
        graph = {
            "nodes": [
                {"id": "text", "kind": "text", "x": 0, "y": 0, "text": "A lake house"},
                {"id": "image", "kind": "text-image", "x": 380, "y": 0, "model": "test.safetensors", "width": 512, "height": 512, "steps": 4, "seed": 42, "cfg": 7},
            ],
            "edges": [{"id": "edge", "source": "text", "sourcePort": "text", "target": "image", "targetPort": "prompt"}],
        }
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(response.status, 200)
        response = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "image", "version": 2})
        self.assertEqual(response.status, 201)
        run = await response.json()
        self.assertEqual(self.submitted["prompt"]["1"]["class_type"], "CheckpointLoaderSimple")
        self.assertEqual(self.submitted["prompt"]["2"]["inputs"]["text"], "A lake house")
        self.assertEqual(self.submitted["prompt"]["7"]["class_type"], "SaveImage")
        for _ in range(20):
            response = await self.client.get(f"/studio/api/runs/{run['id']}")
            run = await response.json()
            if run["state"] == "succeeded":
                break
            await asyncio.sleep(0.1)
        self.assertEqual(run["state"], "succeeded")
        self.assertTrue((output_dir / f"{run['assetId']}.png").is_file())
        proj_after = await (await self.client.get(f"/studio/api/projects/{project['id']}")).json()
        gen_node = next((n for n in proj_after["graph"]["nodes"] if n["id"] == "image"), None)
        self.assertIsNotNone(gen_node)
        self.assertEqual(gen_node["assetId"], run["assetId"])
        prod_node = next((n for n in proj_after["graph"]["nodes"] if n["id"] == "prod-image"), None)
        self.assertIsNone(prod_node)
        response = await self.client.get(f"/studio/api/assets/{run['assetId']}/content")
        self.assertEqual(await response.read(), self.image)
        response = await self.client.put("/studio/api/settings/storage", json={"resultDir": None})
        self.assertFalse((await response.json())["custom"])
        response = await self.client.get(f"/studio/api/assets/{run['assetId']}/content")
        self.assertEqual(await response.read(), self.image)

        await self.client.close()
        self.client = TestClient(TestServer(create_app(self.data_dir.name, str(self.worker.make_url("/")))))
        await self.client.start_server()
        response = await self.client.get(f"/studio/api/runs/{run['id']}")
        self.assertEqual((await response.json())["state"], "succeeded")

    async def test_pending_run_resumes_after_studio_restart(self):
        self.complete = False
        output_dir = Path(self.data_dir.name) / "pending-results"
        output_dir.mkdir()
        await self.client.put("/studio/api/settings/storage", json={"resultDir": str(output_dir)})
        response = await self.client.post("/studio/api/projects", json={"title": "Pending"})
        project = await response.json()
        graph = {"nodes": [{"id": "text", "kind": "text", "x": 0, "y": 0, "text": "A tree"}, {"id": "task", "kind": "text-image", "x": 350, "y": 0, "model": "test.safetensors"}], "edges": [{"id": "wire", "source": "text", "sourcePort": "text", "target": "task", "targetPort": "prompt"}]}
        await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        response = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "task", "version": 2})
        run = await response.json()
        self.assertEqual(run["state"], "queued")
        await self.client.put("/studio/api/settings/storage", json={"resultDir": None})
        await self.client.close()
        self.complete = True
        self.client = TestClient(TestServer(create_app(self.data_dir.name, str(self.worker.make_url("/")))))
        await self.client.start_server()
        for _ in range(20):
            response = await self.client.get(f"/studio/api/runs/{run['id']}")
            run = await response.json()
            if run["state"] == "succeeded":
                break
            await asyncio.sleep(0.1)
        self.assertEqual(run["state"], "succeeded")
        self.assertTrue((output_dir / f"{run['assetId']}.png").is_file())

    async def test_run_requires_connected_text_source(self):
        response = await self.client.post("/studio/api/projects", json={"title": "Missing prompt"})
        project = await response.json()
        graph = {"nodes": [{"id": "task", "kind": "text-image", "x": 0, "y": 0, "model": "test.safetensors"}], "edges": []}
        await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        response = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "task", "version": 2})
        self.assertEqual(response.status, 400)
        self.assertIn("Văn bản", (await response.json())["error"])
        self.assertIsNone(self.submitted)

    async def test_direct_prompt_and_connected_prompt_precedence(self):
        project = await (await self.client.post("/studio/api/projects", json={"title": "Card prompt"})).json()
        graph = {"nodes": [{"id": "task", "kind": "text-image", "x": 350, "y": 0, "model": "test.safetensors", "prompt": "A blue bird"}], "edges": []}
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(response.status, 200)
        response = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "task", "version": 2})
        self.assertEqual(response.status, 201)
        self.assertEqual((await response.json())["snapshot"]["prompt"], "A blue bird")
        self.assertEqual(self.submitted["prompt"]["2"]["inputs"]["text"], "A blue bird")

        graph["nodes"].insert(0, {"id": "text", "kind": "text", "x": 0, "y": 0, "text": "A red bird"})
        graph["edges"].append({"id": "wire", "source": "text", "sourcePort": "text", "target": "task", "targetPort": "prompt"})
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 2, "graph": graph})
        self.assertEqual(response.status, 200)
        response = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "task", "version": 3})
        self.assertEqual(response.status, 201)
        self.assertEqual((await response.json())["snapshot"]["prompt"], "A red bird")
        self.assertEqual(self.submitted["prompt"]["2"]["inputs"]["text"], "A red bird")

    async def test_image_image_uploads_source_to_comfy_input(self):
        form = FormData()
        form.add_field("file", self.image, filename="source.png", content_type="image/png")
        response = await self.client.post("/studio/api/assets", data=form)
        asset = await response.json()
        response = await self.client.post("/studio/api/projects", json={"title": "Image edit"})
        project = await response.json()
        graph = {"nodes": [{"id": "source", "kind": "image", "x": 0, "y": 0, "assetId": asset["id"]}, {"id": "edit", "kind": "image-image", "x": 350, "y": 0, "model": "test.safetensors", "denoise": 0.5}], "edges": [{"id": "wire", "source": "source", "sourcePort": "image", "target": "edit", "targetPort": "source_image"}]}
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(response.status, 200)
        response = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "edit", "version": 2})
        self.assertEqual(response.status, 201)
        run = await response.json()
        self.assertEqual(self.uploaded["body"], self.image)
        self.assertEqual(self.submitted["prompt"]["4"]["inputs"]["image"], self.uploaded["name"])
        self.assertEqual(self.submitted["prompt"]["6"]["inputs"]["denoise"], 0.5)
        for _ in range(20):
            response = await self.client.get(f"/studio/api/runs/{run['id']}")
            run = await response.json()
            if run["state"] == "succeeded":
                break
            await asyncio.sleep(0.1)
        self.assertEqual(run["state"], "succeeded")

    async def test_chained_generators_and_upscaler_and_multi_edge_graph(self):
        project = await (await self.client.post("/studio/api/projects", json={"title": "Chained flow"})).json()
        graph = {
            "nodes": [
                {"id": "asst", "kind": "assistant", "x": 0, "y": 0, "text": "1. Hero portrait\n2. Cyberpunk street"},
                {
                    "id": "list1",
                    "kind": "list",
                    "x": 300,
                    "y": 0,
                    "items": [{"type": "text", "text": "Hero portrait"}, {"type": "text", "text": "Cyberpunk street"}],
                },
                {"id": "gen1", "kind": "text-image", "x": 600, "y": 0, "model": "test.safetensors", "extraPrompt": "@CyberHero"},
                {"id": "edit1", "kind": "image-image", "x": 960, "y": 0, "model": "test.safetensors", "prompt": "relight golden hour"},
                {"id": "up1", "kind": "upscaler", "x": 1320, "y": 0, "model": "test.safetensors"},
                {"id": "v1", "kind": "text-video", "x": 0, "y": 400},
                {"id": "v2", "kind": "image-video", "x": 0, "y": 700},
                {"id": "comb", "kind": "video-combiner", "x": 450, "y": 550},
            ],
            "edges": [
                {"id": "e1", "source": "asst", "sourcePort": "text", "target": "list1", "targetPort": "text"},
                {"id": "e2", "source": "list1", "sourcePort": "text", "target": "gen1", "targetPort": "prompt"},
                {"id": "e3", "source": "gen1", "sourcePort": "image", "target": "edit1", "targetPort": "source_image"},
                {"id": "e4", "source": "edit1", "sourcePort": "image", "target": "up1", "targetPort": "source_image"},
                {"id": "e5", "source": "v1", "sourcePort": "video", "target": "comb", "targetPort": "video"},
                {"id": "e6", "source": "v2", "sourcePort": "video", "target": "comb", "targetPort": "video"},
            ],
        }
        response = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(response.status, 200)

        # 1. Run gen1 with promptOverride (simulating Batch run from List)
        res1 = await self.client.post(
            "/studio/api/runs",
            json={"projectId": project["id"], "nodeId": "gen1", "version": 2, "promptOverride": "Cyberpunk street, @CyberHero"},
        )
        self.assertEqual(res1.status, 201)
        run1 = await res1.json()
        self.assertIn("Cyberpunk street", run1["snapshot"]["prompt"])
        self.assertIn("@CyberHero", run1["snapshot"]["prompt"])
        for _ in range(20):
            r = await (await self.client.get(f"/studio/api/runs/{run1['id']}")).json()
            if r["state"] == "succeeded":
                break
            await asyncio.sleep(0.05)

        # 2. Run edit1 chained directly from gen1 output
        res2 = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "edit1", "version": 2})
        self.assertEqual(res2.status, 201)
        run2 = await res2.json()
        for _ in range(20):
            r = await (await self.client.get(f"/studio/api/runs/{run2['id']}")).json()
            if r["state"] == "succeeded":
                break
            await asyncio.sleep(0.05)

        # 3. Run upscaler chained directly from edit1 output
        res3 = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "up1", "version": 2})
        self.assertEqual(res3.status, 201)
        run3 = await res3.json()
        self.assertEqual(run3["snapshot"]["denoise"], 0.28)

    async def test_model_settings_and_strict_model_routing(self):
        put_res = await self.client.put(
            "/studio/api/settings/models",
            json={
                "models": {
                    "Google Nano Banana 2.1": {"apiKey": "key-img-banana", "kind": "image"},
                    "Seedream 5 Pro": {"apiKey": "key-img-seedream", "kind": "image"},
                    "Kling 3.0": {"apiKey": "key-vid-kling", "kind": "video"},
                }
            },
        )
        self.assertEqual(put_res.status, 200)
        saved = (await put_res.json())["models"]
        self.assertIn("Google Nano Banana 2.1", saved)
        self.assertIn("Seedream 5 Pro", saved)
        self.assertIn("Kling 3.0", saved)

        get_res = await self.client.get("/studio/api/settings/models")
        self.assertEqual(get_res.status, 200)
        self.assertEqual((await get_res.json())["models"]["Kling 3.0"]["kind"], "video")

        project = await (await self.client.post("/studio/api/projects", json={"title": "Strict Routing"})).json()
        graph = {
            "nodes": [
                {"id": "img_unconf", "kind": "text-image", "x": 0, "y": 0, "model": "Flux.2 Max", "prompt": "A cat"},
                {"id": "img_wrong_kind", "kind": "text-image", "x": 0, "y": 200, "model": "Kling 3.0", "prompt": "A cat"},
                {"id": "img_ok", "kind": "text-image", "x": 0, "y": 400, "model": "Google Nano Banana 2.1", "prompt": "A cat"},
            ],
            "edges": [],
        }
        await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})

        bad1 = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "img_unconf", "version": 2})
        self.assertEqual(bad1.status, 400)
        self.assertIn("chưa được cấu hình API Key", (await bad1.json())["error"])

        bad2 = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "img_wrong_kind", "version": 2})
        self.assertEqual(bad2.status, 400)

        ok = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "img_ok", "version": 2})
        self.assertEqual(ok.status, 201)
        run_ok = await ok.json()
        self.assertEqual(run_ok["snapshot"]["model"], "Google Nano Banana 2.1")

    async def test_chained_prompt_mention_img2img_and_variations_split_assets(self):
        from studio.app import run_snapshot

        png_1x1 = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
            b"\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0"
            b"\x00\x00\x03\x01\x01\x00\x18\xdd\x8d\xb0\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        data = FormData()
        data.add_field("file", png_1x1, filename="creation1.png", content_type="image/png")
        upload_resp = await self.client.post("/studio/api/assets", data=data)
        self.assertEqual(upload_resp.status, 201)
        source_asset = await upload_resp.json()
        source_asset_id = source_asset["id"]

        cfg_resp = await self.client.put(
            "/studio/api/settings/models",
            json={"models": {"Nano Banana 2": {"apiKey": "sk-test-nb2-valid-key", "kind": "image"}}},
        )
        self.assertEqual(cfg_resp.status, 200)

        project = await (await self.client.post("/studio/api/projects", json={"title": "Img2Img Dual Flow"})).json()
        graph = {
            "nodes": [
                {
                    "id": "src1",
                    "kind": "image",
                    "customTitle": "Creation #1",
                    "assetId": source_asset_id,
                    "x": 80,
                    "y": 120,
                },
                {
                    "id": "gen1",
                    "kind": "text-image",
                    "presetLabel": "Nano Banana 2",
                    "prompt": "cho cô gái @Creation #1 đứng vào trong căn phòng sang trọng",
                    "width": 1376,
                    "height": 768,
                    "x": 420,
                    "y": 120,
                },
                {
                    "id": "gen2",
                    "kind": "text-image",
                    "presetLabel": "Nano Banana 2",
                    "prompt": "hãy chỉ giữ lại mình căn phòng bỏ cô gái ra ngoài",
                    "width": 1376,
                    "height": 768,
                    "x": 820,
                    "y": 120,
                },
                {
                    "id": "var1",
                    "kind": "image-image",
                    "subKind": "variations",
                    "presetLabel": "Nano Banana 2",
                    "variationMode": "Custom",
                    "variationRes": "2K",
                    "variationGrid": "3x3",
                    "splitImages": True,
                    "prompt": "thay đổi trang phục phù hợp với độ tuổi nhân vật",
                    "width": 768,
                    "height": 1376,
                    "x": 420,
                    "y": 420,
                },
            ],
            "edges": [
                {
                    "id": "e1",
                    "source": "src1",
                    "sourcePort": "image",
                    "target": "gen1",
                    "targetPort": "reference_image",
                },
                {
                    "id": "e2",
                    "source": "gen1",
                    "sourcePort": "image",
                    "target": "gen2",
                    "targetPort": "reference_image",
                },
                {
                    "id": "e3",
                    "source": "src1",
                    "sourcePort": "image",
                    "target": "var1",
                    "targetPort": "source_image",
                },
            ],
        }
        put_graph = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(put_graph.status, 200)

        snap_gen1 = run_snapshot(graph, "gen1")
        self.assertEqual(snap_gen1["sourceAssetId"], source_asset_id)
        self.assertNotIn("@Creation #1", snap_gen1["prompt"])
        self.assertIn("@Creation #1", snap_gen1["rawPrompt"])
        self.assertEqual(snap_gen1["width"], 1376)
        self.assertEqual(snap_gen1["height"], 768)
        self.assertEqual(snap_gen1["denoise"], 0.72)

        graph["nodes"][1]["assetId"] = source_asset_id
        snap_gen2 = run_snapshot(graph, "gen2")
        self.assertEqual(snap_gen2["sourceAssetId"], source_asset_id)
        self.assertEqual(snap_gen2["denoise"], 0.65)

        run_var_resp = await self.client.post(
            "/studio/api/runs",
            json={"projectId": project["id"], "nodeId": "var1", "version": 2},
        )
        self.assertEqual(run_var_resp.status, 201)
        run_var_init = await run_var_resp.json()
        run_var = run_var_init
        for _ in range(25):
            run_var = await (await self.client.get(f"/studio/api/runs/{run_var_init['id']}")).json()
            if run_var["state"] == "succeeded":
                break
            await asyncio.sleep(0.05)

        self.assertEqual(run_var["state"], "succeeded")
        self.assertEqual(run_var["snapshot"]["tileWidth"], 512)
        self.assertEqual(run_var["snapshot"]["tileHeight"], 917)
        self.assertEqual(len(run_var["snapshot"]["variationItems"]), 9)
        split_assets = run_var["snapshot"].get("splitAssets") or []
        self.assertEqual(len(split_assets), 9)
        self.assertEqual(split_assets[0]["width"], 512)
        self.assertEqual(split_assets[0]["height"], 917)

        # Stage 1: Move var1 to trash -> files remain on disk while in trash
        var_asset_id = run_var["assetId"]
        first_tile_id = split_assets[0]["assetId"]
        content_before = await self.client.get(f"/studio/api/assets/{var_asset_id}/content")
        self.assertEqual(content_before.status, 200)

        # Stage 2: Permanent purge from trash -> deletes physical files & DB rows
        purge_resp = await self.client.post(
            "/studio/api/trash/purge",
            json={"nodeIds": ["var1"], "assetIds": [var_asset_id], "runIds": [run_var["id"]]},
        )
        self.assertEqual(purge_resp.status, 200)
        purge_data = await purge_resp.json()
        self.assertTrue(purge_data["ok"])
        self.assertGreaterEqual(purge_data["deletedAssets"], 10)

        content_after = await self.client.get(f"/studio/api/assets/{var_asset_id}/content")
        self.assertEqual(content_after.status, 404)
        tile_after = await self.client.get(f"/studio/api/assets/{first_tile_id}/content")
        self.assertEqual(tile_after.status, 404)

    async def test_image_upscaler_run_and_bridge_model(self):
        project = await (await self.client.post("/studio/api/projects", json={"title": "Upscaler Test"})).json()
        buf = io.BytesIO()
        Image.new("RGB", (256, 256), (48, 120, 210)).save(buf, format="PNG")
        form = FormData()
        form.add_field("file", buf.getvalue(), filename="src256.png", content_type="image/png")
        asset = await (await self.client.post(f"/studio/api/assets?project_id={project['id']}", data=form)).json()

        await self.client.put(
            "/studio/api/settings/models",
            json={"models": {"Google Nano Banana 2.1": {"apiKey": "test-key-123", "kind": "image", "enabled": True}}},
        )

        graph = {
            "nodes": [
                {"id": "img1", "kind": "image", "assetId": asset["id"], "x": 100, "y": 100},
                {
                    "id": "up1",
                    "kind": "upscaler",
                    "upscaleMode": "Creative (Hallucination)",
                    "upscaleModel": "Antigravity AI Bridge",
                    "scaleFactor": 4,
                    "upscaleFlavor": "Ultra Detailed",
                    "x": 480,
                    "y": 100,
                },
            ],
            "edges": [
                {"id": "e1", "source": "img1", "sourcePort": "image", "target": "up1", "targetPort": "source_image"}
            ],
        }
        put_resp = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(put_resp.status, 200)

        run_resp = await self.client.post(
            "/studio/api/runs",
            json={"projectId": project["id"], "nodeId": "up1", "version": 2},
        )
        self.assertEqual(run_resp.status, 201)
        run_data = await run_resp.json()
        self.assertEqual(run_data["state"], "succeeded")
        self.assertEqual(run_data["snapshot"]["subKind"], "upscaler")
        self.assertEqual(run_data["snapshot"]["upscaleModel"], "Antigravity AI Bridge")
        self.assertEqual(run_data["snapshot"]["scaleFactor"], 4)
        self.assertEqual(run_data["snapshot"]["sourceWidth"], 256)
        self.assertEqual(run_data["snapshot"]["sourceHeight"], 256)
        self.assertEqual(run_data["snapshot"]["width"], 1024)
        self.assertEqual(run_data["snapshot"]["height"], 1024)
        self.assertTrue(run_data["snapshot"].get("bridgeCompleted"))

    async def test_nine_video_branches_end_to_end(self):
        project = await (await self.client.post("/studio/api/projects", json={"title": "Nine Video Branches Test"})).json()
        buf = io.BytesIO()
        Image.new("RGB", (320, 180), (40, 110, 200)).save(buf, format="PNG")
        form = FormData()
        form.add_field("file", buf.getvalue(), filename="start320.png", content_type="image/png")
        img_asset = await (await self.client.post(f"/studio/api/assets?project_id={project['id']}", data=form)).json()

        graph = {
            "nodes": [
                {"id": "img1", "kind": "image", "assetId": img_asset["id"], "x": 0, "y": 0},
                {
                    "id": "vgen",
                    "kind": "text-video",
                    "prompt": "Cyberpunk street scene",
                    "videoModel": "Wan 2.6",
                    "videoRatio": "16:9",
                    "duration": "2s",
                    "videoRes": "720p",
                    "width": 320,
                    "height": 256,
                    "soundEffects": True,
                    "x": 300,
                    "y": 0,
                },
                {
                    "id": "vext",
                    "kind": "extend-video",
                    "prompt": "Camera pans up to neon skyline",
                    "duration": "2s",
                    "generateAudio": True,
                    "x": 650,
                    "y": 0,
                },
                {
                    "id": "vmod",
                    "kind": "modify-video",
                    "prompt": "Cyberpunk anime style",
                    "videoModel": "MiniMax H3",
                    "videoRes": "768p",
                    "x": 650,
                    "y": 300,
                },
                {
                    "id": "vmove",
                    "kind": "move",
                    "prompt": "3D parallax product orbit",
                    "moveStyle": "3D Parallax Orbit",
                    "videoRatio": "16:9",
                    "duration": "2s",
                    "videoRes": "720p",
                    "width": 320,
                    "height": 256,
                    "x": 300,
                    "y": 300,
                },
                {
                    "id": "vsfx",
                    "kind": "video-sfx",
                    "prompt": "Sci-fi synth whoosh and rain",
                    "sfxStyle": "Sci-Fi Synth",
                    "x": 1000,
                    "y": 0,
                },
                {
                    "id": "vext_media",
                    "kind": "media-extractor",
                    "trimStart": "00:00",
                    "trimEnd": "00:02",
                    "frameTime": 0.5,
                    "x": 1000,
                    "y": 300,
                },
                {
                    "id": "vcomb",
                    "kind": "video-combiner",
                    "transition": "Crossfade",
                    "x": 1350,
                    "y": 0,
                },
                {
                    "id": "vup",
                    "kind": "video-upscaler",
                    "videoRes": "1080p",
                    "upscaleDetail": "Crisp",
                    "scaleFactor": 2,
                    "fps": "30fps",
                    "x": 1350,
                    "y": 300,
                },
                {
                    "id": "vspk",
                    "kind": "speak",
                    "prompt": "Hello from Studio avatar",
                    "speakModel": "OmniHuman 1.5",
                    "videoRes": "720p",
                    "duration": "2s",
                    "width": 320,
                    "height": 256,
                    "x": 1700,
                    "y": 0,
                },
                {
                    "id": "asst1",
                    "kind": "assistant",
                    "prompt": "Analyze the connected video",
                    "x": 1700,
                    "y": 300,
                },
            ],
            "edges": [
                {"id": "e1", "source": "img1", "sourcePort": "image", "target": "vgen", "targetPort": "start_image"},
                {"id": "e2", "source": "vgen", "sourcePort": "video", "target": "vext", "targetPort": "source_video"},
                {"id": "e3", "source": "vgen", "sourcePort": "video", "target": "vmod", "targetPort": "source_video"},
                {"id": "e4", "source": "img1", "sourcePort": "image", "target": "vmod", "targetPort": "references"},
                {"id": "e5", "source": "img1", "sourcePort": "image", "target": "vmove", "targetPort": "source_image"},
                {"id": "e6", "source": "vgen", "sourcePort": "video", "target": "vsfx", "targetPort": "source_video"},
                {"id": "e7", "source": "vgen", "sourcePort": "video", "target": "vext_media", "targetPort": "source_video"},
                {"id": "e8", "source": "vgen", "sourcePort": "video", "target": "vcomb", "targetPort": "video"},
                {"id": "e9", "source": "vmove", "sourcePort": "video", "target": "vcomb", "targetPort": "video"},
                {"id": "e10", "source": "vgen", "sourcePort": "video", "target": "vup", "targetPort": "source_video"},
                {"id": "e11", "source": "vgen", "sourcePort": "video", "target": "vspk", "targetPort": "source_video"},
                {"id": "e12", "source": "vsfx", "sourcePort": "audio", "target": "vspk", "targetPort": "audio"},
                {"id": "e13", "source": "vgen", "sourcePort": "video", "target": "asst1", "targetPort": "video_in"},
            ],
        }
        put_resp = await self.client.put(
            f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph}
        )
        self.assertEqual(put_resp.status, 200)
        cur_version = 2

        for node_id in ["vgen", "vext", "vmod", "vmove", "vsfx", "vext_media", "vcomb", "vup", "vspk"]:
            run_resp = await self.client.post(
                "/studio/api/runs",
                json={"projectId": project["id"], "nodeId": node_id, "version": cur_version},
            )
            self.assertEqual(run_resp.status, 201, f"Failed on {node_id}: {await run_resp.text()}")
            run_data = await run_resp.json()
            self.assertEqual(run_data["state"], "succeeded", f"Node {node_id} did not succeed: {run_data}")
            self.assertTrue(run_data.get("assetId"), f"Node {node_id} missing assetId")
            self.assertEqual(run_data["asset"]["kind"], "video")
            if node_id in ("vgen", "vext", "vsfx", "vext_media"):
                self.assertTrue(run_data["snapshot"].get("audioAssetId"), f"Node {node_id} missing audioAssetId")
            if node_id == "vext_media":
                self.assertTrue(run_data["snapshot"].get("extractedFrameAssetId"))
            proj_now = await (await self.client.get(f"/studio/api/projects/{project['id']}")).json()
            cur_version = proj_now["version"]


class StudioGraphLogicTests(unittest.TestCase):
    def test_catalog_and_multi_edge_and_snapshots(self):
        from studio.app import CATALOG, run_snapshot, validate_graph

        self.assertGreaterEqual(len(CATALOG), 22)
        graph = {
            "nodes": [
                {"id": "asst", "kind": "assistant", "x": 0, "y": 0, "text": "1. Hero portrait"},
                {"id": "list1", "kind": "list", "x": 300, "y": 0, "items": [{"type": "text", "text": "Hero portrait"}]},
                {"id": "gen1", "kind": "text-image", "x": 600, "y": 0, "model": "test.safetensors", "extraPrompt": "@CyberHero"},
                {"id": "img1", "kind": "image", "x": 600, "y": 300, "assetId": "asset-123"},
                {"id": "edit1", "kind": "image-image", "x": 960, "y": 0, "model": "test.safetensors", "editorTool": "Change camera angle", "camRotate": 45},
                {"id": "up1", "kind": "upscaler", "x": 1320, "y": 0, "model": "test.safetensors"},
                {"id": "v1", "kind": "text-video", "x": 0, "y": 400},
                {"id": "v2", "kind": "image-video", "x": 0, "y": 700},
                {"id": "comb", "kind": "video-combiner", "x": 450, "y": 550},
            ],
            "edges": [
                {"id": "e1", "source": "asst", "sourcePort": "text", "target": "list1", "targetPort": "text"},
                {"id": "e2", "source": "list1", "sourcePort": "text", "target": "gen1", "targetPort": "prompt"},
                {"id": "e3", "source": "img1", "sourcePort": "image", "target": "edit1", "targetPort": "source_image"},
                {"id": "e4", "source": "img1", "sourcePort": "image", "target": "up1", "targetPort": "source_image"},
                {"id": "e5", "source": "v1", "sourcePort": "video", "target": "comb", "targetPort": "video"},
                {"id": "e6", "source": "v2", "sourcePort": "video", "target": "comb", "targetPort": "video"},
            ],
        }
        self.assertIsNone(validate_graph(graph))

        snap_gen = run_snapshot(graph, "gen1")
        self.assertEqual(snap_gen["prompt"], "Hero portrait, @CyberHero")

        snap_edit = run_snapshot(graph, "edit1")
        self.assertEqual(snap_edit["sourceAssetId"], "asset-123")
        self.assertIn("horizontal rotation 45 deg", snap_edit["prompt"])

        snap_up = run_snapshot(graph, "up1")
        self.assertEqual(snap_up["sourceAssetId"], "asset-123")
        self.assertEqual(snap_up["denoise"], 0.28)

    def test_text_img_video_multi_list_batch_workflow(self):
        from studio.app import run_snapshot, validate_graph

        graph = {
            "nodes": [
                {
                    "id": "list1",
                    "kind": "list",
                    "x": 0,
                    "y": 0,
                    "items": [{"type": "text", "text": "Tokyo"}, {"type": "text", "text": "Paris"}],
                },
                {
                    "id": "list2",
                    "kind": "list",
                    "x": 0,
                    "y": 300,
                    "items": [{"type": "text", "text": "Cyberpunk"}, {"type": "text", "text": "Baroque"}],
                },
                {
                    "id": "txt1",
                    "kind": "text",
                    "x": 350,
                    "y": 150,
                    "text": "City of @List #1 in @List #2 aesthetic",
                },
                {
                    "id": "imggen1",
                    "kind": "text-image",
                    "x": 700,
                    "y": 150,
                    "model": "test.safetensors",
                    "listMode": True,
                },
                {
                    "id": "list3",
                    "kind": "list",
                    "x": 1050,
                    "y": 150,
                    "items": [{"type": "image", "assetId": "asset-img-1", "selected": True}],
                },
                {
                    "id": "vidgen1",
                    "kind": "text-video",
                    "x": 1400,
                    "y": 150,
                    "videoModel": "Kling 2.5",
                    "duration": "10s",
                    "videoRatio": "9:16",
                    "videoRes": "720p",
                    "listMode": True,
                },
                {
                    "id": "list4",
                    "kind": "list",
                    "x": 1750,
                    "y": 150,
                    "items": [{"type": "video", "assetId": "asset-vid-1", "firstFrameAssetId": "asset-img-1"}],
                },
            ],
            "edges": [
                {"id": "e1", "source": "list1", "sourcePort": "text", "target": "txt1", "targetPort": "text_in"},
                {"id": "e2", "source": "list2", "sourcePort": "text", "target": "txt1", "targetPort": "text_in"},
                {"id": "e3", "source": "txt1", "sourcePort": "text", "target": "imggen1", "targetPort": "prompt"},
                {"id": "e4", "source": "imggen1", "sourcePort": "image", "target": "list3", "targetPort": "image"},
                {"id": "e5", "source": "list3", "sourcePort": "image", "target": "vidgen1", "targetPort": "start_image"},
                {"id": "e6", "source": "txt1", "sourcePort": "text", "target": "vidgen1", "targetPort": "prompt"},
                {"id": "e7", "source": "vidgen1", "sourcePort": "video", "target": "list4", "targetPort": "video"},
            ],
        }
        self.assertIsNone(validate_graph(graph))
        snap = run_snapshot(graph, "imggen1")
        self.assertEqual(snap["rawPrompt"], "City of @List #1 in @List #2 aesthetic")
        self.assertIn("@List #1", snap["mentions"])
        self.assertIn("@List #2", snap["mentions"])

    def test_project_folder_slug(self):
        from studio.app import project_folder_slug

        slug1 = project_folder_slug("Dự án 1", "7ed2e936-4fd8-43f5-9a63-919312ff46c5")
        slug2 = project_folder_slug("Flow mẫu: Text → Image", "a68cf051-ec86-4ba1-ad28-8296c06e25f6")
        self.assertEqual(slug1, "du-an-1_7ed2e936")
        self.assertEqual(slug2, "flow-mau-text-image_a68cf051")

    def test_five_audio_branches_end_to_end(self):
        from studio.app import (
            CATALOG,
            resolve_connected_text,
            run_snapshot,
            synthesize_studio_audio_f32,
            transcribe_media_to_text,
            validate_graph,
        )

        catalog_kinds = {item["kind"] for item in CATALOG}
        for audio_kind in ("speech-to-text", "voiceover", "sound-effects", "audio-generator", "music-generator"):
            self.assertIn(audio_kind, catalog_kinds)

        # 1. Test local audio synthesis for all 4 generative audio branches
        for kind, dur_sec, loop_flag, inst_flag in [
            ("voiceover", 1.5, False, False),
            ("sound-effects", 1.5, True, False),
            ("audio-generator", 1.5, False, False),
            ("music-generator", 2.0, False, True),
        ]:
            snap_in = {
                "kind": kind,
                "prompt": f"Test prompt for {kind}",
                "durationSeconds": dur_sec,
                "voiceSpeaker1": "Hope",
                "voiceSpeaker2": "Clyde" if kind == "voiceover" else "",
                "loopAudio": loop_flag,
                "instrumental": inst_flag,
            }
            samples = synthesize_studio_audio_f32(snap_in, variant_index=0, sample_rate=44100)
            self.assertEqual(str(samples.dtype), "float32")
            self.assertGreater(len(samples), 40000)

        # 2. Test Speech to Text transcription on synthesized WAV bytes
        import tempfile
        import wave
        from pathlib import Path
        import numpy as np

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp_path = Path(tmp.name)
        try:
            vo_samples = synthesize_studio_audio_f32(
                {
                    "kind": "voiceover",
                    "prompt": "Hello from Spaces Voiceover",
                    "durationSeconds": 1.8,
                    "voiceSpeaker1": "Hope",
                },
                sample_rate=44100,
            )
            pcm16 = np.clip(vo_samples * 32767.0, -32768, 32767).astype("<i2")
            with wave.open(str(tmp_path), "wb") as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(44100)
                wf.writeframes(pcm16.tobytes())
            transcript = transcribe_media_to_text(
                {
                    "kind": "speech-to-text",
                    "upstreamScript": "Hello from Spaces Voiceover",
                    "audioModel": "Whisper v3",
                },
                tmp_path,
            )
            self.assertTrue(len(transcript) > 5)
        finally:
            tmp_path.unlink(missing_ok=True)

        # 3. Test graph validation & snapshot resolution across Speech to Text -> Voiceover / Music Generator -> List
        graph = {
            "nodes": [
                {
                    "id": "aud_src",
                    "kind": "audio",
                    "x": 0,
                    "y": 0,
                    "assetId": "asset-audio-1",
                },
                {
                    "id": "stt1",
                    "kind": "speech-to-text",
                    "x": 300,
                    "y": 0,
                    "audioModel": "Whisper v3",
                    "transcriptText": "We built a warm acoustic campfire melody under the stars.",
                },
                {
                    "id": "vo1",
                    "kind": "voiceover",
                    "x": 650,
                    "y": 0,
                    "audioModel": "ElevenLabs v3",
                    "voiceName": "Hope",
                    "speaker2Name": "Clyde",
                    "batchCount": 2,
                },
                {
                    "id": "mus1",
                    "kind": "music-generator",
                    "x": 650,
                    "y": 260,
                    "audioModel": "ElevenLabs Music",
                    "duration": "30s",
                    "instrumental": True,
                    "batchCount": 3,
                },
                {
                    "id": "list_out",
                    "kind": "list",
                    "x": 1000,
                    "y": 260,
                    "items": [],
                },
            ],
            "edges": [
                {"id": "e1", "source": "aud_src", "sourcePort": "audio", "target": "stt1", "targetPort": "audio"},
                {"id": "e2", "source": "stt1", "sourcePort": "text", "target": "vo1", "targetPort": "prompt"},
                {"id": "e3", "source": "stt1", "sourcePort": "text", "target": "mus1", "targetPort": "prompt"},
                {"id": "e4", "source": "mus1", "sourcePort": "audio", "target": "list_out", "targetPort": "audio"},
            ],
        }
        self.assertIsNone(validate_graph(graph))
        self.assertEqual(
            resolve_connected_text(graph["nodes"][1]),
            "We built a warm acoustic campfire melody under the stars.",
        )

        stt_snap = run_snapshot(graph, "stt1")
        self.assertEqual(stt_snap["kind"], "speech-to-text")
        self.assertEqual(stt_snap["sourceAssetId"], "asset-audio-1")

        vo_snap = run_snapshot(graph, "vo1")
        self.assertEqual(vo_snap["voiceName"], "Hope")
        self.assertEqual(vo_snap["speaker2Name"], "Clyde")
        self.assertEqual(vo_snap["batchCount"], 2)
        self.assertEqual(vo_snap["prompt"], "We built a warm acoustic campfire melody under the stars.")

        mus_snap = run_snapshot(graph, "mus1")
        self.assertEqual(mus_snap["audioModel"], "ElevenLabs Music")
        self.assertEqual(mus_snap["duration"], "30s")
        self.assertTrue(mus_snap["instrumental"])
        self.assertEqual(mus_snap["batchCount"], 3)

    def test_clip_prompt_normalization_and_single_command_helpers(self):
        from studio.__main__ import detect_comfy_worker_flags, parse_local_comfy_target
        from studio.runner import normalize_clip_prompt, vram_safe_latent_dims

        self.assertEqual(normalize_clip_prompt("A lake house"), "A lake house")
        vi_out = normalize_clip_prompt("Cô gái mặc áo dài trong căn phòng sang trọng lúc hoàng hôn")
        self.assertIn("young woman", vi_out)
        self.assertIn("traditional Vietnamese ao dai dress", vi_out)
        self.assertIn("luxury interior room", vi_out)
        self.assertIn("golden sunset lighting", vi_out)

        vi_ascii_out = normalize_clip_prompt("co gai mac ao dai luc hoang hon tren duong pho")
        self.assertIn("young woman", vi_ascii_out)
        self.assertIn("traditional Vietnamese ao dai dress", vi_ascii_out)
        self.assertIn("golden sunset lighting", vi_ascii_out)
        self.assertIn("street scene", vi_ascii_out)

        self.assertEqual(vram_safe_latent_dims(512, 512), (512, 512))
        self.assertEqual(vram_safe_latent_dims(1376, 768), (768, 432))

        self.assertEqual(parse_local_comfy_target("http://127.0.0.1:8188"), ("127.0.0.1", 8188))
        self.assertIsNone(parse_local_comfy_target("https://remote-comfy.example.com:8188"))
        flags = detect_comfy_worker_flags()
        self.assertIn("--disable-auto-launch", flags)

    def test_batch_list_combinations_without_item0_pollution_and_img2img_combos(self):
        from studio.app import compute_graph_batch_combinations, resolve_connected_text, resolve_source_asset_id, run_snapshot

        list_node = {
            "id": "list_sel",
            "kind": "list",
            "items": [
                {"type": "image", "assetId": "img-unselected", "text": "Unselected text", "selected": False},
                {"type": "image", "assetId": "img-selected", "text": "Selected text", "selected": True},
            ],
        }
        self.assertEqual(resolve_connected_text(list_node), "Selected text")
        self.assertEqual(resolve_source_asset_id(list_node), "img-selected")

        graph = {
            "nodes": [
                {
                    "id": "list_prompts",
                    "kind": "list",
                    "x": 0,
                    "y": 0,
                    "items": [
                        {"type": "text", "text": "Red apple", "selected": True},
                        {"type": "text", "text": "Green pear", "selected": True},
                        {"type": "text", "text": "Blue plum", "selected": True},
                    ],
                },
                {
                    "id": "list_imgs",
                    "kind": "list",
                    "x": 0,
                    "y": 240,
                    "items": [
                        {"type": "image", "assetId": "asset-a", "selected": True},
                        {"type": "image", "assetId": "asset-b", "selected": True},
                    ],
                },
                {
                    "id": "gen_batch",
                    "kind": "text-image",
                    "x": 360,
                    "y": 0,
                    "model": "Local GPU (VRAM)",
                    "extraPrompt": "cinematic studio lighting",
                },
                {
                    "id": "edit_batch",
                    "kind": "image-image",
                    "x": 360,
                    "y": 240,
                    "model": "Local GPU (VRAM)",
                    "editorTool": "Relight",
                    "lightColor": "golden sunset",
                },
                {
                    "id": "up_batch",
                    "kind": "upscaler",
                    "x": 360,
                    "y": 480,
                    "upscaleModel": "Local GPU (VRAM)",
                    "scaleFactor": 2,
                },
            ],
            "edges": [
                {"id": "e1", "source": "list_prompts", "sourcePort": "text", "target": "gen_batch", "targetPort": "prompt"},
                {"id": "e2", "source": "list_imgs", "sourcePort": "image", "target": "edit_batch", "targetPort": "source_image"},
                {"id": "e3", "source": "list_prompts", "sourcePort": "text", "target": "edit_batch", "targetPort": "prompt"},
                {"id": "e4", "source": "list_imgs", "sourcePort": "image", "target": "up_batch", "targetPort": "source_image"},
            ],
        }

        gen_combos = compute_graph_batch_combinations(graph, "gen_batch")
        self.assertEqual(len(gen_combos), 3)
        self.assertEqual(gen_combos[0]["prompt"], "cinematic studio lighting, Red apple")
        self.assertEqual(gen_combos[1]["prompt"], "cinematic studio lighting, Green pear")
        self.assertNotIn("Red apple", gen_combos[1]["prompt"])
        self.assertEqual(gen_combos[2]["prompt"], "cinematic studio lighting, Blue plum")

        snap_edit_0 = run_snapshot(graph, "edit_batch", combination_index=0)
        snap_edit_3 = run_snapshot(graph, "edit_batch", combination_index=3)
        self.assertEqual(snap_edit_0["totalCombinations"], 6)
        self.assertEqual(snap_edit_0["sourceAssetId"], "asset-a")
        self.assertIn("relight scene with golden sunset light", snap_edit_0["prompt"])
        self.assertIn("Red apple", snap_edit_0["prompt"])
        self.assertEqual(snap_edit_3["sourceAssetId"], "asset-b")
        self.assertIn("relight scene with golden sunset light", snap_edit_3["prompt"])
        self.assertIn("Green pear", snap_edit_3["prompt"])

        snap_up_0 = run_snapshot(graph, "up_batch", combination_index=0)
        snap_up_1 = run_snapshot(graph, "up_batch", combination_index=1)
        self.assertEqual(snap_up_0["sourceAssetId"], "asset-a")
        self.assertEqual(snap_up_1["sourceAssetId"], "asset-b")
        self.assertIn("ultra high resolution 2x upscale", snap_up_1["prompt"])


class StudioParallelGpuAndApiRoutingTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.data_dir = tempfile.TemporaryDirectory()
        self.image = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=")
        self.submitted = []
        self.uploaded = []
        self.view_image_bytes = self.image
        self.mock_checkpoints = ["test.safetensors"]
        self.mock_system_stats = None
        worker = web.Application()

        async def object_info(request):
            return web.json_response({"CheckpointLoaderSimple": {"input": {"required": {"ckpt_name": [list(self.mock_checkpoints)]}}}})

        async def system_stats(request):
            if self.mock_system_stats is None:
                return web.Response(status=404, text="Not found")
            return web.json_response(self.mock_system_stats)

        async def submit(request):
            payload = await request.json()
            self.submitted.append(payload)
            return web.json_response({"prompt_id": payload["prompt_id"]})

        async def upload_image(request):
            reader = await request.multipart()
            field = await reader.next()
            body = await field.read()
            self.uploaded.append({"name": field.filename, "body": body})
            return web.json_response({"name": field.filename, "subfolder": "", "type": "input"})

        async def history(request):
            prompt_id = request.match_info["prompt_id"]
            for item in self.submitted:
                if item["prompt_id"] == prompt_id:
                    save_node = "8" if "8" in item["prompt"] else "7"
                    return web.json_response({prompt_id: {"status": {"status_str": "success"}, "outputs": {save_node: {"images": [{"filename": "test.png", "subfolder": "", "type": "output"}]}}}})
            return web.json_response({})

        async def queue(request):
            return web.json_response({"queue_running": [], "queue_pending": []})

        async def view(request):
            return web.Response(body=self.view_image_bytes, content_type="image/png")

        worker.router.add_get("/object_info/CheckpointLoaderSimple", object_info)
        worker.router.add_get("/system_stats", system_stats)
        worker.router.add_post("/prompt", submit)
        worker.router.add_post("/upload/image", upload_image)
        worker.router.add_get("/history/{prompt_id}", history)
        worker.router.add_get("/queue", queue)
        worker.router.add_get("/view", view)
        self.worker = TestServer(worker)
        await self.worker.start_server()
        self.client = TestClient(TestServer(create_app(self.data_dir.name, str(self.worker.make_url("/")))))
        await self.client.start_server()

    async def asyncTearDown(self):
        await self.client.close()
        await self.worker.close()
        self.data_dir.cleanup()

    async def test_parallel_local_gpu_vram_and_cloud_api_runs(self):
        await self.client.put(
            "/studio/api/settings/models",
            json={"models": {"Google Nano Banana 2.1": {"apiKey": "key-banana-parallel", "kind": "image"}}},
        )
        project = await (await self.client.post("/studio/api/projects", json={"title": "Parallel GPU + API"})).json()
        graph = {
            "nodes": [
                {
                    "id": "gpu_node",
                    "kind": "text-image",
                    "x": 100,
                    "y": 100,
                    "model": "Local GPU (VRAM)",
                    "prompt": "Cô gái mặc áo dài lúc hoàng hôn",
                    "width": 1376,
                    "height": 768,
                },
                {
                    "id": "api_node",
                    "kind": "text-image",
                    "x": 520,
                    "y": 100,
                    "model": "Google Nano Banana 2.1",
                    "prompt": "Cô gái mặc áo dài lúc hoàng hôn",
                    "width": 1376,
                    "height": 768,
                },
            ],
            "edges": [],
        }
        put_res = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(put_res.status, 200)

        gpu_resp, api_resp = await asyncio.gather(
            self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "gpu_node", "version": 2}),
            self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "api_node", "version": 2}),
        )
        self.assertEqual(gpu_resp.status, 201)
        self.assertEqual(api_resp.status, 201)
        gpu_run = await gpu_resp.json()
        api_run = await api_resp.json()

        self.assertEqual(gpu_run["snapshot"]["requestedModel"], "Local GPU (VRAM)")
        self.assertEqual(gpu_run["snapshot"]["model"], "test.safetensors")
        self.assertEqual(gpu_run["snapshot"]["executionMode"], "gpu")
        self.assertTrue(gpu_run["snapshot"]["vramSafeLatent"])

        self.assertEqual(api_run["snapshot"]["model"], "Google Nano Banana 2.1")
        self.assertEqual(api_run["snapshot"]["executionMode"], "api")
        self.assertEqual(api_run["state"], "succeeded")

        self.assertEqual(len(self.submitted), 1)
        submitted_prompt = self.submitted[0]["prompt"]
        self.assertEqual(submitted_prompt["4"]["inputs"]["width"], 768)
        self.assertEqual(submitted_prompt["4"]["inputs"]["height"], 432)
        self.assertIn("young woman", submitted_prompt["2"]["inputs"]["text"])

        # Also verify 4GB VRAM source downscale + post-VAEDecode upscale on image-image GPU run
        buf_src = io.BytesIO()
        Image.new("RGB", (1376, 768), (40, 90, 160)).save(buf_src, format="PNG")
        buf_out = io.BytesIO()
        Image.new("RGB", (768, 432), (80, 140, 220)).save(buf_out, format="PNG")
        self.view_image_bytes = buf_out.getvalue()

        form = FormData()
        form.add_field("file", buf_src.getvalue(), filename="large_source.png", content_type="image/png")
        asset_res = await self.client.post("/studio/api/assets", data=form)
        self.assertEqual(asset_res.status, 201)
        src_asset = await asset_res.json()

        graph2 = {
            "nodes": [
                {"id": "src_img", "kind": "image", "x": 40, "y": 40, "assetId": src_asset["id"]},
                {
                    "id": "gpu_edit",
                    "kind": "image-image",
                    "x": 420,
                    "y": 40,
                    "model": "Local GPU (VRAM)",
                    "prompt": "Thành phố tương lai rực rỡ",
                    "width": 1376,
                    "height": 768,
                },
                {
                    "id": "gpu_upscale",
                    "kind": "upscaler",
                    "x": 820,
                    "y": 40,
                    "upscaleModel": "Local GPU (VRAM)",
                    "scaleFactor": 2,
                },
            ],
            "edges": [
                {"id": "e_src", "source": "src_img", "sourcePort": "image", "target": "gpu_edit", "targetPort": "source_image"},
                {"id": "e_up", "source": "src_img", "sourcePort": "image", "target": "gpu_upscale", "targetPort": "source_image"},
            ],
        }
        cur_proj = await (await self.client.get(f"/studio/api/projects/{project['id']}")).json()
        put_res2 = await self.client.put(
            f"/studio/api/projects/{project['id']}/graph",
            json={"version": cur_proj["version"], "graph": graph2},
        )
        self.assertEqual(put_res2.status, 200)
        next_ver = (await put_res2.json())["version"]

        edit_resp = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "gpu_edit", "version": next_ver})
        self.assertEqual(edit_resp.status, 201)
        edit_run = await edit_resp.json()
        self.assertIn("auditReport", edit_run["snapshot"])
        self.assertEqual(len(self.uploaded), 1)
        with Image.open(io.BytesIO(self.uploaded[0]["body"])) as up_im:
            self.assertEqual(up_im.size, (768, 432))

        for _ in range(20):
            r_check = await self.client.get(f"/studio/api/runs/{edit_run['id']}")
            edit_run = await r_check.json()
            if edit_run["state"] == "succeeded":
                break
            await asyncio.sleep(0.1)
        self.assertEqual(edit_run["state"], "succeeded")
        self.assertIn("auditReport", edit_run["snapshot"])
        final_bytes = await (await self.client.get(f"/studio/api/assets/{edit_run['assetId']}/content")).read()
        with Image.open(io.BytesIO(final_bytes)) as final_im:
            self.assertEqual(final_im.size, (1376, 768))

        up_resp = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "gpu_upscale", "version": next_ver})
        self.assertEqual(up_resp.status, 201)
        up_run = await up_resp.json()
        self.assertEqual(up_run["snapshot"]["width"], 2752)
        self.assertEqual(up_run["snapshot"]["height"], 1536)
        for _ in range(20):
            r_up = await self.client.get(f"/studio/api/runs/{up_run['id']}")
            up_run = await r_up.json()
            if up_run["state"] == "succeeded":
                break
            await asyncio.sleep(0.1)
        self.assertEqual(up_run["state"], "succeeded")
        self.assertTrue(up_run["snapshot"].get("bridgeCompleted"))
        up_bytes = await (await self.client.get(f"/studio/api/assets/{up_run['assetId']}/content")).read()
        with Image.open(io.BytesIO(up_bytes)) as up_final_im:
            self.assertEqual(up_final_im.size, (2752, 1536))

    async def test_video_mp4_audio_muxing_and_sound_toggle(self):
        import av

        project = await (await self.client.post("/studio/api/projects", json={"title": "MP4 Audio Mux"})).json()
        graph = {
            "nodes": [
                {
                    "id": "tv_sound_on",
                    "kind": "text-video",
                    "x": 0,
                    "y": 0,
                    "prompt": "Ocean waves crashing on cliffs",
                    "duration": "2s",
                    "width": 320,
                    "height": 256,
                    "soundEffects": True,
                },
                {
                    "id": "tv_sound_off",
                    "kind": "text-video",
                    "x": 360,
                    "y": 0,
                    "prompt": "Silent clouds drifting",
                    "duration": "2s",
                    "width": 320,
                    "height": 256,
                    "soundEffects": False,
                },
                {
                    "id": "spk_node",
                    "kind": "speak",
                    "x": 720,
                    "y": 0,
                    "prompt": "Welcome to Studio AI video engine",
                    "duration": "2s",
                    "width": 320,
                    "height": 256,
                },
            ],
            "edges": [],
        }
        put_res = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(put_res.status, 200)

        r_on = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "tv_sound_on", "version": 2})).json()
        self.assertEqual(r_on["state"], "succeeded")
        self.assertTrue(r_on["snapshot"].get("soundEffects"))
        self.assertTrue(r_on["snapshot"].get("generateAudio"))
        self.assertIn("audioAssetId", r_on["snapshot"])
        mp4_on_bytes = await (await self.client.get(f"/studio/api/assets/{r_on['assetId']}/content")).read()
        with av.open(io.BytesIO(mp4_on_bytes)) as container_on:
            self.assertEqual(len(container_on.streams.video), 1)
            self.assertEqual(len(container_on.streams.audio), 1)

        r_off = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "tv_sound_off", "version": 2})).json()
        self.assertEqual(r_off["state"], "succeeded")
        self.assertFalse(r_off["snapshot"].get("soundEffects"))
        self.assertFalse(r_off["snapshot"].get("generateAudio"))
        mp4_off_bytes = await (await self.client.get(f"/studio/api/assets/{r_off['assetId']}/content")).read()
        with av.open(io.BytesIO(mp4_off_bytes)) as container_off:
            self.assertEqual(len(container_off.streams.video), 1)
            self.assertEqual(len(container_off.streams.audio), 0)

        r_spk = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "spk_node", "version": 2})).json()
        self.assertEqual(r_spk["state"], "succeeded")
        mp4_spk_bytes = await (await self.client.get(f"/studio/api/assets/{r_spk['assetId']}/content")).read()
        with av.open(io.BytesIO(mp4_spk_bytes)) as container_spk:
            self.assertEqual(len(container_spk.streams.video), 1)
            self.assertEqual(len(container_spk.streams.audio), 1)

    async def test_save_graph_preserves_backend_run_outputs_and_gpu_text_image_ref_aspect_ratio(self):
        await self.client.put(
            "/studio/api/settings/models",
            json={"models": {"Google Nano Banana 2.1": {"apiKey": "key-banana-merge", "kind": "image"}}},
        )
        project = await (await self.client.post("/studio/api/projects", json={"title": "Merge & Aspect Test"})).json()

        buf_sq = io.BytesIO()
        Image.new("RGB", (512, 512), (120, 60, 180)).save(buf_sq, format="PNG")
        form = FormData()
        form.add_field("file", buf_sq.getvalue(), filename="sq512.png", content_type="image/png")
        sq_asset = await (await self.client.post("/studio/api/assets", data=form)).json()

        graph = {
            "nodes": [
                {"id": "ref_img", "kind": "image", "x": 0, "y": 0, "assetId": sq_asset["id"]},
                {
                    "id": "gpu_t2i_ref",
                    "kind": "text-image",
                    "x": 360,
                    "y": 0,
                    "model": "Local GPU (VRAM)",
                    "prompt": "Portrait in vertical frame",
                    "width": 768,
                    "height": 1376,
                },
                {
                    "id": "api_gen",
                    "kind": "text-image",
                    "x": 360,
                    "y": 320,
                    "model": "Google Nano Banana 2.1",
                    "prompt": "Mountain sunrise",
                    "width": 1024,
                    "height": 1024,
                },
                {"id": "out_list", "kind": "list", "x": 760, "y": 320, "items": []},
            ],
            "edges": [
                {"id": "e_ref", "source": "ref_img", "sourcePort": "image", "target": "gpu_t2i_ref", "targetPort": "reference_image"},
                {"id": "e_list", "source": "api_gen", "sourcePort": "image", "target": "out_list", "targetPort": "image"},
            ],
        }
        put1 = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(put1.status, 200)

        # 1) Run api_gen (even with stale version=1, create_run should succeed without 409)
        api_run_res = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "api_gen", "version": 1})
        self.assertEqual(api_run_res.status, 201)
        api_run = await api_run_res.json()
        self.assertEqual(api_run["state"], "succeeded")

        import copy
        stale_client_graph = copy.deepcopy(graph)
        stale_client_graph["nodes"][2]["prompt"] = "Mountain sunrise updated"
        put2 = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 2, "graph": stale_client_graph})
        self.assertEqual(put2.status, 200)

        saved_proj = await (await self.client.get(f"/studio/api/projects/{project['id']}")).json()
        saved_api_node = next(n for n in saved_proj["graph"]["nodes"] if n["id"] == "api_gen")
        saved_list_node = next(n for n in saved_proj["graph"]["nodes"] if n["id"] == "out_list")
        self.assertEqual(saved_api_node.get("assetId"), api_run["assetId"])
        self.assertEqual(len(saved_list_node.get("items") or []), 1)
        self.assertEqual(saved_list_node["items"][0]["assetId"], api_run["assetId"])

        # 3) Run gpu_t2i_ref with 1:1 (512x512) reference image but 9:16 (768x1376) target card dimensions
        buf_out_916 = io.BytesIO()
        Image.new("RGB", (432, 768), (90, 150, 210)).save(buf_out_916, format="PNG")
        self.view_image_bytes = buf_out_916.getvalue()
        self.uploaded.clear()

        gpu_res = await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "gpu_t2i_ref", "version": 3})
        self.assertEqual(gpu_res.status, 201)
        gpu_run = await gpu_res.json()
        self.assertEqual(len(self.uploaded), 1)
        with Image.open(io.BytesIO(self.uploaded[0]["body"])) as uploaded_im:
            self.assertEqual(uploaded_im.size, (432, 768))

        for _ in range(20):
            gpu_run = await (await self.client.get(f"/studio/api/runs/{gpu_run['id']}")).json()
            if gpu_run["state"] == "succeeded":
                break
            await asyncio.sleep(0.05)
        self.assertEqual(gpu_run["state"], "succeeded")
        out_bytes = await (await self.client.get(f"/studio/api/assets/{gpu_run['assetId']}/content")).read()
        with Image.open(io.BytesIO(out_bytes)) as out_im:
            self.assertEqual(out_im.size, (768, 1376))

    async def test_reloader_syntax_validation_prevents_crash(self):
        mtimes = py_mtimes()
        self.assertTrue(len(mtimes) >= 2)
        valid, err = validate_py_sources(mtimes.keys())
        self.assertTrue(valid, f"Expected valid syntax across studio/*.py, got {err}")

        bad_file = Path(self.data_dir.name) / "broken_indent.py"
        bad_file.write_text("def f():\n    x = 1\n     y = 2\n", encoding="utf-8")
        valid_bad, err_bad = validate_py_sources([bad_file])
        self.assertFalse(valid_bad)
        self.assertIn("broken_indent.py", err_bad)

    async def test_12gb_vram_checkpoint_selection_flux_sdxl_and_sd15_prompts(self):
        from studio.runner import normalize_clip_prompt, select_best_checkpoint

        self.assertEqual(
            normalize_clip_prompt("lazypos\nKaela Kovalskia, the girl from 1st image, lies on a soft carpet"),
            "Kaela Kovalskia, lies on a soft carpet",
        )
        self.assertEqual(normalize_clip_prompt("embedding:lazypos, anime girl"), "embedding:lazypos, anime girl")

        self.mock_system_stats = {
            "devices": [
                {
                    "name": "cuda:0 NVIDIA GeForce RTX 3060",
                    "type": "cuda",
                    "vram_total": 12288 * 1024 * 1024,
                    "vram_free": 11000 * 1024 * 1024,
                }
            ]
        }
        # First check warning when only SD1.5 exists on 12GB VRAM
        self.mock_checkpoints = ["DreamShaper_8_pruned.safetensors"]
        status_sd15 = await (await self.client.get("/studio/api/comfy/status")).json()
        self.assertTrue(status_sd15["connected"])
        self.assertEqual(status_sd15["vramTier"], "12gb+")
        self.assertTrue(status_sd15["warnings"])
        self.assertIn("DreamShaper_8_pruned.safetensors", status_sd15["warnings"][0])

        # Add SDXL & Flux Schnell -> 12GB VRAM should prefer flux1-schnell-fp8.safetensors
        self.mock_checkpoints = [
            "DreamShaper_8_pruned.safetensors",
            "animagine-xl-3.1.safetensors",
            "flux1-schnell-fp8.safetensors",
        ]
        self.assertEqual(select_best_checkpoint(self.mock_checkpoints, 12288), "flux1-schnell-fp8.safetensors")
        self.assertEqual(select_best_checkpoint(self.mock_checkpoints, 8192), "animagine-xl-3.1.safetensors")

        project = await (await self.client.post("/studio/api/projects", json={"title": "12GB VRAM Routing"})).json()
        graph = {
            "nodes": [
                {
                    "id": "node_auto_12gb",
                    "kind": "text-image",
                    "x": 100,
                    "y": 100,
                    "model": "Local GPU (VRAM)",
                    "prompt": "lazypos\nA humorous modern anime-style parody sharing snacks",
                    "width": 1376,
                    "height": 768,
                    "steps": 20,
                    "cfg": 7.0,
                },
                {
                    "id": "node_sdxl",
                    "kind": "text-image",
                    "x": 500,
                    "y": 100,
                    "model": "animagine-xl-3.1.safetensors",
                    "prompt": "two anime girls sharing snacks",
                    "width": 1376,
                    "height": 768,
                    "steps": 20,
                    "cfg": 7.0,
                },
                {
                    "id": "node_sd15",
                    "kind": "text-image",
                    "x": 900,
                    "y": 100,
                    "model": "DreamShaper_8_pruned.safetensors",
                    "prompt": "girl on carpet",
                    "width": 1376,
                    "height": 768,
                    "steps": 20,
                    "cfg": 7.0,
                },
            ],
            "edges": [],
        }
        put_res = await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        self.assertEqual(put_res.status, 200)

        r_flux = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "node_auto_12gb", "version": 2})).json()
        r_sdxl = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "node_sdxl", "version": 2})).json()
        r_sd15 = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "node_sd15", "version": 2})).json()

        self.assertEqual(r_flux["snapshot"]["model"], "flux1-schnell-fp8.safetensors")
        self.assertEqual(r_flux["snapshot"]["checkpointFamily"], "flux_schnell")
        self.assertFalse(r_flux["snapshot"]["vramSafeLatent"])

        flux_prompt = next(s["prompt"] for s in self.submitted if s["prompt_id"] == r_flux["id"])
        self.assertEqual(flux_prompt["4"]["inputs"]["width"], 1376)
        self.assertEqual(flux_prompt["4"]["inputs"]["height"], 768)
        self.assertEqual(flux_prompt["9"]["class_type"], "FluxDisableGuidance")
        self.assertEqual(flux_prompt["5"]["inputs"]["positive"], ["9", 0])
        self.assertEqual(flux_prompt["5"]["inputs"]["scheduler"], "simple")
        self.assertEqual(flux_prompt["5"]["inputs"]["cfg"], 1.0)
        self.assertEqual(flux_prompt["5"]["inputs"]["steps"], 4)
        self.assertNotIn("lazypos", flux_prompt["2"]["inputs"]["text"].lower())

        sdxl_prompt = next(s["prompt"] for s in self.submitted if s["prompt_id"] == r_sdxl["id"])
        self.assertEqual(sdxl_prompt["4"]["inputs"]["width"], 1376)
        self.assertEqual(sdxl_prompt["4"]["inputs"]["height"], 768)
        self.assertEqual(sdxl_prompt["5"]["inputs"]["sampler_name"], "euler_ancestral")
        self.assertEqual(sdxl_prompt["5"]["inputs"]["scheduler"], "normal")
        self.assertEqual(sdxl_prompt["5"]["inputs"]["steps"], 28)
        self.assertEqual(sdxl_prompt["5"]["inputs"]["cfg"], 6.0)
        self.assertIn("best quality", sdxl_prompt["2"]["inputs"]["text"])
        self.assertIn("worst quality", sdxl_prompt["3"]["inputs"]["text"])

        sd15_prompt = next(s["prompt"] for s in self.submitted if s["prompt_id"] == r_sd15["id"])
        self.assertEqual(sd15_prompt["5"]["inputs"]["sampler_name"], "dpmpp_2m")
        self.assertEqual(sd15_prompt["5"]["inputs"]["scheduler"], "karras")
        self.assertEqual(sd15_prompt["4"]["inputs"]["width"], 960)

    async def test_rerun_text_image_updates_asset_without_edit_lock_and_bridge_cancel(self):
        self.mock_system_stats = {
            "devices": [{"name": "cuda:0 RTX 3060", "type": "cuda", "vram_total": 12288 * 1024 * 1024, "vram_free": 11000 * 1024 * 1024}]
        }
        project = await (await self.client.post("/studio/api/projects", json={"title": "Rerun & Cancel Bridge"})).json()
        graph1 = {
            "nodes": [
                {"id": "txt1", "kind": "text", "x": 0, "y": 0, "text": "first prompt girl relaxing"},
                {"id": "gen1", "kind": "text-image", "x": 360, "y": 0, "model": "Local GPU (VRAM)", "width": 1024, "height": 1024},
            ],
            "edges": [{"id": "e1", "source": "txt1", "sourcePort": "text", "target": "gen1", "targetPort": "prompt"}],
        }
        await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph1})
        run1 = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "gen1", "version": 2})).json()
        for _ in range(20):
            run1 = await (await self.client.get(f"/studio/api/runs/{run1['id']}")).json()
            if run1["state"] == "succeeded":
                break
            await asyncio.sleep(0.05)
        self.assertEqual(run1["state"], "succeeded")

        # Reconnect to txt2 on the same text-image node that already has assetId from run1
        graph2 = {
            "nodes": [
                {"id": "txt2", "kind": "text", "x": 0, "y": 0, "text": "second prompt completely new scene"},
                {"id": "gen1", "kind": "text-image", "x": 360, "y": 0, "model": "Local GPU (VRAM)", "width": 1024, "height": 1024, "assetId": run1["assetId"]},
            ],
            "edges": [{"id": "e2", "source": "txt2", "sourcePort": "text", "target": "gen1", "targetPort": "prompt"}],
        }
        await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 2, "graph": graph2})
        run2 = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "gen1", "version": 3})).json()
        self.assertFalse(run2["snapshot"].get("editExistingNodeImage"))
        self.assertIsNone(run2["snapshot"].get("sourceAssetId"))
        for _ in range(20):
            run2 = await (await self.client.get(f"/studio/api/runs/{run2['id']}")).json()
            if run2["state"] == "succeeded":
                break
            await asyncio.sleep(0.05)
        self.assertEqual(run2["state"], "succeeded")
        proj_after = await (await self.client.get(f"/studio/api/projects/{project['id']}")).json()
        gen1_after = next(n for n in proj_after["graph"]["nodes"] if n["id"] == "gen1")
        self.assertEqual(gen1_after["assetId"], run2["assetId"])
        self.assertNotEqual(gen1_after["assetId"], run1["assetId"])

        # Submit an Antigravity AI Bridge run mentioning "1st image" without wire, verify audit & cancel endpoint
        graph3 = {
            "nodes": [
                {"id": "txt_b", "kind": "text", "x": 0, "y": 240, "text": "Kaela Kovalskia, the girl from 1st image sharing snacks"},
                {"id": "bridge1", "kind": "text-image", "x": 360, "y": 240, "model": "Antigravity AI Bridge", "width": 1376, "height": 768},
            ],
            "edges": [{"id": "eb", "source": "txt_b", "sourcePort": "text", "target": "bridge1", "targetPort": "prompt"}],
        }
        await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 3, "graph": graph3})
        bridge_run = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "bridge1", "version": 4})).json()
        self.assertEqual(bridge_run["state"], "running")
        self.assertTrue(bridge_run["snapshot"].get("bridgePending"))
        self.assertTrue(bridge_run["snapshot"]["auditReport"]["imageAudit"].get("referenceWarning"))

        cancel_res = await self.client.post(f"/studio/api/runs/{bridge_run['id']}/cancel")
        self.assertEqual(cancel_res.status, 200)
        cancelled = await cancel_res.json()
        self.assertEqual(cancelled["state"], "failed")
        self.assertFalse(cancelled["snapshot"].get("bridgePending"))
        self.assertTrue(cancelled["snapshot"].get("bridgeCancelled"))

    def test_detect_comfy_worker_flags_cpu_fallback_and_12gb_normalvram(self):
        from unittest.mock import patch
        from studio.__main__ import detect_comfy_worker_flags

        with patch("studio.__main__.probe_gpu_environment", return_value={
            "nvidiaSmiFound": True, "hardwareGpuName": "RTX 3060", "hardwareVramMB": 12288.0,
            "torchInstalled": True, "torchVersion": "2.12.1+cpu", "torchCudaAvailable": False,
            "torchCudaVersion": "", "torchGpuName": "", "torchVramMB": 0.0,
        }):
            self.assertEqual(detect_comfy_worker_flags(), ["--disable-auto-launch", "--cpu"])

        with patch("studio.__main__.probe_gpu_environment", return_value={
            "nvidiaSmiFound": True, "hardwareGpuName": "RTX 3060", "hardwareVramMB": 12288.0,
            "torchInstalled": True, "torchVersion": "2.7.0+cu126", "torchCudaAvailable": True,
            "torchCudaVersion": "12.6", "torchGpuName": "NVIDIA GeForce RTX 3060", "torchVramMB": 12288.0,
        }):
            self.assertEqual(detect_comfy_worker_flags(), ["--disable-auto-launch"])

        with patch("studio.__main__.probe_gpu_environment", return_value={
            "nvidiaSmiFound": True, "hardwareGpuName": "GTX 1650", "hardwareVramMB": 4096.0,
            "torchInstalled": True, "torchVersion": "2.7.0+cu126", "torchCudaAvailable": True,
            "torchCudaVersion": "12.6", "torchGpuName": "NVIDIA GeForce GTX 1650", "torchVramMB": 4096.0,
        }):
            self.assertEqual(
                detect_comfy_worker_flags(),
                ["--disable-auto-launch", "--lowvram", "--fp32-vae", "--force-upcast-attention"],
            )

    async def test_regional_conditioning_exact_430_word_kaela_kronii_prompt(self):
        self.mock_system_stats = {
            "devices": [{"name": "cuda:0 RTX 3060", "type": "cuda", "vram_total": 12288 * 1024 * 1024, "vram_free": 11000 * 1024 * 1024}]
        }
        self.mock_checkpoints = ["animagine-xl-3.1.safetensors"]
        long_prompt = (
            "lazypos\n"
            "A humorous modern anime-style parody of Michelangelo's The Creation of Adam, recreating its iconic diagonal composition and almost-touching fingertips, "
            "but replacing the divine creation of humanity with the extremely important act of sharing snacks. Kaela Kovalskia, the girl from 1st image, occupies the "
            "bottom-left portion of the composition, lying comfortably on a soft living-room carpet with her upper body slightly raised. She has long blonde hair, vivid "
            "crimson-red eyes, and a relaxed, slightly smug smile. She wears a comfortable oversized dark hoodie, loose trousers, and cozy socks. With one arm extended "
            "dramatically upward and toward the upper-right corner, she offers a large, crinkly bag of potato chips, holding it carefully by the top opening as though "
            "presenting a priceless treasure. Her other arm casually supports her body against the carpet.\n"
            "Ouro Kronii, the girl from 2nd image, occupies the upper-right portion of the composition, reclining comfortably across a large sofa with several soft cushions. "
            "Her blue hair drapes over the sofa, and she wears a modest oversized blue sweater, comfortable lounge pants, and socks. With an exaggeratedly elegant yet "
            "desperately determined expression, she leans far over the edge of the sofa, stretching one arm downward toward Kaela's snack bag. Her fingertips are just "
            "about to reach the bag, while her other hand grips the sofa cushion for support. Her expression suggests that obtaining these snacks is the most important "
            "mission of her existence.\n"
            "The two characters form the same recognizable diagonal arrangement as the original fresco: Kaela reaching upward from the lower-left while Kronii extends "
            "downward from the upper-right, with their hands and the snack bag becoming the central focal point. Their fingertips nearly touch the snack bag in an "
            "unnecessarily dramatic moment of anticipation. Replace Michelangelo's heavenly clouds and divine surroundings with a cozy modern living room, featuring a large "
            "fabric sofa, fluffy carpet, scattered cushions, a low coffee table, a television in the background, and a few empty snack wrappers. Soft afternoon sunlight enters "
            "through the window, creating warm atmospheric lighting across the room.\n"
            "The comedy comes from treating an ordinary snack-sharing moment with the monumental importance, dramatic gestures, and divine symbolism of a Renaissance "
            "masterpiece. Exaggerate the dramatic reach and the tiny distance between Kronii's fingers and the snack bag, as though the fate of the universe depends on whether "
            "she gets a chip. Detailed modern anime character illustration, expressive facial reactions, natural fabric folds, carefully composed anatomy, rich painterly "
            "background, warm cinematic lighting, playful slice-of-life atmosphere, wide horizontal composition, no text, no watermark."
        )
        project = await (await self.client.post("/studio/api/projects", json={"title": "Kaela & Kronii Regional"})).json()
        graph = {
            "nodes": [
                {"id": "txt_long", "kind": "text", "x": 0, "y": 0, "text": long_prompt},
                {"id": "gen_xl", "kind": "text-image", "x": 360, "y": 0, "model": "Local GPU (VRAM)", "width": 1376, "height": 768},
            ],
            "edges": [{"id": "e_long", "source": "txt_long", "sourcePort": "text", "target": "gen_xl", "targetPort": "prompt"}],
        }
        await self.client.put(f"/studio/api/projects/{project['id']}/graph", json={"version": 1, "graph": graph})
        res = await (await self.client.post("/studio/api/runs", json={"projectId": project["id"], "nodeId": "gen_xl", "version": 2})).json()
        workflow = next(s["prompt"] for s in self.submitted if s["prompt_id"] == res["id"])

        global_text = workflow["2"]["inputs"]["text"]
        self.assertTrue(global_text.startswith("2girls, multiple girls, wide shot"))
        self.assertNotIn("heavenly clouds", global_text.lower())
        self.assertNotIn("no watermark", global_text.lower())
        self.assertNotIn("lazypos", global_text.lower())
        self.assertNotIn("from 1st image", global_text.lower())
        self.assertIn("solo", workflow["3"]["inputs"]["text"].lower())

        area_nodes = [n for n in workflow.values() if n.get("class_type") == "ConditioningSetAreaPercentage"]
        comb_nodes = [n for n in workflow.values() if n.get("class_type") == "ConditioningCombine"]
        self.assertEqual(len(area_nodes), 2)
        self.assertEqual(len(comb_nodes), 2)

        bl_text = workflow[area_nodes[0]["inputs"]["conditioning"][0]]["inputs"]["text"]
        self.assertTrue(bl_text.startswith("1girl,"))
        self.assertIn("kaela kovalskia", bl_text.lower())
        self.assertIn("long blonde hair", bl_text.lower())
        self.assertIn("crimson-red eyes", bl_text.lower())
        self.assertIn("dark hoodie", bl_text.lower())
        self.assertIn("potato chips", bl_text.lower())
        self.assertNotIn("ouro kronii", bl_text.lower())
        self.assertNotIn("blue hair", bl_text.lower())
        self.assertEqual((area_nodes[0]["inputs"]["x"], area_nodes[0]["inputs"]["y"]), (0.0, 0.15))

        tr_text = workflow[area_nodes[1]["inputs"]["conditioning"][0]]["inputs"]["text"]
        self.assertTrue(tr_text.startswith("1girl,"))
        self.assertIn("ouro kronii", tr_text.lower())
        self.assertIn("blue hair", tr_text.lower())
        self.assertIn("blue sweater", tr_text.lower())
        self.assertNotIn("kaela", tr_text.lower())
        self.assertNotIn("blonde hair", tr_text.lower())
        self.assertEqual((area_nodes[1]["inputs"]["x"], area_nodes[1]["inputs"]["y"]), (0.44, 0.0))

        self.assertEqual(workflow["5"]["inputs"]["positive"], ["15", 0])


if __name__ == "__main__":
    unittest.main()

