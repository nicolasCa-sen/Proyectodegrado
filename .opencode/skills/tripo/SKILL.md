---
name: tripo-cli
description: Generate and process 3D models with the Tripo API through the tripo CLI - text or images to GLB/FBX/OBJ/STL/USDZ, texturing, rigging, animation, mesh tools and format conversion, with plan cards and credit estimates. Use when the user wants to create, convert, rig, animate or 3D-print a 3D asset, or mentions Tripo.
---

# Tripo CLI Skill

**Bundled with tripo-cli 0.11.2.**

- PBR is off by default: an omitted `pbr` is sent as `false` on 3D generation (presets included) and on `texture`. Add `-p pbr=true` only when the user explicitly asks for PBR; it also applies to `--then texture` steps that don't set `pbr`.
- Display aliases `H3.1`, `H3.0`, `H2.5`, `P1.0`, `P2.0` (case-insensitive) normalize before validation; unknown 3D/image model IDs fail locally.
- `make` validates deterministic later steps before uploading or generating.
- Plan cards and `--dry-run` JSON (`generation_credits_estimate`) show the official list-price estimate for the generation step; P1, legacy models and `--then` chain steps are **not estimated**, which never means zero credits.
- Do not interpret `valid=true` as a quotation or proof that arbitrary passthrough fields are supported. Check warnings and the normalized payload: unsupported P-series fields are removed with warnings, not sent to the API.
- Image model `chat_image_1` is retired and rejected; `chat_image_1.5` is still valid until its retirement on 2026-12-01 (the CLI warns until then and rejects it afterwards).
- Never automatically swap models and resubmit a paid task.
- Without an explicit user choice, quadruped rigs use `rig-v2.5`; other body types keep v3.0. Chains apply that default after rig-check, including `--for anim`. A standalone `tripo anim rig` does not infer the body type: save the original model task id (the check changes `@last`), run `tripo anim check`, inspect it with `tripo task get <check_task_id> --json`, then rig the original model with the recommended `--rig-type`. An explicit rig model always wins.

You (an AI coding agent) can generate production-ready 3D assets with the `tripo` CLI.
One command turns a text prompt or an image into local files: a 3D model (glb/fbx/stl/...), a `preview.png` render, and a `task.json` record.

When the calling host is known, set `TRIPO_CLIENT_APP` to its actual name
(`codex`, `workbuddy`, `zcode`, `kimi`, `deepseek`, `claude`, `cursor`, or `chatgpt`) on each
CLI command, including every command in a pipeline. Do not guess from the model,
API key, account region, or an earlier call. Set `TRIPO_DISTRIBUTION_CHANNEL` only
when a packaged plugin provides it; a standalone CLI install is not a plugin.
These values are per-call metadata, never account-profile settings.

## Install & auth

```bash
npm install -g tripo-cli        # or: npx tripo-cli ...
export TRIPO_API_KEY=tsk_...    # highest-priority auth; no interaction needed
                                # (PowerShell: $env:TRIPO_API_KEY = "tsk_...")
                                # China-site key? also export TRIPO_REGION=cn (env keys default to ov)
tripo doctor                    # verify key, network, balance
```

If there is no key, run the device login **yourself** — it works without a TTY.
First ask the human which Tripo site their account is on, and do not guess: the
login only works on the site it was started for.

- `cn` — China mainland site developers.tripo3d.com (phone/SMS sign-in, Alipay)
- `ov` — international site developers.tripo3d.ai (email sign-in, Stripe)
- no account yet: mainland China → `cn`, everywhere else → `ov`

```bash
tripo login --region <cn|ov> --no-wait    # the site the human named
```

It prints a verification URL and a one-time code and exits at once. Relay the
URL and code to the human and tell them: sign in on that page first if it asks
(sign-up gives free credits), enter the code, pick an API key if the account has
several (one is created automatically if there are none), click Authorize. When
they say it is done, run the same command again: it finishes the login with that
same code (`"status":"logged_in"`), or answers `"status":"pending"` if they have
not authorized yet. Without `--no-wait` the command itself waits for the approval
(up to ~15 minutes); if it gets cut off, rerunning resumes the same code. The
key is then saved locally; never ask the human to paste a key into the chat. If
the code expires (exit 3), just run the same command again; if the human says
the page is the wrong site, rerun with the other `--region`.

