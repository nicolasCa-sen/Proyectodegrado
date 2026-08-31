# Investigación de Minerales - Proyecto MUIG

> **Índice central** - Cada mineral investigado se documenta en un **archivo separado** en `Documentos/Minerales/{Nombre_Mineral}.md` con las 9 secciones completas del skill `investigacion-mineral`. Este archivo es solo el índice y no contiene el detalle completo.

**Estructura vigente desde 2026-08-30** (a petición del usuario: archivos separados por mineral para facilitar modelado 3D y control de versiones):
- `Documentos/Minerales/Esmeralda_Boyacense.md` → Esmeralda Boyacense (Boyacá, Colombia) - 294 líneas - 11 fuentes
- `Documentos/Minerales/Hierro_Boyacense.md` → Hierro Boyacense - Mena Oolítica Hematita-Goethita El Uvo/Paz del Río (Muestra Hierro1) - 387 líneas - 14 fuentes
- `Documentos/Minerales/Interior_Mina_Hierro_ElUvo.md` → Interior Mina Hierro El Uvo - Galería Subterránea Form. Concentración (2-12m, 30km vías, 700m, 7 niveles) - 296 líneas - 18 fuentes
- Futuros: `Documentos/Minerales/Caliza.md`, `Carbon_Antracita.md`, `Muestra_Hierro2.md`, etc. (nombre = carpeta en `muestras Fotograficas/` o nombre del mineral normalizado con `_`)

**Regla para el agente investigador:** Al investigar un nuevo mineral, **crear** `Documentos/Minerales/{Nombre}.md` con la estructura exacta de 9 secciones (ver skill) y **actualizar esta tabla índice** con una nueva fila. No agregar otro `# Mineral` dentro de este índice.

---

## Minerales Documentados

| # | Mineral | Archivo separado | Fórmula | Dureza Mohs | Densidad g/cm³ | Formación | Fecha | Estado |
|---|---------|----------------|---------|-------------|----------------|-----------|-------|--------|
| 1 | **Esmeralda Boyacense** | [`Minerales/Esmeralda_Boyacense.md`](Minerales/Esmeralda_Boyacense.md) | Be₃Al₂Si₆O₁₈ | 7.5-8.0 | 2.63-2.92 (2.72) | Hidrotermal-sedimentaria black shale | 2026-08-30 | ✅ Completo - 9 secciones |
| 2 | **Hierro Boyacense (Hematita Oolítica El Uvo)** | [`Minerales/Hierro_Boyacense.md`](Minerales/Hierro_Boyacense.md) | Fe₂O₃ (70% Fe) + FeO·OH | 5.0-6.5 (5-6) | 5.26 (bulk 3.2-4.0 con porosidad) | Sedimentaria oolítica Formación Concentración 1-8m, oolitos 0.5-2mm | 2026-08-31 | ✅ Completo - 9 secciones - Fotos Muestra Hierro1 (6) |
| 3 | **Interior Mina Hierro El Uvo (Paz del Río)** | [`Minerales/Interior_Mina_Hierro_ElUvo.md`](Minerales/Interior_Mina_Hierro_ElUvo.md) | Fe₂O₃ + FeO·OH + FeCO₃ (oolitos 0.5-2mm) | 5.0-6.5 (manto) / 2-3 (lodolita) | 5.26 (mena) / 2.3 (lodolita) | Sedimentaria Form. Concentración 2-12m, galería 3.0x3.5m, 30km vías 700m 7 niveles | 2026-08-31 | ✅ Completo - 9 secciones - 18 fuentes interior |

---

## Cómo investigar un nuevo mineral (resumen skill)

1. Identificar por nombre o carpeta `muestras Fotograficas/`
2. Buscar 3-4 fuentes (mindat.org, GIA, USGS, geology.com, WebMineral, ANM/SGC para Colombia) y registrar URLs
3. Documentar 9 secciones obligatorias con valores numéricos y cita al final de cada sección + sección 9 consolidada
4. **Crear archivo separado** `Documentos/Minerales/{Nombre}.md` (ej. `Caliza.md`) - NO añadir al índice como contenido, solo como fila
5. Actualizar este índice

Ver skill completo: `.opencode/skills/investigacion-mineral/SKILL.md`

---

## Fuentes generales del proyecto

- Skill investigación: `.opencode/skills/investigacion-mineral/SKILL.md`
- Especificaciones proyecto: `Documentos/Especificaciones_Proyecto_MUIG.md`
- Muestras fotográficas: `muestras Fotograficas/` (Caliza, Esmeralda, Muestra Carbon1/2, Muestra Hierro1/2)

> Última actualización: 2026-08-31 - Interior Mina Hierro El Uvo (Paz del Río) documentado con 18 fuentes (Boyacá7Días, El Tiempo, 95.6FM, GEM, UPTC 2-12m, Corpoboyacá, Cruz1972) + Hierro Boyacense (Muestra Hierro1) 14 fuentes - Total 3 minerales en índice.
