# Common errors & fixes

| exit | api code | meaning | fix |
| --- | --- | --- | --- |
| 3 | 1002 | authentication failed (invalid/missing API key) | set `TRIPO_API_KEY` or run `tripo login`; check the key wasn't revoked |
| 3 | 1005 | forbidden (no permission for this resource) | check account permissions |
| 2 | 1003/1004 | malformed request / invalid parameter | check spelling against `tripo docs --topic commands/<cmd>`; the CLI strips unsupported P-series and v2.5 parameters with warnings (`quad` on P1; `smart_low_poly`, `generate_parts`, or `geometry_quality` on P1/P2; those plus `quad`, `auto_size`, `compress` on v2.5). Classic 1004s: `generate_parts=true` with texture/pbr on, `ref_image` on segment v1, `smart_uv=true` on decimate v1.0/v2.0, non-GLB input to smartsegment `model`, `texture_quality=fast` on a texture version other than v3.5. `invalid model`: the API only accepts dated wire values (`P2-20260801`, `v3.1-20260211`…) — pass the CLI alias (`--model tripo-p2`) and let the CLI normalize, or the wire value itself; never `tripo-*` straight to the API. Table: `commands/generate` § "Models & Versions" |
| 9 | 1007 | per-API-key rate limit | the CLI already waits out `X-RateLimit-Reset` / `Retry-After` (up to 60 s per wait, 3 retries); if it still exits 9, wait longer before re-running |
| 9 | 2000 | per-account concurrency pool full (see table below) | the CLI waits out `Retry-After` (up to 60 s, 3 retries) first; then wait for a task in that category to finish, or lower `--concurrency` in batch; other categories are unaffected |
| 8 | 2001 | task not found | task ids are account-scoped — same key that created it? right region (ov/cn)? |
| 2 | 2002 | unsupported request parameter | check field names and values against `tripo docs --topic commands/<cmd>` (some values need a newer model version) |
| 2 | 2003 | empty input file / unreachable URL | verify the file isn't empty and the URL is publicly accessible |
| 2 | 2004 | unsupported file type | images: PNG/JPEG/WebP/BMP/TIFF ≤20MB; models: GLB/GLTF/FBX/OBJ/STL ≤150MB (a `.gltf` must embed its buffers/textures — otherwise use .glb or a URL) |
| 2 | 2005/2006/2007 | upstream task wrong type / not successful | the chain needs a successful task of the right type (the CLI validates locally first) |
| 5 | 2008 | content policy violation | change the prompt/image |
| 2 | 2009 | prompt contains invalid characters | remove unusual characters from the prompt |
| 4 | 2010 | insufficient credits | stop: every retry fails the same way, so never retry or resubmit with other params/models; give the human the top-up link from `suggestion` (or `tripo topup`, a human action) and wait until they confirm; `tripo balance` to check. `batch run` stops starting new jobs and exits 4; re-run it after the top-up to resume |
| 2 | 2011/2012 | animation chain input invalid | rig-check needs a model-producing task; retarget needs a rig task |
| 2 | 2015/2016/2017 | version/type deprecated or invalid | drop the explicit `--model`; the CLI default is current |
| 2 | 2018 | too complex to remesh | lower `face_limit` or simplify the input model |
| 8 | 2019 | file not found (token expired?) | re-upload; file tokens are short-lived |
| 2 | 2020/2021/2022 | bad image URL / file too large / image too large | fix the URL or shrink the file |
| 7 | 1000/1001 | server-side error | queries auto-retry on 1000, task creation does not (the task may already exist and be billed — check `tripo balance` frozen credits before re-running); if persistent, contact support with the `request_id` |
| 6 | — | task failed server-side, or the watch timed out | failed / cancelled: frozen credits auto-refund (the error shows the task's `error_code` / `error_message`); `tripo redo` often succeeds with a new seed, but it is a new paid task with no plan card or confirmation, so ask the human first. `timeout`: the task is still running and is billed if it succeeds — `tripo task watch <id> --download`, never redo |
| 7 | — | network/5xx | queries auto-retried 3×, task creation is not (follow the `suggestion`: check `tripo balance` before re-running); check `tripo doctor`; region mismatch (ov/cn) is a common cause |
| 7 | — | task succeeded but downloading its artifacts failed | the task is finished and billed; the error JSON carries `task_id` — run `tripo task get <task_id> --download`, never re-make (batch marks the job `needs_attention`; `make -n` keeps the candidate with `download_error`) |
| 2 | — | no task on stdin (headless process command with nothing piped, or an upstream that printed no task) | nothing was submitted; pass the input explicitly (`tripo model texture <task_id>` or `@last`). A failed upstream's error JSON is passed through with its own exit code |

## Concurrency pools (default per account; error 2000 when full)

| category | task types | default concurrency |
| --- | --- | --- |
| 3D generation — H series | text/image/multiview-to-model on `tripo-v3.x` / `v2.5` | 10 |
| 3D generation — P series | text/image/multiview-to-model on `tripo-p1` / P2 | 5 |
| image generation | text-to-image, image-to-image, image-to-multiview, edit-multiview | **1** |
| animation | rig-check, rig, retarget | 10 |
| model processing | texture, convert | 5 |
| mesh operations | segment, complete, decimate | 10 |

Pools are independent: a full H-series pool does not block P-series or image tasks. Image generation is serial by default — do not fan out text-to-image jobs. Higher limits are granted on request via support.

## Frequent local validations (caught before spending credits)

- `complete` only accepts a `segment` task; `retarget` only accepts a `rig` task (a file/URL is refused before upload)
- quad + GLTF export → rejected (quads cannot be stored in glTF; quad forces FBX output); use `--format FBX`
- `texture_quality=fast` with an explicit texture version other than `v3.5-20260815` → rejected (omit the version and the CLI selects v3.5)
- P1 + face_limit outside 50–20000 → rejected; use P2 for 48–50000 triangles / 48–25000 quads, or H3.1 beyond P2
- P2 + face_limit outside 48–50000 triangles (or 48–25000 with `quad=true`) → rejected; use H3.1 for a higher budget
- decimate `smart_uv` without `--model v3.0` → rejected (v3.0 only, and v3.0 bills above the default v2.0, so the CLI never switches for you)
- segment `segmentation_granularity` / `split_by_connectivity` / `ref_image` on an explicit v1.0 → rejected; with no model given the CLI selects v2.0
- `generate_parts=true` with `smart_low_poly=true` → rejected (upstream smart_low_poly wins and no parts are produced)
- image `template` outside the endpoint's list → rejected; `quality` / `aspect_ratio` / `watermark` on a model family without them → removed with a warning
- multiview without a front view → rejected (name a file "front" or pass it first)
- `-n` with `--then` needs an interactive terminal (pick the winner first, then chain)

All of these surface in `tripo make ... --dry-run --json` as `errors` (blocking) or `warnings` (auto-adjusted) before anything is uploaded or submitted.

## Weird-but-normal

- `model_url` in task output points to a file that may be named `pbr_model` etc. — normal, just download it (the CLI does).
- Output URLs expire in ~5 minutes — never cache them; re-run `tripo task get <id> --download`.
- `frozen` balance = holds for running tasks; it settles or refunds automatically.
- `credits_consumed` / `balance` / `frozen` are decimals (e.g. `48.00`) — parse as float, never as int.
- Task status can also be `banned` (content policy — change the input) or `expired` (output files gone — regenerate); the CLI treats both as terminal failures.
- A downstream step after a generation that used `export_orientation` succeeds but comes out **wrongly oriented** — no error is raised. Set the orientation on the final `convert` step instead.
- `generate_parts` with `quad=true` produces triangle parts.
- `image-to-splat` yields a `.splat`, not a mesh — texture / rig / convert steps cannot follow it.
- `uv` accepts any model at creation, but an input over 80,000 equivalent triangles fails at run time (credits refunded) — decimate first: `--then decimate:20000,uv`.
