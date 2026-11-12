# Inspiración de diseño — PronoAgro (principal) y Fertinagro (secundaria)

> **La referencia visual principal es <https://www.pronoagro.com.ar/>** (PRONOR AGRO:
> asesoramiento, insumos, granos y nutrición animal). El cliente la eligió explícitamente por su
> lenguaje visual y su ritmo de página. Es inspiración, **no copia**: PRONOR es distribuidor de
> insumos y acopio de granos; RECUPERAR fabrica fertilizantes.
>
> **Fertinagro (<https://www.fertinagro.es/>) queda como referencia secundaria**, y solo se toma
> de ella la **barra superior fina con los teléfonos de venta por zona**.
>
> En ambos casos se copia **estructura y sistema**, nunca contenido, datos ni cifras ajenas.

## Qué tomamos de PronoAgro

| Patrón en PronoAgro | Aplicación en RECUPERAR |
|---|---|
| Header sticky verde de una fila, con dropdowns y borde superior ámbar | `SiteHeader` sticky sobre `--brand-600`, dropdowns de Productos y Cultivos con borde ámbar de 3px |
| Hero tipográfico estático (sin carrusel, sin video) | `Hero` sobre degradado `--brand-900`, kicker ámbar, titular 800 y dos CTAs |
| `.section-title-group` con barra izquierda ámbar | `SectionTitle`: `border-left: 4px solid var(--accent-fill)` |
| Cards con `border-top: 4px solid` ámbar y CTA anclado al pie | `LineCard`, `ProductCard` y `CropCard` con el mismo borde superior y CTA al pie |
| Banda parallax 1/3 de texto + 2/3 de imagen | `MediaBand` (1fr / 2fr), con degradado tipográfico cuando falta foto |
| Franja de marcas representadas | **No aplica**: RECUPERAR fabrica. Se reemplaza por `DifferentialStrip` con sus 4 diferenciales reales |
| CTA band con gradiente + WhatsApp | `CTABand` con `linear-gradient` verde y botón de WhatsApp a `5493516529666` |
| Formulario 1/3 de datos + 2/3 de campos, con select "Área a consultar" | `/contacto`: `ContactInfoCard` + `SalesContacts` a la izquierda, `ContactForm` a la derecha |
| Footer oscuro de 5 columnas | `SiteFooter` con 5 columnas y los datos de `docs/ficha-empresa.md` |
| Flotantes de WhatsApp y volver arriba | `FloatingWhatsApp` + `BackToTop`, ambos sin JavaScript |
| Radio de 4px en todos los componentes, 3 niveles de sombra, transición 220ms | `tokens.css`: `--radius`, `--shadow-1..3`, `--dur`, `--ease` |

**Diferencias conscientes con PronoAgro:** sin marcas de terceros, sin sección de granos ni
logística, sin nutrición animal, sin portal de clientes, sin contadores animados, sin parallax
con JavaScript. El sitio es 100% estático y el JavaScript propio es cero.

## Patrones relevados de Fertinagro (referencia secundaria)

| Patrón en Fertinagro | Aplicación en RECUPERAR |
|---|---|
| **Barra superior con teléfonos y redes** | `TopBar`: teléfonos de venta por zona (Núcleo, Mesopotamia, Centro y Norte, Administración) + mail + redes, visible desde 1024px |
| **Mega-menú "Productos" con entradas por línea** | Menú "Productos" con nuestro set real: 5 líneas + bloque **Cultivos** (Intensivos/Extensivos), que cubre la navegación dual |
| **Hero con banner rotativo** | **Descartado** por presupuesto: el hero es tipográfico y estático |
| **Franja de números con contadores** | `StatsStrip` con cifras verificables y sin animación: fundación 2000, 5 líneas, 16 productos, 9 cultivos |
| **Bloque institucional de marca** | `MediaBand` "capital 100% nacional + cantera propia" |
| **Sección Actualidad/Noticias** | **Fuera del MVP** (sin blog v1) |

RECUPERAR es más chica que ambas referencias: menos páginas, fichas más simples y énfasis en
catálogo + contacto directo (teléfono/WhatsApp), que es cómo se cierra la venta en el agro
argentino.

## Lenguaje visual

- Paleta: verde de marca muestreado del logo (`#007B3C`), acento ámbar (`#E2A41A`) y neutros
  cálidos. Definidos una sola vez en `src/styles/tokens.css`.
- Tipografía: **Barlow** para display/UI y **Inter** para cuerpo y cifras tabulares, ambas
  auto-hospedadas con `@fontsource` (sin Google Fonts en runtime).
- Fotografía: placas de producto provistas por el cliente + fotos de cultivo del sitio actual
  (baja resolución, solo para cards). Cuando falta una foto, se usa un panel tipográfico; nunca
  se rellena con la foto de otro producto ni con stock.
- Radio 4px en todo, sombras en tres niveles, movimiento de 220ms.
- Breakpoints propios: 480 / 640 / 768 / 1024 / 1280.

## Reglas aplicables al trabajo

1. Las secciones/menú nuevos deben encajar en esta arquitectura: si un bloque no mapea a un
   patrón de esta tabla, se documenta antes de agregarlo.
2. Todo bloque hero/CTA debe llevar un CTA directo (teléfono/WhatsApp/contacto).
3. En revisiones: la referencia es de **distribución y jerarquía**, no de cantidad de contenido
   ni efectos visuales. Toda funcionalidad que exceda `docs/perfil-tecnico.md` se gestiona a
   través de `docs/backlog.md`.
4. Nunca copiar de las referencias: datos de contacto, certificaciones, años de trayectoria,
   marcas representadas ni cifras.
