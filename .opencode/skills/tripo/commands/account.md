# tripo login / balance / usage / topup / config / doctor

## Auth

```bash
export TRIPO_API_KEY=tsk_...     # zero interaction when a key is already provisioned
                                 # (PowerShell: $env:TRIPO_API_KEY = "tsk_...")
tripo login                      # humans in a terminal: interactive browser flow
tripo login --region ov|cn       # agents/CI without a key: headless device flow — prints a
                                 # verification URL + one-time code on stderr, waits for the
                                 # human to authorize in a browser (≤15 min), saves the key;
                                 # rerunning after an interruption resumes the same code
tripo login --region ov|cn --no-wait
                                 # chat agents: print the URL + code and exit at once; rerun
                                 # it after the human authorizes → "logged_in" (or "pending")
tripo login --key tsk_... --region ov|cn
tripo whoami                     # masked key + active profile + region + balance
tripo logout                     # removes the local key of the active profile only
```

Region decides the API host: ov → `openapi.tripo3d.ai`, cn → `openapi.tripo3d.com`.
`tripo login` probes both regions with the key and stores the right one; a key from `TRIPO_API_KEY` is **not** probed — a China-region key also needs `TRIPO_REGION=cn`.

## Multiple accounts (profiles)

```bash
tripo login --profile work-cn    # log a second account into its own profile (becomes active)
tripo use work-cn                # switch the active profile (no arg = interactive picker)
tripo balance --profile work-cn  # one-shot override on any command; TRIPO_PROFILE env works too
```

One profile = one account (key + region). Unknown `--profile` fails with exit 3 and the fix in the message — do not retry blindly.

## Credits

```bash
tripo balance      # {"balance":1000,"frozen":50} — frozen = running tasks' holds
tripo usage        # recent per-task spend
tripo topup        # opens the billing page, then polls until credits arrive
```

Exit code 4 anywhere = insufficient credits → stop at once (no retries, no resubmits with other params/models); give the human the top-up link from `suggestion` (or `tripo topup`) and wait until they confirm.
Failed / cancelled tasks refund their frozen credits automatically.

## Config

```bash
tripo config list
tripo config set region cn
tripo config set llm.base_url https://api.openai.com/v1     # enables `tripo ai` conversation mode
tripo config set llm.api_key sk-...
tripo config set llm.model gpt-4o-mini
tripo config context output_dir=./assets   # per-directory .tripo/context.json: default artifact dir
```

Env overrides: `TRIPO_API_KEY` `TRIPO_PROFILE` `TRIPO_REGION` `TRIPO_API_BASE_URL` `TRIPO_PLATFORM_BASE_URL` `TRIPO_HOME` `TRIPO_NO_UPDATE_CHECK` `TRIPO_ANALYTICS_ENABLED` `TRIPO_NPM_REGISTRY` `TRIPO_EXPERIMENTAL_MESH_EDIT` `TRIPO_LLM_BASE_URL` `TRIPO_LLM_API_KEY` `TRIPO_LLM_MODEL`, plus the standard `HTTPS_PROXY` / `HTTP_PROXY` / `NO_PROXY`.
`region`/`api_base_url`/`platform_base_url` are stored per profile; `llm.*` is shared.

## tripo doctor

Checks node version, key, API reachability, balance, config permissions, terminal capabilities. Exit 1 when a critical check fails. Run this first when anything misbehaves.