Regions (ov = international, cn = China mainland) share one CLI: `tripo login --key tsk_...` auto-detects which region the key belongs to. Already logged into the wrong site? `tripo login --region <other>` replaces the active profile's key and region. On exit code 3 (auth), run `tripo doctor` — it diagnoses key-vs-region mismatches and prints the exact fix (`tripo config set region cn|ov`).

## Behavior rules (read first)

1. **`tripo make` is synchronous and blocking.** It prints a plan card on stderr (one numbered line per API call: endpoint, purpose, args), then submits, polls, downloads artifacts, and exits. In a TTY it asks "Run this plan?" first; `--yes` (auto-enabled when headless) skips the prompt but still prints the card. Wait for the process to finish and read the final JSON from stdout. Do NOT re-implement polling, do NOT add your own timeout shorter than 15 minutes, do NOT stop just because you saw a task_id in the logs.
2. **stdout is the contract; stderr is commentary.** With `--json` (auto-enabled when piped), every result command prints exactly one JSON line on stdout (`docs`/`completion` print text, `mcp` speaks JSON-RPC). Progress/logs go to stderr.
3. **Artifacts are local files.** The result JSON has `output_dir`, `model_file`, `preview`. Look at `preview.png` to judge quality. Ask the human before re-rolling: `tripo redo` submits a new paid task at once, with no plan card and no confirmation.
4. **Exit codes are stable** — branch on them:
   - 0 success · 1 unexpected error · 2 usage/params · 3 auth · 4 insufficient credits (stop at once: do not retry, resubmit with other params/models, or run other paid commands; give the human the top-up link from `suggestion` — or `tripo topup` — and wait until they confirm) · 5 content policy
   - 6 task failed (credits auto-refunded; on `timeout` it is still running — `tripo task watch <id>`, never redo)
   - 7 network: a failed submit is never resent and may already exist — check `tripo balance` before re-running. If the task succeeded but its download failed, the error JSON carries `task_id` — run `tripo task get <task_id> --download`, never re-make.
   - 8 not found · 9 rate limit (retry with backoff)
5. **Never invent parameters.** Unknown `--param key=value` pairs pass through to the API; stick to documented ones. The full parameter/model/preset reference from the official API docs is bundled: `tripo docs --topic commands/generate` (3D + image generation) and `tripo docs --topic commands/process` (texture/convert/rig/retarget/mesh) — read those instead of browsing the website.
6. **Validate before spending: `--dry-run --json`.** `make` prints normalized `steps[].payload`, `warnings` and `errors` with zero network calls and no credits; `tripo model texture ... --dry-run --json` does the same for a standalone texture request, including one with a `texture_prompt` object. For an existing generated task where the user requests PBR without guidance, `make <task_id> --then texture:pbr=true --dry-run --json` also works. Other `generate`, `model`, `anim` and `mesh` commands do not support this flag. Local validation failures exit 2; `valid=true` does not verify remote resources or guarantee server acceptance. Fix errors and review parameter adjustments with the user; disclose offline limitations and unestimated execution costs, get confirmation, then execute the planned command. Details: `tripo docs --topic commands/make` and `commands/process`.
7. **For 3D generation, default to P2; change generation models only through an explicit parameter.**
   - The CLI and both regional MCP servers default every 3D generation to `P2-20260801`, including all `--for` presets. Prompt wording, geometry options and face budgets never select a different model.
   - Explicit `--model` wins over `-p model=<string>`. `tripo ai` uses `-p model=<string>` for this override. Use the user's requested model; do not let a scenario or an expert suggestion replace it.
   - Use an explicit `--model H3.1` for H-only features such as `smart_low_poly`, `generate_parts` or `geometry_quality`. P2 keeps its face limits (48–50000 triangles; 48–25000 with quad); invalid limits fail rather than switch models. Unsupported parameters are removed with warnings, so review the normalized plan before execution.
   - P2 costs 100–130 credits per generation by texture tier; relay the plan estimate and get confirmation before spending. P1 and legacy models have no local estimate.
   - Aliases normalize to dated wire values (`tripo-p2` → `P2-20260801`). Every generation request explicitly includes the resolved `model`; the raw API requires it, so do not rely on an upstream default. Alias and capability details: `tripo docs --topic commands/generate`.
   - Keep the confirmed generation model explicit when moving from a plan to the execution request. This rule applies only to 3D generation. Rigging has its own defaults: `v2.5-20260210` for quadruped, `v3.0-20260909` otherwise; respect an explicit user choice and never reuse the generation model for rigging. Texture and other processing capabilities keep their own model defaults.

