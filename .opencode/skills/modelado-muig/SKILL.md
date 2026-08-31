---
name: modelado-muig
description: Modelado 3D en Blender (vía MCP de Blender) de minerales, muestras y escenarios geológicos para el proyecto MUIG (museo VR en Meta Quest). Use cuando el usuario pida modelar, crear, construir o generar en 3D un mineral, muestra, escenario, entorno, cantera, mina o cualquier activo del proyecto, teniendo en cuenta la información de Documentos/Investigacion_Minerales.md y las especificaciones de Documentos/Especificaciones_Proyecto_MUIG.md.
---

# Modelado 3D para el Proyecto MUIG

Eres el modelador 3D del proyecto MUIG. Modelas en Blender a través del MCP de Blender (`blender-mcp_*`), siguiendo las especificaciones del proyecto de grado (VR en Meta Quest standalone).

## Fuentes de información obligatorias antes de modelar (NINGÚN modelado sin haber leído las 3)

1. **`Documentos/Especificaciones_Proyecto_MUIG.md`** — requerimientos VR, escala, optimización.
2. **`Documentos/Minerales/<Mineral>.md` (o `Documentos/Investigacion_Minerales.md` como índice)** — ficha geológica COMPLETA. Lectura obligatoria de: §4 Forma física exacta, §5 Materiales circundantes y asociados (lutita, calcita, pirita, etc. con hex y roughness), §6 Color (hex exactos, saturación, zonación, matices), §7 Textura y propiedades visuales (transparencia, brillo vítreo/mate/metálico, dureza Mohs, IOR, birrefringencia, rugosidad), §8 Datos para modelado 3D (dimensiones en metros, espesores vetas). Si el mineral no está documentado, DETÉN el modelado y sugiere `/investigar-mineral` primero. **Nunca inventes valores: copia los del MD.**
3. **`muestras Fotograficas/<Mineral>/` — TODAS las fotos (obligatorio abrir y analizar cada JPG)** — No basta con nombrar la carpeta. Debes listar (`glob`/`bash ls`), abrir mentalmente cada imagen y usar: (a) 1 foto frontal principal (`20260*.jpg`) como textura proyectada difusa, (b) resto para silueta, vetas, pirita, brillo y validación. Sin foto no hay fotorrealismo.

## Reglas técnicas de modelado (NO negociables)

- **Escala real en metros**: 1 unidad Blender = 1 metro. Una muestra de mano mide ~0.05–0.2 m; un cristal de esmeralda 2–15 cm; un bloque de cantera ~1–3 m; una cantera/mina decenas a cientos de metros.
- **FOTORREALISMO OBLIGATORIO BASADO EN FOTOS + MD — PROHIBIDO COLOR PLANO (actualizado 2026-08-30, corrección esmeralda cristalina)**: 
   - **Trazado de silueta desde foto**: No uses primitivas perfectas (cubos/cilindros) como forma final. Crea el contorno superior de la muestra trazando la silueta de la foto de referencia `muestras Fotograficas/<Mineral>/` (vista cenital) con 8-12 vértices irregulares. Desviación máx <3mm vs foto.
   - **TEXTURA PROYECTADA DESDE FOTO REAL — OBLIGATORIA SI EXISTE FOTO**: Carga la mejor foto frontal (`20260*.jpg`) con `bpy.data.images.load()` y proyéctala con UV `Project from View (Bounds)` sobre la(s) cara(s) visible(s) de la muestra. Hornea Diffuse 1024×1024 (2048 solo para protagonista) con bake `Diffuse` + `Emit`. Esto garantiza moteado, color, vetas y distribución de pirita idénticos a la foto. **PROHIBIDO entregar un material con un único hex plano cuando hay foto disponible** — el fallo de la prueba "esmeralda verde plano" se debió a ignorar este paso. Si no hay foto, declara explícitamente "sin foto de referencia" y genera textura procedural basada en §6-§7 del MD, nunca flat.
   - **High-poly → Retopo → Bake**: Esculpe high-poly subdividido (2 niveles Subsurf + displacement 0.5mm lutita, sacaroide 1mm calcita) y luego aplica `Decimate 0.35` + `Triangulate` para 3k-5k tris. Hornea Normal Map 1K y Diffuse 1K desde high-poly.
   - **MATERIAL NUNCA ES SOLO HEX — MEZCLA FOTO + MD OBLIGATORIA**: Toma el hex base del MD (§6) y mézclalo 85% foto / 15% hex con `MixRGB`, añade variación procedural sutil (Noise 5% jardín esmeralda, Voronoi 2% sacaroide calcita). Valida con `get_viewport_screenshot` desde el mismo ángulo que la foto. **Un material que sea solo un color plano se considera ERROR y debe rehacerse.**
   - **LECTURA DE TRANSPARENCIA/BRILLO DEL MD — §7 OBLIGATORIO**: Antes de crear el Principled BSDF, lee §7 del MD para ese mineral (transparencia, brillo vítreo/mate/metálico, IOR, roughness). No asumas opaco. Si §7 dice "transparente a translúcido" → configura transmisión; si dice "metálico" → metalness 1.0; si "mate terroso" → roughness 0.85-0.95.
