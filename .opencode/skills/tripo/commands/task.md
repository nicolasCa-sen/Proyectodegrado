# tripo task / files / history

## tripo task get <id|@last|@name>

Fetch one task. `--step` adds pipeline step details. `--download` fetches artifacts (output URLs expire in ~5 minutes, so the CLI always re-queries before downloading). Import tasks, and processing tasks whose model input was a file / URL, also carry `output.normalize_scale` (final size = original size × normalize_scale); `--download` records it in `task.json`.

```bash
tripo task get @last --download --json
```

## tripo task watch <id>

Block until the task finishes. Progress goes to stderr (plain lines in `--json` mode, one per progress change); stdout carries only the final task detail as one JSON line. `--download` grabs artifacts on success. `--timeout <seconds>` (default 1800).

Rules for agents: treat `watch` as synchronous; wait for the process to exit and read its one stdout JSON line; exit code 6 means the task failed (credits refunded) — or, if the error says `timeout`, that it is still running (watch it again; do not resubmit).

## tripo task list [ids...]

Batch query. With no ids, shows the most recent local history entries (server-refreshed). JSON output is `{"tasks":[...],"missed":[id,...]}` — `missed` lists ids the server could not find (wrong account/region).

## tripo files upload <path>

Upload an image (≤20MB, PNG/JPEG/WebP/BMP/TIFF) or model (≤150MB, GLB/GLTF/FBX/OBJ/STL). Prints `{"file_token":"file_..."}` — pass it as the input of `generate` and processing commands. `tripo make` treats a `file_...` token like a task reference, so it needs `--then`; to generate from an uploaded image, use `tripo generate image-to-model <file_token>`. Files over 60 MB and every `.gltf` go through a presigned URL. A `.gltf` must be self-contained (buffers/textures as `data:` URIs); one that references external files is rejected — export as `.glb` or pass a URL instead.

## tripo history

Local task history with `@name` references: `{"task_id","type","name","status","output_dir"}`.
