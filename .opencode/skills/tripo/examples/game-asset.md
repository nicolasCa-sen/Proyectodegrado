# Recipe: game assets

## Mobile / low-poly (P2, clean topology, FBX)

```bash
tripo make "a stylized barbarian axe" --for game-mobile --json --yes
# → P2, face_limit 15000, 2K textures, convert to FBX
```

Tighter budget and Unity delivery:

```bash
tripo make "a health potion bottle" --for game-mobile \
  -p face_limit=3000 --then convert:format=FBX,texture_size=1024 --json --yes
```

## PC / console (P2, detailed textures)

```bash
tripo make "an ornate treasure chest, fantasy style" --for game-pc --json --yes
```

P2 gives editable topology; with detailed textures the generation step costs 120 credits. For a hero asset where geometric fidelity matters more, add `--model tripo-v3.1` (detailed textures: 30 credits from text, 40 from an image). PBR stays off unless the user asks for it; then add `-p pbr=true`.

## LODs baked from one dense source (explicit H3.1)

```bash
tripo make "a dense high-poly stone golem source mesh" --model tripo-v3.1 --name dense-golem --json --yes
tripo make @dense-golem --then decimate:5000,convert:fbx --json --yes        # bakes textures onto the low-poly by default
tripo make @dense-golem --then decimate:1500,convert:fbx --json --yes        # another LOD from the same source
```

## Separate editable parts (explicit H3.1)

```bash
tripo make "a modular sci-fi crate with a separate lid and handles" \
  --model tripo-v3.1 -p generate_parts=true --json --yes
# → H3.1; parts disable texture/pbr, so re-texture later with `tripo model texture`
```

## Character with animations (see also examples/animation.md)

```bash
tripo make "a knight in full armor, T-pose, standing straight" --for anim --json --yes
# chain: rig-check → rig → retarget(idle+walk)
# rig-check's body type picks the rig model: v3.0 for this biped knight; a quadruped gets v2.5 (and its own walk preset)
```
