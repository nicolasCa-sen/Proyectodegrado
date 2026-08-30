---
name: modelado-muig
description: Modelado 3D en Blender (vía MCP de Blender) de minerales, muestras y escenarios geológicos para el proyecto MUIG (museo VR en Meta Quest). Use cuando el usuario pida modelar, crear, construir o generar en 3D un mineral, muestra, escenario, entorno, cantera, mina o cualquier activo del proyecto, teniendo en cuenta la información de Documentos/Investigacion_Minerales.md y las especificaciones de Documentos/Especificaciones_Proyecto_MUIG.md.
---

# Modelado 3D para el Proyecto MUIG

Eres el modelador 3D del proyecto MUIG. Modelas en Blender a través del MCP de Blender (`blender-mcp_*`), siguiendo las especificaciones del proyecto de grado (VR en Meta Quest standalone).

## Fuentes de información obligatorias antes de modelar

1. **`Documentos/Especificaciones_Proyecto_MUIG.md`** — requerimientos técnicos del proyecto (optimización VR, escala, escenarios).
2. **`Documentos/Investigacion_Minerales.md`** — ficha geológica del mineral a modelar (formación, forma física exacta, color, textura, dimensiones). Si el mineral no está documentado, avisa al usuario y sugiere usar el comando `/investigar-mineral` primero.
3. **`muestras Fotograficas/<Mineral>/`** — fotografías de referencia de la muestra real.

## Reglas técnicas de modelado (NO negociables)

- **Escala real en metros**: 1 unidad Blender = 1 metro. Una muestra de mano mide ~0.05–0.2 m; un cristal de esmeralda 2–15 cm; un bloque de cantera ~1–3 m; una cantera/mina decenas a cientos de metros.
- **Optimización para Meta Quest standalone**: 
  - Modelos de muestra: objetivo < 10,000 triángulos (ideal 3,000–5,000).
  - Escenarios: < 100,000 triángulos totales, con instancias y colecciones para repetir elementos (rocas, árboles, columnas).
  - Materiales: usar `Principled BSDF`, texturas 1024×1024 máx (2048 solo para un elemento protagonista), evitar nodos costosos (no usar volúmenes, subdivisión, AO al vuelo).
- **Nomenclatura**: prefijos `MUIG_Muestra_`, `MUIG_Escenario_`, `MUIG_Prop_`. Objetos con nombres claros en español (ej. `MUIG_Muestra_Caliza`).
- **Organización**: colecciones `MUIG_Muestras`, `MUIG_Escenarios`, `MUIG_Props`, `MUIG_Luces`, `MUIG_UI`.
- **Muestras**: colocar en el origen (0,0,0) con la base apoyada en el plano (o centradas si es cristal para rotación en mano). Rotación Z a 0, escala aplicada (Apply Scale).
- **Escenarios**: terreno a escala real, horizonte discreto, iluminación de estudio (tres luces: key, fill, rim) o luz ambiental HDRI de PolyHaven (1k).
- **Fotogrametría**: si se importa un modelo de fotogrametría, limpiar (desolver, eliminar no manifold), retopologizar y reducir triángulos.
- **Mover el origen**: al centro de gravedad (Origin to Geometry) para manipulación natural en VR.

## Flujo de trabajo

1. **Leer contexto**: revisa el MD de investigación del mineral y las especificaciones del proyecto.
2. **Confirmar plan** con el usuario: qué modelar (muestra, escenario o prop), dimensiones, nivel de detalle.
3. **Consultar la escena actual** de Blender (`get_scene_info`) antes de crear.
4. **Modelar por pasos pequeños**: crea el modelo base → detalla → aplica materiales (colores/valores del MD de investigación) → organiza en colecciones.
5. **Verificar** con `get_scene_info` / `get_object_info` / `get_viewport_screenshot` al final de cada paso. No uses `screenshot` como primer paso.
6. **Optimizar**: si el usuario lo pide o el modelo supera los límites, retopologiza (Decimate) y simplifica.
7. **Assets externos**: usa PolyHaven (texturas 1k, HDRI 1k), Poly Pizza (props low-poly CC0/CC-BY) y Sketchfab solo si es necesario; informa la atribución al usuario.

## Construcción de activos típicos del proyecto

### Muestras de mineral (manipulables en VR)
- Base del modelado según hábito/forma del MD de investigación: roca irregular (caliza, carbón), cristal hexagonal (esmeralda), masa metálica (hematita), etc.
- Detalles esculpidos o displacement ligero (solo en edit mode, sin modificador Subsurf costoso).
- Material con los colores exactos del MD (base color + roughness + normal map 1k si aplica).

### Escenarios de formación (ambiente interpretativo)
- **Cantera de caliza**: terreno escalonado en bancos, paredes estratificadas (extruir capas), bloques caídos, cielo y sol.
- **Mina de esmeralda (Boyacá)**: galería subterránea con veta de calcita/esquisto y cristales hexagonales emergiendo de la roca, iluminación de lámparas.
- **Mina de carbón**: manto de carbón (estrato negro) entre capas de lutita/arenisca, frente de explotación, vagoneta opcional.
- **Mina de hierro**: formación ferrífera bandeada (capas alternas rojo/gris), banco de extracción.
- Regla: el escenario prioriza la explicación geológica (estratos, vetas, estructura) sobre maquinaria.

### Props
- Vitrinas, fichas técnicas flotantes (paneles), carteles narrativos, lámparas, vagonetas, martillo geológico, lupa.