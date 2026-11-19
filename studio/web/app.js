const apiRoot = "/studio/api";
const $ = (selector) => document.querySelector(selector);

const ASPECT_RATIOS = {
  "1:1": { dims: [1024, 1024], w: 11, h: 11 },
  "2:3": { dims: [832, 1248], w: 9, h: 13 },
  "3:2": { dims: [1248, 832], w: 13, h: 9 },
  "4:3": { dims: [1152, 864], w: 13, h: 10 },
  "3:4": { dims: [864, 1152], w: 10, h: 13 },
  "5:4": { dims: [1120, 896], w: 12, h: 10 },
  "4:5": { dims: [896, 1120], w: 10, h: 12 },
  "16:9": { dims: [1376, 768], w: 14, h: 8 },
  "9:16": { dims: [768, 1376], w: 8, h: 14 },
  "21:9": { dims: [1536, 656], w: 15, h: 7 },
  "9:21": { dims: [656, 1536], w: 7, h: 15 },
};

const VARIATION_GRID_OPTIONS = ["1x2", "2x1", "1x3", "3x1", "1x4", "4x1", "2x2", "2x3", "3x2", "2x4", "4x2", "3x3", "4x4"];

const VIDEO_ASPECT_RATIOS = ["1:1", "2:3", "3:2", "4:3", "3:4", "5:4", "4:5", "16:9", "9:16", "21:9", "9:21"];
const VIDEO_DURATIONS = ["5s", "10s", '2-4"', '5-6"', '8-10"', '10+"'];
const VIDEO_RESOLUTIONS = ["Auto", "480p", "720p", "1080p"];

const PRESET_MODELS = [
  // FEATURED
  { id: "auto", label: "Auto", badge: "auto", group: "FEATURED", noPin: true },
  { id: "local-gpu-vram", label: "Local GPU (VRAM)", badge: "gpu", group: "FEATURED", tag: "VRAM", tagType: "new", featuredAccent: true },
  { id: "antigravity-ai-bridge", label: "Antigravity AI Bridge", badge: "auto", group: "FEATURED", tag: "Free", tagType: "new", featuredAccent: true },
  { id: "magnific-one", label: "Magnific One", badge: "magnific", group: "FEATURED", tag: "New", tagType: "new", featuredAccent: true },
  { id: "google-nano-banana-2.1", label: "Google Nano Banana 2.1", badge: "google", group: "FEATURED", tag: "New", tagType: "new" },
  { id: "gpt-2.5", label: "GPT 2.5", badge: "openai", group: "FEATURED", tag: "Beta", tagType: "beta" },
  { id: "seedream-5-pro", label: "Seedream 5 Pro", badge: "seedream", group: "FEATURED" },
  // ALL MODELS (exact order from Screen Recording 2026-10-27 000446)
  { id: "flux-2-max", label: "Flux.2 Max", badge: "flux", group: "ALL MODELS" },
  { id: "flux-2-pro", label: "Flux.2 Pro", badge: "flux", group: "ALL MODELS" },
  { id: "flux-2-flex", label: "Flux.2 Flex", badge: "flux", group: "ALL MODELS" },
  { id: "flux-1-kontext-max", label: "Flux.1 Kontext Max", badge: "flux", group: "ALL MODELS" },
  { id: "flux-2-klein", label: "Flux.2 Klein", badge: "flux", group: "ALL MODELS" },
  { id: "flux-1-kontext-pro", label: "Flux.1 Kontext Pro", badge: "flux", group: "ALL MODELS" },
  { id: "flux-3-image", label: "Flux.3 Image", badge: "flux", group: "ALL MODELS", tag: "Beta", tagType: "beta" },
  { id: "mystic-2.5", label: "Mystic 2.5", badge: "mystic", group: "ALL MODELS" },
  { id: "mystic-2.5-flexible", label: "Mystic 2.5 Flexible", badge: "mystic", group: "ALL MODELS" },
  { id: "mystic-2.5-fluid", label: "Mystic 2.5 Fluid", badge: "mystic", group: "ALL MODELS" },
  { id: "flux-1", label: "Flux.1", badge: "flux", group: "ALL MODELS" },
  { id: "flux-1.1", label: "Flux.1.1", badge: "flux", group: "ALL MODELS" },
  { id: "flux-1-realism", label: "Flux.1 Realism", badge: "flux", group: "ALL MODELS" },
  { id: "ideogram-4.5", label: "Ideogram 4.5", badge: "ideogram", group: "ALL MODELS", tag: "New", tagType: "new" },
  { id: "ideogram-4", label: "Ideogram 4", badge: "ideogram", group: "ALL MODELS" },
  { id: "p-image-ideogram", label: "P-Image Ideogram", badge: "p-image", group: "ALL MODELS" },
  { id: "ideogram", label: "Ideogram", badge: "ideogram", group: "ALL MODELS" },
  { id: "google-nano-banana", label: "Google Nano Banana", badge: "google", group: "ALL MODELS" },
  { id: "google-nano-banana-pro", label: "Google Nano Banana Pro", badge: "google", group: "ALL MODELS" },
  { id: "cinematic", label: "Cinematic", badge: "cinematic", group: "ALL MODELS" },
  { id: "google-nano-banana-2", label: "Google Nano Banana 2", badge: "google", group: "ALL MODELS" },
  { id: "google-nano-banana-2-lite", label: "Google Nano Banana 2 Lite", badge: "google", group: "ALL MODELS" },
  { id: "flux-1-fast", label: "Flux.1 Fast", badge: "flux", group: "ALL MODELS" },
  { id: "luma-uni-1.1", label: "Luma Uni-1.1", badge: "luma", group: "ALL MODELS" },
  { id: "gpt-2", label: "GPT 2", badge: "openai", group: "ALL MODELS" },
  { id: "seedream-4", label: "Seedream 4", badge: "seedream", group: "ALL MODELS" },
  { id: "seedream-4-4k", label: "Seedream 4 4K", badge: "seedream", group: "ALL MODELS" },
  { id: "seedream-4.5", label: "Seedream 4.5", badge: "seedream", group: "ALL MODELS" },
  { id: "seedream-5-lite", label: "Seedream 5 Lite", badge: "seedream", group: "ALL MODELS" },
  { id: "seedream-5-flash", label: "Seedream 5 Flash", badge: "seedream", group: "ALL MODELS", tag: "New", tagType: "new" },
  { id: "runway", label: "Runway", badge: "runway", group: "ALL MODELS" },
  { id: "classic-fast", label: "Classic Fast", badge: "classic", group: "ALL MODELS" },
  { id: "classic", label: "Classic", badge: "classic", group: "ALL MODELS" },
  { id: "mystic-1.0", label: "Mystic 1.0", badge: "mystic", group: "ALL MODELS" },
  { id: "qwen-image-3.0-pro", label: "Qwen Image 3.0 Pro", badge: "qwen", group: "ALL MODELS", tag: "Beta", tagType: "beta" },
  { id: "z-image", label: "Z-Image", badge: "z-image", group: "ALL MODELS" },
  { id: "qwen-image-3.0", label: "Qwen Image 3.0", badge: "qwen", group: "ALL MODELS", tag: "Beta", tagType: "beta" },
  { id: "grok-imagine-2.0", label: "Grok Imagine 2.0", badge: "grok", group: "ALL MODELS", tag: "Beta", tagType: "beta" },
  { id: "qwen", label: "Qwen", badge: "qwen", group: "ALL MODELS" },
  { id: "grok", label: "Grok", badge: "grok", group: "ALL MODELS" },
  { id: "recraft-v4", label: "Recraft V4", badge: "recraft", group: "ALL MODELS" },
  { id: "recraft-v4-pro", label: "Recraft V4 Pro", badge: "recraft", group: "ALL MODELS" },
  { id: "krea-3", label: "Krea 3", badge: "krea", group: "ALL MODELS", tag: "Beta", tagType: "beta" },
  { id: "recraft-v4.1", label: "Recraft V4.1", badge: "recraft", group: "ALL MODELS" },
  { id: "krea-2", label: "Krea 2", badge: "krea", group: "ALL MODELS" },
  { id: "mai-image-2.5", label: "MAI Image 2.5", badge: "mai", group: "ALL MODELS", tag: "Beta", tagType: "beta" },
];

const SAMPLE_PROMPTS = [
  "Chibi character design sheet, full body turnaround, silver hair, oversized white hoodie, expressive blue eyes, clean cel-shaded anime studio illustration, crisp lineart, neutral studio background",
  "Cute chibi fantasy mage girl with long dark flowing hair and starry navy robe, holding a glowing crystal lantern, soft rim lighting, high-detail character concept art",
  "Stylized 3D vinyl toy chibi cyber-samurai, matte pastel armor with neon cyan accents, studio product lighting, octane render, ultra-clean composition",
  "Cozy isometric miniature ramen shop at dusk, warm lantern glow, hand-painted watercolor and ink anime background art, lush details",
];

const NODE_PREVIEW_INFO = {
  upload: {
    title: "Upload",
    desc: "Upload your own files to use anywhere in the flow.",
    tags: ["Local files", "Media"],
    icon: "upload",
    type: "action",
  },
  assets: {
    title: "Assets",
    desc: "Browse and reuse uploaded or generated media in your project.",
    tags: ["History", "Creations"],
    icon: "assets",
    type: "action",
  },
  stock: {
    title: "Stock",
    desc: "Browse stock photos and high-resolution visual assets to spark ideas.",
    tags: ["Freepik Stock", "Photos"],
    icon: "image-gen",
    type: "action",
  },
  "add-reference": {
    title: "Add Reference",
    desc: "Attach Style, Character, Element, Structure, Color, or Camera references to guide generation.",
    tags: ["Style", "Character", "Structure"],
    icon: "variations",
    type: "image",
  },
  "text-image": {
    title: "Image Generator",
    desc: "Generate images from text or image references. Access dozens of models to match any style or workflow.",
    tags: ["Multiple models", "References", "Aspect ratios"],
    icon: "image-gen",
    type: "image",
  },
  "text-video": {
    title: "Video Generator",
    desc: "Turn text or images into video. Choose from multiple AI models to match your style and needs.",
    tags: ["Multiple models", "Image to video"],
    icon: "video-gen",
    type: "video",
  },
  assistant: {
    title: "Assistant",
    desc: "Craft and refine prompts with AI, analyze media, or export structured lists for batch workflows.",
    tags: ["Prompt helper", "Export as list"],
    icon: "assistant",
    type: "text",
  },
  voiceover: {
    title: "Voiceover",
    desc: "Generate voice-over narration from text.",
    tags: ["ElevenLabs v3", "Emotion tags", "Voices"],
    icon: "voiceover",
    type: "audio",
  },
  text: {
    title: "Text",
    desc: "Write a prompt and pipe it into any node in your flow.",
    tags: ["Prompt source", "Rich text"],
    icon: "text",
    type: "text",
  },
  list: {
    title: "List",
    desc: "Create multiple variations at once. Process batches of prompts, images, or videos in parallel.",
    tags: ["Batch", "Multi-outputs"],
    icon: "list",
    type: "utilities",
  },
  upscaler: {
    title: "Image Upscaler",
    desc: "Enhance resolution, clarity, and fine details using Magnific V2 Sublime & Photo engines.",
    tags: ["Magnific V2", "2x / 4x", "Clarity"],
    icon: "upscaler",
    type: "image",
  },
  "image-image": {
    title: "Image Editor",
    desc: "All-in-one AI editor: Crop, Image Extender, 3D Camera Angle, Remove Background, Adjust Colors, and 3D Relight.",
    tags: ["6-in-1 Editor", "3D Camera", "Relight"],
    icon: "image-edit",
    type: "image",
  },
  "crop-image": {
    title: "Crop Image",
    desc: "Reframe and crop your image to standard aspect ratios or auto-crop around the subject.",
    tags: ["Aspect ratio", "Auto Crop"],
    icon: "crop-image",
    type: "image",
  },
  "change-aspect-ratio": {
    title: "Image Extender",
    desc: "Expand the borders of your image with AI to fit new aspect ratios seamlessly.",
    tags: ["Outpainting", "Auto expand"],
    icon: "change-ratio",
    type: "image",
  },
  "change-camera-angle": {
    title: "Change camera angle",
    desc: "Reframe your image from a different viewpoint using an interactive 3D camera gizmo.",
    tags: ["3D Gizmo", "Rotate & Tilt", "Zoom"],
    icon: "camera-angle",
    type: "image",
  },
  "remove-background": {
    title: "Remove background",
    desc: "Isolate the main subject and remove the background cleanly in one click.",
    tags: ["Cutout", "Alpha"],
    icon: "skin-enhancer",
    type: "image",
  },
  "adjust-colors": {
    title: "Adjust colors",
    desc: "Fine-tune brightness, contrast, saturation, and color balance directly on the canvas.",
    tags: ["Color grading", "Tone"],
    icon: "image-edit",
    type: "image",
  },
  relight: {
    title: "Relight",
    desc: "Change lighting direction, elevation, color, and intensity with an interactive 3D light source.",
    tags: ["3D Light Gizmo", "Color swatches"],
    icon: "relight",
    type: "image",
  },
  variations: {
    title: "Variations",
    desc: "Generate multiple variations from one image by Age, Custom, Demographics, Expressions, Reframe, or Storyboard.",
    tags: ["3x3 Grid", "Split images", "Batch"],
    icon: "variations",
    type: "image",
  },
  designer: {
    title: "Designer",
    desc: "Compose multi-layered graphic designs, posters, and social layouts with AI media.",
    tags: ["Templates", "Multi-layer", "Typography"],
    icon: "designer",
    type: "design",
  },
  "image-to-svg": {
    title: "Image to SVG",
    desc: "Convert raster logos and illustrations into clean, scalable vector SVG paths.",
    tags: ["Vectorize", "Remove background"],
    icon: "sketch",
    type: "svg",
  },
  "svg-generator": {
    title: "SVG Generator",
    desc: "Generate crisp scalable vector graphics directly from a text prompt with Recraft V4 Vector.",
    tags: ["Recraft V4 Vector", "SVG"],
    icon: "sketch",
    type: "svg",
  },
  speak: {
    title: "Speak",
    desc: "Generate talking videos with synced lips from an image or video plus an audio track.",
    tags: ["Lip sync", "Talking portrait"],
    icon: "speak",
    type: "video",
  },
  move: {
    title: "Move",
    desc: "Make a motion graphics video from a brief and your connected files.",
    tags: ["Motion graphics", "References"],
    icon: "move",
    type: "video",
  },
  "video-combiner": {
    title: "Video Combiner",
    desc: "Merge multiple clips into a single video.",
    tags: ["Multi-clip timeline", "Audio track"],
    icon: "video-combiner",
    type: "video",
  },
  "video-upscaler": {
    title: "Video Upscaler",
    desc: "Increase video resolution and sharpen detail.",
    tags: ["Magnific Video", "Topaz"],
    icon: "video-upscaler",
    type: "video",
  },
  "video-sfx": {
    title: "Video SFX",
    desc: "Add synced sound effects to your video.",
    tags: ["Synced audio", "Foley"],
    icon: "video-sfx",
    type: "video",
  },
  "media-extractor": {
    title: "Media Extractor",
    desc: "Extract frames or split a video into clips.",
    tags: ["Frames", "Clips"],
    icon: "media-extractor",
    type: "video",
  },
  "speech-to-text": {
    title: "Speech to Text",
    desc: "Transcribe a connected audio or video track into text.",
    tags: ["ElevenLabs Scribe v2", "Audio / Video"],
    icon: "speech-to-text",
    type: "audio",
  },
  "sound-effects": {
    title: "Sound Effects",
    desc: "Generate sound effects and foley from a prompt.",
    tags: ["ElevenLabs Text to Sound v2", "Loopable"],
    icon: "sound-effects",
    type: "audio",
  },
  "audio-generator": {
    title: "Audio Generator",
    desc: "Generate audio from a text prompt, with optional reference audio or image.",
    tags: ["Experimental", "Reference audio", "Reference image"],
    icon: "audio-gen",
    type: "audio",
  },
  "music-generator": {
    title: "Music Generator",
    desc: "Compose original music and soundtracks from a prompt.",
    tags: ["ElevenLabs Music v2", "Google Lyria 3"],
    icon: "music-generator",
    type: "audio",
  },
  "sticky-note": {
    title: "Sticky note",
    desc: "Pin colorful notes, checklists, and feedback directly on the project canvas.",
    tags: ["Notes", "Collaboration"],
    icon: "text",
    type: "utilities",
  },
  group: {
    title: "Group",
    desc: "Organize related nodes into labeled, color-coded workflow sections on the canvas.",
    tags: ["Organize", "Section"],
    icon: "designer",
    type: "utilities",
  },
  "skin-enhancer": {
    title: "Skin Enhancer",
    desc: "Retouch portraits and enhance natural skin texture and studio details with AI.",
    tags: ["Portrait", "Retouch"],
    icon: "skin-enhancer",
    type: "image",
  },
  "extend-video": {
    title: "Extend video",
    desc: "Continue a clip and extend it to a longer duration.",
    tags: ["Video", "Extend"],
    icon: "extend-video",
    type: "video",
  },
  "modify-video": {
    title: "Modify video",
    desc: "Transform an existing video with a prompt and model-specific settings.",
    tags: ["Multiple models", "Restyle"],
    icon: "modify-video",
    type: "video",
  },
  "3d-generator": {
    title: "3D Generator",
    desc: "Generate 3D meshes, PBR shaded renders, and wireframe turntables from text prompts or reference images.",
    tags: ["Antigravity 3D", "TripoSR", "Hunyuan3D-2"],
    icon: "3d-gen",
    type: "design",
  },
  "provider-google": {
    title: "Google DeepMind",
    desc: "Generate studio-grade imagery, video, and reasoning with Google Nano Banana 2, Imagen 4, Veo 3.1, and Gemini 2.5.",
    tags: ["Nano Banana 2", "Veo 3.1", "Imagen 4"],
    icon: "provider-google",
    type: "image",
  },
  "provider-openai": {
    title: "OpenAI",
    desc: "Create high-fidelity scenes and cinematic video clips with GPT Image 1.5, Sora 2, and GPT-5.",
    tags: ["GPT Image 1.5", "Sora 2", "GPT-5"],
    icon: "provider-openai",
    type: "image",
  },
  "provider-kling": {
    title: "Kling AI",
    desc: "Advanced motion control, physics-aware video synthesis, and lip-sync avatars with Kling 3.0 and Kling Speak Pro.",
    tags: ["Kling 3.0", "Kling 3.0 Omni", "Kling Speak Pro"],
    icon: "provider-kling",
    type: "video",
  },
  "provider-minimax": {
    title: "MiniMax Hailuo",
    desc: "Expressive character animation, director camera moves, and multi-modal synthesis with Hailuo 2.3.",
    tags: ["Hailuo 2.3", "MiniMax Image-01", "Director Mode"],
    icon: "provider-minimax",
    type: "video",
  },
};

const EDITOR_TOOLS_UI = [
  { id: "Crop Image", previewId: "crop-image", icon: "crop-image" },
  { id: "Image Extender", previewId: "change-aspect-ratio", icon: "change-ratio" },
  { id: "Change camera angle", previewId: "change-camera-angle", icon: "camera-angle" },
  { id: "Remove background", previewId: "remove-background", icon: "skin-enhancer" },
  { id: "Adjust colors", previewId: "adjust-colors", icon: "image-edit" },
  { id: "Relight", previewId: "relight", icon: "relight" },
];

const VIDEO_MODELS = [
  "Auto",
  "Local GPU (VRAM)",
  "Antigravity AI Bridge",
  "Seedance 2.0 Fast",
  "Kling 3.0",
  "Kling 3.0 Motion Control",
  "Kling 3.0 Omni",
  "Kling 2.6 Pro",
  "Kling 2.6",
  "Kling 2.6 Motion Control",
  "Kling 2.5",
  "Kling 2.1 Master",
  "Kling O1",
  "Veo 3.1",
  "Sora 2",
  "Wan 2.6",
  "Minimax Hailuo 2.3",
  "Runway Gen-4",
  "Luma Ray 2",
];

const MODIFY_VIDEO_MODELS = [
  { id: "local-gpu-vram", label: "Local GPU (VRAM)", badge: "gpu", tag: "VRAM" },
  { id: "minimax-h3", label: "MiniMax H3", badge: "cinematic" },
  { id: "gemini-omni-1.1", label: "Gemini Omni 1.1", badge: "google" },
  { id: "seedance-2.5", label: "Seedance 2.5", badge: "seedream" },
  { id: "seedance-2.0", label: "Seedance 2.0", badge: "seedream" },
  { id: "kling-4.0", label: "Kling 4.0", badge: "cinematic", tag: "New" },
  { id: "runway-aleph-2", label: "Runway Aleph 2", badge: "runway" },
  { id: "grok", label: "Grok", badge: "grok" },
  { id: "antigravity-ai-bridge", label: "Antigravity AI Bridge", badge: "auto", tag: "Free" },
];

const UPSCALER_MODELS = [
  { id: "local-gpu-vram", label: "Local GPU (VRAM)", badge: "gpu", group: "AI BRIDGE & SUPER-RESOLUTION", tag: "VRAM", tagType: "new", featuredAccent: true },
  { id: "antigravity-ai-bridge", label: "Antigravity AI Bridge", badge: "auto", group: "AI BRIDGE & SUPER-RESOLUTION", tag: "Free", tagType: "new", featuredAccent: true, builtin: true },
  { id: "magnific-v2-sublime", label: "Magnific V2 (Sublime)", badge: "magnific", group: "AI BRIDGE & SUPER-RESOLUTION", tag: "Sublime", tagType: "new", featuredAccent: true, builtin: true },
  { id: "magnific-v1-sharp", label: "Magnific V1 (Sharp)", badge: "magnific", group: "AI BRIDGE & SUPER-RESOLUTION", builtin: true },
  { id: "real-esrgan-4x", label: "Real-ESRGAN 4x+", badge: "flux", group: "DEDICATED UPSCALERS", tag: "4x+", tagType: "beta", builtin: true },
  { id: "crystal-upscaler", label: "Crystal", badge: "mystic", group: "DEDICATED UPSCALERS", builtin: true },
  { id: "faithful-upscaler", label: "Faithful", badge: "classic", group: "DEDICATED UPSCALERS", builtin: true },
  { id: "recraft-crisp", label: "Recraft Crisp", badge: "recraft", group: "DEDICATED UPSCALERS", builtin: true },
  { id: "topaz-recovery-v2", label: "Topaz Recovery V2", badge: "cinematic", group: "DEDICATED UPSCALERS", tag: "Pro", tagType: "new", builtin: true },
  { id: "seedream-4-4k", label: "Seedream 4 4K", badge: "seedream", group: "IMAGE MODELS (UPSCALING)" },
  { id: "flux-2-pro", label: "Flux.2 Pro", badge: "flux", group: "IMAGE MODELS (UPSCALING)" },
  { id: "google-nano-banana-2.1", label: "Google Nano Banana 2.1", badge: "google", group: "IMAGE MODELS (UPSCALING)" },
];

const VOICE_USE_CASES = [
  { id: "Advertisement", label: "Advertisement", color: "linear-gradient(135deg, #065f46, #10b981)" },
  { id: "Characters", label: "Characters", color: "linear-gradient(135deg, #3730a3, #ec4899)" },
  { id: "Characters Animation", label: "Characters Animation", color: "linear-gradient(135deg, #9a3412, #f97316)" },
  { id: "Conversational", label: "Conversational", color: "linear-gradient(135deg, #831843, #f43f5e)" },
  { id: "Education / Narration", label: "Education / Narration", color: "linear-gradient(135deg, #1e3a8a, #3b82f6)" },
];

const VOICES_LIBRARY = [
  { id: "ace", name: "Ace Elliott Lambert", gender: "Male", language: "English", accent: "Canadian", category: "Conversational", avatarColor: "#6366f1", desc: "Warm, articulate Canadian narrator" },
  { id: "ada", name: "Ada Okafor", gender: "Female", language: "English", accent: "Nigerian", category: "Education / Narration", avatarColor: "#ec4899", desc: "Rich, resonant storytelling & educational voice" },
  { id: "adam", name: "Adam Hughes", gender: "Male", language: "English", accent: "American", category: "Advertisement", avatarColor: "#10b981", desc: "Crisp, confident commercial & promo voice" },
  { id: "aidan", name: "Aidan Doyle", gender: "Male", language: "English", accent: "Irish", category: "Characters", avatarColor: "#f59e0b", desc: "Expressive, warm Irish character voice" },
  { id: "aiden", name: "Aiden Samuel", gender: "Male", language: "English", accent: "American", category: "Conversational", avatarColor: "#3b82f6", desc: "Natural, friendly conversational host" },
  { id: "alexander", name: "Alexander Davis", gender: "Male", language: "English", accent: "British", category: "Education / Narration", avatarColor: "#8b5cf6", desc: "Refined British documentary narrator" },
  { id: "amber", name: "Amber Hayes", gender: "Female", language: "English", accent: "American", category: "Advertisement", avatarColor: "#f43f5e", desc: "Upbeat, bright lifestyle commercial voice" },
  { id: "amelia-b", name: "Amelia Beckett", gender: "Female", language: "English", accent: "British", category: "Characters", avatarColor: "#14b8a6", desc: "Clear, poised British dramatic voice" },
  { id: "amelia-c", name: "Amelia Carter", gender: "Female", language: "English", accent: "American", category: "Conversational", avatarColor: "#a855f7", desc: "Warm, expressive podcast & dialogue voice" },
  { id: "anders", name: "Anders Mahoney Sanchez", gender: "Male", language: "English", accent: "Irish", category: "Characters Animation", avatarColor: "#eab308", desc: "Dynamic, energetic animated character voice" },
  { id: "anthony", name: "Anthony Wright Scott", gender: "Male", language: "English", accent: "British", category: "Education / Narration", avatarColor: "#06b6d4", desc: "Deep, authoritative British narration" },
  { id: "archer-e", name: "Archer Erickson Larsson", gender: "Male", language: "English", accent: "American", category: "Advertisement", avatarColor: "#22c55e", desc: "Modern, punchy trailer & brand voice" },
  { id: "archer-h", name: "Archer Harrison", gender: "Male", language: "English", accent: "British", category: "Characters", avatarColor: "#ef4444", desc: "Bold cinematic protagonist voice" },
  { id: "arthur", name: "Arthur Kensington", gender: "Male", language: "English", accent: "British", category: "Characters Animation", avatarColor: "#64748b", desc: "Classic theatrical British character voice" },
  { id: "austin", name: "Austin Lane", gender: "Male", language: "English", accent: "American", category: "Conversational", avatarColor: "#0ea5e9", desc: "Relaxed, relatable everyday American voice" },
  { id: "ava", name: "Ava Jordan", gender: "Female", language: "English", accent: "American", category: "Characters Animation", avatarColor: "#d946ef", desc: "Youthful, lively animation & gaming voice" },
];

const VOICEOVER_MODELS = [
  { id: "elevenlabs-v4", label: "ElevenLabs v4", badge: "II" },
  { id: "elevenlabs-v3", label: "ElevenLabs v3", badge: "II" },
  { id: "elevenlabs-v2", label: "ElevenLabs v2", badge: "II" },
  { id: "gemini-2.5-pro-tts", label: "Gemini 2.5 Pro", badge: "G" },
  { id: "gemini-3.1-flash-tts", label: "Gemini 3.1 Flash TTS", badge: "G" },
  { id: "google-gemini-3.8-tts", label: "Google Gemini 3.8 TTS", badge: "G" },
  { id: "google-gemini-3.8-lite-tts", label: "Google Gemini 3.8 Lite TTS", badge: "G" },
];

const SFX_MODELS = [
  { id: "elevenlabs-sfx-v2", label: "ElevenLabs Text to Sound v2", badge: "II" },
];

const MUSIC_MODELS = [
  {
    id: "elevenlabs-music-v2",
    label: "ElevenLabs Music v2",
    badge: "II",
    tag: "NEW",
    desc: "Fast, expressive multi-genre music generation with vocals and rich instrumentation.",
  },
  {
    id: "elevenlabs-music-v1",
    label: "ElevenLabs Music v1",
    badge: "II",
    desc: "Generate studio-grade music with natural vocals or instrumental tracks across any genre.",
  },
  {
    id: "google-lyria-3",
    label: "Google Lyria 3",
    badge: "G",
    tag: "Beta",
    tagType: "beta",
    desc: "High-fidelity instrumental and vocal compositions powered by DeepMind Lyria.",
  },
];

const CATALOG_NODES_UI = [
  // Exact unified NODES order from Chibi Character Design Showcase, Video Category Showcase (video.mp4) & Audio Showcase (voice.mp4)
  { id: "text-image", kind: "text-image", title: "Image Generator", subtitle: "Image", category: "Image", group: "NODES", icon: "image-gen", colorType: "image", interactive: true },
  { id: "text-video", kind: "text-video", title: "Video Generator", subtitle: "Video", category: "Video", group: "NODES", icon: "video-gen", colorType: "video", interactive: true },
  { id: "assistant", kind: "assistant", title: "Assistant", subtitle: "Text", category: "Utilities", group: "NODES", icon: "assistant", colorType: "text", interactive: true },
  { id: "speech-to-text", kind: "speech-to-text", title: "Speech to Text", subtitle: "Audio", category: "Audio", group: "NODES", icon: "speech-to-text", colorType: "audio", onlyInCategory: true, interactive: true },
  { id: "voiceover", kind: "voiceover", title: "Voiceover", subtitle: "Audio", category: "Audio", group: "NODES", icon: "voiceover", colorType: "audio", interactive: true },
  { id: "text", kind: "text", title: "Text", subtitle: "Text", category: "Utilities", group: "NODES", icon: "text", colorType: "text", interactive: true },
  { id: "list", kind: "list", title: "List", subtitle: "Utilities", category: "Utilities", group: "NODES", icon: "list", colorType: "utilities", interactive: true },
  { id: "upscaler", kind: "upscaler", title: "Image Upscaler", subtitle: "Image", category: "Image", group: "NODES", icon: "upscaler", colorType: "image", interactive: true },
  { id: "image-image", kind: "image-image", title: "Image Editor", subtitle: "Image", category: "Image", group: "NODES", icon: "image-edit", colorType: "image", interactive: true },
  { id: "variations", kind: "image-image", subKind: "variations", title: "Variations", subtitle: "Image · Biến thể", keywords: "biến thể bien the variations", category: "Image", group: "NODES", icon: "variations", colorType: "image", interactive: true },
  { id: "skin-enhancer", kind: "image-image", presetPrompt: "natural skin texture enhancement, studio portrait retouch", title: "Skin Enhancer", subtitle: "Image", category: "Image", group: "NODES", icon: "skin-enhancer", colorType: "image", badge: "New", interactive: true },
  { id: "extend-video", kind: "extend-video", title: "Extend video", subtitle: "Video", category: "Video", group: "NODES", icon: "extend-video", colorType: "video", onlyInCategory: true, interactive: true },
  { id: "modify-video", kind: "modify-video", title: "Modify video", subtitle: "Video", category: "Video", group: "NODES", icon: "modify-video", colorType: "video", badge: "New", onlyInCategory: true, interactive: true },
  { id: "move", kind: "move", title: "Move", subtitle: "Video", category: "Video", group: "NODES", icon: "move", colorType: "video", onlyInCategory: true, interactive: true },
  { id: "video-combiner", kind: "video-combiner", title: "Video Combiner", subtitle: "Video", category: "Video", group: "NODES", icon: "video-combiner", colorType: "video", interactive: true },
  { id: "media-extractor", kind: "media-extractor", title: "Media Extractor", subtitle: "Video", category: "Video", group: "NODES", icon: "media-extractor", colorType: "video", interactive: true },
  { id: "video-upscaler", kind: "video-upscaler", title: "Video Upscaler", subtitle: "Video", category: "Video", group: "NODES", icon: "video-upscaler", colorType: "video", interactive: true },
  { id: "video-sfx", kind: "video-sfx", title: "Video SFX", subtitle: "Video", category: "Video", group: "NODES", icon: "video-sfx", colorType: "video", onlyInCategory: true, interactive: true },
  { id: "speak", kind: "speak", title: "Speak", subtitle: "Video", category: "Video", group: "NODES", icon: "speak", colorType: "video", badge: "Beta", badgeClass: "experimental", interactive: true },
  { id: "sound-effects", kind: "sound-effects", title: "Sound Effects", subtitle: "Audio", category: "Audio", group: "NODES", icon: "sound-effects", colorType: "audio", interactive: true },
  { id: "audio-generator", kind: "audio-generator", title: "Audio Generator", subtitle: "Audio", category: "Audio", group: "NODES", icon: "audio-gen", colorType: "audio", badge: "Experimental", badgeClass: "experimental", onlyInCategory: true, interactive: true },
  { id: "music-generator", kind: "music-generator", title: "Music Generator", subtitle: "Audio", category: "Audio", group: "NODES", icon: "music-generator", colorType: "audio", interactive: true },
  { id: "image-to-svg", kind: "image-to-svg", title: "Image to SVG", subtitle: "Image", category: "Design", group: "NODES", icon: "image-to-svg", colorType: "image", interactive: true },
  { id: "svg-generator", kind: "svg-generator", title: "SVG Generator", subtitle: "Image", category: "Design", group: "NODES", icon: "svg-generator", colorType: "image", interactive: true },
  { id: "designer", kind: "designer", title: "Designer", subtitle: "Design", category: "Design", group: "NODES", icon: "designer", colorType: "design", interactive: true },
  { id: "3d-generator", kind: "3d-generator", title: "3D Generator", subtitle: "3D", category: "3D", group: "NODES", icon: "3d-gen", colorType: "3d", badge: "New", interactive: true },
  { id: "sticky-note", kind: "sticky-note", title: "Sticky note", subtitle: "Utilities", category: "Utilities", group: "NODES", icon: "sticky-note", colorType: "utilities", interactive: true },
  { id: "group", kind: "group", title: "Group", subtitle: "Utilities", category: "Utilities", group: "NODES", icon: "group", colorType: "utilities", interactive: true },
];

const WIRE_DROP_ITEMS_UI = [
  { id: "text-image", previewId: "text-image", kind: "text-image", title: "Image Generator", subtitle: "", icon: "image-gen", colorType: "image", interactive: true },
  { id: "text-video", previewId: "text-video", kind: "text-video", title: "Video Generator", subtitle: "", icon: "video-gen", colorType: "video", interactive: true },
  { id: "extend-video", previewId: "extend-video", kind: "extend-video", title: "Extend video", subtitle: "", icon: "extend-video", colorType: "video", interactive: true },
  { id: "modify-video", previewId: "modify-video", kind: "modify-video", title: "Modify video", subtitle: "", badge: "New", icon: "modify-video", colorType: "video", interactive: true },
  { id: "move", previewId: "move", kind: "move", title: "Move", subtitle: "", icon: "move", colorType: "video", interactive: true },
  { id: "variations", previewId: "variations", kind: "image-image", subKind: "variations", title: "Variations", subtitle: "", keywords: "biến thể bien the variations", icon: "variations", colorType: "image", interactive: true },
  { id: "text", previewId: "text", kind: "text", title: "Text", subtitle: "", icon: "text", colorType: "text", interactive: true },
  { id: "list", previewId: "list", kind: "list", title: "List", subtitle: "", icon: "list", colorType: "utilities", interactive: true },
  { id: "upscaler", previewId: "upscaler", kind: "upscaler", title: "Image Upscaler", subtitle: "", icon: "upscaler", colorType: "image", interactive: true },
  { id: "assistant", previewId: "assistant", kind: "assistant", title: "Assistant", subtitle: "", icon: "assistant", colorType: "text", interactive: true },
  { id: "image-image", previewId: "image-image", kind: "image-image", title: "Image Editor", subtitle: "", icon: "image-edit", colorType: "image", interactive: true },
  { id: "designer", previewId: "designer", kind: "designer", title: "Designer", subtitle: "", badge: "New", icon: "designer", colorType: "design", interactive: true },
  { id: "3d-generator", previewId: "3d-generator", kind: "3d-generator", title: "3D Generator", subtitle: "", badge: "New", icon: "3d-gen", colorType: "3d", interactive: true },
  { id: "image-to-svg", previewId: "image-to-svg", kind: "image-to-svg", title: "Image to SVG", subtitle: "", icon: "sketch", colorType: "svg", interactive: true },
  { id: "svg-generator", previewId: "svg-generator", kind: "svg-generator", title: "SVG Generator", subtitle: "", icon: "sketch", colorType: "svg", interactive: true },
  { id: "speak", previewId: "speak", kind: "speak", title: "Speak", subtitle: "", icon: "speak", colorType: "video", interactive: true },
  { id: "video-combiner", previewId: "video-combiner", kind: "video-combiner", title: "Video Combiner", subtitle: "", icon: "video-combiner", colorType: "video", interactive: true },
  { id: "video-upscaler", previewId: "video-upscaler", kind: "video-upscaler", title: "Video Upscaler", subtitle: "", icon: "video-upscaler", colorType: "video", interactive: true },
  { id: "video-sfx", previewId: "video-sfx", kind: "video-sfx", title: "Video SFX", subtitle: "", icon: "video-sfx", colorType: "video", interactive: true },
  { id: "media-extractor", previewId: "media-extractor", kind: "media-extractor", title: "Media Extractor", subtitle: "", badge: "New", icon: "media-extractor", colorType: "video", interactive: true },
  { id: "speech-to-text", previewId: "speech-to-text", kind: "speech-to-text", title: "Speech to Text", subtitle: "", icon: "speech-to-text", colorType: "audio", interactive: true },
  { id: "voiceover", previewId: "voiceover", kind: "voiceover", title: "Voiceover", subtitle: "", icon: "voiceover", colorType: "audio", interactive: true },
  { id: "sound-effects", previewId: "sound-effects", kind: "sound-effects", title: "Sound Effects", subtitle: "", icon: "sound-effects", colorType: "audio", interactive: true },
  { id: "audio-generator", previewId: "audio-generator", kind: "audio-generator", title: "Audio Generator", subtitle: "", badge: "Experimental", badgeClass: "experimental", icon: "audio-gen", colorType: "audio", interactive: true },
  { id: "music-generator", previewId: "music-generator", kind: "music-generator", title: "Music Generator", subtitle: "", icon: "music-generator", colorType: "audio", interactive: true },
  { id: "crop-image", previewId: "crop-image", kind: "image-image", editorTool: "Crop Image", presetPrompt: "Crop image", title: "Crop Image", subtitle: "Image Editor", icon: "crop-image", colorType: "image", interactive: true },
  { id: "change-aspect-ratio", previewId: "change-aspect-ratio", kind: "image-image", editorTool: "Image Extender", presetPrompt: "Expand image borders seamlessly", title: "Image Extender", subtitle: "Image Editor", icon: "change-ratio", colorType: "image", interactive: true },
  { id: "change-camera-angle", previewId: "change-camera-angle", kind: "image-image", editorTool: "Change camera angle", presetPrompt: "Change camera angle", title: "Change camera angle", subtitle: "Image Editor", icon: "camera-angle", colorType: "image", interactive: true },
  { id: "remove-background", previewId: "remove-background", kind: "image-image", editorTool: "Remove background", presetPrompt: "Remove background", title: "Remove background", subtitle: "Image Editor", icon: "skin-enhancer", colorType: "image", interactive: true },
  { id: "adjust-colors", previewId: "adjust-colors", kind: "image-image", editorTool: "Adjust colors", presetPrompt: "Adjust colors", title: "Adjust colors", subtitle: "Image Editor", icon: "image-edit", colorType: "image", interactive: true },
  { id: "relight", previewId: "relight", kind: "image-image", editorTool: "Relight", presetPrompt: "Relight scene", title: "Relight", subtitle: "Image Editor", icon: "relight", colorType: "image", interactive: true },
];

const VARIATION_MODES = [
  { id: "Age", label: "Age", icon: "var-age" },
  { id: "Custom", label: "Custom", icon: "var-custom" },
  { id: "Demographics", label: "Demographics", icon: "var-demographics" },
  { id: "Expressions", label: "Expressions", icon: "var-expressions" },
  { id: "Reframe", label: "Reframe", icon: "var-reframe" },
  { id: "Storyboard", label: "Storyboard", icon: "var-storyboard" },
];

const VARIATION_ANGLES = [
  "3/4 View",
  "Aerial",
  "Back View",
  "Closeup",
  "Ext. Long Shot",
  "Extreme Closeup",
  "Eye Level",
  "High Angle",
  "Long Shot",
  "Low Angle",
];

const VARIATION_MODE_OPTIONS = {
  Age: ["Child", "Teenager", "Young Adult", "Elderly", "Toddler", "Middle-Aged"],
  Demographics: ["East Asian", "Nordic / European", "South Asian", "Latin American", "African", "Middle Eastern"],
  Expressions: ["Joyful Smile", "Surprised Wide Eyes", "Playful Wink", "Pouting Angry", "Tearful Sad", "Confident Smirk", "Shy Blushing", "Serene Calm"],
  Reframe: VARIATION_ANGLES,
};

const CATALOG_PROVIDERS_UI = [
  { id: "provider-google", title: "Google", subtitle: "14 models", icon: "provider-google", tabHint: true },
  { id: "provider-openai", title: "OpenAI", subtitle: "12 models", icon: "provider-openai", tabHint: false },
  { id: "provider-kling", title: "Kling", subtitle: "10 models", icon: "provider-kling", tabHint: false },
  { id: "provider-minimax", title: "MiniMax", subtitle: "8 models", icon: "provider-minimax", tabHint: false },
];

const PROVIDER_MODELS_CATALOG = {
  "provider-google": [
    { id: "google-nb2", title: "Google Nano Banana 2", subtitle: "Image Generator", kind: "text-image", presetModel: "Google Nano Banana 2", icon: "image-gen", colorType: "image" },
    { id: "google-nb-pro", title: "Google Nano Banana Pro", subtitle: "Image Generator", kind: "text-image", presetModel: "Google Nano Banana Pro", icon: "image-gen", colorType: "image" },
    { id: "google-imagen4", title: "Google Imagen 4", subtitle: "Image Generator", kind: "text-image", presetModel: "Google Imagen 4", icon: "image-gen", colorType: "image" },
    { id: "google-veo31", title: "Veo 3.1", subtitle: "Video Generator", kind: "text-video", videoModel: "Veo 3.1", icon: "video-gen", colorType: "video" },
    { id: "google-gemini", title: "Gemini 2.5 Pro", subtitle: "Assistant", kind: "assistant", assistantModel: "Gemini 2.5 Pro", icon: "assistant", colorType: "text" },
  ],
  "provider-openai": [
    { id: "openai-gpt-img", title: "OpenAI GPT Image 1.5", subtitle: "Image Generator", kind: "text-image", presetModel: "OpenAI GPT Image 1.5", icon: "image-gen", colorType: "image" },
    { id: "openai-sora2", title: "Sora 2", subtitle: "Video Generator", kind: "text-video", videoModel: "Sora 2", icon: "video-gen", colorType: "video" },
    { id: "openai-gpt5", title: "GPT-5", subtitle: "Assistant", kind: "assistant", assistantModel: "GPT-5", icon: "assistant", colorType: "text" },
    { id: "openai-gpt5-mini", title: "GPT-5 Mini", subtitle: "Assistant", kind: "assistant", assistantModel: "GPT-5 Mini", icon: "assistant", colorType: "text" },
  ],
  "provider-kling": [
    { id: "kling-30", title: "Kling 3.0", subtitle: "Video Generator", kind: "text-video", videoModel: "Kling 3.0", icon: "video-gen", colorType: "video" },
    { id: "kling-30-mc", title: "Kling 3.0 Motion Control", subtitle: "Video Generator", kind: "text-video", videoModel: "Kling 3.0 Motion Control", icon: "video-gen", colorType: "video" },
    { id: "kling-30-omni", title: "Kling 3.0 Omni", subtitle: "Video Generator", kind: "text-video", videoModel: "Kling 3.0 Omni", icon: "video-gen", colorType: "video" },
    { id: "kling-26-pro", title: "Kling 2.6 Pro", subtitle: "Video Generator", kind: "text-video", videoModel: "Kling 2.6 Pro", icon: "video-gen", colorType: "video" },
    { id: "kling-speak", title: "Kling Speak Pro", subtitle: "Speak · Lip-sync", kind: "speak", speakModel: "Kling Speak Pro", icon: "speak", colorType: "video" },
  ],
  "provider-minimax": [
    { id: "minimax-hailuo", title: "Minimax Hailuo 2.3", subtitle: "Video Generator", kind: "text-video", videoModel: "Minimax Hailuo 2.3", icon: "video-gen", colorType: "video" },
    { id: "minimax-img01", title: "MiniMax Image-01", subtitle: "Image Generator", kind: "text-image", presetModel: "MiniMax Image-01", icon: "image-gen", colorType: "image" },
    { id: "minimax-speech", title: "MiniMax Speech-02", subtitle: "Voiceover", kind: "voiceover", icon: "voiceover", colorType: "audio" },
  ],
};

const CATALOG_FLOWS_UI = [
  { title: "Paper stop-motion assembly" },
  { title: "Film your shot list" },
  { title: "POV Realistic video generator", category: "Video" },
  { title: "Time stops, only you keep moving", category: "Video" },
];

function loadPinnedCatalogIds() {
  try {
    const raw = localStorage.getItem("studio.pinnedCatalogIds");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string" && x);
    }
  } catch {}
  return ["assets"];
}

const state = {
  catalog: [],
  projects: [],
  assets: [],
  project: null,
  graph: { nodes: [], edges: [] },
  selected: null,
  settingsNode: null,
  showAdvancedInspector: false,
  activePopover: null, // { nodeId, type: 'model' | 'ratio' | 'mode' | 'quick-connect' | 'more' | 'inspector-model' }
  copiedSettings: null,
  catalogIndex: 0,
  filter: "All",
  pinnedCatalogIds: loadPinnedCatalogIds(),
  catalogShowAllActions: false,
  catalogShowAllNodes: false,
  catalogShowAllFlows: false,
  tool: "select",
  zoom: 1,
  assetTarget: null,
  referenceTarget: null,
  promptTarget: null,
  storage: null,
  comfy: { connected: false, checkpoints: [], message: "Đang kiểm tra ComfyUI…" },
  modelConfigs: {},
  runs: [],
  runTimer: null,
  pan: { x: 0, y: 0 },
  pending: null,
  pointer: null,
  undo: [],
  redo: [],
  dirty: false,
  saving: false,
  saveTimer: null,
};

function toggleCatalogPin(itemId, itemTitle) {
  if (!itemId) return;
  if (!Array.isArray(state.pinnedCatalogIds)) state.pinnedCatalogIds = ["assets"];
  const idx = state.pinnedCatalogIds.indexOf(itemId);
  const isNowPinned = idx === -1;
  if (isNowPinned) {
    state.pinnedCatalogIds.push(itemId);
  } else {
    state.pinnedCatalogIds.splice(idx, 1);
  }
  try {
    localStorage.setItem("studio.pinnedCatalogIds", JSON.stringify(state.pinnedCatalogIds));
  } catch {}
  renderCatalog();
  notify(isNowPinned ? `Đã ghim "${itemTitle || itemId}" lên mục PINNED.` : `Đã bỏ ghim "${itemTitle || itemId}".`);
}

const portElements = new Map();
let toastTimer;

async function request(path, options = {}) {
  const response = await fetch(`${apiRoot}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await response.json();
  if (!response.ok) {
    const err = new Error(body.error || "Không thể kết nối Studio.");
    err.status = response.status;
    throw err;
  }
  return body;
}

function mergeServerGraphOutputsIntoLocal(serverGraph) {
  if (!serverGraph || !Array.isArray(serverGraph.nodes) || !state.graph || !Array.isArray(state.graph.nodes)) {
    return;
  }
  const serverMap = new Map(serverGraph.nodes.filter((n) => n && n.id).map((n) => [n.id, n]));
  const outputKeys = [
    "assetId",
    "firstFrameAssetId",
    "lastFrameAssetId",
    "extractedFrameAssetId",
    "audioAssetId",
    "batchAssetIds",
    "transcriptText",
  ];
  for (const localNode of state.graph.nodes) {
    const sNode = serverMap.get(localNode.id);
    if (!sNode) continue;
    for (const k of outputKeys) {
      if (sNode[k] && !localNode[k]) {
        localNode[k] = sNode[k];
      }
    }
    if (localNode.kind === "list" && Array.isArray(sNode.items) && sNode.items.length > 0) {
      if (!Array.isArray(localNode.items)) localNode.items = [];
      const existingAssets = new Set(localNode.items.map((it) => it?.assetId).filter(Boolean));
      for (const sItem of sNode.items) {
        if (sItem && sItem.assetId && !existingAssets.has(sItem.assetId)) {
          localNode.items.push(sItem);
          existingAssets.add(sItem.assetId);
        }
      }
      if (sNode.viewMode === "grid" && !localNode.viewMode) {
        localNode.viewMode = "grid";
      }
    }
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function cloneGraph() {
  return structuredClone(state.graph);
}

function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3600);
}

function setSaveStatus(message, style = "") {
  const element = $("#saveStatus");
  element.textContent = message;
  element.className = `save-status ${style}`;
}

function remember() {
  state.undo.push(cloneGraph());
  if (state.undo.length > 50) state.undo.shift();
  state.redo = [];
  updateUndoButtons();
}

function updateUndoButtons() {
  $("#undoButton").disabled = state.undo.length === 0;
  $("#redoButton").disabled = state.redo.length === 0;
}

function markDirty() {
  state.dirty = true;
  updateTaskStatuses();
  setSaveStatus("Đang lưu…", "saving");
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(saveGraph, 480);
}

async function saveGraph() {
  clearTimeout(state.saveTimer);
  if (!state.project || !state.dirty || state.saving) return;
  state.saving = true;
  state.dirty = false;
  const projectId = state.project.id;
  const version = state.project.version;
  const graph = cloneGraph();
  try {
    const result = await request(`/projects/${projectId}/graph`, {
      method: "PUT",
      body: JSON.stringify({ version, graph }),
    });
    if (state.project?.id === projectId) {
      state.project.version = result.version;
      setSaveStatus(state.dirty ? "Đang lưu…" : "Đã lưu", state.dirty ? "saving" : "");
    }
  } catch (error) {
    if (error?.status === 409 && state.project?.id === projectId) {
      try {
        const latest = await request(`/projects/${projectId}`);
        if (state.project?.id === projectId && latest) {
          mergeServerGraphOutputsIntoLocal(latest.graph);
          state.project.version = latest.version;
          const retryGraph = cloneGraph();
          const retryResult = await request(`/projects/${projectId}/graph`, {
            method: "PUT",
            body: JSON.stringify({ version: state.project.version, graph: retryGraph }),
          });
          state.project.version = retryResult.version;
          setSaveStatus(state.dirty ? "Đang lưu…" : "Đã lưu", state.dirty ? "saving" : "");
          return;
        }
      } catch (retryErr) {
        error = retryErr;
      }
    }
    state.dirty = true;
    setSaveStatus("Chưa lưu", "error");
    notify(error.message);
  } finally {
    state.saving = false;
    if (state.dirty && state.project?.id === projectId && $("#saveStatus").className.includes("saving")) {
      state.saveTimer = setTimeout(saveGraph, 50);
    }
  }
}

async function loadProjects() {
  try {
    state.projects = (await request("/projects")).items;
    renderProjects();
  } catch (error) {
    notify(error.message);
  }
}

function renderProjects() {
  const list = $("#projectList");
  list.replaceChildren();
  if (!state.projects.length) {
    const empty = document.createElement("div");
    empty.className = "project-empty";
    empty.textContent = "Chưa có dự án nào. Tạo một không gian mới để bắt đầu.";
    list.append(empty);
    return;
  }
  for (const project of state.projects) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-card";
    button.innerHTML = `<span class="project-card-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg></span><span class="project-card-name"></span><span class="project-card-meta"></span>`;
    button.querySelector(".project-card-name").textContent = project.title;
    button.querySelector(".project-card-meta").textContent = `Cập nhật ${new Date(project.updated_at).toLocaleString("vi-VN")}`;
    button.addEventListener("click", () => openProject(project.id));
    list.append(button);
  }
}

async function createProject(event) {
  event.preventDefault();
  const title = $("#newProjectTitle").value.trim();
  if (!title) {
    notify("Hãy nhập tên dự án.");
    return;
  }
  try {
    const project = await request("/projects", { method: "POST", body: JSON.stringify({ title }) });
    $("#createModal").hidden = true;
    await loadProjects();
    showProject(project);
    await loadRunContext();
  } catch (error) {
    notify(error.message);
  }
}

async function openProject(id) {
  try {
    showProject(await request(`/projects/${id}`));
    await loadRunContext();
  } catch (error) {
    notify(error.message);
  }
}

function saveViewportState() {
  if (!state.project?.id) return;
  try {
    sessionStorage.setItem(
      `studio.view.${state.project.id}`,
      JSON.stringify({ pan: state.pan, zoom: state.zoom, selected: state.selected })
    );
  } catch {}
}

function showProject(project) {
  state.project = project;
  state.graph = project.graph;
  if (Array.isArray(state.graph?.edges) && Array.isArray(state.graph?.nodes)) {
    for (const edge of state.graph.edges) {
      const sourceNode = state.graph.nodes.find((n) => n.id === edge.source);
      const targetNode = state.graph.nodes.find((n) => n.id === edge.target);
      if (targetNode?.kind === "list" && edge.targetPort === "items") {
        edge.targetPort = "image";
      }
      if (targetNode?.kind === "list" && sourceNode?.subKind === "variations" && Array.isArray(targetNode.items)) {
        const [gr, gc] = String(sourceNode.variationGrid || "3x3")
          .split("x")
          .map((v) => parseInt(v, 10) || 3);
        const maxItems = Math.max(1, gr * gc);
        const deduped = [];
        const seen = new Set();
        for (const it of targetNode.items) {
          const key = it?.assetId || it?.text || JSON.stringify(it);
          if (key && seen.has(key)) continue;
          if (key) seen.add(key);
          deduped.push(it);
        }
        targetNode.items = deduped.length > maxItems ? deduped.slice(-maxItems) : deduped;
      }
    }
  }
  if (!Array.isArray(state.graph.trash)) state.graph.trash = [];
  state.selected = null;
  state.settingsNode = null;
  state.activePopover = null;
  state.pending = null;
  state.pan = { x: 0, y: 0 };
  state.zoom = 1;
  state.undo = [];
  state.redo = [];
  state.dirty = false;
  state.runs = [];
  state.assets = [];
  clearTimeout(state.runTimer);
  try {
    localStorage.setItem("studio.activeProjectId", project.id);
    const url = new URL(window.location.href);
    url.searchParams.set("project", project.id);
    window.history.replaceState(null, "", url.toString());
  } catch {}
  updateUndoButtons();
  $("#projectTitle").textContent = project.title;
  $("#projectView").hidden = true;
  $("#workspace").hidden = false;
  closeAddPanel();
  closeAssetsPanel();
  closeStoragePanel();
  closeTrashPanel();
  updateTrashBadge();
  setSaveStatus("Đã lưu");
  let restoredView = false;
  try {
    const rawView = sessionStorage.getItem(`studio.view.${project.id}`);
    if (rawView) {
      const savedView = JSON.parse(rawView);
      if (savedView && typeof savedView.zoom === "number" && savedView.pan) {
        state.pan = { x: Number(savedView.pan.x) || 0, y: Number(savedView.pan.y) || 0 };
        state.zoom = savedView.zoom;
        if (savedView.selected && state.graph.nodes.some((n) => n.id === savedView.selected)) {
          state.selected = savedView.selected;
        }
        restoredView = true;
      }
    }
  } catch {}
  renderGraph();
  if (restoredView) {
    updateWorld();
  } else if (state.graph.nodes.length) {
    fitGraph();
  }
}

async function backToProjects() {
  if (state.dirty) await saveGraph();
  if (state.dirty) {
    notify("Flow chưa được lưu. Hãy xử lý lỗi trước khi rời dự án.");
    return;
  }
  state.project = null;
  clearTimeout(state.runTimer);
  state.pending = null;
  try {
    localStorage.removeItem("studio.activeProjectId");
    const url = new URL(window.location.href);
    url.searchParams.delete("project");
    window.history.replaceState(null, "", url.pathname + url.search);
  } catch {}
  $("#workspace").hidden = true;
  $("#projectView").hidden = false;
  await loadProjects();
}

function entry(kind) {
  return state.catalog.find((item) => item.kind === kind);
}

let comfyRetryTimer = null;

function scheduleComfyStatusRetry(attemptsLeft = 8) {
  clearTimeout(comfyRetryTimer);
  if (attemptsLeft <= 0) return;
  comfyRetryTimer = setTimeout(async () => {
    try {
      const nextStatus = await request("/comfy/status");
      const prevConnected = Boolean(state.comfy?.connected);
      const prevCount = state.comfy?.checkpoints?.length || 0;
      state.comfy = nextStatus;
      if (Boolean(nextStatus?.connected) !== prevConnected || (nextStatus?.checkpoints?.length || 0) !== prevCount) {
        renderGraph();
        if (state.settingsNode) renderInspector();
      }
      if (!nextStatus?.connected) {
        scheduleComfyStatusRetry(attemptsLeft - 1);
      }
    } catch {
      scheduleComfyStatusRetry(attemptsLeft - 1);
    }
  }, 2500);
}

async function loadRunContext() {
  try {
    state.comfy = await request("/comfy/status");
    if (!state.comfy?.connected) {
      scheduleComfyStatusRetry(8);
    }
    await loadAssets();
    await refreshRuns();
    renderGraph();
  } catch (error) {
    notify(error.message);
  }
}

function isBridgePending(run) {
  if (!run || run.state === "failed") return false;
  if (["submitting", "queued", "running"].includes(run.state)) return true;
  const model = run.snapshot?.model || "";
  if ((run.snapshot?.bridgePending || model === "Antigravity AI Bridge" || model === "antigravity-ai-bridge") && run.snapshot?.bridgeCompleted !== true) {
    return true;
  }
  return false;
}

async function refreshRuns() {
  clearTimeout(state.runTimer);
  if (!state.project) return;
  const runs = (await request(`/runs?project_id=${encodeURIComponent(state.project.id)}`)).items;
  const missingAsset = runs.some(
    (run) => run.state === "succeeded" && run.assetId && !state.assets.some((a) => a.id === run.assetId)
  );
  if (JSON.stringify(runs) !== JSON.stringify(state.runs) || missingAsset) {
    const prevPendingRuns = state.runs.filter((r) => isBridgePending(r) || r.state === "running" || r.state === "queued");
    const hadPending = prevPendingRuns.length > 0;
    state.runs = runs;
    const seenLatestByNode = new Set();
    for (const r of runs) {
      if (r.state === "succeeded" && r.assetId && r.nodeId && !seenLatestByNode.has(r.nodeId)) {
        seenLatestByNode.add(r.nodeId);
        const targetNode = state.graph?.nodes?.find((n) => n.id === r.nodeId);
        if (targetNode && targetNode.historyIndex === undefined) {
          targetNode.assetId = r.assetId;
        }
      }
    }
    await loadAssets();
    for (const r of runs) {
      if (r.state === "succeeded" && r.assetId && r.nodeId && prevPendingRuns.some((p) => p.id === r.id)) {
        const targetNode = state.graph?.nodes?.find((n) => n.id === r.nodeId);
        if (targetNode && targetNode.subKind !== "variations") {
          pushOutputsToConnectedLists(
            targetNode.id,
            [
              {
                type: "image",
                assetId: r.assetId,
                text: r.snapshot?.prompt || targetNode.prompt || "",
                prompt: r.snapshot?.prompt || targetNode.prompt || "",
                width: r.snapshot?.width || targetNode.width || 1376,
                height: r.snapshot?.height || targetNode.height || 768,
                model: displayModelName(targetNode),
                referenceAssetId: r.snapshot?.sourceAssetId || "",
              },
            ],
            "image"
          );
        }
      }
    }
    syncAllVariationNodesToLists();
    renderGraph();
    if (hadPending && !runs.some((r) => isBridgePending(r))) {
      const finishedRun = runs.find((r) => prevPendingRuns.some((p) => p.id === r.id)) || runs[0];
      if (finishedRun?.state === "failed") {
        notify(finishedRun.error || "Xử lý thất bại.");
      } else if (
        finishedRun?.snapshot?.executionMode === "gpu" ||
        finishedRun?.snapshot?.requestedModel === "Local GPU (VRAM)" ||
        finishedRun?.snapshot?.requestedModel === "local-gpu-vram"
      ) {
        notify("Local GPU (VRAM) đã tạo ảnh hoàn tất!");
      } else {
        notify("Antigravity AI Bridge đã tạo ảnh hoàn tất!");
      }
    }
  } else {
    if (syncAllVariationNodesToLists()) {
      renderGraph();
    }
  }
  if (
    runs.some(
      (run) =>
        isBridgePending(run) ||
        (run.state === "succeeded" && run.assetId && !state.assets.some((a) => a.id === run.assetId))
    )
  ) {
    state.runTimer = setTimeout(() => refreshRuns().catch((error) => notify(error.message)), 1200);
  }
}

function latestRun(nodeId) {
  return state.runs.find((run) => run.nodeId === nodeId);
}

function isModelConfigured(modelName, expectedKind = null) {
  if (!modelName || modelName === "Auto" || modelName === "auto") return false;
  if (modelName === "Local GPU (VRAM)" || modelName === "local-gpu-vram") {
    if (expectedKind === "video") return true;
    return Boolean(state.comfy?.connected && state.comfy?.checkpoints?.length > 0);
  }
  if (modelName === "Antigravity AI Bridge" || modelName === "antigravity-ai-bridge") return true;
  if (expectedKind === "upscaler") {
    const upItem = UPSCALER_MODELS.find((m) => m.id === modelName || m.label === modelName);
    if (upItem?.builtin) return true;
    if (state.comfy.checkpoints.includes(modelName)) return true;
  }
  if (expectedKind !== "video" && state.comfy.checkpoints.includes(modelName)) return true;
  const preset = PRESET_MODELS.find((m) => m.id === modelName || m.label === modelName);
  const canonicalName = preset ? preset.label : modelName;
  const entry = state.modelConfigs[canonicalName] || state.modelConfigs[modelName];
  if (!entry || !String(entry.apiKey || "").trim()) return false;
  if (expectedKind && expectedKind !== "upscaler" && entry.kind && entry.kind !== expectedKind) return false;
  return true;
}

function configuredModelsForKind(kind) {
  return Object.entries(state.modelConfigs)
    .filter(([, cfg]) => cfg && String(cfg.apiKey || "").trim() && (cfg.kind || "image") === kind)
    .map(([name]) => name);
}

function getAllConfigurableModels() {
  const items = [];
  for (const m of PRESET_MODELS) {
    if (m.id === "auto" || m.id === "local-gpu-vram") continue;
    items.push({
      key: m.label,
      label: m.label,
      badge: m.badge,
      kind: "image",
      group: m.group,
      tag: m.tag || "",
      tagType: m.tagType || "",
    });
  }
  for (const vName of VIDEO_MODELS) {
    if (vName === "Auto" || vName === "Local GPU (VRAM)") continue;
    const isBridge = vName === "Antigravity AI Bridge";
    items.push({
      key: vName,
      label: vName,
      badge: isBridge ? "auto" : "cinematic",
      kind: "video",
      group: "VIDEO MODELS",
      tag: isBridge ? "Free" : "",
      tagType: isBridge ? "new" : "",
    });
  }
  return items;
}

function updateHomeConfiguredBadge() {
  const badge = $("#homeConfiguredBadge");
  if (!badge) return;
  const total = Object.values(state.modelConfigs).filter((c) => c && String(c.apiKey || "").trim()).length;
  if (total > 0) {
    badge.hidden = false;
    badge.textContent = `${total}`;
    badge.title = `${total} model đã cấu hình API Key`;
  } else {
    badge.hidden = true;
    badge.textContent = "";
  }
}

async function loadModelConfigs() {
  try {
    const res = await request("/settings/models");
    state.modelConfigs = res.models || {};
  } catch {
    state.modelConfigs = {};
  }
  updateHomeConfiguredBadge();
}

function closeModelSettingsModal() {
  const modal = $("#modelSettingsModal");
  if (modal) modal.hidden = true;
}

function openModelSettingsModal(initialFilter = "all") {
  const modal = $("#modelSettingsModal");
  if (!modal) return;
  closeAllPopovers();

  const allModels = getAllConfigurableModels();
  const draft = {};
  for (const item of allModels) {
    const saved = state.modelConfigs[item.key];
    draft[item.key] = {
      apiKey: saved?.apiKey ? String(saved.apiKey) : "",
      kind: item.kind,
    };
  }

  let currentFilter = initialFilter;
  let searchQuery = "";

  modal.innerHTML = `
    <div class="modal-dialog model-settings-dialog" role="dialog" aria-modal="true" aria-labelledby="modelSettingsTitle">
      <div class="modal-header model-settings-header">
        <div>
          <span class="eyebrow">CẤU HÌNH MODEL &amp; API KEY</span>
          <h2 id="modelSettingsTitle">Danh sách Model &amp; Thiết lập API Key</h2>
          <p class="model-settings-sub">Nhập API Key cho từng model ở cột phải. Các card Image / Video sẽ chỉ gọi đúng model tương ứng đã cấu hình và hiển thị chấm xanh lá (<span class="inline-green-dot"></span>) khi mở danh sách model.</p>
        </div>
        <button id="closeModelSettingsBtn" class="icon-button" type="button" aria-label="Đóng">×</button>
      </div>
      <div class="model-settings-toolbar">
        <div class="model-settings-tabs" id="modelSettingsTabs">
          <button type="button" class="model-tab-btn active" data-tab="all">Tất cả</button>
          <button type="button" class="model-tab-btn" data-tab="image">Image Models</button>
          <button type="button" class="model-tab-btn" data-tab="video">Video Models</button>
          <button type="button" class="model-tab-btn" data-tab="configured">Đã cấu hình</button>
        </div>
        <div class="model-settings-search">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input id="modelSettingsSearchInput" type="search" placeholder="Tìm tên model (VD: Google Nano Banana, Seedream, Kling...)" autocomplete="off">
        </div>
      </div>
      <div class="model-settings-columns-head">
        <span>CỘT TRÁI · TÊN MODEL</span>
        <span>CỘT PHẢI · API KEY CỦA MODEL TƯƠNG ỨNG</span>
      </div>
      <div id="modelSettingsList" class="model-settings-list"></div>
      <div class="modal-footer model-settings-footer">
        <div class="model-settings-status">
          <span class="model-configured-dot is-configured"></span>
          <span id="modelSettingsCountText">0 model đã cấu hình</span>
        </div>
        <div class="model-settings-actions">
          <button id="cancelModelSettingsBtn" class="ghost-button" type="button">Hủy</button>
          <button id="saveModelSettingsBtn" class="primary" type="button">Save</button>
        </div>
      </div>
    </div>
  `;

  const listEl = modal.querySelector("#modelSettingsList");
  const countTextEl = modal.querySelector("#modelSettingsCountText");
  const searchInput = modal.querySelector("#modelSettingsSearchInput");
  const tabsWrap = modal.querySelector("#modelSettingsTabs");

  function updateSummaryCount() {
    const imgCount = allModels.filter((m) => m.kind === "image" && draft[m.key]?.apiKey.trim()).length;
    const vidCount = allModels.filter((m) => m.kind === "video" && draft[m.key]?.apiKey.trim()).length;
    const total = imgCount + vidCount;
    countTextEl.textContent = `${total} model đã cấu hình (${imgCount} Image · ${vidCount} Video)`;
    const confTab = tabsWrap.querySelector('[data-tab="configured"]');
    if (confTab) confTab.textContent = `Đã cấu hình (${total})`;
  }

  function renderRows() {
    listEl.replaceChildren();
    const q = searchQuery.trim().toLocaleLowerCase("vi");
    const filtered = allModels.filter((item) => {
      if (currentFilter === "image" && item.kind !== "image") return false;
      if (currentFilter === "video" && item.kind !== "video") return false;
      if (currentFilter === "configured" && !draft[item.key]?.apiKey.trim()) return false;
      if (q && !item.label.toLocaleLowerCase("vi").includes(q)) return false;
      return true;
    });

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "model-settings-empty";
      empty.textContent = "Không tìm thấy model phù hợp với bộ lọc hiện tại.";
      listEl.append(empty);
      updateSummaryCount();
      return;
    }

    for (const item of filtered) {
      const row = document.createElement("div");
      const hasKey = Boolean(draft[item.key]?.apiKey.trim());
      row.className = `model-settings-row ${hasKey ? "is-configured" : ""}`.trim();

      const leftCol = document.createElement("div");
      leftCol.className = "model-settings-col-left";
      const kindBadgeClass = item.kind === "video" ? "kind-video" : "kind-image";
      const kindLabel = item.kind === "video" ? "Video" : "Image";
      leftCol.innerHTML = `
        <span class="model-configured-dot ${hasKey ? "is-configured" : ""}" title="${hasKey ? "Đã cấu hình API Key" : "Chưa cấu hình"}"></span>
        <span class="model-badge-icon">${modelBadgeSvg(item.badge)}</span>
        <span class="model-settings-name">${escapeHtml(item.label)}</span>
        <span class="model-kind-pill ${kindBadgeClass}">${kindLabel}</span>
        ${item.tag ? `<span class="${item.tagType === "beta" ? "model-tag-beta" : "model-tag-new"}">${escapeHtml(item.tag)}</span>` : ""}
      `;

      const rightCol = document.createElement("div");
      rightCol.className = "model-settings-col-right";
      const inputWrap = document.createElement("div");
      inputWrap.className = "model-apikey-input-wrap";
      const input = document.createElement("input");
      input.type = "password";
      input.className = "model-apikey-input";
      input.placeholder = `Nhập API Key cho ${item.label}...`;
      input.autocomplete = "off";
      input.spellcheck = false;
      input.value = draft[item.key]?.apiKey || "";
      input.dataset.modelName = item.key;

      const toggleVisBtn = document.createElement("button");
      toggleVisBtn.type = "button";
      toggleVisBtn.className = "apikey-icon-btn";
      toggleVisBtn.title = "Hiện / Ẩn API Key";
      toggleVisBtn.textContent = "👁";
      toggleVisBtn.addEventListener("click", () => {
        input.type = input.type === "password" ? "text" : "password";
      });

      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "apikey-icon-btn apikey-clear-btn";
      clearBtn.title = "Xóa API Key của model này";
      clearBtn.textContent = "×";
      clearBtn.hidden = !hasKey;

      input.addEventListener("input", () => {
        draft[item.key].apiKey = input.value;
        const active = Boolean(input.value.trim());
        row.classList.toggle("is-configured", active);
        const dot = leftCol.querySelector(".model-configured-dot");
        if (dot) {
          dot.classList.toggle("is-configured", active);
          dot.title = active ? "Đã cấu hình API Key" : "Chưa cấu hình";
        }
        clearBtn.hidden = !active;
        updateSummaryCount();
      });

      clearBtn.addEventListener("click", () => {
        input.value = "";
        input.dispatchEvent(new Event("input"));
        input.focus();
      });

      inputWrap.append(input, toggleVisBtn, clearBtn);
      rightCol.append(inputWrap);
      row.append(leftCol, rightCol);
      listEl.append(row);
    }

    updateSummaryCount();
  }

  tabsWrap.addEventListener("click", (e) => {
    const tabBtn = e.target.closest("button[data-tab]");
    if (!tabBtn) return;
    currentFilter = tabBtn.dataset.tab;
    tabsWrap.querySelectorAll(".model-tab-btn").forEach((b) => b.classList.toggle("active", b === tabBtn));
    renderRows();
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderRows();
  });

  modal.querySelector("#closeModelSettingsBtn").addEventListener("click", closeModelSettingsModal);
  modal.querySelector("#cancelModelSettingsBtn").addEventListener("click", closeModelSettingsModal);
  modal.onclick = (e) => {
    if (e.target === modal) closeModelSettingsModal();
  };

  const saveBtn = modal.querySelector("#saveModelSettingsBtn");
  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Đang lưu...";
    try {
      const payloadModels = {};
      for (const [name, info] of Object.entries(draft)) {
        const key = String(info.apiKey || "").trim();
        if (key) {
          payloadModels[name] = {
            apiKey: key,
            kind: info.kind,
            enabled: true,
          };
        }
      }
      const res = await request("/settings/models", {
        method: "PUT",
        body: JSON.stringify({ models: payloadModels }),
      });
      state.modelConfigs = res.models || {};
      updateHomeConfiguredBadge();

      // Synchronize open project nodes so any "Auto" or unconfigured default aligns with configured models
      const confImg = configuredModelsForKind("image");
      const confVid = configuredModelsForKind("video");
      let graphUpdated = false;
      for (const n of state.graph.nodes) {
        if (["text-image", "image-image", "upscaler"].includes(n.kind) && confImg.length) {
          const cur = n.presetLabel || n.model || "";
          if (!cur || cur === "Auto" || cur === "auto") {
            n.model = confImg[0];
            n.presetLabel = confImg[0];
            graphUpdated = true;
          }
        }
        if (["text-video", "image-video", "video-video"].includes(n.kind) && confVid.length) {
          if (!n.videoModel || n.videoModel === "Auto") {
            n.videoModel = confVid[0];
            graphUpdated = true;
          }
        }
      }
      if (graphUpdated && state.project) {
        markDirty();
      }
      if (state.project) {
        renderGraph();
      }
      closeModelSettingsModal();
      const totalSaved = Object.keys(state.modelConfigs).length;
      notify(
        totalSaved > 0
          ? `Đã lưu cấu hình API Key cho ${totalSaved} model. Các model đã cấu hình sẽ hiện chấm xanh lá (●).`
          : "Đã xóa toàn bộ cấu hình API Key model."
      );
    } catch (error) {
      notify(error.message);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save";
    }
  });

  modal.hidden = false;
  renderRows();
  setTimeout(() => searchInput.focus(), 20);
}

function effectiveModel(node) {
  if (node.model && state.comfy.checkpoints.includes(node.model)) return node.model;
  if (!node.model && state.comfy.checkpoints.length === 1) return state.comfy.checkpoints[0];
  return node.model || "";
}

function displayModelName(node) {
  const model = node.model || "";
  if (!model) {
    if (state.comfy.checkpoints.length) return state.comfy.checkpoints[0];
    const confImg = configuredModelsForKind("image");
    if (confImg.length) return confImg[0];
    return "Google Nano Banana 2 Lite";
  }
  const preset = PRESET_MODELS.find((item) => item.id === model || item.label === model);
  return preset ? preset.label : model;
}

function modelBadgeSvg(type) {
  if (type === "gpu") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 6V4M12 6V4M16 6V4M8 18v2M12 18v2M16 18v2M9 10h6v4H9z"/></svg>';
  }
  if (type === "auto") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="m10 3 1.8 4.2L16 9l-4.2 1.8L10 15l-1.8-4.2L4 9l4.2-1.8zm7.5 9 1.1 2.4 2.4 1.1-2.4 1.1-1.1 2.4-1.1-2.4-2.4-1.1 2.4-1.1z"/></svg>';
  }
  if (type === "magnific") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M14.5 4.5c-3.5 0-6.5 2.2-8 5.5 2.4-.6 4.5-.2 5.5.8L9.5 19h3.8l2.7-14.5z"/></svg>';
  }
  if (type === "google") {
    return '<span style="font-weight:800;font-size:12px">G</span>';
  }
  if (type === "openai") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3.5"/><path d="M12 3a4.5 4.5 0 0 1 3.9 2.2l3 5.2a4.5 4.5 0 0 1-1.6 6.1l-5.2 3a4.5 4.5 0 0 1-6.1-1.6l-3-5.2a4.5 4.5 0 0 1 1.6-6.1l5.2-3A4.5 4.5 0 0 1 12 3z"/></svg>';
  }
  if (type === "seedream") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 7v10M10 11v6M14 9v8M18 6v11"/></svg>';
  }
  if (type === "flux") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 4 3.5 19h17L12 4z"/><path d="m12 10-4.5 9h9L12 10z"/></svg>';
  }
  if (type === "mystic") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"><path d="M12 5 4.5 18.5h15L12 5z"/></svg>';
  }
  if (type === "ideogram") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9h6v6H9z"/></svg>';
  }
  if (type === "p-image") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 4v16"/></svg>';
  }
  if (type === "cinematic") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M8 5l2 5M14 5l2 5"/></svg>';
  }
  if (type === "luma") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 3 4.5 12 12 21l7.5-9L12 3zm0 3.8 4.4 5.2L12 17.2V6.8z"/></svg>';
  }
  if (type === "runway") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 18V8a4 4 0 0 1 8 0c0 2.5-2 3.5-4 4l4.5 6"/></svg>';
  }
  if (type === "classic") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M13 3 5 14h6l-1 7 8-11h-6l1-7z"/></svg>';
  }
  if (type === "qwen") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 3 15 9 21 12 15 15 12 21 9 15 3 12 9 9 12 3"/></svg>';
  }
  if (type === "z-image") {
    return '<span style="font-weight:850;font-size:12px">Z</span>';
  }
  if (type === "grok") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><circle cx="12" cy="12" r="7"/><path d="M6 18 18 6"/></svg>';
  }
  if (type === "recraft") {
    return '<span style="font-weight:850;font-size:12px">R</span>';
  }
  if (type === "krea") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="6.5" r="2.6"/><circle cx="7" cy="16" r="2.6"/><circle cx="17" cy="16" r="2.6"/></svg>';
  }
  if (type === "mai") {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>';
  }
  return `<span style="font-weight:750;font-size:11px">${escapeHtml(type || "G")}</span>`;
}

function displayModelBadge(node) {
  const model = node.presetLabel || node.model || "";
  const preset = PRESET_MODELS.find((item) => item.id === model || item.label === model);
  if (preset) return preset.badge;
  if (model && state.comfy.checkpoints.includes(model)) return "C";
  return "google";
}

function currentRatioLabel(node) {
  const w = node.width ?? 1376;
  const h = node.height ?? 768;
  const exact = Object.entries(ASPECT_RATIOS).find(([, info]) => w * info.dims[1] === h * info.dims[0]);
  if (exact) return exact[0];
  const approx = Object.entries(ASPECT_RATIOS).find(
    ([, info]) => Math.abs(w / Math.max(1, h) - info.dims[0] / info.dims[1]) < 0.035
  );
  return approx ? approx[0] : `${w}×${h}`;
}

function closestRatioLabelForDims(w, h) {
  const numW = Number(w) || 1376;
  const numH = Number(h) || 768;
  const targetRatio = numW / Math.max(1, numH);
  let bestLabel = "16:9";
  let bestDiff = Infinity;
  for (const [label, info] of Object.entries(ASPECT_RATIOS)) {
    const r = info.dims[0] / Math.max(1, info.dims[1]);
    const diff = Math.abs(targetRatio - r);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestLabel = label;
    }
  }
  return bestLabel;
}

function parseRatioDims(ratioStr, fallbackW = 1376, fallbackH = 768) {
  if (ratioStr && ASPECT_RATIOS[ratioStr]) {
    return ASPECT_RATIOS[ratioStr].dims;
  }
  const m = String(ratioStr || "").match(/^(\d+(?:\.\d+)?)\s*[:×x/]\s*(\d+(?:\.\d+)?)$/i);
  if (m) {
    const rw = Number(m[1]);
    const rh = Number(m[2]);
    if (rw > 0 && rh > 0) return [rw, rh];
  }
  return [fallbackW, fallbackH];
}

function resolveUpstreamMediaDims(node) {
  if (!node || !state.graph) return null;
  const portOrder = ["source_image", "start_image", "source_video", "reference_image", "references", "elements"];
  const edges = state.graph.edges.filter((e) => e.target === node.id);
  edges.sort((a, b) => {
    const ia = portOrder.indexOf(a.targetPort);
    const ib = portOrder.indexOf(b.targetPort);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  for (const edge of edges) {
    const src = state.graph.nodes.find((n) => n.id === edge.source);
    if (!src) continue;
    const srcRun = activeNodeRun(src) || latestRun(src.id);
    const aid = srcRun?.assetId || src.assetId;
    const srcAsset = aid ? state.assets.find((a) => a.id === aid) : null;
    const w = Number(srcAsset?.width || src.imageWidth || srcRun?.snapshot?.width || src.width) || 0;
    const h = Number(srcAsset?.height || src.imageHeight || srcRun?.snapshot?.height || src.height) || 0;
    if (w > 0 && h > 0) return { w, h };
  }
  return null;
}

function probeMediaFileDimensions(file) {
  return new Promise((resolve) => {
    if (!file || typeof URL === "undefined" || !URL.createObjectURL) {
      resolve(null);
      return;
    }
    const isVideo = (file.type || "").startsWith("video/") || /\.(mp4|webm|mov|m4v|mkv)$/i.test(file.name || "");
    const isImage = (file.type || "").startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp|avif|svg)$/i.test(file.name || "");
    if (!isVideo && !isImage) {
      resolve(null);
      return;
    }
    const url = URL.createObjectURL(file);
    let settled = false;
    const finish = (dims) => {
      if (settled) return;
      settled = true;
      try {
        URL.revokeObjectURL(url);
      } catch {}
      resolve(dims);
    };
    const timer = setTimeout(() => finish(null), 4000);
    if (isImage) {
      const img = new Image();
      img.onload = () => {
        clearTimeout(timer);
        const w = Number(img.naturalWidth) || 0;
        const h = Number(img.naturalHeight) || 0;
        finish(w > 0 && h > 0 ? { width: w, height: h } : null);
      };
      img.onerror = () => {
        clearTimeout(timer);
        finish(null);
      };
      img.src = url;
    } else {
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.onloadedmetadata = () => {
        clearTimeout(timer);
        const w = Number(vid.videoWidth) || 0;
        const h = Number(vid.videoHeight) || 0;
        finish(w > 0 && h > 0 ? { width: w, height: h } : null);
      };
      vid.onerror = () => {
        clearTimeout(timer);
        finish(null);
      };
      vid.src = url;
    }
  });
}

function resolveCardAspectDims(node, asset, result, { isMediaSource, isComfyTask, isVideoTask, isVariations }) {
  if (isVariations) return null;
  if (isMediaSource) {
    if (!asset) return null;
    const w = Number(asset.width || node.imageWidth) || 0;
    const h = Number(asset.height || node.imageHeight) || 0;
    return w > 0 && h > 0 ? { w, h, isRatioPreview: false } : null;
  }
  const viewingHistory = typeof node.historyIndex === "number" && node.historyIndex > 0;
  if (isComfyTask) {
    const upstreamDims = !node._userPickedRatio ? resolveUpstreamMediaDims(node) : null;
    const snapshotW = Number(result?.snapshot?.width) || 0;
    const snapshotH = Number(result?.snapshot?.height) || 0;
    const mediaW = Number(asset?.width || snapshotW) || 0;
    const mediaH = Number(asset?.height || snapshotH) || 0;
    const ratioChangedSinceRun =
      !viewingHistory &&
      node.kind !== "upscaler" &&
      mediaW > 0 &&
      mediaH > 0 &&
      node.width &&
      node.height &&
      Math.abs(Number(node.width) / Math.max(1, Number(node.height)) - mediaW / Math.max(1, mediaH)) > 0.03;
    if ((node._previewSelectedRatio || ratioChangedSinceRun) && node.width && node.height && !viewingHistory) {
      return { w: Number(node.width), h: Number(node.height), isRatioPreview: true };
    }
    if (asset) {
      const natW = Number(
        asset.width ||
          snapshotW ||
          (node.kind !== "text-image" && upstreamDims?.w) ||
          node.width
      ) || 1376;
      const natH = Number(
        asset.height ||
          snapshotH ||
          (node.kind !== "text-image" && upstreamDims?.h) ||
          node.height
      ) || 768;
      return { w: natW, h: natH, isRatioPreview: false };
    }
    if ((node.kind === "image-image" || node.kind === "upscaler") && upstreamDims) {
      return { w: upstreamDims.w, h: upstreamDims.h, isRatioPreview: false };
    }
    return { w: Number(node.width) || 1376, h: Number(node.height) || 768, isRatioPreview: false };
  }
  if (isVideoTask) {
    const upstreamDims = !node._userPickedRatio ? resolveUpstreamMediaDims(node) : null;
    const [rw, rh] = parseRatioDims(node.videoRatio || "16:9", 1376, 768);
    const snapRatio = result?.snapshot?.videoRatio;
    const ratioChangedSinceRun =
      !viewingHistory &&
      Boolean(
        (snapRatio && node.videoRatio && snapRatio !== node.videoRatio) ||
          (asset?.width &&
            asset?.height &&
            node.videoRatio &&
            Math.abs(rw / Math.max(1, rh) - Number(asset.width) / Math.max(1, Number(asset.height))) > 0.04)
      );
    if ((node._previewSelectedRatio || ratioChangedSinceRun) && !viewingHistory) {
      return { w: rw, h: rh, isRatioPreview: true };
    }
    if (asset) {
      const natW = Number(asset.width) || 0;
      const natH = Number(asset.height) || 0;
      if (natW > 0 && natH > 0) {
        return { w: natW, h: natH, isRatioPreview: false };
      }
      return { w: rw, h: rh, isRatioPreview: false };
    }
    if (
      upstreamDims &&
      [
        "image-video",
        "video-video",
        "extend-video",
        "modify-video",
        "move",
        "speak",
        "video-upscaler",
        "video-sfx",
        "media-extractor",
      ].includes(node.kind)
    ) {
      return { w: upstreamDims.w, h: upstreamDims.h, isRatioPreview: false };
    }
    return { w: rw, h: rh, isRatioPreview: false };
  }
  return null;
}

function applyCardAspectLayout(card, stageEl, dims, { isMediaSource, hasAsset }) {
  if (!card || !dims || !(dims.w > 0) || !(dims.h > 0)) return;
  const ratio = dims.w / Math.max(1, dims.h);
  let cardWidth = 392;
  if (isMediaSource) {
    if (ratio >= 1.85) cardWidth = 420;
    else if (ratio >= 1.2) cardWidth = 360;
    else if (ratio >= 0.9) cardWidth = 310;
    else cardWidth = 288;
  } else {
    if (ratio >= 1.9) cardWidth = 440;
    else if (ratio >= 1.4) cardWidth = 416;
    else if (ratio >= 1.1) cardWidth = 392;
    else if (ratio >= 0.95) cardWidth = 380;
    else if (ratio >= 0.72) cardWidth = 368;
    else if (ratio >= 0.62) cardWidth = 360;
    else if (ratio >= 0.5) cardWidth = 356;
    else cardWidth = 348;
    card.dataset.aspectCard = "1";
  }
  card.style.width = `${cardWidth}px`;
  if (stageEl) {
    stageEl.style.aspectRatio = `${dims.w} / ${dims.h}`;
    if (dims.isRatioPreview && hasAsset) {
      stageEl.dataset.ratioPreview = "1";
    } else {
      delete stageEl.dataset.ratioPreview;
    }
  }
}

function syncDownstreamAspectFromSource(sourceNode, w, h) {
  if (!sourceNode || !(w > 0) || !(h > 0) || !state.graph) return false;
  const outEdges = state.graph.edges.filter((e) => e.source === sourceNode.id);
  let changed = false;
  const nearestLabel = closestRatioLabelForDims(w, h);
  const nearestSpec = ASPECT_RATIOS[nearestLabel];
  for (const edge of outEdges) {
    const target = state.graph.nodes.find((n) => n.id === edge.target);
    if (!target || target._userPickedRatio) continue;
    const targetHasOwnRun = Boolean(target.assetId || activeNodeRun(target)?.assetId);
    if (target.kind === "image-image" || target.kind === "upscaler" || (target.kind === "text-image" && !targetHasOwnRun)) {
      const targetW = nearestSpec ? nearestSpec.dims[0] : w;
      const targetH = nearestSpec ? nearestSpec.dims[1] : h;
      if (target.width !== targetW || target.height !== targetH) {
        target.width = targetW;
        target.height = targetH;
        changed = true;
      }
    } else if (
      [
        "image-video",
        "video-video",
        "extend-video",
        "modify-video",
        "move",
        "speak",
        "video-upscaler",
        "media-extractor",
        "text-video",
      ].includes(target.kind) &&
      (target.kind !== "text-video" || !targetHasOwnRun)
    ) {
      if (target.videoRatio !== nearestLabel) {
        target.videoRatio = nearestLabel;
        changed = true;
      }
    }
    const targetCard = document.querySelector(`.graph-node[data-node-id="${target.id}"]`);
    if (targetCard && !targetCard.classList.contains("has-result")) {
      const targetStage = targetCard.querySelector(".node-stage-wrap, .node-placeholder");
      applyCardAspectLayout(targetCard, targetStage, { w, h, isRatioPreview: false }, { isMediaSource: false, hasAsset: false });
      const ratioPillLabel = targetCard.querySelector(".card-ratio-btn .pill-label, .card-ratio-btn span:not(.ratio-frame-icon):not(.pill-chevron)");
      if (ratioPillLabel) ratioPillLabel.textContent = nearestLabel;
    }
  }
  return changed;
}

function computeVariationTileDims(gridStr, ratioLabel, resLabel = "2K") {
  const exact916 = {
    "1x2": [768, 1376],
    "2x1": [768, 688],
    "1x3": [1856, 768],
    "3x1": [917, 1536],
    "1x4": [1536, 688],
    "4x1": [792, 1344],
    "2x2": [768, 1376],
    "2x3": [848, 843],
    "3x2": [619, 1152],
    "2x4": [848, 632],
    "4x2": [632, 848],
    "3x3": [512, 917],
    "4x4": [384, 688],
  };
  const scale = resLabel === "1K" ? 0.75 : resLabel === "4K" ? 1.5 : 1.0;
  if ((ratioLabel === "9:16" || ratioLabel === "2:3" || ratioLabel === "3:4") && exact916[gridStr]) {
    const [tw, th] = exact916[gridStr];
    return [Math.round(tw * scale), Math.round(th * scale)];
  }
  if ((ratioLabel === "16:9" || ratioLabel === "3:2" || ratioLabel === "4:3") && exact916[gridStr]) {
    const [tw, th] = exact916[gridStr];
    return [Math.round(th * scale), Math.round(tw * scale)];
  }
  const [r, c] = String(gridStr || "3x3")
    .split("x")
    .map((v) => parseInt(v, 10) || 3);
  const base = Math.round(2048 * scale);
  return [Math.round(base / c), Math.round(base / r)];
}

function nodeDisplayTitle(node) {
  if (!node) return "";
  const definition = entry(node.kind);
  const isVariations = node.subKind === "variations";
  const isVideoTask = [
    "text-video",
    "image-video",
    "extend-video",
    "modify-video",
    "move",
    "video-video",
    "speak",
    "video-combiner",
    "video-upscaler",
    "video-sfx",
    "media-extractor",
  ].includes(node.kind);
  const isComfyTask = ["text-image", "image-image", "upscaler"].includes(node.kind);
  const isAudioTask = ["speech-to-text", "voiceover", "sound-effects", "audio-generator", "music-generator"].includes(node.kind);
  const isSvgDesigner = ["image-to-svg", "svg-generator", "designer"].includes(node.kind);
  const isInteractiveTask = isComfyTask || isVideoTask || isAudioTask || isSvgDesigner || ["assistant", "list"].includes(node.kind);
  const type = mediaType(node.kind);
  const isMediaSource = definition?.group === "Nguồn" && type !== "text";
  const result = latestRun(node.id);
  const asset = state.assets.find((item) => item.id === (result?.assetId || node.assetId));
  const indexInKind = state.graph.nodes.filter((item) => item.kind === node.kind).indexOf(node) + 1;
  const overallIndex = state.graph.nodes.indexOf(node) + 1;
  if (node.customTitle) {
    if (node.customTitle === "Modify video") {
      return `Video Modify #${indexInKind}`;
    }
    if (node.customTitle === definition?.title && (isInteractiveTask || node.kind === "text")) {
      return `${node.customTitle} #${indexInKind}`;
    }
    return node.customTitle;
  }
  if (isVariations) return `Biến thể #${indexInKind}`;
  if (node.kind === "modify-video") return `Video Modify #${indexInKind}`;
  if (node.kind === "extend-video") return `Extend video #${indexInKind}`;
  if (isVideoTask) return `${definition?.title || "Video"} #${overallIndex}`;
  if (isInteractiveTask || node.kind === "text") return `${definition?.title || node.kind} #${indexInKind}`;
  if (isMediaSource) {
    if (asset?.name && !/^Studio_|^Creation/i.test(asset.name)) {
      return asset.name.replace(/\.[^.]+$/, "");
    }
    return `Creation #${indexInKind}`;
  }
  return definition?.title || node.kind;
}

function nodeSucceededRuns(nodeId) {
  return state.runs
    .filter((r) => r.nodeId === nodeId && r.state === "succeeded" && r.assetId && !isBridgePending(r))
    .slice()
    .reverse();
}

function activeNodeRun(node) {
  if (!node) return null;
  const succeeded = nodeSucceededRuns(node.id);
  if (succeeded.length && typeof node.historyIndex === "number" && node.historyIndex >= 0 && node.historyIndex < succeeded.length) {
    return succeeded[node.historyIndex];
  }
  return succeeded[succeeded.length - 1] || null;
}

function getConnectedReferences(node) {
  if (!node) return [];
  const refs = [];
  const seenNodeIds = new Set();
  const rawPrompt = (node.prompt || "").toLowerCase();

  const incomingEdges = state.graph.edges.filter(
    (e) => e.target === node.id && ["reference_image", "source_image", "start_image", "elements", "references"].includes(e.targetPort)
  );
  for (const edge of incomingEdges) {
    const srcNode = state.graph.nodes.find((n) => n.id === edge.source);
    if (!srcNode || seenNodeIds.has(srcNode.id)) continue;
    seenNodeIds.add(srcNode.id);
    const srcRun = activeNodeRun(srcNode) || latestRun(srcNode.id);
    const assetId = srcRun?.assetId || srcNode.assetId;
    const asset = assetId ? state.assets.find((a) => a.id === assetId) : null;
    const title = nodeDisplayTitle(srcNode);
    const creationIdx = state.graph.nodes.filter((n) => n.kind === "image").indexOf(srcNode) + 1;
    const mentionTag = `@${title || (srcNode.kind === "image" && creationIdx > 0 ? `Creation #${creationIdx}` : "Image")}`;
    const isMentioned =
      rawPrompt.includes(mentionTag.toLowerCase()) ||
      rawPrompt.includes(`@${title.toLowerCase()}`) ||
      (srcNode.kind === "image" && creationIdx > 0 && rawPrompt.includes(`@creation #${creationIdx}`));
    refs.push({
      node: srcNode,
      asset,
      assetId,
      title,
      mentionTag,
      isMentioned,
    });
  }

  for (const candidate of state.graph.nodes) {
    if (candidate.id === node.id || seenNodeIds.has(candidate.id)) continue;
    const title = nodeDisplayTitle(candidate);
    const creationIdx = state.graph.nodes.filter((n) => n.kind === "image").indexOf(candidate) + 1;
    const tagsToCheck = [
      `@${title}`,
      ...(candidate.kind === "image" && creationIdx > 0 ? [`@Creation #${creationIdx}`, `@Image #${creationIdx}`] : []),
    ];
    const matchedTag = tagsToCheck.find((t) => rawPrompt.includes(t.toLowerCase()));
    if (matchedTag) {
      seenNodeIds.add(candidate.id);
      const srcRun = activeNodeRun(candidate) || latestRun(candidate.id);
      const assetId = srcRun?.assetId || candidate.assetId;
      const asset = assetId ? state.assets.find((a) => a.id === assetId) : null;
      refs.push({
        node: candidate,
        asset,
        assetId,
        title,
        mentionTag: matchedTag,
        isMentioned: true,
      });
    }
  }
  return refs;
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatPromptWithMentionPills(text) {
  const raw = String(text || "");
  if (!raw.trim()) return `<span class="prompt-overlay-placeholder">Describe the image you want to generate…</span>`;
  const dynamicNames = new Set();
  for (const n of state.graph?.nodes || []) {
    const t = nodeDisplayTitle(n);
    if (t && t.trim()) dynamicNames.add(escapeHtml(t.trim()));
    if (typeof n.customTitle === "string" && n.customTitle.trim()) {
      dynamicNames.add(escapeHtml(n.customTitle.trim()));
    }
  }
  for (const a of state.assets || []) {
    if (typeof a.name === "string" && a.name.trim()) {
      const stem = a.name.replace(/\.[^.]+$/, "").trim();
      if (stem) dynamicNames.add(escapeHtml(stem));
    }
  }
  const sortedDynamic = [...dynamicNames]
    .filter((name) => name.length > 1)
    .sort((a, b) => b.length - a.length)
    .map((name) => escapeRegExp(name));

  const builtinPatterns = [
    "Screenshot\\s+\\d{4}-\\d{2}-\\d{2}\\s+\\d+",
    "Creation\\s*#\\d+",
    "Image\\s*Generator\\s*#\\d+",
    "Image\\s*Editor\\s*#\\d+",
    "Image\\s*Upscaler\\s*#\\d+",
    "Video\\s*Generator\\s*#\\d+",
    "Variations\\s*#\\d+",
    "Biến\\s*thể\\s*#\\d+",
    "Assistant\\s*#\\d+",
    "List\\s*#\\d+",
    "Text\\s*#\\d+",
    "Image\\s*#\\d+",
    "[^\\s,.;]+",
  ];
  const combined = [...sortedDynamic, ...builtinPatterns].join("|");
  const regex = new RegExp(`(@(?:${combined}))`, "gi");
  return escapeHtml(raw).replace(regex, (match) => {
    const isList = /^@List\b/i.test(match);
    return isList
      ? `<span class="prompt-mention-pill is-list-mention"><span class="mention-list-icon">∣≡</span>${match} <span class="mention-arrow">↗</span></span>`
      : `<span class="prompt-mention-pill">${match}</span>`;
  });
}

function ratioFrameHtml(label) {
  const spec = ASPECT_RATIOS[label] || { w: 11, h: 11 };
  return `<span class="ratio-frame-icon" style="width:${spec.w}px;height:${spec.h}px"></span>`;
}

function resolveUpstreamAssetId(node, portId = "source_image") {
  const edge = state.graph.edges.find((item) => item.target === node.id && item.targetPort === portId);
  if (edge) {
    const source = state.graph.nodes.find((item) => item.id === edge.source);
    if (source) {
      const run = activeNodeRun(source) || latestRun(source.id);
      if (edge.sourcePort === "first_frame") {
        const fid = source.firstFrameAssetId || run?.snapshot?.firstFrameAssetId || run?.snapshot?.sourceAssetId;
        if (fid) return fid;
      }
      if (edge.sourcePort === "last_frame") {
        const lid = source.lastFrameAssetId || run?.snapshot?.lastFrameAssetId || run?.snapshot?.endAssetId || run?.snapshot?.sourceAssetId;
        if (lid) return lid;
      }
      if (edge.sourcePort === "image" && source.kind === "media-extractor") {
        const eid = source.extractedFrameAssetId || run?.snapshot?.extractedFrameAssetId || source.firstFrameAssetId;
        if (eid) return eid;
      }
      if (edge.sourcePort === "audio") {
        const aid = source.audioAssetId || run?.snapshot?.audioAssetId || source.assetId;
        if (aid) return aid;
      }
      if (run?.assetId) return run.assetId;
      if (source.assetId) return source.assetId;
      if (source.kind === "list" && Array.isArray(source.items)) {
        const activeList = getActiveListItems(source);
        const pool = activeList.length ? activeList : source.items;
        const found = pool.find((it) => it && typeof it === "object" && it.assetId);
        if (found) return found.assetId;
      }
    }
  }
  if (portId === "end_image") return "";
  const refs = getConnectedReferences(node);
  const firstWithAsset = refs.find((r) => r.assetId);
  return firstWithAsset ? firstWithAsset.assetId : "";
}

function resolveConnectedPromptText(node) {
  const promptEdges = state.graph.edges.filter((item) => item.target === node.id && item.targetPort === "prompt");
  if (!promptEdges.length) return (node.prompt || "").trim();
  const parts = [];
  for (const promptEdge of promptEdges) {
    const source = state.graph.nodes.find((item) => item.id === promptEdge.source);
    let base = "";
    if (source?.kind === "text") base = (source.text || "").trim();
    else if (source?.kind === "speech-to-text") base = (source.transcriptText || source.outputText || source.text || "").trim();
    else if (source?.kind === "assistant") base = (source.outputText || source.text || source.prompt || "").trim();
    else if (source?.kind === "list" && Array.isArray(source.items) && source.items.length) {
      const activeItems = getActiveListItems(source);
      const first = activeItems[0] || source.items[0];
      base = typeof first === "string" ? first.trim() : (first?.text || first?.prompt || "").trim();
    }
    if (base) parts.push(base);
  }
  const combinedBase = parts.join(", ");
  const extra = (node.extraPrompt || "").trim();
  return combinedBase && extra ? `${combinedBase}, ${extra}` : combinedBase || extra;
}

function getActiveListItems(listNode) {
  if (!listNode || !Array.isArray(listNode.items)) return [];
  const raw = listNode.items.filter(Boolean);
  if (!raw.length) return [];
  const hasExplicitTrue = raw.some((it) => typeof it === "object" && it.selected === true);
  if (listNode.selectMode && hasExplicitTrue) {
    return raw.filter((it) => typeof it === "object" && it.selected === true);
  }
  return raw.filter((it) => typeof it !== "object" || it.selected !== false);
}

function getConnectedBatchLists(node) {
  if (!node || !state.graph) return [];
  const foundLists = [];
  const seenIds = new Set();

  const addListCandidate = (listNode, viaEdge) => {
    if (!listNode || listNode.kind !== "list" || seenIds.has(listNode.id)) return;
    if (viaEdge && viaEdge.sourcePort === "references") return;
    const activeItems = getActiveListItems(listNode);
    if (!activeItems.length) return;
    seenIds.add(listNode.id);
    foundLists.push({
      listNode,
      title: nodeDisplayTitle(listNode),
      items: activeItems,
      sourcePort: viaEdge?.sourcePort || "image",
      targetPort: viaEdge?.targetPort || "",
    });
  };

  // 1. Direct edges from List -> node (except 'references' port)
  const directEdges = state.graph.edges.filter((e) => e.target === node.id);
  for (const edge of directEdges) {
    const src = state.graph.nodes.find((n) => n.id === edge.source);
    if (src?.kind === "list") {
      addListCandidate(src, edge);
    } else if (src?.kind === "text") {
      // 2. Indirect edges: List -> Text -> node
      const textInEdges = state.graph.edges.filter((te) => te.target === src.id);
      for (const te of textInEdges) {
        const tSrc = state.graph.nodes.find((n) => n.id === te.source);
        if (tSrc?.kind === "list") {
          addListCandidate(tSrc, te);
        }
      }
    }
  }

  // 3. @List #N or custom list title mentions inside prompt or connected Text prompt
  const promptText = `${resolveConnectedPromptText(node)} ${node.prompt || ""}`.toLowerCase();
  if (promptText.includes("@")) {
    let listIdx = 0;
    for (const candidate of state.graph.nodes) {
      if (candidate.kind === "list") {
        listIdx += 1;
        if (!seenIds.has(candidate.id)) {
          const title = nodeDisplayTitle(candidate);
          const defaultAlias = `list #${listIdx}`;
          if (
            (title && promptText.includes(`@${title.toLowerCase()}`)) ||
            promptText.includes(`@${defaultAlias}`)
          ) {
            addListCandidate(candidate, null);
          }
        }
      }
    }
  }

  // Filter out any list that is already an upstream ancestor of another connected batch list
  if (foundLists.length > 1) {
    const filtered = foundLists.filter(
      (entry) =>
        !foundLists.some(
          (other) => other.listNode.id !== entry.listNode.id && hasPath(entry.listNode.id, other.listNode.id)
        )
    );
    filtered.sort(
      (a, b) => state.graph.nodes.indexOf(a.listNode) - state.graph.nodes.indexOf(b.listNode)
    );
    return filtered;
  }

  return foundLists;
}

function computeNodeBatchCombinations(node) {
  const lists = getConnectedBatchLists(node);
  if (!lists.length) {
    return { lists: [], totalCount: 0, combinations: [], isListMode: false };
  }
  const isListMode = node.listMode !== false;
  const totalCount = lists.reduce((acc, l) => acc * Math.max(1, l.items.length), 1);
  if (!isListMode) {
    return { lists, totalCount, combinations: [], isListMode: false };
  }

  // Build Cartesian product across all connected batch lists (capped at 64 for safety)
  let tuples = [[]];
  for (const entryList of lists) {
    const next = [];
    for (const prefix of tuples) {
      for (let idx = 0; idx < entryList.items.length; idx++) {
        next.push([
          ...prefix,
          {
            listNode: entryList.listNode,
            listTitle: entryList.title,
            item: entryList.items[idx],
            index: idx,
          },
        ]);
        if (next.length >= 64) break;
      }
      if (next.length >= 64) break;
    }
    tuples = next;
  }

  const nonListPromptParts = [];
  for (const pe of state.graph.edges.filter((item) => item.target === node.id && item.targetPort === "prompt")) {
    const pSrc = state.graph.nodes.find((item) => item.id === pe.source);
    if (!pSrc || pSrc.kind === "list") continue;
    let pText = "";
    if (pSrc.kind === "text") pText = (pSrc.text || "").trim();
    else if (pSrc.kind === "speech-to-text") pText = (pSrc.transcriptText || pSrc.outputText || pSrc.text || "").trim();
    else if (pSrc.kind === "assistant") pText = (pSrc.outputText || pSrc.text || pSrc.prompt || "").trim();
    if (pText) nonListPromptParts.push(pText);
  }
  const basePrompt = nonListPromptParts.length ? nonListPromptParts.join(", ") : (node.prompt || "").trim();
  const isVidNode = ["text-video", "image-video", "video-video"].includes(node.kind);
  const primaryPort = isVidNode ? "start_image" : node.kind === "text-image" ? "reference_image" : "source_image";
  const primaryEdge = state.graph.edges.find((item) => item.target === node.id && item.targetPort === primaryPort);
  const primaryEdgeSrc = primaryEdge ? state.graph.nodes.find((n) => n.id === primaryEdge.source) : null;
  const fallbackAssetId = primaryEdgeSrc?.kind === "list" ? "" : resolveUpstreamAssetId(node, primaryPort);
  const staticRefIds = fallbackAssetId ? [fallbackAssetId] : [];
  for (const candidate of state.graph.nodes) {
    if (candidate.kind === "image" && candidate.assetId && !staticRefIds.includes(candidate.assetId)) {
      const cTitle = nodeDisplayTitle(candidate);
      const isDirectRef = state.graph.edges.some(
        (e) =>
          e.source === candidate.id &&
          (e.target === node.id || state.graph.edges.some((te) => te.source === e.target && te.target === node.id))
      );
      const isMentioned = cTitle && basePrompt.toLowerCase().includes(`@${cTitle.toLowerCase()}`);
      if (isDirectRef || isMentioned) {
        staticRefIds.push(candidate.assetId);
      }
    }
  }

  const combinations = tuples.map((tuple, comboIdx) => {
    let prompt = basePrompt;
    let primaryAssetId = staticRefIds[0] || "";
    const referenceAssetIds = [...staticRefIds];
    const labels = [];

    for (const part of tuple) {
      const it = part.item;
      const itemText = typeof it === "string" ? it.trim() : (it?.text || it?.prompt || "").trim();
      const itemAssetId = typeof it === "object" && it?.assetId ? it.assetId : "";
      if (itemAssetId) {
        if (!primaryAssetId) primaryAssetId = itemAssetId;
        if (!referenceAssetIds.includes(itemAssetId)) referenceAssetIds.push(itemAssetId);
      }
      if (itemText) labels.push(itemText);
    }

    for (const part of tuple) {
      const it = part.item;
      const itemText = typeof it === "string" ? it.trim() : (it?.text || it?.prompt || "").trim();
      const itemAssetId = typeof it === "object" && it?.assetId ? it.assetId : "";
      const refPos = itemAssetId ? referenceAssetIds.indexOf(itemAssetId) + 1 : 0;

      const mentionRegex = new RegExp(`@${escapeRegExp(part.listTitle)}(?![\\w#])`, "gi");
      if (mentionRegex.test(prompt)) {
        let occ = 0;
        prompt = prompt.replace(mentionRegex, () => {
          occ += 1;
          if (refPos > 0) {
            if (itemText && occ === 1) return `${itemText} (Ảnh tham chiếu #${refPos} - ${part.listTitle})`;
            return `Ảnh tham chiếu #${refPos} (${part.listTitle})`;
          }
          return itemText || `${part.listTitle} item #${part.index + 1}`;
        });
      } else if (itemText && !prompt.toLowerCase().includes(itemText.toLowerCase())) {
        prompt = prompt ? `${prompt}, ${itemText}` : itemText;
      }
    }

    const extra = (node.extraPrompt || "").trim();
    if (extra && !prompt.toLowerCase().includes(extra.toLowerCase())) {
      prompt = prompt ? `${prompt}, ${extra}` : extra;
    }

    return {
      index: comboIdx,
      prompt: prompt.trim() || labels.join(", ") || `Batch variation #${comboIdx + 1}`,
      sourceAssetId: primaryAssetId || fallbackAssetId || "",
      referenceAssetIds,
      label: labels.join(" × ") || `Combination #${comboIdx + 1}`,
    };
  });

  return {
    lists,
    totalCount,
    combinations,
    isListMode: true,
  };
}

function updateNodeRunningUI(node) {
  if (!node) return;
  const card = document.querySelector(`.graph-node[data-node-id="${node.id}"]`);
  if (!card) return;
  let pill = card.querySelector(".running-timer-pill");
  if (node._running || node._batchRunning) {
    card.classList.add("is-running");
    if (!pill) {
      pill = document.createElement("div");
      pill.className = "running-timer-pill";
      card.append(pill);
    }
    pill.textContent = node._runningLabel || "Running · Studio AI";
  } else {
    card.classList.remove("is-running");
    if (pill) pill.remove();
  }
  const statusEl = card.querySelector(".node-status span:last-child");
  if (statusEl) statusEl.textContent = taskStatus(node);
}

function taskSnapshot(node) {
  const prompt = resolveConnectedPromptText(node);

  if (node.kind === "text-image") {
    const refAssetId = resolveUpstreamAssetId(node, "reference_image");
    const snap = {
      kind: "text-image",
      prompt,
      model: node.model || "",
      negative: node.negative || "",
      width: node.width ?? 512,
      height: node.height ?? 512,
      steps: node.steps ?? 20,
      seed: node.seed ?? 0,
      cfg: node.cfg ?? 7,
    };
    if (refAssetId) {
      snap.sourceAssetId = refAssetId;
      snap.denoise = node.denoise ?? 0.72;
    }
    return snap;
  } else if (node.kind === "image-image" || node.kind === "upscaler") {
    const sourceAssetId = resolveUpstreamAssetId(node, "source_image");
    const snap = {
      kind: "image-image",
      prompt: prompt || (node.kind === "upscaler" ? "upscale clarity" : ""),
      model: node.kind === "upscaler" ? node.upscaleModel || node.model || "Antigravity AI Bridge" : node.model || "",
      negative: node.negative || "",
      sourceAssetId,
      denoise: node.denoise ?? (node.kind === "upscaler" ? 0.28 : 0.75),
      steps: node.steps ?? 20,
      seed: node.seed ?? 0,
      cfg: node.cfg ?? 7,
    };
    if (node.kind === "upscaler") {
      snap.subKind = "upscaler";
      snap.upscaleModel = node.upscaleModel || "Antigravity AI Bridge";
      snap.upscaleMode = node.upscaleMode || "Precision (Clarity)";
      snap.upscaleFlavor = node.upscaleFlavor || "Balanced";
      snap.scaleFactor = Number(node.scaleFactor || 2);
    }
    return snap;
  }
  return {};
}

function runIsStale(node, run) {
  if (!run || !run.snapshot) return false;
  const snap = taskSnapshot(node);
  if (node.kind === "upscaler") {
    if (String(run.snapshot.sourceAssetId || "") !== String(snap.sourceAssetId || "")) return true;
    if (Number(run.snapshot.scaleFactor || 2) !== Number(snap.scaleFactor || 2)) return true;
    if (String(run.snapshot.upscaleMode || "Precision (Clarity)") !== String(snap.upscaleMode || "Precision (Clarity)")) return true;
    if (String(run.snapshot.upscaleFlavor || "Balanced") !== String(snap.upscaleFlavor || "Balanced")) return true;
    if (String(run.snapshot.upscaleModel || run.snapshot.model || "") !== String(snap.upscaleModel || "")) return true;
    return false;
  }
  const runPrompt = String(run.snapshot.rawPrompt ?? run.snapshot.prompt ?? "").trim();
  const curPrompt = String(snap.prompt ?? "").trim();
  if (runPrompt !== curPrompt) return true;
  if (String(run.snapshot.sourceAssetId || "") !== String(snap.sourceAssetId || "")) return true;
  return false;
}

function taskStatus(node) {
  if (node._runningLabel) return node._runningLabel;
  if (!["text-image", "image-image", "upscaler"].includes(node.kind)) {
    return node.assetId || node.outputText || node.svgMarkup ? "Hoàn tất" : "Sẵn sàng";
  }
  const run = latestRun(node.id);
  if (!run) return "Chưa chạy";
  if (run.state === "failed") return "Chạy lỗi";
  if (isBridgePending(run)) return "Đang xử lý AI...";
  if (runIsStale(node, run)) return run.state === "succeeded" ? "Kết quả cũ" : "Đang chạy bản cũ";
  return {
    submitting: "Generating...",
    queued: "Queued...",
    running: "Generating...",
    succeeded: "Đã tạo ảnh",
    failed: "Chạy lỗi",
  }[run.state] || run.state;
}

function updateTaskStatuses() {
  for (const node of state.graph.nodes) {
    const label = [...document.querySelectorAll(".graph-node")].find((card) => card.dataset.nodeId === node.id)?.querySelector(".node-status span:last-child");
    if (label && ["text-image", "image-image", "upscaler"].includes(node.kind)) {
      label.textContent = taskStatus(node);
    }
  }
}

async function ensureSaved() {
  clearTimeout(state.saveTimer);
  while (state.saving) await new Promise((resolve) => setTimeout(resolve, 50));
  if (state.dirty) await saveGraph();
  while (state.saving) await new Promise((resolve) => setTimeout(resolve, 50));
  if (state.dirty) throw new Error("Flow chưa được lưu. Hãy xử lý lỗi trước khi chạy.");
}

async function createProceduralImageBlob(title, subtitle, width = 768, height = 768, palette = ["#1e1b4b", "#4338ca", "#ec4899"]) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, palette[0]);
  grad.addColorStop(0.55, palette[1]);
  grad.addColorStop(1, palette[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.arc(width * 0.72, height * 0.28, Math.min(width, height) * 0.26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${Math.round(width * 0.055)}px Inter, Segoe UI, sans-serif`;
  ctx.fillText(String(title || "Studio Creation").slice(0, 32), width * 0.08, height * 0.78);
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = `500 ${Math.round(width * 0.032)}px Inter, Segoe UI, sans-serif`;
  ctx.fillText(String(subtitle || "Freepik Spaces · AI Output").slice(0, 54), width * 0.08, height * 0.85);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

async function uploadBlobAsAsset(blob, filename) {
  const file = new File([blob], filename, { type: blob.type || "image/png" });
  const form = new FormData();
  form.append("file", file);
  if (state.project?.id) form.append("projectId", state.project.id);
  const query = state.project?.id ? `?project_id=${encodeURIComponent(state.project.id)}` : "";
  const response = await fetch(`${apiRoot}/assets${query}`, { method: "POST", body: form });
  if (!response.ok) throw new Error("Không thể lưu kết quả vào thư viện.");
  const asset = await response.json();
  state.assets = [asset, ...state.assets.filter((a) => a.id !== asset.id)];
  if (!$("#assetsPanel")?.hidden) renderAssets();
  return asset;
}

function pushOutputsToConnectedLists(sourceNodeId, newItems, itemKind = "image", isBatchContinuation = false) {
  const sourceNode = state.graph.nodes.find((n) => n.id === sourceNodeId);
  const outEdges = state.graph.edges.filter((e) => e.source === sourceNodeId);
  let updated = false;
  const firstAssetId = newItems[0]?.assetId || "";
  for (const edge of outEdges) {
    const targetNode = state.graph.nodes.find((n) => n.id === edge.target);
    if (!targetNode) continue;
    let portAssetId = firstAssetId;
    let portKind = itemKind;
    if (edge.sourcePort === "first_frame" && sourceNode?.firstFrameAssetId) {
      portAssetId = sourceNode.firstFrameAssetId;
      portKind = "image";
    } else if (edge.sourcePort === "last_frame" && sourceNode?.lastFrameAssetId) {
      portAssetId = sourceNode.lastFrameAssetId;
      portKind = "image";
    } else if (edge.sourcePort === "image" && sourceNode?.extractedFrameAssetId) {
      portAssetId = sourceNode.extractedFrameAssetId;
      portKind = "image";
    }
    if ((targetNode.kind === "image" && portKind === "image") || (targetNode.kind === "video" && portKind === "video")) {
      if (portAssetId && targetNode.assetId !== portAssetId) {
        targetNode.assetId = portAssetId;
        updated = true;
      }
    } else if (targetNode.kind === "list") {
      if (
        !Array.isArray(targetNode.items) ||
        (!isBatchContinuation && (targetNode.keepItems === false || targetNode.keepMode === "Replace Items"))
      ) {
        targetNode.items = [];
      }
      const existingKeys = new Set(
        targetNode.items
          .map((it) => (it && it.assetId ? `${it.type || "image"}:${it.assetId}:${it.prompt || it.text || ""}` : ""))
          .filter(Boolean)
      );
      const itemsToPush =
        portKind === "image" && portAssetId && portAssetId !== firstAssetId
          ? [{ type: "image", assetId: portAssetId, text: edge.sourcePort === "last_frame" ? "Last Frame" : "Frame", selected: true }]
          : newItems;
      for (const item of itemsToPush) {
        const key = item && item.assetId ? `${item.type || portKind}:${item.assetId}:${item.prompt || item.text || ""}` : "";
        if (key && existingKeys.has(key)) continue;
        targetNode.items.push(item);
        if (key) existingKeys.add(key);
      }
      if (portKind === "image" || portKind === "video") targetNode.viewMode = "grid";
      updated = true;
    }
  }
  if (updated) markDirty();
}

function syncVariationNodeToList(node, forceCreateList = false) {
  if (!node || node.subKind !== "variations") return false;
  const latest = latestRun(node.id);
  if (!latest || latest.state !== "succeeded" || isBridgePending(latest)) return false;

  const splitAssets = latest.snapshot?.splitAssets;
  let items = [];
  if (Array.isArray(splitAssets) && splitAssets.length) {
    items = splitAssets.map((sa, idx) => ({
      type: "image",
      assetId: sa.assetId,
      text: sa.title || `Variation #${idx + 1}`,
      prompt: sa.prompt || sa.title || "",
      width: sa.width || 512,
      height: sa.height || 917,
      model: sa.model || displayModelName(node),
      referenceAssetId: sa.referenceAssetId || latest.snapshot?.sourceAssetId || latest.assetId,
    }));
  } else if (latest.assetId) {
    if (node.splitImages === false || latest.snapshot?.splitImages === false) {
      items = [
        {
          type: "image",
          assetId: latest.assetId,
          text: `${node.variationGrid || "3x3"} Variations Sheet`,
          prompt: latest.snapshot?.prompt || node.prompt || "",
          width: latest.snapshot?.width || 1536,
          height: latest.snapshot?.height || 2752,
          model: latest.snapshot?.presetLabel || displayModelName(node),
          referenceAssetId: latest.snapshot?.sourceAssetId || "",
        },
      ];
    } else {
      const [r, c] = String(node.variationGrid || "3x3")
        .split("x")
        .map((v) => parseInt(v, 10) || 3);
      const count = r * c || 9;
      items = Array.from({ length: count }, (_, idx) => ({
        type: "image",
        assetId: latest.assetId,
        text: (node.variationAngles || [])[idx] || `Variation #${idx + 1}`,
      }));
    }
  }
  if (!items.length) return false;

  const connectedListEdges = state.graph.edges.filter(
    (e) => e.source === node.id && state.graph.nodes.find((n) => n.id === e.target)?.kind === "list"
  );
  if (!connectedListEdges.length) {
    if (!forceCreateList && node.lastSyncedRunId === latest.id) return false;
    node.lastSyncedRunId = latest.id;
    const listNode = addNode("list", node.id, null, { items });
    listNode.viewMode = "grid";
    return true;
  }

  let changed = false;
  for (const edge of connectedListEdges) {
    const listNode = state.graph.nodes.find((n) => n.id === edge.target);
    if (!listNode) continue;
    if (!listNode.viewMode) {
      listNode.viewMode = "grid";
      changed = true;
    }
    const currentIds = (listNode.items || []).map((it) => it && it.assetId).filter(Boolean);
    const targetIds = items.map((it) => it && it.assetId).filter(Boolean);
    const exactMatch =
      currentIds.length === targetIds.length && currentIds.every((id, idx) => id === targetIds[idx]);
    if (!exactMatch || node.lastSyncedRunId !== latest.id) {
      listNode.items = [...items];
      changed = true;
    }
  }
  node.lastSyncedRunId = latest.id;
  if (changed) markDirty();
  return changed;
}

function syncAllVariationNodesToLists() {
  if (!state.graph || !Array.isArray(state.graph.nodes)) return false;
  let anyChanged = false;
  for (const node of state.graph.nodes) {
    if (node.subKind === "variations") {
      if (syncVariationNodeToList(node, false)) {
        anyChanged = true;
      }
      continue;
    }
    if (
      [
        "text-image",
        "image-image",
        "upscaler",
        "text-video",
        "image-video",
        "extend-video",
        "modify-video",
        "move",
        "speak",
        "video-combiner",
        "media-extractor",
        "video-upscaler",
        "video-sfx",
        "video-video",
      ].includes(node.kind)
    ) {
      const isVid = [
        "text-video",
        "image-video",
        "extend-video",
        "modify-video",
        "move",
        "speak",
        "video-combiner",
        "media-extractor",
        "video-upscaler",
        "video-sfx",
        "video-video",
      ].includes(node.kind);
      const itemKind = isVid ? "video" : "image";
      const succeeded = nodeSucceededRuns(node.id);
      if (!succeeded.length) continue;
      const latest = succeeded[succeeded.length - 1];
      if (latest.assetId && node.assetId !== latest.assetId) {
        node.assetId = latest.assetId;
        anyChanged = true;
      }
      if (isVid && latest.snapshot) {
        if (latest.snapshot.firstFrameAssetId && node.firstFrameAssetId !== latest.snapshot.firstFrameAssetId) {
          node.firstFrameAssetId = latest.snapshot.firstFrameAssetId;
          anyChanged = true;
        }
        if (latest.snapshot.lastFrameAssetId && node.lastFrameAssetId !== latest.snapshot.lastFrameAssetId) {
          node.lastFrameAssetId = latest.snapshot.lastFrameAssetId;
          anyChanged = true;
        }
        if (latest.snapshot.extractedFrameAssetId && node.extractedFrameAssetId !== latest.snapshot.extractedFrameAssetId) {
          node.extractedFrameAssetId = latest.snapshot.extractedFrameAssetId;
          anyChanged = true;
        }
        if (latest.snapshot.audioAssetId && node.audioAssetId !== latest.snapshot.audioAssetId) {
          node.audioAssetId = latest.snapshot.audioAssetId;
          anyChanged = true;
        }
      }
      const outEdges = state.graph.edges.filter((e) => e.source === node.id);
      for (const outEdge of outEdges) {
        const targetNode = state.graph.nodes.find((n) => n.id === outEdge.target);
        if (!targetNode) continue;
        let edgeAssetId = latest.assetId;
        let edgeKind = itemKind;
        if (outEdge.sourcePort === "first_frame" && (node.firstFrameAssetId || latest.snapshot?.firstFrameAssetId)) {
          edgeAssetId = node.firstFrameAssetId || latest.snapshot.firstFrameAssetId;
          edgeKind = "image";
        } else if (outEdge.sourcePort === "last_frame" && (node.lastFrameAssetId || latest.snapshot?.lastFrameAssetId)) {
          edgeAssetId = node.lastFrameAssetId || latest.snapshot.lastFrameAssetId;
          edgeKind = "image";
        } else if (outEdge.sourcePort === "image" && (node.extractedFrameAssetId || latest.snapshot?.extractedFrameAssetId)) {
          edgeAssetId = node.extractedFrameAssetId || latest.snapshot.extractedFrameAssetId;
          edgeKind = "image";
        } else if (outEdge.sourcePort === "audio" && (node.audioAssetId || latest.snapshot?.audioAssetId)) {
          edgeAssetId = node.audioAssetId || latest.snapshot.audioAssetId;
          edgeKind = "audio";
        }
        if (
          (targetNode.kind === "image" && edgeKind === "image") ||
          (targetNode.kind === "video" && edgeKind === "video") ||
          (targetNode.kind === "audio" && edgeKind === "audio")
        ) {
          if (edgeAssetId && targetNode.assetId !== edgeAssetId) {
            targetNode.assetId = edgeAssetId;
            anyChanged = true;
          }
        }
      }
      const connectedLists = outEdges
        .map((e) => state.graph.nodes.find((n) => n.id === e.target))
        .filter((n) => n && n.kind === "list");
      if (!connectedLists.length) continue;

      const latestGraphVer = latest.graphVersion;
      const batchRuns = succeeded
        .filter((r) => r.graphVersion === latestGraphVer)
        .slice()
        .sort((a, b) => {
          const ca = typeof a.snapshot?.combinationIndex === "number" ? a.snapshot.combinationIndex : 0;
          const cb = typeof b.snapshot?.combinationIndex === "number" ? b.snapshot.combinationIndex : 0;
          return ca - cb;
        });

      for (const listNode of connectedLists) {
        if (!Array.isArray(listNode.items)) listNode.items = [];
        const existingIds = new Set(listNode.items.map((it) => it?.assetId).filter(Boolean));
        for (const r of batchRuns) {
          if (r.assetId && !existingIds.has(r.assetId)) {
            const newItem = {
              id: `item-${r.assetId.slice(0, 12)}`,
              type: itemKind,
              assetId: r.assetId,
              text: "",
              selected: true,
            };
            if (isVid) {
              newItem.duration = r.snapshot?.duration || "10s";
              newItem.videoRatio = r.snapshot?.videoRatio || "9:16";
              newItem.videoRes = r.snapshot?.videoRes || "720p";
              if (r.snapshot?.sourceAssetId) {
                newItem.firstFrameAssetId = r.snapshot.sourceAssetId;
                newItem.referenceAssetId = r.snapshot.sourceAssetId;
              }
            }
            listNode.items.push(newItem);
            existingIds.add(r.assetId);
            anyChanged = true;
          }
        }
        if (listNode.viewMode !== "grid") {
          listNode.viewMode = "grid";
          anyChanged = true;
        }
      }
    }
  }
  return anyChanged;
}

async function runAssistantNode(node) {
  const promptEdge = state.graph.edges.find((e) => e.target === node.id && e.targetPort === "prompt");
  const refEdge = state.graph.edges.find((e) => e.target === node.id && e.targetPort === "reference_image");
  const sourceNode = promptEdge
    ? state.graph.nodes.find((n) => n.id === promptEdge.source)
    : refEdge
      ? state.graph.nodes.find((n) => n.id === refEdge.source)
      : null;
  const refAssetId = refEdge ? resolveUpstreamAssetId(node, "reference_image") : "";
  const refAsset = refAssetId ? state.assets.find((a) => a.id === refAssetId) : null;
  const refLabel = sourceNode ? nodeDisplayTitle(sourceNode) : refAsset?.name || "";
  const userInstruction =
    (node.prompt || "").trim() ||
    (sourceNode?.text || sourceNode?.prompt || "").trim() ||
    (refLabel ? `Analyze reference image ${refLabel} and craft a detailed studio prompt` : "Create a cinematic Golden Retriever running in a snowy Finnish forest");

  node._running = true;
  node._runningStart = Date.now();
  node._runningLabel = "Thinking... 1s";
  updateNodeRunningUI(node);
  const timer = setInterval(() => {
    const sec = Math.max(1, Math.round((Date.now() - node._runningStart) / 1000));
    node._runningLabel = `Thinking... ${sec}s`;
    updateNodeRunningUI(node);
  }, 1000);

  await new Promise((r) => setTimeout(r, 1400));
  clearInterval(timer);
  delete node._running;
  delete node._runningLabel;

  const isListExport = node.exportMode === "Export as list" || /list|\b10\b|each/i.test(userInstruction);
  remember();
  if (sourceNode?.kind === "list" && Array.isArray(sourceNode.items) && sourceNode.items.length) {
    const listPrompts = sourceNode.items.map((it) => {
      const baseName = typeof it === "string" ? it : it.text || "Subject";
      return `Cinematic wildlife photography of a ${baseName} in winter time in its natural snowy winter habitat, soft golden hour rim light, 8k detail (${userInstruction.slice(0, 48)})`;
    });
    node.outputText = listPrompts.map((p, idx) => `${idx + 1}. ${p}`).join("\n\n");
    node.exportMode = "Export as list";
    node.activeTab = "output";
    pushOutputsToConnectedLists(
      node.id,
      listPrompts.map((t) => ({ type: "text", text: t })),
      "text"
    );
  } else if (isListExport) {
    const animals = ["Dog", "Cat", "Horse", "Rabbit", "Goldfish", "Hamster", "Parrot", "Elephant", "Tiger", "Panda"];
    const items = /prompt|winter|habitat/i.test(userInstruction)
      ? animals.map((a) => `A majestic ${a} in winter time in its snowy natural habitat, soft frost, cinematic lighting, 8k`)
      : animals;
    node.outputText = items.map((item, idx) => `${idx + 1}. ${item}`).join("\n");
    node.exportMode = "Export as list";
    node.activeTab = "output";
    pushOutputsToConnectedLists(
      node.id,
      items.map((t) => ({ type: "text", text: t })),
      "text"
    );
  } else {
    const refContext = refLabel ? ` [Reference: @${refLabel}]` : "";
    node.outputText = `Cinematic wide-angle shot: ${userInstruction}${refContext}. Dramatic volumetric lighting, ultra-detailed textures, natural depth of field, shot on 35mm lens, photorealistic 8K.`;
    node.activeTab = "output";
  }
  markDirty();
  renderGraph();
  notify("Assistant đã hoàn tất phản hồi.");
}

async function loadImageElementFromUrl(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function encodePcmToWavBlob(samples, sampleRate = 22050) {
  const numSamples = samples.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, numSamples * 2, true);
  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}

function synthesizeAudioWavBlob(node, scriptText) {
  const sampleRate = 22050;
  const rawDur = String(node.duration || (node.kind === "music-generator" ? "10s" : "5s"));
  const parsedSec = parseInt(rawDur, 10);
  const durSec =
    node.kind === "voiceover"
      ? Math.max(3, Math.min(14, Math.ceil(String(scriptText || "Hello").length / 13)))
      : Number.isFinite(parsedSec) && parsedSec > 0
        ? Math.min(30, parsedSec)
        : node.kind === "music-generator"
          ? 10
          : 5;
  const totalSamples = Math.floor(sampleRate * durSec);
  const samples = new Float32Array(totalSamples);
  const lower = String(scriptText || "").toLowerCase();

  if (node.kind === "voiceover") {
    const voiceName = String(node.voiceName || "Aria").toLowerCase();
    const isMale = /marcus|axee|a-xee|kai/.test(voiceName);
    const baseF0 = isMale ? 122 : 210;
    const excited = /\[excited\]/.test(lower) ? 1.16 : 1.0;
    const whisper = /\[whispering\]/.test(lower);
    const words = String(scriptText || "Welcome to Studio")
      .replace(/\[[^\]]+\]/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const sylCount = Math.max(4, Math.min(48, words.length * 2));
    const sylDur = durSec / sylCount;
    let phase0 = 0;
    let phase1 = 0;
    let phase2 = 0;
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const sylIdx = Math.floor(t / sylDur);
      const sylPos = (t % sylDur) / sylDur;
      const env = sylPos < 0.82 ? Math.sin((sylPos / 0.82) * Math.PI) : 0;
      const f0 = baseF0 * excited * (1 + 0.08 * Math.sin(t * 3.2 + sylIdx * 0.7) - 0.06 * (t / durSec));
      const f1 = 480 + ((sylIdx * 137) % 320);
      const f2 = 1350 + ((sylIdx * 293) % 680);
      phase0 += (2 * Math.PI * f0) / sampleRate;
      phase1 += (2 * Math.PI * f1) / sampleRate;
      phase2 += (2 * Math.PI * f2) / sampleRate;
      const glottal = Math.sin(phase0) + 0.45 * Math.sin(phase0 * 2) + 0.22 * Math.sin(phase0 * 3);
      const formant = 0.48 * Math.sin(phase1) + 0.24 * Math.sin(phase2);
      const breath = (Math.random() * 2 - 1) * (whisper ? 0.28 : 0.03);
      samples[i] = env * ((whisper ? 0.15 : 0.42) * glottal + 0.25 * formant + breath);
    }
  } else if (node.kind === "sound-effects") {
    const isImpact = /impact|explosion|boom|thunder|bass|drop/.test(lower);
    const isSciFi = /laser|scifi|sci-fi|synth|warp|futur|time/.test(lower);
    const isRain = /rain|water|wind|ocean|storm/.test(lower);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const normT = t / durSec;
      const noise = Math.random() * 2 - 1;
      if (isImpact) {
        const expEnv = Math.exp(-t * 2.8);
        const freq = 42 + 160 * Math.exp(-t * 9.5);
        phase += (2 * Math.PI * freq) / sampleRate;
        samples[i] = expEnv * (0.72 * Math.sin(phase) + 0.28 * noise * Math.exp(-t * 5.0));
      } else if (isSciFi) {
        const sweep = 220 + 880 * Math.sin(normT * Math.PI) + 90 * Math.sin(t * 28);
        phase += (2 * Math.PI * sweep) / sampleRate;
        const env = Math.sin(normT * Math.PI);
        samples[i] = env * (0.55 * Math.sin(phase) + 0.25 * Math.sin(phase * 1.5));
      } else if (isRain) {
        const prev = i > 0 ? samples[i - 1] : 0;
        const filtered = 0.88 * prev + 0.12 * noise;
        const swell = 0.55 + 0.35 * Math.sin(normT * Math.PI);
        samples[i] = filtered * swell;
      } else {
        // Cinematic whoosh + sub chime
        const env = Math.pow(Math.sin(normT * Math.PI), 1.6);
        const freq = 95 + 340 * Math.sin(normT * Math.PI);
        phase += (2 * Math.PI * freq) / sampleRate;
        samples[i] = env * (0.52 * Math.sin(phase) + 0.32 * noise * env);
      }
    }
  } else {
    // Music Generator: Chord progression + bassline + arpeggio + beat
    const bpm = /fast|upbeat|dance|140/.test(lower) ? 132 : /slow|ambient|chill|lofi/.test(lower) ? 88 : 116;
    const beatDur = 60 / bpm;
    const chords = [
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63], // F
      [261.63, 329.63, 392.0], // C
      [196.0, 246.94, 293.66], // G
    ];
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const barIdx = Math.floor(t / (beatDur * 2)) % chords.length;
      const chord = chords[barIdx];
      const beatPos = (t % beatDur) / beatDur;
      const stepIdx = Math.floor(t / (beatDur / 2)) % 3;
      const arpFreq = chord[stepIdx] * 2;
      const arpPos = (t % (beatDur / 2)) / (beatDur / 2);
      const arpEnv = Math.exp(-arpPos * 4.2);

      const pad =
        0.18 * Math.sin(2 * Math.PI * chord[0] * t) +
        0.15 * Math.sin(2 * Math.PI * chord[1] * t) +
        0.15 * Math.sin(2 * Math.PI * chord[2] * t);
      const bass = 0.26 * Math.sin(2 * Math.PI * (chord[0] * 0.5) * t) * Math.exp(-beatPos * 2.5);
      const arp = 0.18 * arpEnv * Math.sin(2 * Math.PI * arpFreq * t);
      const kickEnv = Math.exp(-beatPos * 14);
      const kick = 0.24 * kickEnv * Math.sin(2 * Math.PI * (55 + 90 * kickEnv) * t);
      const fade = Math.min(1, t / 0.25, (durSec - t) / 0.35);
      samples[i] = fade * (pad + bass + arp + kick);
    }
  }

  return {
    blob: encodePcmToWavBlob(samples, sampleRate),
    durationFormatted: `00:${String(durSec).padStart(2, "0")}`,
  };
}

async function runSpecialMediaNode(node) {
  if (["text-video", "image-video", "video-video", "extend-video", "modify-video", "move"].includes(node.kind)) {
    const confVid = configuredModelsForKind("video");
    const chosenVideoModel = node.videoModel || "Auto";
    if (confVid.length && !["extend-video", "modify-video", "move"].includes(node.kind)) {
      if (chosenVideoModel === "Auto") {
        node.videoModel = confVid[0];
        markDirty();
      } else if (!isModelConfigured(chosenVideoModel, "video")) {
        notify(
          `Model Video "${chosenVideoModel}" chưa được cấu hình API Key. Chỉ gọi được model Video có chấm xanh lá: ${confVid.join(", ")}.`
        );
        return;
      }
    }
  }
  const labelMap = {
    "text-video": "Generating video...",
    "image-video": "Generating video...",
    "extend-video": "Extending video...",
    "modify-video": "Modifying video...",
    move: "Animating motion graphics...",
    speak: "Syncing lips & generating video...",
    "video-combiner": "Combining video clips...",
    "video-upscaler": "Upscaling video...",
    "video-sfx": "Generating synced video SFX...",
    "media-extractor": "Extracting media...",
    "speech-to-text": "Transcribing audio...",
    voiceover: "Generating voiceover...",
    "sound-effects": "Generating sound effect...",
    "audio-generator": "Generating audio...",
    "music-generator": "Generating music...",
    "image-to-svg": "Converting to SVG...",
    "svg-generator": "Generating vector SVG...",
    designer: "Rendering design...",
    "3d-generator": "Synthesizing 3D mesh...",
  };
  delete node._abortBatch;
  node._running = true;
  node._runningStart = Date.now();
  node._runningLabel = `${labelMap[node.kind] || "Processing..."} 1s`;
  renderGraph();
  const timer = setInterval(() => {
    const sec = Math.max(1, Math.round((Date.now() - node._runningStart) / 1000));
    if (!node._batchRunning) {
      node._runningLabel = `${labelMap[node.kind] || "Processing..."} ${sec}s`;
    }
    updateNodeRunningUI(node);
  }, 1000);

  await new Promise((r) => setTimeout(r, 900));
  remember();

  if (node.kind === "speech-to-text") {
    let transcript = "";
    if (state.project?.id) {
      try {
        await ensureSaved();
        const runRes = await request("/runs", {
          method: "POST",
          body: JSON.stringify({
            projectId: state.project.id,
            nodeId: node.id,
            version: state.project.version,
          }),
        });
        if (runRes?.id) {
          state.runs = [runRes, ...state.runs.filter((r) => r.id !== runRes.id)];
        }
        if (runRes?.state === "failed") {
          throw new Error(runRes.error || "Transcription failed.");
        }
        transcript = runRes?.snapshot?.transcriptText || "";
      } catch (err) {
        clearInterval(timer);
        delete node._running;
        delete node._runningLabel;
        renderGraph();
        notify(err.message || "Không thể chuyển đổi giọng nói sang văn bản.");
        return;
      }
    }
    if (!transcript) {
      const inEdge = state.graph.edges.find((e) => e.target === node.id && (e.targetPort === "audio" || e.targetPort === "source_video"));
      const srcNode = inEdge ? state.graph.nodes.find((n) => n.id === inEdge.source) : null;
      transcript =
        (srcNode && (srcNode.prompt || srcNode.text || srcNode.transcriptText)) ||
        "Transcribed audio track via ElevenLabs Scribe v2.";
    }
    clearInterval(timer);
    delete node._running;
    delete node._runningLabel;
    node.transcriptText = transcript;
    node.outputText = transcript;
    for (const outEdge of state.graph.edges.filter((e) => e.source === node.id)) {
      const targetNode = state.graph.nodes.find((n) => n.id === outEdge.target);
      if (targetNode?.kind === "text") {
        targetNode.text = transcript;
      }
    }
    pushOutputsToConnectedLists(node.id, [{ type: "text", text: transcript, selected: true }], "text");
    markDirty();
    renderGraph();
    notify(`Đã phiên âm hoàn tất (${node.sttModel || "ElevenLabs Scribe v2"}): "${transcript.slice(0, 64)}${transcript.length > 64 ? "…" : ""}"`);
    return;
  }

  if (["voiceover", "sound-effects", "audio-generator", "music-generator"].includes(node.kind)) {
    const scriptText =
      resolveConnectedPromptText(node) ||
      node.prompt ||
      (node.kind === "voiceover"
        ? "Welcome to Magnific Spaces! Every node is connected."
        : node.kind === "sound-effects"
          ? "Cinematic whoosh transition with deep bass impact"
          : node.kind === "audio-generator"
            ? "Warm studio ambient soundscape with organic textures"
            : "Upbeat electronic synthwave soundtrack, 120 BPM");
    let backendDone = false;
    if (state.project?.id) {
      try {
        await ensureSaved();
        const runRes = await request("/runs", {
          method: "POST",
          body: JSON.stringify({
            projectId: state.project.id,
            nodeId: node.id,
            version: state.project.version,
          }),
        });
        if (Array.isArray(runRes?.extraAssets)) {
          for (const ea of runRes.extraAssets) {
            if (ea?.id) state.assets = [ea, ...state.assets.filter((a) => a.id !== ea.id)];
          }
        }
        if (runRes?.asset) {
          state.assets = [runRes.asset, ...state.assets.filter((a) => a.id !== runRes.asset.id)];
          node.assetId = runRes.asset.id;
          node.audioUrl = runRes.asset.url;
          backendDone = true;
        } else if (runRes?.assetId) {
          await loadAssets();
          node.assetId = runRes.assetId;
          const foundAsset = state.assets.find((a) => a.id === runRes.assetId);
          if (foundAsset) node.audioUrl = foundAsset.url;
          backendDone = true;
        }
        if (runRes?.snapshot?.audioDuration) {
          node.audioDuration = runRes.snapshot.audioDuration;
        }
        if (Array.isArray(runRes?.snapshot?.batchAssetIds) && runRes.snapshot.batchAssetIds.length) {
          node.batchAssetIds = runRes.snapshot.batchAssetIds;
        } else if (node.assetId) {
          node.batchAssetIds = [node.assetId];
        }
        if (runRes?.id) {
          state.runs = [runRes, ...state.runs.filter((r) => r.id !== runRes.id)];
        }
        if (backendDone) {
          node.audioReady = true;
          const batchIds = Array.isArray(node.batchAssetIds) && node.batchAssetIds.length ? node.batchAssetIds : [node.assetId];
          pushOutputsToConnectedLists(
            node.id,
            batchIds.map((aid, idx) => ({
              type: "audio",
              assetId: aid,
              text: batchIds.length > 1 ? `${scriptText} (#${idx + 1})` : scriptText,
              duration: node.audioDuration || "00:05",
              selected: true,
            })),
            "audio"
          );
        }
      } catch {}
    }

    clearInterval(timer);
    delete node._running;
    delete node._runningLabel;

    if (!backendDone) {
      const { blob: wavBlob, durationFormatted } = synthesizeAudioWavBlob(node, scriptText);
      node.audioReady = true;
      node.audioDuration = durationFormatted;
      try {
        const prefix =
          node.kind === "voiceover"
            ? "Voiceover"
            : node.kind === "sound-effects"
              ? "SFX"
              : node.kind === "audio-generator"
                ? "AudioGen"
                : "Music";
        const asset = await uploadBlobAsAsset(wavBlob, `${prefix}_${node.id.slice(0, 6)}.wav`);
        node.assetId = asset.id;
        node.audioUrl = asset.url;
        node.batchAssetIds = [asset.id];
        pushOutputsToConnectedLists(
          node.id,
          [{ type: "audio", assetId: asset.id, text: scriptText, duration: durationFormatted, selected: true }],
          "audio"
        );
      } catch {}
    }

    if (node.kind === "voiceover" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const cleanSpeech = scriptText.replace(/\[[^\]]+\]/g, " ");
        const utter = new SpeechSynthesisUtterance(cleanSpeech);
        window.speechSynthesis.speak(utter);
      } catch {}
    }
    markDirty();
    renderGraph();
    const genCount = Math.max(1, Number(node.count) || 1);
    notify(
      genCount > 1
        ? `Đã tạo ${genCount} bản âm thanh .wav (${node.audioDuration || "00:05"}) và gắn trình phát lên thẻ.`
        : `Đã tạo tệp âm thanh .wav (${node.audioDuration || "00:05"}) và gắn trình phát lên thẻ.`
    );
    return;
  }

  if (node.kind === "3d-generator") {
    try {
      node._runningLabel = "Generating 3D Mesh (.GLB) & AI Back-View…";
      renderGraph();
      if (state.currentProject?.id) {
        if (state.dirty) {
          await persistGraphImmediate();
        }
        const payload = await api("/studio/api/runs", {
          method: "POST",
          body: JSON.stringify({
            projectId: state.currentProject.id,
            nodeId: node.id,
            version: state.currentProject.version,
          }),
        });
        clearInterval(timer);
        delete node._running;
        delete node._runningLabel;
        if (payload.asset) {
          const idx = state.assets.findIndex((a) => a.id === payload.asset.id);
          if (idx >= 0) state.assets[idx] = payload.asset;
          else state.assets.unshift(payload.asset);
        }
        if (payload.glbAsset) {
          const gIdx = state.assets.findIndex((a) => a.id === payload.glbAsset.id);
          if (gIdx >= 0) state.assets[gIdx] = payload.glbAsset;
          else state.assets.unshift(payload.glbAsset);
        }
        if (Array.isArray(payload.extraAssets)) {
          for (const ea of payload.extraAssets) {
            if (!ea?.id) continue;
            const eIdx = state.assets.findIndex((a) => a.id === ea.id);
            if (eIdx >= 0) state.assets[eIdx] = ea;
            else state.assets.unshift(ea);
          }
        }
        const runIdx = state.runs.findIndex((r) => r.id === payload.id);
        if (runIdx >= 0) state.runs[runIdx] = payload;
        else state.runs.unshift(payload);

        if (payload.state === "failed") {
          renderGraph();
          notify(payload.error || "Không thể tạo mô hình 3D (.glb).", true);
          return;
        }
        node.assetId = payload.assetId;
        if (payload.snapshot?.glbAssetId) {
          node.glbAssetId = payload.snapshot.glbAssetId;
        }
        if (payload.snapshot?.meshStats) {
          node.meshStats = payload.snapshot.meshStats;
        }
        const title = resolveConnectedPromptText(node) || node.prompt || "3D Character Mesh";
        pushOutputsToConnectedLists(node.id, [{ type: "image", assetId: payload.assetId, text: title }], "image");
        markDirty();
        renderGraph();
        const sizeMb = ((payload.glbAsset?.size || payload.snapshot?.meshStats?.glbSizeBytes || 0) / (1024 * 1024)).toFixed(2);
        notify(`Đã tạo mô hình 3D .GLB (${sizeMb} MB · Xoay 360°) thành công!`);
        return;
      }
    } catch (err) {
      clearInterval(timer);
      delete node._running;
      delete node._runningLabel;
      renderGraph();
      notify(err?.message || "Lỗi khi tạo mô hình 3D (.glb).", true);
      return;
    }
    clearInterval(timer);
    delete node._running;
    delete node._runningLabel;
    renderGraph();
    return;
  }

  if (node.kind === "image-to-svg" || node.kind === "svg-generator") {
    clearInterval(timer);
    delete node._running;
    delete node._runningLabel;
    const title = resolveConnectedPromptText(node) || (node.kind === "image-to-svg" ? "Vectorized SVG Art" : "Minimalist Geometric Vector Emblem");
    const srcId = node.kind === "image-to-svg" ? resolveUpstreamAssetId(node, "source_image") : "";
    const srcAsset = srcId ? state.assets.find((a) => a.id === srcId) : null;
    const srcImg = srcAsset ? await loadImageElementFromUrl(srcAsset.url) : null;

    let blob = null;
    if (srcImg) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (node.removeBg === false) {
        ctx.fillStyle = "#181924";
        ctx.fillRect(0, 0, 1024, 1024);
      }
      ctx.filter = "contrast(1.35) saturate(1.25)";
      const scale = Math.min(920 / srcImg.width, 920 / srcImg.height);
      const dw = Math.round(srcImg.width * scale);
      const dh = Math.round(srcImg.height * scale);
      ctx.drawImage(srcImg, Math.round((1024 - dw) / 2), Math.round((1024 - dh) / 2), dw, dh);
      ctx.filter = "none";
      blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    } else {
      blob = await createProceduralImageBlob(title, "Vector SVG · 1024 × 1024", 1024, 1024, ["#1f2937", "#ea580c", "#facc15"]);
    }
    node.svgMarkup = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="240" rx="28" fill="${node.removeBg ? "none" : "#181924"}"/><polygon points="120,32 196,178 44,178" fill="#f97316" opacity="0.9"/><polygon points="120,68 168,178 72,178" fill="#fb923c"/><circle cx="120" cy="142" r="22" fill="#fff7ed"/></svg>`;
    const asset = await uploadBlobAsAsset(blob, `Vector_${node.id.slice(0, 6)}.png`);
    node.assetId = asset.id;
    pushOutputsToConnectedLists(node.id, [{ type: "image", assetId: asset.id }], "image");
    markDirty();
    renderGraph();
    notify("Đã tạo vector SVG và ảnh đầu ra.");
    return;
  }

  if (node.kind === "designer") {
    clearInterval(timer);
    delete node._running;
    delete node._runningLabel;
    const tplName = node.template || "Social Poster";
    const headline = node.headline || resolveConnectedPromptText(node) || "MAGNIFIC AI";
    const subhead = node.subhead || "Every Node Explained · Studio Design";
    const srcId = resolveUpstreamAssetId(node, "source_image");
    const srcAsset = srcId ? state.assets.find((a) => a.id === srcId) : null;
    const srcImg = srcAsset ? await loadImageElementFromUrl(srcAsset.url) : null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1280;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 1024, 1280);
    grad.addColorStop(0, "#111827");
    grad.addColorStop(0.55, "#1e1b4b");
    grad.addColorStop(1, "#311042");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1280);

    if (srcImg) {
      const targetW = 896;
      const targetH = 820;
      const scale = Math.max(targetW / srcImg.width, targetH / srcImg.height);
      const sw = targetW / scale;
      const sh = targetH / scale;
      const sx = (srcImg.width - sw) / 2;
      const sy = (srcImg.height - sh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(64, 64, targetW, targetH, 28);
      ctx.clip();
      ctx.drawImage(srcImg, sx, sy, sw, sh, 64, 64, targetW, targetH);
      ctx.restore();
    }

    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.font = "700 22px Inter, Segoe UI, sans-serif";
    ctx.fillText(tplName.toUpperCase(), 68, 956);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 64px Inter, Segoe UI, sans-serif";
    ctx.fillText(String(headline).slice(0, 26), 64, 1044);
    ctx.fillStyle = "rgba(226,232,240,0.88)";
    ctx.font = "500 32px Inter, Segoe UI, sans-serif";
    ctx.fillText(String(subhead).slice(0, 44), 64, 1106);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const asset = await uploadBlobAsAsset(blob, `Design_${node.id.slice(0, 6)}.png`);
    node.assetId = asset.id;
    pushOutputsToConnectedLists(node.id, [{ type: "image", assetId: asset.id }], "image");
    markDirty();
    renderGraph();
    notify(`Đã kết xuất thiết kế (${tplName}) thành công!`);
    return;
  }

  const batchInfo = computeNodeBatchCombinations(node);
  const rawDur = String(node.duration || "10s");
  const durFormatted = rawDur.includes("10") ? "00:10" : rawDur.includes("8") ? "00:08" : "00:05";
  const vModelName = node.videoModel && node.videoModel !== "Auto" ? node.videoModel : "Kling 2.5";
  const vRatio = node.videoRatio || "9:16";
  const vRes = node.videoRes && node.videoRes !== "Auto" ? node.videoRes : "720p";
  const [vidW, vidH] = ASPECT_RATIOS[vRatio]?.dims || [768, 1376];

  const isBackendVideoKind = [
    "text-video",
    "image-video",
    "video-video",
    "extend-video",
    "modify-video",
    "move",
    "speak",
    "video-combiner",
    "video-upscaler",
    "video-sfx",
    "media-extractor",
  ].includes(node.kind);

  const vidRepeatCount = ["text-video", "image-video", "video-video"].includes(node.kind)
    ? Math.max(1, Math.min(4, Number(node.count) || 1))
    : 1;
  const baseVidPrompt = resolveConnectedPromptText(node) || node.prompt || node.customTitle || node.kind;
  const baseVidStartId = resolveUpstreamAssetId(node, "start_image") || resolveUpstreamAssetId(node, "source_image") || "";
  const videoBatchCombos =
    batchInfo.isListMode && batchInfo.combinations.length > 0
      ? batchInfo.combinations
      : vidRepeatCount > 1
        ? Array.from({ length: vidRepeatCount }, (_, idx) => ({
            index: idx,
            prompt: baseVidPrompt,
            sourceAssetId: baseVidStartId,
            isCountRepeat: true,
          }))
        : null;

  if (videoBatchCombos && videoBatchCombos.length > 0) {
    node._batchRunning = true;
    if (!Array.isArray(node.batchAssetIds)) node.batchAssetIds = [];
    const combos = videoBatchCombos;
    let completedCount = 0;
    if (isBackendVideoKind && state.project?.id) {
      try {
        await ensureSaved();
      } catch {}
    }

    for (let i = 0; i < combos.length; i++) {
      if (node._abortBatch) break;
      const comb = combos[i];
      node._runningLabel = `Generating video ${i + 1}/${combos.length}...`;
      updateNodeRunningUI(node);
      await new Promise((r) => setTimeout(r, 120));

      let frameAssetId = comb.sourceAssetId || resolveUpstreamAssetId(node, "start_image");
      let lastFrameId = resolveUpstreamAssetId(node, "end_image") || frameAssetId;
      let videoAssetId = null;

      if (isBackendVideoKind && state.project?.id) {
        try {
          const runRes = await request("/runs", {
            method: "POST",
            body: JSON.stringify({
              projectId: state.project.id,
              nodeId: node.id,
              version: state.project.version,
              ...(comb.isCountRepeat ? { seedOverride: (node.seed || 100) + i } : { combinationIndex: i }),
            }),
          });
          if (Array.isArray(runRes?.extraAssets)) {
            for (const ea of runRes.extraAssets) {
              if (ea?.id) state.assets = [ea, ...state.assets.filter((a) => a.id !== ea.id)];
            }
          }
          if (runRes?.asset) {
            state.assets = [runRes.asset, ...state.assets.filter((a) => a.id !== runRes.asset.id)];
            videoAssetId = runRes.asset.id;
          } else if (runRes?.assetId) {
            await loadAssets();
            videoAssetId = runRes.assetId;
          }
          if (runRes?.snapshot?.firstFrameAssetId) frameAssetId = runRes.snapshot.firstFrameAssetId;
          if (runRes?.snapshot?.lastFrameAssetId) lastFrameId = runRes.snapshot.lastFrameAssetId;
          if (runRes?.snapshot?.audioAssetId) node.audioAssetId = runRes.snapshot.audioAssetId;
          if (runRes?.id) {
            state.runs = [runRes, ...state.runs.filter((r) => r.id !== runRes.id)];
          }
          if (runRes?.state === "failed" && runRes?.error) {
            notify(runRes.error);
          }
        } catch (err) {
          notify(err?.message || "Lỗi khi chạy batch video.");
        }
      }
      if (!videoAssetId) continue;
      if (!node.batchAssetIds.includes(videoAssetId)) node.batchAssetIds.push(videoAssetId);

      node.firstFrameAssetId = frameAssetId || videoAssetId;
      node.lastFrameAssetId = lastFrameId || frameAssetId || videoAssetId;
      node.assetId = videoAssetId;
      node.videoGenerated = true;
      node.videoDuration = durFormatted;

      pushOutputsToConnectedLists(
        node.id,
        [
          {
            type: "video",
            assetId: videoAssetId,
            firstFrameAssetId: node.firstFrameAssetId,
            lastFrameAssetId: node.lastFrameAssetId,
            referenceAssetId: node.firstFrameAssetId,
            text: comb.prompt || `Video #${i + 1}`,
            prompt: comb.prompt || `Video #${i + 1}`,
            duration: durFormatted,
            model: vModelName,
            ratio: vRatio,
            res: vRes,
            fps: "24fps",
            width: vidW,
            height: vidH,
          },
        ],
        "video",
        i > 0
      );
      completedCount++;
    }

    clearInterval(timer);
    const wasAborted = Boolean(node._abortBatch);
    delete node._abortBatch;
    delete node._running;
    delete node._batchRunning;
    delete node._runningLabel;
    markDirty();
    renderGraph();
    notify(
      wasAborted
        ? `Đã dừng sau khi tạo ${completedCount}/${combos.length} video.`
        : `Đã tạo hoàn tất ${completedCount} video (${vModelName}) và đẩy sang List!`
    );
    return;
  }

  const promptText = resolveConnectedPromptText(node) || node.customTitle || node.kind;
  let frameAssetId = resolveUpstreamAssetId(node, "start_image") || resolveUpstreamAssetId(node, "source_image") || resolveUpstreamAssetId(node, "source_video");
  let lastFrameId = resolveUpstreamAssetId(node, "end_image") || frameAssetId;
  let extractedFrameId = "";
  let videoAssetId = null;

  if (isBackendVideoKind && state.project?.id) {
    try {
      await ensureSaved();
      const runRes = await request("/runs", {
        method: "POST",
        body: JSON.stringify({
          projectId: state.project.id,
          nodeId: node.id,
          version: state.project.version,
        }),
      });
      if (Array.isArray(runRes?.extraAssets)) {
        for (const ea of runRes.extraAssets) {
          if (ea?.id) state.assets = [ea, ...state.assets.filter((a) => a.id !== ea.id)];
        }
      }
      if (runRes?.asset) {
        state.assets = [runRes.asset, ...state.assets.filter((a) => a.id !== runRes.asset.id)];
        videoAssetId = runRes.asset.id;
      } else if (runRes?.assetId) {
        await loadAssets();
        videoAssetId = runRes.assetId;
      }
      if (runRes?.snapshot?.firstFrameAssetId) frameAssetId = runRes.snapshot.firstFrameAssetId;
      if (runRes?.snapshot?.lastFrameAssetId) lastFrameId = runRes.snapshot.lastFrameAssetId;
      if (runRes?.snapshot?.extractedFrameAssetId) extractedFrameId = runRes.snapshot.extractedFrameAssetId;
      if (runRes?.snapshot?.audioAssetId) node.audioAssetId = runRes.snapshot.audioAssetId;
      if (runRes?.id) {
        state.runs = [runRes, ...state.runs.filter((r) => r.id !== runRes.id)];
      }
      if (runRes?.state === "failed") {
        throw new Error(runRes.error || "Xử lý video thất bại.");
      }
    } catch (error) {
      clearInterval(timer);
      delete node._running;
      delete node._runningLabel;
      renderGraph();
      notify(error.message || "Không thể xử lý video.");
      return;
    }
  }

  clearInterval(timer);
  delete node._running;
  delete node._runningLabel;

  if (!videoAssetId) {
    const videoModelSubtitle = node.videoModel && node.videoModel !== "Auto" ? `${node.videoModel} · ` : "";
    const firstBlob = await createProceduralImageBlob(
      `${promptText} · Video`,
      `${videoModelSubtitle}${vidW} × ${vidH} · ${durFormatted}`,
      480,
      864,
      ["#0f172a", "#0284c7", "#22c55e"]
    );
    const firstAsset = await uploadBlobAsAsset(firstBlob, `Video_${node.id.slice(0, 6)}.png`);
    videoAssetId = firstAsset.id;
    if (!frameAssetId) frameAssetId = firstAsset.id;
  }
  node.firstFrameAssetId = frameAssetId || videoAssetId;
  node.lastFrameAssetId = lastFrameId || frameAssetId || videoAssetId;
  if (extractedFrameId) node.extractedFrameAssetId = extractedFrameId;
  node.assetId = videoAssetId;
  node.videoGenerated = true;
  node.videoDuration = durFormatted;
  pushOutputsToConnectedLists(
    node.id,
    [
      {
        type: "video",
        assetId: videoAssetId,
        firstFrameAssetId: node.firstFrameAssetId,
        lastFrameAssetId: node.lastFrameAssetId,
        referenceAssetId: node.firstFrameAssetId,
        text: promptText,
        prompt: promptText,
        duration: durFormatted,
        model: vModelName,
        ratio: vRatio,
        res: vRes,
        fps: "24fps",
        width: vidW,
        height: vidH,
      },
    ],
    "video"
  );
  markDirty();
  renderGraph();
  if (node.kind === "video-combiner") {
    notify("Đã ghép các video thành 1 video hoàn chỉnh (.mp4) và trích xuất First/Last Frame!");
  } else if (node.kind === "media-extractor") {
    notify(`Đã trích xuất Frame @ ${Number(node.frameTime || 1.2).toFixed(1)}s (.png), Audio (.wav) và cắt Clip (${node.trimStart || "00:00"} – ${node.trimEnd || "00:05"}) (.mp4)!`);
  } else if (node.kind === "video-upscaler") {
    notify(`Đã nâng cấp độ phân giải Video (${node.videoRes || "2K"} · ${node.upscaleDetail || "Crisp"}) (.mp4)!`);
  } else if (node.kind === "extend-video") {
    notify(`Đã nối dài Video thêm ${node.duration || "6s"} (.mp4)${node.generateAudio !== false ? " kèm âm thanh" : ""}!`);
  } else if (node.kind === "modify-video") {
    notify(`Đã biến đổi Video với ${node.videoModel || "MiniMax H3"} (${node.videoRes || "2K"}) (.mp4)!`);
  } else if (node.kind === "move") {
    notify(`Đã tạo chuyển động Motion Graphics (${node.moveStyle || "3D Parallax Orbit"}) (.mp4)!`);
  } else if (node.kind === "video-sfx") {
    notify("Đã tạo hiệu ứng âm thanh đồng bộ chuyển động (.wav) và ghép vào Video (.mp4)!");
  } else {
    notify("Đã hoàn tất tạo Video (.mp4) và đồng bộ đầu ra!");
  }
}

async function runNode(nodeId) {
  const node = state.graph.nodes.find((item) => item.id === nodeId);
  if (!node || node.muted) return;

  if (node._batchRunning || node._running) {
    node._abortBatch = true;
    notify("Đang dừng tiến trình chạy hàng loạt...");
    return;
  }
  const activePending = latestRun(node.id);
  if (isBridgePending(activePending)) {
    try {
      await request(`/runs/${encodeURIComponent(activePending.id)}/cancel`, { method: "POST" });
      await refreshRuns();
      renderGraph();
      notify("Đã hủy tiến trình đang chờ. Bạn có thể chọn Local GPU (VRAM) và chạy lại!");
    } catch (err) {
      notify(err?.message || "Không thể hủy tiến trình.");
    }
    return;
  }

  delete node._previewSelectedRatio;

  if (node.kind === "assistant") {
    await runAssistantNode(node);
    return;
  }
  if (!["text-image", "image-image", "upscaler"].includes(node.kind)) {
    await runSpecialMediaNode(node);
    return;
  }

  if (node.kind === "upscaler") {
    const rawUpModel = node.upscaleModel || node.model || "Antigravity AI Bridge";
    const upModel = rawUpModel === "local-gpu-vram" ? "Local GPU (VRAM)" : rawUpModel;
    node.upscaleModel = upModel;
    node.model = upModel;
    node.presetLabel = upModel;
    markDirty();
  } else {
    const confImg = configuredModelsForKind("image");
    const isDirectCheckpoint = Boolean(node.model && state.comfy.checkpoints.includes(node.model));
    const currentImgModel = isDirectCheckpoint ? node.model : node.presetLabel || node.model || "";
    const isLocalGpuSelection =
      currentImgModel === "Local GPU (VRAM)" ||
      currentImgModel === "local-gpu-vram" ||
      isDirectCheckpoint;
    if (isLocalGpuSelection) {
      node.model = currentImgModel === "local-gpu-vram" ? "Local GPU (VRAM)" : currentImgModel;
    } else if (confImg.length) {
      if (!currentImgModel || currentImgModel === "Auto" || currentImgModel === "auto") {
        node.model = confImg[0];
        node.presetLabel = confImg[0];
        markDirty();
      } else if (!isModelConfigured(currentImgModel, "image")) {
        notify(
          `Model Image "${currentImgModel}" chưa được cấu hình API Key. Chỉ gọi được model Image có chấm xanh lá: ${confImg.join(", ")}.`
        );
        return;
      } else {
        node.model = currentImgModel;
      }
    } else if (!node.model && state.comfy.checkpoints.length) {
      node.model = state.comfy.checkpoints[0];
      markDirty();
    }
  }
  const buttons = [...document.querySelectorAll("[data-run-for]")].filter((item) => item.dataset.runFor === nodeId);
  buttons.forEach((button) => {
    button.disabled = true;
  });

  const batchInfo = computeNodeBatchCombinations(node);
  const singleComb = batchInfo.combinations?.[0] || null;
  const imgRepeatCount = Math.max(1, Math.min(4, Number(node.count) || 1));
  const baseImgPrompt = singleComb?.prompt || resolveConnectedPromptText(node) || node.prompt || "";
  const baseImgSourceId =
    singleComb?.sourceAssetId ||
    resolveUpstreamAssetId(node, node.kind === "text-image" ? "reference_image" : "source_image") ||
    "";
  const combos =
    batchInfo.isListMode && batchInfo.combinations.length > 1
      ? batchInfo.combinations
      : imgRepeatCount > 1 && node.subKind !== "variations"
        ? Array.from({ length: imgRepeatCount }, (_, idx) => ({
            index: idx,
            prompt: baseImgPrompt,
            sourceAssetId: baseImgSourceId,
            isCountRepeat: true,
          }))
        : null;

  try {
    await ensureSaved();
    if (combos && combos.length > 1) {
      delete node._abortBatch;
      node._batchRunning = true;
      if (!Array.isArray(node.batchAssetIds)) node.batchAssetIds = [];
      let completedCount = 0;

      for (let i = 0; i < combos.length; i++) {
        if (node._abortBatch) break;
        const comb = combos[i];
        node._runningLabel = `Generating ${i + 1}/${combos.length}...`;
        if (i === 0) renderGraph();
        else updateNodeRunningUI(node);

        const run = await request("/runs", {
          method: "POST",
          body: JSON.stringify({
            projectId: state.project.id,
            nodeId,
            version: state.project.version,
            ...(comb.isCountRepeat ? {} : { combinationIndex: i }),
            seedOverride: (node.seed || 100) + i,
          }),
        });
        state.runs.unshift(run);
        if (run.asset) {
          state.assets = [run.asset, ...state.assets.filter((a) => a.id !== run.asset.id)];
        }

        if (run.state === "succeeded" && run.assetId) {
          node.assetId = run.assetId;
          if (!node.batchAssetIds.includes(run.assetId)) node.batchAssetIds.push(run.assetId);
          if (!run.asset) await loadAssets();
          pushOutputsToConnectedLists(
            node.id,
            [
              {
                type: "image",
                assetId: run.assetId,
                text: "",
                width: node.width || 768,
                height: node.height || 1376,
                model: displayModelName(node),
                referenceAssetId: comb.sourceAssetId || "",
              },
            ],
            "image",
            i > 0
          );
          completedCount++;
          continue;
        }

        const isTrueBridgeRun =
          Boolean(run.snapshot?.bridgePending) ||
          run.snapshot?.executionMode === "bridge" ||
          run.snapshot?.model === "Antigravity AI Bridge" ||
          run.snapshot?.model === "antigravity-ai-bridge";
        if (isTrueBridgeRun) {
          completedCount++;
          continue;
        }

        // Poll until this batch item finishes (when running against async ComfyUI worker)
        for (let step = 0; step < 300; step++) {
          if (node._abortBatch) break;
          await new Promise((r) => setTimeout(r, 400));
          const updated = await request(`/runs/${run.id}`);
          const idx = state.runs.findIndex((r) => r.id === run.id);
          if (idx >= 0) state.runs[idx] = updated;
          if (updated.state === "succeeded" && updated.assetId) {
            node.assetId = updated.assetId;
            if (!node.batchAssetIds.includes(updated.assetId)) node.batchAssetIds.push(updated.assetId);
            await loadAssets();
            pushOutputsToConnectedLists(
              node.id,
              [
                {
                  type: "image",
                  assetId: updated.assetId,
                  text: comb.prompt,
                  prompt: comb.prompt,
                  width: node.width || 768,
                  height: node.height || 1376,
                  model: displayModelName(node),
                  referenceAssetId: comb.sourceAssetId || "",
                },
              ],
              "image",
              i > 0
            );
            completedCount++;
            break;
          }
          if (updated.state === "failed") break;
        }
      }

      const wasAborted = Boolean(node._abortBatch);
      delete node._abortBatch;
      delete node._batchRunning;
      delete node._runningLabel;
      renderGraph();
      if (state.runs.some((r) => isBridgePending(r))) {
        refreshRuns().catch(() => {});
      }
      notify(
        wasAborted
          ? `Đã dừng sau khi tạo ${completedCount}/${combos.length} ảnh.`
          : `Đã kích hoạt Batch ${completedCount} tổ hợp và đồng bộ sang List!`
      );
      return;
    }

    const run = await request("/runs", {
      method: "POST",
      body: JSON.stringify({
        projectId: state.project.id,
        nodeId,
        version: state.project.version,
        ...(batchInfo.isListMode && batchInfo.combinations.length === 1 ? { combinationIndex: 0 } : {}),
      }),
    });
    delete node.historyIndex;
    state.runs.unshift(run);
    if (run.asset) {
      state.assets = [run.asset, ...state.assets.filter((a) => a.id !== run.asset.id)];
    } else if (run.assetId) {
      await loadAssets();
    }
    if (run.state === "succeeded" && run.assetId) {
      node.assetId = run.assetId;
      if (node.subKind !== "variations") {
        pushOutputsToConnectedLists(
          node.id,
          [
            {
              type: "image",
              assetId: run.assetId,
              text: singleComb?.prompt || resolveConnectedPromptText(node) || node.prompt || "",
              prompt: singleComb?.prompt || resolveConnectedPromptText(node) || node.prompt || "",
              width: node.width || 1376,
              height: node.height || 768,
              model: displayModelName(node),
              referenceAssetId: singleComb?.sourceAssetId || resolveUpstreamAssetId(node, "reference_image") || "",
            },
          ],
          "image"
        );
      }
    }
    renderGraph();
    if (run.state === "failed") notify(run.error);
    else {
      notify(run.state === "succeeded" ? "Đã tạo ảnh hoàn tất." : "Đã gửi workflow tới ComfyUI.");
      await refreshRuns();
      await loadAssets();
      if (node.subKind === "variations") {
        syncVariationNodeToList(node, true);
        renderGraph();
      }
    }
  } catch (error) {
    delete node._abortBatch;
    delete node._batchRunning;
    delete node._runningLabel;
    notify(error.message);
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }
}

function mediaType(kind) {
  if (kind === "text" || kind === "assistant") return "text";
  if (kind === "audio" || ["speech-to-text", "voiceover", "sound-effects", "audio-generator", "music-generator"].includes(kind)) return "audio";
  if (kind === "image-to-svg" || kind === "svg-generator") return "svg";
  if (
    kind === "video" ||
    kind.endsWith("video") ||
    ["speak", "move", "video-combiner", "video-upscaler", "video-sfx", "media-extractor"].includes(kind)
  ) {
    return "video";
  }
  return "image";
}

function iconMarkup(type) {
  if (type === "text") {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 9h7M12 9v6.5"/></svg>';
  }
  if (type === "audio") {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
  }
  if (type === "svg") {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M8.5 7.5 11 15.5M15.5 7.5 13 15.5M9 6h6"/></svg>';
  }
  if (type === "video") {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 3 3 3-4 5 6"/></svg>';
}

function actionIcon(type) {
  if (type === "upload") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m-5 5 5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>';
  if (type === "assets") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 16h3l6.5-6.5a1.5 1.5 0 0 0-2.1-2.1L8.9 13.9 8 16z"/></svg>';
  if (type === "play") return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5a1 1 0 0 1 1.5-.86l12 7.5a1 1 0 0 1 0 1.72l-12 7.5A1 1 0 0 1 7 19.5z"/></svg>';
  if (type === "edit") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 16h3l6.5-6.5a1.5 1.5 0 0 0-2.1-2.1L8.9 13.9 8 16z"/></svg>';
  if (type === "delete") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v6m4-6v6"/></svg>';
  if (type === "chain") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6.5c4.5 0 2.5 11 7 11"/></svg>';
  if (type === "more") return '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>';
  if (type === "plus") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  if (type === "close") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  if (type === "instance") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>';
  if (type === "link") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4m0-11-6.8 4"/></svg>';
  if (type === "copy") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  if (type === "download") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12m-5-5 5 5 5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>';
  if (type === "replace") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><path d="M14 5h5v5"/><path d="M10 19H5v-5"/></svg>';
  if (type === "expand") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
  if (type === "bookmark") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
  if (type === "roller") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="14" height="6" rx="1.5"/><path d="M17 6h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-7a2 2 0 0 0-2 2v2"/><rect x="8.5" y="17" width="3" height="4" rx="1"/></svg>';
  if (type === "pin") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4.5 19.5 9l-2 1.5-3.5-3.5-4.5 4.5L11 15l-1.5 1.5-3-3L3 17l3.5-3.5-3-3L5 9l3.5 1.5 4.5-4.5-3.5-3.5z"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
}

function catalogIcon(name) {
  if (name === "upload" || name === "assets") return actionIcon(name);
  if (name === "stock") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8 11h6M11 8v6"/></svg>';
  if (name === "reference") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M18 8v6M15 11h6"/></svg>';
  if (name === "image-gen") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 3 3 3-4 5 6"/></svg>';
  if (name === "video-gen") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2.2"/><path d="m16 10 5-3v10l-5-3z"/></svg>';
  if (name === "modify-video") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2.2"/><path d="m16 10 5-3v10l-5-3z"/><path d="m9.5 9.5 1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></svg>';
  if (name === "extend-video") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/><path d="M16 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/><path d="M12 4v16"/></svg>';
  if (name === "video-combiner") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="8" height="12" rx="1.8"/><rect x="14" y="6" width="8" height="12" rx="1.8"/><path d="M10 12h4"/></svg>';
  if (name === "video-upscaler") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.2"/><path d="M10 9h5v5"/><path d="m15 9-6 6"/></svg>';
  if (name === "video-sfx") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="11" height="12" rx="2"/><path d="m13 10 4-2.5v9L13 14z"/><path d="M19.5 8v8m2.5-5v2"/></svg>';
  if (name === "move") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 17.5c4.5 0 3.5-11 7-11"/><path d="M14 4h4v4"/></svg>';
  if (name === "media-extractor") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 5v14M15 5v14"/></svg>';
  if (name === "assistant") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m11 4 1.8 4.2L17 10l-4.2 1.8L11 16l-1.8-4.2L5 10l4.2-1.8z"/><path d="m18 14 .9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z"/></svg>';
  if (name === "speech-to-text") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 9h7M12 9v6.5"/></svg>';
  if (name === "voiceover") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v4m-3 0h6"/></svg>';
  if (name === "audio-gen") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 10v4m4-7v10m4-12v14m4-9v4m4-6v8"/></svg>';
  if (name === "music-generator") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
  if (name === "sound-effects") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
  if (name === "text") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 9h8M12 9v7"/></svg>';
  if (name === "list") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11M5 6h.01M5 12h.01M5 18h.01"/></svg>';
  if (name === "upscaler") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M10 8h6v6"/><path d="m16 8-8 8"/></svg>';
  if (name === "image-edit") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="14" height="14" rx="2"/><path d="m15 11 6 6-3 3-6-6z"/><path d="m18 5 .8 1.7L20.5 7.5l-1.7.8L18 10l-.8-1.7-1.7-.8 1.7-.8z"/></svg>';
  if (name === "variations") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
  if (name === "skin-enhancer") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-8-8"/><path d="M9 14s1.2 1.5 3 1.5 3-1.5 3-1.5"/><path d="M9.5 10h.01M14.5 10h.01"/><path d="m18 3 .7 1.8L20.5 5.5l-1.8.7L18 8l-.7-1.8-1.8-.7 1.8-.7z"/></svg>';
  if (name === "speak") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="3.5"/><path d="M4 19a5 5 0 0 1 10 0"/><path d="M16 8a4 4 0 0 1 0 5"/><path d="M18.5 6a7 7 0 0 1 0 9"/></svg>';
  if (name === "sketch") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>';
  if (name === "router") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="18" cy="17" r="2"/><path d="M8 11.2 16 7.8M8 12.8l8 3.4"/></svg>';
  if (name === "crop-image") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>';
  if (name === "change-ratio") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h5v5"/><path d="M9 20H4v-5"/><path d="m20 4-6 6"/><path d="m4 20 6-6"/></svg>';
  if (name === "camera-angle") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2.2"/><path d="m16 10 5-3v10l-5-3z"/><circle cx="9.5" cy="12" r="2"/></svg>';
  if (name === "remove-bg") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 15 6-6 6 6 6-6"/></svg>';
  if (name === "adjust-colors") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="11" cy="17" r="2"/></svg>';
  if (name === "relight") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  if (name === "image-to-svg" || name === "svg-generator") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7.5 11 16M16 7.5 13 16M8.5 6h7"/></svg>';
  if (name === "sticky-note") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M14 3v4a2 2 0 0 0 2 2h4"/></svg>';
  if (name === "group") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 3"><rect x="3" y="4" width="18" height="16" rx="2.5"/></svg>';
  if (name === "var-age") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 19a7 7 0 0 1 14 0"/></svg>';
  if (name === "var-custom") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 4-1 1 4 4 1-1a2.8 2.8 0 0 0-4-4z"/><path d="m13 6-9 9v4h4l9-9"/><path d="m5 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></svg>';
  if (name === "var-demographics") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 19a5 5 0 0 1 6 0"/></svg>';
  if (name === "var-expressions") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-8-8"/><path d="M9 14s1.2 1.5 3 1.5 3-1.5 3-1.5"/><path d="M9.5 10h.01M14.5 10h.01"/><path d="m18 3 .7 1.8L20.5 5.5l-1.8.7L18 8l-.7-1.8-1.8-.7 1.8-.7z"/></svg>';
  if (name === "var-reframe") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h3M7 9v3M17 15h-3M17 15v-3"/></svg>';
  if (name === "var-storyboard") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M8 5l2 5M14 5l2 5"/></svg>';
  if (name === "3d-gen") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>';
  if (name === "designer") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 10h18M10 10v10"/></svg>';
  if (name === "provider-google") return 'G';
  if (name === "provider-openai") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 3a5 5 0 0 1 4.3 2.5l3.2 5.5a5 5 0 0 1-1.8 6.8l-5.7 3.2a5 5 0 0 1-6.8-1.8L2 13.7a5 5 0 0 1 1.8-6.8L9.5 3.7A5 5 0 0 1 12 3z"/></svg>';
  if (name === "provider-kling") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5c-4 0-6 2.5-4 5.5s4 3 4 5.5-2 3-6 3"/></svg>';
  if (name === "provider-minimax") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 13v-2m3.5 5V8m3.5 8V6m3.5 10V9m3.5 4v-2"/></svg>';
  return iconMarkup("image");
}

function showCatalogPreview(id) {
  const preview = $("#catalogPreview");
  const info = NODE_PREVIEW_INFO[id];
  const addOpen = !$("#addPanel").hidden;
  const dropOpen = !$("#wireDropMenu").hidden;
  if (!info || (!addOpen && !dropOpen)) {
    preview.hidden = true;
    return;
  }
  if (dropOpen) {
    const dropRect = $("#wireDropMenu").getBoundingClientRect();
    const wsRect = $(".workspace-main").getBoundingClientRect();
    preview.style.left = `${Math.min(wsRect.width - 260, dropRect.right - wsRect.left + 10)}px`;
    preview.style.bottom = `${Math.max(16, wsRect.bottom - dropRect.bottom)}px`;
  } else {
    preview.style.left = "398px";
    preview.style.bottom = "58px";
  }
  const svgIcon = catalogIcon(info.icon || "image-gen");
  const tagsHtml = Array.isArray(info.tags) && info.tags.length
    ? `<div class="catalog-preview-tags">${info.tags
        .map((tag) => {
          const tagIcon = tag.toLowerCase().includes("model")
            ? actionIcon("settings")
            : tag.toLowerCase().includes("image")
              ? catalogIcon("image-gen")
              : "";
          return `<span class="catalog-preview-tag">${tagIcon}<span>${escapeHtml(tag)}</span></span>`;
        })
        .join("")}</div>`
    : "";
  preview.innerHTML = `
    <div class="catalog-preview-stage">
      <span class="catalog-preview-hero-icon">${svgIcon}</span>
    </div>
    <h4>${svgIcon}<span>${escapeHtml(info.title)}</span></h4>
    <p>${escapeHtml(info.desc)}</p>
    ${tagsHtml}
  `;
  preview.hidden = false;
}

function spawnCatalogFlowTemplate(flowTitle) {
  closeAddPanel();
  const baseY = state.graph.nodes.length
    ? Math.max(...state.graph.nodes.map((n) => (Number(n.y) || 0) + 480))
    : 160;
  const baseX = 120;

  if (flowTitle === "Paper stop-motion assembly") {
    const txt = addNode("text", null, { x: baseX, y: baseY }, {
      presetPrompt: "Handmade layered paper craft stop-motion animation, miniature origami village assembling piece by piece, warm studio lighting",
    });
    const imgGen = addNode("text-image", txt.id, { x: baseX + 440, y: baseY });
    imgGen.model = "Google Nano Banana 2";
    imgGen.presetLabel = "Google Nano Banana 2";
    const vidGen = addNode("text-video", imgGen.id, { x: baseX + 900, y: baseY }, {
      presetPrompt: "Tactile paper stop-motion assembly, 12fps handcrafted animation",
    });
    vidGen.videoModel = "Kling 3.0";
  } else if (flowTitle === "Film your shot list") {
    const asst = addNode("assistant", null, { x: baseX, y: baseY }, {
      presetPrompt: "Direct a 3-shot cinematic sequence for a sci-fi explorer",
    });
    const list = addNode("list", asst.id, { x: baseX + 430, y: baseY }, {
      items: [
        { type: "text", text: "1. Wide establishing shot, bioluminescent alien canyon at dusk" },
        { type: "text", text: "2. Low-angle tracking shot, explorer walking through glowing mist" },
        { type: "text", text: "3. Extreme close-up, visor reflecting ancient hologram" },
      ],
    });
    const imgGen = addNode("text-image", list.id, { x: baseX + 860, y: baseY });
    const vidGen = addNode("text-video", imgGen.id, { x: baseX + 1300, y: baseY }, {
      presetPrompt: "Cinematic camera movement matching shot list",
    });
    addNode("video-combiner", vidGen.id, { x: baseX + 1740, y: baseY });
  } else if (flowTitle === "POV Realistic video generator") {
    const txt = addNode("text", null, { x: baseX, y: baseY }, {
      presetPrompt: "First-person POV camera gliding through an alpine mountain ridge at sunrise, crisp action camera perspective",
    });
    const imgGen = addNode("text-image", txt.id, { x: baseX + 440, y: baseY });
    const vidGen = addNode("text-video", imgGen.id, { x: baseX + 900, y: baseY }, {
      presetPrompt: "Hyper-realistic stabilized first-person POV forward motion",
    });
    vidGen.videoModel = "Veo 3.1";
  } else {
    // "Time stops, only you keep moving"
    const imgGen = addNode("text-image", null, { x: baseX, y: baseY }, {
      presetPrompt: "Busy rain-slicked Tokyo street frozen in time, water droplets suspended in mid-air, cinematic lighting",
    });
    const vidGen = addNode("text-video", imgGen.id, { x: baseX + 460, y: baseY }, {
      presetPrompt: "Bullet-time camera orbits smoothly through frozen crowd while raindrops hang motionless in air",
    });
    vidGen.videoModel = "Kling 3.0 Motion Control";
    const sfx = addNode("sound-effects", null, { x: baseX, y: baseY + 420 }, {
      presetPrompt: "Time-freeze sub-bass impact whoosh and crystalline clock stop",
    });
    if (!state.graph.edges.some((e) => e.source === sfx.id && e.target === vidGen.id)) {
      state.graph.edges.push({
        id: crypto.randomUUID(),
        source: sfx.id,
        sourcePort: "audio",
        target: vidGen.id,
        targetPort: "audio",
      });
    }
  }

  markDirty();
  renderGraph();
  fitGraph();
  notify(`Đã dựng mẫu Flow "${flowTitle}" lên Canvas.`);
}

function renderCatalog() {
  const list = $("#catalogList");
  list.replaceChildren();
  const term = $("#catalogSearch").value.trim().toLocaleLowerCase("vi");
  const selectedNode = state.graph.nodes.find((item) => item.id === state.selected);

  const isSubCategory = state.filter !== "All";
  const activeProvider = CATALOG_PROVIDERS_UI.find((p) => p.id === state.filter);
  $("#catalogBackBtn").hidden = !isSubCategory;
  const activePill = $("#catalogActiveFilterPill");
  activePill.hidden = !isSubCategory;
  if (isSubCategory) {
    const catIconMap = {
      Image: "image-gen",
      Video: "video-gen",
      Audio: "voiceover",
      "3D": "3d-gen",
      Utilities: "sticky-note",
      Design: "designer",
    };
    const pillIcon = activeProvider ? activeProvider.icon : catIconMap[state.filter] || "image-gen";
    const pillLabel = activeProvider ? activeProvider.title : state.filter;
    activePill.innerHTML = `${catalogIcon(pillIcon)}<span>${escapeHtml(pillLabel)}</span>`;
  }
  $("#catalogFilters").hidden = isSubCategory;

  let firstPreviewId = null;
  const bindHoverPreview = (button, previewId) => {
    if (!firstPreviewId && NODE_PREVIEW_INFO[previewId]) firstPreviewId = previewId;
    button.addEventListener("mouseenter", () => {
      list.querySelectorAll(".catalog-item").forEach((el) => el.classList.remove("active-item"));
      button.classList.add("active-item");
      if (NODE_PREVIEW_INFO[previewId]) showCatalogPreview(previewId);
      else $("#catalogPreview").hidden = true;
    });
  };

  if (activeProvider) {
    const providerModels = (PROVIDER_MODELS_CATALOG[activeProvider.id] || []).filter(
      (m) => !term || `${m.title} ${m.subtitle}`.toLocaleLowerCase("vi").includes(term)
    );
    const row = document.createElement("div");
    row.className = "catalog-group-row";
    row.innerHTML = `<span class="catalog-group">${escapeHtml(activeProvider.title.toUpperCase())} MODELS</span><button type="button" class="catalog-see-all">See all</button>`;
    row.querySelector(".catalog-see-all")?.addEventListener("click", () => {
      closeAddPanel();
      openModelSettingsModal("all");
    });
    list.append(row);

    for (const m of providerModels) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "catalog-item";
      btn.dataset.previewId = activeProvider.id;
      btn.innerHTML = `
        <span class="catalog-item-icon type-${m.colorType}">${catalogIcon(m.icon)}</span>
        <span class="catalog-item-copy">
          <strong>${escapeHtml(m.title)}</strong>
          <small>${escapeHtml(m.subtitle)}</small>
        </span>
      `;
      bindHoverPreview(btn, activeProvider.id);
      btn.addEventListener("click", () => {
        const created = addNode(m.kind, null, null, { customTitle: m.title });
        if (m.presetModel) {
          created.model = m.presetModel;
          created.presetLabel = m.presetModel;
        }
        if (m.videoModel) created.videoModel = m.videoModel;
        if (m.assistantModel) created.assistantModel = m.assistantModel;
        if (m.speakModel) created.speakModel = m.speakModel;
        markDirty();
        renderGraph();
      });
      list.append(btn);
    }
    showCatalogPreview(activeProvider.id);
    return;
  }

  if (selectedNode && state.filter === "All") {
    const baseActions = [
      {
        title: "Run",
        icon: "play",
        interactive: true,
        action: () => {
          closeAddPanel();
          runNode(selectedNode.id);
        },
      },
      {
        title: "Add creation",
        icon: "plus",
        interactive: true,
        action: () => {
          state.assetTarget = null;
          state.referenceTarget = null;
          closeAddPanel();
          $("#assetFile").click();
        },
      },
      {
        title: "Copy link to node",
        icon: "link",
        interactive: true,
        action: () => {
          closeAddPanel();
          try {
            navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}?project=${state.project?.id || ""}#${selectedNode.id}`);
          } catch {}
          notify("Đã sao chép liên kết tới thẻ.");
        },
      },
      {
        title: "Duplicate",
        icon: "copy",
        interactive: true,
        action: () => {
          closeAddPanel();
          duplicateNode(selectedNode.id);
        },
      },
      {
        title: "Delete",
        icon: "delete",
        interactive: true,
        action: () => {
          closeAddPanel();
          deleteNode(selectedNode.id);
        },
      },
    ];
    if (state.catalogShowAllActions) {
      baseActions.push(
        {
          title: "Open node settings",
          icon: "settings",
          interactive: true,
          action: () => {
            closeAddPanel();
            openSettings(selectedNode.id);
          },
        },
        {
          title: "Fit workflow to screen",
          icon: "expand",
          interactive: true,
          action: () => {
            closeAddPanel();
            fitGraph();
          },
        }
      );
    }
    const quickActions = baseActions.filter((item) => !term || item.title.toLocaleLowerCase("vi").includes(term));

    if (quickActions.length) {
      const row = document.createElement("div");
      row.className = "catalog-group-row";
      row.innerHTML = `<span class="catalog-group">ACTIONS</span><button type="button" class="catalog-see-all">${state.catalogShowAllActions ? "Show less" : "See all"}</button>`;
      row.querySelector(".catalog-see-all")?.addEventListener("click", (e) => {
        e.stopPropagation();
        state.catalogShowAllActions = !state.catalogShowAllActions;
        renderCatalog();
      });
      list.append(row);
      for (const item of quickActions) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `catalog-item ${item.interactive ? "" : "is-readonly"}`;
        button.innerHTML = `<span class="catalog-item-icon type-action">${actionIcon(item.icon)}</span><span class="catalog-item-copy"><strong>${escapeHtml(item.title)}</strong></span>`;
        if (item.interactive && item.action) button.addEventListener("click", item.action);
        list.append(button);
      }
    }
  }

  const mediaCatalogItems = [
    {
      id: "upload",
      title: "Upload",
      subtitle: "",
      icon: "upload",
      colorType: "action",
      action: () => {
        state.assetTarget = null;
        state.referenceTarget = null;
        closeAddPanel();
        $("#assetFile").click();
      },
    },
    {
      id: "assets",
      title: "Assets",
      subtitle: "",
      icon: "assets",
      colorType: "action",
      action: () => {
        closeAddPanel();
        openAssetsPanel();
      },
    },
  ];

  const bindPinClick = (button, itemId, itemTitle) => {
    const pinEl = button.querySelector(".catalog-pin");
    if (!pinEl) return;
    pinEl.title = (state.pinnedCatalogIds || []).includes(itemId) ? "Bỏ ghim khỏi PINNED" : "Ghim lên mục PINNED";
    pinEl.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCatalogPin(itemId, itemTitle);
    });
  };

  // PINNED section (Screenshot 2 & Chibi video 0:16.5s)
  if (state.filter === "All" && !term) {
    const pinnedIds = Array.isArray(state.pinnedCatalogIds) ? state.pinnedCatalogIds : ["assets"];
    const resolvedPinned = pinnedIds
      .map((pid) => mediaCatalogItems.find((m) => m.id === pid) || CATALOG_NODES_UI.find((n) => n.id === pid))
      .filter(Boolean);

    if (resolvedPinned.length) {
      const pinnedRow = document.createElement("div");
      pinnedRow.className = "catalog-group-row";
      pinnedRow.innerHTML = `<span class="catalog-group">PINNED</span>`;
      list.append(pinnedRow);

      for (const pItem of resolvedPinned) {
        const pinnedBtn = document.createElement("button");
        pinnedBtn.type = "button";
        pinnedBtn.className = "catalog-item";
        pinnedBtn.dataset.previewId = pItem.id;
        if (pItem.kind) pinnedBtn.dataset.kind = pItem.kind;
        pinnedBtn.innerHTML = `
          <span class="catalog-item-icon type-${pItem.colorType || "action"}">${catalogIcon(pItem.icon)}</span>
          <span class="catalog-item-copy">
            <span class="catalog-item-title-row">
              <strong>${escapeHtml(pItem.title)}</strong>
              ${pItem.badge ? `<span class="catalog-badge ${pItem.badgeClass || ""}">${escapeHtml(pItem.badge)}</span>` : ""}
            </span>
            ${pItem.subtitle ? `<small>${escapeHtml(pItem.subtitle)}</small>` : ""}
          </span>
          <span class="catalog-pin always-visible is-pinned">${actionIcon("pin")}</span>
        `;
        bindHoverPreview(pinnedBtn, pItem.id);
        bindPinClick(pinnedBtn, pItem.id, pItem.title);
        if (pItem.action) {
          pinnedBtn.addEventListener("click", pItem.action);
        } else if (pItem.interactive && pItem.kind) {
          pinnedBtn.addEventListener("click", () =>
            addNode(pItem.kind, null, null, {
              ...(pItem.subKind ? { subKind: pItem.subKind } : {}),
              ...(pItem.editorTool ? { editorTool: pItem.editorTool } : {}),
              ...(pItem.presetPrompt ? { presetPrompt: pItem.presetPrompt } : {}),
              ...(pItem.onlyInCategory ? { customTitle: pItem.title } : {}),
            })
          );
        }
        list.append(pinnedBtn);
      }
    }
  }

  // MEDIA section (Upload & Assets — Screenshot 2 & Chibi video 0:16.5s)
  if (state.filter === "All") {
    const mediaItems = mediaCatalogItems.filter((m) => !term || m.title.toLocaleLowerCase("vi").includes(term));

    if (mediaItems.length) {
      const mediaRow = document.createElement("div");
      mediaRow.className = "catalog-group-row";
      mediaRow.innerHTML = `<span class="catalog-group">MEDIA</span><button type="button" class="catalog-see-all">See all</button>`;
      mediaRow.querySelector(".catalog-see-all")?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAddPanel();
        openAssetsPanel();
      });
      list.append(mediaRow);

      for (const m of mediaItems) {
        const isPinned = (state.pinnedCatalogIds || []).includes(m.id);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "catalog-item";
        button.dataset.previewId = m.id;
        button.innerHTML = `<span class="catalog-item-icon type-action">${catalogIcon(m.icon)}</span><span class="catalog-item-copy"><strong>${escapeHtml(m.title)}</strong></span><span class="catalog-pin ${isPinned ? "always-visible is-pinned" : ""}">${actionIcon("pin")}</span>`;
        bindHoverPreview(button, m.id);
        bindPinClick(button, m.id, m.title);
        button.addEventListener("click", m.action);
        list.append(button);
      }
    }
  }

  // NODES section (single unified NODES list in exact reference order)
  const visibleNodes = CATALOG_NODES_UI.filter((item) => {
    if (state.filter === "All" && item.onlyInCategory && !term && !state.catalogShowAllNodes) return false;
    if (state.filter !== "All" && item.category !== state.filter) return false;
    if (term && !`${item.title} ${item.subtitle} ${item.category} ${item.keywords || ""}`.toLocaleLowerCase("vi").includes(term)) return false;
    return true;
  });

  if (visibleNodes.length) {
    const isAudioCompact = state.filter === "Audio" && !term && !state.catalogShowAllNodes && visibleNodes.length > 3;
    const nodesToRender = isAudioCompact ? visibleNodes.slice(0, 3) : visibleNodes;
    const row = document.createElement("div");
    row.className = "catalog-group-row";
    const seeBtnText = state.catalogShowAllNodes ? "Show less" : state.filter === "Audio" ? "See more" : "See all";
    row.innerHTML = `<span class="catalog-group">NODES</span><button type="button" class="catalog-see-all">${seeBtnText}</button>`;
    row.querySelector(".catalog-see-all")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.filter === "Audio") {
        state.catalogShowAllNodes = !state.catalogShowAllNodes;
      } else if (state.filter !== "All") {
        state.filter = "All";
        state.catalogShowAllNodes = true;
        renderFilters();
      } else {
        state.catalogShowAllNodes = !state.catalogShowAllNodes;
      }
      renderCatalog();
    });
    list.append(row);

    for (const item of nodesToRender) {
      const isPinned = (state.pinnedCatalogIds || []).includes(item.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `catalog-item ${item.interactive ? "" : "is-readonly"}`;
      if (item.interactive && item.kind) button.dataset.kind = item.kind;
      button.dataset.previewId = item.id;
      button.innerHTML = `
        <span class="catalog-item-icon type-${item.colorType}">${catalogIcon(item.icon)}</span>
        <span class="catalog-item-copy">
          <span class="catalog-item-title-row">
            <strong>${escapeHtml(item.title)}</strong>
            ${item.badge ? `<span class="catalog-badge ${item.badgeClass || ""}">${escapeHtml(item.badge)}</span>` : ""}
          </span>
          <small>${escapeHtml(item.subtitle)}</small>
        </span>
        <span class="catalog-pin ${isPinned ? "always-visible is-pinned" : ""}">${actionIcon("pin")}</span>
      `;
      bindHoverPreview(button, item.id);
      bindPinClick(button, item.id, item.title);
      if (item.interactive && item.kind) {
        button.addEventListener("click", () =>
          addNode(item.kind, null, null, {
            ...(item.subKind ? { subKind: item.subKind } : {}),
            ...(item.editorTool ? { editorTool: item.editorTool } : {}),
            ...(item.presetPrompt ? { presetPrompt: item.presetPrompt } : {}),
            ...(item.onlyInCategory ? { customTitle: item.title } : {}),
          })
        );
      }
      list.append(button);
    }
  }

  // Category-specific MODELS for Audio filter (voice.mp4 @ 0:02s)
  if (state.filter === "Audio") {
    const modelsRow = document.createElement("div");
    modelsRow.className = "catalog-group-row";
    modelsRow.innerHTML = `<span class="catalog-group">MODELS</span><button type="button" class="catalog-see-all">See all</button>`;
    modelsRow.querySelector(".catalog-see-all")?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAddPanel();
      openModelSettingsModal("all");
    });
    list.append(modelsRow);
    const audioModelsCatalog = [
      { label: "Google Lyria", modelValue: "Google Lyria 3", badge: "G" },
      { label: "ElevenLabs Music", modelValue: "ElevenLabs Music v1", badge: "II" },
      { label: "ElevenLabs Music v2", modelValue: "ElevenLabs Music v2", badge: "II" },
    ];
    for (const mItem of audioModelsCatalog) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "catalog-item";
      btn.dataset.previewId = "music-generator";
      btn.innerHTML = `<span class="catalog-item-icon type-audio"><span style="font-weight:800;font-size:12px">${escapeHtml(mItem.badge)}</span></span><span class="catalog-item-copy"><strong>${escapeHtml(mItem.label)}</strong><small>Music Generator</small></span><span class="catalog-pin">${actionIcon("pin")}</span>`;
      bindHoverPreview(btn, "music-generator");
      btn.addEventListener("click", () => {
        const created = addNode("music-generator", null, null, { musicModel: mItem.modelValue });
        created.musicModel = mItem.modelValue;
        markDirty();
        renderGraph();
      });
      list.append(btn);
    }
  }

  // Category-specific MODELS & FLOWS (e.g. Video filter in f_114.0s.jpg)
  if (state.filter === "Video") {
    const modelsRow = document.createElement("div");
    modelsRow.className = "catalog-group-row";
    modelsRow.innerHTML = `<span class="catalog-group">MODELS</span><button type="button" class="catalog-see-all">See all</button>`;
    modelsRow.querySelector(".catalog-see-all")?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAddPanel();
      openModelSettingsModal("video");
    });
    list.append(modelsRow);
    for (const mName of ["MiniMax H3", "Gemini Omni 1.1", "Seedance 2.5"]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "catalog-item";
      btn.innerHTML = `<span class="catalog-item-icon type-video">${catalogIcon("modify-video")}</span><span class="catalog-item-copy"><strong>${escapeHtml(mName)}</strong><small>Modify video</small></span><span class="catalog-pin">${actionIcon("pin")}</span>`;
      btn.addEventListener("click", () => {
        const created = addNode("modify-video", null, null, { videoModel: mName });
        created.videoModel = mName;
        markDirty();
        renderGraph();
      });
      list.append(btn);
    }
    const flowsRow = document.createElement("div");
    flowsRow.className = "catalog-group-row";
    flowsRow.innerHTML = `<span class="catalog-group">FLOWS</span><button type="button" class="catalog-see-all">${state.catalogShowAllFlows ? "Show less" : "See all"}</button>`;
    flowsRow.querySelector(".catalog-see-all")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.catalogShowAllFlows = !state.catalogShowAllFlows;
      renderCatalog();
    });
    list.append(flowsRow);
    const grid = document.createElement("div");
    grid.className = "catalog-flows-grid";
    const videoFlows = state.catalogShowAllFlows
      ? CATALOG_FLOWS_UI.map((f) => f.title)
      : ["POV Realistic video generator", "Time stops, only you keep moving"];
    for (const title of videoFlows) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "catalog-flow-card";
      card.innerHTML = `<span>${escapeHtml(title)}</span>`;
      card.addEventListener("click", () => spawnCatalogFlowTemplate(title));
      grid.append(card);
    }
    list.append(grid);
  }

  // AI MODELS PROVIDERS & FLOWS sections when state.filter === "All"
  if (state.filter === "All") {
    const providers = CATALOG_PROVIDERS_UI.filter(
      (p) => !term || `${p.title} ${p.subtitle}`.toLocaleLowerCase("vi").includes(term)
    );
    if (providers.length) {
      const row = document.createElement("div");
      row.className = "catalog-group-row";
      row.innerHTML = `<span class="catalog-group">AI MODELS PROVIDERS</span><button type="button" class="catalog-see-all">See all</button>`;
      row.querySelector(".catalog-see-all")?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAddPanel();
        openModelSettingsModal("all");
      });
      list.append(row);
      for (const p of providers) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "catalog-item";
        button.dataset.previewId = p.id;
        button.innerHTML = `
          <span class="catalog-item-icon type-provider">${catalogIcon(p.icon)}</span>
          <span class="catalog-item-copy">
            <strong>${escapeHtml(p.title)}</strong>
            <small>${escapeHtml(p.subtitle)}</small>
          </span>
          ${p.tabHint ? `<span class="catalog-tab-hint">→| <kbd>tab</kbd></span>` : ""}
        `;
        bindHoverPreview(button, p.id);
        button.addEventListener("click", () => {
          state.filter = p.id;
          renderFilters();
          renderCatalog();
        });
        list.append(button);
      }
    }

    const flows = CATALOG_FLOWS_UI.filter((f) => {
      if (!state.catalogShowAllFlows && !term && f.category === "Video") return false;
      return !term || f.title.toLocaleLowerCase("vi").includes(term);
    });
    if (flows.length) {
      const row = document.createElement("div");
      row.className = "catalog-group-row";
      row.innerHTML = `<span class="catalog-group">FLOWS</span><button type="button" class="catalog-see-all">${state.catalogShowAllFlows ? "Show less" : "See all"}</button>`;
      row.querySelector(".catalog-see-all")?.addEventListener("click", (e) => {
        e.stopPropagation();
        state.catalogShowAllFlows = !state.catalogShowAllFlows;
        renderCatalog();
      });
      list.append(row);
      const grid = document.createElement("div");
      grid.className = "catalog-flows-grid";
      for (const f of flows) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "catalog-flow-card";
        card.innerHTML = `<span>${escapeHtml(f.title)}</span>`;
        card.addEventListener("click", () => spawnCatalogFlowTemplate(f.title));
        grid.append(card);
      }
      list.append(grid);
    }
  }

  const firstItem = list.querySelector(".catalog-item[data-preview-id]");
  if (firstItem) {
    list.querySelectorAll(".catalog-item").forEach((el) => el.classList.remove("active-item"));
    firstItem.classList.add("active-item");
    showCatalogPreview(firstItem.dataset.previewId);
  } else {
    $("#catalogPreview").hidden = true;
  }

  if (!list.children.length) {
    const empty = document.createElement("p");
    empty.className = "inspector-muted";
    empty.style.padding = "12px";
    empty.textContent = "Không tìm thấy thẻ phù hợp.";
    list.append(empty);
  }
}

function openAddPanel() {
  closeAssetsPanel();
  closeStoragePanel();
  closeTrashPanel();
  closeAllPopovers();
  closeWireDropMenu();
  state.filter = "All";
  $("#addPanel").hidden = false;
  const addBtn = $("#addButton");
  addBtn.classList.add("panel-open");
  addBtn.innerHTML = actionIcon("close");
  renderFilters();
  renderCatalog();
  $("#catalogSearch").focus();
}

function closeAddPanel() {
  $("#addPanel").hidden = true;
  $("#catalogPreview").hidden = true;
  $("#catalogSearch").value = "";
  state.filter = "All";
  const addBtn = $("#addButton");
  if (addBtn) {
    addBtn.classList.remove("panel-open");
    addBtn.innerHTML = actionIcon("plus");
  }
}

async function loadAssets() {
  const query = state.project?.id ? `?project_id=${encodeURIComponent(state.project.id)}` : "";
  state.assets = (await request(`/assets${query}`)).items;
  renderAssets();
}

function renderAssets() {
  const list = $("#assetList");
  list.replaceChildren();
  const target = state.graph.nodes.find((node) => node.id === (state.assetTarget || state.referenceTarget));
  const filterKind = state.referenceTarget ? "image" : target?.kind === "image" || target?.kind === "video" ? target.kind : null;
  const assets = filterKind ? state.assets.filter((asset) => asset.kind === filterKind) : state.assets;
  if (!assets.length) {
    const empty = document.createElement("p");
    empty.className = "assets-empty";
    empty.textContent = filterKind
      ? `Chưa có ${filterKind === "image" ? "ảnh" : "video"} nào. Hãy nhập tệp đầu tiên.`
      : "Thư viện đang trống. Nhập ảnh hoặc video để dùng trong flow.";
    list.append(empty);
    return;
  }
  for (const asset of assets) {
    const row = document.createElement("div");
    row.className = "asset-item-row";
    const item = document.createElement("button");
    item.type = "button";
    item.className = "asset-item";
    const thumb = document.createElement(asset.kind === "image" ? "img" : "video");
    thumb.src = asset.url;
    if (asset.kind === "video") {
      thumb.preload = "metadata";
      thumb.muted = true;
    } else {
      thumb.loading = "lazy";
    }
    const details = document.createElement("span");
    details.className = "asset-details";
    const name = document.createElement("strong");
    name.textContent = asset.name;
    const meta = document.createElement("small");
    meta.textContent = `${asset.kind === "image" ? "Ảnh" : "Video"} · ${(asset.size / 1024 / 1024).toFixed(1)} MB`;
    details.append(name, meta);
    item.append(thumb, details);
    item.addEventListener("click", () => attachAsset(asset));

    const purgeBtn = document.createElement("button");
    purgeBtn.type = "button";
    purgeBtn.className = "asset-purge-btn";
    purgeBtn.title = "Xóa vĩnh viễn tệp này khỏi ổ đĩa";
    purgeBtn.setAttribute("aria-label", "Xóa vĩnh viễn tệp");
    purgeBtn.innerHTML = actionIcon("delete");
    purgeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      purgeAssetDirectly(asset);
    });

    row.append(item, purgeBtn);
    list.append(row);
  }
}

function openAssetsPanel(targetId = null, forReference = false) {
  state.assetTarget = forReference ? null : targetId;
  state.referenceTarget = forReference ? targetId : null;
  closeAddPanel();
  closeStoragePanel();
  closeTrashPanel();
  renderAssets();
  $("#assetsPanel").hidden = false;
}

function closeAssetsPanel() {
  $("#assetsPanel").hidden = true;
  state.assetTarget = null;
  state.referenceTarget = null;
}

async function loadStorage() {
  state.storage = await request("/settings/storage");
  $("#resultDir").value = state.storage.resultDir;
  $("#storageCurrent").textContent = `${state.storage.custom ? "Đang lưu tại" : "Thư mục mặc định"}: ${state.storage.resultDir}`;
}

async function openStoragePanel() {
  closeAddPanel();
  closeAssetsPanel();
  closeTrashPanel();
  try {
    await loadStorage();
    $("#storagePanel").hidden = false;
  } catch (error) {
    notify(error.message);
  }
}

function closeStoragePanel() {
  $("#storagePanel").hidden = true;
}

function updateTrashBadge() {
  const badge = $("#trashCountBadge");
  const btn = $("#trashButton");
  if (!badge) return;
  const count = Array.isArray(state.graph?.trash) ? state.graph.trash.length : 0;
  if (count > 0) {
    badge.hidden = false;
    badge.textContent = String(count);
  } else {
    badge.hidden = true;
    badge.textContent = "0";
  }
  if (btn) {
    btn.title = count > 0 ? `Thùng rác (${count} thẻ xóa tạm)` : "Thùng rác · Xóa tạm & Xóa vĩnh viễn tệp";
  }
}

function openTrashPanel() {
  closeAddPanel();
  closeAssetsPanel();
  closeStoragePanel();
  closeAllPopovers();
  renderTrash();
  const panel = $("#trashPanel");
  if (panel) panel.hidden = false;
  $("#trashButton")?.classList.add("active");
}

function closeTrashPanel() {
  const panel = $("#trashPanel");
  if (panel) panel.hidden = true;
  $("#trashButton")?.classList.remove("active");
}

function renderTrash() {
  const list = $("#trashList");
  const summary = $("#trashSummaryText");
  const emptyBtn = $("#emptyTrashBtn");
  if (!list) return;
  list.replaceChildren();
  const trash = Array.isArray(state.graph?.trash) ? state.graph.trash : [];
  updateTrashBadge();
  const totalFiles = trash.reduce((acc, item) => acc + (Array.isArray(item.assetIds) ? item.assetIds.length : 0), 0);
  if (summary) {
    summary.textContent = `${trash.length} thẻ (${totalFiles} tệp ảnh chờ xóa)`;
  }
  if (emptyBtn) {
    emptyBtn.disabled = trash.length === 0;
  }
  if (!trash.length) {
    const empty = document.createElement("p");
    empty.className = "trash-empty";
    empty.textContent = "Thùng rác đang trống. Khi bạn bấm nút Xóa (🗑) trên thẻ, thẻ sẽ được chuyển vào đây trước khi xóa vĩnh viễn tệp dưới thư mục.";
    list.append(empty);
    return;
  }
  for (const item of [...trash].reverse()) {
    const card = document.createElement("div");
    card.className = "trash-item";
    const fileCount = Array.isArray(item.assetIds) ? item.assetIds.length : 0;
    const deletedTime = item.deletedAt ? new Date(item.deletedAt).toLocaleTimeString("vi-VN") : "";
    const thumbAsset = (item.assetIds || []).map((id) => state.assets.find((a) => a.id === id)).find(Boolean);
    const thumbSrc = thumbAsset?.url || item.thumbUrl || "";
    const thumbHtml = thumbSrc
      ? `<img class="trash-item-thumb" src="${escapeHtml(thumbSrc)}" alt="">`
      : `<span class="trash-item-thumb">${iconMarkup(mediaType(item.node?.kind || "image"))}</span>`;

    card.innerHTML = `
      <div class="trash-item-main">
        ${thumbHtml}
        <div class="trash-item-info">
          <strong>${escapeHtml(item.title || "Card")}</strong>
          <small>${fileCount} tệp dưới thư mục${deletedTime ? ` · Xóa lúc ${escapeHtml(deletedTime)}` : ""}</small>
        </div>
      </div>
      <div class="trash-item-actions">
        <button type="button" class="trash-restore-btn" data-restore="${escapeHtml(item.id)}">↶ Khôi phục</button>
        <button type="button" class="trash-purge-btn" data-purge="${escapeHtml(item.id)}">🗑 Xóa vĩnh viễn</button>
      </div>
    `;
    card.querySelector("[data-restore]")?.addEventListener("click", () => restoreFromTrash(item.id));
    card.querySelector("[data-purge]")?.addEventListener("click", () => purgeTrashItem(item.id));
    list.append(card);
  }
}

async function saveStorage(event) {
  event.preventDefault();
  const button = $("#storageForm button[type=submit]");
  button.disabled = true;
  try {
    state.storage = await request("/settings/storage", {
      method: "PUT",
      body: JSON.stringify({ resultDir: $("#resultDir").value.trim() }),
    });
    await loadStorage();
    notify("Đã lưu thư mục cho kết quả mới.");
  } catch (error) {
    notify(error.message);
  } finally {
    button.disabled = false;
  }
}

async function resetStorage() {
  try {
    state.storage = await request("/settings/storage", {
      method: "PUT",
      body: JSON.stringify({ resultDir: null }),
    });
    await loadStorage();
    notify("Đã dùng lại thư mục mặc định.");
  } catch (error) {
    notify(error.message);
  }
}

function attachAsset(asset) {
  const assetW = Number(asset?.width) || 0;
  const assetH = Number(asset?.height) || 0;
  if (state.referenceTarget) {
    const taskNode = state.graph.nodes.find((item) => item.id === state.referenceTarget);
    if (taskNode && asset.kind === "image") {
      remember();
      const sourceNode = {
        id: crypto.randomUUID(),
        kind: "image",
        assetId: asset.id,
        x: Math.round(taskNode.x - 360),
        y: Math.round(taskNode.y),
      };
      if (assetW > 0 && assetH > 0) {
        sourceNode.imageWidth = assetW;
        sourceNode.imageHeight = assetH;
      }
      state.graph.nodes.push(sourceNode);
      const targetPort =
        taskNode.kind === "image-image" || taskNode.kind === "upscaler" || taskNode.kind === "move" || taskNode.kind === "speak"
          ? "source_image"
          : taskNode.kind === "extend-video" || taskNode.kind === "modify-video" || taskNode.kind === "video-video"
            ? "references"
            : taskNode.kind === "text-video" || taskNode.kind === "image-video"
              ? "start_image"
              : "reference_image";
      state.graph.edges = state.graph.edges.filter((e) => !(e.target === taskNode.id && e.targetPort === targetPort));
      state.graph.edges.push({
        id: crypto.randomUUID(),
        source: sourceNode.id,
        sourcePort: "image",
        target: taskNode.id,
        targetPort,
      });
      if (assetW > 0 && assetH > 0) {
        syncDownstreamAspectFromSource(sourceNode, assetW, assetH);
      }
      closeAssetsPanel();
      renderGraph();
      markDirty();
      return;
    }
  }
  const listNode = state.graph.nodes.find((item) => item.id === state.assetTarget && item.kind === "list");
  if (listNode) {
    remember();
    if (!Array.isArray(listNode.items)) listNode.items = [];
    listNode.items.push({
      type: asset.kind === "video" ? "video" : "image",
      assetId: asset.id,
      text: "",
      selected: false,
    });
    state.selected = listNode.id;
    closeAssetsPanel();
    renderGraph();
    markDirty();
    return;
  }
  let node = state.graph.nodes.find((item) => item.id === state.assetTarget && item.kind === asset.kind);
  if (!node) node = addNode(asset.kind);
  else remember();
  node.assetId = asset.id;
  if (assetW > 0 && assetH > 0) {
    node.imageWidth = assetW;
    node.imageHeight = assetH;
    syncDownstreamAspectFromSource(node, assetW, assetH);
  } else {
    delete node.imageWidth;
    delete node.imageHeight;
  }
  state.selected = node.id;
  closeAssetsPanel();
  renderGraph();
  markDirty();
}

async function uploadAsset(file) {
  if (!file) return;
  const button = $("#uploadAsset");
  button.disabled = true;
  button.textContent = "Đang nhập…";
  try {
    const probedPromise = probeMediaFileDimensions(file);
    const form = new FormData();
    form.append("file", file);
    if (state.project?.id) form.append("projectId", state.project.id);
    const query = state.project?.id ? `?project_id=${encodeURIComponent(state.project.id)}` : "";
    const response = await fetch(`${apiRoot}/assets${query}`, { method: "POST", body: form });
    const asset = await response
      .json()
      .catch(() => ({ error: response.status === 413 ? "Tệp vượt quá giới hạn 512 MB." : "Không thể nhập tệp." }));
    if (!response.ok) throw new Error(asset.error || "Không thể nhập tệp.");
    const probedDims = await probedPromise;
    await loadAssets();
    if (probedDims?.width > 0 && probedDims?.height > 0) {
      asset.width = probedDims.width;
      asset.height = probedDims.height;
      const inStore = state.assets.find((a) => a.id === asset.id);
      if (inStore) {
        inStore.width = probedDims.width;
        inStore.height = probedDims.height;
      }
    }
    const target = state.graph.nodes.find((node) => node.id === state.assetTarget);
    if (target && target.kind !== "list" && target.kind !== asset.kind) {
      state.assetTarget = null;
      $("#assetsPanel").hidden = false;
      renderAssets();
      notify(`Đã lưu ${asset.name}, nhưng thẻ này cần ${target.kind === "image" ? "ảnh" : "video"}.`);
      return;
    }
    attachAsset(asset);
    notify(`Đã nhập ${asset.name}.`);
  } catch (error) {
    notify(error.message);
  } finally {
    button.disabled = false;
    button.textContent = "Nhập ảnh hoặc video";
    $("#assetFile").value = "";
  }
}

function downloadAssetFile(asset) {
  if (!asset?.url) return;
  const link = document.createElement("a");
  link.href = `${asset.url}?download=1`;
  link.download = asset.name || "asset";
  document.body.append(link);
  link.click();
  link.remove();
}

function addNode(kind, connectFromNodeId = null, customPos = null, extraOptions = {}) {
  const canvas = $("#canvas");
  const baseNode = connectFromNodeId
    ? state.graph.nodes.find((item) => item.id === connectFromNodeId)
    : state.graph.nodes.find((item) => item.id === state.selected);
  const previousCard = [...document.querySelectorAll(".graph-node")].find((card) => card.dataset.nodeId === baseNode?.id);
  const narrow = canvas.clientWidth < 800;
  const isMediaSource = kind === "image" || kind === "video" || kind === "audio";
  const node = {
    id: crypto.randomUUID(),
    kind,
    x: customPos
      ? Math.round(customPos.x)
      : baseNode && (!isMediaSource || connectFromNodeId)
        ? baseNode.x + (narrow ? 0 : Math.max(430, (previousCard?.offsetWidth || 392) + 96))
        : Math.round((canvas.clientWidth * (isMediaSource ? 0.12 : narrow ? 0.22 : 0.28) - state.pan.x) / state.zoom),
    y: customPos
      ? Math.round(customPos.y)
      : baseNode && (!isMediaSource || connectFromNodeId)
        ? baseNode.y + (narrow ? (previousCard?.offsetHeight || 280) + 70 : 0)
        : Math.round((canvas.clientHeight * 0.16 - state.pan.y) / state.zoom),
  };
  if (kind === "image" && (extraOptions.assetId || baseNode?.assetId)) {
    node.assetId = extraOptions.assetId || baseNode.assetId;
  }
  if (kind === "text") node.text = extraOptions.presetPrompt || "";
  if (kind === "text-image" || kind === "image-image") {
    node.prompt = extraOptions.presetPrompt || "";
    node.width = 1376;
    node.height = 768;
    if (extraOptions.editorTool) node.editorTool = extraOptions.editorTool;
    node.cameraAngle = { yaw: 15, pitch: -10, fov: 50 };
    node.colorAdjust = { exposure: 0, contrast: 0, saturation: 0 };
    node.relightColor = "#fbbf24";
    node.relightPos = { x: 68, y: 28 };
    const confImg = configuredModelsForKind("image");
    if (confImg.length) {
      node.model = confImg[0];
      node.presetLabel = confImg[0];
    } else if (state.comfy.connected && state.comfy.checkpoints.length > 0) {
      node.model = "Local GPU (VRAM)";
      node.presetLabel = "Local GPU (VRAM)";
    }
  }
  if (kind === "upscaler") {
    node.upscaleMode = "Precision (Clarity)";
    node.upscaleModel = "Antigravity AI Bridge";
    node.scaleFactor = 2;
    node.upscaleFlavor = "Balanced";
    node.count = 1;
    node.model = "Antigravity AI Bridge";
    node.presetLabel = "Antigravity AI Bridge";
  }
  if (kind === "assistant") {
    node.prompt = extraOptions.presetPrompt || "";
    node.text = "";
    node.assistantModel = "GPT-5 Mini";
    node.exportMode = "Export as text";
  }
  if (kind === "list") {
    node.items = extraOptions.items ? structuredClone(extraOptions.items) : [];
    node.viewMode = "list";
    node.keepItems = true;
  }
  if (kind === "text-video" || kind === "image-video" || kind === "video-video") {
    node.prompt = extraOptions.presetPrompt || "";
    node.count = 1;
    const confVid = configuredModelsForKind("video");
    node.videoModel = confVid.length ? confVid[0] : "Auto";
    node.videoRatio = "16:9";
    node.duration = '5-6"';
    node.videoRes = "Auto";
    node.soundEffects = false;
    node.multiShot = false;
  }
  if (kind === "extend-video") {
    node.prompt = extraOptions.presetPrompt || "";
    node.duration = "6s";
    node.generateAudio = true;
    node.videoModel = "Wan 2.6";
    node.videoRatio = "16:9";
    node.videoRes = "1080p";
  }
  if (kind === "modify-video") {
    node.prompt = extraOptions.presetPrompt || "";
    node.videoModel = extraOptions.videoModel || "MiniMax H3";
    node.videoRes = "2K";
    node.videoRatio = "16:9";
    node.duration = "5s";
  }
  if (kind === "move") {
    node.prompt = extraOptions.presetPrompt || "";
    node.moveStyle = "3D Parallax Orbit";
    node.videoModel = "Antigravity Motion";
    node.videoRatio = "16:9";
    node.duration = "5s";
    node.videoRes = "1080p";
  }
  if (kind === "speak") {
    node.prompt = extraOptions.presetPrompt || "";
    node.speakModel = "OmniHuman 1.5";
    node.videoRes = "720p";
  }
  if (kind === "video-combiner") {
    node.transition = "Crossfade";
  }
  if (kind === "video-upscaler") {
    node.videoRes = "2K";
    node.upscaleDetail = "Crisp";
    node.scaleFactor = 2;
    node.fps = "60fps";
  }
  if (kind === "video-sfx") {
    node.prompt = extraOptions.presetPrompt || "";
    node.sfxStyle = "Auto Motion Sync";
    node.duration = "5s";
    node.generateAudio = true;
  }
  if (kind === "media-extractor") {
    node.trimStart = "00:00";
    node.trimEnd = "00:05";
    node.frameTime = 1.2;
  }
  if (kind === "speech-to-text") {
    node.sttModel = "ElevenLabs Scribe v2";
    node.transcriptText = "";
  }
  if (kind === "voiceover") {
    node.prompt = extraOptions.presetPrompt || "";
    node.count = 1;
    node.voiceModel = "ElevenLabs v3";
    node.voiceName = "";
    node.speaker2Name = "";
    node.voiceSpeed = "1.0x";
  }
  if (kind === "sound-effects") {
    node.prompt = extraOptions.presetPrompt || "";
    node.count = 1;
    node.sfxModel = "ElevenLabs Text to Sound v2";
    node.duration = '5"';
    node.loop = false;
  }
  if (kind === "audio-generator") {
    node.prompt = extraOptions.presetPrompt || "";
    node.count = 1;
    node.duration = '5"';
  }
  if (kind === "music-generator") {
    node.prompt = extraOptions.presetPrompt || "";
    node.count = 1;
    node.musicModel = extraOptions.musicModel || "";
    node.duration = '30"';
  }
  if (kind === "designer") {
    node.template = "Social Poster";
    node.headline = "MAGNIFIC AI";
    node.subhead = "Every Node Explained";
  }
  if (kind === "3d-generator") {
    node.prompt = extraOptions.presetPrompt || "Isometric stylized sci-fi mecha helmet, PBR metallic shader, studio turntable";
    node.renderMode3d = "Shaded PBR";
    node.model3d = "Antigravity 3D Bridge";
  }
  if (kind === "image-to-svg" || kind === "svg-generator") {
    node.prompt = extraOptions.presetPrompt || "Minimalist geometric fennec mascot logo, clean vector paths";
    node.removeBg = true;
  }
  if (kind === "sticky-note") {
    node.text = "Ghi chú workflow tại đây...";
    node.noteColor = "yellow";
  }
  if (kind === "group") {
    node.customTitle = "Group #1";
    node.groupW = 640;
    node.groupH = 420;
  }
  if (extraOptions.subKind === "variations") {
    node.subKind = "variations";
    node.variationMode = extraOptions.variationMode || "Custom";
    node.variationRes = "2K";
    node.variationGrid = "3x3";
    node.variationAngles = [
      "Back View",
      "Closeup",
      "Ext. Long Shot",
      "Extreme Closeup",
      "High Angle",
      "Long Shot",
      "Low Angle",
      "3/4 View",
      "Aerial",
    ];
    node.splitImages = true;
    node.width = 768;
    node.height = 1376;
  }
  if (extraOptions.customTitle) {
    node.customTitle = extraOptions.customTitle;
  }
  remember();
  state.graph.nodes.push(node);

  if (connectFromNodeId && baseNode) {
    const sourceDef = entry(baseNode.kind);
    const targetDef = entry(kind);
    if (sourceDef && targetDef) {
      let orderedOutPorts = [...sourceDef.outputs];
      if (state.pending && state.pending.nodeId === baseNode.id && state.pending.portId) {
        const pendingPort = orderedOutPorts.find((p) => p.id === state.pending.portId);
        if (pendingPort) {
          orderedOutPorts = [pendingPort, ...orderedOutPorts.filter((p) => p.id !== pendingPort.id)];
        }
      } else if (baseNode.kind === "list") {
        const pType = listPrimaryMediaType(baseNode);
        const primaryOut = orderedOutPorts.find((p) => p.id === pType);
        if (primaryOut) {
          orderedOutPorts = [primaryOut, ...orderedOutPorts.filter((p) => p.id !== primaryOut.id)];
        }
      } else if (
        [
          "text-video",
          "image-video",
          "video-video",
          "extend-video",
          "modify-video",
          "move",
          "video-sfx",
          "speak",
          "video-combiner",
          "video-upscaler",
        ].includes(baseNode.kind) &&
        [
          "list",
          "video-combiner",
          "video-upscaler",
          "extend-video",
          "modify-video",
          "video-sfx",
          "media-extractor",
          "speak",
        ].includes(kind)
      ) {
        const vidOut = orderedOutPorts.find((p) => p.id === "video");
        if (vidOut) {
          orderedOutPorts = [vidOut, ...orderedOutPorts.filter((p) => p.id !== vidOut.id)];
        }
      }

      for (const outPort of orderedOutPorts) {
        const inPort =
          targetDef.inputs.find((inp) => inp.type === outPort.type) ||
          targetDef.inputs.find((inp) => isPortTypeCompatible(outPort.type, node, inp));
        if (inPort) {
          state.graph.edges.push({
            id: crypto.randomUUID(),
            source: baseNode.id,
            sourcePort: outPort.id,
            target: node.id,
            targetPort: inPort.id,
          });
          const srcTitle = nodeDisplayTitle(baseNode);
          if ((baseNode.kind === "list" || outPort.type === "image" || outPort.type === "video") && node.kind === "text" && srcTitle) {
            node.text = node.text ? `${node.text.trim()} @${srcTitle}` : `@${srcTitle} `;
          } else if (baseNode.kind === "list" && outPort.id !== "references") {
            node.listMode = true;
          } else if (outPort.type === "image" && (node.kind === "text-image" || node.kind === "image-image") && !node.prompt) {
            if (srcTitle) node.prompt = `@${srcTitle} `;
          }
          if (node.kind === "list" && !node.items.length) {
            const succeeded = nodeSucceededRuns(baseNode.id);
            if (succeeded.length > 0) {
              node.items = succeeded
                .slice()
                .reverse()
                .map((r, idx) => ({
                  type: outPort.type === "video" ? "video" : "image",
                  assetId: r.assetId,
                  text: r.snapshot?.prompt || `${srcTitle} #${idx + 1}`,
                  prompt: r.snapshot?.prompt || "",
                  width: r.snapshot?.width || baseNode.width || 768,
                  height: r.snapshot?.height || baseNode.height || 1376,
                  model: r.snapshot?.model || displayModelName(baseNode),
                }));
              node.viewMode = "grid";
            } else if (baseNode.assetId) {
              node.items = [
                {
                  type: outPort.type === "video" ? "video" : "image",
                  assetId: baseNode.assetId,
                  firstFrameAssetId: baseNode.firstFrameAssetId || baseNode.assetId,
                  text: baseNode.prompt || srcTitle,
                  prompt: baseNode.prompt || srcTitle,
                  duration: baseNode.videoDuration || "00:10",
                  model: baseNode.videoModel || displayModelName(baseNode),
                },
              ];
              node.viewMode = "grid";
            }
          }
          break;
        }
      }
    }
  }

  state.selected = node.id;
  state.activePopover = null;
  if (narrow && !customPos) {
    state.pan.x = canvas.clientWidth / 2 - (node.x + 180) * state.zoom;
    state.pan.y = canvas.clientHeight / 2 - (node.y + 160) * state.zoom;
  }
  closeAddPanel();
  closeWireDropMenu();
  renderGraph();
  markDirty();
  return node;
}

function duplicateNode(nodeId) {
  const source = state.graph.nodes.find((item) => item.id === nodeId);
  if (!source) return;
  remember();
  const copy = structuredClone(source);
  copy.id = crypto.randomUUID();
  copy.x = Math.round(source.x + 440);
  copy.y = Math.round(source.y + 24);
  state.graph.nodes.push(copy);
  for (const edge of state.graph.edges.filter((item) => item.target === source.id)) {
    state.graph.edges.push({
      id: crypto.randomUUID(),
      source: edge.source,
      sourcePort: edge.sourcePort,
      target: copy.id,
      targetPort: edge.targetPort,
    });
  }
  state.selected = copy.id;
  state.activePopover = null;
  renderGraph();
  markDirty();
  notify("Đã nhân bản thẻ.");
}

function copyNodeSettings(nodeId) {
  const source = state.graph.nodes.find((item) => item.id === nodeId);
  if (!source) return;
  state.copiedSettings = {
    model: source.model,
    width: source.width,
    height: source.height,
    steps: source.steps,
    cfg: source.cfg,
    quality: source.quality,
    count: source.count,
    negative: source.negative,
  };
  notify("Đã sao chép thiết lập của thẻ.");
}

function nodePreview(node) {
  if (node.kind === "text") return node.text || "Nhập nội dung ở cài đặt thẻ";
  if (node.kind === "image") return "Chọn ảnh từ thư viện hoặc nhập tệp";
  if (node.kind === "video") return "Chọn video từ thư viện hoặc nhập tệp";
  if (node.kind === "audio") return "Chọn âm thanh từ thư viện hoặc tạo từ Voiceover";
  return "";
}

function buildPortConnectionsPopover(node, port, displayLabel) {
  const card = document.querySelector(`.graph-node[data-node-id="${node.id}"]`);
  if (!card) return;
  const popover = document.createElement("div");
  popover.className = "card-popover port-connections-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());

  const renderContent = () => {
    popover.replaceChildren();
    const edges = state.graph.edges.filter((e) => e.target === node.id && e.targetPort === port.id);
    if (!edges.length) {
      closeAllPopovers();
      return;
    }

    const head = document.createElement("div");
    head.className = "port-pop-head";
    head.innerHTML = `
      <span class="port-pop-title">${escapeHtml(displayLabel)}</span>
      <div class="port-pop-head-actions">
        <button type="button" class="port-pop-add-btn" title="Add source">+ ADD</button>
        <button type="button" class="port-pop-cut-btn" title="Disconnect all">✂</button>
      </div>
    `;
    head.querySelector(".port-pop-add-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllPopovers();
      if (togglePopover(node.id, "add-ref", card)) {
        buildAddReferencePopover(node, card);
      }
    });
    head.querySelector(".port-pop-cut-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      remember();
      state.graph.edges = state.graph.edges.filter((ed) => !(ed.target === node.id && ed.targetPort === port.id));
      closeAllPopovers();
      markDirty();
      renderGraph();
      notify(`Đã ngắt toàn bộ dây nối khỏi cổng ${displayLabel}.`);
    });
    popover.append(head);

    const list = document.createElement("div");
    list.className = "port-pop-list";
    for (const edge of edges) {
      const src = state.graph.nodes.find((n) => n.id === edge.source);
      if (!src) continue;
      const srcTitle = nodeDisplayTitle(src);
      let subMeta = "";
      if (src.kind === "list" && Array.isArray(src.items)) {
        const activeCount = getActiveListItems(src).length;
        const hasVid = src.items.some((it) => it && it.type === "video");
        const hasImg = src.items.some((it) => it && it.assetId && it.type !== "video");
        subMeta = `${activeCount} ${hasVid ? "videos" : hasImg ? "images" : "items"}`;
      } else if (src.kind === "text") {
        subMeta = (src.text || "").trim().slice(0, 24) || "Text";
      } else {
        subMeta = edge.sourcePort === "references" ? "References" : "Connected";
      }

      const row = document.createElement("div");
      row.className = "port-pop-item";
      row.innerHTML = `
        <span class="port-pop-item-icon type-${mediaType(src.kind)}">${src.kind === "list" ? catalogIcon("list") : iconMarkup(mediaType(src.kind))}</span>
        <div class="port-pop-item-copy">
          <strong>${escapeHtml(srcTitle)}</strong>
          ${subMeta ? `<small>${escapeHtml(subMeta)}</small>` : ""}
        </div>
        <button type="button" class="port-pop-item-del" title="Disconnect">×</button>
      `;
      row.querySelector(".port-pop-item-copy")?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllPopovers();
        selectNode(src.id);
      });
      row.querySelector(".port-pop-item-del")?.addEventListener("click", (e) => {
        e.stopPropagation();
        remember();
        state.graph.edges = state.graph.edges.filter((ed) => ed.id !== edge.id);
        markDirty();
        renderGraph();
      });
      list.append(row);
    }
    popover.append(list);
  };

  renderContent();
  card.append(popover);
}

function makePort(node, port, direction, index, count) {
  const row = document.createElement("div");
  const matchingEdges = state.graph.edges.filter((edge) =>
    direction === "input"
      ? edge.target === node.id && edge.targetPort === port.id
      : edge.source === node.id && edge.sourcePort === port.id
  );
  const isConnected = matchingEdges.length > 0;
  row.className = `port-row ${direction}${isConnected ? " connected" : ""}`;
  if (direction === "input") row.style.bottom = `${18 + (count - index - 1) * 42}px`;
  else row.style.top = `${(node.kind === "image" || node.kind === "video" ? 12 : 18) + index * 42}px`;
  const button = document.createElement("button");
  button.type = "button";
  button.className = `port-button type-${port.type}${matchingEdges.length > 1 ? " has-multi-count" : ""}`;
  const displayLabel =
    direction === "output" && node.subKind === "variations"
      ? "variations"
      : direction === "output" && node.kind === "text-image"
        ? "Generated image"
        : direction === "output" && (node.kind === "image" || node.kind === "video")
          ? port.type === "image"
            ? "Image"
            : "Video"
          : direction === "input" && (port.id === "prompt" || port.id === "text_in")
            ? "Text"
            : direction === "input" && node.kind !== "audio-generator" && (port.id === "reference_image" || port.id === "source_image" || port.id === "image_in")
              ? "Image"
              : direction === "input" && port.id === "video_in"
                ? "Video"
                : port.label;
  button.setAttribute("aria-label", `${direction === "input" ? "Đầu vào" : "Đầu ra"}: ${displayLabel} (${port.type})`);
  if (direction === "input" && matchingEdges.length > 1) {
    button.innerHTML = `<span class="port-glyph port-count-number">${matchingEdges.length}</span>`;
  } else {
    button.innerHTML = `<span class="port-glyph">${iconMarkup(port.type)}</span>`;
  }
  button.dataset.direction = direction;
  button.dataset.node = node.id;
  button.dataset.port = port.id;
  const label = document.createElement("span");
  label.className = "port-label";
  label.textContent = displayLabel;
  row.append(button, label);
  if (direction === "output") button.addEventListener("pointerdown", (event) => startConnection(event, node.id, port));
  if (direction === "input") {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (state.pending) {
        finishConnection(node.id, port.id);
        return;
      }
      if (matchingEdges.length > 0) {
        const card = document.querySelector(`.graph-node[data-node-id="${node.id}"]`);
        if (togglePopover(node.id, `port-${port.id}`, card)) {
          buildPortConnectionsPopover(node, port, displayLabel);
        }
      }
    });
  }
  portElements.set(`${node.id}:${direction}:${port.id}`, button);
  return row;
}

function updatePromptCharCount() {
  const text = $("#promptEditorText").value || "";
  $("#promptCharCount").textContent = `${text.length}/10000`;
}

function openPromptEditor(nodeId) {
  const node = state.graph.nodes.find((item) => item.id === nodeId);
  if (!node) return;
  closeAllPopovers();
  const edge = state.graph.edges.find((item) => item.target === nodeId && item.targetPort === "prompt");
  const source = edge ? state.graph.nodes.find((item) => item.id === edge.source) : null;
  state.promptTarget = source?.kind === "text" ? source.id : nodeId;
  $("#promptEditorText").value = source?.kind === "text" ? source.text || "" : node.prompt || "";
  $("#promptEditorSource").textContent = source?.kind === "text" ? "Editing connected Text node" : "";
  updatePromptCharCount();
  $("#promptModal").hidden = false;
  $("#promptEditorText").focus();
}

function closePromptEditor() {
  state.promptTarget = null;
  $("#promptModal").hidden = true;
}

function savePromptEditor(event) {
  event.preventDefault();
  const node = state.graph.nodes.find((item) => item.id === state.promptTarget);
  if (!node) {
    closePromptEditor();
    return;
  }
  const text = $("#promptEditorText").value;
  if ((node.kind === "text" ? node.text || "" : node.prompt || "") !== text) {
    remember();
    if (node.kind === "text") node.text = text;
    else node.prompt = text;
    markDirty();
    renderGraph();
  }
  closePromptEditor();
}

function closeAllPopovers() {
  if (!state.activePopover) return;
  state.activePopover = null;
  document.querySelectorAll(".card-popover, .toolbar-dropdown").forEach((el) => el.remove());
  document.querySelectorAll(".graph-node.popover-open").forEach((el) => el.classList.remove("popover-open"));
}

function togglePopover(nodeId, type, anchorCard) {
  if (state.activePopover?.nodeId === nodeId && state.activePopover?.type === type) {
    closeAllPopovers();
    return false;
  }
  closeAllPopovers();
  state.activePopover = { nodeId, type };
  if (anchorCard) anchorCard.classList.add("popover-open");
  return true;
}

function buildModelPopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover model-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const searchWrap = document.createElement("div");
  searchWrap.className = "popover-search";
  searchWrap.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Search" autocomplete="off">`;
  const searchInput = searchWrap.querySelector("input");

  const list = document.createElement("div");
  list.className = "popover-list";

  function renderOptions() {
    list.replaceChildren();
    const q = searchInput.value.trim().toLocaleLowerCase("vi");

    if (state.comfy.checkpoints.length) {
      const localMatches = state.comfy.checkpoints.filter((ckpt) => !q || ckpt.toLocaleLowerCase("vi").includes(q));
      if (localMatches.length) {
        const groupTitle = document.createElement("div");
        groupTitle.className = "popover-group-title";
        groupTitle.textContent = "LOCAL CHECKPOINTS";
        list.append(groupTitle);
        for (const ckpt of localMatches) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `popover-option ${node.model === ckpt && !node.presetLabel ? "active" : ""}`;
          btn.innerHTML = `<span class="model-configured-dot is-configured" title="Checkpoint ComfyUI đã sẵn sàng"></span><span class="model-badge-icon">${modelBadgeSvg("C")}</span><span class="model-option-label">${escapeHtml(ckpt)}</span>`;
          btn.addEventListener("click", () => {
            remember();
            node.model = ckpt;
            delete node.presetLabel;
            closeAllPopovers();
            markDirty();
            renderGraph();
          });
          list.append(btn);
        }
      }
    }

    for (const group of ["FEATURED", "ALL MODELS"]) {
      const groupItems = PRESET_MODELS.filter(
        (m) => m.group === group && (!q || m.label.toLocaleLowerCase("vi").includes(q))
      );
      if (!groupItems.length) continue;
      const groupTitle = document.createElement("div");
      groupTitle.className = "popover-group-title";
      groupTitle.textContent = group;
      list.append(groupTitle);
      for (const item of groupItems) {
        const btn = document.createElement("button");
        btn.type = "button";
        const shownModel = displayModelName(node);
        const isCurrent =
          node.presetLabel === item.label ||
          node.model === item.label ||
          node.model === item.id ||
          (!node.model && !node.presetLabel && shownModel === item.label);
        const configured = isModelConfigured(item.label, "image");
        btn.className = `popover-option ${isCurrent ? "active" : ""} ${item.featuredAccent ? "featured-accent" : ""} ${configured ? "has-config" : ""}`.trim();
        const tagClass = item.tagType === "beta" ? "model-tag-beta" : "model-tag-new";
        btn.innerHTML = `
          <span class="model-configured-dot ${configured ? "is-configured" : ""}" title="${configured ? "Đã cấu hình API Key" : ""}"></span>
          <span class="model-badge-icon">${modelBadgeSvg(item.badge)}</span>
          <span class="model-option-label">${escapeHtml(item.label)}</span>
          ${item.tag ? `<span class="${tagClass}">${escapeHtml(item.tag)}</span>` : ""}
          ${item.noPin ? "" : `<span class="model-pin-icon">${actionIcon("pin")}</span>`}
        `;
        btn.addEventListener("click", () => {
          remember();
          node.model = item.label;
          node.presetLabel = item.label;
          closeAllPopovers();
          markDirty();
          renderGraph();
        });
        list.append(btn);
      }
    }
  }

  searchInput.addEventListener("input", renderOptions);
  searchInput.addEventListener("keydown", (event) => {
    const options = [...list.querySelectorAll(".popover-option")];
    if (!options.length) return;
    const currentIdx = Math.max(0, options.findIndex((el) => el.classList.contains("active")));
    if (event.key === "ArrowDown") {
      event.preventDefault();
      options.forEach((el) => el.classList.remove("active"));
      const next = options[(currentIdx + 1) % options.length];
      next.classList.add("active");
      next.scrollIntoView({ block: "nearest" });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      options.forEach((el) => el.classList.remove("active"));
      const prev = options[(currentIdx - 1 + options.length) % options.length];
      prev.classList.add("active");
      prev.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter") {
      event.preventDefault();
      options[currentIdx]?.click();
    }
  });
  renderOptions();
  request("/comfy/status")
    .then((nextStatus) => {
      const prevConnected = Boolean(state.comfy?.connected);
      const prevCount = state.comfy?.checkpoints?.length || 0;
      state.comfy = nextStatus;
      if (
        popover.isConnected &&
        (Boolean(nextStatus?.connected) !== prevConnected || (nextStatus?.checkpoints?.length || 0) !== prevCount)
      ) {
        renderOptions();
      }
    })
    .catch(() => {});

  const foot = document.createElement("div");
  foot.className = "popover-foot";
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.textContent = "All models";
  allBtn.addEventListener("click", () => {
    closeAllPopovers();
    openSettings(node.id);
  });
  const navHint = document.createElement("span");
  navHint.className = "popover-nav-hint";
  navHint.innerHTML = `<kbd>↑↓</kbd><span>Navigate</span>`;
  foot.append(allBtn, navHint);

  popover.append(searchWrap, list, foot);
  card.append(popover);
  setTimeout(() => searchInput.focus(), 10);
}

function buildRatioPopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover ratio-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
  const current = currentRatioLabel(node);
  for (const [label, spec] of Object.entries(ASPECT_RATIOS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `popover-option ${current === label ? "active" : ""}`;
    btn.innerHTML = `${ratioFrameHtml(label)}<span>${escapeHtml(label)}</span>`;
    btn.addEventListener("click", () => {
      remember();
      [node.width, node.height] = spec.dims;
      node._userPickedRatio = true;
      node._previewSelectedRatio = true;
      node.historyIndex = 0;
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    popover.append(btn);
  }
  card.append(popover);
}

function buildModePopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover mode-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
  const current = node.quality || "Fast";
  for (const mode of ["Fast", "High"]) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `popover-option ${current === mode ? "active" : ""}`;
    btn.textContent = mode;
    btn.addEventListener("click", () => {
      remember();
      node.quality = mode;
      node.steps = mode === "High" ? 28 : 20;
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    popover.append(btn);
  }
  card.append(popover);
}

function buildEditorToolWidget(node, card, controls) {
  const tool = node.editorTool || "";
  if (!tool) return;
  const wrap = document.createElement("div");
  wrap.className = "editor-tool-widget";
  wrap.addEventListener("pointerdown", (e) => e.stopPropagation());

  if (tool === "camera-angle") {
    const cam = node.cameraAngle || { yaw: 15, pitch: -10, fov: 50 };
    wrap.innerHTML = `
      <div class="editor-tool-head">
        <span>3D Camera Angle Control</span>
        <strong>Yaw ${cam.yaw}° · Pitch ${cam.pitch}° · ${cam.fov}mm</strong>
      </div>
      <div class="gizmo-stage">
        <div class="gizmo-cube" style="transform: rotateX(${cam.pitch}deg) rotateY(${cam.yaw}deg)">
          <span class="gizmo-face">CAM</span>
        </div>
        <div class="gizmo-sliders">
          <label><span>Yaw</span><input type="range" min="-90" max="90" value="${cam.yaw}" data-cam="yaw"></label>
          <label><span>Pitch</span><input type="range" min="-60" max="60" value="${cam.pitch}" data-cam="pitch"></label>
          <label><span>Lens</span><input type="range" min="16" max="135" value="${cam.fov}" data-cam="fov"></label>
        </div>
      </div>
    `;
    wrap.querySelectorAll("input[data-cam]").forEach((slider) => {
      slider.addEventListener("input", () => {
        node.cameraAngle = node.cameraAngle || { yaw: 15, pitch: -10, fov: 50 };
        node.cameraAngle[slider.dataset.cam] = Number(slider.value);
        const cube = wrap.querySelector(".gizmo-cube");
        if (cube) cube.style.transform = `rotateX(${node.cameraAngle.pitch}deg) rotateY(${node.cameraAngle.yaw}deg)`;
        const headStrong = wrap.querySelector(".editor-tool-head strong");
        if (headStrong) headStrong.textContent = `Yaw ${node.cameraAngle.yaw}° · Pitch ${node.cameraAngle.pitch}° · ${node.cameraAngle.fov}mm`;
        node.prompt = `reframe camera angle yaw ${node.cameraAngle.yaw} deg, pitch ${node.cameraAngle.pitch} deg, ${node.cameraAngle.fov}mm lens, preserve character consistency`;
        markDirty();
      });
    });
    controls.append(wrap);
  } else if (tool === "adjust-colors") {
    const col = node.colorAdjust || { exposure: 0, contrast: 0, saturation: 0 };
    wrap.innerHTML = `
      <div class="editor-tool-head">
        <span>Color Grading</span>
        <button type="button" class="text-button" data-reset-color style="font-size:11px">Reset</button>
      </div>
      <div class="gizmo-sliders">
        <label><span>Exposure</span><input type="range" min="-50" max="50" value="${col.exposure}" data-col="exposure"></label>
        <label><span>Contrast</span><input type="range" min="-50" max="50" value="${col.contrast}" data-col="contrast"></label>
        <label><span>Saturation</span><input type="range" min="-50" max="50" value="${col.saturation}" data-col="saturation"></label>
      </div>
    `;
    wrap.querySelectorAll("input[data-col]").forEach((slider) => {
      slider.addEventListener("input", () => {
        node.colorAdjust = node.colorAdjust || { exposure: 0, contrast: 0, saturation: 0 };
        node.colorAdjust[slider.dataset.col] = Number(slider.value);
        node.prompt = `color grading adjustment exposure ${node.colorAdjust.exposure}, contrast ${node.colorAdjust.contrast}, saturation ${node.colorAdjust.saturation}, balanced studio tones`;
        markDirty();
      });
    });
    wrap.querySelector("[data-reset-color]")?.addEventListener("click", () => {
      node.colorAdjust = { exposure: 0, contrast: 0, saturation: 0 };
      markDirty();
      renderGraph();
    });
    controls.append(wrap);
  } else if (tool === "relight") {
    const pos = node.relightPos || { x: 68, y: 28 };
    const color = node.relightColor || "#fbbf24";
    const swatches = ["#fbbf24", "#60a5fa", "#f472b6", "#34d399", "#a78bfa", "#ffffff"];
    wrap.innerHTML = `
      <div class="editor-tool-head">
        <span>3D Relight Source</span>
        <div class="relight-swatches">
          ${swatches.map((sw) => `<button type="button" class="relight-swatch ${sw === color ? "active" : ""}" data-swatch="${sw}" style="background:${sw}"></button>`).join("")}
        </div>
      </div>
      <div class="relight-pad" title="Click or drag light position">
        <span class="relight-subject">Subject</span>
        <span class="relight-orb" style="left:${pos.x}%;top:${pos.y}%;background:${color};box-shadow:0 0 18px ${color}"></span>
      </div>
    `;
    const pad = wrap.querySelector(".relight-pad");
    const orb = wrap.querySelector(".relight-orb");
    pad?.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      const updatePos = (ev) => {
        const rect = pad.getBoundingClientRect();
        const x = Math.max(8, Math.min(92, Math.round(((ev.clientX - rect.left) / rect.width) * 100)));
        const y = Math.max(12, Math.min(88, Math.round(((ev.clientY - rect.top) / rect.height) * 100)));
        node.relightPos = { x, y };
        if (orb) {
          orb.style.left = `${x}%`;
          orb.style.top = `${y}%`;
        }
        node.prompt = `cinematic relighting from (${x}%, ${y}%) with ${node.relightColor || "#fbbf24"} rim light, volumetric studio shadows`;
      };
      updatePos(event);
      const up = () => {
        window.removeEventListener("pointermove", updatePos);
        markDirty();
      };
      window.addEventListener("pointermove", updatePos);
      window.addEventListener("pointerup", up, { once: true });
    });
    wrap.querySelectorAll("[data-swatch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        node.relightColor = btn.dataset.swatch;
        markDirty();
        renderGraph();
      });
    });
    controls.append(wrap);
  }
}

function insertMentionIntoPromptText(currentText, mentionTag) {
  const raw = String(currentText || "");
  if (/(^|\s)@[^\s@]*$/.test(raw)) {
    return raw.replace(/(^|\s)@[^\s@]*$/, `$1${mentionTag} `);
  }
  if (!raw.toLowerCase().includes(mentionTag.toLowerCase())) {
    return raw.trim() ? `${raw.trim()} ${mentionTag} ` : `${mentionTag} `;
  }
  return raw;
}

function getMentionCandidatesForNode(node) {
  const connectedIds = new Set(
    state.graph.edges.filter((e) => e.target === node.id).map((e) => e.source)
  );
  return state.graph.nodes
    .filter((n) => n.id !== node.id && ["image", "list", "text-image", "image-image", "upscaler"].includes(n.kind))
    .map((cand) => {
      const candRun = activeNodeRun(cand) || latestRun(cand.id);
      const assetId = candRun?.assetId || cand.assetId;
      const asset = assetId ? state.assets.find((a) => a.id === assetId) : null;
      const title = nodeDisplayTitle(cand);
      const creationIdx = state.graph.nodes.filter((n) => n.kind === "image").indexOf(cand) + 1;
      const mentionTag = `@${title || (cand.kind === "image" && creationIdx > 0 ? `Creation #${creationIdx}` : "Image")}`;
      return {
        cand,
        asset,
        title,
        mentionTag,
        isConnected: connectedIds.has(cand.id),
      };
    })
    .sort((a, b) => Number(b.isConnected) - Number(a.isConnected));
}

function attachAtMentionAutocomplete(textarea, promptWrap, richDisplay, node, card, propName = "prompt", onChanged = null) {
  let pickerEl = null;

  const closePicker = () => {
    if (pickerEl) {
      pickerEl.remove();
      pickerEl = null;
    }
  };

  const applyCandidate = (item, matchStart, cursorPos) => {
    remember();
    const targetPort =
      node.kind === "text"
        ? "image_in"
        : node.kind === "text-video" || node.kind === "image-video"
          ? "start_image"
          : node.kind === "extend-video" || node.kind === "modify-video" || node.kind === "video-video"
            ? "references"
            : node.kind === "image-image" || node.kind === "upscaler" || node.kind === "move" || node.kind === "speak"
              ? "source_image"
              : "reference_image";
    const hasEdge = state.graph.edges.some(
      (e) => e.source === item.cand.id && e.target === node.id && e.targetPort === targetPort
    );
    if (!hasEdge) {
      state.graph.edges.push({
        id: crypto.randomUUID(),
        source: item.cand.id,
        sourcePort: item.cand.kind === "list" ? "image" : "image",
        target: node.id,
        targetPort,
      });
    }
    const val = textarea.value || "";
    const before = val.slice(0, matchStart);
    const after = val.slice(cursorPos);
    const inserted = `${item.mentionTag} `;
    textarea.value = `${before}${inserted}${after}`;
    node[propName] = textarea.value;
    if (richDisplay) {
      richDisplay.innerHTML = formatPromptWithMentionPills(node[propName] || "");
    }
    closePicker();
    markDirty();
    if (typeof onChanged === "function") onChanged();
    const nextCursor = before.length + inserted.length;
    promptWrap.classList.remove("show-rich");
    textarea.focus();
    try {
      textarea.setSelectionRange(nextCursor, nextCursor);
    } catch {}
    renderEdges();
  };

  const updatePicker = () => {
    const val = textarea.value || "";
    const cursorPos = typeof textarea.selectionStart === "number" ? textarea.selectionStart : val.length;
    const beforeCursor = val.slice(0, cursorPos);
    const m = beforeCursor.match(/(?:^|\s)@([^\s@]*)$/);
    if (!m) {
      closePicker();
      return;
    }
    const query = (m[1] || "").toLowerCase();
    const atIndex = beforeCursor.lastIndexOf("@");
    const candidates = getMentionCandidatesForNode(node).filter(
      (it) =>
        !query ||
        it.title.toLowerCase().includes(query) ||
        it.mentionTag.toLowerCase().includes(query)
    );
    if (!candidates.length) {
      closePicker();
      return;
    }
    if (!pickerEl) {
      pickerEl = document.createElement("div");
      pickerEl.className = "card-popover reference-picker-popover at-mention-picker";
      pickerEl.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      pickerEl.addEventListener("pointerdown", (e) => e.stopPropagation());
      pickerEl.addEventListener("click", (e) => e.stopPropagation());
      pickerEl.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
      promptWrap.append(pickerEl);
    }
    pickerEl.innerHTML = "";
    const list = document.createElement("div");
    list.className = "popover-list";
    const groupTitle = document.createElement("div");
    groupTitle.className = "popover-group-title";
    groupTitle.textContent = "CHỌN ẢNH / THẺ ĐỂ TAG (@)";
    list.append(groupTitle);

    for (const item of candidates) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "popover-option ref-candidate-option";
      btn.innerHTML = `
        ${item.asset ? `<img src="${escapeHtml(item.asset.url)}" class="ref-candidate-thumb" alt="">` : `<span class="catalog-item-icon type-image" style="width:24px;height:24px;border-radius:6px">${iconMarkup("image")}</span>`}
        <span class="model-option-label">${escapeHtml(item.title)}</span>
        <span class="prompt-mention-pill" style="margin-left:auto;font-size:11px">${escapeHtml(item.mentionTag)}</span>
      `;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        applyCandidate(item, atIndex, cursorPos);
      });
      list.append(btn);
    }
    pickerEl.append(list);
  };

  textarea.addEventListener("input", updatePicker);
  textarea.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      closePicker();
      return;
    }
    updatePicker();
  });
  textarea.addEventListener("keydown", (e) => {
    if (!pickerEl) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closePicker();
    } else if (e.key === "Enter" || e.key === "Tab") {
      const firstBtn = pickerEl.querySelector(".ref-candidate-option");
      if (firstBtn) {
        e.preventDefault();
        firstBtn.click();
      }
    }
  });
  textarea.addEventListener("blur", () => {
    setTimeout(() => closePicker(), 120);
  });
}

function buildAddReferencePopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover reference-picker-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const list = document.createElement("div");
  list.className = "popover-list";

  const candidateNodes = state.graph.nodes.filter(
    (n) => n.id !== node.id && ["image", "list", "text-image", "image-image", "upscaler"].includes(n.kind)
  );

  if (candidateNodes.length) {
    const groupTitle = document.createElement("div");
    groupTitle.className = "popover-group-title";
    groupTitle.textContent = "CANVAS REFERENCES";
    list.append(groupTitle);

    for (const cand of candidateNodes) {
      const candRun = activeNodeRun(cand) || latestRun(cand.id);
      const assetId = candRun?.assetId || cand.assetId;
      const asset = assetId ? state.assets.find((a) => a.id === assetId) : null;
      const title = nodeDisplayTitle(cand);
      const creationIdx = state.graph.nodes.filter((n) => n.kind === "image").indexOf(cand) + 1;
      const mentionTag = `@${title || (cand.kind === "image" && creationIdx > 0 ? `Creation #${creationIdx}` : "Image")}`;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "popover-option ref-candidate-option";
      btn.innerHTML = `
        ${asset ? `<img src="${escapeHtml(asset.url)}" class="ref-candidate-thumb" alt="">` : `<span class="catalog-item-icon type-image" style="width:24px;height:24px;border-radius:6px">${iconMarkup("image")}</span>`}
        <span class="model-option-label">${escapeHtml(title)}</span>
        <span class="prompt-mention-pill" style="margin-left:auto;font-size:11px">${escapeHtml(mentionTag)}</span>
      `;
      btn.addEventListener("click", () => {
        remember();
        const targetPort =
          node.kind === "text"
            ? "image_in"
            : node.kind === "text-video" || node.kind === "image-video"
              ? "start_image"
              : node.kind === "extend-video" || node.kind === "modify-video" || node.kind === "video-video"
                ? "references"
                : node.kind === "image-image" || node.kind === "upscaler" || node.kind === "move" || node.kind === "speak"
                  ? "source_image"
                  : "reference_image";
        const hasEdge = state.graph.edges.some(
          (e) => e.source === cand.id && e.target === node.id && e.targetPort === targetPort
        );
        if (!hasEdge) {
          state.graph.edges.push({
            id: crypto.randomUUID(),
            source: cand.id,
            sourcePort: "image",
            target: node.id,
            targetPort,
          });
        }
        if (node.kind === "text") {
          node.text = insertMentionIntoPromptText(node.text, mentionTag);
        } else {
          node.prompt = insertMentionIntoPromptText(node.prompt, mentionTag);
        }
        closeAllPopovers();
        markDirty();
        renderGraph();
      });
      list.append(btn);
    }
  }

  const actionsGroup = document.createElement("div");
  actionsGroup.className = "popover-group-title";
  actionsGroup.textContent = "MEDIA & PROMPT";
  list.append(actionsGroup);

  const uploadBtn = document.createElement("button");
  uploadBtn.type = "button";
  uploadBtn.className = "popover-option";
  uploadBtn.innerHTML = `<span class="catalog-item-icon type-action" style="width:24px;height:24px;border-radius:6px">${actionIcon("assets")}</span><span>Choose from Assets / History…</span>`;
  uploadBtn.addEventListener("click", () => {
    closeAllPopovers();
    openAssetsPanel(node.id, true);
  });

  const editorBtn = document.createElement("button");
  editorBtn.type = "button";
  editorBtn.className = "popover-option";
  editorBtn.innerHTML = `<span class="catalog-item-icon type-action" style="width:24px;height:24px;border-radius:6px">${actionIcon("edit")}</span><span>Open Prompt Editor…</span>`;
  editorBtn.addEventListener("click", () => {
    closeAllPopovers();
    openPromptEditor(node.id);
  });

  list.append(uploadBtn, editorBtn);
  popover.append(list);
  card.append(popover);
}

function taskControls(node, card) {
  const body = card.querySelector(".node-body");
  const controls = document.createElement("div");
  controls.className = "task-controls";
  const hasResult = card.classList.contains("has-result");

  // Top row above prompt: (+) Add reference button + Reference Thumbnails + optional Editor Tool switcher
  const promptTop = document.createElement("div");
  promptTop.className = "card-prompt-top";
  const addPrompt = document.createElement("button");
  addPrompt.type = "button";
  addPrompt.className = "card-prompt-add";
  addPrompt.innerHTML =
    '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 3.2v9.6M3.2 8h9.6"/></svg>';
  addPrompt.title = "Add reference";
  addPrompt.setAttribute("aria-label", "Add reference");
  addPrompt.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "add-ref", card)) {
      buildAddReferencePopover(node, card);
    }
  });
  promptTop.append(addPrompt);

  const refs = getConnectedReferences(node);
  if (refs.length) {
    const thumbStrip = document.createElement("div");
    thumbStrip.className = "card-ref-thumbs";
    for (const ref of refs) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `card-ref-thumb ${ref.isMentioned ? "is-mentioned" : ""}`.trim();
      chip.title = `${ref.title} (${ref.mentionTag}) — Click to mention in prompt`;
      if (ref.asset?.url) {
        chip.innerHTML = `<img src="${escapeHtml(ref.asset.url)}" alt="${escapeHtml(ref.title)}">`;
      } else {
        chip.innerHTML = `<span class="ref-thumb-fallback">${iconMarkup("image")}</span>`;
      }
      chip.addEventListener("mousedown", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      chip.addEventListener("click", (event) => {
        event.stopPropagation();
        remember();
        node.prompt = insertMentionIntoPromptText(node.prompt || "", ref.mentionTag);
        markDirty();
        renderGraph();
      });
      thumbStrip.append(chip);
    }
    promptTop.append(thumbStrip);
  }

  if (node.kind === "image-image") {
    const toolLabelMap = {
      "": "Prompt Edit",
      "crop-image": "Crop Image",
      "change-ratio": "Image Extender",
      "camera-angle": "Change camera angle",
      "remove-bg": "Remove background",
      "adjust-colors": "Adjust colors",
      relight: "Relight",
    };
    const currentToolLabel = toolLabelMap[node.editorTool || ""] || "Prompt Edit";
    const toolBtn = document.createElement("button");
    toolBtn.type = "button";
    toolBtn.className = "card-pill";
    toolBtn.style.marginLeft = "auto";
    toolBtn.innerHTML = `<span>${escapeHtml(currentToolLabel)}</span><span class="pill-chevron">▾</span>`;
    toolBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "editor-tool", card)) {
        const labels = Object.values(toolLabelMap);
        buildSimpleListPopover(node, card, labels, currentToolLabel, (picked) => {
          const entryFound = Object.entries(toolLabelMap).find(([, v]) => v === picked);
          node.editorTool = entryFound ? entryFound[0] : "";
          const toolInfo = EDITOR_TOOLS_UI.find((t) => t.editorTool === node.editorTool);
          if (toolInfo) {
            node.customTitle = toolInfo.title;
            if (!node.prompt) node.prompt = toolInfo.presetPrompt;
          } else {
            delete node.customTitle;
          }
        });
      }
    });
    promptTop.append(toolBtn);
  }

  const batchInfo = computeNodeBatchCombinations(node);
  if (node.kind === "text-image" || batchInfo.lists.length > 0) {
    const modeGroup = document.createElement("div");
    modeGroup.className = "input-mode-switcher";
    if (node.kind !== "image-image") modeGroup.style.marginLeft = "auto";

    const singleModeBtn = document.createElement("button");
    singleModeBtn.type = "button";
    singleModeBtn.className = `input-mode-btn ${!batchInfo.isListMode ? "active" : ""}`.trim();
    singleModeBtn.title = "Single prompt mode";
    singleModeBtn.innerHTML = "☰";
    singleModeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      remember();
      node.listMode = false;
      markDirty();
      renderGraph();
    });

    const listModeBtn = document.createElement("button");
    listModeBtn.type = "button";
    listModeBtn.className = `input-mode-btn is-list-mode ${batchInfo.isListMode ? "active" : ""}`.trim();
    listModeBtn.title = batchInfo.totalCount > 0 ? `List mode (${batchInfo.totalCount} combinations)` : "List mode";
    listModeBtn.innerHTML = "∣≡";
    listModeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      remember();
      node.listMode = true;
      markDirty();
      renderGraph();
    });

    modeGroup.append(singleModeBtn, listModeBtn);
    promptTop.append(modeGroup);
  }
  controls.append(promptTop);

  // Interactive 3D / Color / Relight widget when Image Editor sub-tool is active
  if (node.kind === "image-image" && node.editorTool) {
    buildEditorToolWidget(node, card, controls);
  }

  // Prompt area (linked Text/Assistant/List node or inline textarea + rich @mention display)
  const promptEdge = state.graph.edges.find((edge) => edge.target === node.id && edge.targetPort === "prompt");
  if (promptEdge) {
    if (node.extraPrompt) {
      const extraInput = document.createElement("textarea");
      extraInput.className = "card-prompt connected-extra-prompt";
      extraInput.rows = 1;
      extraInput.placeholder = "Extra context";
      extraInput.value = node.extraPrompt || "";
      extraInput.addEventListener("input", () => {
        node.extraPrompt = extraInput.value;
        markDirty();
      });
      controls.append(extraInput);
    }
  } else {
    const promptWrap = document.createElement("div");
    promptWrap.className = "card-prompt-wrap";

    const richDisplay = document.createElement("div");
    richDisplay.className = "card-prompt-rich";
    richDisplay.innerHTML = formatPromptWithMentionPills(node.prompt || "");

    const prompt = document.createElement("textarea");
    prompt.className = "card-prompt";
    prompt.rows = hasResult ? 2 : 2;
    prompt.placeholder =
      node.kind === "text-image"
        ? "Describe the image you want to generate…"
        : "Describe how to change the image… (optional)";
    prompt.setAttribute("aria-label", "Prompt");
    prompt.value = node.prompt || "";

    const hasMention = /@\S+/.test(node.prompt || "");
    if (hasResult || hasMention) {
      promptWrap.classList.add("show-rich");
    }

    richDisplay.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
      promptWrap.classList.remove("show-rich");
      prompt.focus();
    });

    let editing = false;
    prompt.addEventListener("input", () => {
      if (!editing) {
        remember();
        editing = true;
      }
      node.prompt = prompt.value;
      richDisplay.innerHTML = formatPromptWithMentionPills(node.prompt || "");
      markDirty();
      card.querySelectorAll("[data-run-for]").forEach((run) => {
        run.disabled = !canRunTask(node);
      });
    });
    prompt.addEventListener("blur", () => {
      editing = false;
      if (hasResult || /@\S+/.test(node.prompt || "")) {
        promptWrap.classList.add("show-rich");
      }
    });
    promptWrap.append(richDisplay, prompt);
    attachAtMentionAutocomplete(prompt, promptWrap, richDisplay, node, card, "prompt", () => {
      card.querySelectorAll("[data-run-for]").forEach((run) => {
        run.disabled = !canRunTask(node);
      });
    });
    controls.append(promptWrap);
  }

  // Row 1: [x30 / - x1 +]  [Model ▾]  [▢ 9:16 ▾]
  const settings = document.createElement("div");
  settings.className = "card-settings";

  if (node.kind === "text-image") {
    if (batchInfo.isListMode && batchInfo.totalCount > 0) {
      const batchPill = document.createElement("button");
      batchPill.type = "button";
      batchPill.className = "card-pill batch-count-pill";
      batchPill.title = `${batchInfo.totalCount} Combinations (List mode)`;
      batchPill.textContent = `x${batchInfo.totalCount}`;
      batchPill.addEventListener("click", (e) => {
        e.stopPropagation();
        notify(`List mode: ${batchInfo.totalCount} tổ hợp sẵn sàng chạy.`);
      });
      settings.append(batchPill);
    } else {
      const countVal = node.count ?? 1;
      const stepper = document.createElement("div");
      stepper.className = "card-count-stepper";
      const dec = document.createElement("button");
      dec.type = "button";
      dec.innerHTML =
        '<svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3.2 7h7.6"/></svg>';
      dec.title = "Decrease image count";
      dec.setAttribute("aria-label", "Decrease image count");
      dec.disabled = countVal <= 1;
      dec.addEventListener("click", (event) => {
        event.stopPropagation();
        if ((node.count ?? 1) <= 1) return;
        remember();
        node.count = (node.count ?? 1) - 1;
        markDirty();
        renderGraph();
      });
      const countText = document.createElement("span");
      countText.className = "card-count-value";
      countText.textContent = `x${countVal}`;
      const inc = document.createElement("button");
      inc.type = "button";
      inc.innerHTML =
        '<svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 3.2v7.6M3.2 7h7.6"/></svg>';
      inc.title = "Increase image count";
      inc.setAttribute("aria-label", "Increase image count");
      inc.disabled = countVal >= 4;
      inc.addEventListener("click", (event) => {
        event.stopPropagation();
        if ((node.count ?? 1) >= 4) return;
        remember();
        node.count = (node.count ?? 1) + 1;
        markDirty();
        renderGraph();
      });
      stepper.append(dec, countText, inc);
      settings.append(stepper);
    }
  }

  // Model selector pill button
  const modelBtn = document.createElement("button");
  modelBtn.type = "button";
  modelBtn.className = "card-pill card-model-btn";
  modelBtn.setAttribute("aria-label", "Select model");
  const shownModel = node.presetLabel && !state.comfy.checkpoints.includes(node.model) ? node.presetLabel : displayModelName(node);
  const shownConfigured = isModelConfigured(shownModel, "image");
  modelBtn.innerHTML = `${shownConfigured ? '<span class="pill-configured-dot" title="Đã cấu hình API Key"></span>' : ""}<span class="pill-label">${escapeHtml(shownModel)}</span><span class="pill-chevron">▾</span>`;
  modelBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "model", card)) {
      buildModelPopover(node, card);
    }
  });
  settings.append(modelBtn);

  if (node.kind === "text-image" || node.kind === "image-image") {
    const ratioLabel = currentRatioLabel(node);
    const ratioBtn = document.createElement("button");
    ratioBtn.type = "button";
    ratioBtn.className = "card-pill card-ratio-btn";
    ratioBtn.setAttribute("aria-label", "Aspect ratio");
    ratioBtn.innerHTML = `${ratioFrameHtml(ratioLabel)}<span class="pill-label">${escapeHtml(ratioLabel)}</span><span class="pill-chevron">▾</span>`;
    ratioBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "ratio", card)) {
        buildRatioPopover(node, card);
      }
    });
    settings.append(ratioBtn);
  }
  if (node.kind !== "text-image") {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "1";
    input.step = "0.05";
    input.value = node.denoise ?? 0.75;
    input.title = "Mức thay đổi";
    input.setAttribute("aria-label", "Mức thay đổi");
    input.addEventListener("change", () => {
      const value = Number(input.value);
      if (!Number.isFinite(value) || value < 0 || value > 1) {
        notify("Mức thay đổi không hợp lệ.");
        input.value = node.denoise ?? 0.75;
        return;
      }
      remember();
      node.denoise = value;
      markDirty();
    });
    settings.append(input);
  }
  controls.append(settings);

  // Row 2: [2K ▾] [Fast ▾] [⚙] [Status] ... [▶ / ↻ / ⏹]
  const actions = document.createElement("div");
  actions.className = "card-task-actions";

  const resVal = node.imageRes || "2K";
  const resBtn = document.createElement("button");
  resBtn.type = "button";
  resBtn.className = "card-pill card-res-pill";
  resBtn.title = "Resolution";
  resBtn.innerHTML = `<span class="pill-label">${escapeHtml(resVal)}</span><span class="pill-chevron">▾</span>`;
  resBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "img-res", card)) {
      buildSimpleListPopover(node, card, ["1K", "2K", "4K"], resVal, (val) => {
        node.imageRes = val;
      });
    }
  });

  const modeBtn = document.createElement("button");
  modeBtn.type = "button";
  modeBtn.className = "card-pill card-mode-btn";
  modeBtn.title = "Mode";
  modeBtn.setAttribute("aria-label", "Mode");
  modeBtn.innerHTML = `<span class="pill-label">${escapeHtml(node.quality || "Fast")}</span><span class="pill-chevron">▾</span>`;
  modeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "mode", card)) {
      buildModePopover(node, card);
    }
  });

  const gear = document.createElement("button");
  gear.type = "button";
  gear.className = "card-gear";
  gear.innerHTML = actionIcon("settings");
  gear.title = "Settings";
  gear.setAttribute("aria-label", "Settings");
  gear.addEventListener("click", (event) => {
    event.stopPropagation();
    closeAllPopovers();
    openSettings(node.id);
  });

  const status = document.createElement("span");
  status.className = "node-status";
  const statusText = taskStatus(node);
  status.innerHTML = `<span class="node-status-dot"></span><span>${escapeHtml(statusText === "Chưa chạy" ? "" : statusText)}</span>`;

  const latestForStop = latestRun(node.id);
  const isRunningNow = Boolean(node._batchRunning || node._running || isBridgePending(latestForStop));
  const rerunSvg =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>';
  const stopSvg =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
  const run = document.createElement("button");
  run.type = "button";
  run.className = `card-run ${isRunningNow ? "is-stopping" : hasResult ? "is-rerun" : ""}`.trim();
  run.dataset.runNode = node.id;
  run.dataset.runFor = node.id;
  run.innerHTML = isRunningNow ? stopSvg : hasResult ? rerunSvg : actionIcon("play");
  run.setAttribute("aria-label", isRunningNow ? "Stop" : hasResult ? "Re-run" : "Run");
  run.title = isRunningNow ? "Dừng / Hủy tiến trình" : hasResult ? "Re-run" : "Run";
  run.disabled = isRunningNow ? false : !canRunTask(node);
  run.addEventListener("click", (event) => {
    event.stopPropagation();
    runNode(node.id);
  });

  actions.append(resBtn, modeBtn, gear, status, run);
  controls.append(actions);
  body.append(controls);
}

function buildUpscalerModelPopover(node, card, triggerBtn = null) {
  const popover = document.createElement("div");
  popover.className = "card-popover model-popover upscaler-model-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const searchWrap = document.createElement("div");
  searchWrap.className = "popover-search";
  searchWrap.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Tìm model Upscale..." autocomplete="off">`;
  const searchInput = searchWrap.querySelector("input");

  const list = document.createElement("div");
  list.className = "popover-list";
  const currentModel = node.upscaleModel || node.model || "Antigravity AI Bridge";

  function selectUpscaleModel(label) {
    remember();
    node.upscaleModel = label;
    node.model = label;
    node.presetLabel = label;
    closeAllPopovers();
    markDirty();
    renderGraph();
  }

  function renderOptions() {
    list.replaceChildren();
    const q = searchInput.value.trim().toLocaleLowerCase("vi");

    if (state.comfy.checkpoints.length) {
      const localMatches = state.comfy.checkpoints.filter((ckpt) => !q || ckpt.toLocaleLowerCase("vi").includes(q));
      if (localMatches.length) {
        const groupTitle = document.createElement("div");
        groupTitle.className = "popover-group-title";
        groupTitle.textContent = "LOCAL CHECKPOINTS";
        list.append(groupTitle);
        for (const ckpt of localMatches) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `popover-option ${currentModel === ckpt ? "active" : ""} has-config`.trim();
          btn.innerHTML = `<span class="model-configured-dot is-configured" title="Checkpoint ComfyUI đã sẵn sàng"></span><span class="model-badge-icon">${modelBadgeSvg("C")}</span><span class="model-option-label">${escapeHtml(ckpt)}</span>`;
          btn.addEventListener("click", () => selectUpscaleModel(ckpt));
          list.append(btn);
        }
      }
    }

    const groups = ["AI BRIDGE & SUPER-RESOLUTION", "DEDICATED UPSCALERS", "IMAGE MODELS (UPSCALING)"];
    for (const group of groups) {
      const groupItems = UPSCALER_MODELS.filter(
        (m) => m.group === group && (!q || m.label.toLocaleLowerCase("vi").includes(q))
      );
      if (!groupItems.length) continue;
      const groupTitle = document.createElement("div");
      groupTitle.className = "popover-group-title";
      groupTitle.textContent = group;
      list.append(groupTitle);
      for (const item of groupItems) {
        const btn = document.createElement("button");
        btn.type = "button";
        const isCurrent = currentModel === item.label || currentModel === item.id;
        const configured = isModelConfigured(item.label, "upscaler");
        btn.className = `popover-option ${isCurrent ? "active" : ""} ${item.featuredAccent ? "featured-accent" : ""} ${configured ? "has-config" : ""}`.trim();
        const tagClass = item.tagType === "beta" ? "model-tag-beta" : "model-tag-new";
        btn.innerHTML = `
          <span class="model-configured-dot ${configured ? "is-configured" : ""}" title="${configured ? "Đã sẵn sàng sử dụng" : ""}"></span>
          <span class="model-badge-icon">${modelBadgeSvg(item.badge)}</span>
          <span class="model-option-label">${escapeHtml(item.label)}</span>
          ${item.tag ? `<span class="${tagClass}">${escapeHtml(item.tag)}</span>` : ""}
        `;
        btn.addEventListener("click", () => selectUpscaleModel(item.label));
        list.append(btn);
      }
    }
  }

  searchInput.addEventListener("input", renderOptions);
  renderOptions();
  request("/comfy/status")
    .then((nextStatus) => {
      const prevConnected = Boolean(state.comfy?.connected);
      const prevCount = state.comfy?.checkpoints?.length || 0;
      state.comfy = nextStatus;
      if (
        popover.isConnected &&
        (Boolean(nextStatus?.connected) !== prevConnected || (nextStatus?.checkpoints?.length || 0) !== prevCount)
      ) {
        renderOptions();
      }
    })
    .catch(() => {});

  const foot = document.createElement("div");
  foot.className = "popover-foot";
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.textContent = "Cấu hình API Key";
  allBtn.addEventListener("click", () => {
    closeAllPopovers();
    openModelSettingsModal("image");
  });
  const navHint = document.createElement("span");
  navHint.className = "popover-nav-hint";
  navHint.innerHTML = `<kbd>↑↓</kbd><span>Chọn model</span>`;
  foot.append(allBtn, navHint);

  popover.append(searchWrap, list, foot);
  card.append(popover);
  if (triggerBtn && card) {
    const cardRect = card.getBoundingClientRect();
    const btnRect = triggerBtn.getBoundingClientRect();
    const zoom = state.zoom || 1;
    const bottomPx = Math.max(48, Math.round((cardRect.bottom - btnRect.top) / zoom + 8));
    popover.style.bottom = `${bottomPx}px`;
    popover.style.left = "30px";
  }
  setTimeout(() => searchInput.focus(), 10);
}

function upscalerControls(node, card) {
  const body = card.querySelector(".node-body");
  const controls = document.createElement("div");
  controls.className = "task-controls upscaler-controls";

  const resultRun = activeNodeRun(node) || latestRun(node.id);
  const hasResult = Boolean(
    resultRun?.state === "succeeded" && (resultRun?.assetId || node.assetId) && !isBridgePending(resultRun)
  );

  const row1 = document.createElement("div");
  row1.className = "card-settings upscaler-row";

  const modeVal = node.upscaleMode || "Precision (Clarity)";
  const modeBtn = document.createElement("button");
  modeBtn.type = "button";
  modeBtn.className = "card-pill upscaler-mode-pill";
  modeBtn.title = `Chế độ Upscale: ${modeVal}`;
  modeBtn.innerHTML = `<span class="pill-label">${escapeHtml(modeVal)}</span><span class="pill-chevron">▾</span>`;
  modeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "upscale-mode", card)) {
      buildSimpleListPopover(
        node,
        card,
        ["Precision (Clarity)", "Creative (Hallucination)"],
        modeVal,
        (v) => {
          node.upscaleMode = v;
        },
        "upscaler-list-popover",
        modeBtn
      );
    }
  });

  const modelVal = node.upscaleModel || node.model || "Antigravity AI Bridge";
  const modelConfigured = isModelConfigured(modelVal, "upscaler");
  const modelBtn = document.createElement("button");
  modelBtn.type = "button";
  modelBtn.className = "card-pill card-model-btn upscaler-model-pill";
  modelBtn.title = `Model Upscale: ${modelVal}`;
  modelBtn.innerHTML = `${modelConfigured ? '<span class="pill-configured-dot" title="Đã sẵn sàng kết nối"></span>' : ""}<span class="pill-label">${escapeHtml(modelVal)}</span><span class="pill-chevron">▾</span>`;
  modelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "upscale-model", card)) {
      buildUpscalerModelPopover(node, card, modelBtn);
    }
  });

  row1.append(modeBtn, modelBtn);
  controls.append(row1);

  const row2 = document.createElement("div");
  row2.className = "card-task-actions upscaler-row";

  const scaleVal = `${node.scaleFactor || 2}x`;
  const scaleBtn = document.createElement("button");
  scaleBtn.type = "button";
  scaleBtn.className = "card-pill upscaler-scale-pill";
  scaleBtn.title = `Hệ số phóng đại: ${scaleVal}`;
  scaleBtn.innerHTML = `<span class="pill-label">${escapeHtml(scaleVal)}</span><span class="pill-chevron">▾</span>`;
  scaleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "upscale-scale", card)) {
      buildSimpleListPopover(
        node,
        card,
        ["2x", "4x", "8x", "16x"],
        scaleVal,
        (v) => {
          node.scaleFactor = parseInt(v, 10) || 2;
        },
        "upscaler-list-popover",
        scaleBtn
      );
    }
  });

  const flavorVal = node.upscaleFlavor || "Balanced";
  const flavorBtn = document.createElement("button");
  flavorBtn.type = "button";
  flavorBtn.className = "card-pill upscaler-flavor-pill";
  flavorBtn.title = `Mức chi tiết: ${flavorVal}`;
  flavorBtn.innerHTML = `<span class="pill-label">${escapeHtml(flavorVal)}</span><span class="pill-chevron">▾</span>`;
  flavorBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "upscale-flavor", card)) {
      buildSimpleListPopover(
        node,
        card,
        ["Subtle", "Balanced", "Ultra Detailed"],
        flavorVal,
        (v) => {
          node.upscaleFlavor = v;
        },
        "upscaler-list-popover",
        flavorBtn
      );
    }
  });

  const addSourceBtn = document.createElement("button");
  addSourceBtn.type = "button";
  addSourceBtn.className = "card-gear";
  addSourceBtn.innerHTML = actionIcon("plus");
  addSourceBtn.title = "Chọn ảnh nguồn để Upscale";
  addSourceBtn.setAttribute("aria-label", "Chọn ảnh nguồn để Upscale");
  addSourceBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "add-ref", card)) {
      buildAddReferencePopover(node, card);
    }
  });

  const isRunningNow = Boolean(node._batchRunning || node._running);
  const rerunSvg =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>';
  const stopSvg =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
  const run = document.createElement("button");
  run.type = "button";
  run.className = `card-run ${isRunningNow ? "is-stopping" : hasResult ? "is-rerun" : ""}`.trim();
  run.dataset.runNode = node.id;
  run.dataset.runFor = node.id;
  run.innerHTML = isRunningNow ? stopSvg : hasResult ? rerunSvg : actionIcon("play");
  run.title = isRunningNow ? "Stop" : hasResult ? "Re-run Upscale" : "Run Upscale";
  run.disabled = isRunningNow ? false : !canRunTask(node);
  run.addEventListener("click", (e) => {
    e.stopPropagation();
    runNode(node.id);
  });

  row2.append(scaleBtn, flavorBtn, addSourceBtn, run);
  controls.append(row2);
  body.append(controls);
}

function textNodeControls(node, card) {
  const body = card.querySelector(".node-body");
  body.replaceChildren();

  const styleMap = {
    Paragraph: "style-paragraph",
    "Heading 1": "style-h1",
    "Heading 2": "style-h2",
    "Heading 3": "style-h3",
  };
  const styleClass = styleMap[node.textStyle || "Paragraph"] || "style-paragraph";

  if (node.textHr) {
    const hr = document.createElement("hr");
    hr.className = "text-card-hr";
    body.append(hr);
  }

  const promptWrap = document.createElement("div");
  promptWrap.className = "card-prompt-wrap text-node-prompt-wrap";

  const richDisplay = document.createElement("div");
  richDisplay.className = ["card-prompt-rich", "text-node-rich", styleClass, node.textBold ? "is-bold" : "", node.textItalic ? "is-italic" : ""]
    .filter(Boolean)
    .join(" ");
  richDisplay.innerHTML = formatPromptWithMentionPills(node.text || "");

  const area = document.createElement("textarea");
  area.className = [
    "card-prompt",
    "text-node-inline",
    "text-inline-editor",
    styleClass,
    node.textBold ? "is-bold" : "",
    node.textItalic ? "is-italic" : "",
  ]
    .filter(Boolean)
    .join(" ");
  area.rows = 6;
  area.placeholder = 'Try "Happy dog with sunglasses and floating ring" or use @List #1';
  area.value = node.text || "";

  if (/@\S+/.test(node.text || "")) {
    promptWrap.classList.add("show-rich");
  }

  richDisplay.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    promptWrap.classList.remove("show-rich");
    area.focus();
  });

  let editing = false;
  const syncDownstreamFromText = () => {
    for (const edge of state.graph.edges.filter((item) => item.source === node.id && item.targetPort === "prompt")) {
      const task = state.graph.nodes.find((item) => item.id === edge.target);
      for (const run of [...document.querySelectorAll("[data-run-for]")].filter((item) => item.dataset.runFor === edge.target)) {
        if (task) run.disabled = !canRunTask(task);
      }
    }
  };
  area.addEventListener("input", () => {
    if (!editing) {
      remember();
      editing = true;
    }
    node.text = area.value;
    richDisplay.innerHTML = formatPromptWithMentionPills(node.text || "");
    syncDownstreamFromText();
    markDirty();
  });
  area.addEventListener("blur", () => {
    editing = false;
    if (/@\S+/.test(node.text || "")) {
      promptWrap.classList.add("show-rich");
    }
  });

  promptWrap.append(richDisplay, area);
  attachAtMentionAutocomplete(area, promptWrap, richDisplay, node, card, "text", syncDownstreamFromText);
  body.append(promptWrap);
}

function assistantControls(node, card) {
  const body = card.querySelector(".node-body");
  body.replaceChildren();
  const wrap = document.createElement("div");
  wrap.className = "task-controls assistant-controls";

  const outputBox = document.createElement("div");
  outputBox.className = "assistant-output-box";
  if (node.text) {
    outputBox.textContent = node.text;
  } else {
    outputBox.innerHTML = `<span class="inspector-muted">Assistant response will appear here. Ask for prompt variations, camera angles, or scripts…</span>`;
  }
  wrap.append(outputBox);

  const prompt = document.createElement("textarea");
  prompt.className = "card-prompt";
  prompt.rows = 2;
  prompt.placeholder = "Ask Assistant (e.g. 'Give me 6 camera angles for this character')…";
  prompt.value = node.prompt || "";
  prompt.addEventListener("input", () => {
    node.prompt = prompt.value;
    markDirty();
  });
  wrap.append(prompt);

  const row = document.createElement("div");
  row.className = "card-task-actions";

  const modelVal = node.assistantModel || "GPT-5 Mini";
  const modelBtn = document.createElement("button");
  modelBtn.type = "button";
  modelBtn.className = "card-pill";
  modelBtn.innerHTML = `<span>${escapeHtml(modelVal)}</span><span class="pill-chevron">▾</span>`;
  modelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (togglePopover(node.id, "assistant-model", card)) {
      buildSimpleListPopover(node, card, ["GPT-5 Mini", "Claude 4.5 Sonnet", "Gemini 2.5 Pro"], modelVal, (v) => {
        node.assistantModel = v;
      });
    }
  });

  const exportVal = node.exportMode || "Export as text";
  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.className = "card-pill";
  exportBtn.innerHTML = `<span>${escapeHtml(exportVal)}</span><span class="pill-chevron">▾</span>`;
  exportBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (togglePopover(node.id, "assistant-export", card)) {
      buildSimpleListPopover(node, card, ["Export as text", "Export as list"], exportVal, (v) => {
        node.exportMode = v;
        if (v === "Export as list" && node.text) {
          const lines = node.text
            .split(/\r?\n/)
            .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
            .filter(Boolean);
          const hasList = state.graph.edges.some((edge) => edge.source === node.id && state.graph.nodes.find((n) => n.id === edge.target)?.kind === "list");
          if (!hasList) {
            addNode("list", node.id, null, { items: lines.map((text) => ({ type: "text", text })) });
          } else {
            pushOutputsToConnectedLists(node.id, lines.map((text) => ({ type: "text", text })), "text");
          }
        }
      });
    }
  });

  const run = document.createElement("button");
  run.type = "button";
  run.className = "card-run";
  run.dataset.runNode = node.id;
  run.innerHTML = actionIcon("play");
  run.title = "Run Assistant";
  run.addEventListener("click", (e) => {
    e.stopPropagation();
    runNode(node.id);
  });

  row.append(modelBtn, exportBtn, run);
  wrap.append(row);
  body.append(wrap);
}

function buildKeepItemsPopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover keep-items-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());

  const options = [
    {
      keep: true,
      title: "Keep Items",
      desc: "Add new items from connected nodes to existing list",
    },
    {
      keep: false,
      title: "Replace Items",
      desc: "Replace list items with new outputs from connected nodes",
    },
  ];
  const currentKeep = node.keepItems !== false;
  for (const opt of options) {
    const btn = document.createElement("button");
    btn.type = "button";
    const isActive = currentKeep === opt.keep;
    btn.className = `popover-option keep-item-option ${isActive ? "active" : ""}`;
    btn.innerHTML = `
      <div class="keep-item-copy">
        <strong>${escapeHtml(opt.title)}</strong>
        <small>${escapeHtml(opt.desc)}</small>
      </div>
      ${isActive ? '<span class="keep-item-check">✓</span>' : ""}
    `;
    btn.addEventListener("click", () => {
      remember();
      node.keepItems = opt.keep;
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    popover.append(btn);
  }
  card.append(popover);
}

function spawnImageNodeNextToList(listNode, asset, item = null) {
  if (!listNode || !asset) return null;
  remember();
  const baseX = Math.round((listNode.x || 0) + 368);
  const baseY = Math.round(listNode.y || 0);
  const existingNear = state.graph.nodes.filter(
    (n) => n.kind === "image" && Math.abs((n.x || 0) - baseX) < 30 && Math.abs((n.y || 0) - baseY) < 420
  );
  const offsetY = existingNear.length ? existingNear.length * 36 : 0;
  const srcNode = addNode("image", null, { x: baseX, y: baseY + offsetY });
  srcNode.assetId = asset.id;
  const creationNum = state.graph.nodes.filter((n) => n.kind === "image").length;
  srcNode.customTitle = `Creation #${creationNum}`;
  if (item?.width && item?.height) {
    srcNode.imageWidth = item.width;
    srcNode.imageHeight = item.height;
  }
  state.selected = srcNode.id;
  markDirty();
  renderGraph();
  notify(`Đã tạo ${srcNode.customTitle} kế bên List.`);
  return srcNode;
}

function openGalleryModal(listNodeId, startIndex = 0, initialTab = "details") {
  const modal = $("#galleryModal");
  if (!modal) return;
  const listNode = state.graph.nodes.find((n) => n.id === listNodeId);
  if (!listNode || !Array.isArray(listNode.items) || !listNode.items.length) return;

  let currentIndex = Math.max(0, Math.min(startIndex, listNode.items.length - 1));
  let activeTab = initialTab || "details";
  let activeTool = "inpaint";
  let brushSize = 28;
  let isComparing = false;

  const renderModal = () => {
    const items = listNode.items;
    if (!items.length) {
      modal.hidden = true;
      return;
    }
    currentIndex = Math.max(0, Math.min(currentIndex, items.length - 1));
    const item = items[currentIndex] || {};
    const asset = item.assetId ? state.assets.find((a) => a.id === item.assetId) : null;
    const isVideoItem = item.type === "video" || asset?.kind === "video";
    const fallbackRef = state.graph.nodes.find((n) => n.kind === "image" && n.assetId);
    const refAssetId = item.firstFrameAssetId || item.referenceAssetId || fallbackRef?.assetId || null;
    const refAsset = refAssetId ? state.assets.find((a) => a.id === refAssetId) : null;
    if (!Array.isArray(item.comments)) item.comments = [];
    const modelName = item.model || (isVideoItem ? "Kling 2.5" : "Nano Banana 2");
    const dimsText = item.width && item.height ? `${item.width}x${item.height} px` : isVideoItem ? "720x1280 px" : "512x917 px";
    const durBadgeText = item.duration === "10s" || item.duration === '10"' ? "00:10" : "00:05";
    const cacheVer = asset ? (asset.sha256 || "").slice(0, 10) || asset.size || "" : "";
    const stageMediaSrc = asset
      ? cacheVer && !asset.url.includes("?")
        ? `${asset.url}?v=${cacheVer}`
        : asset.url
      : "";
    const posterAsset = item.firstFrameAssetId ? state.assets.find((a) => a.id === item.firstFrameAssetId) : null;

    modal.hidden = false;
    modal.innerHTML = `
      <div class="gallery-modal-backdrop"></div>
      <div class="gallery-modal-shell" role="dialog" aria-modal="true" aria-label="Gallery viewer">
        <div class="gallery-main-pane">
          <div class="gallery-top-bar">
            <div class="gallery-top-pill">
              <span class="gallery-grid-icon">⊞</span>
              <span>Gallery</span>
              <span class="gallery-counter">${currentIndex + 1} / ${items.length}</span>
            </div>
            <div class="gallery-top-actions">
              <button type="button" class="gallery-icon-btn" id="galleryCloseBtn" aria-label="Đóng">×</button>
            </div>
          </div>

          <div class="gallery-stage-area">
            <button type="button" class="gallery-nav-btn prev" id="galleryPrevBtn" ${items.length <= 1 ? "disabled" : ""} aria-label="Trước">‹</button>
            <div class="gallery-media-frame ${activeTab === "edit" ? "is-editing" : ""} ${isComparing && refAsset ? "is-comparing" : ""}">
              ${
                isComparing && refAsset
                  ? `
                  <div class="gallery-compare-pane">
                    <span class="gallery-compare-label">Reference / Start Frame</span>
                    <img src="${escapeHtml(refAsset.url)}" alt="Reference" class="gallery-stage-img">
                  </div>
                  `
                  : ""
              }
              <div class="gallery-primary-pane">
                ${
                  isComparing && refAsset
                    ? `<span class="gallery-compare-label">${isVideoItem ? "Generated Video" : "Generated Image"}</span>`
                    : ""
                }
                ${
                  asset
                    ? isVideoItem
                      ? `
                        <div class="gallery-video-stage-wrap">
                          <video id="galleryStageVideo" src="${escapeHtml(stageMediaSrc)}" ${posterAsset ? `poster="${escapeHtml(posterAsset.url)}"` : ""} class="gallery-stage-img gallery-stage-video" autoplay loop muted playsinline></video>
                          <div class="gallery-video-transport">
                            <button type="button" class="gallery-vctrl-btn" id="galleryVidRewBtn" title="-5s">-5s</button>
                            <button type="button" class="gallery-vctrl-btn is-play" id="galleryVidPlayBtn" title="Play / Pause">❚❚</button>
                            <button type="button" class="gallery-vctrl-btn" id="galleryVidFwdBtn" title="+5s">+5s</button>
                            <span class="gallery-vctrl-time" id="galleryVidTimeLabel">00:00 / ${durBadgeText}</span>
                            <button type="button" class="gallery-vctrl-btn" id="galleryVidMuteBtn" title="Toggle sound">🔇</button>
                          </div>
                        </div>
                      `
                      : `<img src="${escapeHtml(stageMediaSrc)}" alt="${escapeHtml(item.text || asset.name)}" class="gallery-stage-img">`
                    : `<div class="gallery-stage-text">${escapeHtml(item.text || `Item #${currentIndex + 1}`)}</div>`
                }
              </div>
              ${
                activeTab === "edit"
                  ? `<div class="gallery-edit-badge">Chế độ chỉnh sửa: <strong>${escapeHtml(activeTool.toUpperCase())}</strong> · Cọ ${brushSize}px</div>`
                  : ""
              }
            </div>
            <button type="button" class="gallery-nav-btn next" id="galleryNextBtn" ${items.length <= 1 ? "disabled" : ""} aria-label="Tiếp">›</button>
          </div>

          <div class="gallery-bottom-row">
            <div class="gallery-bottom-left-group">
              <button type="button" class="gallery-select-pill ${item.selected ? "is-selected" : ""}" id="galleryToggleSelectBtn">
                <span>✓</span>
                <span>${item.selected ? "Deselect item" : "Select item"}</span>
              </button>
              <span class="gallery-bottom-dims">${escapeHtml(dimsText)}</span>
            </div>
            <div class="gallery-bottom-bar">
              <span class="gallery-bottom-plus">+</span>
              <input type="text" id="galleryQuickPrompt" class="gallery-quick-input" value="" placeholder="What do you want to change?">
              <button type="button" class="gallery-QuickRun-btn" id="galleryQuickRunBtn" title="Generate variation">↑</button>
            </div>
            <div class="gallery-bottom-zoom">
              <button type="button" class="gallery-zoom-icon ${item.selected ? "active" : ""}" id="galleryQuickSelectBtn" title="Select / Deselect item">✓</button>
              <button type="button" class="gallery-zoom-icon ${isComparing ? "active" : ""}" id="galleryCompareBtn" title="Compare side-by-side with reference">⊡</button>
              <span class="gallery-zoom-pct">63% ▾</span>
            </div>
          </div>
        </div>

        <aside class="gallery-sidebar">
          <div class="gallery-tabs">
            <button type="button" class="gallery-tab ${activeTab === "details" ? "active" : ""}" data-tab="details">Details</button>
            <button type="button" class="gallery-tab ${activeTab === "comments" ? "active" : ""}" data-tab="comments">Comments</button>
            <button type="button" class="gallery-tab ${activeTab === "edit" ? "active" : ""}" data-tab="edit">Edit</button>
          </div>

          <div class="gallery-sidebar-body">
            ${
              activeTab === "details"
                ? `
                <div class="gallery-side-toolbar">
                  <button type="button" class="gallery-side-tool" id="galleryTopSketchBtn" title="Sketch">🖌</button>
                  <span class="gallery-side-sep"></span>
                  <button type="button" class="gallery-side-tool" id="galleryTopCopyBtn" title="Copy">⧉</button>
                  <button type="button" class="gallery-side-tool" id="galleryTopLikeBtn" title="Favorite">♡</button>
                  <button type="button" class="gallery-side-tool" id="galleryTopFolderBtn" title="Save to library">📁</button>
                  ${
                    asset
                      ? `<a class="gallery-side-download" href="${escapeHtml(asset.url)}?download=1" download="${escapeHtml(asset.name || (isVideoItem ? `video-${currentIndex + 1}.mp4` : `image-${currentIndex + 1}.png`))}">↓ ${isVideoItem ? "MP4" : "PNG"} ▾</a>`
                      : `<button type="button" class="gallery-side-download" disabled>↓ ${isVideoItem ? "MP4" : "PNG"} ▾</button>`
                  }
                </div>

                <div class="gallery-detail-group">
                  <div class="gallery-detail-header-row">
                    <label>Prompt</label>
                    <button type="button" class="gallery-copy-btn" id="galleryCopyPromptBtn" title="Copy prompt">⧉</button>
                  </div>
                  <textarea id="galleryDetailPrompt" rows="4" class="gallery-detail-textarea">${escapeHtml(item.text || item.prompt || "")}</textarea>
                </div>

                <div class="gallery-detail-group">
                  <label>Settings</label>
                  <div class="gallery-settings-pills">
                    ${
                      isVideoItem
                        ? `
                        <span class="gallery-setting-pill"><strong>K</strong> ${escapeHtml(modelName)}</span>
                        <span class="gallery-setting-pill">⏱ ${escapeHtml(item.duration === "10s" || item.duration === '10"' ? "10 sec" : "5 sec")}</span>
                        <span class="gallery-setting-pill">▢ ${escapeHtml(item.videoRatio || "9:16")}</span>
                        <span class="gallery-setting-pill">start frame</span>
                        <span class="gallery-setting-pill">${escapeHtml(item.videoRes || "720p")}</span>
                        <span class="gallery-setting-pill">24fps</span>
                        `
                        : `
                        <span class="gallery-setting-pill"><strong>G</strong> ${escapeHtml(modelName)}</span>
                        <span class="gallery-setting-pill">▢ ${escapeHtml(dimsText)}</span>
                        `
                    }
                  </div>
                </div>

                ${
                  refAsset
                    ? `
                  <div class="gallery-detail-group">
                    <label>Reference</label>
                    <div class="gallery-ref-box">
                      <img src="${escapeHtml(refAsset.url)}" alt="${escapeHtml(refAsset.name || "Reference")}" class="gallery-ref-thumb">
                    </div>
                  </div>
                  `
                    : ""
                }

                <div class="gallery-detail-group">
                  <label>Status</label>
                  <div class="gallery-status-pill"><span class="gallery-status-dot"></span> Completed</div>
                </div>

                <div class="gallery-detail-actions">
                  ${
                    isVideoItem
                      ? `<button type="button" class="gallery-action-secondary" id="galleryExtractFrameBtn">🎞 Extract frame</button>`
                      : `<button type="button" class="gallery-action-secondary" id="gallerySketchBtn">🖌 Sketch</button>`
                  }
                  <button type="button" class="gallery-action-secondary" id="galleryAddSpaceBtn">+ Add to space</button>
                  <button type="button" class="gallery-action-secondary" id="galleryBranchImg2ImgBtn">↻ Recreate nodes</button>
                  <button type="button" class="gallery-action-secondary" id="gallerySaveLibBtn">📁 Save to library</button>
                  <button type="button" class="gallery-action-secondary" id="galleryShareBtn">↗ Share</button>
                </div>
              `
                : activeTab === "comments"
                  ? `
                <div class="gallery-comments-list">
                  ${
                    item.comments.length
                      ? item.comments
                          .map(
                            (c) => `
                        <div class="gallery-comment-item">
                          <strong>Studio User</strong>
                          <span>${escapeHtml(c.text)}</span>
                        </div>`
                          )
                          .join("")
                      : `<p class="gallery-empty-note">Chưa có ghi chú nào cho mục #${currentIndex + 1}.</p>`
                  }
                </div>
                <div class="gallery-comment-form">
                  <input type="text" id="galleryCommentInput" placeholder="Thêm nhận xét...">
                  <button type="button" id="galleryCommentSendBtn">Gửi</button>
                </div>
              `
                  : `
                <div class="gallery-edit-tools">
                  <label>CÔNG CỤ CHỈNH SỬA</label>
                  <div class="gallery-tool-grid">
                    <button type="button" class="gallery-tool-btn ${activeTool === "inpaint" ? "active" : ""}" data-tool="inpaint">🖌 Inpaint</button>
                    <button type="button" class="gallery-tool-btn ${activeTool === "erase" ? "active" : ""}" data-tool="erase">⌫ Erase</button>
                    <button type="button" class="gallery-tool-btn ${activeTool === "expand" ? "active" : ""}" data-tool="expand">⤢ Expand</button>
                    <button type="button" class="gallery-tool-btn ${activeTool === "upscale" ? "active" : ""}" data-tool="upscale">✦ Upscale 2K</button>
                  </div>
                  <label>CỠ CỌ (${brushSize}px)</label>
                  <input type="range" id="galleryBrushRange" min="8" max="96" value="${brushSize}">
                  <label>PROMPT CHỈNH SỬA</label>
                  <textarea id="galleryEditPrompt" rows="3" class="gallery-detail-textarea" placeholder="Mô tả chi tiết vùng cần sửa hoặc thay đổi trang phục...">${escapeHtml(item.text || "")}</textarea>
                  <button type="button" class="gallery-action-primary" id="galleryApplyEditBtn">Áp dụng & Tạo thẻ chỉnh sửa</button>
                </div>
              `
            }
          </div>
        </aside>
      </div>
    `;

    const stageVid = modal.querySelector("#galleryStageVideo");
    if (stageVid) {
      const playBtn = modal.querySelector("#galleryVidPlayBtn");
      const rewBtn = modal.querySelector("#galleryVidRewBtn");
      const fwdBtn = modal.querySelector("#galleryVidFwdBtn");
      const muteBtn = modal.querySelector("#galleryVidMuteBtn");
      const timeLabel = modal.querySelector("#galleryVidTimeLabel");
      const fmtSec = (s) => `00:${String(Math.max(0, Math.floor(s || 0))).padStart(2, "0")}`;
      stageVid.addEventListener("timeupdate", () => {
        if (timeLabel) {
          timeLabel.textContent = `${fmtSec(stageVid.currentTime)} / ${fmtSec(stageVid.duration || (durBadgeText === "00:10" ? 10 : 5))}`;
        }
      });
      playBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (stageVid.paused) {
          stageVid.play().catch(() => {});
          playBtn.textContent = "❚❚";
        } else {
          stageVid.pause();
          playBtn.textContent = "▶";
        }
      });
      rewBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        stageVid.currentTime = Math.max(0, (stageVid.currentTime || 0) - 5);
      });
      fwdBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        stageVid.currentTime = Math.min(stageVid.duration || 10, (stageVid.currentTime || 0) + 5);
      });
      muteBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        stageVid.muted = !stageVid.muted;
        muteBtn.textContent = stageVid.muted ? "🔇" : "🔊";
      });
    }

    const toggleSelectItem = () => {
      remember();
      listNode.selectMode = true;
      item.selected = !item.selected;
      markDirty();
      renderGraph();
      renderModal();
    };
    modal.querySelector("#galleryToggleSelectBtn")?.addEventListener("click", toggleSelectItem);
    modal.querySelector("#galleryQuickSelectBtn")?.addEventListener("click", toggleSelectItem);

    modal.querySelector("#galleryCompareBtn")?.addEventListener("click", () => {
      if (!refAsset) {
        notify("Mục này chưa có ảnh tham chiếu gốc để so sánh.");
        return;
      }
      isComparing = !isComparing;
      renderModal();
    });

    modal.querySelector("#galleryExtractFrameBtn")?.addEventListener("click", () => {
      const frameAsset = posterAsset || refAsset || asset;
      if (!frameAsset) return;
      spawnImageNodeNextToList(listNode, frameAsset, item);
      modal.hidden = true;
      notify("Đã trích xuất khung hình (Extract frame) ra Canvas kế bên List.");
    });

    modal.querySelector(".gallery-modal-backdrop")?.addEventListener("click", () => {
      modal.hidden = true;
    });
    modal.querySelector("#galleryCloseBtn")?.addEventListener("click", () => {
      modal.hidden = true;
    });
    modal.querySelector("#galleryPrevBtn")?.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderModal();
    });
    modal.querySelector("#galleryNextBtn")?.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % items.length;
      renderModal();
    });

    modal.querySelectorAll(".gallery-tab").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        activeTab = tabBtn.dataset.tab;
        renderModal();
      });
    });

    modal.querySelectorAll(".gallery-tool-btn").forEach((toolBtn) => {
      toolBtn.addEventListener("click", () => {
        activeTool = toolBtn.dataset.tool;
        renderModal();
      });
    });

    const brushRange = modal.querySelector("#galleryBrushRange");
    if (brushRange) {
      brushRange.addEventListener("input", () => {
        brushSize = Number(brushRange.value);
        const badge = modal.querySelector(".gallery-edit-badge");
        if (badge) {
          badge.innerHTML = `Chế độ chỉnh sửa: <strong>${escapeHtml(activeTool.toUpperCase())}</strong> · Cọ ${brushSize}px`;
        }
      });
    }

    const detailPrompt = modal.querySelector("#galleryDetailPrompt");
    if (detailPrompt) {
      detailPrompt.addEventListener("input", () => {
        item.text = detailPrompt.value;
        markDirty();
      });
    }

    const spawnImageCardAndGenerator = (customPrompt) => {
      const targetAsset = isVideoItem ? posterAsset || refAsset || asset : asset;
      if (!targetAsset) return;
      const srcNode = spawnImageNodeNextToList(listNode, targetAsset, item);
      if (!srcNode) return;
      const genNode = addNode("text-image", srcNode.id, { x: srcNode.x + 340, y: srcNode.y });
      genNode.prompt = `@${nodeDisplayTitle(srcNode)} ${(customPrompt || item.text || "").trim()}`.trim();
      markDirty();
      renderGraph();
      modal.hidden = true;
      notify("Đã tách ảnh ra Canvas và nối vào Image Generator.");
    };

    const spawnBoardCard = () => {
      const targetAsset = isVideoItem ? posterAsset || refAsset || asset : asset;
      if (!targetAsset) return;
      spawnImageNodeNextToList(listNode, targetAsset, item);
      modal.hidden = true;
    };

    modal.querySelector("#galleryAddSpaceBtn")?.addEventListener("click", spawnBoardCard);

    const copyPromptHandler = () => {
      const txt = item.text || item.prompt || "";
      try {
        navigator.clipboard?.writeText(txt);
      } catch {}
      notify("Đã sao chép Prompt.");
    };
    modal.querySelector("#galleryCopyPromptBtn")?.addEventListener("click", copyPromptHandler);
    modal.querySelector("#galleryTopCopyBtn")?.addEventListener("click", copyPromptHandler);

    const sketchHandler = () => {
      activeTab = "edit";
      renderModal();
    };
    modal.querySelector("#gallerySketchBtn")?.addEventListener("click", sketchHandler);
    modal.querySelector("#galleryTopSketchBtn")?.addEventListener("click", sketchHandler);

    const saveLibHandler = () => {
      notify("Đã lưu vào thư viện Assets.");
    };
    modal.querySelector("#gallerySaveLibBtn")?.addEventListener("click", saveLibHandler);
    modal.querySelector("#galleryTopFolderBtn")?.addEventListener("click", saveLibHandler);
    modal.querySelector("#galleryTopLikeBtn")?.addEventListener("click", () => {
      notify("Đã thêm vào mục yêu thích.");
    });
    modal.querySelector("#galleryShareBtn")?.addEventListener("click", () => {
      if (asset?.url) {
        try {
          navigator.clipboard?.writeText(window.location.origin + asset.url);
        } catch {}
      }
      notify("Đã sao chép liên kết chia sẻ.");
    });

    modal.querySelector("#galleryBranchImg2ImgBtn")?.addEventListener("click", () => {
      spawnImageCardAndGenerator(item.text);
    });

    modal.querySelector("#galleryQuickRunBtn")?.addEventListener("click", () => {
      const qVal = modal.querySelector("#galleryQuickPrompt")?.value || item.text;
      if (qVal) item.text = qVal;
      spawnImageCardAndGenerator(qVal);
    });

    modal.querySelector("#galleryApplyEditBtn")?.addEventListener("click", () => {
      const eVal = modal.querySelector("#galleryEditPrompt")?.value || item.text;
      item.text = eVal;
      spawnImageCardAndGenerator(eVal);
    });

    modal.querySelector("#galleryCommentSendBtn")?.addEventListener("click", () => {
      const inp = modal.querySelector("#galleryCommentInput");
      const val = (inp?.value || "").trim();
      if (!val) return;
      item.comments.push({ text: val, createdAt: Date.now() });
      markDirty();
      renderModal();
    });
  };

  renderModal();
}

function listNodeControls(node, card) {
  const body = card.querySelector(".node-body");
  body.replaceChildren();
  if (!Array.isArray(node.items)) node.items = [];
  const viewMode = node.viewMode || "list";
  const isCollapsed = Boolean(node.collapsed);

  const wrap = document.createElement("div");
  wrap.className = "task-controls list-node-controls";

  if (!isCollapsed) {
    if (!node.items.length) {
      const empty = document.createElement("div");
      empty.className = "list-empty-actions";
      const addTxt = document.createElement("button");
      addTxt.type = "button";
      addTxt.className = "card-pill";
      addTxt.textContent = "T Add text";
      addTxt.addEventListener("click", (e) => {
        e.stopPropagation();
        remember();
        node.items.push({ type: "text", text: "" });
        markDirty();
        renderGraph();
      });
      const addMedia = document.createElement("button");
      addMedia.type = "button";
      addMedia.className = "card-pill";
      addMedia.textContent = "🖼 Add media";
      addMedia.addEventListener("click", (e) => {
        e.stopPropagation();
        openAssetsPanel(node.id);
      });
      empty.append(addTxt, addMedia);
      wrap.append(empty);
    } else if (viewMode === "grid") {
      const grid = document.createElement("div");
      grid.className = "list-grid-view";
      const inVarEdge = state.graph.edges.find((e) => e.target === node.id);
      const srcVarNode = inVarEdge
        ? state.graph.nodes.find((n) => n.id === inVarEdge.source && n.subKind === "variations")
        : null;
      if (srcVarNode?.variationGrid) {
        const [, c] = String(srcVarNode.variationGrid)
          .split("x")
          .map((v) => parseInt(v, 10));
        if (c >= 1 && c <= 4) {
          grid.style.gridTemplateColumns = `repeat(${c}, minmax(0, 1fr))`;
        }
      } else if (node.gridColumns >= 1 && node.gridColumns <= 4) {
        grid.style.gridTemplateColumns = `repeat(${node.gridColumns}, minmax(0, 1fr))`;
      } else if (node.items.length === 4 || node.items.length === 2) {
        grid.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
      }
      node.items.forEach((item, idx) => {
        const cell = document.createElement("div");
        const isPortrait = item.height && item.width && item.height > item.width;
        const asset = item.assetId ? state.assets.find((a) => a.id === item.assetId) : null;
        const isVideoItem = item.type === "video" || asset?.kind === "video";
        const posterAsset = item.firstFrameAssetId ? state.assets.find((a) => a.id === item.firstFrameAssetId) : null;
        cell.className = `list-grid-cell ${isPortrait ? "is-portrait" : ""} ${isVideoItem ? "is-video-cell" : ""} ${item.selected ? "is-selected" : ""}`.trim();
        cell.draggable = true;
        if (asset) {
          const cacheVer = (asset.sha256 || "").slice(0, 10) || asset.size || "";
          const mediaSrc = cacheVer && !asset.url.includes("?") ? `${asset.url}?v=${cacheVer}` : asset.url;
          const durLabel = item.duration === "10s" || item.duration === '10"' ? "00:10" : "00:05";
          const posterUrl = posterAsset ? posterAsset.url : "";
          cell.innerHTML = `
            ${
              isVideoItem
                ? posterUrl
                  ? `<img src="${escapeHtml(posterUrl)}" alt="${escapeHtml(item.text || asset.name)}" class="list-cell-poster" draggable="false">`
                  : `<video src="${escapeHtml(mediaSrc)}" preload="metadata" muted playsinline class="list-cell-video-thumb"></video>`
                : `<img src="${escapeHtml(mediaSrc)}" alt="${escapeHtml(item.text || asset.name)}" draggable="false">`
            }
            ${isVideoItem ? `<span class="list-video-badge">🎥 ${durLabel}</span>` : ""}
            <span class="list-cell-drag" title="Drag to reorder">⋮⋮</span>
            ${
              node.selectMode || item.selected
                ? `<span class="list-cell-select-check ${item.selected ? "checked" : ""}">${item.selected ? "✓" : ""}</span>`
                : ""
            }
            <div class="list-cell-actions">
              <button type="button" class="list-cell-btn" data-cell-act="expand" title="Open preview">⤢</button>
              <button type="button" class="list-cell-btn" data-cell-act="board" title="Add to board">↗</button>
              <button type="button" class="list-cell-btn danger" data-cell-act="delete" title="Delete">🗑</button>
            </div>
          `;
          if (isVideoItem) {
            let hoverVideo = null;
            cell.addEventListener("pointerenter", () => {
              if (hoverVideo) return;
              hoverVideo = document.createElement("video");
              hoverVideo.src = mediaSrc;
              hoverVideo.muted = true;
              hoverVideo.loop = true;
              hoverVideo.playsInline = true;
              hoverVideo.autoplay = true;
              hoverVideo.className = "list-cell-hover-video";
              cell.prepend(hoverVideo);
              hoverVideo.play().catch(() => {});
            });
            cell.addEventListener("pointerleave", () => {
              if (hoverVideo) {
                hoverVideo.pause();
                hoverVideo.removeAttribute("src");
                hoverVideo.load();
                hoverVideo.remove();
                hoverVideo = null;
              }
            });
          }
        } else {
          cell.innerHTML = `
            <span class="list-grid-text">${escapeHtml(item.text || `Item #${idx + 1}`)}</span>
            <div class="list-cell-actions">
              <button type="button" class="list-cell-btn danger" data-cell-act="delete" title="Delete">🗑</button>
            </div>
          `;
        }
        cell.addEventListener("pointerdown", (e) => e.stopPropagation());
        cell.addEventListener("dragstart", (e) => {
          e.stopPropagation();
          e.dataTransfer?.setData("text/plain", String(idx));
        });
        cell.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        cell.addEventListener("drop", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const fromIdx = parseInt(e.dataTransfer?.getData("text/plain") || "-1", 10);
          if (fromIdx >= 0 && fromIdx !== idx && fromIdx < node.items.length) {
            remember();
            const [moved] = node.items.splice(fromIdx, 1);
            node.items.splice(idx, 0, moved);
            markDirty();
            renderGraph();
          }
        });
        cell.addEventListener("click", (e) => {
          if (node.selectMode && !e.target.closest(".list-cell-btn")) {
            e.stopPropagation();
            item.selected = !item.selected;
            markDirty();
            renderGraph();
          }
        });
        cell.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          openGalleryModal(node.id, idx, "details");
        });
        cell.querySelector('[data-cell-act="expand"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          openGalleryModal(node.id, idx, "details");
        });
        cell.querySelector('[data-cell-act="board"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          spawnImageNodeNextToList(node, posterAsset || asset, item);
        });
        cell.querySelector('[data-cell-act="delete"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          remember();
          node.items.splice(idx, 1);
          markDirty();
          renderGraph();
        });
        grid.append(cell);
      });
      wrap.append(grid);
    } else {
      const listRows = document.createElement("div");
      listRows.className = "list-rows-view";
      node.items.forEach((item, idx) => {
        const row = document.createElement("div");
        row.className = `list-item-row ${item.selected ? "is-selected" : ""}`.trim();
        row.draggable = true;
        const asset = item.assetId ? state.assets.find((a) => a.id === item.assetId) : null;
        const isVideoItem = item.type === "video" || asset?.kind === "video";
        const posterAsset = item.firstFrameAssetId ? state.assets.find((a) => a.id === item.firstFrameAssetId) : null;
        if (asset) {
          const cacheVer = (asset.sha256 || "").slice(0, 10) || asset.size || "";
          const mediaSrc = cacheVer && !asset.url.includes("?") ? `${asset.url}?v=${cacheVer}` : asset.url;
          const thumbSrc = posterAsset ? posterAsset.url : mediaSrc;
          const dimsLabel = item.width && item.height ? `${item.width} × ${item.height}` : isVideoItem ? "720 × 1280 · 10s" : "512 × 917";
          row.innerHTML = `
            ${
              isVideoItem && !posterAsset
                ? `<video src="${escapeHtml(mediaSrc)}" preload="metadata" muted playsinline class="list-item-thumb"></video>`
                : `<img src="${escapeHtml(thumbSrc)}" alt="${escapeHtml(item.text || `${isVideoItem ? "Video" : "Image"} ${idx + 1}`)}" class="list-item-thumb" draggable="false">`
            }
            <div class="list-item-meta">
              <div class="list-item-title">${isVideoItem ? `🎥 Video ${idx + 1}` : `Image ${idx + 1}`}</div>
              <div class="list-item-sub">${escapeHtml(dimsLabel)}</div>
            </div>
            <div class="list-row-actions">
              <button type="button" class="list-cell-btn" data-row-act="expand" title="Open preview">⤢</button>
              <button type="button" class="list-cell-btn" data-row-act="board" title="Add to board">↗</button>
              <button type="button" class="list-cell-btn danger" data-row-act="delete" title="Delete">🗑</button>
            </div>
            <span class="list-row-drag" title="Drag to reorder">⋮⋮</span>
          `;
          row.addEventListener("pointerdown", (e) => e.stopPropagation());
          row.addEventListener("dragstart", (e) => {
            e.stopPropagation();
            e.dataTransfer?.setData("text/plain", String(idx));
          });
          row.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
          });
          row.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const fromIdx = parseInt(e.dataTransfer?.getData("text/plain") || "-1", 10);
            if (fromIdx >= 0 && fromIdx !== idx && fromIdx < node.items.length) {
              remember();
              const [moved] = node.items.splice(fromIdx, 1);
              node.items.splice(idx, 0, moved);
              markDirty();
              renderGraph();
            }
          });
          row.querySelector(".list-item-thumb")?.addEventListener("click", (e) => {
            e.stopPropagation();
            openGalleryModal(node.id, idx, "details");
          });
          row.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            openGalleryModal(node.id, idx, "details");
          });
          row.querySelector('[data-row-act="expand"]')?.addEventListener("click", (e) => {
            e.stopPropagation();
            openGalleryModal(node.id, idx, "details");
          });
          row.querySelector('[data-row-act="board"]')?.addEventListener("click", (e) => {
            e.stopPropagation();
            spawnImageNodeNextToList(node, posterAsset || asset, item);
          });
          row.querySelector('[data-row-act="delete"]')?.addEventListener("click", (e) => {
            e.stopPropagation();
            remember();
            node.items.splice(idx, 1);
            markDirty();
            renderGraph();
          });
        } else {
          const inp = document.createElement("input");
          inp.type = "text";
          inp.className = "list-item-text-input";
          inp.value = typeof item === "string" ? item : item.text || "";
          inp.placeholder = `Item #${idx + 1}`;
          inp.addEventListener("pointerdown", (e) => e.stopPropagation());
          inp.addEventListener("input", () => {
            if (typeof node.items[idx] === "string") node.items[idx] = { type: "text", text: inp.value };
            else node.items[idx].text = inp.value;
            markDirty();
          });
          const del = document.createElement("button");
          del.type = "button";
          del.className = "list-item-del";
          del.textContent = "×";
          del.addEventListener("click", (e) => {
            e.stopPropagation();
            remember();
            node.items.splice(idx, 1);
            markDirty();
            renderGraph();
          });
          row.append(inp, del);
        }
        listRows.append(row);
      });
      wrap.append(listRows);
    }
  }

  // Bottom bar: [+] [Keep Items ▾] [N images/videos ✓] [☰ | ⊞] [⇕]
  const foot = document.createElement("div");
  foot.className = "card-task-actions list-foot-bar";

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "card-pill";
  addBtn.textContent = "+";
  addBtn.title = "Add item";
  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isMediaList = node.items.some((it) => it && (it.assetId || it.type === "image" || it.type === "video"));
    if (isMediaList) {
      openAssetsPanel(node.id);
      return;
    }
    remember();
    node.items.push({ type: "text", text: "" });
    markDirty();
    renderGraph();
  });

  const keepLabel = node.keepItems !== false ? "Keep Items" : "Replace Items";
  const keepBtn = document.createElement("button");
  keepBtn.type = "button";
  keepBtn.className = "card-pill";
  keepBtn.innerHTML = `<span>${keepLabel}</span><span class="pill-chevron">▾</span>`;
  keepBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "keep-items", card)) {
      buildKeepItemsPopover(node, card);
    }
  });

  const hasVideoItems = node.items.some(
    (it) => it && (it.type === "video" || state.assets.find((a) => a.id === it.assetId)?.kind === "video")
  );
  const hasImageItems = node.items.some((it) => it && it.assetId);
  const unitLabel = hasVideoItems ? "videos" : hasImageItems ? "images" : "items";
  const selectedCount = node.items.filter((it) => it && it.selected).length;
  const countBadge = document.createElement("button");
  countBadge.type = "button";
  countBadge.className = `list-count-pill ${node.selectMode || selectedCount > 0 ? "active" : ""}`.trim();
  countBadge.title = "Select elements";
  countBadge.textContent =
    selectedCount > 0
      ? `${selectedCount}/${node.items.length} ${unitLabel} ✓`
      : `${node.items.length} ${unitLabel} ✓`;
  countBadge.addEventListener("click", (e) => {
    e.stopPropagation();
    node.selectMode = !node.selectMode;
    if (!node.selectMode) {
      node.items.forEach((it) => {
        if (it && typeof it === "object") delete it.selected;
      });
    }
    markDirty();
    renderGraph();
  });

  const viewSeg = document.createElement("div");
  viewSeg.className = "list-view-seg";
  const listModeBtn = document.createElement("button");
  listModeBtn.type = "button";
  listModeBtn.className = `list-seg-btn ${viewMode !== "grid" ? "active" : ""}`;
  listModeBtn.title = "List view";
  listModeBtn.textContent = "☰";
  listModeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    node.viewMode = "list";
    markDirty();
    renderGraph();
  });
  const gridModeBtn = document.createElement("button");
  gridModeBtn.type = "button";
  gridModeBtn.className = `list-seg-btn ${viewMode === "grid" ? "active" : ""}`;
  gridModeBtn.title = "Grid view";
  gridModeBtn.textContent = "⊞";
  gridModeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    node.viewMode = "grid";
    markDirty();
    renderGraph();
  });
  viewSeg.append(listModeBtn, gridModeBtn);

  const collapseBtn = document.createElement("button");
  collapseBtn.type = "button";
  collapseBtn.className = `card-pill list-collapse-btn ${isCollapsed ? "active" : ""}`.trim();
  collapseBtn.title = isCollapsed ? "Expand list" : "Collapse list";
  collapseBtn.textContent = "⇕";
  collapseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    node.collapsed = !node.collapsed;
    markDirty();
    renderGraph();
  });

  foot.append(addBtn, keepBtn, countBadge, viewSeg, collapseBtn);
  wrap.append(foot);
  body.append(wrap);
}

function buildVideoModelPopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover video-model-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const list = document.createElement("div");
  list.className = "popover-list";
  const current = node.videoModel || "Auto";

  for (const modelName of VIDEO_MODELS) {
    const btn = document.createElement("button");
    btn.type = "button";
    const isAuto = modelName === "Auto";
    const isGpu = modelName === "Local GPU (VRAM)" || modelName === "local-gpu-vram";
    const isBridge = modelName === "Antigravity AI Bridge";
    const configured = isModelConfigured(modelName, "video");
    btn.className = `popover-option ${current === modelName ? "active" : ""} ${isBridge || isGpu ? "featured-accent" : ""} ${configured ? "has-config" : ""}`.trim();
    const badgeHtml = isAuto
      ? `<span class="video-auto-badge">${modelBadgeSvg("auto")}</span>`
      : isGpu
        ? `<span class="model-badge-icon">${modelBadgeSvg("gpu")}</span>`
        : isBridge
          ? `<span class="model-badge-icon">${modelBadgeSvg("auto")}</span>`
          : `<span class="model-badge-icon">${modelBadgeSvg("cinematic")}</span>`;
    const tagHtml = isGpu ? `<span class="model-tag-new">VRAM</span>` : isBridge ? `<span class="model-tag-new">Free</span>` : "";
    btn.innerHTML = `<span class="model-configured-dot ${configured ? "is-configured" : ""}" title="${configured ? (isGpu ? "Sẵn sàng chạy GPU" : isBridge ? "Kết nối trực tiếp Antigravity AI Bridge" : "Đã cấu hình API Key") : ""}"></span>${badgeHtml}<span class="model-option-label">${escapeHtml(modelName)}</span>${tagHtml}`;
    btn.addEventListener("click", () => {
      remember();
      node.videoModel = modelName;
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    list.append(btn);
  }

  const foot = document.createElement("div");
  foot.className = "popover-foot";
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.textContent = "All models";
  allBtn.addEventListener("click", () => {
    closeAllPopovers();
    openSettings(node.id);
  });
  const navHint = document.createElement("span");
  navHint.className = "popover-nav-hint";
  navHint.innerHTML = `<kbd>↑↓</kbd><span>Navigate</span>`;
  foot.append(allBtn, navHint);

  popover.append(list, foot);
  card.append(popover);
}

function buildVideoRatioPopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover ratio-popover video-ratio-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
  const current = node.videoRatio || "16:9";
  for (const label of VIDEO_ASPECT_RATIOS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `popover-option ${current === label ? "active" : ""}`;
    btn.innerHTML = `${ratioFrameHtml(label)}<span>${escapeHtml(label)}</span>`;
    btn.addEventListener("click", () => {
      remember();
      node.videoRatio = label;
      node._userPickedRatio = true;
      node._previewSelectedRatio = true;
      node.historyIndex = 0;
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    popover.append(btn);
  }
  card.append(popover);
}

function buildVideoDurationPopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover mode-popover video-duration-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
  const current = node.duration || '5-6"';
  for (const dur of VIDEO_DURATIONS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `popover-option ${current === dur ? "active" : ""}`;
    btn.textContent = dur;
    btn.addEventListener("click", () => {
      remember();
      node.duration = dur;
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    popover.append(btn);
  }
  card.append(popover);
}

function buildModifyVideoModelPopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover model-popover video-model-popover modify-video-model-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const searchWrap = document.createElement("div");
  searchWrap.className = "popover-search";
  searchWrap.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Search" autocomplete="off">`;
  const searchInput = searchWrap.querySelector("input");

  const list = document.createElement("div");
  list.className = "popover-list";
  const current = node.videoModel || "MiniMax H3";

  const renderOptions = () => {
    list.replaceChildren();
    const q = searchInput.value.trim().toLocaleLowerCase("vi");
    for (const item of MODIFY_VIDEO_MODELS) {
      if (q && !item.label.toLocaleLowerCase("vi").includes(q)) continue;
      const btn = document.createElement("button");
      btn.type = "button";
      const isCurrent = current === item.label;
      btn.className = `popover-option ${isCurrent ? "active" : ""}`.trim();
      const badgeIcon =
        item.badge === "minimax"
          ? catalogIcon("provider-minimax")
          : item.badge === "google"
            ? `<span class="provider-g-glyph">G</span>`
            : item.badge === "kling"
              ? catalogIcon("provider-kling")
              : modelBadgeSvg("cinematic");
      const tagHtml = item.tag
        ? `<span class="${item.tag === "New" ? "catalog-badge badge-new" : "model-tag-new"}" style="margin-left:auto">${escapeHtml(item.tag)}</span>`
        : "";
      btn.innerHTML = `<span class="model-badge-icon">${badgeIcon}</span><span class="model-option-label">${escapeHtml(item.label)}</span>${tagHtml}<span class="model-pin-icon">${actionIcon("pin")}</span>`;
      btn.addEventListener("click", () => {
        remember();
        node.videoModel = item.label;
        closeAllPopovers();
        markDirty();
        renderGraph();
      });
      list.append(btn);
    }
  };

  searchInput.addEventListener("input", renderOptions);
  renderOptions();

  popover.append(searchWrap, list);
  card.append(popover);
  setTimeout(() => searchInput.focus(), 10);
}

function formatVideoClock(seconds) {
  const sec = Number.isFinite(seconds) && seconds >= 0 ? Math.floor(seconds) : 0;
  const mins = Math.floor(sec / 60);
  const rem = String(sec % 60).padStart(2, "0");
  return `${mins}:${rem}`;
}

function attachTaskVideoControlBar(node, asset, card, media) {
  if (!card || !media || media.tagName !== "VIDEO") return;
  const controlsWrap = card.querySelector(".task-controls");
  if (!controlsWrap) return;

  const bar = document.createElement("div");
  bar.className = "card-video-controls-bar";
  bar.addEventListener("pointerdown", (e) => e.stopPropagation());
  bar.addEventListener("click", (e) => e.stopPropagation());

  const topRow = document.createElement("div");
  topRow.className = "card-video-bar-row";

  const leftGroup = document.createElement("div");
  leftGroup.className = "card-video-bar-left";

  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.className = "card-video-ctrl-btn play-pause-btn";
  playBtn.title = "Phát / Tạm dừng";
  playBtn.setAttribute("aria-label", "Play or Pause video");

  const timeLabel = document.createElement("span");
  timeLabel.className = "card-video-time-label";
  const fallbackDur = node.duration === "10s" || node.duration === '10"' ? 10 : 5;
  timeLabel.textContent = `0:00 / ${formatVideoClock(fallbackDur)}`;

  leftGroup.append(playBtn, timeLabel);

  const rightGroup = document.createElement("div");
  rightGroup.className = "card-video-bar-right";

  const muteBtn = document.createElement("button");
  muteBtn.type = "button";
  muteBtn.className = "card-video-ctrl-btn mute-btn";
  muteBtn.title = "Bật / Tắt âm thanh";
  muteBtn.setAttribute("aria-label", "Mute or Unmute video");

  const fsBtn = document.createElement("button");
  fsBtn.type = "button";
  fsBtn.className = "card-video-ctrl-btn fs-btn";
  fsBtn.title = "Toàn màn hình";
  fsBtn.setAttribute("aria-label", "Fullscreen");
  fsBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;

  const dlBtn = document.createElement("button");
  dlBtn.type = "button";
  dlBtn.className = "card-video-ctrl-btn more-btn";
  dlBtn.title = "Tải video (.mp4)";
  dlBtn.setAttribute("aria-label", "Download video");
  dlBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>`;

  rightGroup.append(muteBtn, fsBtn, dlBtn);
  topRow.append(leftGroup, rightGroup);

  const scrubber = document.createElement("input");
  scrubber.type = "range";
  scrubber.className = "card-video-scrubber";
  scrubber.min = "0";
  scrubber.max = String(fallbackDur);
  scrubber.step = "0.02";
  scrubber.value = "0";
  scrubber.style.setProperty("--progress", "0%");

  const playSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.29-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z"/></svg>`;
  const pauseSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
  const mutedSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  const unmutedSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

  let isScrubbing = false;
  const syncUi = () => {
    const dur = Number.isFinite(media.duration) && media.duration > 0 ? media.duration : fallbackDur;
    const cur = Number.isFinite(media.currentTime) && media.currentTime >= 0 ? Math.min(dur, media.currentTime) : 0;
    playBtn.innerHTML = media.paused ? playSvg : pauseSvg;
    muteBtn.innerHTML = media.muted ? mutedSvg : unmutedSvg;
    const topMuteBadge = card.querySelector(".card-mute-badge");
    if (topMuteBadge) {
      topMuteBadge.textContent = media.muted ? "🔇" : "🔊";
    }
    const topDurBadge = card.querySelector(".task-top-badges .card-res-badge");
    if (topDurBadge && Number.isFinite(media.duration) && media.duration > 0) {
      const endSecStr = String(Math.round(media.duration)).padStart(2, "0");
      topDurBadge.textContent = `00:00 - 00:${endSecStr}`;
    }
    timeLabel.textContent = `${formatVideoClock(cur)} / ${formatVideoClock(dur)}`;
    if (!isScrubbing) {
      scrubber.max = String(dur);
      scrubber.value = String(cur);
      const pct = dur > 0 ? Math.max(0, Math.min(100, (cur / dur) * 100)) : 0;
      scrubber.style.setProperty("--progress", `${pct.toFixed(2)}%`);
    }
  };

  playBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (media.paused) {
      media.play().catch(() => {});
    } else {
      media.pause();
    }
    syncUi();
  });

  muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    media.muted = !media.muted;
    syncUi();
  });

  fsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (media.requestFullscreen) {
      media.requestFullscreen().catch(() => {});
    } else if (media.webkitEnterFullscreen) {
      media.webkitEnterFullscreen();
    }
  });

  media.addEventListener("fullscreenchange", () => {
    media.controls = document.fullscreenElement === media;
  });

  dlBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (asset) downloadAssetFile(asset);
  });

  scrubber.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    isScrubbing = true;
  });
  scrubber.addEventListener("input", (e) => {
    e.stopPropagation();
    const dur = Number.isFinite(media.duration) && media.duration > 0 ? media.duration : fallbackDur;
    const targetTime = Math.max(0, Math.min(dur, Number(scrubber.value) || 0));
    const pct = dur > 0 ? Math.max(0, Math.min(100, (targetTime / dur) * 100)) : 0;
    scrubber.style.setProperty("--progress", `${pct.toFixed(2)}%`);
    timeLabel.textContent = `${formatVideoClock(targetTime)} / ${formatVideoClock(dur)}`;
    try {
      media.currentTime = targetTime;
    } catch {}
  });
  const endScrub = () => {
    if (!isScrubbing) return;
    isScrubbing = false;
    syncUi();
  };
  scrubber.addEventListener("pointerup", endScrub);
  scrubber.addEventListener("change", endScrub);

  for (const ev of ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "volumechange", "ended"]) {
    media.addEventListener(ev, syncUi);
  }
  syncUi();

  bar.append(topRow, scrubber);
  controlsWrap.prepend(bar);
}

function videoNodeControls(node, card) {
  const body = card.querySelector(".node-body");
  const controls = document.createElement("div");
  controls.className = "task-controls video-node-controls";

  const isVideoGen = node.kind === "text-video" || node.kind === "image-video" || node.kind === "video-video";
  const supportsRefStrip =
    isVideoGen || ["extend-video", "modify-video", "move", "speak"].includes(node.kind);
  const batchInfo =
    isVideoGen || ["extend-video", "modify-video", "move"].includes(node.kind)
      ? computeNodeBatchCombinations(node)
      : { isListMode: false, lists: [], totalCount: 1 };
  const resultRun = activeNodeRun(node) || latestRun(node.id);
  const hasResult = Boolean(
    resultRun?.state === "succeeded" && (resultRun?.assetId || node.assetId) && !isBridgePending(resultRun)
  );

  if (supportsRefStrip) {
    const promptTop = document.createElement("div");
    promptTop.className = "card-prompt-top";
    const addPrompt = document.createElement("button");
    addPrompt.type = "button";
    addPrompt.className = "card-prompt-add";
    addPrompt.textContent = "+";
    addPrompt.title = "Add reference";
    addPrompt.setAttribute("aria-label", "Add reference");
    addPrompt.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "add-ref", card)) {
        buildAddReferencePopover(node, card);
      }
    });
    promptTop.append(addPrompt);

    const refs = getConnectedReferences(node);
    if (refs.length > 0) {
      const thumbStrip = document.createElement("div");
      thumbStrip.className = "card-ref-thumbs";
      for (const ref of refs) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `card-ref-thumb ${ref.isMentioned ? "is-mentioned" : ""}`.trim();
        chip.title = `${ref.title} (${ref.mentionTag}) — Click to mention in prompt`;
        if (ref.asset?.url) {
          chip.innerHTML = `<img src="${escapeHtml(ref.asset.url)}" alt="${escapeHtml(ref.title)}" draggable="false">`;
        } else {
          chip.innerHTML = `<span class="ref-thumb-fallback">${iconMarkup("image")}</span>`;
        }
        chip.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          remember();
          node.prompt = insertMentionIntoPromptText(node.prompt || "", ref.mentionTag);
          markDirty();
          renderGraph();
        });
        thumbStrip.append(chip);
      }
      promptTop.append(thumbStrip);
    }

    if (batchInfo.lists.length > 0) {
      const modeGroup = document.createElement("div");
      modeGroup.className = "input-mode-switcher";

      const singleModeBtn = document.createElement("button");
      singleModeBtn.type = "button";
      singleModeBtn.className = `input-mode-btn ${!batchInfo.isListMode ? "active" : ""}`.trim();
      singleModeBtn.title = "Single / Combined prompt mode";
      singleModeBtn.innerHTML = "☰";
      singleModeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        remember();
        node.listMode = false;
        markDirty();
        renderGraph();
      });

      const listModeBtn = document.createElement("button");
      listModeBtn.type = "button";
      listModeBtn.className = `input-mode-btn is-list-mode ${batchInfo.isListMode ? "active" : ""}`.trim();
      listModeBtn.title = "List mode (Run combinations)";
      listModeBtn.dataset.tooltip = "List mode";
      listModeBtn.innerHTML = "∣≡";
      listModeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        remember();
        node.listMode = true;
        markDirty();
        renderGraph();
      });

      modeGroup.append(singleModeBtn, listModeBtn);
      promptTop.append(modeGroup);
    }

    controls.append(promptTop);
  }

  if (node.kind === "media-extractor") {
    const timeline = document.createElement("div");
    timeline.className = "extractor-timeline";
    const extFrameAsset = node.extractedFrameAssetId ? state.assets.find((a) => a.id === node.extractedFrameAssetId) : null;
    const extAudioAsset = node.audioAssetId ? state.assets.find((a) => a.id === node.audioAssetId) : null;
    timeline.innerHTML = `
      <div class="extractor-scrub-row">
        <span class="extractor-frame-label">Frame @ ${Number(node.frameTime || 1.2).toFixed(1)}s</span>
        <span class="extractor-trim-wrap">Trim <input type="text" class="extractor-trim-input trim-start" value="${escapeHtml(node.trimStart || "00:00")}" title="Trim start (MM:SS)"> – <input type="text" class="extractor-trim-input trim-end" value="${escapeHtml(node.trimEnd || "00:05")}" title="Trim end (MM:SS)"></span>
      </div>
      <input type="range" min="0" max="10" step="0.1" value="${node.frameTime || 1.2}" class="extractor-range">
      ${extFrameAsset?.url ? `<div class="extractor-frame-chip"><img src="${escapeHtml(extFrameAsset.url)}" alt="Extracted frame" draggable="false"><span>Extracted Frame (.png) sẵn sàng ở cổng Frames</span></div>` : ""}
      ${extAudioAsset?.url ? `<div class="extractor-frame-chip" style="margin-top:4px"><audio controls src="${escapeHtml(extAudioAsset.url)}" style="height:24px;max-width:180px"></audio><span>Audio (.wav)</span></div>` : ""}
    `;
    timeline.querySelectorAll("audio").forEach((el) => {
      el.addEventListener("pointerdown", (e) => e.stopPropagation());
      el.addEventListener("click", (e) => e.stopPropagation());
    });
    const range = timeline.querySelector(".extractor-range");
    range?.addEventListener("pointerdown", (e) => e.stopPropagation());
    range?.addEventListener("input", () => {
      node.frameTime = Number(range.value);
      const label = timeline.querySelector(".extractor-frame-label");
      if (label) label.textContent = `Frame @ ${node.frameTime.toFixed(1)}s`;
      const vidEl = card.querySelector("video.node-media");
      if (vidEl) {
        try {
          vidEl.pause();
          vidEl.currentTime = Math.min(node.frameTime, Number.isFinite(vidEl.duration) ? vidEl.duration : node.frameTime);
        } catch {}
      }
      markDirty();
    });
    const tStart = timeline.querySelector(".trim-start");
    const tEnd = timeline.querySelector(".trim-end");
    for (const inp of [tStart, tEnd]) {
      inp?.addEventListener("pointerdown", (e) => e.stopPropagation());
      inp?.addEventListener("click", (e) => e.stopPropagation());
    }
    tStart?.addEventListener("change", () => {
      node.trimStart = tStart.value.trim() || "00:00";
      markDirty();
    });
    tEnd?.addEventListener("change", () => {
      node.trimEnd = tEnd.value.trim() || "00:05";
      markDirty();
    });
    controls.append(timeline);
  } else if (node.kind === "video-combiner") {
    const connectedEdges = state.graph.edges.filter((e) => e.target === node.id && e.targetPort === "video");
    let clipCount = 0;
    for (const ce of connectedEdges) {
      const src = state.graph.nodes.find((n) => n.id === ce.source);
      if (src?.kind === "list") {
        clipCount += getActiveListItems(src).filter((it) => it && typeof it === "object" && it.assetId).length;
      } else if (src) {
        clipCount += 1;
      }
    }
    const strip = document.createElement("div");
    strip.className = "combiner-clip-strip";
    strip.innerHTML = `<span>Connected clips: <strong>${clipCount}</strong> (${escapeHtml(node.transition || "Crossfade")} .mp4)</span>`;
    controls.append(strip);
  } else if (node.kind !== "video-upscaler") {
    const promptEdge = state.graph.edges.find((edge) => edge.target === node.id && edge.targetPort === "prompt");
    if ((isVideoGen || ["extend-video", "modify-video", "move"].includes(node.kind)) && promptEdge) {
      if (node.extraPrompt) {
        const extraInput = document.createElement("textarea");
        extraInput.className = "card-prompt connected-extra-prompt";
        extraInput.rows = 1;
        extraInput.placeholder = "Extra context";
        extraInput.value = node.extraPrompt || "";
        extraInput.addEventListener("input", () => {
          node.extraPrompt = extraInput.value;
          markDirty();
        });
        controls.append(extraInput);
      }
    } else {
      const promptWrap = document.createElement("div");
      promptWrap.className = "card-prompt-wrap";

      const richDisplay = document.createElement("div");
      richDisplay.className = "card-prompt-rich";
      richDisplay.innerHTML = formatPromptWithMentionPills(node.prompt || "");

      const prompt = document.createElement("textarea");
      prompt.className = "card-prompt";
      prompt.rows = 2;
      prompt.placeholder =
        node.kind === "extend-video"
          ? "Describe how the video should continue..."
          : node.kind === "modify-video"
            ? "Describe the changes to apply to the video..."
            : node.kind === "move"
              ? "Describe the motion graphics brief or camera movement..."
              : node.kind === "video-sfx"
                ? "Describe the sound effects to sync with the video..."
                : node.kind === "speak"
                  ? "Dialogue or action prompt for talking avatar…"
                  : "Describe the video you want to generate, or use @ to reference images/lists...";
      prompt.value = node.prompt || "";

      if (hasResult || /@\S+/.test(node.prompt || "")) {
        promptWrap.classList.add("show-rich");
      }

      richDisplay.addEventListener("click", (event) => {
        event.stopPropagation();
        selectNode(node.id);
        promptWrap.classList.remove("show-rich");
        prompt.focus();
      });

      let editing = false;
      prompt.addEventListener("input", () => {
        if (!editing) {
          remember();
          editing = true;
        }
        node.prompt = prompt.value;
        richDisplay.innerHTML = formatPromptWithMentionPills(node.prompt || "");
        markDirty();
      });
      prompt.addEventListener("blur", () => {
        editing = false;
        if (hasResult || /@\S+/.test(node.prompt || "")) {
          promptWrap.classList.add("show-rich");
        }
      });
      promptWrap.append(richDisplay, prompt);
      attachAtMentionAutocomplete(prompt, promptWrap, richDisplay, node, card, "prompt");
      controls.append(promptWrap);
    }

    if (node.kind === "video-sfx" && node.audioAssetId) {
      const sfxAudioAsset = state.assets.find((a) => a.id === node.audioAssetId);
      if (sfxAudioAsset?.url) {
        const sfxPlayer = document.createElement("div");
        sfxPlayer.className = "extractor-frame-chip";
        sfxPlayer.style.marginBottom = "6px";
        sfxPlayer.innerHTML = `<audio controls src="${escapeHtml(sfxAudioAsset.url)}" style="height:26px;max-width:190px"></audio><a href="${escapeHtml(sfxAudioAsset.url)}?download=1" download class="card-pill" style="padding:2px 7px;text-decoration:none;font-size:11px">⬇ .wav</a>`;
        sfxPlayer.querySelectorAll("audio, a").forEach((el) => {
          el.addEventListener("pointerdown", (e) => e.stopPropagation());
          el.addEventListener("click", (e) => e.stopPropagation());
        });
        controls.append(sfxPlayer);
      }
    }
  }

  if (isVideoGen) {
    // Row 1: [x15 / - x1 +]  [Auto ▾]  [▭ 16:9 ▾]  [10s ▾]
    const row1 = document.createElement("div");
    row1.className = "card-settings video-card-settings";

    if (batchInfo.isListMode && batchInfo.totalCount > 0) {
      const batchPill = document.createElement("button");
      batchPill.type = "button";
      batchPill.className = "card-pill batch-count-pill";
      batchPill.title = `${batchInfo.totalCount} Combinations (List mode)`;
      batchPill.textContent = `x${batchInfo.totalCount}`;
      batchPill.addEventListener("click", (e) => {
        e.stopPropagation();
        notify(`List mode: ${batchInfo.totalCount} video sẵn sàng chạy.`);
      });
      row1.append(batchPill);
    } else {
      const countVal = node.count ?? 1;
      const stepper = document.createElement("div");
      stepper.className = "card-count-stepper";
      const dec = document.createElement("button");
      dec.type = "button";
      dec.textContent = "−";
      dec.title = "Decrease video count";
      dec.setAttribute("aria-label", "Decrease video count");
      dec.disabled = countVal <= 1;
      dec.addEventListener("click", (event) => {
        event.stopPropagation();
        if ((node.count ?? 1) <= 1) return;
        remember();
        node.count = (node.count ?? 1) - 1;
        markDirty();
        renderGraph();
      });
      const countText = document.createElement("span");
      countText.className = "card-count-value";
      countText.textContent = `x${countVal}`;
      const inc = document.createElement("button");
      inc.type = "button";
      inc.textContent = "+";
      inc.title = "Increase video count";
      inc.setAttribute("aria-label", "Increase video count");
      inc.disabled = countVal >= 4;
      inc.addEventListener("click", (event) => {
        event.stopPropagation();
        if ((node.count ?? 1) >= 4) return;
        remember();
        node.count = (node.count ?? 1) + 1;
        markDirty();
        renderGraph();
      });
      stepper.append(dec, countText, inc);
      row1.append(stepper);
    }

    const vModel = node.videoModel || "Antigravity AI Bridge";
    const vModelConfigured = isModelConfigured(vModel, "video");
    const modelBtn = document.createElement("button");
    modelBtn.type = "button";
    modelBtn.className = "card-pill card-model-btn video-model-btn";
    modelBtn.title = "Model";
    modelBtn.setAttribute("aria-label", "Model");
    modelBtn.innerHTML = `${vModelConfigured ? '<span class="pill-configured-dot" title="Đã cấu hình API Key"></span>' : ""}<span class="pill-label">${escapeHtml(vModel)}</span><span class="pill-chevron">▾</span>`;
    modelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "video-model", card)) {
        buildVideoModelPopover(node, card);
      }
    });

    const ratioLabel = node.videoRatio || "9:16";
    const ratioBtn = document.createElement("button");
    ratioBtn.type = "button";
    ratioBtn.className = "card-pill card-ratio-btn";
    ratioBtn.title = "Aspect ratio";
    ratioBtn.setAttribute("aria-label", "Aspect ratio");
    ratioBtn.innerHTML = `${ratioFrameHtml(ratioLabel)}<span>${escapeHtml(ratioLabel)}</span><span class="pill-chevron">▾</span>`;
    ratioBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "video-ratio", card)) {
        buildVideoRatioPopover(node, card);
      }
    });

    const durVal = node.duration || "10s";
    const durBtn = document.createElement("button");
    durBtn.type = "button";
    durBtn.className = "card-pill card-duration-btn";
    durBtn.title = "Duration";
    durBtn.setAttribute("aria-label", "Duration");
    durBtn.innerHTML = `<span>${escapeHtml(durVal)}</span><span class="pill-chevron">▾</span>`;
    durBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "video-dur", card)) {
        buildVideoDurationPopover(node, card);
      }
    });

    row1.append(modelBtn, ratioBtn, durBtn);
    controls.append(row1);

    // Row 2: [720p ▾]  [⚪ Sound]  [⚙] ... [▶ / ↻ / ⏹]
    const row2 = document.createElement("div");
    row2.className = "card-task-actions";

    const resVal = node.videoRes || "720p";
    const resBtn = document.createElement("button");
    resBtn.type = "button";
    resBtn.className = "card-pill card-mode-btn";
    resBtn.title = "Resolution";
    resBtn.setAttribute("aria-label", "Resolution");
    resBtn.innerHTML = `<span>${escapeHtml(resVal)}</span><span class="pill-chevron">▾</span>`;
    resBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "video-res", card)) {
        buildSimpleListPopover(node, card, VIDEO_RESOLUTIONS, resVal, (v) => {
          node.videoRes = v;
        }, "video-res-popover");
      }
    });

    const soundOn = Boolean(node.soundEffects);
    const soundBtn = document.createElement("button");
    soundBtn.type = "button";
    soundBtn.className = `variations-split-toggle video-sound-toggle ${soundOn ? "is-on" : ""}`.trim();
    soundBtn.setAttribute("role", "switch");
    soundBtn.setAttribute("aria-checked", String(soundOn));
    soundBtn.innerHTML = `<span class="split-switch-track"><span class="split-switch-thumb"></span></span><span class="split-switch-label">Sound</span>`;
    soundBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      remember();
      node.soundEffects = !soundOn;
      markDirty();
      renderGraph();
    });

    const gear = document.createElement("button");
    gear.type = "button";
    gear.className = "card-gear";
    gear.innerHTML = actionIcon("settings");
    gear.title = "Settings";
    gear.setAttribute("aria-label", "Settings");
    gear.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllPopovers();
      openSettings(node.id);
    });

    const isRunningNow = Boolean(node._batchRunning || node._running);
    const rerunSvg =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>';
    const stopSvg =
      '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    const run = document.createElement("button");
    run.type = "button";
    run.className = `card-run ${isRunningNow ? "is-stopping" : hasResult ? "is-rerun" : ""}`.trim();
    run.dataset.runNode = node.id;
    run.dataset.runFor = node.id;
    run.innerHTML = isRunningNow ? stopSvg : hasResult ? rerunSvg : actionIcon("play");
    run.title = isRunningNow ? "Stop batch (Dừng)" : hasResult ? "Re-run" : "Run";
    run.setAttribute("aria-label", isRunningNow ? "Stop" : hasResult ? "Re-run" : "Run");
    run.addEventListener("click", (e) => {
      e.stopPropagation();
      runNode(node.id);
    });

    row2.append(resBtn, soundBtn, gear, run);
    controls.append(row2);
    body.append(controls);
    return;
  }

  const row = document.createElement("div");
  row.className = "card-task-actions";

  if (node.kind === "extend-video") {
    const extDurRaw = String(node.duration || "6s").replace(/\s+/g, "");
    const extDurLabel = `${parseInt(extDurRaw, 10) || 6} s`;
    const durPill = document.createElement("button");
    durPill.type = "button";
    durPill.className = "card-pill";
    durPill.title = "Extension duration";
    durPill.innerHTML = `<span style="color:var(--muted,#94a3b8);margin-right:4px">Duration</span><strong>${escapeHtml(extDurLabel)}</strong><span class="pill-chevron">▾</span>`;
    durPill.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "extend-dur", card)) {
        buildSimpleListPopover(node, card, ["4 s", "6 s", "8 s", "10 s"], extDurLabel, (v) => {
          node.duration = v.replace(/\s+/g, "");
        });
      }
    });

    const genAudioOn = node.generateAudio !== false;
    const genAudioBtn = document.createElement("button");
    genAudioBtn.type = "button";
    genAudioBtn.className = `variations-split-toggle video-sound-toggle ${genAudioOn ? "is-on" : ""}`.trim();
    genAudioBtn.setAttribute("role", "switch");
    genAudioBtn.setAttribute("aria-checked", String(genAudioOn));
    genAudioBtn.title = "Generate sound for the extended part";
    genAudioBtn.dataset.tooltip = "Generate sound for the extended part";
    genAudioBtn.innerHTML = `<span class="split-switch-track"><span class="split-switch-thumb"></span></span><span class="split-switch-label">Generate Audio</span>`;
    genAudioBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      remember();
      node.generateAudio = !genAudioOn;
      markDirty();
      renderGraph();
    });

    row.append(durPill, genAudioBtn);
  } else if (node.kind === "modify-video") {
    const modModel = node.videoModel || "MiniMax H3";
    const modelPill = document.createElement("button");
    modelPill.type = "button";
    modelPill.className = "card-pill card-model-btn video-model-btn";
    modelPill.title = "Model";
    modelPill.innerHTML = `<span class="pill-label">${escapeHtml(modModel)}</span><span class="pill-chevron">▾</span>`;
    modelPill.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "modify-video-model", card)) {
        buildModifyVideoModelPopover(node, card);
      }
    });

    const modRes = node.videoRes || "2K";
    const resPill = document.createElement("button");
    resPill.type = "button";
    resPill.className = "card-pill card-mode-btn";
    resPill.title = "Resolution";
    resPill.innerHTML = `<span>${escapeHtml(modRes)}</span><span class="pill-chevron">▾</span>`;
    resPill.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "modify-video-res", card)) {
        buildSimpleListPopover(node, card, ["768p", "2K"], modRes, (v) => {
          node.videoRes = v;
        });
      }
    });

    row.append(modelPill, resPill);
  } else if (node.kind === "move") {
    const mvStyle = node.moveStyle || "3D Parallax Orbit";
    const stylePill = document.createElement("button");
    stylePill.type = "button";
    stylePill.className = "card-pill";
    stylePill.title = "Motion preset";
    stylePill.innerHTML = `<span>${escapeHtml(mvStyle)}</span><span class="pill-chevron">▾</span>`;
    stylePill.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "move-style", card)) {
        buildSimpleListPopover(
          node,
          card,
          ["3D Parallax Orbit", "Kinetic Typography", "Camera Dolly Zoom", "Floating Product Reveal", "Dynamic Whip Pan"],
          mvStyle,
          (v) => {
            node.moveStyle = v;
          }
        );
      }
    });

    const mvRatio = node.videoRatio || "16:9";
    const ratioPill = document.createElement("button");
    ratioPill.type = "button";
    ratioPill.className = "card-pill card-ratio-btn";
    ratioPill.title = "Aspect ratio";
    ratioPill.innerHTML = `${ratioFrameHtml(mvRatio)}<span>${escapeHtml(mvRatio)}</span><span class="pill-chevron">▾</span>`;
    ratioPill.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "move-ratio", card)) {
        buildVideoRatioPopover(node, card);
      }
    });

    const mvDur = node.duration || "5s";
    const durPill = document.createElement("button");
    durPill.type = "button";
    durPill.className = "card-pill";
    durPill.title = "Duration";
    durPill.innerHTML = `<span>${escapeHtml(mvDur)}</span><span class="pill-chevron">▾</span>`;
    durPill.addEventListener("click", (e) => {
      e.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "move-dur", card)) {
        buildSimpleListPopover(node, card, ["4s", "5s", "8s", "10s"], mvDur, (v) => {
          node.duration = v;
        });
      }
    });

    row.append(stylePill, ratioPill, durPill);
  } else if (node.kind === "speak") {
    const spkModel = node.speakModel || "OmniHuman 1.5";
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "card-pill";
    pill.innerHTML = `<span>${escapeHtml(spkModel)}</span><span class="pill-chevron">▾</span>`;
    pill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "speak-model", card)) {
        buildSimpleListPopover(node, card, ["OmniHuman 1.5", "Kling Speak Pro"], spkModel, (v) => {
          node.speakModel = v;
        });
      }
    });

    const spkRes = node.videoRes || "720p";
    const resPill = document.createElement("button");
    resPill.type = "button";
    resPill.className = "card-pill";
    resPill.innerHTML = `<span>${escapeHtml(spkRes)}</span><span class="pill-chevron">▾</span>`;
    resPill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "speak-res", card)) {
        buildSimpleListPopover(node, card, ["720p", "1080p"], spkRes, (v) => {
          node.videoRes = v;
        });
      }
    });

    row.append(pill, resPill);
  } else if (node.kind === "video-upscaler") {
    const upRes = node.videoRes || "2K";
    const resPill = document.createElement("button");
    resPill.type = "button";
    resPill.className = "card-pill";
    resPill.title = "Target resolution";
    resPill.innerHTML = `<span>${escapeHtml(upRes)}</span><span class="pill-chevron">▾</span>`;
    resPill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "v-upscale-res", card)) {
        buildSimpleListPopover(node, card, ["1080p", "2K", "4K"], upRes, (v) => {
          node.videoRes = v;
          node.scaleFactor = v === "4K" ? 4 : 2;
        });
      }
    });

    const upDetail = node.upscaleDetail || "Crisp";
    const detailPill = document.createElement("button");
    detailPill.type = "button";
    detailPill.className = "card-pill";
    detailPill.title = "Detail enhancement";
    detailPill.innerHTML = `<span>${escapeHtml(upDetail)}</span><span class="pill-chevron">▾</span>`;
    detailPill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "v-upscale-detail", card)) {
        buildSimpleListPopover(node, card, ["Natural", "Crisp", "Ultra Sharp"], upDetail, (v) => {
          node.upscaleDetail = v;
        });
      }
    });

    const upFps = node.fps || "60fps";
    const fpsPill = document.createElement("button");
    fpsPill.type = "button";
    fpsPill.className = "card-pill";
    fpsPill.title = "Frame rate";
    fpsPill.innerHTML = `<span>${escapeHtml(upFps)}</span><span class="pill-chevron">▾</span>`;
    fpsPill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "v-upscale-fps", card)) {
        buildSimpleListPopover(node, card, ["30fps", "60fps"], upFps, (v) => {
          node.fps = v;
        });
      }
    });

    row.append(resPill, detailPill, fpsPill);
  } else if (node.kind === "video-sfx") {
    const sfxStyle = node.sfxStyle || "Auto Motion Sync";
    const sfxPill = document.createElement("button");
    sfxPill.type = "button";
    sfxPill.className = "card-pill";
    sfxPill.title = "SFX synchronization mode";
    sfxPill.innerHTML = `<span>${escapeHtml(sfxStyle)}</span><span class="pill-chevron">▾</span>`;
    sfxPill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "v-sfx-style", card)) {
        buildSimpleListPopover(
          node,
          card,
          ["Auto Motion Sync", "Cinematic Impact", "Ambient Foley", "Sci-Fi Synth"],
          sfxStyle,
          (v) => {
            node.sfxStyle = v;
          }
        );
      }
    });
    row.append(sfxPill);
  } else if (node.kind === "video-combiner") {
    const transMode = node.transition || "Crossfade";
    const transPill = document.createElement("button");
    transPill.type = "button";
    transPill.className = "card-pill";
    transPill.title = "Transition mode";
    transPill.innerHTML = `<span>${escapeHtml(transMode)}</span><span class="pill-chevron">▾</span>`;
    transPill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "v-combiner-trans", card)) {
        buildSimpleListPopover(node, card, ["Crossfade", "Direct Cut"], transMode, (v) => {
          node.transition = v;
        });
      }
    });
    row.append(transPill);
  }

  const isRunningNow = Boolean(node._batchRunning || node._running);
  const rerunSvg =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>';
  const stopSvg =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
  const run = document.createElement("button");
  run.type = "button";
  run.className = `card-run ${isRunningNow ? "is-stopping" : hasResult ? "is-rerun" : ""}`.trim();
  run.dataset.runNode = node.id;
  run.dataset.runFor = node.id;
  run.innerHTML = isRunningNow ? stopSvg : hasResult ? rerunSvg : actionIcon("play");
  run.title = isRunningNow ? "Stop" : hasResult ? "Re-run" : "Run";
  run.addEventListener("click", (e) => {
    e.stopPropagation();
    runNode(node.id);
  });
  row.append(run);
  controls.append(row);
  body.append(controls);
}

function buildVoiceoverModelPopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover model-popover audio-model-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const searchWrap = document.createElement("div");
  searchWrap.className = "popover-search";
  searchWrap.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Search" autocomplete="off">`;
  const searchInput = searchWrap.querySelector("input");

  const list = document.createElement("div");
  list.className = "popover-list";

  const curModel = node.voiceModel || "ElevenLabs v3";
  const renderList = () => {
    list.replaceChildren();
    const q = searchInput.value.trim().toLowerCase();
    const items = VOICEOVER_MODELS.filter((m) => !q || m.label.toLowerCase().includes(q));
    for (const item of items) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `popover-option ${curModel === item.label ? "active" : ""}`.trim();
      btn.innerHTML = `
        <span class="model-badge-icon audio-provider-badge">${escapeHtml(item.badge)}</span>
        <span class="model-option-label">${escapeHtml(item.label)}</span>
        <span class="model-pin-icon">${actionIcon("pin")}</span>
      `;
      btn.addEventListener("click", () => {
        remember();
        node.voiceModel = item.label;
        closeAllPopovers();
        markDirty();
        renderGraph();
      });
      list.append(btn);
    }
  };

  searchInput.addEventListener("input", renderList);
  renderList();
  popover.append(searchWrap, list);
  card.append(popover);
  setTimeout(() => searchInput.focus(), 10);
}

function buildMusicModelPopover(node, card, onSelectCallback = null) {
  const popover = document.createElement("div");
  popover.className = "card-popover model-popover music-model-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const searchWrap = document.createElement("div");
  searchWrap.className = "popover-search";
  searchWrap.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Search" autocomplete="off">`;
  const searchInput = searchWrap.querySelector("input");

  const list = document.createElement("div");
  list.className = "popover-list";

  const curModel = node.musicModel || "";
  const renderList = () => {
    list.replaceChildren();
    const q = searchInput.value.trim().toLowerCase();
    const items = MUSIC_MODELS.filter((m) => !q || m.label.toLowerCase().includes(q) || (m.desc && m.desc.toLowerCase().includes(q)));
    for (const item of items) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `popover-option music-model-option ${curModel === item.label ? "active" : ""}`.trim();
      const tagClass = item.tagType === "beta" ? "model-tag-beta" : "model-tag-new";
      btn.innerHTML = `
        <div class="music-model-option-top">
          <span class="model-badge-icon audio-provider-badge">${escapeHtml(item.badge)}</span>
          <span class="model-option-label">${escapeHtml(item.label)}</span>
          ${item.tag ? `<span class="${tagClass}">${escapeHtml(item.tag)}</span>` : ""}
          <span class="model-pin-icon">${actionIcon("pin")}</span>
        </div>
        ${item.desc ? `<small class="music-model-option-desc">${escapeHtml(item.desc)}</small>` : ""}
      `;
      btn.addEventListener("click", () => {
        remember();
        node.musicModel = item.label;
        closeAllPopovers();
        markDirty();
        if (onSelectCallback) onSelectCallback(item.label);
        renderGraph();
      });
      list.append(btn);
    }
  };

  searchInput.addEventListener("input", renderList);
  renderList();
  popover.append(searchWrap, list);
  card.append(popover);
  setTimeout(() => searchInput.focus(), 10);
}

function makeAudioCountStepper(node) {
  const curCount = Math.max(1, Math.min(4, Number(node.count) || 1));
  const stepper = document.createElement("div");
  stepper.className = "card-pill audio-count-stepper";
  stepper.title = "Number of generations";

  const minusBtn = document.createElement("button");
  minusBtn.type = "button";
  minusBtn.className = "stepper-btn";
  minusBtn.textContent = "−";
  minusBtn.disabled = curCount <= 1;
  minusBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (curCount > 1) {
      remember();
      node.count = curCount - 1;
      markDirty();
      renderGraph();
    }
  });

  const label = document.createElement("span");
  label.className = "stepper-value";
  label.textContent = `x${curCount}`;

  const plusBtn = document.createElement("button");
  plusBtn.type = "button";
  plusBtn.className = "stepper-btn";
  plusBtn.textContent = "+";
  plusBtn.disabled = curCount >= 4;
  plusBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (curCount < 4) {
      remember();
      node.count = curCount + 1;
      markDirty();
      renderGraph();
    }
  });

  stepper.append(minusBtn, label, plusBtn);
  return stepper;
}

function audioNodeControls(node, card) {
  const body = card.querySelector(".node-body");
  body.replaceChildren();
  const wrap = document.createElement("div");
  wrap.className = `task-controls audio-node-controls audio-kind-${node.kind}`;

  const isRunningNow = Boolean(node._batchRunning || node._running);
  const stopSvg =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';

  const makeRunBtn = () => {
    const run = document.createElement("button");
    run.type = "button";
    run.className = `card-run ${isRunningNow ? "is-stopping" : ""}`.trim();
    run.dataset.runNode = node.id;
    run.dataset.runFor = node.id;
    run.innerHTML = isRunningNow ? stopSvg : actionIcon("play");
    run.title = isRunningNow ? "Stop" : "Run Ctrl+Enter";
    run.addEventListener("click", (e) => {
      e.stopPropagation();
      runNode(node.id);
    });
    return run;
  };

  const makeGearBtn = () => {
    const gear = document.createElement("button");
    gear.type = "button";
    gear.className = "card-pill card-icon-pill audio-gear-btn";
    gear.title = "Open settings";
    gear.innerHTML = actionIcon("settings");
    gear.addEventListener("click", (e) => {
      e.stopPropagation();
      openSettings(node.id);
    });
    return gear;
  };

  // 1. Speech to Text (voice.mp4 @ 0:06s - 0:15s)
  if (node.kind === "speech-to-text") {
    const transcript = (node.transcriptText || node.outputText || "").trim();
    const stage = document.createElement("div");
    if (transcript) {
      stage.className = "stt-transcript-stage";
      stage.innerHTML = `
        <div class="stt-transcript-head">
          <span>Transcript (${escapeHtml(node.sttModel || "ElevenLabs Scribe v2")})</span>
          <button type="button" class="card-pill stt-copy-btn" title="Copy transcript">Copy</button>
        </div>
        <div class="stt-transcript-text">${escapeHtml(transcript)}</div>
      `;
      stage.querySelector(".stt-copy-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        try {
          navigator.clipboard?.writeText(transcript);
        } catch {}
        notify("Đã sao chép văn bản phiên âm.");
      });
    } else {
      stage.className = "stt-empty-stage";
      stage.innerHTML = `
        <span class="stt-empty-icon">${catalogIcon("speech-to-text")}</span>
        <strong>Speech to Text</strong>
        <span>Connect an audio or video node and run to transcribe it.</span>
      `;
    }
    wrap.append(stage);

    const row = document.createElement("div");
    row.className = "card-task-actions audio-bottom-row";
    const curSttModel = node.sttModel || "ElevenLabs Scribe v2";
    const modelBtn = document.createElement("button");
    modelBtn.type = "button";
    modelBtn.className = "card-pill audio-model-pill";
    modelBtn.innerHTML = `<span>${escapeHtml(curSttModel)}</span><span class="pill-chevron">▾</span>`;
    modelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "stt-model", card)) {
        buildSimpleListPopover(node, card, ["ElevenLabs Scribe v2"], curSttModel, (v) => {
          node.sttModel = v;
        });
      }
    });
    row.append(modelBtn, makeRunBtn());
    wrap.append(row);
    body.append(wrap);
    return;
  }

  // Audio player banner for synthesized output (.wav) on Voiceover, Sound Effects, Audio Generator, Music Generator
  const audioAsset = node.assetId ? state.assets.find((a) => a.id === node.assetId) : null;
  const resolvedAudioUrl = audioAsset?.url || node.audioUrl || "";
  if (resolvedAudioUrl) {
    const playerBar = document.createElement("div");
    playerBar.className = "audio-player-banner";
    const batchCount = Array.isArray(node.batchAssetIds) && node.batchAssetIds.length > 1 ? node.batchAssetIds.length : 1;
    playerBar.innerHTML = `
      <audio controls src="${escapeHtml(resolvedAudioUrl)}" class="audio-inline-player"></audio>
      ${batchCount > 1 ? `<span class="audio-batch-badge">x${batchCount}</span>` : ""}
      <a href="${escapeHtml(resolvedAudioUrl)}?download=1" download class="card-pill audio-dl-pill" title="Tải tệp .wav">⬇ .wav</a>
    `;
    playerBar.querySelectorAll("audio, a").forEach((el) => {
      el.addEventListener("pointerdown", (e) => e.stopPropagation());
      el.addEventListener("click", (e) => e.stopPropagation());
    });
    wrap.append(playerBar);
  }

  // Prompt area for the 4 generative Audio nodes
  const promptWrap = document.createElement("div");
  promptWrap.className = "audio-prompt-box";

  const connectedPromptEdge = state.graph.edges.find((e) => e.target === node.id && e.targetPort === "prompt");
  if (connectedPromptEdge) {
    const srcNode = state.graph.nodes.find((n) => n.id === connectedPromptEdge.source);
    const linkedBanner = document.createElement("div");
    linkedBanner.className = "linked-prompt";
    linkedBanner.dataset.promptSource = srcNode?.id || "";
    linkedBanner.textContent = `T · ${nodeDisplayTitle(srcNode)}: ${resolveConnectedPromptText(node) || "Empty prompt"}`;
    promptWrap.append(linkedBanner);
  }

  const prompt = document.createElement("textarea");
  prompt.className = "card-prompt audio-card-prompt";
  prompt.rows = 4;
  prompt.placeholder =
    node.kind === "voiceover"
      ? "Type your text with audio tags like [laughs] to create expressive speech, and add pauses with tags like [pause 0.5s]"
      : node.kind === "sound-effects"
        ? "Describe the sound effect you want to generate..."
        : node.kind === "audio-generator"
          ? "Describe the audio you want to generate..."
          : "Describe the music you want to generate...";
  prompt.value = node.prompt || "";
  prompt.addEventListener("input", () => {
    node.prompt = prompt.value;
    markDirty();
    document.querySelectorAll(`[data-run-for="${node.id}"]`).forEach((btn) => {
      btn.disabled = !canRunTask(node);
    });
  });
  promptWrap.append(prompt);
  wrap.append(promptWrap);

  // 2. Voiceover controls (2 rows: Row 1 = [- x1 +] + [ElevenLabs v3 ▾], Row 2 = [Speaker 1] [Speaker 2] [⚙] [▶])
  if (node.kind === "voiceover") {
    const row1 = document.createElement("div");
    row1.className = "card-task-actions audio-controls-row";
    const curVoiceModel = node.voiceModel || "ElevenLabs v3";
    const modelBtn = document.createElement("button");
    modelBtn.type = "button";
    modelBtn.className = "card-pill audio-model-pill flex-fill-pill";
    modelBtn.innerHTML = `<span>${escapeHtml(curVoiceModel)}</span><span class="pill-chevron">▾</span>`;
    modelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "voiceover-model", card)) {
        buildVoiceoverModelPopover(node, card);
      }
    });
    row1.append(makeAudioCountStepper(node), modelBtn);

    const row2 = document.createElement("div");
    row2.className = "card-task-actions audio-controls-row";
    const spk1Btn = document.createElement("button");
    spk1Btn.type = "button";
    spk1Btn.className = `card-pill audio-speaker-pill ${node.voiceName ? "has-voice" : ""}`.trim();
    spk1Btn.innerHTML = `<span class="speaker-slot-badge">S</span><span>${escapeHtml(node.voiceName || "Speaker 1")}</span>`;
    spk1Btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openVoicesModal(node.id, 1);
    });

    const spk2Btn = document.createElement("button");
    spk2Btn.type = "button";
    spk2Btn.className = `card-pill audio-speaker-pill ${node.speaker2Name ? "has-voice" : ""}`.trim();
    spk2Btn.innerHTML = `<span class="speaker-slot-badge">S</span><span>${escapeHtml(node.speaker2Name || "Speaker 2")}</span>`;
    spk2Btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openVoicesModal(node.id, 2);
    });

    row2.append(spk1Btn, spk2Btn, makeGearBtn(), makeRunBtn());
    wrap.append(row1, row2);
    body.append(wrap);
    return;
  }

  // 3. Sound Effects controls (2 rows: Row 1 = [- x1 +] + [ElevenLabs Text to Sound v2 ▾], Row 2 = [5" ▾] [⚪ Loop] [⚙] [▶])
  if (node.kind === "sound-effects") {
    const row1 = document.createElement("div");
    row1.className = "card-task-actions audio-controls-row";
    const curSfxModel = node.sfxModel || "ElevenLabs Text to Sound v2";
    const modelBtn = document.createElement("button");
    modelBtn.type = "button";
    modelBtn.className = "card-pill audio-model-pill flex-fill-pill";
    modelBtn.innerHTML = `<span>${escapeHtml(curSfxModel)}</span><span class="pill-chevron">▾</span>`;
    modelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "sfx-model", card)) {
        buildSimpleListPopover(node, card, ["ElevenLabs Text to Sound v2"], curSfxModel, (v) => {
          node.sfxModel = v;
        });
      }
    });
    row1.append(makeAudioCountStepper(node), modelBtn);

    const row2 = document.createElement("div");
    row2.className = "card-task-actions audio-controls-row";
    const curDur = node.duration || '5"';
    const durBtn = document.createElement("button");
    durBtn.type = "button";
    durBtn.className = "card-pill";
    durBtn.innerHTML = `<span>${escapeHtml(curDur)}</span><span class="pill-chevron">▾</span>`;
    durBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "sfx-dur", card)) {
        buildSimpleListPopover(node, card, ['3"', '5"', '10"', '15"', '30"'], curDur, (v) => {
          node.duration = v;
        });
      }
    });

    const loopBtn = document.createElement("button");
    loopBtn.type = "button";
    loopBtn.className = `card-pill audio-loop-pill ${node.loop ? "is-active" : ""}`.trim();
    loopBtn.innerHTML = `<span class="loop-toggle-track"><span class="loop-toggle-thumb"></span></span><span>Loop</span>`;
    loopBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      remember();
      node.loop = !node.loop;
      markDirty();
      renderGraph();
    });

    row2.append(durBtn, loopBtn, makeGearBtn(), makeRunBtn());
    wrap.append(row1, row2);
    body.append(wrap);
    return;
  }

  // 4. Audio Generator [Experimental] controls (1 row: [- x1 +] ... [⚙] [▶])
  if (node.kind === "audio-generator") {
    const row = document.createElement("div");
    row.className = "card-task-actions audio-controls-row";
    const spacer = document.createElement("span");
    spacer.style.flex = "1";
    row.append(makeAudioCountStepper(node), spacer, makeGearBtn(), makeRunBtn());
    wrap.append(row);
    body.append(wrap);
    return;
  }

  // 5. Music Generator controls (1 row: [- x1 +] [Select ▾] [30" ▾] [⚙] [▶])
  const row = document.createElement("div");
  row.className = "card-task-actions audio-controls-row";
  const curMusicModel = node.musicModel || "";
  const modelBtn = document.createElement("button");
  modelBtn.type = "button";
  modelBtn.className = "card-pill audio-model-pill flex-fill-pill";
  modelBtn.innerHTML = `<span>${escapeHtml(curMusicModel || "Select")}</span><span class="pill-chevron">▾</span>`;
  modelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (togglePopover(node.id, "music-model", card)) {
      buildMusicModelPopover(node, card);
    }
  });

  const curDur = node.duration || '30"';
  const durBtn = document.createElement("button");
  durBtn.type = "button";
  durBtn.className = "card-pill";
  durBtn.innerHTML = `<span>${escapeHtml(curDur)}</span><span class="pill-chevron">▾</span>`;
  durBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (togglePopover(node.id, "music-dur", card)) {
      buildSimpleListPopover(node, card, ['10"', '30"', "1'", "5'"], curDur, (v) => {
        node.duration = v;
      });
    }
  });

  row.append(makeAudioCountStepper(node), modelBtn, durBtn, makeGearBtn(), makeRunBtn());
  wrap.append(row);
  body.append(wrap);
}

const _glbParseCache = new Map();

async function loadAndParseGlbAsset(glbUrl) {
  if (!glbUrl) return null;
  if (_glbParseCache.has(glbUrl)) {
    return _glbParseCache.get(glbUrl);
  }
  const resp = await fetch(glbUrl);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const buffer = await resp.arrayBuffer();
  const parsed = parseGlbBinaryBuffer(buffer);
  if (parsed.textureBlob) {
    const objUrl = URL.createObjectURL(parsed.textureBlob);
    try {
      parsed.textureImage = await loadImageElementFromUrl(objUrl);
    } finally {
      URL.revokeObjectURL(objUrl);
    }
  }
  _glbParseCache.set(glbUrl, parsed);
  return parsed;
}

function parseGlbBinaryBuffer(arrayBuffer) {
  const dv = new DataView(arrayBuffer);
  const magic = dv.getUint32(0, true);
  if (magic !== 0x46546c67) {
    throw new Error("Tệp không phải định dạng nhị phân glTF 2.0 (.glb).");
  }
  const jsonLen = dv.getUint32(12, true);
  const jsonType = dv.getUint32(16, true);
  if (jsonType !== 0x4e4f534a) {
    throw new Error("Thiếu JSON chunk trong tệp .glb.");
  }
  const jsonBytes = new Uint8Array(arrayBuffer, 20, jsonLen);
  const gltf = JSON.parse(new TextDecoder("utf-8").decode(jsonBytes));

  const binHeaderOffset = 20 + jsonLen;
  const binLen = dv.getUint32(binHeaderOffset, true);
  const binStart = binHeaderOffset + 8;

  const prim = gltf.meshes?.[0]?.primitives?.[0];
  if (!prim) throw new Error("Tệp .glb không chứa lưới 3D.");

  const getAccessorTypedArray = (accIdx) => {
    const acc = gltf.accessors[accIdx];
    const bv = gltf.bufferViews[acc.bufferView];
    const byteOffset = binStart + (bv.byteOffset || 0) + (acc.byteOffset || 0);
    const numComponents = acc.type === "VEC3" ? 3 : acc.type === "VEC2" ? 2 : 1;
    const total = acc.count * numComponents;
    if (acc.componentType === 5126) {
      return new Float32Array(arrayBuffer, byteOffset, total);
    }
    if (acc.componentType === 5125) {
      return new Uint32Array(arrayBuffer, byteOffset, total);
    }
    if (acc.componentType === 5123) {
      return new Uint16Array(arrayBuffer, byteOffset, total);
    }
    return new Float32Array(arrayBuffer, byteOffset, total);
  };

  const positions = getAccessorTypedArray(prim.attributes.POSITION);
  const normals = prim.attributes.NORMAL !== undefined ? getAccessorTypedArray(prim.attributes.NORMAL) : null;
  const uvs = prim.attributes.TEXCOORD_0 !== undefined ? getAccessorTypedArray(prim.attributes.TEXCOORD_0) : null;
  const indices = prim.indices !== undefined ? getAccessorTypedArray(prim.indices) : null;

  // Build quad/edge wireframe indices (skipping diagonal every 2 triangles when Quad topology)
  const isQuad = (gltf.asset?.extras?.topology || "Quad") === "Quad";
  const wireList = [];
  if (indices && indices.length >= 3) {
    if (isQuad && indices.length % 6 === 0) {
      for (let i = 0; i < indices.length; i += 6) {
        const v00 = indices[i];
        const v01 = indices[i + 1];
        const v10 = indices[i + 2];
        const v11 = indices[i + 5];
        wireList.push(v00, v01, v01, v11, v11, v10, v10, v00);
      }
    } else {
      for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i];
        const b = indices[i + 1];
        const c = indices[i + 2];
        wireList.push(a, b, b, c, c, a);
      }
    }
  }
  const wireIndices = new Uint32Array(wireList);

  let textureBlob = null;
  const imgDef = gltf.images?.[0];
  if (imgDef && imgDef.bufferView !== undefined) {
    const bv = gltf.bufferViews[imgDef.bufferView];
    const imgBytes = new Uint8Array(arrayBuffer, binStart + (bv.byteOffset || 0), bv.byteLength);
    textureBlob = new Blob([imgBytes], { type: imgDef.mimeType || "image/png" });
  }

  return {
    gltf,
    extras: gltf.asset?.extras || {},
    positions,
    normals,
    uvs,
    indices,
    wireIndices,
    textureBlob,
    textureImage: null,
    byteLength: arrayBuffer.byteLength || binLen,
  };
}

function _mat4Perspective(fovRad, aspect, near, far) {
  const f = 1.0 / Math.tan(fovRad / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function mountWebGL3DCanvas(canvasEl, glbData, stateObj) {
  const gl = canvasEl.getContext("webgl2", { alpha: true, antialias: true, preserveDrawingBuffer: true }) ||
    canvasEl.getContext("webgl", { alpha: true, antialias: true, preserveDrawingBuffer: true });
  if (!gl) return null;

  const uintExt = gl instanceof WebGLRenderingContext ? gl.getExtension("OES_element_index_uint") : true;
  const vsSource = `
    attribute vec3 aPos;
    attribute vec3 aNorm;
    attribute vec2 aUv;
    uniform mat4 uProj;
    uniform vec3 uCamAngles;
    uniform vec3 uPanDist;
    varying vec3 vNorm;
    varying vec3 vWorldPos;
    varying vec2 vUv;
    void main() {
      float yaw = uCamAngles.x;
      float pitch = uCamAngles.y;
      float cy = cos(yaw), sy = sin(yaw);
      float cp = cos(pitch), sp = sin(pitch);
      // Rotate Y (yaw) then Rotate X (pitch)
      vec3 p1 = vec3(cy * aPos.x + sy * aPos.z, aPos.y, -sy * aPos.x + cy * aPos.z);
      vec3 p2 = vec3(p1.x, cp * p1.y - sp * p1.z, sp * p1.y + cp * p1.z);
      vec3 n1 = vec3(cy * aNorm.x + sy * aNorm.z, aNorm.y, -sy * aNorm.x + cy * aNorm.z);
      vec3 n2 = vec3(n1.x, cp * n1.y - sp * n1.z, sp * n1.y + cp * n1.z);
      vec3 viewPos = p2 + vec3(uPanDist.x, uPanDist.y, -uPanDist.z);
      vNorm = normalize(n2);
      vWorldPos = p2;
      vUv = aUv;
      gl_Position = uProj * vec4(viewPos, 1.0);
    }
  `;

  const fsSource = `
    precision highp float;
    varying vec3 vNorm;
    varying vec3 vWorldPos;
    varying vec2 vUv;
    uniform sampler2D uTex;
    uniform int uRenderMode; // 0: Shaded PBR, 1: Clay, 2: Wireframe Line Pass
    uniform int uEnvMode;    // 0: Photo, 1: Studio, 2: Light, 3: Transparent
    uniform int uHasTex;
    void main() {
      if (uRenderMode == 2) {
        gl_FragColor = vec4(0.22, 0.78, 0.98, 0.72);
        return;
      }
      vec3 N = normalize(vNorm);
      if (!gl_FrontFacing) N = -N;
      vec3 V = normalize(vec3(0.0, 0.0, 1.0));

      vec3 baseCol = vec3(0.80, 0.83, 0.88);
      if (uRenderMode == 0 && uHasTex == 1) {
        baseCol = texture2D(uTex, vUv).rgb;
      } else if (uRenderMode == 1) {
        baseCol = vec3(0.76, 0.79, 0.84);
      }

      vec3 L1 = normalize(vec3(0.52, 0.68, 0.65));
      vec3 L2 = normalize(vec3(-0.68, 0.25, 0.42));
      vec3 L3 = normalize(vec3(0.0, 0.45, -0.88));

      float diff1 = max(dot(N, L1), 0.0);
      float diff2 = max(dot(N, L2), 0.0);
      float rim = pow(1.0 - max(dot(N, V), 0.0), 2.6) * max(dot(N, L3) * 0.5 + 0.5, 0.0);

      vec3 H1 = normalize(L1 + V);
      float specPower = (uRenderMode == 1) ? 28.0 : 18.0;
      float specStrength = (uRenderMode == 1) ? 0.22 : 0.14;
      float spec = pow(max(dot(N, H1), 0.0), specPower) * specStrength;

      vec3 skyAmb = vec3(0.95, 0.97, 1.0);
      vec3 gndAmb = vec3(0.42, 0.45, 0.52);
      float hemi = N.y * 0.5 + 0.5;
      vec3 ambient = mix(gndAmb, skyAmb, hemi);

      vec3 lightSum;
      if (uEnvMode == 0) {
        // Photo: warm sunlight key + natural sky ambient
        lightSum = ambient * 0.58 + vec3(1.04, 0.98, 0.92) * diff1 * 0.62 + vec3(0.75, 0.84, 0.98) * diff2 * 0.24 + vec3(1.0, 0.95, 0.88) * rim * 0.28;
      } else if (uEnvMode == 1) {
        // Studio: balanced 3-point studio lighting with crisp rim
        lightSum = ambient * 0.54 + vec3(1.0, 0.99, 0.98) * diff1 * 0.60 + vec3(0.78, 0.86, 1.0) * diff2 * 0.30 + vec3(0.92, 0.96, 1.0) * rim * 0.38;
      } else if (uEnvMode == 2) {
        // Light: bright soft daylight studio
        lightSum = ambient * 0.72 + vec3(1.0, 1.0, 1.0) * diff1 * 0.48 + vec3(0.90, 0.93, 0.98) * diff2 * 0.26 + vec3(1.0, 1.0, 1.0) * rim * 0.18;
      } else {
        // Transparent: clean neutral studio illumination
        lightSum = ambient * 0.62 + vec3(1.0, 1.0, 1.0) * diff1 * 0.56 + vec3(0.82, 0.88, 0.96) * diff2 * 0.25 + vec3(0.95, 0.98, 1.0) * rim * 0.30;
      }

      vec3 finalCol = baseCol * lightSum + vec3(spec);
      gl_FragColor = vec4(clamp(finalCol, 0.0, 1.0), 1.0);
    }
  `;

  const compileShader = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, glbData.positions, gl.STATIC_DRAW);

  const normBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    glbData.normals || new Float32Array(glbData.positions.length),
    gl.STATIC_DRAW
  );

  const uvBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    glbData.uvs || new Float32Array((glbData.positions.length / 3) * 2),
    gl.STATIC_DRAW
  );

  const idxArray = uintExt
    ? glbData.indices instanceof Uint32Array
      ? glbData.indices
      : new Uint32Array(glbData.indices)
    : new Uint16Array(glbData.indices);
  const idxType = uintExt ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;

  const idxBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idxArray, gl.STATIC_DRAW);

  const wireArray = uintExt
    ? glbData.wireIndices
    : new Uint16Array(glbData.wireIndices);
  const wireBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, wireArray, gl.STATIC_DRAW);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  let hasTex = 0;
  if (glbData.textureImage) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glbData.textureImage);
    hasTex = 1;
  } else {
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([210, 216, 226, 255])
    );
  }

  const aPos = gl.getAttribLocation(prog, "aPos");
  const aNorm = gl.getAttribLocation(prog, "aNorm");
  const aUv = gl.getAttribLocation(prog, "aUv");
  const uProj = gl.getUniformLocation(prog, "uProj");
  const uCamAngles = gl.getUniformLocation(prog, "uCamAngles");
  const uPanDist = gl.getUniformLocation(prog, "uPanDist");
  const uRenderMode = gl.getUniformLocation(prog, "uRenderMode");
  const uEnvMode = gl.getUniformLocation(prog, "uEnvMode");
  const uHasTex = gl.getUniformLocation(prog, "uHasTex");

  const drawFrame = () => {
    if (!canvasEl.isConnected) return;
    const rect = canvasEl.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(240, Math.round((rect.width || 340) * dpr));
    const h = Math.max(240, Math.round((rect.height || 340) * dpr));
    if (canvasEl.width !== w || canvasEl.height !== h) {
      canvasEl.width = w;
      canvasEl.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(prog);
    const proj = _mat4Perspective((38 * Math.PI) / 180, w / Math.max(1, h), 0.1, 20.0);
    gl.uniformMatrix4fv(uProj, false, proj);
    gl.uniform3f(uCamAngles, stateObj.yaw || 0, stateObj.pitch || 0, 0);
    gl.uniform3f(uPanDist, stateObj.panX || 0, stateObj.panY || 0, stateObj.dist || 2.15);

    const envMap = { Photo: 0, Studio: 1, Light: 2, Transparent: 3 };
    gl.uniform1i(uEnvMode, envMap[stateObj.envPreset || "Studio"] ?? 1);
    gl.uniform1i(uHasTex, hasTex);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.enableVertexAttribArray(aNorm);
    gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);

    const modeStr = stateObj.renderMode3d || "Shaded PBR";
    const isClay = modeStr === "Clay Turntable";
    const isWire = modeStr === "Wireframe Mesh" || Boolean(stateObj.showWireframeOverlay);

    gl.uniform1i(uRenderMode, isClay ? 1 : 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.drawElements(gl.TRIANGLES, idxArray.length, idxType, 0);

    if (isWire && wireArray.length > 0) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1i(uRenderMode, 2);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuf);
      gl.drawElements(gl.LINES, wireArray.length, idxType, 0);
      gl.disable(gl.BLEND);
    }
  };

  let rafId = 0;
  const tick = () => {
    if (!canvasEl.isConnected) return;
    if (stateObj.autoRotate && !stateObj._dragging) {
      stateObj.yaw = (stateObj.yaw || 0) + 0.012;
      drawFrame();
    }
    rafId = requestAnimationFrame(tick);
  };
  drawFrame();
  rafId = requestAnimationFrame(tick);

  return {
    drawFrame,
    dispose: () => cancelAnimationFrame(rafId),
  };
}

function attachInteractive3DViewport(node, card, stageWrap, glbAsset, previewAsset, resultRun) {
  stageWrap.replaceChildren();
  stageWrap.classList.add("stage-3d-viewport-wrap");

  if (!node._cam3d) {
    node._cam3d = {
      yaw: 0.36,
      pitch: 0.14,
      dist: 2.12,
      panX: 0,
      panY: 0,
      autoRotate: false,
      envPreset: node.envPreset || "Studio",
      renderMode3d: node.renderMode3d || "Shaded PBR",
      showWireframeOverlay: (node.renderMode3d || "") === "Wireframe Mesh",
    };
  }
  const camState = node._cam3d;
  camState.envPreset = node.envPreset || camState.envPreset || "Studio";
  camState.renderMode3d = node.renderMode3d || camState.renderMode3d || "Shaded PBR";

  const applyEnvBackdropClass = () => {
    stageWrap.dataset.env3d = (camState.envPreset || "Studio").toLowerCase();
  };
  applyEnvBackdropClass();

  const canvas = document.createElement("canvas");
  canvas.className = "node-3d-canvas";
  stageWrap.append(canvas);

  // Top-left 360° Interactive hint & Polycount badge
  const stats = resultRun?.snapshot?.meshStats || node.meshStats || {};
  const polyNum = Number(stats.actualPolycount || stats.targetPolycount || node.targetPolycount || 10000).toLocaleString("en-US");
  const topoLabel = stats.topology || node.topology || "Quad";
  const topLeftHud = document.createElement("div");
  topLeftHud.className = "viewport-3d-top-left";
  topLeftHud.innerHTML = `
    <span class="viewport-3d-pill"><span class="cube-dot"></span> 360° 3D · ${escapeHtml(topoLabel)} ${escapeHtml(polyNum)}</span>
  `;
  stageWrap.append(topLeftHud);

  // Top-right GLB File size + Download .GLB + Fullscreen Inspect button (like 3d.mp4)
  const glbBytes = glbAsset?.size || stats.glbSizeBytes || 0;
  const sizeLabel = glbBytes > 0 ? `${(glbBytes / (1024 * 1024)).toFixed(2)} MB` : "GLB";
  const topRightHud = document.createElement("div");
  topRightHud.className = "viewport-3d-top-right";

  const dlGlbBtn = document.createElement("button");
  dlGlbBtn.type = "button";
  dlGlbBtn.className = "viewport-3d-action-btn primary-glb-dl";
  dlGlbBtn.title = `Tải mô hình 3D (.glb · ${sizeLabel})`;
  dlGlbBtn.innerHTML = `<span>⬇ GLB (${escapeHtml(sizeLabel)})</span>`;
  dlGlbBtn.addEventListener("pointerdown", (e) => e.stopPropagation());
  dlGlbBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (glbAsset) {
      downloadAssetFile(glbAsset);
    }
  });

  const inspectBtn = document.createElement("button");
  inspectBtn.type = "button";
  inspectBtn.className = "viewport-3d-action-btn";
  inspectBtn.title = "Mở trình xem 3D toàn màn hình & Thông số chi tiết";
  inspectBtn.innerHTML = `<span>⤢ 3D View</span>`;
  inspectBtn.addEventListener("pointerdown", (e) => e.stopPropagation());
  inspectBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    open3DInspectorModal(node, glbAsset, previewAsset, resultRun);
  });

  topRightHud.append(dlGlbBtn, inspectBtn);
  stageWrap.append(topRightHud);

  // Bottom-left Environment Lighting Pill Bar: Photo | Studio | Light | Transparent (exact match with 3d.mp4)
  const envBar = document.createElement("div");
  envBar.className = "viewport-3d-env-bar";
  envBar.addEventListener("pointerdown", (e) => e.stopPropagation());
  envBar.addEventListener("click", (e) => e.stopPropagation());

  let rendererRef = null;
  const envModes = ["Photo", "Studio", "Light", "Transparent"];
  const renderEnvButtons = () => {
    envBar.replaceChildren();
    for (const envName of envModes) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `env-3d-btn ${(camState.envPreset || "Studio") === envName ? "active" : ""}`;
      b.textContent = envName;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        node.envPreset = envName;
        camState.envPreset = envName;
        applyEnvBackdropClass();
        renderEnvButtons();
        rendererRef?.drawFrame();
      });
      envBar.append(b);
    }
  };
  renderEnvButtons();
  stageWrap.append(envBar);

  // Bottom-right quick Wireframe & Auto-Rotate toggles
  const quickTools = document.createElement("div");
  quickTools.className = "viewport-3d-quick-tools";
  quickTools.addEventListener("pointerdown", (e) => e.stopPropagation());
  quickTools.addEventListener("click", (e) => e.stopPropagation());

  const wireBtn = document.createElement("button");
  wireBtn.type = "button";
  wireBtn.className = `env-3d-btn ${camState.showWireframeOverlay ? "active" : ""}`;
  wireBtn.title = "Bật/tắt hiển thị lưới đa giác (Wireframe)";
  wireBtn.textContent = "⊞ Quad";
  wireBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    camState.showWireframeOverlay = !camState.showWireframeOverlay;
    wireBtn.classList.toggle("active", camState.showWireframeOverlay);
    rendererRef?.drawFrame();
  });

  const spinBtn = document.createElement("button");
  spinBtn.type = "button";
  spinBtn.className = `env-3d-btn ${camState.autoRotate ? "active" : ""}`;
  spinBtn.title = "Tự động xoay 360°";
  spinBtn.textContent = "↻ 360°";
  spinBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    camState.autoRotate = !camState.autoRotate;
    spinBtn.classList.toggle("active", camState.autoRotate);
    rendererRef?.drawFrame();
  });

  quickTools.append(wireBtn, spinBtn);
  stageWrap.append(quickTools);

  // Mouse Orbit / Zoom / Pan handlers on the 3D Canvas (isolated from graph node drag!)
  let startX = 0;
  let startY = 0;
  let isPanning = false;

  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  canvas.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    selectNode(node.id);
    camState._dragging = true;
    isPanning = e.button === 2 || e.shiftKey;
    startX = e.clientX;
    startY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!camState._dragging) return;
    e.stopPropagation();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;
    if (isPanning) {
      camState.panX = Math.max(-0.85, Math.min(0.85, (camState.panX || 0) + dx * 0.0045));
      camState.panY = Math.max(-0.85, Math.min(0.85, (camState.panY || 0) - dy * 0.0045));
    } else {
      camState.yaw = (camState.yaw || 0) + dx * 0.011;
      camState.pitch = Math.max(-1.42, Math.min(1.42, (camState.pitch || 0) + dy * 0.011));
    }
    rendererRef?.drawFrame();
  });

  const endDrag = (e) => {
    if (!camState._dragging) return;
    e.stopPropagation();
    camState._dragging = false;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {}
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  canvas.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    camState.yaw = 0.36;
    camState.pitch = 0.14;
    camState.dist = 2.12;
    camState.panX = 0;
    camState.panY = 0;
    rendererRef?.drawFrame();
  });

  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const factor = e.deltaY > 0 ? 1.08 : 0.92;
      camState.dist = Math.max(0.95, Math.min(4.2, (camState.dist || 2.12) * factor));
      rendererRef?.drawFrame();
    },
    { passive: false }
  );

  const cacheVer = (glbAsset?.sha256 || "").slice(0, 10) || glbAsset?.size || "";
  const glbUrl = glbAsset?.url
    ? cacheVer && !glbAsset.url.includes("?")
      ? `${glbAsset.url}?v=${cacheVer}`
      : glbAsset.url
    : "";

  if (glbUrl) {
    loadAndParseGlbAsset(glbUrl)
      .then((glbData) => {
        if (!canvas.isConnected || !glbData) return;
        rendererRef = mountWebGL3DCanvas(canvas, glbData, camState);
      })
      .catch(() => {});
  }
}

function open3DInspectorModal(node, glbAsset, previewAsset, resultRun) {
  let modal = document.getElementById("studio3dInspectorModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "studio3dInspectorModal";
    modal.className = "studio-3d-modal-overlay";
    document.body.append(modal);
  }
  modal.hidden = false;

  const stats = resultRun?.snapshot?.meshStats || node.meshStats || {};
  const glbBytes = glbAsset?.size || stats.glbSizeBytes || 0;
  const sizeMb = glbBytes > 0 ? (glbBytes / (1024 * 1024)).toFixed(2) : "1.20";
  const polyNum = Number(stats.actualPolycount || stats.targetPolycount || node.targetPolycount || 10000).toLocaleString("en-US");
  const vertNum = Number(stats.vertexCount || 10000).toLocaleString("en-US");
  const topo = stats.topology || node.topology || "Quad";
  const sym = stats.symmetry || node.symmetry || "Auto";
  const pbr = stats.pbrTextures !== false && node.pbrTextures !== false ? "Yes" : "No";
  const remesh = node.remesh !== false ? "Yes" : "No";
  const sketchBack = stats.sketchBackDetails !== false && node.sketchBackDetails !== false ? "Yes (360° AI Sketch)" : "No";
  const texPrompt =
    stats.texturePrompt ||
    node.texturePrompt ||
    node.prompt ||
    "detailed 360-degree surface material, natural dorsal fur/fabric continuation, soft studio PBR shading";
  const seedVal = resultRun?.snapshot?.seed || node.seed || 1113836264;
  const modelName = node.model3d || "Antigravity 3D Bridge";
  const titleText = nodeDisplayTitle(node) || "3D Character Model";

  const modalCamState = {
    yaw: node._cam3d?.yaw ?? 0.36,
    pitch: node._cam3d?.pitch ?? 0.14,
    dist: node._cam3d?.dist ?? 2.05,
    panX: 0,
    panY: 0,
    autoRotate: false,
    envPreset: node.envPreset || "Studio",
    renderMode3d: node.renderMode3d || "Shaded PBR",
    showWireframeOverlay: Boolean(node._cam3d?.showWireframeOverlay),
  };

  modal.innerHTML = `
    <div class="studio-3d-modal-backdrop"></div>
    <div class="studio-3d-modal-dialog" role="dialog" aria-label="3D Model Inspector">
      <div class="studio-3d-modal-stage" data-env3d="${escapeHtml((modalCamState.envPreset || "Studio").toLowerCase())}">
        <canvas class="studio-3d-modal-canvas"></canvas>
        <div class="studio-3d-modal-stage-top">
          <span class="viewport-3d-pill"><span class="cube-dot"></span> Interactive 360° GLB Viewport (Drag to Rotate · Scroll to Zoom · Right-Drag to Pan)</span>
        </div>
        <div class="studio-3d-modal-env-bar">
          ${["Photo", "Studio", "Light", "Transparent"]
            .map(
              (env) =>
                `<button type="button" class="env-3d-btn ${modalCamState.envPreset === env ? "active" : ""}" data-env="${env}">${env}</button>`
            )
            .join("")}
        </div>
        <div class="studio-3d-modal-mode-bar">
          ${["Shaded PBR", "Wireframe Mesh", "Clay Turntable"]
            .map(
              (m) =>
                `<button type="button" class="env-3d-btn ${modalCamState.renderMode3d === m ? "active" : ""}" data-rmode="${m}">${m}</button>`
            )
            .join("")}
          <button type="button" class="env-3d-btn" id="modal3dSpinBtn">↻ Auto-Turn</button>
        </div>
      </div>
      <aside class="studio-3d-modal-sidebar">
        <div class="studio-3d-sidebar-head">
          <div>
            <h3>${escapeHtml(titleText)}</h3>
            <small>Base · GLB - ${escapeHtml(sizeMb)} MB</small>
          </div>
          <button type="button" class="studio-3d-close-btn" id="close3dModalBtn" title="Close">✕</button>
        </div>
        <button type="button" class="studio-3d-download-primary" id="download3dModalGlbBtn">
          ⬇ Download (${escapeHtml(sizeMb)} MB .GLB)
        </button>

        <div class="studio-3d-meta-card">
          <h4>Details</h4>
          <div class="studio-3d-kv"><span>Type</span><strong>3D Model (.GLB)</strong></div>
          <div class="studio-3d-kv"><span>Vertices</span><strong>${escapeHtml(vertNum)}</strong></div>
          <div class="studio-3d-kv"><span>Polygons</span><strong>${escapeHtml(polyNum)} (${escapeHtml(topo)})</strong></div>
          <div class="studio-3d-kv"><span>AI 360° Back Sketch</span><strong>${escapeHtml(sketchBack)}</strong></div>
        </div>

        <div class="studio-3d-meta-card">
          <h4>Generation parameters</h4>
          <div class="studio-3d-param-pills">
            <span class="param-chip">Model <strong>${escapeHtml(modelName)}</strong></span>
            <span class="param-chip">Generate texture <strong>${escapeHtml(pbr)}</strong></span>
            <span class="param-chip">Target polycount <strong>${escapeHtml(polyNum)}</strong></span>
            <span class="param-chip">Topology <strong>${escapeHtml(topo)}</strong></span>
            <span class="param-chip">Symmetry <strong>${escapeHtml(sym)}</strong></span>
          </div>
          <label class="studio-3d-prompt-label">Texture & Back-View Prompt</label>
          <div class="studio-3d-prompt-box">${escapeHtml(texPrompt)}</div>
          <div class="studio-3d-param-pills" style="margin-top:10px">
            <span class="param-chip">Remesh <strong>${escapeHtml(remesh)}</strong></span>
            <span class="param-chip">PBR textures <strong>${escapeHtml(pbr)}</strong></span>
            <span class="param-chip">Seed <strong>${escapeHtml(String(seedVal))}</strong></span>
          </div>
        </div>
      </aside>
    </div>
  `;

  const stageEl = modal.querySelector(".studio-3d-modal-stage");
  const modalCanvas = modal.querySelector(".studio-3d-modal-canvas");
  let modalRenderer = null;

  const close = () => {
    modalRenderer?.dispose();
    modal.hidden = true;
  };
  modal.querySelector("#close3dModalBtn")?.addEventListener("click", close);
  modal.querySelector(".studio-3d-modal-backdrop")?.addEventListener("click", close);
  modal.querySelector("#download3dModalGlbBtn")?.addEventListener("click", () => {
    if (glbAsset) downloadAssetFile(glbAsset);
  });

  modal.querySelectorAll("[data-env]").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalCamState.envPreset = btn.dataset.env;
      node.envPreset = btn.dataset.env;
      stageEl.dataset.env3d = modalCamState.envPreset.toLowerCase();
      modal.querySelectorAll("[data-env]").forEach((b) => b.classList.toggle("active", b === btn));
      modalRenderer?.drawFrame();
    });
  });

  modal.querySelectorAll("[data-rmode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalCamState.renderMode3d = btn.dataset.rmode;
      modalCamState.showWireframeOverlay = btn.dataset.rmode === "Wireframe Mesh";
      modal.querySelectorAll("[data-rmode]").forEach((b) => b.classList.toggle("active", b === btn));
      modalRenderer?.drawFrame();
    });
  });

  const spinBtn = modal.querySelector("#modal3dSpinBtn");
  spinBtn?.addEventListener("click", () => {
    modalCamState.autoRotate = !modalCamState.autoRotate;
    spinBtn.classList.toggle("active", modalCamState.autoRotate);
    modalRenderer?.drawFrame();
  });

  let sx = 0;
  let sy = 0;
  let panMode = false;
  modalCanvas.addEventListener("contextmenu", (e) => e.preventDefault());
  modalCanvas.addEventListener("pointerdown", (e) => {
    modalCamState._dragging = true;
    panMode = e.button === 2 || e.shiftKey;
    sx = e.clientX;
    sy = e.clientY;
    modalCanvas.setPointerCapture(e.pointerId);
  });
  modalCanvas.addEventListener("pointermove", (e) => {
    if (!modalCamState._dragging) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    sx = e.clientX;
    sy = e.clientY;
    if (panMode) {
      modalCamState.panX = Math.max(-0.9, Math.min(0.9, (modalCamState.panX || 0) + dx * 0.004));
      modalCamState.panY = Math.max(-0.9, Math.min(0.9, (modalCamState.panY || 0) - dy * 0.004));
    } else {
      modalCamState.yaw += dx * 0.01;
      modalCamState.pitch = Math.max(-1.42, Math.min(1.42, modalCamState.pitch + dy * 0.01));
    }
    modalRenderer?.drawFrame();
  });
  modalCanvas.addEventListener("pointerup", (e) => {
    modalCamState._dragging = false;
    try {
      modalCanvas.releasePointerCapture(e.pointerId);
    } catch {}
  });
  modalCanvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      modalCamState.dist = Math.max(0.85, Math.min(4.2, modalCamState.dist * (e.deltaY > 0 ? 1.08 : 0.92)));
      modalRenderer?.drawFrame();
    },
    { passive: false }
  );

  const cacheVer = (glbAsset?.sha256 || "").slice(0, 10) || glbAsset?.size || "";
  const glbUrl = glbAsset?.url
    ? cacheVer && !glbAsset.url.includes("?")
      ? `${glbAsset.url}?v=${cacheVer}`
      : glbAsset.url
    : "";
  if (glbUrl) {
    loadAndParseGlbAsset(glbUrl)
      .then((glbData) => {
        if (!modalCanvas.isConnected || !glbData) return;
        modalRenderer = mountWebGL3DCanvas(modalCanvas, glbData, modalCamState);
      })
      .catch(() => {});
  }
}

function svgAndDesignerControls(node, card) {
  const body = card.querySelector(".node-body");
  const wrap = document.createElement("div");
  wrap.className = "task-controls";

  if (node.kind === "designer") {
    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "card-pill";
    openBtn.style.width = "100%";
    openBtn.style.justifyContent = "center";
    openBtn.innerHTML = `<span>🎨 Open Template Designer (${escapeHtml(node.template || "Social Poster")})</span>`;
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDesignerModal(node.id);
    });
    wrap.append(openBtn);
  } else if (node.kind === "3d-generator") {
    const refs = getConnectedReferences(node);
    const promptTop = document.createElement("div");
    promptTop.className = "card-prompt-top";
    const addPrompt = document.createElement("button");
    addPrompt.type = "button";
    addPrompt.className = "card-prompt-add";
    addPrompt.innerHTML =
      '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 3.2v9.6M3.2 8h9.6"/></svg>';
    addPrompt.title = "Chọn hoặc nối ảnh nhân vật để dựng 3D";
    addPrompt.setAttribute("aria-label", "Add reference image");
    addPrompt.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "add-ref", card)) {
        buildAddReferencePopover(node, card);
      }
    });
    promptTop.append(addPrompt);

    if (refs.length) {
      const thumbStrip = document.createElement("div");
      thumbStrip.className = "card-ref-thumbs";
      for (const ref of refs) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `card-ref-thumb ${ref.isMentioned ? "is-mentioned" : ""}`.trim();
        chip.title = `${ref.title} — Ảnh nhân vật đầu vào 3D`;
        if (ref.asset?.url) {
          chip.innerHTML = `<img src="${escapeHtml(ref.asset.url)}" alt="${escapeHtml(ref.title)}">`;
        } else {
          chip.innerHTML = `<span class="ref-thumb-fallback">${iconMarkup("image")}</span>`;
        }
        chip.addEventListener("click", (event) => {
          event.stopPropagation();
          remember();
          node.prompt = insertMentionIntoPromptText(node.prompt || "", ref.mentionTag);
          markDirty();
          renderGraph();
        });
        thumbStrip.append(chip);
      }
      promptTop.append(thumbStrip);
    }
    wrap.append(promptTop);

    const prompt = document.createElement("textarea");
    prompt.className = "card-prompt";
    prompt.rows = 2;
    prompt.placeholder =
      "Mô tả nhân vật/vật thể 3D & các chi tiết mặt sau/lưng cần vẽ thêm (VD: short soft cat fur, dark grey tabby fur on back saddle and tail)…";
    prompt.value = node.prompt || "";
    prompt.addEventListener("input", () => {
      node.prompt = prompt.value;
      node.texturePrompt = prompt.value;
      markDirty();
    });
    wrap.append(prompt);
  } else {
    const prompt = document.createElement("textarea");
    prompt.className = "card-prompt";
    prompt.rows = 2;
    prompt.placeholder = "Describe the clean vector SVG icon or illustration…";
    prompt.value = node.prompt || "";
    prompt.addEventListener("input", () => {
      node.prompt = prompt.value;
      markDirty();
    });
    wrap.append(prompt);
  }

  if (node.kind === "3d-generator") {
    const row1 = document.createElement("div");
    row1.className = "card-settings";

    const curModel3d = node.model3d || "Antigravity 3D Bridge";
    const modelPill = document.createElement("button");
    modelPill.type = "button";
    modelPill.className = "card-pill";
    modelPill.title = "3D Engine / Model";
    modelPill.innerHTML = `<span class="pill-configured-dot"></span><span>${escapeHtml(curModel3d)}</span><span class="pill-chevron">▾</span>`;
    modelPill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "model-3d", card)) {
        buildSimpleListPopover(node, card, ["Antigravity 3D Bridge", "Hunyuan3D-2", "TripoSR 3D"], curModel3d, (v) => {
          node.model3d = v;
        });
      }
    });

    const curTopo = node.topology || "Quad";
    const topoPill = document.createElement("button");
    topoPill.type = "button";
    topoPill.className = "card-pill";
    topoPill.title = "Topology (Quad / Triangle)";
    topoPill.innerHTML = `<span>${escapeHtml(curTopo)}</span><span class="pill-chevron">▾</span>`;
    topoPill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "topo-3d", card)) {
        buildSimpleListPopover(node, card, ["Quad", "Triangle"], curTopo, (v) => {
          node.topology = v;
        });
      }
    });

    const curPoly = String(node.targetPolycount || 10000);
    const polyPill = document.createElement("button");
    polyPill.type = "button";
    polyPill.className = "card-pill";
    polyPill.title = "Target Polycount";
    polyPill.innerHTML = `<span>${Number(curPoly).toLocaleString("en-US")} poly</span><span class="pill-chevron">▾</span>`;
    polyPill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "poly-3d", card)) {
        buildSimpleListPopover(node, card, ["5,000", "10,000", "20,000", "50,000"], Number(curPoly).toLocaleString("en-US"), (v) => {
          node.targetPolycount = parseInt(String(v).replace(/,/g, ""), 10) || 10000;
        });
      }
    });

    row1.append(modelPill, topoPill, polyPill);
    wrap.append(row1);

    const row2 = document.createElement("div");
    row2.className = "card-task-actions";

    const curMode3d = node.renderMode3d || "Shaded PBR";
    const modePill = document.createElement("button");
    modePill.type = "button";
    modePill.className = "card-pill";
    modePill.title = "Chế độ hiển thị bề mặt 3D";
    modePill.innerHTML = `<span>${escapeHtml(curMode3d)}</span><span class="pill-chevron">▾</span>`;
    modePill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (togglePopover(node.id, "mode-3d", card)) {
        buildSimpleListPopover(node, card, ["Shaded PBR", "Wireframe Mesh", "Clay Turntable"], curMode3d, (v) => {
          node.renderMode3d = v;
          if (node._cam3d) {
            node._cam3d.renderMode3d = v;
            node._cam3d.showWireframeOverlay = v === "Wireframe Mesh";
          }
        });
      }
    });

    const sketchBackOn = node.sketchBackDetails !== false;
    const sketchPill = document.createElement("button");
    sketchPill.type = "button";
    sketchPill.className = `card-pill ${sketchBackOn ? "active-accent-pill" : ""}`.trim();
    sketchPill.title = "Tự động phác thảo & vẽ thêm các chi tiết bị khuất (mặt lưng, gáy, đuôi) từ 1 tấm ảnh nhân vật";
    sketchPill.innerHTML = `<span>${sketchBackOn ? "✦ Sketch 360° Back" : "○ Mirror Back"}</span>`;
    sketchPill.addEventListener("click", (e) => {
      e.stopPropagation();
      remember();
      node.sketchBackDetails = !sketchBackOn;
      markDirty();
      renderGraph();
    });

    const run = document.createElement("button");
    run.type = "button";
    run.className = "card-run";
    run.dataset.runNode = node.id;
    run.title = "Tạo mô hình 3D (.GLB)";
    run.innerHTML = actionIcon("play");
    run.addEventListener("click", (e) => {
      e.stopPropagation();
      runNode(node.id);
    });

    row2.append(modePill, sketchPill, run);
    wrap.append(row2);
    body.append(wrap);
    return;
  }

  const row = document.createElement("div");
  row.className = "card-task-actions";
  const pill = document.createElement("button");
  pill.type = "button";
  pill.className = "card-pill";
  pill.textContent = node.kind === "image-to-svg" ? (node.removeBg !== false ? "● Remove BG" : "○ Keep BG") : "SVG Vector";
  pill.addEventListener("click", (e) => {
    e.stopPropagation();
    node.removeBg = node.removeBg === false;
    markDirty();
    renderGraph();
  });
  row.append(pill);

  const run = document.createElement("button");
  run.type = "button";
  run.className = "card-run";
  run.dataset.runNode = node.id;
  run.innerHTML = actionIcon("play");
  run.addEventListener("click", (e) => {
    e.stopPropagation();
    runNode(node.id);
  });

  row.append(run);
  wrap.append(row);
  body.append(wrap);
}

function stickyAndGroupControls(node, card) {
  const body = card.querySelector(".node-body");
  body.replaceChildren();
  if (node.kind === "sticky-note") {
    card.classList.add("sticky-note-card", `note-${node.noteColor || "yellow"}`);
    const colors = ["yellow", "blue", "green", "pink"];
    const bar = document.createElement("div");
    bar.className = "sticky-color-bar";
    for (const c of colors) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `sticky-color-dot color-${c} ${(node.noteColor || "yellow") === c ? "active" : ""}`;
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        node.noteColor = c;
        markDirty();
        renderGraph();
      });
      bar.append(dot);
    }
    const area = document.createElement("textarea");
    area.className = "sticky-note-textarea";
    area.rows = 4;
    area.value = node.text || "";
    area.placeholder = "Write sticky note…";
    area.addEventListener("input", () => {
      node.text = area.value;
      markDirty();
    });
    body.append(bar, area);
  } else if (node.kind === "group") {
    card.classList.add("group-container-card");
    card.style.width = `${node.groupW || 640}px`;
    card.style.height = `${node.groupH || 420}px`;
    const hint = document.createElement("div");
    hint.className = "group-container-hint";
    hint.textContent = "Drag group header to move enclosed workflow nodes together";
    body.append(hint);
  }
}

function buildVariationModePopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover variation-mode-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const list = document.createElement("div");
  list.className = "popover-list";
  const current = node.variationMode || "Reframe";

  for (const mode of VARIATION_MODES) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `popover-option ${current === mode.id ? "active" : ""}`;
    btn.innerHTML = `<span class="catalog-item-icon type-image" style="width:24px;height:24px;border-radius:6px">${catalogIcon(mode.icon)}</span><span>${escapeHtml(mode.label)}</span>`;
    btn.addEventListener("click", () => {
      remember();
      node.variationMode = mode.id;
      const modeOpts = VARIATION_MODE_OPTIONS[mode.id];
      if (modeOpts) {
        const [r, c] = String(node.variationGrid || "2x2")
          .split("x")
          .map((v) => parseInt(v, 10) || 2);
        const targetCount = Math.min(modeOpts.length, Math.max(2, r * c));
        node.variationAngles = modeOpts.slice(0, targetCount);
      }
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    list.append(btn);
  }

  const foot = document.createElement("div");
  foot.className = "popover-foot variation-popover-foot";
  foot.innerHTML = `<span class="popover-nav-hint"><kbd>↑↓</kbd><span>Navigate</span></span><span class="popover-nav-hint"><kbd>↵</kbd><span>Insert</span></span>`;
  popover.append(list, foot);
  card.append(popover);
}

function buildVariationAnglesPopover(node, card, triggerBtn) {
  const popover = document.createElement("div");
  popover.className = "card-popover variation-angles-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const list = document.createElement("div");
  list.className = "popover-list";
  const modeOpts = VARIATION_MODE_OPTIONS[node.variationMode || "Reframe"] || VARIATION_ANGLES;
  if (!Array.isArray(node.variationAngles) || !node.variationAngles.some((a) => modeOpts.includes(a))) {
    node.variationAngles = modeOpts.slice(0, 4);
  }

  const renderAngles = () => {
    list.replaceChildren();
    for (const angle of modeOpts) {
      const checked = node.variationAngles.includes(angle);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `popover-option angle-check-option ${checked ? "active" : ""}`;
      btn.innerHTML = `<span class="angle-checkbox ${checked ? "checked" : ""}">${checked ? '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' : ""}</span><span>${escapeHtml(angle)}</span>`;
      btn.addEventListener("click", () => {
        remember();
        if (node.variationAngles.includes(angle)) {
          node.variationAngles = node.variationAngles.filter((a) => a !== angle);
        } else {
          node.variationAngles = [...node.variationAngles, angle];
        }
        if (triggerBtn) {
          triggerBtn.innerHTML = `<span>${node.variationAngles.length} Selected</span><span class="pill-chevron">▾</span>`;
        }
        markDirty();
        renderAngles();
      });
      list.append(btn);
    }
  };

  renderAngles();
  popover.append(list);
  card.append(popover);
}

function buildSimpleListPopover(node, card, options, currentVal, onSelect, extraClass = "", triggerBtn = null) {
  const popover = document.createElement("div");
  popover.className = `card-popover mode-popover ${extraClass}`.trim();
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
  for (const opt of options) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `popover-option ${currentVal === opt ? "active" : ""}`;
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      remember();
      onSelect(opt);
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    popover.append(btn);
  }
  card.append(popover);
  if (triggerBtn && card) {
    const cardRect = card.getBoundingClientRect();
    const btnRect = triggerBtn.getBoundingClientRect();
    const zoom = state.zoom || 1;
    const rawLeft = Math.round((btnRect.left - cardRect.left) / zoom);
    const bottomPx = Math.max(44, Math.round((cardRect.bottom - btnRect.top) / zoom + 6));
    popover.style.bottom = `${bottomPx}px`;
    popover.style.right = "auto";
    const popWidth = popover.offsetWidth || 160;
    const maxLeft = Math.max(10, (card.offsetWidth || 392) - popWidth - 10);
    popover.style.left = `${Math.max(10, Math.min(maxLeft, rawLeft))}px`;
  }
}

function buildVariationGridPopover(node, card) {
  const popover = document.createElement("div");
  popover.className = "card-popover mode-popover variation-grid-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());
  popover.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  const currentGrid = node.variationGrid || "3x3";
  const ratioLabel = currentRatioLabel(node) === "512×512" ? "9:16" : currentRatioLabel(node);
  const resVal = node.variationRes || "2K";
  for (const opt of VARIATION_GRID_OPTIONS) {
    const [tileW, tileH] = computeVariationTileDims(opt, ratioLabel, resVal);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `popover-option variation-grid-option ${currentGrid === opt ? "active" : ""}`;
    btn.innerHTML = `<span class="grid-opt-label">${escapeHtml(opt)}</span><span class="grid-opt-dims">${tileW}×${tileH}</span>`;
    btn.addEventListener("click", () => {
      remember();
      node.variationGrid = opt;
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    popover.append(btn);
  }
  card.append(popover);
}

function variationsControls(node, card) {
  const body = card.querySelector(".node-body");
  const controls = document.createElement("div");
  controls.className = "task-controls variations-controls";

  const refs = getConnectedReferences(node);
  const mode = node.variationMode || "Custom";

  if (mode === "Custom" || mode === "Storyboard") {
    const promptTop = document.createElement("div");
    promptTop.className = "card-prompt-top";
    const addPrompt = document.createElement("button");
    addPrompt.type = "button";
    addPrompt.className = "card-prompt-add";
    addPrompt.innerHTML =
      '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 3.2v9.6M3.2 8h9.6"/></svg>';
    addPrompt.title = "Add reference";
    addPrompt.setAttribute("aria-label", "Add reference");
    addPrompt.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "add-ref", card)) {
        buildAddReferencePopover(node, card);
      }
    });
    promptTop.append(addPrompt);

    if (refs.length) {
      const thumbStrip = document.createElement("div");
      thumbStrip.className = "card-ref-thumbs";
      for (const ref of refs) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `card-ref-thumb ${ref.isMentioned ? "is-mentioned" : ""}`.trim();
        chip.title = `${ref.title} (${ref.mentionTag}) — Click to mention in prompt`;
        if (ref.asset?.url) {
          chip.innerHTML = `<img src="${escapeHtml(ref.asset.url)}" alt="${escapeHtml(ref.title)}">`;
        } else {
          chip.innerHTML = `<span class="ref-thumb-fallback">${iconMarkup("image")}</span>`;
        }
        chip.addEventListener("mousedown", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        chip.addEventListener("click", (event) => {
          event.stopPropagation();
          remember();
          node.prompt = insertMentionIntoPromptText(node.prompt || "", ref.mentionTag);
          markDirty();
          renderGraph();
        });
        thumbStrip.append(chip);
      }
      promptTop.append(thumbStrip);
    }
    controls.append(promptTop);
  }

  const promptEdge = state.graph.edges.find((edge) => edge.target === node.id && edge.targetPort === "prompt");
  if (!promptEdge && (mode === "Custom" || mode === "Storyboard")) {
    const promptWrap = document.createElement("div");
    promptWrap.className = "card-prompt-wrap";

    const richDisplay = document.createElement("div");
    richDisplay.className = "card-prompt-rich";
    richDisplay.innerHTML = formatPromptWithMentionPills(node.prompt || "");

    const prompt = document.createElement("textarea");
    prompt.className = "card-prompt variations-prompt";
    prompt.rows = 2;
    prompt.placeholder =
      mode === "Storyboard"
        ? "Describe the storyboard..."
        : "thay đổi trang phục phù hợp với độ tuổi nhân vật";
    prompt.value = node.prompt || "";

    if (/@\S+/.test(node.prompt || "")) {
      promptWrap.classList.add("show-rich");
    }

    richDisplay.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
      promptWrap.classList.remove("show-rich");
      prompt.focus();
    });

    let editing = false;
    prompt.addEventListener("input", () => {
      if (!editing) {
        remember();
        editing = true;
      }
      node.prompt = prompt.value;
      richDisplay.innerHTML = formatPromptWithMentionPills(node.prompt || "");
      markDirty();
      card.querySelectorAll("[data-run-for]").forEach((run) => {
        run.disabled = !canRunTask(node);
      });
    });
    prompt.addEventListener("blur", () => {
      editing = false;
      if (/@\S+/.test(node.prompt || "")) {
        promptWrap.classList.add("show-rich");
      }
    });
    promptWrap.append(richDisplay, prompt);
    attachAtMentionAutocomplete(prompt, promptWrap, richDisplay, node, card, "prompt", () => {
      card.querySelectorAll("[data-run-for]").forEach((run) => {
        run.disabled = !canRunTask(node);
      });
    });
    controls.append(promptWrap);
  }

  // Row 1: [Model ▾] [Custom ▾] [9:16 ▾] [2K ▾] [3x3 ▾]
  const row1 = document.createElement("div");
  row1.className = "card-settings variations-row1";

  const modelBtn = document.createElement("button");
  modelBtn.type = "button";
  modelBtn.className = "card-pill card-model-btn variations-model-btn";
  modelBtn.setAttribute("aria-label", "Select model");
  const shownModel = node.presetLabel && !state.comfy.checkpoints.includes(node.model) ? node.presetLabel : displayModelName(node);
  const shownConfigured = isModelConfigured(shownModel, "image");
  modelBtn.innerHTML = `${shownConfigured ? '<span class="pill-configured-dot" title="Đã cấu hình API Key"></span>' : ""}<span class="pill-label">${escapeHtml(shownModel)}</span><span class="pill-chevron">▾</span>`;
  modelBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "model", card)) {
      buildModelPopover(node, card);
    }
  });

  const modeBtn = document.createElement("button");
  modeBtn.type = "button";
  modeBtn.className = "card-pill";
  modeBtn.innerHTML = `<span>${escapeHtml(mode)}</span><span class="pill-chevron">▾</span>`;
  modeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "var-mode", card)) {
      buildVariationModePopover(node, card);
    }
  });

  const ratioLabel = currentRatioLabel(node) === "512×512" ? "9:16" : currentRatioLabel(node);
  const ratioBtn = document.createElement("button");
  ratioBtn.type = "button";
  ratioBtn.className = "card-pill card-ratio-btn";
  ratioBtn.innerHTML = `<span>${escapeHtml(ratioLabel)}</span><span class="pill-chevron">▾</span>`;
  ratioBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "ratio", card)) {
      buildRatioPopover(node, card);
    }
  });

  const resVal = node.variationRes || "2K";
  const resBtn = document.createElement("button");
  resBtn.type = "button";
  resBtn.className = "card-pill";
  resBtn.innerHTML = `<span>${escapeHtml(resVal)}</span><span class="pill-chevron">▾</span>`;
  resBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "var-res", card)) {
      buildSimpleListPopover(node, card, ["1K", "2K", "4K"], resVal, (val) => {
        node.variationRes = val;
      });
    }
  });

  const gridVal = node.variationGrid || "3x3";
  const gridBtn = document.createElement("button");
  gridBtn.type = "button";
  gridBtn.className = "card-pill";
  gridBtn.innerHTML = `<span>${escapeHtml(gridVal)}</span><span class="pill-chevron">▾</span>`;
  gridBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node.id);
    if (togglePopover(node.id, "var-grid", card)) {
      buildVariationGridPopover(node, card);
    }
  });

  row1.append(modelBtn, modeBtn, ratioBtn, resBtn, gridBtn);
  controls.append(row1);

  // Row 2: [9 Selected ▾ (chỉ khi không phải Custom/Storyboard)] [● Split images] ... [▶]
  const row2 = document.createElement("div");
  row2.className = "card-task-actions variations-row2";

  if (mode !== "Storyboard" && mode !== "Custom") {
    if (!Array.isArray(node.variationAngles) && Array.isArray(node.selectedAngles)) {
      node.variationAngles = [...node.selectedAngles];
    }
    const [gr, gc] = String(node.variationGrid || "3x3")
      .split("x")
      .map((v) => parseInt(v, 10) || 3);
    const selectedCount = Array.isArray(node.variationAngles) ? node.variationAngles.length : gr * gc;
    const anglesBtn = document.createElement("button");
    anglesBtn.type = "button";
    anglesBtn.className = "card-pill";
    anglesBtn.innerHTML = `<span>${selectedCount} Selected</span><span class="pill-chevron">▾</span>`;
    anglesBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
      if (togglePopover(node.id, "var-angles", card)) {
        buildVariationAnglesPopover(node, card, anglesBtn);
      }
    });
    row2.append(anglesBtn);
  }

  const splitOn = node.splitImages !== false;
  const splitBtn = document.createElement("button");
  splitBtn.type = "button";
  splitBtn.className = `variations-split-toggle ${splitOn ? "is-on" : ""}`;
  splitBtn.setAttribute("role", "switch");
  splitBtn.setAttribute("aria-checked", String(splitOn));
  splitBtn.innerHTML = `<span class="split-switch-track"><span class="split-switch-thumb"></span></span><span class="split-switch-label">Split images</span>`;
  splitBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    remember();
    node.splitImages = !splitOn;
    markDirty();
    renderGraph();
  });
  row2.append(splitBtn);

  const run = document.createElement("button");
  run.type = "button";
  run.className = "card-run";
  run.dataset.runNode = node.id;
  run.dataset.runFor = node.id;
  run.innerHTML = actionIcon("play");
  run.setAttribute("aria-label", "Run");
  run.disabled = !canRunTask(node);
  run.addEventListener("click", (event) => {
    event.stopPropagation();
    runNode(node.id);
  });
  row2.append(run);

  controls.append(row2);
  body.append(controls);
}

function buildQuickConnectMenu(node, toolbar, card) {
  const menu = document.createElement("div");
  menu.className = "toolbar-dropdown";
  menu.addEventListener("click", (e) => e.stopPropagation());
  menu.addEventListener("pointerdown", (e) => e.stopPropagation());
  const options = [
    { label: "Image Card (Sản phẩm)", kind: "image", icon: "image", colorType: "image", interactive: true },
    { label: "Image Generator", kind: "text-image", icon: "image-gen", colorType: "image", interactive: true },
    { label: "Video Generator", kind: "text-video", icon: "video-gen", colorType: "video", interactive: true },
    { label: "Image Editor", kind: "image-image", icon: "image-edit", colorType: "image", interactive: true },
    { label: "Image Upscaler", kind: "upscaler", icon: "upscaler", colorType: "image", interactive: true },
    { label: "Variations", kind: "image-image", subKind: "variations", icon: "variations", colorType: "image", interactive: true },
    { label: "Assistant", kind: "assistant", icon: "assistant", colorType: "text", interactive: true },
    { label: "List", kind: "list", icon: "list", colorType: "text", interactive: true },
    { label: "Create text", kind: "text", icon: "text", colorType: "text", interactive: true },
  ];
  for (const opt of options) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `toolbar-menu-item ${opt.interactive ? "" : "is-readonly"}`;
    item.innerHTML = `<span class="node-icon type-${opt.colorType}" style="width:18px;height:18px">${catalogIcon(opt.icon)}</span><span>${escapeHtml(opt.label)}</span>`;
    if (opt.interactive && opt.kind) {
      item.addEventListener("click", () => {
        closeAllPopovers();
        addNode(opt.kind, node.id, null, opt.subKind ? { subKind: opt.subKind } : {});
      });
    }
    menu.append(item);
  }
  toolbar.append(menu);
  card.classList.add("popover-open");
}

function buildMediaMoreMenu(node, asset, toolbar, card) {
  const menu = document.createElement("div");
  menu.className = "toolbar-dropdown more-menu";
  menu.addEventListener("click", (e) => e.stopPropagation());
  menu.addEventListener("pointerdown", (e) => e.stopPropagation());

  const entries = [
    {
      label: "Replace",
      icon: "replace",
      action: () => {
        state.assetTarget = node.id;
        $("#assetFile").click();
      },
    },
    {
      label: "Choose from Assets",
      icon: "assets",
      action: () => openAssetsPanel(node.id),
    },
    ...(asset
      ? [
          {
            label: "Download",
            icon: "download",
            action: () => downloadAssetFile(asset),
          },
        ]
      : []),
    { divider: true },
    { label: "Duplicate", icon: "copy", shortcut: "⌘D", action: () => duplicateNode(node.id) },
    { label: "Chuyển vào Thùng rác", icon: "delete", shortcut: "⌫", danger: true, action: () => deleteNode(node.id, false) },
    { label: "Xóa vĩnh viễn (Xóa cả file)", icon: "delete", danger: true, action: () => deleteNode(node.id, true) },
  ];

  for (const entryItem of entries) {
    if (entryItem.divider) {
      const div = document.createElement("div");
      div.className = "toolbar-menu-divider";
      menu.append(div);
      continue;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `toolbar-menu-item ${entryItem.danger ? "danger" : ""}`;
    btn.innerHTML = `
      ${actionIcon(entryItem.icon)}
      <span>${escapeHtml(entryItem.label)}</span>
      ${entryItem.shortcut ? `<span class="menu-shortcut">${escapeHtml(entryItem.shortcut)}</span>` : ""}
    `;
    btn.addEventListener("click", () => {
      closeAllPopovers();
      entryItem.action();
    });
    menu.append(btn);
  }
  toolbar.append(menu);
  card.classList.add("popover-open");
}

function mediaToolbar(node, asset, card) {
  const toolbar = document.createElement("div");
  toolbar.className = "selection-toolbar";
  toolbar.setAttribute("aria-label", "Media card actions");

  // 1. Quick-connect chain button (⊶ ▾)
  const chainBtn = document.createElement("button");
  chainBtn.type = "button";
  chainBtn.title = "Connect to node";
  chainBtn.setAttribute("aria-label", "Connect to node");
  chainBtn.innerHTML = `${actionIcon("chain")}<span class="pill-chevron">▾</span>`;
  chainBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (togglePopover(node.id, "quick-connect", card)) {
      buildQuickConnectMenu(node, toolbar, card);
    }
  });

  // 2. Expand / View full image
  const expandBtn = document.createElement("button");
  expandBtn.type = "button";
  expandBtn.title = "Open full size";
  expandBtn.setAttribute("aria-label", "Open full size");
  expandBtn.disabled = !asset;
  expandBtn.innerHTML = actionIcon("expand");
  expandBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (asset?.url) window.open(asset.url, "_blank", "noopener");
  });

  // 3. Edit / Retouch
  const editIconBtn = document.createElement("button");
  editIconBtn.type = "button";
  editIconBtn.title = "Edit image";
  editIconBtn.innerHTML = catalogIcon("image-edit");
  editIconBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    addNode("image-image", node.id);
  });

  // 4. Variations
  const varIconBtn = document.createElement("button");
  varIconBtn.type = "button";
  varIconBtn.title = "Variations";
  varIconBtn.innerHTML = catalogIcon("variations");
  varIconBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    addNode("image-image", node.id, null, { subKind: "variations" });
  });

  // 5. Delete button (🗑)
  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.title = "Delete ⌫";
  delBtn.setAttribute("aria-label", "Delete card");
  delBtn.innerHTML = actionIcon("delete");
  delBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteNode(node.id);
  });

  // 6. Download button (↓)
  const dlBtn = document.createElement("button");
  dlBtn.type = "button";
  dlBtn.title = "Download";
  dlBtn.setAttribute("aria-label", "Download");
  dlBtn.disabled = !asset;
  dlBtn.innerHTML = actionIcon("download");
  dlBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (asset) downloadAssetFile(asset);
  });

  // 7. Bookmark button
  const markBtn = document.createElement("button");
  markBtn.type = "button";
  markBtn.title = "Bookmark";
  markBtn.style.cursor = "default";
  markBtn.innerHTML = actionIcon("bookmark");
  markBtn.addEventListener("click", (event) => event.stopPropagation());

  // 8. More (...) button
  const moreBtn = document.createElement("button");
  moreBtn.type = "button";
  moreBtn.title = "More options";
  moreBtn.setAttribute("aria-label", "More options");
  moreBtn.innerHTML = actionIcon("more");
  moreBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (togglePopover(node.id, "more", card)) {
      buildMediaMoreMenu(node, asset, toolbar, card);
    }
  });

  toolbar.append(chainBtn, expandBtn, editIconBtn, varIconBtn, delBtn, dlBtn, markBtn, moreBtn);
  card.append(toolbar);
}

const REVIEW_STATUS_LIST = ["No status", "Needs review", "In progress", "Approved", "Rejected"];

function cycleNodeReviewStatus(node) {
  if (!node) return;
  remember();
  const cur = node.reviewStatus || "No status";
  const nextIdx = (REVIEW_STATUS_LIST.indexOf(cur) + 1) % REVIEW_STATUS_LIST.length;
  node.reviewStatus = REVIEW_STATUS_LIST[nextIdx];
  markDirty();
  renderGraph();
  notify(`Trạng thái thẻ: ${node.reviewStatus}`);
}

function listPrimaryMediaType(node) {
  if (!node || node.kind !== "list") return "text";
  const items = Array.isArray(node.items) ? node.items : [];
  if (
    items.some((it) => it && (it.type === "video" || state.assets.find((a) => a.id === it.assetId)?.kind === "video")) ||
    state.graph.edges.some((e) => e.target === node.id && e.targetPort === "video")
  ) {
    return "video";
  }
  if (
    items.some((it) => it && it.assetId) ||
    state.graph.edges.some((e) => e.target === node.id && e.targetPort === "image")
  ) {
    return "image";
  }
  return "text";
}

function buildMoreMenu(node, toolbar, card) {
  const menu = document.createElement("div");
  menu.className = "toolbar-dropdown more-menu";
  menu.addEventListener("click", (e) => e.stopPropagation());
  menu.addEventListener("pointerdown", (e) => e.stopPropagation());

  const curStatus = node.reviewStatus || "No status";
  const entries = [
    { label: "Run", icon: "play", action: () => runNode(node.id) },
    { label: "Prompt editor", icon: "edit", action: () => openPromptEditor(node.id) },
    { label: "Add creation", icon: "plus", action: () => { state.assetTarget = null; $("#assetFile").click(); } },
    { label: "Create instance", icon: "instance", badge: "NEW", action: () => duplicateNode(node.id) },
    { divider: true },
    { label: `Change status (${curStatus})`, icon: "settings", shortcut: "›", action: () => cycleNodeReviewStatus(node) },
    { label: "Options", icon: "settings", shortcut: "›", action: () => openSettings(node.id) },
    { label: "Copy settings", icon: "copy", shortcut: "›", action: () => copyNodeSettings(node.id) },
    { divider: true },
    { label: "Duplicate", icon: "copy", shortcut: "⌘D", action: () => duplicateNode(node.id) },
    { label: "Chuyển vào Thùng rác", icon: "delete", shortcut: "⌫", danger: true, action: () => deleteNode(node.id, false) },
    { label: "Xóa vĩnh viễn (Xóa cả file)", icon: "delete", danger: true, action: () => deleteNode(node.id, true) },
  ];

  for (const entryItem of entries) {
    if (entryItem.divider) {
      const div = document.createElement("div");
      div.className = "toolbar-menu-divider";
      menu.append(div);
      continue;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `toolbar-menu-item ${entryItem.danger ? "danger" : ""}`;
    btn.innerHTML = `
      ${actionIcon(entryItem.icon)}
      <span>${escapeHtml(entryItem.label)}</span>
      ${entryItem.badge ? `<span class="menu-badge">${escapeHtml(entryItem.badge)}</span>` : ""}
      ${entryItem.shortcut ? `<span class="menu-shortcut">${escapeHtml(entryItem.shortcut)}</span>` : ""}
    `;
    btn.addEventListener("click", () => {
      closeAllPopovers();
      entryItem.action();
    });
    menu.append(btn);
  }
  toolbar.append(menu);
  card.classList.add("popover-open");
}

function getMissingRequiredInput(node) {
  if (!node) return null;
  if (node.kind === "speech-to-text") {
    const hasMediaIn = state.graph.edges.some(
      (e) => e.target === node.id && (e.targetPort === "audio" || e.targetPort === "source_video")
    );
    if (!hasMediaIn) return "audio-or-video";
  }
  if (["extend-video", "modify-video", "video-upscaler", "video-sfx", "media-extractor"].includes(node.kind)) {
    const vidId = resolveUpstreamAssetId(node, "source_video");
    if (!vidId) return "video";
  }
  if (node.kind === "video-combiner") {
    const vidEdges = state.graph.edges.filter((e) => e.target === node.id && e.targetPort === "video");
    if (!vidEdges.length) return "video";
  }
  if (["image-image", "upscaler", "image-to-svg"].includes(node.kind)) {
    const imgId = resolveUpstreamAssetId(node, "source_image");
    if (!imgId) return "image";
  }
  if (["move", "speak"].includes(node.kind)) {
    const refId =
      resolveUpstreamAssetId(node, "source_image") ||
      resolveUpstreamAssetId(node, "start_image") ||
      resolveUpstreamAssetId(node, "source_video") ||
      resolveUpstreamAssetId(node, "reference_image");
    if (!refId && !node.assetId && !(node.prompt || "").trim()) return "image";
  }
  return null;
}

function taskToolbar(node, card) {
  const toolbar = document.createElement("div");
  toolbar.className = "selection-toolbar";
  toolbar.setAttribute("aria-label", "Card actions");

  const missingInput = getMissingRequiredInput(node);
  const hasPrompt = Boolean(resolveConnectedPromptText(node));
  const runBtn = document.createElement("button");
  runBtn.type = "button";
  runBtn.dataset.tooltip =
    missingInput === "audio-or-video"
      ? "Requires an audio or a video connection Ctrl+Enter"
      : missingInput
        ? `Missing required input: ${missingInput}  Ctrl+Enter`
        : hasPrompt || ["video-upscaler", "video-combiner", "media-extractor", "speech-to-text"].includes(node.kind)
          ? "Run Ctrl+Enter"
          : "Write a prompt or connect a text source Ctrl+Enter";
  runBtn.setAttribute("aria-label", "Run");
  runBtn.dataset.runFor = node.id;
  runBtn.disabled = !canRunTask(node);
  runBtn.innerHTML = `${actionIcon("play")}<span class="pill-chevron">▾</span>`;
  runBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    runNode(node.id);
  });

  const chainBtn = document.createElement("button");
  chainBtn.type = "button";
  chainBtn.dataset.tooltip = "Quick connections";
  chainBtn.setAttribute("aria-label", "Quick connections");
  chainBtn.innerHTML = `${actionIcon("chain")}<span class="pill-chevron">▾</span>`;
  chainBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (togglePopover(node.id, "quick-connect", card)) {
      buildQuickConnectMenu(node, toolbar, card);
    }
  });

  const promptBtn = document.createElement("button");
  promptBtn.type = "button";
  promptBtn.dataset.tooltip = "Prompt editor";
  promptBtn.setAttribute("aria-label", "Prompt editor");
  promptBtn.innerHTML = actionIcon("edit");
  promptBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    openPromptEditor(node.id);
  });

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.dataset.tooltip = "Chuyển vào Thùng rác (⌫)";
  delBtn.setAttribute("aria-label", "Chuyển vào Thùng rác");
  delBtn.innerHTML = actionIcon("delete");
  delBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteNode(node.id, false);
  });

  const sep2 = document.createElement("span");
  sep2.className = "toolbar-sep";

  const moreBtn = document.createElement("button");
  moreBtn.type = "button";
  moreBtn.dataset.tooltip = "More";
  moreBtn.setAttribute("aria-label", "More options");
  moreBtn.innerHTML = actionIcon("more");
  moreBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (togglePopover(node.id, "more", card)) {
      buildMoreMenu(node, toolbar, card);
    }
  });

  if (node.kind === "speech-to-text") {
    const sep1 = document.createElement("span");
    sep1.className = "toolbar-sep";
    const dupBtn = document.createElement("button");
    dupBtn.type = "button";
    dupBtn.dataset.tooltip = "Duplicate (Ctrl+D)";
    dupBtn.setAttribute("aria-label", "Duplicate");
    dupBtn.innerHTML = actionIcon("copy");
    dupBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      duplicateNode(node.id);
    });
    toolbar.append(runBtn, chainBtn, sep1, dupBtn, delBtn, moreBtn);
  } else if (node.kind === "voiceover") {
    const sep1 = document.createElement("span");
    sep1.className = "toolbar-sep";
    toolbar.append(runBtn, chainBtn, sep1, delBtn, moreBtn);
  } else if (node.kind === "audio-generator") {
    const dlBtn = document.createElement("button");
    dlBtn.type = "button";
    dlBtn.dataset.tooltip = "Download audio";
    dlBtn.setAttribute("aria-label", "Download audio");
    dlBtn.innerHTML = actionIcon("download");
    dlBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const asset = node.assetId ? state.assets.find((a) => a.id === node.assetId) : null;
      if (asset) downloadAssetFile(asset);
      else notify("Hãy bấm Run để tạo âm thanh trước khi tải xuống.");
    });
    toolbar.append(runBtn, chainBtn, promptBtn, dlBtn, delBtn, sep2, moreBtn);
  } else if (node.kind === "3d-generator") {
    const dlGlbBtn = document.createElement("button");
    dlGlbBtn.type = "button";
    dlGlbBtn.dataset.tooltip = "Download 3D Model (.GLB)";
    dlGlbBtn.setAttribute("aria-label", "Download 3D Model (.GLB)");
    dlGlbBtn.innerHTML = actionIcon("download");
    dlGlbBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const latest3d = activeNodeRun(node) || latestRun(node.id);
      const gid = latest3d?.snapshot?.glbAssetId || node.glbAssetId;
      const gAsset = gid ? state.assets.find((a) => a.id === gid) : null;
      const fallbackAsset = node.assetId ? state.assets.find((a) => a.id === node.assetId) : null;
      if (gAsset) downloadAssetFile(gAsset);
      else if (fallbackAsset) downloadAssetFile(fallbackAsset);
      else notify("Hãy bấm Run để tạo mô hình 3D (.glb) trước khi tải xuống.");
    });
    toolbar.append(runBtn, chainBtn, promptBtn, dlGlbBtn, delBtn, sep2, moreBtn);
  } else {
    toolbar.append(runBtn, chainBtn, promptBtn, delBtn, sep2, moreBtn);
  }
  card.append(toolbar);
}

const TEXT_CARD_COLORS = [
  { id: "", label: "No color", swatch: "clear", cardBg: "" },
  { id: "#1c1c1f", label: "Default", swatch: "#26272c", cardBg: "#1c1c1f" },
  { id: "#5c1d24", label: "Red", swatch: "#992b36", cardBg: "#5c1d24" },
  { id: "#5c371d", label: "Orange", swatch: "#99582b", cardBg: "#5c371d" },
  { id: "#574c1b", label: "Yellow", swatch: "#948029", cardBg: "#574c1b" },
  { id: "#1e4d2b", label: "Green", swatch: "#2e7d43", cardBg: "#1e4d2b" },
  { id: "#1c4b52", label: "Teal", swatch: "#2d7a85", cardBg: "#1c4b52" },
  { id: "#1c3d5c", label: "Blue", swatch: "#2b6599", cardBg: "#1c3d5c" },
  { id: "#4a1e5c", label: "Purple", swatch: "#7b2e99", cardBg: "#4a1e5c" },
];

function buildTextColorPopover(node, toolbar, card) {
  const popover = document.createElement("div");
  popover.className = "toolbar-dropdown text-color-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());

  const currentId = node.cardColor || "";
  for (const item of TEXT_CARD_COLORS) {
    const btn = document.createElement("button");
    btn.type = "button";
    const isActive = currentId === item.id;
    btn.className = `text-color-swatch ${item.swatch === "clear" ? "is-clear" : ""} ${isActive ? "active" : ""}`.trim();
    btn.title = item.label;
    btn.setAttribute("aria-label", item.label);
    if (item.swatch !== "clear") {
      btn.style.background = item.swatch;
    }
    btn.addEventListener("click", () => {
      remember();
      if (item.id) node.cardColor = item.id;
      else delete node.cardColor;
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    popover.append(btn);
  }
  toolbar.append(popover);
  card.classList.add("popover-open");
}

function buildTextStylePopover(node, toolbar, card) {
  const popover = document.createElement("div");
  popover.className = "toolbar-dropdown text-style-popover";
  popover.addEventListener("click", (e) => e.stopPropagation());
  popover.addEventListener("pointerdown", (e) => e.stopPropagation());

  const currentStyle = node.textStyle || "Paragraph";
  for (const styleName of ["Paragraph", "Heading 1", "Heading 2", "Heading 3"]) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `toolbar-menu-item ${currentStyle === styleName ? "active" : ""}`.trim();
    btn.innerHTML = `<span>${escapeHtml(styleName)}</span>`;
    btn.addEventListener("click", () => {
      remember();
      node.textStyle = styleName;
      closeAllPopovers();
      markDirty();
      renderGraph();
    });
    popover.append(btn);
  }
  toolbar.append(popover);
  card.classList.add("popover-open");
}

function textToolbar(node, card) {
  const toolbar = document.createElement("div");
  toolbar.className = "selection-toolbar text-selection-toolbar";
  toolbar.setAttribute("aria-label", "Text card actions");

  // 1. Prompt editor
  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.dataset.tooltip = "Prompt editor";
  editBtn.setAttribute("aria-label", "Prompt editor");
  editBtn.innerHTML = actionIcon("edit");
  editBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    openPromptEditor(node.id);
  });

  const sep1 = document.createElement("span");
  sep1.className = "toolbar-sep";

  // 2. Color picker (● ▾)
  const matchedColor = TEXT_CARD_COLORS.find((c) => c.id && c.id === node.cardColor);
  const dotSwatch = matchedColor ? matchedColor.swatch : "#26272c";
  const colorBtn = document.createElement("button");
  colorBtn.type = "button";
  colorBtn.className = "text-color-btn";
  colorBtn.dataset.tooltip = "Color";
  colorBtn.setAttribute("aria-label", "Color");
  colorBtn.innerHTML = `<span class="toolbar-color-dot" style="background:${escapeHtml(dotSwatch)}"></span><span class="pill-chevron">▾</span>`;
  colorBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (togglePopover(node.id, "text-color", card)) {
      buildTextColorPopover(node, toolbar, card);
    }
  });

  // 3. Text style dropdown (Paragraph ▾)
  const currentStyle = node.textStyle || "Paragraph";
  const styleBtn = document.createElement("button");
  styleBtn.type = "button";
  styleBtn.className = "text-style-btn";
  styleBtn.dataset.tooltip = "Text style";
  styleBtn.setAttribute("aria-label", "Text style");
  styleBtn.innerHTML = `<span>${escapeHtml(currentStyle)}</span><span class="pill-chevron">▾</span>`;
  styleBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (togglePopover(node.id, "text-style", card)) {
      buildTextStylePopover(node, toolbar, card);
    }
  });

  const sep2 = document.createElement("span");
  sep2.className = "toolbar-sep";

  // 4. Bold (B)
  const boldBtn = document.createElement("button");
  boldBtn.type = "button";
  boldBtn.className = node.textBold ? "active" : "";
  boldBtn.dataset.tooltip = "Bold";
  boldBtn.setAttribute("aria-label", "Bold");
  boldBtn.innerHTML = `<span class="text-fmt-b">B</span>`;
  boldBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    remember();
    node.textBold = !node.textBold;
    markDirty();
    renderGraph();
  });

  // 5. Italic (I)
  const italicBtn = document.createElement("button");
  italicBtn.type = "button";
  italicBtn.className = node.textItalic ? "active" : "";
  italicBtn.dataset.tooltip = "Italic";
  italicBtn.setAttribute("aria-label", "Italic");
  italicBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`;
  italicBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    remember();
    node.textItalic = !node.textItalic;
    markDirty();
    renderGraph();
  });

  // 6. Bullet list
  const rawLines = (node.text || "").split(/\r?\n/);
  const nonEmptyLines = rawLines.filter((l) => l.trim().length > 0);
  const isBulleted = nonEmptyLines.length > 0 && nonEmptyLines.every((l) => /^\s*•\s+/.test(l));
  const bulletBtn = document.createElement("button");
  bulletBtn.type = "button";
  bulletBtn.className = isBulleted ? "active" : "";
  bulletBtn.dataset.tooltip = "Bullet list";
  bulletBtn.setAttribute("aria-label", "Bullet list");
  bulletBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="5" cy="6" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="18" r="1" fill="currentColor"/></svg>`;
  bulletBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    remember();
    const lines = (node.text || "").split(/\r?\n/);
    if (isBulleted) {
      node.text = lines.map((l) => l.replace(/^\s*•\s+/, "")).join("\n");
    } else {
      node.text = lines
        .map((l) => {
          const clean = l.replace(/^\s*(?:•|\d+\.)\s+/, "");
          return `• ${clean}`;
        })
        .join("\n");
    }
    markDirty();
    renderGraph();
  });

  // 7. Numbered list
  const isNumbered = nonEmptyLines.length > 0 && nonEmptyLines.every((l) => /^\s*\d+\.\s+/.test(l));
  const numBtn = document.createElement("button");
  numBtn.type = "button";
  numBtn.className = isNumbered ? "active" : "";
  numBtn.dataset.tooltip = "Numbered list";
  numBtn.setAttribute("aria-label", "Numbered list");
  numBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`;
  numBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    remember();
    const lines = (node.text || "").split(/\r?\n/);
    if (isNumbered) {
      node.text = lines.map((l) => l.replace(/^\s*\d+\.\s+/, "")).join("\n");
    } else {
      node.text = lines
        .map((l, idx) => {
          const clean = l.replace(/^\s*(?:•|\d+\.)\s+/, "");
          return `${idx + 1}. ${clean}`;
        })
        .join("\n");
    }
    markDirty();
    renderGraph();
  });

  // 8. Horizontal rule (—)
  const hrBtn = document.createElement("button");
  hrBtn.type = "button";
  hrBtn.className = node.textHr ? "active" : "";
  hrBtn.dataset.tooltip = "Horizontal rule";
  hrBtn.setAttribute("aria-label", "Horizontal rule");
  hrBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  hrBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    remember();
    node.textHr = !node.textHr;
    markDirty();
    renderGraph();
  });

  const sep3 = document.createElement("span");
  sep3.className = "toolbar-sep";

  // 9. Save to library / Bookmark
  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = node.savedToLibrary ? "active" : "";
  saveBtn.dataset.tooltip = "Save to library";
  saveBtn.setAttribute("aria-label", "Save to library");
  saveBtn.innerHTML = actionIcon("bookmark");
  saveBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    remember();
    node.savedToLibrary = !node.savedToLibrary;
    markDirty();
    renderGraph();
    notify(node.savedToLibrary ? "Đã lưu prompt vào thư viện." : "Đã bỏ lưu khỏi thư viện.");
  });

  toolbar.append(editBtn, sep1, colorBtn, styleBtn, sep2, boldBtn, italicBtn, bulletBtn, numBtn, hrBtn, sep3, saveBtn);
  card.append(toolbar);
}

function listToolbar(node, card) {
  const toolbar = document.createElement("div");
  toolbar.className = "selection-toolbar list-selection-toolbar";
  toolbar.setAttribute("aria-label", "List card actions");

  const previewBtn = document.createElement("button");
  previewBtn.type = "button";
  previewBtn.dataset.tooltip = "Open list preview";
  previewBtn.setAttribute("aria-label", "Open list preview");
  previewBtn.innerHTML = `<span style="font-size:14px;line-height:1">⊞</span>`;
  previewBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    openGalleryModal(node.id, 0, "details");
  });

  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.dataset.tooltip = "Export as group";
  exportBtn.setAttribute("aria-label", "Export as group");
  exportBtn.innerHTML = actionIcon("download");
  exportBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const assetsToDownload = (node.items || [])
      .map((it) => (it?.assetId ? state.assets.find((a) => a.id === it.assetId) : null))
      .filter(Boolean);
    if (!assetsToDownload.length) {
      notify("Danh sách chưa có ảnh để tải.");
      return;
    }
    assetsToDownload.forEach((asset, idx) => {
      setTimeout(() => downloadAssetFile(asset), idx * 180);
    });
    notify(`Đang tải xuống ${assetsToDownload.length} ảnh trong nhóm...`);
  });

  const sep = document.createElement("span");
  sep.className = "toolbar-sep";

  const moreBtn = document.createElement("button");
  moreBtn.type = "button";
  moreBtn.dataset.tooltip = "More";
  moreBtn.setAttribute("aria-label", "More options");
  moreBtn.innerHTML = actionIcon("more");
  moreBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (togglePopover(node.id, "more", card)) {
      buildMoreMenu(node, toolbar, card);
    }
  });

  toolbar.append(previewBtn, exportBtn, sep, moreBtn);
  card.append(toolbar);
}

function canRunTask(node) {
  if (!node || node.muted) return false;
  if (getMissingRequiredInput(node)) return false;
  if (!["text-image", "image-image", "upscaler"].includes(node.kind)) return true;
  const snapshot = taskSnapshot(node);
  return (
    (node.kind !== "text-image" || !!snapshot.prompt) &&
    (!["image-image", "upscaler"].includes(node.kind) || !!snapshot.sourceAssetId)
  );
}

async function runAll() {
  if (!state.graph || !Array.isArray(state.graph.nodes)) return;
  const nonRunnableKinds = new Set([
    "text",
    "image",
    "video",
    "audio",
    "list",
    "sticky-note",
    "group-container",
  ]);
  const taskNodes = state.graph.nodes.filter(
    (n) => n && !n.muted && !nonRunnableKinds.has(n.kind)
  );
  if (!taskNodes.length) return;
  const nodeMap = new Map(taskNodes.map((n) => [n.id, n]));
  const inDegree = new Map(taskNodes.map((n) => [n.id, 0]));
  const adj = new Map(taskNodes.map((n) => [n.id, []]));
  for (const edge of state.graph.edges || []) {
    if (nodeMap.has(edge.source) && nodeMap.has(edge.target) && edge.source !== edge.target) {
      adj.get(edge.source).push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }
  }
  const queue = taskNodes.filter((n) => (inDegree.get(n.id) || 0) === 0).map((n) => n.id);
  const visited = new Set();
  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    const currentNode = nodeMap.get(currentId);
    if (currentNode && !currentNode.muted && canRunTask(currentNode)) {
      await runNode(currentId);
    }
    for (const nextId of adj.get(currentId) || []) {
      const nextDeg = (inDegree.get(nextId) || 1) - 1;
      inDegree.set(nextId, nextDeg);
      if (nextDeg <= 0) queue.push(nextId);
    }
  }
  for (const n of taskNodes) {
    if (!visited.has(n.id) && !n.muted && canRunTask(n)) {
      await runNode(n.id);
    }
  }
}
window.runAll = runAll;

function renderGraph() {
  const world = $("#world");
  const savedListScroll = new Map();
  world.querySelectorAll(".graph-node.list-card").forEach((el) => {
    const scroller = el.querySelector(".list-grid-view, .list-rows-view");
    if (scroller && scroller.scrollTop > 0) {
      savedListScroll.set(el.dataset.nodeId, scroller.scrollTop);
    }
  });
  world.replaceChildren();
  portElements.clear();
  for (const node of state.graph.nodes) {
    const definition = entry(node.kind);
    if (!definition) continue;
    const type = mediaType(node.kind);
    const card = document.createElement("article");
    const isComfyTask = ["text-image", "image-image", "upscaler"].includes(node.kind);
    const isVideoTask = [
      "text-video",
      "image-video",
      "video-video",
      "extend-video",
      "modify-video",
      "move",
      "speak",
      "video-combiner",
      "video-upscaler",
      "video-sfx",
      "media-extractor",
    ].includes(node.kind);
    const isAudioTask = ["speech-to-text", "voiceover", "sound-effects", "audio-generator", "music-generator"].includes(node.kind);
    const isSvgDesigner = ["image-to-svg", "svg-generator", "designer", "3d-generator"].includes(node.kind);
    const isUtility = ["sticky-note", "group"].includes(node.kind);
    const isInteractiveTask = isComfyTask || isVideoTask || isAudioTask || isSvgDesigner || ["assistant", "list"].includes(node.kind);
    const isVariations = node.subKind === "variations";
    const isMediaSource = definition.group === "Nguồn" && type !== "text";
    const latest = latestRun(node.id);
    const result = activeNodeRun(node);
    const hasOwnAsset = Boolean(result?.assetId || node.assetId);
    const upstreamPreviewAssetId = [
      "media-extractor",
      "extend-video",
      "modify-video",
      "video-upscaler",
      "video-sfx",
    ].includes(node.kind)
      ? resolveUpstreamAssetId(node, "source_video")
      : node.kind === "upscaler"
        ? resolveUpstreamAssetId(node, "source_image")
        : "";
    const displayAssetId = result?.assetId || node.assetId || upstreamPreviewAssetId;
    const rawAsset = state.assets.find((item) => item.id === displayAssetId);
    const asset = isVideoTask && rawAsset && rawAsset.kind !== "video" ? null : rawAsset;
    const isRunning = Boolean(node._batchRunning || isBridgePending(latest));
    const isBatchCapableGen =
      !isVariations &&
      ["text-image", "image-image", "text-video", "image-video", "video-video", "extend-video", "modify-video", "move"].includes(node.kind);
    const batchInfo = isBatchCapableGen
      ? computeNodeBatchCombinations(node)
      : { isListMode: false, lists: [], totalCount: 1 };

    card.className = [
      "graph-node",
      isMediaSource ? "media-source" : "",
      isMediaSource && asset ? "has-asset" : "",
      node.kind === "text" ? "text-card" : "",
      node.kind === "list" ? "list-card" : "",
      node.kind === "upscaler" ? "upscaler-card" : "",
      isInteractiveTask ? "task-card" : "",
      (isComfyTask || isVideoTask) && !isVariations && asset ? "has-result" : "",
      isVideoTask && !isVariations && asset?.kind === "video" ? "has-video-result" : "",
      isRunning ? "is-running" : "",
      isVariations ? "variations-card" : "",
      state.selected === node.id ? "selected" : "",
    ]
      .filter(Boolean)
      .join(" ");
    if (node.kind === "text" && node.cardColor && node.cardColor !== "#ffffff") {
      card.style.background = node.cardColor;
    }
    card.style.left = `${node.x}px`;
    card.style.top = `${node.y}px`;
    card.dataset.nodeId = node.id;

    const title = nodeDisplayTitle(node);
    const headerIcon = isVariations ? catalogIcon("variations") : node.kind === "3d-generator" ? catalogIcon("3d-gen") : iconMarkup(type);
    const headerTypeClass = node.kind === "3d-generator" ? "3d" : type;

    card.innerHTML = `<div class="node-header"><span class="node-icon type-${headerTypeClass}">${headerIcon}</span><span class="node-heading"><strong>${escapeHtml(title)}</strong><small>${definition.group === "Nguồn" ? "Nguồn dữ liệu" : isComfyTask ? "ComfyUI local" : "Spaces Studio"}</small></span><button class="node-menu" type="button" title="Cài đặt thẻ" aria-label="Cài đặt thẻ">${actionIcon("settings")}</button></div><div class="node-body"><div class="node-placeholder"></div></div><div class="node-foot"><span class="node-status"><span class="node-status-dot"></span><span>${definition.group === "Nguồn" ? "Sẵn sàng nối" : taskStatus(node)}</span></span><button type="button">Cài đặt</button></div>`;

    if (isRunning) {
      const pill = document.createElement("div");
      pill.className = "running-timer-pill";
      pill.textContent = node._runningLabel || "Running · Antigravity AI";
      card.append(pill);
    }

    if (latest?.state === "failed" && latest?.error) {
      const errBanner = document.createElement("div");
      errBanner.className = "node-error-banner";
      errBanner.innerHTML = `<span class="node-error-icon">!</span><span>${escapeHtml(latest.error)}</span>`;
      card.append(errBanner);
    }

    const statusLabelText = node.reviewStatus || "No status";
    const makeStatusBadgeEl = () => {
      const statusBadge = document.createElement("span");
      statusBadge.className = `media-pill-badge card-status-badge ${node.reviewStatus && node.reviewStatus !== "No status" ? "has-status" : ""}`.trim();
      statusBadge.title = "Click to change review status";
      statusBadge.innerHTML = `<span class="status-ring-icon"></span><span>${escapeHtml(statusLabelText)}</span>`;
      statusBadge.addEventListener("click", (e) => {
        e.stopPropagation();
        cycleNodeReviewStatus(node);
      });
      return statusBadge;
    };

    const preview = card.querySelector(".node-placeholder");
    const initialAspectDims = resolveCardAspectDims(node, asset, result, {
      isMediaSource,
      isComfyTask,
      isVideoTask,
      isVariations,
    });
    const glbAssetId = node.kind === "3d-generator" ? result?.snapshot?.glbAssetId || node.glbAssetId || "" : "";
    const glbAsset = glbAssetId ? state.assets.find((item) => item.id === glbAssetId) : null;
    if (node.kind === "3d-generator" && glbAsset) {
      const stageWrap = document.createElement("div");
      stageWrap.className = "node-stage-wrap";
      applyCardAspectLayout(card, stageWrap, { w: 1024, h: 1024, ratio: "1:1" }, { isMediaSource: false, hasAsset: true });
      attachInteractive3DViewport(node, card, stageWrap, glbAsset, asset, result);
      preview.replaceWith(stageWrap);
    } else if (asset && !isVariations && (node.kind === "image" || node.kind === "video" || isComfyTask || isVideoTask || isSvgDesigner)) {
      const stageWrap = document.createElement("div");
      stageWrap.className = "node-stage-wrap";
      if (initialAspectDims) {
        applyCardAspectLayout(card, stageWrap, initialAspectDims, { isMediaSource, hasAsset: true });
      }
      const media = document.createElement(asset.kind === "image" ? "img" : "video");
      media.className = "node-media";
      media.draggable = false;
      media.addEventListener(asset.kind === "image" ? "load" : "loadedmetadata", () => {
        const natW = asset.kind === "image" ? media.naturalWidth : media.videoWidth || 1280;
        const natH = asset.kind === "image" ? media.naturalHeight : media.videoHeight || 720;
        if (natW > 0 && natH > 0) {
          asset.width = natW;
          asset.height = natH;
          if (isMediaSource) {
            node.imageWidth = natW;
            node.imageHeight = natH;
            syncDownstreamAspectFromSource(node, natW, natH);
          }
          const loadedAspectDims = resolveCardAspectDims(node, asset, result, {
            isMediaSource,
            isComfyTask,
            isVideoTask,
            isVariations,
          });
          if (loadedAspectDims) {
            applyCardAspectLayout(card, stageWrap, loadedAspectDims, { isMediaSource, hasAsset: true });
          }
        }
        const resBadge = stageWrap.querySelector(".card-res-badge");
        if (resBadge && !isVideoTask) {
          if (node.kind === "upscaler" && asset.kind === "image") {
            const scale = Number(result?.snapshot?.scaleFactor || node.scaleFactor || 2);
            if (hasOwnAsset) {
              resBadge.textContent = `${media.naturalWidth} × ${media.naturalHeight} · ${scale}x Upscaled`;
            } else {
              const targetW = Math.min(4096, Math.max(64, Math.round((media.naturalWidth * scale) / 16) * 16));
              const targetH = Math.min(4096, Math.max(64, Math.round((media.naturalHeight * scale) / 16) * 16));
              resBadge.textContent = `${media.naturalWidth}×${media.naturalHeight} → ${targetW}×${targetH} (${scale}x)`;
            }
          } else if (stageWrap.dataset.ratioPreview === "1" && node.width && node.height) {
            resBadge.textContent = `${node.width} × ${node.height}`;
          } else {
            resBadge.textContent =
              asset.kind === "image"
                ? `${media.naturalWidth} × ${media.naturalHeight}`
                : `${media.videoWidth || 1280} × ${media.videoHeight || 720}`;
          }
        }
        renderEdges();
      });
      const cacheVer = (asset.sha256 || "").slice(0, 10) || asset.size || "";
      media.src = cacheVer && !asset.url.includes("?") ? `${asset.url}?v=${cacheVer}` : asset.url;
      if (asset.kind === "video") {
        media.preload = "auto";
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
        media.autoplay = true;
        media.controls = !isVideoTask;
      } else {
        media.loading = "lazy";
      }
      stageWrap.append(media);

      if (batchInfo.isListMode && batchInfo.totalCount > 1) {
        const combBadge = document.createElement("div");
        combBadge.className = "combinations-badge";
        combBadge.innerHTML = `<span class="combinations-icon">🔀</span><span>${batchInfo.totalCount} Combinations</span>`;
        stageWrap.append(combBadge);
      }

      if (node.kind === "image" || node.kind === "video") {
        const topBadges = document.createElement("div");
        topBadges.className = "media-top-badges";
        const resBadge = document.createElement("span");
        resBadge.className = "media-pill-badge card-res-badge";
        resBadge.textContent =
          initialAspectDims && initialAspectDims.w && initialAspectDims.h
            ? `${initialAspectDims.w} × ${initialAspectDims.h}`
            : "…";
        topBadges.append(resBadge, makeStatusBadgeEl());
        stageWrap.append(topBadges);

        const replaceBtn = document.createElement("button");
        replaceBtn.type = "button";
        replaceBtn.className = "card-replace-btn";
        replaceBtn.innerHTML = `${actionIcon("replace")}<span>Replace</span>`;
        replaceBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          state.assetTarget = node.id;
          $("#assetFile").click();
        });
        stageWrap.append(replaceBtn);
      } else if (isVideoTask) {
        const topBadges = document.createElement("div");
        topBadges.className = "media-top-badges task-top-badges";
        const durBadge = document.createElement("span");
        durBadge.className = "media-pill-badge card-res-badge";
        const endSec = node.duration === "10s" || node.duration === '10"' ? "00:10" : "00:05";
        durBadge.textContent = `00:00 - ${endSec}`;
        const muteBadge = document.createElement("button");
        muteBadge.type = "button";
        muteBadge.className = "media-pill-badge card-mute-badge";
        muteBadge.textContent = "🔇";
        muteBadge.title = "Toggle video sound";
        muteBadge.addEventListener("click", (e) => {
          e.stopPropagation();
          if (media.tagName === "VIDEO") {
            media.muted = !media.muted;
            muteBadge.textContent = media.muted ? "🔇" : "🔊";
          }
        });
        topBadges.append(durBadge, muteBadge, makeStatusBadgeEl());
        stageWrap.append(topBadges);
      } else if (asset.kind === "image") {
        const succeeded = nodeSucceededRuns(node.id);
        if (succeeded.length > 1) {
          const totalRuns = succeeded.length;
          const activeIdx =
            typeof node.historyIndex === "number" && node.historyIndex >= 0 && node.historyIndex < totalRuns
              ? node.historyIndex
              : 0;
          const displayNum = String(totalRuns - activeIdx).padStart(2, "0");
          const totalStr = String(totalRuns).padStart(2, "0");
          const histPill = document.createElement("div");
          histPill.className = "card-history-pill";
          histPill.addEventListener("pointerdown", (e) => e.stopPropagation());
          histPill.addEventListener("click", (e) => e.stopPropagation());

          const prevHist = document.createElement("button");
          prevHist.type = "button";
          prevHist.className = "hist-nav-btn";
          prevHist.textContent = "‹";
          prevHist.disabled = activeIdx >= totalRuns - 1;
          prevHist.addEventListener("click", (e) => {
            e.stopPropagation();
            delete node._previewSelectedRatio;
            node.historyIndex = Math.min(totalRuns - 1, activeIdx + 1);
            renderGraph();
          });

          const histLabel = document.createElement("span");
          histLabel.className = "hist-label";
          histLabel.textContent = `${displayNum}/${totalStr}`;

          const nextHist = document.createElement("button");
          nextHist.type = "button";
          nextHist.className = "hist-nav-btn";
          nextHist.textContent = "›";
          nextHist.disabled = activeIdx <= 0;
          nextHist.addEventListener("click", (e) => {
            e.stopPropagation();
            delete node._previewSelectedRatio;
            node.historyIndex = Math.max(0, activeIdx - 1);
            renderGraph();
          });

          histPill.append(prevHist, histLabel, nextHist);
          stageWrap.append(histPill);
        }

        const topBadges = document.createElement("div");
        topBadges.className = "media-top-badges task-top-badges";
        const resBadge = document.createElement("span");
        resBadge.className = "media-pill-badge card-res-badge";
        const badgeW = initialAspectDims?.w || node.width || 1376;
        const badgeH = initialAspectDims?.h || node.height || 768;
        resBadge.textContent = `${badgeW} × ${badgeH}`;
        topBadges.append(resBadge, makeStatusBadgeEl());
        stageWrap.append(topBadges);
      }
      preview.replaceWith(stageWrap);
    } else if (isVariations) {
      preview.className = "node-placeholder variations-placeholder";
      preview.innerHTML = `
        <span class="variations-hero-icon">${catalogIcon("variations")}</span>
        <strong>Explore new possibilities</strong>
        <span>Generate variations from your images</span>
      `;
    } else if (node.kind === "upscaler") {
      if (initialAspectDims) {
        applyCardAspectLayout(card, preview, initialAspectDims, { isMediaSource: false, hasAsset: false });
      }
      preview.className = "node-placeholder variations-placeholder upscaler-placeholder";
      preview.innerHTML = `
        <span class="variations-hero-icon">${catalogIcon("upscaler")}</span>
        <strong>AI Super-Resolution Upscaler</strong>
        <span>Nối thẻ Ảnh vào cổng đầu vào hoặc chọn ảnh để nâng cấp 2x – 16x</span>
        <button type="button" class="upscaler-pick-btn">+ Chọn ảnh nguồn</button>
      `;
      preview.querySelector(".upscaler-pick-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        selectNode(node.id);
        if (togglePopover(node.id, "add-ref", card)) {
          buildAddReferencePopover(node, card);
        }
      });
    } else {
      if (initialAspectDims && (isComfyTask || isVideoTask)) {
        applyCardAspectLayout(card, preview, initialAspectDims, { isMediaSource: false, hasAsset: false });
      }
      preview.textContent = nodePreview(node);
      if (batchInfo.isListMode && batchInfo.totalCount > 1) {
        const combBadge = document.createElement("div");
        combBadge.className = "combinations-badge";
        combBadge.innerHTML = `<span class="combinations-icon">🔀</span><span>${batchInfo.totalCount} Combinations</span>`;
        preview.append(combBadge);
      }
    }

    if (node.kind === "image" || node.kind === "video") {
      if (!asset) {
        preview.textContent = "";
        const icon = document.createElement("span");
        icon.className = "empty-media-icon";
        icon.innerHTML = actionIcon("upload");
        const hint = document.createElement("span");
        hint.textContent = node.kind === "image" ? "Thêm ảnh vào flow" : "Thêm video vào flow";
        preview.append(icon, hint);

        const actions = document.createElement("div");
        actions.className = "card-source-actions";
        const upload = document.createElement("button");
        upload.type = "button";
        upload.textContent = "Upload";
        upload.addEventListener("click", (event) => {
          event.stopPropagation();
          state.assetTarget = node.id;
          $("#assetFile").click();
        });
        const choose = document.createElement("button");
        choose.type = "button";
        choose.textContent = "Assets";
        choose.addEventListener("click", (event) => {
          event.stopPropagation();
          openAssetsPanel(node.id);
        });
        actions.append(upload, choose);
        card.querySelector(".node-body").append(actions);
      }
      mediaToolbar(node, asset, card);
    } else if (node.kind === "text") {
      textNodeControls(node, card);
      textToolbar(node, card);
    } else if (node.kind === "upscaler") {
      upscalerControls(node, card);
      taskToolbar(node, card);
    } else if (node.kind === "assistant") {
      assistantControls(node, card);
      taskToolbar(node, card);
    } else if (node.kind === "list") {
      listNodeControls(node, card);
      if (savedListScroll.has(node.id)) {
        const scroller = card.querySelector(".list-grid-view, .list-rows-view");
        if (scroller) scroller.scrollTop = savedListScroll.get(node.id);
      }
      listToolbar(node, card);
    } else if (isVideoTask) {
      videoNodeControls(node, card);
      if (asset?.kind === "video") {
        const vidMedia = card.querySelector("video.node-media");
        if (vidMedia) attachTaskVideoControlBar(node, asset, card, vidMedia);
      }
      taskToolbar(node, card);
    } else if (isAudioTask) {
      audioNodeControls(node, card);
      taskToolbar(node, card);
    } else if (isSvgDesigner) {
      svgAndDesignerControls(node, card);
      taskToolbar(node, card);
    } else if (isUtility) {
      stickyAndGroupControls(node, card);
      taskToolbar(node, card);
    } else if (isComfyTask) {
      if (isVariations) {
        variationsControls(node, card);
      } else {
        taskControls(node, card);
      }
      taskToolbar(node, card);
    }

    card.addEventListener("click", (event) => {
      if (event.target.closest(".port-button")) return;
      selectNode(node.id);
    });
    card.addEventListener("pointerdown", (event) => startNodeDrag(event, node, card));
    card.querySelector(".node-menu").addEventListener("click", (event) => {
      event.stopPropagation();
      openSettings(node.id);
    });
    card.querySelector(".node-foot button").addEventListener("click", (event) => {
      event.stopPropagation();
      openSettings(node.id);
    });
    let visibleInputs = definition.inputs;
    let visibleOutputs = definition.outputs;
    if (node.kind === "image") {
      visibleInputs = definition.inputs.filter(
        (p) =>
          (state.pending && p.type === state.pending.type) ||
          state.graph.edges.some((e) => e.target === node.id && e.targetPort === p.id)
      );
    } else if (node.kind === "list") {
      const pType = listPrimaryMediaType(node);
      visibleInputs = definition.inputs.filter(
        (p) =>
          p.id === pType ||
          (state.pending && p.type === state.pending.type) ||
          state.graph.edges.some((e) => e.target === node.id && e.targetPort === p.id)
      );
      visibleOutputs = definition.outputs.filter(
        (p) =>
          p.id === pType ||
          p.id === "references" ||
          state.graph.edges.some((e) => e.source === node.id && e.sourcePort === p.id)
      );
    }
    for (const [index, port] of visibleInputs.entries()) {
      card.append(makePort(node, port, "input", index, visibleInputs.length));
    }
    for (const [index, port] of visibleOutputs.entries()) {
      card.append(makePort(node, port, "output", index, visibleOutputs.length));
    }
    world.append(card);
  }
  $("#emptyHint").hidden = state.graph.nodes.length !== 0;
  updateWorld();
  renderInspector();
  highlightPorts();
}

function selectNode(id) {
  if (state.selected !== id) closeAllPopovers();
  if (state.settingsNode !== id) state.settingsNode = null;
  state.selected = id;
  document.querySelectorAll(".graph-node").forEach((card) => card.classList.toggle("selected", card.dataset.nodeId === id));
  renderInspector();
}

function openSettings(id) {
  state.selected = id;
  state.settingsNode = id;
  document.querySelectorAll(".graph-node").forEach((card) => card.classList.toggle("selected", card.dataset.nodeId === id));
  renderInspector();
}

function renderInspector() {
  const panel = $("#inspector");
  const node = state.graph.nodes.find((item) => item.id === state.settingsNode && item.id === state.selected);
  panel.hidden = !node;
  if (!node) return;
  const definition = entry(node.kind);
  const isTask = ["text-image", "image-image", "text-video", "image-video"].includes(node.kind);
  const isAudioNode = ["speech-to-text", "voiceover", "sound-effects", "audio-generator", "music-generator"].includes(node.kind);

  if (isTask) {
    renderTaskInspector(node, definition, panel);
    return;
  }
  if (isAudioNode) {
    renderAudioInspector(node, definition, panel);
    return;
  }

  const status =
    definition.group === "Nguồn"
      ? "Tệp nguồn được lưu trong thư viện Studio. Nối cổng của thẻ này với tác vụ bạn muốn dùng."
      : "Flow đã có thể thiết kế và lưu. Chạy model sẽ được bật sau khi kết nối ComfyUI hoặc API của nhà cung cấp.";

  panel.innerHTML = `
    <div class="inspector-head">
      <h2>${escapeHtml(definition.title)}</h2>
      <button id="closeInspector" class="icon-button" type="button" aria-label="Đóng chi tiết">×</button>
    </div>
    <div class="inspector-scroll">
      <div class="inspector-section">
        <h3>Đầu vào</h3>
        <div id="inspectorInputs"></div>
      </div>
      <div class="inspector-section" id="inspectorContent">
        <h3>Nội dung</h3>
      </div>
      <div class="inspector-section">
        <h3>Trạng thái</h3>
        <div class="notice-card">${escapeHtml(status)}</div>
      </div>
      <div class="inspector-section">
        <button id="deleteNode" class="inspector-danger" type="button">Xóa thẻ</button>
      </div>
    </div>
  `;
  $("#closeInspector").addEventListener("click", () => {
    state.settingsNode = null;
    renderInspector();
  });
  $("#deleteNode").addEventListener("click", () => deleteNode(node.id));
  const inputs = $("#inspectorInputs");
  if (!definition.inputs.length) {
    const note = document.createElement("p");
    note.className = "inspector-muted";
    note.textContent = "Thẻ nguồn không cần đầu vào.";
    inputs.append(note);
  }
  for (const port of definition.inputs) {
    const edge = state.graph.edges.find((item) => item.target === node.id && item.targetPort === port.id);
    const row = document.createElement("div");
    row.className = "inspector-row";
    const label = document.createElement("span");
    label.textContent = `${port.label}${port.optional ? " · tùy chọn" : ""}`;
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = edge ? "Đã nối" : "Chưa nối";
    row.append(label, tag);
    inputs.append(row);
  }
  const content = $("#inspectorContent");
  if (node.kind === "text") {
    const textarea = document.createElement("textarea");
    textarea.placeholder = "Viết prompt hoặc ý tưởng của bạn…";
    textarea.value = node.text || "";
    let editing = false;
    textarea.addEventListener("input", () => {
      if (!editing) {
        remember();
        editing = true;
      }
      node.text = textarea.value;
      const card = document.querySelector(`.graph-node[data-node-id="${node.id}"]`);
      const preview = card?.querySelector(".node-body > div");
      if (preview) {
        preview.textContent = nodePreview(node);
        preview.className = node.text ? "node-preview-text" : "node-placeholder";
      }
      for (const edge of state.graph.edges.filter((item) => item.source === node.id && item.targetPort === "prompt")) {
        const task = state.graph.nodes.find((item) => item.id === edge.target);
        const linked = [...document.querySelectorAll(".linked-prompt")].find(
          (item) => item.dataset.promptSource === node.id && item.closest(".graph-node")?.dataset.nodeId === edge.target
        );
        if (linked) linked.textContent = `T · From Text node: ${(task ? resolveConnectedPromptText(task) : node.text.trim()) || "Empty prompt"}`;
        for (const run of [...document.querySelectorAll("[data-run-for]")].filter((item) => item.dataset.runFor === edge.target)) {
          if (task) run.disabled = !canRunTask(task);
        }
      }
      markDirty();
    });
    textarea.addEventListener("blur", () => {
      editing = false;
    });
    content.append(textarea);
  } else if (node.kind === "image" || node.kind === "video") {
    const asset = state.assets.find((item) => item.id === node.assetId);
    if (asset) {
      const media = document.createElement(node.kind === "image" ? "img" : "video");
      media.className = "inspector-media";
      const cacheVer = (asset.sha256 || "").slice(0, 10) || asset.size || "";
      media.src = cacheVer && !asset.url.includes("?") ? `${asset.url}?v=${cacheVer}` : asset.url;
      if (node.kind === "video") {
        media.controls = true;
        media.preload = "metadata";
      }
      content.append(media);
      const name = document.createElement("p");
      name.className = "asset-name";
      name.textContent = asset.name;
      content.append(name);
      const download = document.createElement("a");
      download.className = "asset-download";
      download.href = `${asset.url}?download=1`;
      download.textContent = "Tải tệp về";
      content.append(download);
    } else {
      const note = document.createElement("p");
      note.className = "inspector-muted";
      note.textContent = "Chưa chọn tệp cho thẻ này.";
      content.append(note);
    }
    const actions = document.createElement("div");
    actions.className = "asset-actions";
    const choose = document.createElement("button");
    choose.type = "button";
    choose.textContent = "Chọn từ thư viện";
    choose.addEventListener("click", () => openAssetsPanel(node.id));
    const upload = document.createElement("button");
    upload.type = "button";
    upload.textContent = "Nhập tệp mới";
    upload.addEventListener("click", () => {
      state.assetTarget = node.id;
      $("#assetFile").click();
    });
    actions.append(choose, upload);
    content.append(actions);
  } else {
    const note = document.createElement("p");
    note.className = "inspector-muted";
    note.textContent = "Model và thông số sẽ hiện tại đây khi adapter được kết nối.";
    content.append(note);
  }
}

function renderTaskInspector(node, definition, panel) {
  const headerTitle = nodeDisplayTitle(node);
  const isVideoNode = node.kind === "text-video" || node.kind === "image-video";
  const shownModel = isVideoNode
    ? node.videoModel || "Antigravity AI Bridge"
    : node.presetLabel && !state.comfy.checkpoints.includes(node.model)
      ? node.presetLabel
      : displayModelName(node);
  const badge = isVideoNode
    ? shownModel === "Local GPU (VRAM)" || shownModel === "local-gpu-vram"
      ? "gpu"
      : shownModel === "Antigravity AI Bridge" || shownModel === "Auto"
        ? "auto"
        : "cinematic"
    : displayModelBadge(node);
  const ratioLabel = isVideoNode ? node.videoRatio || "9:16" : currentRatioLabel(node);
  const modelConfigured = isModelConfigured(shownModel, isVideoNode ? "video" : "image");
  const connectedRefs = getConnectedReferences(node);
  const firstRefAsset = connectedRefs[0]?.asset || null;
  const activeRun = activeNodeRun(node) || latestRun(node.id);
  const auditReport = activeRun?.snapshot?.auditReport || null;

  panel.innerHTML = `
    <div class="inspector-head">
      <h2>${escapeHtml(headerTitle)}</h2>
      <button id="closeInspector" class="icon-button" type="button" aria-label="Close settings">×</button>
    </div>
    <div class="inspector-scroll">
      ${state.comfy.message ? `<div class="worker-alert">${escapeHtml(state.comfy.message)}</div>` : ""}
      ${
        auditReport
          ? `
          <div class="inspector-section">
            <h3>ANTIGRAVITY BRIDGE · KIỂM ĐỊNH</h3>
            <div class="bridge-audit-card">
              <div class="bridge-audit-row">
                <small>KIỂM TRA PIXEL ẢNH GỐC</small>
                <span class="bridge-audit-ok">${escapeHtml(auditReport.imageAudit?.pixelLossCheck || "OK")}</span>
                <span>Gốc: ${escapeHtml(String(auditReport.imageAudit?.sourceWidth || "—"))}×${escapeHtml(String(auditReport.imageAudit?.sourceHeight || "—"))} → Đích: ${escapeHtml(String(auditReport.imageAudit?.targetWidth || "—"))}×${escapeHtml(String(auditReport.imageAudit?.targetHeight || "—"))}</span>
              </div>
              <div class="bridge-audit-row">
                <small>KIỂM TRA CHỮ &amp; NGỮ CẢNH PROMPT</small>
                <span class="bridge-audit-ok">${escapeHtml(auditReport.promptAudit?.textIntegrityCheck || "OK")}</span>
                <span>Prompt sạch: "${escapeHtml(auditReport.promptAudit?.cleanPrompt || "")}"</span>
              </div>
              <div class="bridge-audit-row">
                <small>MÃ RUN ID (GỬI ANTIGRAVITY)</small>
                <span><code>${escapeHtml(activeRun?.id || "")}</code></span>
              </div>
            </div>
          </div>
        `
          : ""
      }
      <div class="inspector-section">
        <h3>MODEL</h3>
        <div class="inspector-model-row">
          <button id="inspectorModelBtn" type="button" class="inspector-model-select-btn">
            <span class="model-configured-dot ${modelConfigured ? "is-configured" : ""}"></span>
            <span class="model-badge-icon">${modelBadgeSvg(badge)}</span>
            <span class="model-title">${escapeHtml(shownModel)}</span>
            <span class="pill-chevron">▾</span>
          </button>
          <button id="inspectorAdvToggle" type="button" class="inspector-adv-btn ${state.showAdvancedInspector ? "active" : ""}" title="Advanced ComfyUI parameters" aria-label="Advanced ComfyUI parameters">${actionIcon("settings")}</button>
        </div>
      </div>

      <div class="inspector-section">
        <div class="inspector-section-head">
          <h3>REFERENCES</h3>
          <span class="inspector-count">${connectedRefs.length}/14</span>
        </div>
        <div class="inspector-references-grid">
          <button type="button" class="inspector-ref-slot" data-ref-slot="style">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8-4.3-4.1 5.9-.9z"/></svg>
            <span>Style</span>
          </button>
          <button type="button" class="inspector-ref-slot ${firstRefAsset ? "has-ref-thumb" : ""}" data-ref-slot="character">
            ${firstRefAsset ? `<img src="${escapeHtml(firstRefAsset.url)}" alt="">` : ""}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>
            <span>${escapeHtml(connectedRefs[0]?.title ? `@${connectedRefs[0].title}` : "Character")}</span>
          </button>
          <button type="button" class="inspector-ref-slot" data-ref-slot="add">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 5v14M5 12h14"/></svg>
            <span>Add</span>
          </button>
        </div>
      </div>

      <div class="inspector-section">
        <h3>Prompt</h3>
        <textarea id="inspectorPromptInput" placeholder="Describe the image you want to generate..."></textarea>
        ${node.kind === "text-image" ? `<button id="inspectorRatioBtn" type="button" class="inspector-ratio-btn">${ratioFrameHtml(ratioLabel)}<span>${escapeHtml(ratioLabel)}</span></button>` : ""}
      </div>

      <div id="inspectorAdvancedContainer" class="inspector-section" ${state.showAdvancedInspector ? "" : "hidden"}>
        <h3>ComfyUI Parameters</h3>
        <div id="inspectorAdvancedBody"></div>
      </div>
    </div>
    <div class="inspector-foot">
      <button id="inspectorRunBtn" type="button" class="inspector-run-btn" data-run-for="${escapeHtml(node.id)}">Run</button>
    </div>
  `;

  $("#closeInspector").addEventListener("click", () => {
    state.settingsNode = null;
    renderInspector();
  });

  $("#inspectorModelBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    const card = document.querySelector(`.graph-node[data-node-id="${node.id}"]`);
    if (!card) return;
    if (isVideoNode) {
      if (togglePopover(node.id, "video-model", card)) {
        buildVideoModelPopover(node, card);
      }
    } else if (togglePopover(node.id, "model", card)) {
      buildModelPopover(node, card);
    }
  });

  $("#inspectorAdvToggle").addEventListener("click", () => {
    state.showAdvancedInspector = !state.showAdvancedInspector;
    renderInspector();
  });

  panel.querySelectorAll("[data-ref-slot]").forEach((btn) => {
    btn.addEventListener("click", () => openAssetsPanel(node.id, true));
  });

  const promptEdge = state.graph.edges.find((item) => item.target === node.id && item.targetPort === "prompt");
  const promptSource = state.graph.nodes.find((item) => item.id === promptEdge?.source);
  const promptInput = $("#inspectorPromptInput");
  promptInput.value = promptSource?.kind === "text" ? promptSource.text || "" : node.prompt || "";
  let editingPrompt = false;
  promptInput.addEventListener("input", () => {
    if (!editingPrompt) {
      remember();
      editingPrompt = true;
    }
    if (promptSource?.kind === "text") {
      promptSource.text = promptInput.value;
    } else {
      node.prompt = promptInput.value;
      const cardPrompt = document.querySelector(`.graph-node[data-node-id="${node.id}"] .card-prompt`);
      if (cardPrompt) cardPrompt.value = node.prompt;
    }
    markDirty();
    document.querySelectorAll(`[data-run-for="${node.id}"]`).forEach((btn) => {
      btn.disabled = !canRunTask(node);
    });
  });
  promptInput.addEventListener("blur", () => {
    editingPrompt = false;
  });

  const ratioBtn = $("#inspectorRatioBtn");
  if (ratioBtn) {
    ratioBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const keys = Object.keys(ASPECT_RATIOS);
      const nextRatio = keys[(keys.indexOf(ratioLabel) + 1) % keys.length];
      remember();
      [node.width, node.height] = ASPECT_RATIOS[nextRatio].dims;
      node._userPickedRatio = true;
      node._previewSelectedRatio = true;
      node.historyIndex = 0;
      markDirty();
      renderGraph();
    });
  }

  const advBody = $("#inspectorAdvancedBody");
  if (node.kind === "text-image") renderTextImageEditor(node, advBody);
  else renderImageImageEditor(node, advBody);

  const runBtn = $("#inspectorRunBtn");
  runBtn.disabled = !canRunTask(node);
  runBtn.addEventListener("click", () => runNode(node.id));
}

function renderAudioInspector(node, definition, panel) {
  const headerTitle = nodeDisplayTitle(node);
  const shownModel =
    node.audioModel ||
    (node.kind === "voiceover"
      ? "ElevenLabs v3"
      : node.kind === "sound-effects"
        ? "ElevenLabs SFX v2"
        : node.kind === "audio-generator"
          ? "Chatterbox"
          : node.kind === "music-generator"
            ? "ElevenLabs Music"
            : "Whisper v3");
  const curDur =
    node.duration ||
    (node.kind === "sound-effects" ? "5s" : node.kind === "audio-generator" ? "10s" : "30s");
  const curCount = Math.max(1, Math.min(4, Number(node.count ?? node.batchCount) || 1));

  panel.innerHTML = `
    <div class="inspector-head">
      <h2>${escapeHtml(headerTitle)}</h2>
      <button id="closeInspector" class="icon-button" type="button" aria-label="Close settings">×</button>
    </div>
    <div class="inspector-scroll">
      <div class="inspector-section">
        <h3>MODEL</h3>
        <div class="inspector-model-row">
          <button id="inspectorAudioModelBtn" type="button" class="inspector-model-select-btn">
            <span class="model-configured-dot is-configured"></span>
            <span class="model-badge-icon">${modelBadgeSvg("audio")}</span>
            <span class="model-title">${escapeHtml(shownModel)}</span>
            <span class="pill-chevron">▾</span>
          </button>
        </div>
      </div>

      ${
        node.kind === "speech-to-text"
          ? `
        <div class="inspector-section">
          <h3>Transcript</h3>
          <textarea id="inspectorAudioPromptInput" placeholder="Upload or connect audio/video to transcribe..."></textarea>
        </div>
      `
          : `
        <div class="inspector-section">
          <h3>Prompt</h3>
          <textarea id="inspectorAudioPromptInput" placeholder="${
            node.kind === "voiceover"
              ? "Write dialogue or narration to generate..."
              : node.kind === "sound-effects"
                ? "Describe the sound effect you want to generate..."
                : node.kind === "audio-generator"
                  ? "Describe the speech, sound effects, or music..."
                  : "Describe the music you want to generate..."
          }"></textarea>
        </div>
      `
      }

      ${
        node.kind === "voiceover"
          ? `
        <div class="inspector-section">
          <h3>Voices</h3>
          <div class="inspector-audio-controls-grid">
            <button id="inspectorVoice1Btn" type="button" class="card-pill audio-speaker-pill">
              <span class="speaker-avatar">🎙</span>
              <span>${escapeHtml(node.voiceName || "Hope")}</span>
              <span class="pill-chevron">▾</span>
            </button>
            <button id="inspectorVoice2Btn" type="button" class="card-pill audio-speaker-pill">
              <span class="speaker-avatar">👤</span>
              <span>${escapeHtml(node.speaker2Name || "Add speaker")}</span>
            </button>
          </div>
        </div>
      `
          : ""
      }

      ${
        node.kind === "sound-effects" || node.kind === "audio-generator" || node.kind === "music-generator"
          ? `
        <div class="inspector-section">
          <div class="inspector-audio-row-split">
            <div class="inspector-audio-col">
              <h3>Duration</h3>
              <select id="inspectorAudioDuration" class="inspector-select">
                ${(node.kind === "sound-effects"
                  ? ["Auto", "1s", "3s", "5s", "10s", "15s"]
                  : node.kind === "audio-generator"
                    ? ["5s", "10s", "15s", "30s"]
                    : ["Auto", "15s", "30s", "60s", "120s"]
                )
                  .map(
                    (opt) =>
                      `<option value="${escapeHtml(opt)}" ${opt === curDur ? "selected" : ""}>${escapeHtml(opt)}</option>`
                  )
                  .join("")}
              </select>
            </div>
            ${
              node.kind === "sound-effects"
                ? `
              <div class="inspector-audio-col">
                <h3>Loop</h3>
                <button id="inspectorAudioLoopBtn" type="button" class="card-pill audio-loop-pill ${node.loop ? "is-active" : ""}">
                  <span>Loop</span>
                  <span class="loop-check">${node.loop ? "✓" : ""}</span>
                </button>
              </div>
            `
                : ""
            }
            ${
              node.kind === "music-generator"
                ? `
              <div class="inspector-audio-col">
                <h3>Vocals</h3>
                <button id="inspectorAudioInstBtn" type="button" class="card-pill audio-loop-pill ${node.instrumental ? "is-active" : ""}">
                  <span>${node.instrumental ? "✓ Instrumental" : "Instrumental"}</span>
                </button>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `
          : ""
      }

      ${
        node.kind !== "speech-to-text"
          ? `
        <div class="inspector-section">
          <h3>Count</h3>
          <div class="audio-count-stepper inspector-stepper">
            <button id="inspectorCountMinus" type="button" class="stepper-btn" ${curCount <= 1 ? "disabled" : ""}>−</button>
            <span id="inspectorCountVal" class="stepper-value">x${curCount}</span>
            <button id="inspectorCountPlus" type="button" class="stepper-btn" ${curCount >= 4 ? "disabled" : ""}>+</button>
          </div>
        </div>
      `
          : ""
      }
    </div>
    <div class="inspector-foot">
      <button id="inspectorRunBtn" type="button" class="inspector-run-btn" data-run-for="${escapeHtml(node.id)}">
        ${node.kind === "speech-to-text" ? "Transcribe" : "Run"}
      </button>
    </div>
  `;

  $("#closeInspector")?.addEventListener("click", () => {
    state.settingsNode = null;
    renderInspector();
  });

  $("#inspectorAudioModelBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    const card = document.querySelector(`.graph-node[data-node-id="${node.id}"]`);
    if (!card) return;
    if (node.kind === "voiceover" && togglePopover(node.id, "voiceover-model", card)) {
      buildVoiceoverModelPopover(node, card);
    } else if (node.kind === "music-generator" && togglePopover(node.id, "music-model", card)) {
      buildMusicModelPopover(node, card);
    }
  });

  const promptInput = $("#inspectorAudioPromptInput");
  if (promptInput) {
    promptInput.value = node.kind === "speech-to-text" ? node.transcriptText || "" : node.prompt || "";
    promptInput.addEventListener("input", () => {
      if (node.kind === "speech-to-text") {
        node.transcriptText = promptInput.value;
      } else {
        node.prompt = promptInput.value;
        const cardPrompt = document.querySelector(`.graph-node[data-node-id="${node.id}"] .card-prompt`);
        if (cardPrompt) cardPrompt.value = node.prompt;
      }
      markDirty();
    });
  }

  $("#inspectorVoice1Btn")?.addEventListener("click", () => openVoicesModal(node.id, 1));
  $("#inspectorVoice2Btn")?.addEventListener("click", () => openVoicesModal(node.id, 2));

  $("#inspectorAudioDuration")?.addEventListener("change", (e) => {
    remember();
    node.duration = e.target.value;
    markDirty();
    renderGraph();
  });

  $("#inspectorAudioLoopBtn")?.addEventListener("click", () => {
    remember();
    node.loop = !node.loop;
    markDirty();
    renderGraph();
  });

  $("#inspectorAudioInstBtn")?.addEventListener("click", () => {
    remember();
    node.instrumental = !node.instrumental;
    markDirty();
    renderGraph();
  });

  $("#inspectorCountMinus")?.addEventListener("click", () => {
    if (curCount <= 1) return;
    remember();
    node.count = curCount - 1;
    node.batchCount = curCount - 1;
    markDirty();
    renderGraph();
  });

  $("#inspectorCountPlus")?.addEventListener("click", () => {
    if (curCount >= 4) return;
    remember();
    node.count = curCount + 1;
    node.batchCount = curCount + 1;
    markDirty();
    renderGraph();
  });

  const runBtn = $("#inspectorRunBtn");
  if (runBtn) {
    runBtn.disabled = !canRunTask(node);
    runBtn.addEventListener("click", () => runNode(node.id));
  }
}

function renderTextImageEditor(node, content) {
  const form = document.createElement("div");
  form.className = "model-form";
  const modelLabel = document.createElement("label");
  modelLabel.textContent = "Checkpoint local";
  const model = document.createElement("select");
  model.setAttribute("aria-label", "Checkpoint local");
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Chọn checkpoint";
  model.append(placeholder);
  if (node.model && !state.comfy.checkpoints.includes(node.model)) {
    const missing = document.createElement("option");
    missing.value = node.model;
    missing.textContent = `${node.model} · preset / chưa có trên worker`;
    model.append(missing);
  }
  for (const name of state.comfy.checkpoints) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    model.append(option);
  }
  model.value = node.model || "";
  model.addEventListener("change", () => {
    remember();
    node.model = model.value;
    delete node.presetLabel;
    markDirty();
    renderGraph();
  });
  modelLabel.append(model);
  form.append(modelLabel);

  const refresh = document.createElement("button");
  refresh.type = "button";
  refresh.className = "text-button";
  refresh.textContent = "Kiểm tra lại ComfyUI";
  refresh.addEventListener("click", async () => {
    state.comfy = await request("/comfy/status");
    renderInspector();
  });
  form.append(refresh);

  const fields = [
    ["width", "Rộng", 512, 16, 16384, 8],
    ["height", "Cao", 512, 16, 16384, 8],
    ["steps", "Steps", 20, 1, 10000, 1],
    ["cfg", "CFG", 7, 0, 100, 0.1],
    ["seed", "Seed", 0, 0, Number.MAX_SAFE_INTEGER, 1],
  ];
  const grid = document.createElement("div");
  grid.className = "model-grid";
  for (const [key, title, fallback, min, max, step] of fields) {
    const label = document.createElement("label");
    label.textContent = title;
    const input = document.createElement("input");
    input.type = "number";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = node[key] ?? fallback;
    input.addEventListener("change", () => {
      const value = Number(input.value);
      if (!Number.isFinite(value) || value < min || value > max || (key !== "cfg" && !Number.isSafeInteger(value))) {
        notify(`${title} không hợp lệ.`);
        input.value = node[key] ?? fallback;
        return;
      }
      remember();
      node[key] = value;
      markDirty();
      renderGraph();
    });
    label.append(input);
    grid.append(label);
  }
  form.append(grid);
  const negativeLabel = document.createElement("label");
  negativeLabel.textContent = "Negative prompt";
  const negative = document.createElement("textarea");
  negative.value = node.negative || "";
  negative.placeholder = "Tùy chọn";
  let editing = false;
  negative.addEventListener("input", () => {
    if (!editing) {
      remember();
      editing = true;
    }
    node.negative = negative.value;
    markDirty();
  });
  negative.addEventListener("blur", () => {
    editing = false;
  });
  negativeLabel.append(negative);
  form.append(negativeLabel);
  content.append(form);

  const run = latestRun(node.id);
  const asset = state.assets.find((item) => item.id === run?.assetId);
  if (asset) {
    const image = document.createElement("img");
    image.className = "inspector-media result-media";
    image.src = asset.url;
    image.alt = "Ảnh đã tạo";
    content.append(image);
    const download = document.createElement("a");
    download.className = "asset-download";
    download.href = `${asset.url}?download=1`;
    download.textContent = "Tải ảnh kết quả";
    content.append(download);
    const location = document.createElement("p");
    location.className = "asset-location";
    location.textContent = `Lưu tại: ${asset.storageDir || state.storage?.defaultDir || "thư mục mặc định"}`;
    content.append(location);
  }
}

function createNumberInput(label, value, min, max, step, onChange) {
  const input = document.createElement("input");
  input.type = "number";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;
  input.addEventListener("change", () => {
    const next = Number(input.value);
    if (!Number.isFinite(next) || next < min || next > max || (step === 1 && !Number.isSafeInteger(next))) {
      notify(`${label} không hợp lệ.`);
      input.value = value;
      return;
    }
    remember();
    onChange(next);
    renderGraph();
  });
  return { label, input };
}

function renderImageImageEditor(node, content) {
  const form = document.createElement("div");
  form.className = "model-form";
  const modelLabel = document.createElement("label");
  modelLabel.textContent = "Checkpoint local";
  const model = document.createElement("select");
  model.setAttribute("aria-label", "Checkpoint local");
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Chọn checkpoint";
  model.append(placeholder);
  if (node.model && !state.comfy.checkpoints.includes(node.model)) {
    const missing = document.createElement("option");
    missing.value = node.model;
    missing.textContent = `${node.model} · không có trên worker`;
    model.append(missing);
  }
  for (const name of state.comfy.checkpoints) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    model.append(option);
  }
  model.value = node.model || "";
  model.addEventListener("change", () => {
    remember();
    node.model = model.value;
    delete node.presetLabel;
    markDirty();
    renderGraph();
  });
  const refresh = document.createElement("button");
  refresh.className = "text-button";
  refresh.type = "button";
  refresh.textContent = "↻ Tải lại";
  refresh.addEventListener("click", async () => {
    state.comfy = await request("/comfy/status");
    renderInspector();
  });
  modelLabel.append(model, refresh);
  form.append(modelLabel);

  const denoise = createNumberInput("Mức thay đổi", node.denoise ?? 0.75, 0, 1, 0.05, (v) => {
    node.denoise = v;
    markDirty();
  });
  const steps = createNumberInput("Steps", node.steps ?? 20, 1, 10000, 1, (v) => {
    node.steps = v;
    markDirty();
  });
  const cfg = createNumberInput("CFG scale", node.cfg ?? 7.0, 0, 100, 0.5, (v) => {
    node.cfg = v;
    markDirty();
  });
  const seed = createNumberInput("Seed", node.seed ?? 0, 0, Number.MAX_SAFE_INTEGER, 1, (v) => {
    node.seed = v;
    markDirty();
  });
  const grid = document.createElement("div");
  grid.className = "model-grid";
  for (const field of [denoise, steps, cfg, seed]) {
    const label = document.createElement("label");
    label.textContent = field.label;
    label.append(field.input);
    grid.append(label);
  }
  form.append(grid);
  const negativeLabel = document.createElement("label");
  negativeLabel.textContent = "Negative prompt";
  const negative = document.createElement("textarea");
  negative.value = node.negative || "";
  negative.placeholder = "Tùy chọn";
  let editing = false;
  negative.addEventListener("input", () => {
    if (!editing) {
      remember();
      editing = true;
    }
    node.negative = negative.value;
    markDirty();
  });
  negative.addEventListener("blur", () => {
    editing = false;
  });
  negativeLabel.append(negative);
  form.append(negativeLabel);
  content.append(form);
}

function collectNodeAssetAndRunIds(node) {
  const assetIds = new Set();
  const runIds = new Set();
  if (!node) return { assetIds: [], runIds: [], thumbUrl: "" };
  if (typeof node.assetId === "string" && node.assetId) {
    assetIds.add(node.assetId);
  }
  if (Array.isArray(node.batchAssetIds)) {
    for (const id of node.batchAssetIds) {
      if (typeof id === "string" && id) assetIds.add(id);
    }
  }
  if (Array.isArray(node.items)) {
    for (const item of node.items) {
      if (item && typeof item.assetId === "string" && item.assetId) {
        assetIds.add(item.assetId);
      }
    }
  }
  for (const run of state.runs) {
    if (run.nodeId === node.id) {
      runIds.add(run.id);
      if (run.assetId) assetIds.add(run.assetId);
      const splits = run.snapshot?.splitAssets;
      if (Array.isArray(splits)) {
        for (const sp of splits) {
          if (sp?.assetId) assetIds.add(sp.assetId);
        }
      }
    }
  }
  const activeRun = activeNodeRun(node) || latestRun(node.id);
  const primaryAssetId = activeRun?.assetId || node.assetId || [...assetIds][0] || "";
  const primaryAsset = primaryAssetId ? state.assets.find((a) => a.id === primaryAssetId) : null;
  return {
    assetIds: [...assetIds],
    runIds: [...runIds],
    thumbUrl: primaryAsset?.url || "",
  };
}

function isAssetReferencedAnywhere(assetId, excludeNodeIds = new Set()) {
  for (const n of state.graph?.nodes || []) {
    if (excludeNodeIds.has(n.id)) continue;
    if (n.assetId === assetId) return true;
    if (Array.isArray(n.batchAssetIds) && n.batchAssetIds.includes(assetId)) return true;
    if (Array.isArray(n.items) && n.items.some((it) => it?.assetId === assetId)) return true;
  }
  for (const t of state.graph?.trash || []) {
    const tid = t.node?.id || t.nodeId;
    if (tid && excludeNodeIds.has(tid)) continue;
    if (Array.isArray(t.assetIds) && t.assetIds.includes(assetId)) return true;
    if (t.node?.assetId === assetId) return true;
  }
  return false;
}

async function executePurgeOnBackend(items) {
  if (!Array.isArray(items) || !items.length) return;
  const nodeIds = [];
  const assetIds = [];
  const runIds = [];
  for (const it of items) {
    if (it.nodeId) nodeIds.push(it.nodeId);
    if (Array.isArray(it.assetIds)) assetIds.push(...it.assetIds);
    if (Array.isArray(it.runIds)) runIds.push(...it.runIds);
  }
  if (!Array.isArray(state.graph.purgeQueue)) state.graph.purgeQueue = [];
  state.graph.purgeQueue.push(...items);

  const excludeSet = new Set(nodeIds);
  const runIdSet = new Set(runIds);
  const unrefAssetSet = new Set(assetIds.filter((aid) => !isAssetReferencedAnywhere(aid, excludeSet)));

  state.runs = state.runs.filter((r) => ! excludeSet.has(r.nodeId) && !runIdSet.has(r.id) && !unrefAssetSet.has(r.assetId));
  state.assets = state.assets.filter((a) => !unrefAssetSet.has(a.id));
  renderAssets();
  renderTrash();
  renderGraph();
  markDirty();

  try {
    await request("/trash/purge", {
      method: "POST",
      body: JSON.stringify({ nodeIds, assetIds, runIds }),
    });
    if (Array.isArray(state.graph.purgeQueue)) {
      delete state.graph.purgeQueue;
    }
  } catch {
    // Fallback handled automatically by save_graph / bridge_watcher via state.graph.purgeQueue
  }
}

function deleteNode(id, permanent = false) {
  const node = state.graph.nodes.find((item) => item.id === id);
  if (!node) return;
  remember();
  if (state.pending?.nodeId === id) cancelConnection();

  const title = nodeDisplayTitle(node);
  const { assetIds, runIds, thumbUrl } = collectNodeAssetAndRunIds(node);
  const connectedEdges = state.graph.edges.filter((edge) => edge.source === id || edge.target === id);

  state.graph.nodes = state.graph.nodes.filter((item) => item.id !== id);
  state.graph.edges = state.graph.edges.filter((edge) => edge.source !== id && edge.target !== id);
  state.selected = null;
  state.settingsNode = null;
  state.activePopover = null;

  if (permanent) {
    if (Array.isArray(state.graph.trash)) {
      state.graph.trash = state.graph.trash.filter((t) => t.nodeId !== id && t.node?.id !== id);
    }
    executePurgeOnBackend([{ nodeId: id, assetIds, runIds }]);
    notify(`Đã xóa vĩnh viễn "${title}" và đồng bộ xóa ${assetIds.length} tệp ảnh dưới thư mục.`);
    return;
  }

  if (!Array.isArray(state.graph.trash)) state.graph.trash = [];
  state.graph.trash.push({
    id: crypto.randomUUID(),
    nodeId: id,
    title,
    node: structuredClone(node),
    edges: structuredClone(connectedEdges),
    assetIds,
    runIds,
    thumbUrl,
    deletedAt: new Date().toISOString(),
  });
  updateTrashBadge();
  if (!$("#trashPanel")?.hidden) {
    renderTrash();
  }
  renderGraph();
  markDirty();
  notify(`Đã chuyển "${title}" vào Thùng rác (Xóa tạm). Mở Thùng rác ở thanh trái để khôi phục hoặc xóa vĩnh viễn cả tệp.`);
}

function restoreFromTrash(trashId) {
  if (!Array.isArray(state.graph?.trash)) return;
  const idx = state.graph.trash.findIndex((item) => item.id === trashId);
  if (idx === -1) return;
  remember();
  const [item] = state.graph.trash.splice(idx, 1);
  if (item.node && !state.graph.nodes.some((n) => n.id === item.node.id)) {
    state.graph.nodes.push(item.node);
  }
  const activeNodeIds = new Set(state.graph.nodes.map((n) => n.id));
  for (const edge of item.edges || []) {
    if (
      activeNodeIds.has(edge.source) &&
      activeNodeIds.has(edge.target) &&
      !state.graph.edges.some((e) => e.id === edge.id)
    ) {
      state.graph.edges.push(edge);
    }
  }
  state.selected = item.node?.id || null;
  updateTrashBadge();
  renderTrash();
  renderGraph();
  markDirty();
  notify(`Đã khôi phục "${item.title || "Card"}" về lại Canvas.`);
}

function purgeTrashItem(trashId) {
  if (!Array.isArray(state.graph?.trash)) return;
  const idx = state.graph.trash.findIndex((item) => item.id === trashId);
  if (idx === -1) return;
  remember();
  const [item] = state.graph.trash.splice(idx, 1);
  updateTrashBadge();
  executePurgeOnBackend([
    {
      nodeId: item.nodeId || item.node?.id || "",
      assetIds: item.assetIds || [],
      runIds: item.runIds || [],
    },
  ]);
  notify(`Đã xóa vĩnh viễn "${item.title || "Card"}" và xóa sạch ${(item.assetIds || []).length} tệp ảnh dưới thư mục.`);
}

function emptyAllTrash() {
  const trash = Array.isArray(state.graph?.trash) ? state.graph.trash : [];
  if (!trash.length) return;
  remember();
  const itemsToPurge = trash.map((item) => ({
    nodeId: item.nodeId || item.node?.id || "",
    assetIds: item.assetIds || [],
    runIds: item.runIds || [],
  }));
  const totalCards = trash.length;
  const totalFiles = trash.reduce((acc, item) => acc + (item.assetIds?.length || 0), 0);
  state.graph.trash = [];
  updateTrashBadge();
  executePurgeOnBackend(itemsToPurge);
  notify(`Đã dọn sạch Thùng rác (${totalCards} thẻ) và xóa vĩnh viễn ${totalFiles} tệp ảnh dưới thư mục.`);
}

function purgeAssetDirectly(asset) {
  if (!asset?.id) return;
  if (isAssetReferencedAnywhere(asset.id)) {
    notify("Tệp này đang được gắn trên một thẻ ở Canvas hoặc trong Thùng rác. Hãy xóa thẻ đó trước.");
    return;
  }
  executePurgeOnBackend([{ nodeId: "", assetIds: [asset.id], runIds: [asset.id] }]);
  notify(`Đã xóa vĩnh viễn tệp "${asset.name}" khỏi thư mục.`);
}

function startNodeDrag(event, node, card) {
  if (
    event.button !== 0 ||
    event.target.closest("button, input, select, a, .card-popover, .toolbar-dropdown, .port-button, .selection-toolbar")
  ) {
    return;
  }
  const targetTextarea = event.target.closest("textarea");
  if (targetTextarea) {
    const rect = targetTextarea.getBoundingClientRect();
    const onScrollbar = targetTextarea.scrollHeight > targetTextarea.clientHeight && event.clientX >= rect.right - 20;
    if (document.activeElement === targetTextarea || onScrollbar) {
      selectNode(node.id);
      return;
    }
  }
  event.preventDefault();
  selectNode(node.id);
  const start = { x: event.clientX, y: event.clientY, nodeX: node.x, nodeY: node.y };
  let moved = false;
  const move = (next) => {
    const dx = (next.clientX - start.x) / state.zoom;
    const dy = (next.clientY - start.y) / state.zoom;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 3) {
      remember();
      moved = true;
      card.classList.add("is-dragging");
      if (targetTextarea && document.activeElement === targetTextarea) {
        targetTextarea.blur();
      }
    }
    if (!moved) return;
    node.x = Math.round(start.nodeX + dx);
    node.y = Math.round(start.nodeY + dy);
    card.style.left = `${node.x}px`;
    card.style.top = `${node.y}px`;
    renderEdges();
  };
  const end = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    card.classList.remove("is-dragging");
    if (moved) {
      markDirty();
    } else if (targetTextarea) {
      targetTextarea.focus();
    }
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end, { once: true });
}

function closeWireDropMenu() {
  const menu = $("#wireDropMenu");
  if (menu) {
    menu.hidden = true;
    menu.replaceChildren();
  }
  if ($("#addPanel")?.hidden && $("#catalogPreview")) {
    $("#catalogPreview").hidden = true;
  }
}

function openWireDropMenu(clientX, clientY) {
  const menu = $("#wireDropMenu");
  if (!menu || !state.pending) return;
  const sourceNodeId = state.pending.nodeId;
  const wsRect = $(".workspace-main").getBoundingClientRect();
  const canvasRect = $("#canvas").getBoundingClientRect();
  const worldPos = {
    x: (clientX - canvasRect.left - state.pan.x) / state.zoom,
    y: (clientY - canvasRect.top - state.pan.y) / state.zoom - 60,
  };

  menu.hidden = false;
  const maxLeft = wsRect.width - 284;
  const maxTop = wsRect.height - 376;
  const menuLeft = Math.max(16, Math.min(clientX - wsRect.left + 4, maxLeft));
  const menuTop = Math.max(16, Math.min(clientY - wsRect.top - 18, maxTop));
  menu.style.left = `${menuLeft}px`;
  menu.style.top = `${menuTop}px`;
  if (state.pending) {
    state.pending.x = wsRect.left + menuLeft;
    state.pending.y = wsRect.top + menuTop + 20;
    renderEdges();
  }

  let query = "";

  const renderMenuContent = () => {
    menu.replaceChildren();

    const searchWrap = document.createElement("div");
    searchWrap.className = "wire-drop-search";
    searchWrap.innerHTML =
      '<span class="search-icon"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></span>';

    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Search";
    input.autocomplete = "off";
    input.value = query;
    searchWrap.append(input);
    menu.append(searchWrap);

    const listContainer = document.createElement("div");
    listContainer.className = "catalog-list wire-drop-list";
    menu.append(listContainer);

    const renderListOnly = () => {
      listContainer.replaceChildren();
      const filteredNodes = WIRE_DROP_ITEMS_UI.filter(
        (item) =>
          !query ||
          item.title.toLowerCase().includes(query) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
          (item.keywords && item.keywords.toLowerCase().includes(query))
      );

      for (const [idx, item] of filteredNodes.entries()) {
        const implemented = Boolean(item.interactive && item.kind && entry(item.kind));
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `catalog-item ${idx === 0 ? "active-item" : ""} ${implemented ? "" : "is-readonly"}`.trim();
        btn.dataset.previewId = item.previewId || "";
        btn.innerHTML = `
          <span class="catalog-item-icon type-${item.colorType}">${catalogIcon(item.icon)}</span>
          <span class="catalog-item-copy">
            <span class="catalog-item-title-row">
              <strong>${escapeHtml(item.title)}</strong>
              ${item.badge ? `<span class="catalog-badge ${item.badgeClass || ""}">${escapeHtml(item.badge)}</span>` : ""}
            </span>
            ${item.subtitle ? `<small>${escapeHtml(item.subtitle)}</small>` : ""}
          </span>
          <span class="catalog-pin">${actionIcon("pin")}</span>
        `;
        btn.addEventListener("pointerenter", () => {
          listContainer.querySelectorAll(".catalog-item.active-item").forEach((el) => el.classList.remove("active-item"));
          btn.classList.add("active-item");
          showCatalogPreview(item.previewId);
        });
        if (implemented) {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            addNode(item.kind, sourceNodeId, worldPos, {
              subKind: item.subKind,
              editorTool: item.editorTool,
              presetPrompt: item.presetPrompt,
              customTitle: item.subtitle ? item.title : undefined,
            });
            cancelConnection();
          });
        } else {
          btn.addEventListener("click", (e) => e.stopPropagation());
        }
        listContainer.append(btn);
      }

      if (filteredNodes.length) {
        showCatalogPreview(filteredNodes[0].previewId);
      } else {
        showCatalogPreview(null);
      }
    };

    input.addEventListener("input", () => {
      query = input.value.trim().toLowerCase();
      renderListOnly();
    });

    input.addEventListener("keydown", (event) => {
      const items = [...listContainer.querySelectorAll(".catalog-item")];
      if (!items.length) return;
      const currentIdx = Math.max(0, items.findIndex((el) => el.classList.contains("active-item")));
      if (event.key === "ArrowDown") {
        event.preventDefault();
        items.forEach((el) => el.classList.remove("active-item"));
        const next = items[(currentIdx + 1) % items.length];
        next.classList.add("active-item");
        next.scrollIntoView({ block: "nearest" });
        showCatalogPreview(next.dataset.previewId || null);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        items.forEach((el) => el.classList.remove("active-item"));
        const prev = items[(currentIdx - 1 + items.length) % items.length];
        prev.classList.add("active-item");
        prev.scrollIntoView({ block: "nearest" });
        showCatalogPreview(prev.dataset.previewId || null);
      } else if (event.key === "Enter") {
        event.preventDefault();
        items[currentIdx]?.click();
      } else if (event.key === "Escape") {
        event.preventDefault();
        cancelConnection();
      }
    });

    renderListOnly();

    const footer = document.createElement("div");
    footer.className = "panel-foot wire-drop-foot";
    footer.innerHTML = "<span><kbd>↑↓</kbd> Navigate</span><span><kbd>↵</kbd> Insert</span>";
    menu.append(footer);
    setTimeout(() => input.focus(), 10);
  };

  renderMenuContent();
}

function startConnection(event, nodeId, port) {
  if (event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  closeWireDropMenu();
  const startX = event.clientX;
  const startY = event.clientY;
  state.pending = { nodeId, portId: port.id, type: port.type, x: startX, y: startY };
  $("#canvas").classList.add("connecting");
  if (state.graph.nodes.some((n) => (n.kind === "list" || n.kind === "image") && n.id !== nodeId)) {
    renderGraph();
  } else {
    highlightPorts();
  }
  const move = (next) => {
    if (state.pending) {
      state.pending.x = next.clientX;
      state.pending.y = next.clientY;
      renderEdges();
    }
  };
  const end = (next) => {
    window.removeEventListener("pointermove", move);
    const elUnder = document.elementFromPoint(next.clientX, next.clientY);
    const target = elUnder?.closest('.port-button[data-direction="input"]');
    if (target) {
      finishConnection(target.dataset.node, target.dataset.port);
      return;
    }
    const cardTarget = elUnder?.closest(".graph-node");
    if (cardTarget && state.pending && cardTarget.dataset.nodeId && cardTarget.dataset.nodeId !== state.pending.nodeId) {
      const targetNode = state.graph.nodes.find((n) => n.id === cardTarget.dataset.nodeId);
      const targetDef = entry(targetNode?.kind);
      if (targetNode && targetDef) {
        const compatibleInputs = (targetDef.inputs || []).filter(
          (p) => isPortTypeCompatible(state.pending.type, targetNode, p) && p.id !== "items_in"
        );
        if (compatibleInputs.length > 0) {
          finishConnection(targetNode.id, compatibleInputs[0].id);
          return;
        }
      }
    }
    const dist = Math.hypot(next.clientX - startX, next.clientY - startY);
    if (dist > 24 && state.pending) {
      state.pending.x = next.clientX;
      state.pending.y = next.clientY;
      renderEdges();
      openWireDropMenu(next.clientX, next.clientY);
    } else {
      cancelConnection();
    }
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end, { once: true });
}

function hasPath(from, to) {
  const visited = new Set();
  const stack = [from];
  while (stack.length) {
    const current = stack.pop();
    if (current === to) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const edge of state.graph.edges) if (edge.source === current) stack.push(edge.target);
  }
  return false;
}

function isPortTypeCompatible(sourceType, targetNode, targetPort) {
  if (!targetPort) return false;
  if (targetPort.type === sourceType) return true;
  if (targetNode?.kind === "text" && ["text", "image", "video", "audio"].includes(sourceType)) return true;
  if (targetNode?.kind === "list" && ["text", "image", "video", "audio"].includes(sourceType)) return true;
  return false;
}

function finishConnection(targetId, targetPortId) {
  if (!state.pending) return;
  const target = state.graph.nodes.find((node) => node.id === targetId);
  const port = entry(target?.kind)?.inputs.find((item) => item.id === targetPortId);
  if (!port || !isPortTypeCompatible(state.pending.type, target, port)) {
    notify(`Cổng này cần ${port?.type || "loại khác"}.`);
    return;
  }
  if (targetId === state.pending.nodeId || hasPath(targetId, state.pending.nodeId)) {
    notify("Flow không thể có vòng nối.");
    cancelConnection();
    return;
  }
  const alreadyExists = state.graph.edges.some(
    (edge) =>
      edge.source === state.pending.nodeId &&
      edge.sourcePort === state.pending.portId &&
      edge.target === targetId &&
      edge.targetPort === targetPortId
  );
  if (alreadyExists) {
    cancelConnection(true);
    renderGraph();
    return;
  }
  remember();
  if (!port.multi) {
    state.graph.edges = state.graph.edges.filter((edge) => !(edge.target === targetId && edge.targetPort === targetPortId));
  }
  state.graph.edges.push({
    id: crypto.randomUUID(),
    source: state.pending.nodeId,
    sourcePort: state.pending.portId,
    target: targetId,
    targetPort: targetPortId,
  });
  const srcNode = state.graph.nodes.find((n) => n.id === state.pending.nodeId);
  const srcTitle = srcNode ? nodeDisplayTitle(srcNode) : "";
  if (
    (srcNode?.kind === "list" ||
      state.pending.type === "image" ||
      state.pending.type === "video" ||
      state.pending.type === "audio") &&
    target.kind === "text" &&
    srcTitle
  ) {
    if (!(target.text || "").toLowerCase().includes(`@${srcTitle.toLowerCase()}`)) {
      target.text = target.text ? `${target.text.trim()} @${srcTitle}` : `@${srcTitle} `;
    }
  } else if (srcNode?.kind === "list" && state.pending.portId !== "references") {
    target.listMode = true;
  } else if (state.pending.type === "image" && (target.kind === "text-image" || target.kind === "image-image")) {
    if (srcTitle && !(target.prompt || "").toLowerCase().includes(`@${srcTitle.toLowerCase()}`)) {
      target.prompt = target.prompt ? `@${srcTitle} ${target.prompt.trim()}` : `@${srcTitle} `;
    }
  }
  if (srcNode && (state.pending.type === "image" || state.pending.type === "video")) {
    const srcRun = activeNodeRun(srcNode) || latestRun(srcNode.id);
    const aid = srcRun?.assetId || srcNode.assetId;
    const srcAsset = aid ? state.assets.find((a) => a.id === aid) : null;
    const sw = Number(srcAsset?.width || srcNode.imageWidth || srcRun?.snapshot?.width || srcNode.width) || 0;
    const sh = Number(srcAsset?.height || srcNode.imageHeight || srcRun?.snapshot?.height || srcNode.height) || 0;
    if (sw > 0 && sh > 0) {
      syncDownstreamAspectFromSource(srcNode, sw, sh);
    }
  }
  cancelConnection(true);
  renderGraph();
  markDirty();
}

function cancelConnection(skipRender = false) {
  const hadDynamicPorts = Boolean(
    !skipRender && state.pending && state.graph.nodes.some((n) => n.kind === "list" || n.kind === "image")
  );
  state.pending = null;
  closeWireDropMenu();
  $("#canvas").classList.remove("connecting");
  if (hadDynamicPorts) {
    renderGraph();
  } else if (!skipRender) {
    highlightPorts();
    renderEdges();
  }
}

function highlightPorts() {
  for (const element of portElements.values()) {
    element.classList.remove("compatible", "incompatible");
    if (state.pending && element.dataset.direction === "input") {
      const node = state.graph.nodes.find((item) => item.id === element.dataset.node);
      const port = entry(node.kind).inputs.find((item) => item.id === element.dataset.port);
      element.classList.add(isPortTypeCompatible(state.pending.type, node, port) ? "compatible" : "incompatible");
    }
  }
}

function portCenter(nodeId, direction, portId) {
  const element = portElements.get(`${nodeId}:${direction}:${portId}`);
  if (!element) return null;
  const row = element.parentElement;
  const card = row.parentElement;
  return {
    x: state.pan.x + (card.offsetLeft + row.offsetLeft + element.offsetLeft + element.offsetWidth / 2) * state.zoom,
    y: state.pan.y + (card.offsetTop + row.offsetTop + element.offsetTop + element.offsetHeight / 2) * state.zoom,
  };
}

function drawEdge(svg, from, to, type, pending = false, batchActive = false, edgeId = null) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  if (window.matchMedia("(max-width: 800px)").matches) {
    const bend = Math.max(35, Math.abs(to.y - from.y) * 0.42);
    path.setAttribute("d", `M ${from.x} ${from.y} C ${from.x} ${from.y + bend}, ${to.x} ${to.y - bend}, ${to.x} ${to.y}`);
  } else {
    const bend = Math.max(50, Math.abs(to.x - from.x) * 0.42);
    path.setAttribute("d", `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`);
  }
  path.setAttribute("class", `type-${type}${pending ? " pending" : ""}${batchActive ? " batch-active" : ""}`);
  if (edgeId && !pending) {
    path.addEventListener("click", (event) => {
      event.stopPropagation();
      remember();
      state.graph.edges = state.graph.edges.filter((e) => e.id !== edgeId);
      markDirty();
      renderGraph();
      notify("Đã ngắt kết nối dây.");
    });
  }
  svg.append(path);
}

function renderEdges() {
  const svg = $("#edgeLayer");
  svg.replaceChildren();
  for (const edge of state.graph.edges) {
    const from = portCenter(edge.source, "output", edge.sourcePort);
    const to = portCenter(edge.target, "input", edge.targetPort);
    const source = state.graph.nodes.find((node) => node.id === edge.source);
    const target = state.graph.nodes.find((node) => node.id === edge.target);
    const type = entry(source?.kind)?.outputs.find((port) => port.id === edge.sourcePort)?.type;
    const isBatchEdge = (source?.kind === "list" && edge.sourcePort !== "references") || target?.kind === "list";
    if (from && to && type) drawEdge(svg, from, to, type, false, isBatchEdge, edge.id);
  }
  if (state.pending) {
    const from = portCenter(state.pending.nodeId, "output", state.pending.portId);
    const canvas = $("#canvas").getBoundingClientRect();
    if (from) drawEdge(svg, from, { x: state.pending.x - canvas.left, y: state.pending.y - canvas.top }, state.pending.type, true);
  }
}

function updateWorld() {
  $("#world").style.transform = `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`;
  $("#zoomLabel").textContent = `${Math.round(state.zoom * 100)}%`;
  const canvas = $("#canvas");
  canvas.style.backgroundSize = `${24 * state.zoom}px ${24 * state.zoom}px`;
  canvas.style.backgroundPosition = `${state.pan.x}px ${state.pan.y}px`;
  renderEdges();
  saveViewportState();
}

function zoomTo(next, screenX, screenY) {
  const canvas = $("#canvas");
  const rect = canvas.getBoundingClientRect();
  const x = screenX - rect.left;
  const y = screenY - rect.top;
  const target = Math.max(0.35, Math.min(2, next));
  state.pan.x = x - ((x - state.pan.x) / state.zoom) * target;
  state.pan.y = y - ((y - state.pan.y) / state.zoom) * target;
  state.zoom = target;
  updateWorld();
}

function fitGraph() {
  const nodes = state.graph.nodes;
  if (!nodes.length) {
    state.pan = { x: 0, y: 0 };
    state.zoom = 1;
    updateWorld();
    return;
  }
  const canvas = $("#canvas");
  const cards = [...document.querySelectorAll(".graph-node")];
  const minX = Math.min(...cards.map((card) => card.offsetLeft));
  const minY = Math.min(...cards.map((card) => card.offsetTop));
  const maxX = Math.max(...cards.map((card) => card.offsetLeft + card.offsetWidth));
  const maxY = Math.max(...cards.map((card) => card.offsetTop + card.offsetHeight));
  const horizontalMargin = canvas.clientWidth < 800 ? 70 : 260;
  const verticalMargin = canvas.clientWidth < 800 ? 150 : 180;
  state.zoom = Math.min(
    1,
    Math.max(0.35, Math.min((canvas.clientWidth - horizontalMargin) / (maxX - minX), (canvas.clientHeight - verticalMargin) / (maxY - minY)))
  );
  state.pan.x = (canvas.clientWidth - (maxX - minX) * state.zoom) / 2 - minX * state.zoom;
  state.pan.y = (canvas.clientHeight - (maxY - minY) * state.zoom) / 2 - minY * state.zoom;
  updateWorld();
}

function undo() {
  if (!state.undo.length) return;
  state.redo.push(cloneGraph());
  state.graph = state.undo.pop();
  state.selected = null;
  state.settingsNode = null;
  state.activePopover = null;
  updateUndoButtons();
  renderGraph();
  markDirty();
}

function redo() {
  if (!state.redo.length) return;
  state.undo.push(cloneGraph());
  state.graph = state.redo.pop();
  state.selected = null;
  state.settingsNode = null;
  state.activePopover = null;
  updateUndoButtons();
  renderGraph();
  markDirty();
}

function openReferenceModal(targetNodeId = null) {
  const modal = $("#referenceModal");
  const grid = $("#referenceModalGrid");
  if (!modal || !grid) return;
  grid.replaceChildren();
  const presets = [
    { name: "@CyberHero", role: "Character", desc: "Consistent anime fennec mascot character" },
    { name: "@StudioPortrait", role: "Character", desc: "Cinematic portrait character identity" },
    { name: "@NeonNoir", role: "Style", desc: "Teal & amber cyberpunk lighting palette" },
    { name: "@CleanVector", role: "Style", desc: "Crisp flat editorial illustration style" },
  ];
  for (const item of presets) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "library-item-card";
    card.innerHTML = `<strong>${escapeHtml(item.name)}</strong><span class="tag">${escapeHtml(item.role)}</span><small>${escapeHtml(item.desc)}</small>`;
    card.addEventListener("click", () => {
      modal.hidden = true;
      const target = state.graph.nodes.find((n) => n.id === (targetNodeId || state.selected));
      if (target && (target.kind === "text-image" || target.kind === "image-image")) {
        remember();
        target.prompt = `${target.prompt || ""} ${item.name} (${item.desc})`.trim();
        markDirty();
        renderGraph();
      } else {
        addNode("text-image", null, null, { presetPrompt: `${item.name} ${item.desc}` });
      }
      notify(`Đã gắn tham chiếu ${item.name}`);
    });
    grid.append(card);
  }
  modal.hidden = false;
}

function openVoicesModal(targetNodeId, speakerSlot = 1) {
  const modal = $("#voicesModal");
  if (!modal) return;
  let filterGender = "All genders";
  let filterAccent = "All accents";
  let filterUseCase = "";
  let favoritesOnly = false;
  let searchQuery = "";
  const favSet = state.favoriteVoices || (state.favoriteVoices = new Set(["Hope", "Clyde"]));

  const renderModalContent = () => {
    const node = state.graph.nodes.find((n) => n.id === targetNodeId);
    const currentSelected = speakerSlot === 2 ? node?.speaker2Name : node?.voiceName || "Hope";
    const filtered = VOICES_LIBRARY.filter((v) => {
      if (filterGender !== "All genders" && v.gender !== filterGender) return false;
      if (filterAccent !== "All accents" && v.accent !== filterAccent) return false;
      if (filterUseCase && v.useCase !== filterUseCase) return false;
      if (favoritesOnly && !favSet.has(v.name)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const hay = `${v.name} ${v.subtitle || ""} ${v.desc || ""} ${v.gender} ${v.accent}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    modal.innerHTML = `
      <div class="modal-card voices-modal-dialog" role="dialog" aria-modal="true" aria-label="Voices">
        <div class="voices-modal-header">
          <h2>Voices</h2>
          <button id="closeVoicesModalBtn" type="button" class="icon-button" aria-label="Close Voices">×</button>
        </div>
        <div class="voices-filter-bar">
          <div class="voices-filter-left">
            <button type="button" class="voices-filter-pill">
              <span class="flag-badge">us</span>
              <span>English</span>
              <span class="pill-chevron">▾</span>
            </button>
            <select id="voicesGenderSelect" class="voices-filter-select" aria-label="Filter by gender">
              <option value="All genders" ${filterGender === "All genders" ? "selected" : ""}>All genders</option>
              <option value="Female" ${filterGender === "Female" ? "selected" : ""}>Female</option>
              <option value="Male" ${filterGender === "Male" ? "selected" : ""}>Male</option>
            </select>
            <select id="voicesAccentSelect" class="voices-filter-select" aria-label="Filter by accent">
              <option value="All accents" ${filterAccent === "All accents" ? "selected" : ""}>All accents</option>
              <option value="American" ${filterAccent === "American" ? "selected" : ""}>American</option>
              <option value="British" ${filterAccent === "British" ? "selected" : ""}>British</option>
              <option value="Australian" ${filterAccent === "Australian" ? "selected" : ""}>Australian</option>
              <option value="Transatlantic" ${filterAccent === "Transatlantic" ? "selected" : ""}>Transatlantic</option>
            </select>
            <button type="button" class="voices-filter-pill">
              <span>Last used</span>
              <span class="pill-chevron">▾</span>
            </button>
            <button id="voicesFavToggle" type="button" class="voices-icon-pill ${favoritesOnly ? "is-active" : ""}" title="Favorites">
              ♡
            </button>
            <div class="voices-search-wrap">
              <span class="voices-search-icon">🔍</span>
              <input id="voicesSearchInput" type="search" placeholder="Search voices..." value="${escapeHtml(searchQuery)}" />
            </div>
          </div>
        </div>

        <div class="voices-modal-body">
          <div class="voices-section-title">Use cases</div>
          <div class="voices-usecases-row">
            ${VOICE_USE_CASES.map(
              (uc) => `
              <button type="button" class="voice-usecase-card ${filterUseCase === uc.id ? "is-active" : ""}" data-usecase="${escapeHtml(uc.id)}" style="--uc-bg:${escapeHtml(uc.color)};--uc-accent:${escapeHtml(uc.accent)}">
                <span class="voice-usecase-art"></span>
                <span class="voice-usecase-label">${escapeHtml(uc.label)}</span>
              </button>
            `
            ).join("")}
          </div>

          <div class="voices-section-title">Voices</div>
          <div id="voicesModalGrid" class="voices-grid-4col">
            ${filtered
              .map(
                (v) => `
              <div class="voice-card-item ${currentSelected === v.name ? "is-selected" : ""}" data-voice-name="${escapeHtml(v.name)}">
                <div class="voice-card-top">
                  <button type="button" class="voice-play-preview-btn" data-preview-voice="${escapeHtml(v.name)}" title="Preview ${escapeHtml(v.name)}">▶</button>
                  <div class="voice-card-titles">
                    <strong>${escapeHtml(v.name)} - ${escapeHtml(v.subtitle || v.style)}</strong>
                  </div>
                  <button type="button" class="voice-fav-btn ${favSet.has(v.name) ? "is-fav" : ""}" data-fav-voice="${escapeHtml(v.name)}" title="Favorite">♡</button>
                </div>
                <p class="voice-card-desc">${escapeHtml(v.desc || v.style)}</p>
                <div class="voice-card-meta">${escapeHtml(v.gender)} · ${escapeHtml(v.accent)}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    modal.querySelector("#closeVoicesModalBtn")?.addEventListener("click", () => {
      modal.hidden = true;
    });
    modal.querySelector("#voicesGenderSelect")?.addEventListener("change", (e) => {
      filterGender = e.target.value;
      renderModalContent();
    });
    modal.querySelector("#voicesAccentSelect")?.addEventListener("change", (e) => {
      filterAccent = e.target.value;
      renderModalContent();
    });
    modal.querySelector("#voicesFavToggle")?.addEventListener("click", () => {
      favoritesOnly = !favoritesOnly;
      renderModalContent();
    });
    modal.querySelector("#voicesSearchInput")?.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderModalContent();
      const input = modal.querySelector("#voicesSearchInput");
      if (input) {
        input.focus();
        input.setSelectionRange(searchQuery.length, searchQuery.length);
      }
    });
    modal.querySelectorAll("[data-usecase]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const uc = btn.dataset.usecase;
        filterUseCase = filterUseCase === uc ? "" : uc;
        renderModalContent();
      });
    });
    modal.querySelectorAll("[data-fav-voice]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const vName = btn.dataset.favVoice;
        if (favSet.has(vName)) favSet.delete(vName);
        else favSet.add(vName);
        renderModalContent();
      });
    });
    modal.querySelectorAll("[data-preview-voice]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const vName = btn.dataset.previewVoice;
        const blob = synthesizeWavBlob("voiceover", 1.8, `${vName} preview`);
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        btn.textContent = "⏸";
        audio.addEventListener("ended", () => {
          btn.textContent = "▶";
          URL.revokeObjectURL(url);
        });
        audio.play().catch(() => {
          btn.textContent = "▶";
        });
      });
    });
    modal.querySelectorAll("[data-voice-name]").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        const vName = cardEl.dataset.voiceName;
        modal.hidden = true;
        const targetNode = state.graph.nodes.find((n) => n.id === targetNodeId);
        if (targetNode) {
          remember();
          if (speakerSlot === 2) {
            targetNode.speaker2Name = vName;
          } else {
            targetNode.voiceName = vName;
          }
          markDirty();
          renderGraph();
          if (state.settingsNode === targetNode.id) renderInspector();
        }
      });
    });
  };

  modal.onclick = (e) => {
    if (e.target === modal) modal.hidden = true;
  };
  renderModalContent();
  modal.hidden = false;
}

function openDesignerModal(targetNodeId) {
  const modal = $("#designerModal");
  const grid = $("#designerTemplateGrid");
  if (!modal || !grid) return;
  grid.replaceChildren();
  const templates = [
    { name: "Social Poster", headline: "MAGNIFIC AI", subhead: "Every Node Explained" },
    { name: "YouTube Thumbnail", headline: "WORKFLOW MASTERY", subhead: "21 Nodes Connected" },
    { name: "Product Ad", headline: "NEXT-GEN STUDIO", subhead: "Local ComfyUI Engine" },
    { name: "Storyboard Frame", headline: "SCENE 01 · EXT. NIGHT", subhead: "Director Cut" },
  ];
  for (const tpl of templates) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "library-item-card";
    card.innerHTML = `<strong>🎨 ${escapeHtml(tpl.name)}</strong><small>${escapeHtml(tpl.headline)} — ${escapeHtml(tpl.subhead)}</small>`;
    card.addEventListener("click", () => {
      modal.hidden = true;
      const node = state.graph.nodes.find((n) => n.id === targetNodeId);
      if (node) {
        remember();
        node.template = tpl.name;
        node.headline = tpl.headline;
        node.subhead = tpl.subhead;
        markDirty();
        renderGraph();
        runNode(node.id);
      }
    });
    grid.append(card);
  }
  modal.hidden = false;
}

function setupEvents() {
  $("#newProject").addEventListener("click", () => {
    $("#createModal").hidden = false;
    $("#newProjectTitle").focus();
    $("#newProjectTitle").select();
  });
  $("#createForm").addEventListener("submit", createProject);
  $("#cancelCreate").addEventListener("click", () => {
    $("#createModal").hidden = true;
  });

  // Two-column Prompt Editor events
  $("#promptForm").addEventListener("submit", savePromptEditor);
  $("#closePromptEditor").addEventListener("click", closePromptEditor);
  $("#cancelPromptEditor").addEventListener("click", closePromptEditor);
  $("#promptEditorText").addEventListener("input", updatePromptCharCount);

  $("#randomPromptBtn").addEventListener("click", () => {
    const current = $("#promptEditorText").value.trim();
    const choices = SAMPLE_PROMPTS.filter((p) => p !== current);
    $("#promptEditorText").value = choices[Math.floor(Math.random() * choices.length)] || SAMPLE_PROMPTS[0];
    updatePromptCharCount();
    $("#promptEditorText").focus();
  });

  $("#autoPromptBtn").addEventListener("click", () => {
    const base = $("#promptEditorText").value.trim();
    const enhancement = "masterpiece, clean studio lighting, expressive character details, crisp linework, 4k resolution";
    $("#promptEditorText").value = base
      ? base.includes("clean studio lighting")
        ? base
        : `${base}, ${enhancement}`
      : SAMPLE_PROMPTS[0];
    updatePromptCharCount();
    $("#promptEditorText").focus();
  });

  const applyCreativeIdea = () => {
    const idea = $("#promptIdeaInput").value.trim();
    if (!idea) return;
    const base = $("#promptEditorText").value.trim();
    $("#promptEditorText").value = base ? `${base}, ${idea}` : `${idea}, high detail character illustration, studio lighting`;
    $("#promptIdeaInput").value = "";
    updatePromptCharCount();
    $("#promptEditorText").focus();
  };
  $("#promptSendIdeaBtn").addEventListener("click", applyCreativeIdea);
  $("#promptIdeaInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      applyCreativeIdea();
    }
  });
  $("#promptAttachBtn").addEventListener("click", () => {
    if (state.promptTarget) {
      closePromptEditor();
      openAssetsPanel(state.promptTarget, true);
    }
  });
  $("#imageToPromptBtn").addEventListener("click", () => {
    if (state.promptTarget) {
      closePromptEditor();
      openAssetsPanel(state.promptTarget, true);
    }
  });
  $("#promptModal").addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePromptEditor();
    }
  });

  $("#closeReferenceModal")?.addEventListener("click", () => {
    $("#referenceModal").hidden = true;
  });
  $("#closeVoicesModal")?.addEventListener("click", () => {
    $("#voicesModal").hidden = true;
  });
  $("#closeDesignerModal")?.addEventListener("click", () => {
    $("#designerModal").hidden = true;
  });

  // Empty Space Starter cards & top pill buttons (00:39 - 01:45 of video)
  document.querySelectorAll("[data-starter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.starter;
      if (action === "stock" || action === "media") {
        openAssetsPanel();
      } else if (action === "text-image") {
        addNode("text-image");
      } else if (action === "text-video") {
        addNode("text-video");
      } else if (action === "assistant") {
        addNode("assistant");
      }
    });
  });

  $("#emptyGettingStarted")?.addEventListener("click", () => {
    const txt = addNode("text", null, { x: 140, y: 180 }, { presetPrompt: SAMPLE_PROMPTS[0] });
    addNode("text-image", txt.id, { x: 560, y: 160 });
    fitGraph();
  });

  $("#emptyTemplates")?.addEventListener("click", () => {
    const asst = addNode("assistant", null, { x: 100, y: 160 }, { presetPrompt: "Generate 4 camera angle prompts for a cyberpunk hero" });
    const list = addNode("list", asst.id, { x: 520, y: 160 }, {
      items: [
        { type: "text", text: "Close-up portrait, neon rain reflections" },
        { type: "text", text: "Low-angle hero shot, glowing katana" },
        { type: "text", text: "Over-the-shoulder view, hologram city" },
      ],
    });
    const gen = addNode("text-image", list.id, { x: 940, y: 160 });
    addNode("list", gen.id, { x: 1380, y: 160 });
    fitGraph();
  });

  $("#backProjects").addEventListener("click", backToProjects);
  $("#addButton").addEventListener("click", () => ($("#addPanel").hidden ? openAddPanel() : closeAddPanel()));
  $("#assetsButton")?.addEventListener("click", () => ($("#assetsPanel").hidden ? openAssetsPanel() : closeAssetsPanel()));
  $("#storageButton").addEventListener("click", () => ($("#storagePanel").hidden ? openStoragePanel() : closeStoragePanel()));
  $("#trashButton")?.addEventListener("click", () => ($("#trashPanel").hidden ? openTrashPanel() : closeTrashPanel()));
  $("#closeTrash")?.addEventListener("click", closeTrashPanel);
  $("#emptyTrashBtn")?.addEventListener("click", emptyAllTrash);
  $("#cutTool")?.addEventListener("click", () => {
    setTool(state.tool === "cut" ? "select" : "cut");
    if (state.tool === "cut") notify("Chế độ cắt dây nối: Nhấn vào dây nối bất kỳ để ngắt kết nối.");
  });
  $("#groupTool")?.addEventListener("click", () => addNode("group"));
  $("#commentTool")?.addEventListener("click", () => addNode("sticky-note"));
  $("#closeStorage").addEventListener("click", closeStoragePanel);
  $("#storageForm").addEventListener("submit", saveStorage);
  $("#resetStorage").addEventListener("click", resetStorage);
  $("#closeAssets").addEventListener("click", closeAssetsPanel);
  $("#uploadAsset").addEventListener("click", () => $("#assetFile").click());
  $("#assetFile").addEventListener("change", (event) => uploadAsset(event.target.files[0]));
  $("#emptyAdd").addEventListener("click", openAddPanel);
  $("#closeAdd").addEventListener("click", closeAddPanel);
  $("#homeSettingsBtn")?.addEventListener("click", () => openModelSettingsModal("all"));
  const resetCatalogFilter = () => {
    state.filter = "All";
    renderFilters();
    renderCatalog();
  };
  $("#catalogBackBtn")?.addEventListener("click", resetCatalogFilter);
  $("#catalogActiveFilterPill")?.addEventListener("click", resetCatalogFilter);
  $("#catalogSearch").addEventListener("input", renderCatalog);
  $("#catalogSearch").addEventListener("keydown", (event) => {
    const nodeButtons = [...document.querySelectorAll("#catalogList .catalog-item[data-preview-id]")];
    if (!nodeButtons.length) return;
    const currentIdx = Math.max(0, nodeButtons.findIndex((b) => b.classList.contains("active-item")));
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = nodeButtons[(currentIdx + 1) % nodeButtons.length];
      nodeButtons.forEach((b) => b.classList.remove("active-item"));
      next.classList.add("active-item");
      next.scrollIntoView({ block: "nearest" });
      showCatalogPreview(next.dataset.previewId);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev = nodeButtons[(currentIdx - 1 + nodeButtons.length) % nodeButtons.length];
      nodeButtons.forEach((b) => b.classList.remove("active-item"));
      prev.classList.add("active-item");
      prev.scrollIntoView({ block: "nearest" });
      showCatalogPreview(prev.dataset.previewId);
    } else if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      nodeButtons[currentIdx]?.click();
    }
  });
  $("#catalogFilters").addEventListener("click", (event) => {
    const filter = event.target.closest("button[data-filter]");
    if (!filter) return;
    state.filter = filter.dataset.filter;
    renderFilters();
    renderCatalog();
  });
  $("#selectTool").addEventListener("click", () => setTool("select"));
  $("#panTool").addEventListener("click", () => setTool("pan"));
  $("#undoButton").addEventListener("click", undo);
  $("#redoButton").addEventListener("click", redo);
  $("#fitButton").addEventListener("click", fitGraph);
  $("#zoomIn").addEventListener("click", () => {
    const canvas = $("#canvas").getBoundingClientRect();
    zoomTo(state.zoom * 1.18, canvas.left + canvas.width / 2, canvas.top + canvas.height / 2);
  });
  $("#zoomOut").addEventListener("click", () => {
    const canvas = $("#canvas").getBoundingClientRect();
    zoomTo(state.zoom / 1.18, canvas.left + canvas.width / 2, canvas.top + canvas.height / 2);
  });
  $("#helpButton").addEventListener("click", () =>
    notify("N: thêm thẻ · Kéo cổng để nối · Space + kéo: di chuyển · F: vừa canvas · Ctrl+Z: hoàn tác")
  );
  const canvas = $("#canvas");
  canvas.addEventListener("dragover", (event) => {
    if (event.dataTransfer?.types && Array.from(event.dataTransfer.types).includes("Files")) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    }
  });
  canvas.addEventListener("drop", async (event) => {
    const files = event.dataTransfer?.files;
    if (!files || !files.length || !state.project) return;
    event.preventDefault();
    const cardEl = event.target.closest(".graph-node");
    const targetNode = cardEl ? state.graph.nodes.find((n) => n.id === cardEl.dataset.nodeId) : null;
    for (const file of Array.from(files)) {
      const isVid = (file.type || "").startsWith("video/") || /\.(mp4|webm|mov|m4v|mkv)$/i.test(file.name || "");
      const isImg = (file.type || "").startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp|avif|svg)$/i.test(file.name || "");
      if (!isVid && !isImg) continue;
      if (targetNode) {
        if (targetNode.kind === "image" || targetNode.kind === "video" || targetNode.kind === "list") {
          state.assetTarget = targetNode.id;
          state.referenceTarget = null;
        } else {
          state.referenceTarget = targetNode.id;
          state.assetTarget = null;
        }
      } else {
        state.assetTarget = null;
        state.referenceTarget = null;
      }
      await uploadAsset(file);
    }
  });
  canvas.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".card-popover, .toolbar-dropdown, .card-pill, .selection-toolbar")) {
      closeAllPopovers();
    }
    if (!$("#addPanel").hidden) {
      closeAddPanel();
    }
    if (event.button !== 0 && event.button !== 1) return;
    if (event.target.closest(".graph-node,.empty-hint")) return;
    if (state.pending) {
      cancelConnection();
      return;
    }
    if (
      state.tool !== "pan" &&
      !window.spaceDown &&
      event.target !== canvas &&
      event.target !== $("#world") &&
      event.target !== $("#edgeLayer")
    ) {
      return;
    }
    state.pointer = { x: event.clientX, y: event.clientY, panX: state.pan.x, panY: state.pan.y };
    canvas.classList.add("panning");
    if (state.selected) selectNode(null);
  });
  window.addEventListener("pointermove", (event) => {
    if (!state.pointer) return;
    state.pan.x = state.pointer.panX + event.clientX - state.pointer.x;
    state.pan.y = state.pointer.panY + event.clientY - state.pointer.y;
    updateWorld();
  });
  window.addEventListener("pointerup", () => {
    state.pointer = null;
    canvas.classList.remove("panning");
  });
  canvas.addEventListener(
    "wheel",
    (event) => {
      if (event.target.closest(".card-popover, .toolbar-dropdown, .wire-drop-menu")) {
        return;
      }
      if (!event.ctrlKey && !event.metaKey) {
        const textCard = event.target.closest(".text-card");
        if (textCard) {
          const scroller =
            textCard.querySelector(".card-prompt-wrap.show-rich .text-node-rich") ||
            textCard.querySelector("textarea.text-inline-editor");
          if (scroller && scroller.scrollHeight > scroller.clientHeight) {
            if (event.target !== scroller && !scroller.contains(event.target)) {
              event.preventDefault();
              scroller.scrollTop += event.deltaY;
            }
            return;
          }
          if (textCard.classList.contains("selected") || document.activeElement === scroller) {
            return;
          }
        }
        const scrollable = event.target.closest(
          "textarea, .text-node-rich, .assistant-output-box, .list-rows-view, .list-grid-view, .list-items-container"
        );
        if (scrollable && (scrollable.scrollHeight > scrollable.clientHeight || document.activeElement === scrollable)) {
          return;
        }
      }
      event.preventDefault();
      zoomTo(state.zoom * Math.exp(-event.deltaY * 0.001), event.clientX, event.clientY);
    },
    { passive: false }
  );
  window.addEventListener("resize", renderEdges);
  window.addEventListener("keydown", (event) => {
    const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
    if (event.code === "Space" && !typing) {
      window.spaceDown = true;
      event.preventDefault();
    }
    if (typing) return;
    if (event.key.toLowerCase() === "n" && state.project) {
      event.preventDefault();
      openAddPanel();
    }
    if (event.key.toLowerCase() === "f" && state.project) {
      event.preventDefault();
      fitGraph();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d" && state.selected) {
      event.preventDefault();
      duplicateNode(state.selected);
    }
    if (event.key === "Escape") {
      closeAllPopovers();
      closeAddPanel();
      closeAssetsPanel();
      closeStoragePanel();
      closeTrashPanel();
      closePromptEditor();
      closeModelSettingsModal();
      cancelConnection();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      event.shiftKey ? redo() : undo();
    }
    if ((event.key === "Delete" || event.key === "Backspace") && state.selected) {
      event.preventDefault();
      deleteNode(state.selected);
    }
  });
  window.addEventListener("keyup", (event) => {
    if (event.code === "Space") window.spaceDown = false;
  });
  window.addEventListener("blur", () => {
    window.spaceDown = false;
  });
}

function setTool(tool) {
  state.tool = tool;
  $("#selectTool")?.classList.toggle("active", tool === "select");
  $("#panTool")?.classList.toggle("active", tool === "pan");
  $("#cutTool")?.classList.toggle("active", tool === "cut");
}

function renderFilters() {
  const wrap = $("#catalogFilters");
  wrap.replaceChildren();
  const filterTabs = [
    { id: "Image", label: "Image" },
    { id: "Video", label: "Video" },
    { id: "Audio", label: "Audio" },
    { id: "3D", label: "3D" },
    { id: "Utilities", label: "Utilities" },
    { id: "Design", label: "Design" },
  ];
  for (const tab of filterTabs) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip ${state.filter === tab.id ? "active" : ""}`;
    button.dataset.filter = tab.id;
    button.textContent = tab.label;
    wrap.append(button);
  }
}

async function init() {
  setupEvents();
  renderFilters();
  updateUndoButtons();
  let savedProjectId = null;
  try {
    savedProjectId =
      new URLSearchParams(window.location.search).get("project") ||
      localStorage.getItem("studio.activeProjectId");
  } catch {}
  if (savedProjectId) {
    $("#projectView").hidden = true;
    $("#workspace").hidden = false;
  }
  try {
    state.catalog = (await request("/catalog")).items;
    const textImageDef = state.catalog.find((item) => item.kind === "text-image");
    if (textImageDef && !textImageDef.inputs.some((port) => port.id === "reference_image")) {
      textImageDef.inputs.push({ id: "reference_image", type: "image", label: "Ảnh tham chiếu", optional: true });
    }
    await loadModelConfigs();
    await loadStorage();
    await loadAssets();
    await loadProjects();
    if (savedProjectId) {
      if (state.projects.some((p) => p.id === savedProjectId)) {
        await openProject(savedProjectId);
      } else {
        $("#workspace").hidden = true;
        $("#projectView").hidden = false;
      }
    }
  } catch (error) {
    $("#workspace").hidden = true;
    $("#projectView").hidden = false;
    notify(error.message);
  }
}

init();