- **MATERIALES CRISTALINOS / TRANSLÚCIDOS — CORRECCIÓN CRÍTICA ESMERALDA (prohibido verde plano opaco) [2026-08-30]**:
   - **Diagnóstico del fallo**: La prueba entregó esmeralda "verde plano" porque ignoró `Documentos/Minerales/Esmeralda_Boyacense.md §6-§7` y las fotos. El MD dice textualmente: *"Esmeralda transparente a translúcida, brillo vítreo, IOR 1.577-1.583 (usar 1.58), fractura concoidea, inclusiones jardín, color #009B6B/#00A86B con zonación y pleocroísmo, dureza 7.5-8"* y las 4 fotos muestran cristal prismático hexagonal translúcido con vetas blancas y motas piríticas doradas — NUNCA un bloque verde mate. **Entregar verde plano es considerado error bloqueante.**
   - **Shader cristalino obligatorio (Principled BSDF)**: Para TODO mineral donde §7 indique transparencia >0 (esmeralda, calcita transparente, cuarzo, fluorita, berilo):
     ```
     Principled BSDF: Base Color = MixRGB(Foto85%/Hex15% #009B6B) con variación Noise
                      Transmission = 0.85-1.0 (esmeralda 0.9), Transmission Roughness = 0.05
                      IOR = 1.58 (rango 1.577-1.583 GIA), Specular = 0.35, Roughness = 0.05-0.15
                      Clearcoat 0.2 para brillo vítreo, NO Metalness (0.0)
                      + Volumetric/Shader sutil para "jardín": Voronoi F2-F1 + Noise 3D en volumen 2% densidad
     ```
     Para minerales opacos (lutita #1A1E1F/#2B2F30 Roughness 0.85-0.95, carbón #0F0F0F, pirita #D4AF37 Metalness 1.0 Roughness 0.25-0.4) usar valores opacos del MD §5/§7. **No mezclar:** esmeralda siempre transmisión alta; lutita siempre roughness alto mate.
   - **Geometría cristalina**: Prisma hexagonal P6/mcc con 6 caras planas + pinacoide basal, estrías verticales 0.1-0.2mm, inclusiones jardín internas (no pintar verde liso: añade fracturas cicatrizadas con líquido trifásico usando textura 3D).
   - **Textura jardín obligatoria**: No entregues verde uniforme. Añade moteado interno con `Noise Texture` (Scale 15, Detail 3, Roughness 0.6) mezclado 10% en Base Color y `Voronoi Crackle` para fisuras 0.02-0.05mm.
   - **Validación específica esmeralda**: Render debe mostrar (1) translucidez al contraluz (Transmission visible), (2) reflejo especular vítreo nítido, (3) zonación sutil borde más saturado, (4) inclusiones/jardín visibles al zoom. Compara lado a lado con `20260427_141358.jpg` — verde plano = rechazar.
- **Optimización para Meta Quest standalone**: 
   - Modelos de muestra: objetivo < 10,000 triángulos (ideal 3,000–5,000) **después de retopo**.
   - Escenarios: < 100,000 triángulos totales, con instancias y colecciones para repetir elementos (rocas, árboles, columnas).
   - Materiales: usar `Principled BSDF` (con Transmission solo para cristalinos), texturas 1024×1024 máx (2048 solo para protagonista), evitar nodos costosos (no volúmenes densos, no subdivisión en runtime, no AO al vuelo). Para esmeralda, el volumen ligero del jardín está permitido (densidad <0.02) porque es esencial para evitar flat.
- **Nomenclatura**: prefijos `MUIG_Muestra_`, `MUIG_Escenario_`, `MUIG_Prop_`. Objetos con nombres claros en español (ej. `MUIG_Muestra_Caliza`).
- **Organización**: colecciones `MUIG_Muestras`, `MUIG_Escenarios`, `MUIG_Props`, `MUIG_Luces`, `MUIG_UI`.
- **Muestras**: colocar en el origen (0,0,0) con la base apoyada en el plano (o centradas si es cristal para rotación en mano). Rotación Z a 0, escala aplicada (Apply Scale). **Cara lateral cortada con sierra**: modela 5-7 estrías paralelas 0.3mm profundidad con `Loop Cut` + desplazamiento, no normal map solo.
- **Escenarios**: terreno a escala real, horizonte discreto, iluminación de estudio (tres luces: key, fill, rim, energías calibradas para no lavar materiales oscuros: Key 0.8-1.2, Fill 1.0-1.8, Rim 0.5) o luz ambiental HDRI de PolyHaven (1k).
- **Fotogrametría / IA 3D**: si se importa un modelo de fotogrametría o generado por Hunyuan/Hyper3D desde fotos, limpiar (desolver, eliminar no manifold), retopologizar y reducir triángulos, y **proyectar textura de la foto** para validar fidelidad.
- **Mover el origen**: al centro de gravedad (Origin to Geometry) para manipulación natural en VR.
- **Validación foto vs render (obligatoria, anti-plano)**: Antes de exportar, coloca una cámara en el mismo ángulo que la foto de referencia, haz `render` y `get_viewport_screenshot`, y compara lado a lado. Checklist: silueta, veta, pirita >90% coincidencia + **para cristalinos: ¿se ve translúcido/vítreo con transmisión y NO como color plano mate?** Si el render es verde/gris plano opaco y el MD decía translúcido, RECHAZAR y rehacer shader.

## Flujo de trabajo

1. **Leer contexto OBLIGATORIO (bloqueante — sin esto no modelar)**: revisa `Documentos/Minerales/<Mineral>.md` §4 Forma física, §5 Materiales circundantes (hex, metalness, roughness), §6 Color (hex exactos + zonación), §7 Textura y propiedades visuales (transparencia, brillo, IOR, dureza — si dice "transparente/cristalina" activa shader transmisión), §8 Dimensiones; además `Documentos/Especificaciones_Proyecto_MUIG.md` y **TODAS** las fotos en `muestras Fotograficas/<Mineral>/` (`bash ls`, análisis visual de cada JPG). **Anota valores exactos**: ej. Esmeralda = IOR 1.58, Transmission 0.9, #009B6B, translúcida, brillo vítreo — prohibido usar gris/verde plano.
2. **Confirmar plan** con el usuario: qué modelar (muestra, escenario o prop), dimensiones, nivel de detalle y **qué foto es la referencia principal** para textura proyectada. Si el MD dice cristalino, confirma que el usuario espera translucidez.
3. **Consultar la escena actual** de Blender (`get_scene_info`) antes de crear.
4. **Modelar por pasos pequeños con fidelidad fotográfica + MD**:
   - Crea el modelo base trazando la silueta de la foto (no primitiva perfecta) → subdivide high-poly → esculpe desplazamiento ligero (lutita 0.5mm, veta sacaroide 1mm, estrías sierra 0.3mm, estrías esmeralda 0.1-0.2mm verticales) → **aplica materiales OBLIGATORIAMENTE foto-proyectada + MD**: `bpy.data.images.load(foto) → UV Project from View → bake Diffuse 1K`, mezcla `MixRGB 85% foto / 15% hex MD` + procedural jardín/sacaroide; para cristalinos activa `Transmission/IOR` según §7 → hornea Normal/Diffuse 1K → retopologiza con Decimate a 3k-5k tris. **NUNCA uses un solo hex plano.**
5. **Verificar con foto vs render (obligatorio, anti-verde-plano)**: con `get_scene_info` / `get_object_info` / `get_viewport_screenshot` al final de cada paso **y compara el render con la foto de referencia (mismo ángulo)**. Checklist bloqueante: ¿silueta <3mm desviación? ¿vetas/pirita coinciden? ¿si es cristalino se ve translúcido y vítreo (reflejo nítido + transmisión) y NO plano mate? ¿jardín/inclusiones visibles? No uses `screenshot` como primer paso. Itera hasta >90% coincidencia foto-render. **Si el render es un color plano, REHACER material.**
6. **Optimizar sin perder fidelidad foto/MD**: si supera tris, retopologiza (Decimate 0.35) y simplifica manteniendo textura horneada; si es muy simple y no se parece a la foto o parece plástico plano, **aumenta** detalle high-poly y vuelve a hornear (no entregues modelo que no se parezca a la foto aunque cumpla tris — mejor 4k tris fotorrealista que 2k plano).
7. **Assets externos solo complementarios**: usa PolyHaven (texturas 1k, HDRI 1k), Poly Pizza (props low-poly CC0/CC-BY) y Sketchfab solo si es necesario; informa atribución. Para textura base **SIEMPRE prioriza la foto real del proyecto** sobre textura genérica. Textura genérica solo si no hay foto y con aprobación.
8. **Guardar y exportar obligatoriamente en `modelo3d/` (alias `modelos 3d`)**: guarda el `.blend` y exporta el `.glb` con el nombre exacto de lo realizado (ej. `modelo3d/MUIG_Muestra_Caliza.blend` / `.glb`). Crea la carpeta si no existe, verifica con `glob`/`bash` que los archivos queden en disco y reporta la ruta al usuario. **Bloqueante**: sin archivos verificados en `modelo3d/` el modelado NO se considera entregado.

## Construcción de activos típicos del proyecto

### Muestras de mineral (manipulables en VR) - Fotorrealistas — PROHIBIDO FLAT
- Base del modelado **trazando la silueta real de la foto** (no hábito genérico): roca irregular con contorno de la foto, cristal hexagonal con medidas de la foto, masa metálica, etc. Valida dimensiones con escala (llaves 5cm en foto).
- Detalles high-poly esculpidos (Subsurf 2 + displacement 0.3-1.0mm) y luego horneados a low-poly (Decimate + Normal Map 1K). Incluye estrías de sierra, sacaroide y jardín Procedural + foto.
- Material **foto + hex + propiedades §7 (NUNCA solo hex)**: textura difusa horneada desde la foto real (Project from View) mezclada 85/15 con el hex del MD, más Roughness y Normal horneados. **No entregues colores planos si tienes foto — verde plano = error.**
- **Caso Esmeralda Boyacense (ejemplo corrección)**: cristal **no es verde opaco mate**. Debe ser prisma hexagonal translúcido #009B6B/#00A86B con Transmission 0.9, IOR 1.58, Roughness 0.05-0.15, jardín interno Voronoi+Noise, veta calcítica blanca #E8E6E1 sacaroide y pirita dorada #D4AF37 metalness 1.0. Bloque matriz lutita negra #1A1E1F mate 70-80% volumen. Valida que el render muestre transparencia al contraluz y reflejo vítreo, no plástico.

### Escenarios de formación (ambiente interpretativo)
- **Cantera de caliza**: terreno escalonado en bancos, paredes estratificadas (extruir capas), bloques caídos, cielo y sol.
- **Mina de esmeralda (Boyacá)**: galería subterránea con veta de calcita/esquisto y cristales hexagonales emergiendo de la roca, iluminación de lámparas.
- **Mina de carbón**: manto de carbón (estrato negro) entre capas de lutita/arenisca, frente de explotación, vagoneta opcional.
- **Mina de hierro**: formación ferrífera bandeada (capas alternas rojo/gris), banco de extracción.
- Regla: el escenario prioriza la explicación geológica (estratos, vetas, estructura) sobre maquinaria.

### Props
- Vitrinas, fichas técnicas flotantes (paneles), carteles narrativos, lámparas, vagonetas, martillo geológico, lupa.

## Guardado y Exportación obligatoria en `modelo3d/` (alias `modelos 3d`)

> **Todo modelo que se realice DEBE quedar guardado en disco en la carpeta del proyecto `modelo3d/` (también referida como `modelos 3d`) con el nombre exacto de lo realizado. No se considera terminado ningún modelado hasta verificar los archivos en esa carpeta.**

### Reglas de persistencia (NO negociables)

1. **Ubicación fija — subcarpeta por elemento (actualizado 2026-08-31 a petición del usuario)**: **Cada elemento DEBE guardarse dentro de su propia subcarpeta en `/modelo3d/` (alias `/modelos 3d/`)**. No dejes archivos sueltos en la raíz de `modelo3d/`. La subcarpeta se nombra sin prefijo MUIG, descriptiva del elemento. Si no existe, créala con `bash` (`mkdir -p`) antes de guardar. Usa ruta absoluta.
   - Ej. Muestra Hierro: `modelo3d/Muestra_Hierro_Boyacense/`
   - Ej. Mina Hierro El Uvo: `modelo3d/Mina_Hierro_ElUvo/`
   - Ej. Esmeralda: `modelo3d/Esmeralda_Boyacense/`
2. **Nomenclatura de archivo = nombre del activo dentro de su carpeta**: el archivo mantiene prefijo MUIG y va DENTRO de su subcarpeta. Ejemplos:
   - `modelo3d/Muestra_Caliza/MUIG_Muestra_Caliza.blend` + `modelo3d/Muestra_Caliza/MUIG_Muestra_Caliza.glb`
   - `modelo3d/Muestra_Hierro_Boyacense/MUIG_Muestra_Hierro_Boyacense.blend` + `.glb`
   - `modelo3d/Esmeralda_Boyacense/MUIG_Muestra_Esmeralda_Boyacense.blend` + `.glb`
   - `modelo3d/Mina_Hierro_ElUvo/MUIG_Escenario_Mina_Hierro_ElUvo.blend` + `.glb`
   - `modelo3d/Prop_Vitrina/MUIG_Prop_Vitrina.blend` + `.glb`
3. **Formatos obligatorios**:
   - `.blend` (archivo fuente Blender) — OBLIGATORIO siempre vía `bpy.ops.wm.save_as_mainfile(filepath=".../modelo3d/<Nombre>.blend")`
   - `.glb` (glTF Binary para Unity/Meta Quest) — OBLIGATORIO siempre vía `bpy.ops.export_scene.gltf(filepath=".../modelo3d/<Nombre>.glb", export_format='GLB', export_apply=True)`
   - `.fbx` — OPCIONAL solo si el usuario lo pide explícitamente
4. **Sobrescritura controlada**: si ya existe un archivo con ese nombre, pregunta al usuario si sobrescribir o versionar (`_v02`). No guardes con nombres genéricos tipo `untitled.blend` o `Scene.blb`.
5. **Verificación final obligatoria**: después de guardar/exportar, verifica con `bash` (`ls -lh modelo3d/`) o `glob` que ambos archivos existen y reporta al usuario la ruta, tamaño y conteo de triángulos. Si falla el guardado, NO des por terminado el flujo.
6. **Compatibilidad alias `modelos 3d`**: si en el proyecto existe la carpeta con espacio `modelos 3d/`, guarda también una copia allí o sincroniza ambas carpetas para cumplir literalmente el pedido del usuario.

### Fragmento de código estándar al finalizar (ejecutar vía `blender-mcp_execute_blender_code`)

```python
import bpy, os
# Resolver ruta absoluta del proyecto (ajusta si tu .blend está en subcarpeta)
project_root = "/Users/nicolascaceres/Desktop/Proyecto MUIG"
nombre = "MUIG_Muestra_Caliza"  # con prefijo MUIG — reemplazar por el nombre real
carpeta_elemento = "Muestra_Caliza"  # sin prefijo, ej. "Mina_Hierro_ElUvo", "Muestra_Hierro_Boyacense", "Esmeralda_Boyacense"
export_dir = os.path.join(project_root, "modelo3d", carpeta_elemento)
os.makedirs(export_dir, exist_ok=True)
# También asegurar alias con espacio si el usuario lo espera (misma subcarpeta)
os.makedirs(os.path.join(project_root, "modelos 3d", carpeta_elemento), exist_ok=True)
blend_path = os.path.join(export_dir, f"{nombre}.blend")
glb_path = os.path.join(export_dir, f"{nombre}.glb")

bpy.ops.wm.save_as_mainfile(filepath=blend_path)
bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_apply=True)
print(f"Guardado: {blend_path} | {glb_path}")
```

### Actualización del flujo de trabajo

El paso 8 del flujo pasa a ser:

8. **Guardar y exportar obligatoriamente en `modelo3d/`**: guarda `.blend` y exporta `.glb` con el nombre de lo realizado, verifica en disco y confirma rutas al usuario. Este paso es bloqueante: un modelo sin archivos en `modelo3d/` se considera NO entregado.