# Especificaciones del Proyecto — MUIG (Museo Universitario de Ingeniería Geológica UPTC)

Resumen técnico extraído de `Documentos/Propuesta proyecto de Grado.docx` para uso de los agentes de modelado 3D e investigación.

## Contexto del proyecto

- **Título**: Desarrollo de una experiencia de realidad virtual para la comprensión del origen geológico y la procedencia de muestras seleccionadas de la colección del MUIG.
- **Grupo**: INFELCOM (UPTC). Proyecto SGI 3825: "Integración de Tecnología Inmersiva en la Conservación del Patrimonio Geológico".
- **Muestras seleccionadas**: caliza, hierro, carbón y esmeralda.
- **Plataforma**: Unity + Meta Quest 3/3S (hardware standalone, 6DoF).
- **Narrativa**: cada muestra se relaciona con su ambiente de formación y el territorio del que proviene (región de Boyacá, Colombia).

## Requerimientos técnicos de modelado 3D (críticos)

1. **Optimización para hardware standalone**: control estricto de polígonos (retopología), texturas eficientes, iluminación precalculada (light baking), framerate constante superior a **72 Hz/FPS** para prevenir cybersickness.
2. **Escala**: el mundo debe modelarse a escala real en metros (1 unidad Blender = 1 metro).
3. **Confort VR**: uso de pie o sentado, diseño de interacción confortable.
4. **Dos escenarios virtuales interpretativos** como máximo, definidos a partir de los procesos de formación y procedencia territorial de las muestras.
5. Los elementos extractivos (minas/canteras) son **contexto complementario**, no protagonistas: priorizar la explicación geológica.
6. **Ficha científica por muestra**: denominación, clasificación, ambiente de formación, procedencia geográfica, relevancia museográfica, nivel de representación en la experiencia.
7. **Pipeline de activos**: captura fotogramétrica → limpieza/retopología/reducción de triángulos en Blender → integración en Unity → optimización para Meta Quest.
8. **Interacciones previstas**: recorrido guiado, teleport, manipulación de objetos, puntos narrativos.

## Escenarios de formación por mineral (para entornos)

- **Caliza**: ambiente marino somero (arrecifes, plataformas carbonatadas), canteras con bancos/escalones. En Boyacá (ej. Nobsa, Belencito) hay canteras de caliza para cemento.
- **Hierro**: formaciones ferríferas bandeadas (BIF) sedimentarias, depósitos de hematita/limonita; en Colombia, yacimientos sedimentarios (ej. Pacho, Cundinamarca; depósitos de hierro en Boyacá).
- **Carbón**: cuencas sedimentarias con mantos de carbón entre lutitas/areniscas; Boyacá (ej. Sogamoso, Paz de Río, Paipa) es una cuenca carbonífera activa; minas subterráneas y cielo abierto.
- **Esmeralda**: yacimientos en esquistos negros/calcitas (minas de Muzo, Chivor, Coscuez en Boyacá, Colombia — el "Cinturón Esmeraldífero Oriental").

## Fases del proyecto relevantes para modelado

- **Fase 1**: ficha de caracterización de cada muestra (denominación, clasificación, ambiente de formación, procedencia, relevancia, nivel de representación).
- **Fase 2**: diseño de escenarios virtuales, storyboards, arquitectura de interacción.
- **Fase 3**: producción de activos — fotogrametría, limpieza de mallas, retopología y reducción de triángulos en **Blender**, creación/adecuación de **entornos virtuales representativos de los ambientes de formación geológica**, integración en Unity.
- **Fase 4**: pruebas de rendimiento (mínimo 72 FPS).

## Fuente de datos geológicos para modelar

- `Documentos/Investigacion_Minerales.md`: documentación geológica por mineral (formación, extracción, forma física, color, textura, datos numéricos) generada por el agente `investigador-mineral`. **Es la fuente primaria para decidir forma, materiales y escenarios de cada modelo.**
- Fotografías de referencia: carpeta `muestras Fotograficas/<Mineral>/`.