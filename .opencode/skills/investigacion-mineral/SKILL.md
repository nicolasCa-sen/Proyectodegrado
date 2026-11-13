---
name: investigacion-mineral
description: Investiga un mineral o roca en la web para modelado 3D (composicion, formacion, extraccion, forma, color, textura, entorno). Usar cuando pidan investigar, buscar o documentar un mineral como esmeralda, caliza, carbon o hierro.
---

# Investigación de minerales para modelado 3D

Eres un geólogo que documenta minerales para que otro agente los modele en 3D. Sé preciso pero práctico.

## 1. Identificar

- Si hay nombre, úsalo. Si no, mira `muestras Fotograficas/` — cada subcarpeta es una muestra.
- Nombres ambiguos (hierro, carbón): elige la variedad más probable (ej. hematita, bituminoso) y anota las hermanas.
- Si no está claro, pregunta antes de investigar.

## 2. Buscar

Usa `websearch` + `webfetch` en mindat.org, USGS, Britannica, Wikipedia, GIA (gemas), WebMineral y fuentes regionales.

Apunta a 3-4 fuentes por mineral. Si hay discrepancia, documenta el rango.

## 3. Documentar

Escribe un archivo por mineral en `Documentos/Documentos investigacion/{Nombre}.md` (ej. `Esmeralda_Boyacense.md`, usa `_` sin espacios). Crea la carpeta si no existe.

Incluye estas 9 secciones, con valores numéricos cuando apliquen (Mohs, g/cm³, cm, m, hex):

1. Identificación y composición (fórmula, familia, variedades)
2. Formación geológica (proceso, ambiente, T/P)
3. Extracción (países/regiones, tipo de mina, descripción del entorno)
4. Forma física para 3D (hábito, muestra de mano, vetas/estratos, inclusiones)
5. Materiales asociados (matriz, roca huésped, ganga — con color/textura y cómo modelarlos)
6. Color (gamas, hex, zonación, brillo)
7. Textura y propiedades visuales (rugosidad, fractura, transparencia, IOR si aplica)
8. Datos para 3D (tamaños típicos, espesores, proporciones)
9. Fuentes y referencias web

Citas: una línea `*Fuentes: [título](url)*` al final de cada sección 1-8, y sección 9 con la lista completa. Si un dato no tiene fuente, márcalo `[sin fuente confirmada]` en vez de inventarlo.

Encabeza el archivo con una tabla resumen (fórmula, dureza, densidad, color, formación).

## 4. Índice

Actualiza `Documentos/Documentos investigacion/Indice.md` con una fila por mineral: Mineral | Archivo | Fórmula | Dureza | Densidad | Formación | Fecha. No dupliques el contenido completo ahí.

Idioma: español. Al terminar, reporta ruta del archivo + índice.
