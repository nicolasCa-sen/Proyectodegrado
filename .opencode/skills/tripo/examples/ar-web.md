# Recipe: AR / Web / e-commerce

iOS QuickLook needs USDZ; the web wants a small GLB. The ar-web scenario delivers both.

```bash
tripo make product.jpg --for ar-web --json --yes
# → P2 generate (face_limit 20000) → convert USDZ
# GLB: source_model_file (in source_output_dir); USDZ: model_file (in output_dir).
```

Tighter mobile budget:

```bash
tripo make product.jpg --for ar-web -p face_limit=8000 --json --yes
```

Web-only (skip USDZ):

```bash
tripo make product.jpg --model tripo-p2 -p face_limit=10000 --json --yes
```

`--then` replaces the preset's whole chain, so `--for ar-web --then ...` downloads only its final step. The GLB + USDZ dual download applies only to the preset's own chain.

Faithful textures from the photo: image inputs default to `texture_alignment=original_image` server-side; add `-p texture_alignment=geometry` only for stylized re-texturing.
