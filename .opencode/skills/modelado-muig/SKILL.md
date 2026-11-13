---
name: modelado-muig
description: Modela en Blender (via MCP Blender) minerales, muestras y escenarios geologicos para el museo VR MUIG en Meta Quest. Usar cuando pidan modelar, crear o construir en 3D una muestra, cantera, mina o prop del proyecto.
---

# Modelado 3D MUIG

Modelas en Blender vía MCP (`tools.blender.*` con `execute_blender_code`, `get_scene_info`, `import_asset`, `generate_3d`) para VR standalone en Meta Quest.

## 1. Contexto (lee antes de modelar)

1. `Documentos/Especificaciones_Proyecto_MUIG.md` — 72 FPS, escala real, 2 escenarios máx.
2. `Documentos/Documentos investigacion/<Mineral>.md` — §4 forma, §5 asociados, §6 color hex, §7 propiedades (transparencia/IOR/roughness), §8 dimensiones. Si no existe, sugiere `/investigar-mineral` primero y no inventes valores.
3. `muestras Fotograficas/<Mineral>/` — lista con `glob`/`ls` y revisa las fotos. La frontal sirve de referencia de textura; top/lateral ayudan con la silueta.

Anota los valores clave (ej. esmeralda: IOR 1.58, Transmission 0.9, #009B6B translúcida).

## 2. Límites VR

- Escala: 1 unidad Blender = 1 metro. Muestra de mano 0.05–0.2 m.
- Muestras protagonista <10k tris (ideal 5–8k), secundarios 3–5k. Escenarios <100k tris total.
- Material `Principled BSDF`, texturas 1024px (2048 solo protagonista). Sin subdivisión en runtime ni nodos costosos.
- Nomenclatura `MUIG_Muestra_*`, `MUIG_Escenario_*`, `MUIG_Prop_*`. Colecciones `MUIG_Muestras`, `MUIG_Escenarios`, `MUIG_Props`, `MUIG_Luces`.

## 3. Cómo modelar

- Confirma con el usuario qué modelar, dimensiones aproximadas y foto de referencia antes de empezar.
- Consulta la escena con `get_scene_info` antes de crear.
- Prefiere formas trazadas desde la foto (silueta real) sobre primitivas perfectas. Para sets multivista (≥5 fotos) puedes probar `generate_3d` como base y luego limpiar/retopo; si no, modela manual + esculpido.
- Textura: proyecta la mejor foto frontal (`Project from View`, bake Diffuse 1K) mezclada con el hex del MD (~85/15). Deriva roughness de la foto cuando ayude. Evita un único color plano si tienes foto útil. Si no hay foto, dilo y usa procedural basado en §6–§7.
- Cristalinos (§7 dice transparente/translúcido): usa Transmission + IOR del MD. Opacos/metal: Metalness/Roughness según MD.
- Detalles finos (bandas, estrías de sierra, vetas): geometría o normal map según presupuesto de tris.

## 4. Verificar

Antes de entregar: screenshot en modo MATERIAL/RENDERED desde un ángulo similar a la foto y compara silueta, proporciones, color y brillo. Itera lo necesario sin sacrificar parecido por cumplir tris.

## 5. Guardar (obligatorio)

Todo modelo queda en `modelo3d/<Nombre_Elemento>/` (ej. `modelo3d/Muestra_Caliza/`):

- `MUIG_*.blend` vía `bpy.ops.wm.save_as_mainfile`
- `MUIG_*.glb` vía `bpy.ops.export_scene.gltf(..., export_format='GLB', export_apply=True)`

```python
import bpy, os
project_root = os.getcwd()  # raíz del proyecto Proyectodegrado
nombre = "MUIG_Muestra_Caliza"
carpeta = "Muestra_Caliza"
export_dir = os.path.join(project_root, "modelo3d", carpeta)
os.makedirs(export_dir, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(export_dir, f"{nombre}.blend"))
bpy.ops.export_scene.gltf(filepath=os.path.join(export_dir, f"{nombre}.glb"), export_format='GLB', export_apply=True)
```

Verifica con `ls`/`glob` y reporta rutas, tamaños y tris. Sin archivos en disco no está entregado.

## 6. Escenarios típicos

Priorizan explicación geológica sobre maquinaria: cantera caliza en bancos, galería esmeralda (Muzo/Chivor) con veta, manto carbón entre lutitas, BIF hierro bandeado. Terreno a escala, horizonte discreto, 3 luces o HDRI 1k.
