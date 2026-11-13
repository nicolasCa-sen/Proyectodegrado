# Recipe: film / offline rendering

Quads for subdivision, maximum quality, DCC handoff. The preset runs on P2, which has no `geometry_quality`; this recipe selects H3.1 explicitly and passes `geometry_quality=detailed` for maximum geometry detail.

```bash
tripo make "an antique brass telescope" --for film --model H3.1 -p geometry_quality=detailed --json --yes
# → v3.1, quad=true (FBX out), geometry+texture detailed (PBR only with -p pbr=true)
```

USD pipeline handoff:

```bash
tripo make @last --then convert:format=USDZ,texture_format=PNG --json --yes
```

HDR textures for compositing:

```bash
tripo make @last --then "convert:format=OBJ,texture_format=OPEN_EXR,texture_size=4096" --json --yes
```

Notes: quad topology cannot live in GLB — deliverables are FBX/OBJ/USD; `geometry_quality=detailed` adds 20 credits; non-default convert options bill as complex convert.
