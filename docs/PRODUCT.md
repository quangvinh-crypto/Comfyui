# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The first release is for the owner's internal use without in-app accounts or sign-in. Selling access to other users is a possible later phase, not a requirement for the first release.

## Product Purpose

Provide a visual, easy-to-operate creative workspace for generating and editing images and videos with local ComfyUI workflows and external model APIs. The interface should make common operations understandable without requiring users to edit low-level ComfyUI nodes.

## Operating Context

Development starts in this ComfyUI repository on a Windows machine with a GTX 1650 4 GB GPU and 16 GB RAM. The owner intends to deploy the finished product to a VPS. The `downloads` folder contains Magnific Spaces recordings, a tutorial covering its nodes, and a ComfyUI/Civitai installation tutorial that serve as functional references.

## Capabilities and Constraints

- Preserve ComfyUI's workflow engine and local model ecosystem behind a simpler interface.
- Use visible typed connection ports (for example `T` for text and an image glyph for images), with inputs arranged vertically on the left of each card and outputs on the right.
- Support external providers including Seedance and Google's Nano Banana, with a clear way to configure the correct API credentials for each provider.
- Defer Civitai browsing, model downloads, prompt import, and custom-node installation until after the five core creation modes work end to end.
- Keep generated images and videos in an organized library and allow the owner to configure their storage location.
- Design local and VPS execution as supported environments.
- The first release has no in-app authentication; external access to a future VPS remains an open deployment decision.
- Ownership and billing of provider API keys for the internal release remain open decisions.

## Brand Commitments

Magnific Spaces is the interaction and usability reference. The product needs its own identity and should not depend on Magnific's source code or services.

## Evidence on Hand

- Local ComfyUI source, API routes, model folders, and SQLite-backed asset features in this repository.
- `downloads/Magnific AI Tutorial： EVERY Node Explained (Freepik Spaces).webm`, which matches the linked YouTube tutorial.
- Other Magnific screen recordings and stills under `downloads/`.
- `downloads/ComfyUI toàn tập ｜ Cài đặt ComfyUI, tạo custom node - Mì AI.webm`.
- The current functional, UI, architecture, and execution plans are indexed in `docs/README.md`.

## Product Principles

- Put visible media, prompts, and results at the center of routine work.
- Show model-specific controls only when they apply to the selected model.
- Make local and provider-backed execution explicit before a paid request runs.
- Keep files portable between a local installation and VPS storage.
- Preserve an advanced route to ComfyUI's full workflow capabilities.
