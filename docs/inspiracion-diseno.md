# Inspiración de diseño — Fertinagro Biotech

> **La referencia definida por el cliente para diseño y distribución del sitio es
> <https://www.fertinagro.es/>** (Fertinagro Biotech, Teruel, España — líder en abonos
> tecnológicos y sostenibles). Es inspiración, **no copia**: es una empresa mucho más grande
> (28 plantas, 90 países). Tomamos sus patrones de distribución y jerarquía visual, adaptados
> al volumen de contenido y al presupuesto de 20 MB de RECUPERAR.

## Patrones relevados de fertinagro.es → cómo los aplicamos

| Patrón en Fertinagro | Aplicación en RECUPERAR |
|---|---|
| **Mega-menú "Productos" con entradas por línea** (8 categorías con ícono, cada una a su landing de línea) | Menú "Productos" con nuestro set real: 5 líneas (Arrancadores, Bioestimulantes, Correctores, Jardinería, Mejoradores) + bloque **Cultivos** (Intensivos/Extensivos) — así queda cubierta la navegación dual |
| **Hero con banner rotativo de propuestas de valor**: cada slide = eje temático (rentabilidad, rendimiento, innovación, producción, asesoramiento) + CTA | Hero del Home con 3–4 ejes propios: 1ª fábrica argentina de microgranulados, cantera propia, I+D y liberación gradual (GR), sustentabilidad. CTA "Contactate" o "Conocé los productos" |
| **Franja de números destacados con íconos** (años, países, plantas, referencias, técnicos) | Franja de méritos: años desde 2000, cantidad de productos/elaboraciones, presentaciones, cultivos cubiertos — cifras a confirmar con el cliente |
| **Grid de categorías de productos con íconos SVG** + bloque "Descárgate el catálogo completo (PDF)" | Grid de 5 líneas con íconos + descarga de catálogo/fichas (PDFs por producto si están listos; fallback a las fichas por cultivo actuales) |
| **Bloque institucional de marca** ("Verdes de verdad": storytelling con heading potente y hashtag) | Bloque "capital 100% nacional + compromiso ambiental" (el contenido ya existe en la web actual) |
| **Highlights con imagen**: innovación, potencial industrial, presencia en el mundo | Highlights: cantera San Ramón (La Rioja), planta Puerto Caroya (Córdoba), exportación de plantas y tecnología llave en mano |
| **Sección Actualidad/Noticias** | **Fuera del MVP** (sin blog v1); la estructura queda preparada para agregarla más adelante sin rehacer nada |
| Header con teléfonos y redes; footer con legal + redes + dirección | Header con teléfono de cabecera (+54 351 4816012) y WhatsApp; footer con los 3 teléfonos de Ventas, la oficina, redes y legal (fuente de verdad: `docs/ficha-empresa.md`) |

**Diferencias conscientes respecto de Fertinagro:** sin sección Actualidad, sin grupo
empresarial, sin portal del empleado. RECUPERAR es más chica: menos páginas, fichas más
simple, y énfasis en catálogo + contacto directo (teléfono/WhatsApp), que es cómo se cierra
la venta en el agro argentino.

## Lenguaje visual

- Tonología de referencia: paleta verde agro + neutros, superficies limpias, tipografía sans
  moderna, fotografía de campo/cultivo/planta industrial.
- Los colores y tipografías definitivos se definirán con el material del cliente (logo, placas de
  redes — ver `docs/ficha-empresa.md` y preguntas abiertas del backlog).
- Fotografía: usar las placas propias de productos (el cliente las produce) + fotos institucionales
  nuevas donde falte (planta, cantera, campo).

## Reglas aplicables al trabajo

1. Las secciones/menú nuevos deben encajar en esta arquitectura: si un bloque no mapea a un
   patrón de esta tabla, se documenta antes de agregarlo.
2. Todo bloque hero/CTA debe llevar un CTA directo (teléfono/WhatsApp/contacto).
3. En revisiones: la referencia es de **distribución y jerarquía**, no de cantidad de contenido
   ni efectos visuales. Toda funcionalidad que exceda `docs/perfil-tecnico.md` se gestiona a
   través de `docs/backlog.md`.
