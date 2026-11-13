# Recipe: 3D printing

Textures are wasted credits for printing — the print scenario generates bare geometry.

## FDM (single color, STL)

```bash
tripo make "a low-rise chess rook" --for print --json --yes
# → P2 bare geometry → convert STL + flatten_bottom
```

## Real-world size

```bash
tripo make "a phone stand" --for print \
  --then convert:format=STL,flatten_bottom=true,scale_factor=1.2 --json --yes
# or -p auto_size=true at generation for real-world meters
```

## Color print (OBJ with vertex colors)

```bash
tripo make figurine.png --for print -p texture=true \
  --then "convert:format=OBJ,export_vertex_colors=true" --json --yes
```

- The print preset skips textures (`texture=false`); a color print needs them back with `-p texture=true` (texture credits apply).
- The API's 3MF output is single color, and vertex colors are only exported to OBJ/GLTF.
- Build the multi-color 3MF in your slicer from the OBJ.

## Fix holes / make watertight first

```bash
tripo make broken.stl --then segment,complete,convert:stl --json --yes
```