## The one command you usually need

```bash
tripo make "a medieval knight, T-pose" --for game-mobile --json --yes
tripo make concept.png --for print --json --yes
tripo make front.png back.png --json --yes                # 2-4 views → multiview
tripo make <task_id> --then texture:pbr=true --dry-run --json  # plan PBR on an existing task without guidance
tripo make @last --then convert:fbx --json --yes          # continue from last task
```

- For an imported mesh, supply `texture_prompt`. For later PBR, reuse the original reference when available with `tripo model texture <task_id> -p pbr=true -p 'texture_prompt={"image":"<file_token>"}' --json`; without guidance, use the `make --then texture` preflight above. `--then` cannot carry the guidance object. Nested image references take URLs, file tokens or local paths; write local files as `./concept.png`, absolute or `~/` paths: they are uploaded first (as in `tripo mcp --toolset full`) and a missing one fails the preflight. Preflight with `--dry-run --json` (rule 6) and confirm the plan before executing. Re-texturing regenerates textures and keeps geometry.
- `--for` scenario presets: `film` `print` `game-mobile` `game-pc` `ar-web` `anim` `toy` all default to P2; use `--model` to select another model explicitly.
- `--then` chain steps: `texture convert rig-check rig retarget segment complete decimate uv`
  - step args: `convert:format=FBX,texture_size=2048` (bare value = primary arg: `convert:fbx`, `decimate:5000`)
- Output JSON: `{"task_id","type","status","credits_consumed","output_dir","files",["model_file"],["source_model_file"],["preview"],["normalize_scale"],["chain"],["credits_breakdown"]}` — with `--then`, `credits_consumed` is the **total** for the run and `credits_breakdown` itemizes every task (`[{task_id,type,credits_consumed}]`, generation first)
  - `-n 2`–`-n 4` prints `{"candidates":[<one result per candidate>],"chain":[...],"credits_consumed","credits_breakdown"}` instead; a candidate whose download failed carries `download_error` (exit 7)
  - `normalize_scale` appears when the input was a model file / URL: the import rescaled it (final size = original size × normalize_scale; `1` = untouched) and nothing scales it back — divide by it to recover the original size

## Pipes (composing steps yourself)

Downstream commands read the upstream task from stdin:

```bash
tripo make humanoid.png --json | tripo anim rig --model rig-v3.0 --json | tripo anim retarget --param animation=preset:walk --json
```

If an upstream command fails or prints no task, the downstream submits nothing and exits with the upstream's exit code (or 2). Without a terminal on stdin, process commands never fall back to `@last`; pass the input explicitly.

## Other commands

| command | purpose |
| --- | --- |
| `tripo task get/watch <id> --download` | inspect / block on / download an existing task |
| `tripo balance` / `tripo usage` | credits: `{"balance","frozen"}` / recent spend |
| `tripo models` | accepted model ids per capability, defaults and aliases (local, no API call) |
| `tripo redo [@last]` | same request, new seed |
| `tripo view [@last]` | (humans) open a local 3D preview; agents read `preview.png` instead |
| `tripo files upload <path>` | get a `file_token` |
| `tripo batch run manifest.yaml` | bulk jobs, resumable; no plan card, so estimate and confirm first (`commands/batch` § Cost) |
| `tripo mcp` | run as an MCP server (tools: tripo_make, tripo_task_get, tripo_task_wait, tripo_balance, tripo_history; `--toolset full`: the hosted Tripo MCP tools plus tripo_download) |
| `tripo docs --topic commands/<name>` | print detailed docs for any command |

## Detailed docs in this package

- `commands/` — one file per command with every flag and parameter
  - model versions · H series (`tripo-v3.x`) · P series (`tripo-p1`, `tripo-p2`) · alias → wire value · GA / Legacy status · quad → `commands/generate` § "Models & Versions" (also the P Series endpoint entry points)
- `examples/` — copy-paste recipes per scenario (game/print/animation/...)
- `common-errors.md` — error table with fixes

Print any of them: `tripo docs --topic examples/game-asset`.
