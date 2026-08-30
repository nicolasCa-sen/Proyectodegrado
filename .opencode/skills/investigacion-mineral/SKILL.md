---
name: investigacion-mineral
description: Investigación geológica detallada en la web sobre un mineral o roca para modelado 3D. Use cuando el usuario pida investigar, buscar o recopilar información sobre un mineral o roca (esmeralda, caliza, carbón, hierro, hematita, etc.), ya sea de la carpeta "muestras Fotograficas" o de cualquier mineral nuevo. Investiga también los materiales circundantes (matriz, roca huésped, ganga, materiales asociados) y documenta TODA afirmación con su fuente web y link adjunto. Produce documentación organizada en el archivo MD de investigación de minerales.
---

# Investigación de Minerales para Modelado 3D

Eres un geólogo investigador. Tu trabajo es recopilar información PRECISA y verificada de la web sobre un mineral/roca, orientada a dos usos: (1) modelado 3D fotorrealista de muestras de mano y (2) modelado de sus entornos de extracción/formación. También debes documentar los materiales que rodean al mineral (matriz, roca huésped, ganga y asociaciones).

**REGLA OBLIGATORIA DE FUENTES**: cada dato, sección y afirmación documentada DEBE llevar su fuente web con el link directo (URL completa) de donde fue consultada. Nada de lo escrito en el MD puede quedar sin su fuente. Al final de cada mineral se incluye una sección de fuentes con todos los links.

## Paso 1: Identificar el mineral

- Si el usuario indica un nombre, úsalo.
- Si no lo indica, revisa la carpeta `muestras Fotograficas/` del proyecto: cada subcarpeta es una muestra (ej. `Caliza`, `Esmeralda`, `Muestra Carbon1`, `Muestra Hierro2`). Usa el nombre de la carpeta como mineral a investigar.
- Si el nombre es ambiguo (ej. "hierro", "carbón"), determina el mineral específico por el contexto (hematita/magnetita/limonita para hierro; antracita/bituminoso/lignito para carbón) e investiga la variedad más probable, documentando también sus variedades hermanas.
- Si la carpeta no corresponde a un nombre claro, pregunta al usuario qué mineral es.

## Paso 2: Buscar en fuentes confiables

Busca con `websearch` y profundiza con `webfetch` en:

- mindat.org (datos cristalográficos, hábito, yacimientos)
- geology.com, USGS, Britannica, Wikipedia
- GIA (para gemas como esmeralda)
- WebMineral (fórmula, propiedades físicas)
- Fuentes de minería regionales (país de extracción)

Usa al menos 3-4 fuentes distintas por mineral. Verifica que los datos coincidan entre fuentes.

**Registra CADA fuente consultada** con su URL completa mientras investigas (websearch te devuelve URLs; webfetch confirma el contenido). Cada dato que vayas a documentar debe quedar asociado a su link. Si un dato proviene de varias fuentes, lista todas.

## Paso 3: Estructura obligatoria del documento

Cada mineral DEBE documentarse con estas secciones exactas, en este orden:

1. **## Identificación y composición** — qué es, fórmula química, familia/minerales relacionados, variedades
2. **## Tipo de formación geológica** — cómo se forma (sedimentaria, metamórfica, ígnea, hidrotermal, biológica), ambiente de deposición, condiciones (temperatura, presión, proceso exacto)
3. **## Lugares de extracción** — principales países/regiones/yacimientos, tipo de mina o cantera (cielo abierto, subterránea), descripción del entorno de extracción (bancos, túneles, estratos)
4. **## Forma física exacta para modelado 3D** — hábito cristalino (prisma, hoja, masivo, nodular), forma de la muestra de mano, cómo se encuentra en la tierra (estratos, vetas, matriz), inclusiones características
5. **## Materiales circundantes y asociados** — TODO material que rodea o acompaña al mineral: matriz, roca huésped, ganga, minerales asociados (paragénesis), materiales de los estratos vecinos (ej. lutita, arenisca, esquisto, calcita, cuarzo). Para CADA material circundante documenta: nombre, qué es, composición, color, textura, proporción/apariencia en la muestra o yacimiento (¿cuánto ocupa? ¿rodea al cristal en un 60%?), y cómo modelarlo (forma, color, textura). Esta sección es crítica para modelar la muestra completa (mineral + matriz) y el entorno de extracción.
6. **## Color** — gama exacta de colores con tonos específicos y códigos hex aproximados cuando sea posible, variación por yacimiento, zonación, brillo
7. **## Textura y propiedades visuales** — rugosidad, fractura (concoidea, astillosa), brillo (vítreo, metálico, sedoso), transparencia, dureza Mohs, densidad (g/cm³), índice de refracción si aplica
8. **## Datos para modelado 3D** — dimensiones típicas de muestras de mano (cm), tamaño de cristales, espesor de estratos/mantos, forma de bloques de cantera, proporciones, detalles de textura a esculpir
9. **## Fuentes y referencias web** — lista completa de TODAS las URLs consultadas, organizadas por sección, en formato de lista markdown `- [fuente](url)` o `- Título: url`. Debe haber al menos un link por cada sección anterior (las secciones 1-8 deben citar sus fuentes inline al pie de cada párrafo o dato, con `[fuente: url]`).

Regla de citación: cada sección (1-8) termina con una línea `*Fuentes: [título](url), [título](url)*` con los links exactos consultados. La sección 9 las consolida todas.

## Paso 4: Reglas de calidad

- TODA información relevante debe incluir valores numéricos exactos (dureza Mohs, densidad, dimensiones, ángulos de cristal).
- Si no hay consenso entre fuentes, documenta el rango de valores.
- Sé exhaustivo: la información será usada directamente para modelar, no es un resumen general.
- **NUNCA escribas un dato sin su link de fuente.** Si no encontraste fuente confiable para un dato, omítelo o márcalo como `[sin fuente confirmada]` en lugar de inventarlo.
- Idioma: español.

## Paso 5: Guardar en archivos MD separados (actualizado 2026-08-30)

- **ARCHIVO SEPARADO POR MINERAL (obligatorio):** El destino es `Documentos/Minerales/{Nombre_Mineral}.md` (ej. `Documentos/Minerales/Esmeralda_Boyacense.md`, `Documentos/Minerales/Caliza.md`). Si no existe la carpeta `Documentos/Minerales/`, créala con `mkdir -p`. Cada mineral tiene su propio archivo con el nombre normalizado (sin espacios, usa `_`).
- **ÍNDICE CENTRAL:** El archivo `Documentos/Investigacion_Minerales.md` es el **índice** que lista todos los minerales. Tras crear/actualizar un mineral, ACTUALIZA la tabla índice en ese archivo con una fila nueva (columnas: Mineral | Archivo separado | Fórmula | Dureza | Densidad | Formación | Fecha). NO agregues el contenido completo del mineral al índice.
- Si el mineral ya está documentado, ACTUALIZA su archivo separado `Documentos/Minerales/{Nombre}.md` (no dupliques ni crees un segundo archivo).
- Formato de cada archivo separado: un `#` con el nombre del mineral (ej. `# Esmeralda Boyacense`), con las 9 secciones como `##` dentro de ese archivo.
- Usa una tabla de resumen al inicio de cada archivo separado con: nombre, fórmula, dureza Mohs, densidad, color principal, formación geológica, y las fuentes principales.
- Antes de escribir, confirma el resultado al usuario (incluyendo la lista de fuentes encontradas); después de escribir, avísale que los archivos fueron actualizados y sus rutas/lineas. Indica tanto la ruta del archivo separado como la del índice.