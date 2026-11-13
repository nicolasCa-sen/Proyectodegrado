# Recipe: character animation

## One shot (generate → rig → animate)

```bash
tripo make "a cartoon fox character, T-pose" --for anim --json --yes
# rig-check gates the chain: if not riggable it stops early (no credits wasted)
```

## Step by step with pipes

`--model tripo-p2` explicitly pins the P2 default (100–130 credits per generation). The same prompt without `--model` also uses P2; use `--model H3.1` to select H3.1 explicitly.

```bash
tripo make "a robot soldier, T-pose" --model tripo-p2 --json --yes \
  --then rig-check,rig:model=rig-v3.0,spec=mixamo,out_format=fbx \
  | tripo anim retarget --animation preset:idle preset:walk preset:run --json
```

## Animate an existing model file

```bash
tripo make hero.glb --then rig-check,rig,retarget:preset:walk --json --yes
```

The check selects the default rig model: v2.5 for quadruped, v3.0 otherwise. An
explicit rig model is preserved. Rigging step by step instead? Check first,
inspect the check task with `tripo task get`, then rig the saved original model
with the recommended `--rig-type`. Do not pass the check task or its updated
`@last` to rig.

## T-pose image first (better rigging on tricky subjects)

```bash
tripo generate text-to-image "full-body front view of a ninja" -p template=t_pose --json --yes
tripo generate image-to-model @last --json --yes                          # image task id works as input
tripo make @last --then rig-check,rig:model=rig-v3.0,retarget:preset:run --json --yes
```

Rules: retarget needs a rig task (≤5 animations, billed per animation); an unspecified rig model defaults to v2.5 for quadruped and v3.0 for other body types (avian / others have no preset animations); Mixamo → `--spec mixamo`, Unity Humanoid → `--spec unity`, Unreal → `--spec unreal`; in-game locomotion → `--animate-in-place`.
