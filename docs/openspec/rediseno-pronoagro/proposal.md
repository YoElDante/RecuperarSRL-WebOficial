# Propuesta — Rediseño web RECUPERAR (referencia visual PronoAgro)

> Fase SDD: **propose**. Cambio: `rediseno-pronoagro`. Fecha: 2026-11-11.
> Insumo principal: `explore.md` (fase explore, cerrada). Estado: propuesta para aprobación.
> No se escribe código en esta fase.

## 1. Intención

La web de RECUPERAR S.R.L. está hoy en Wix Editor: sin sistema visual, sin hero, sin jerarquía de
lectura, y con PDFs de hasta 44 MB. Este cambio **rehace el sitio institucional completo en Astro
estático** (deploy en Wix Headless) tomando de PronoAgro su lenguaje visual y su ritmo de página
—header verde sticky, acento ámbar, cards con borde superior de acento, hero tipográfico, bandas
CTA con WhatsApp, footer de 5 columnas— con la identidad real de RECUPERAR: verde `#007B3C`,
contenido institucional propio y catálogo de 5 líneas / 16 productos.

El resultado debe ser un sitio que un productor recorra desde el celular, llegue a cualquier
producto **por línea o por cultivo**, descargue su ficha y escriba a ventas en dos toques.

**Criterio rector:** PronoAgro se copia como *estructura y sistema*, nunca como contenido. Lo
propio de PronoAgro (marcas representadas, granos, nutrición animal, portal de clientes,
"30 años", SENASA) **no entra**.

## 2. Alcance

**Páginas (todas generadas en build):**

| Ruta | Contenido |
|---|---|
| `/` | Hero, 4 diferenciales, 5 líneas, banda empresa, CTA, contacto |
| `/la-empresa` | Historia, misión, I+D, cantera propia, capitales nacionales |
| `/que-hacemos` | Tecnologías, planta Puerto Caroya, procesos, plantas llave en mano |
| `/productos` | Índice de 16 productos agrupado por las 5 líneas reales |
| `/productos/[slug]` | Presentaciones con foto, composición, envases, PDFs, cultivos |
| `/cultivos/extensivos` · `/cultivos/intensivos` | Cultivos de cada tipo con entrada a productos |
| `/cultivos/[slug]` | Cultivo + productos recomendados (converge en la misma ficha) |
| `/manuales` | Índice de PDFs descargables |
| `/contacto` | Plantas, formulario, WhatsApp y teléfonos por zona |

Extras: `/404`, `sitemap.xml`, `robots.txt`, favicon, JSON-LD `Organization`.

**Sistema de diseño:** tokens en un único origen, escala tipográfica y de espaciado, radios 4px,
3 niveles de sombra, breakpoints 480/768/1024/1280.

**Modelo de contenido:** collections `products` (16), `crops` (9) y `site`, con **taxonomía dual**
(por línea y por cultivo) sobre una sola colección.

**Componentes:** inventario de `explore.md` §5 en tres capas (layout, primitivas, dominio).

**Assets:** selección y optimización del material de `productos/` hacia `src/assets/` +
`public/files/`, con placeholders donde falte foto.

**Documentación:** actualizar `inspiracion-diseno.md` (hoy declara Fertinagro; pasa a PronoAgro
como principal y Fertinagro como secundaria para el top bar) y marcar fases en `backlog.md`.

**Fuera de alcance:** blog/noticias, e-commerce, pagos, precios, chat, área de clientes, login,
newsletter, multi-idioma, backend propio, Express, SSR, endpoints, base de datos, Wix Editor, Velo,
Wix Studio, migración 301 desde la web actual (es fase 7 del backlog), video de fondo, sliders con
autoplay, scroll-reveal y contadores animados.

## 3. Enfoque técnico

**Framework.** Astro 5.x, `output: 'static'`, TypeScript strict. Cada archivo de `src/pages/` es un
"controller" que se ejecuta **en build** y se congela en HTML: en producción no corre código
nuestro. `dist/` conserva `index.html` en la raíz.

**Contenido.** `products`: `nombre`, `linea` (enum de las 5 líneas reales), `composicion`,
`mezcla`/`formaFisica`, `presentaciones[]`, `imagenesPresentacion[]`, `fichaTecnica`/`manual`
(file), `cultivos[]` y `tipoCultivo` derivado. `crops`: nombre, tipo, descripción. `site`: bloques
institucionales. Dos reglas duras: la taxonomía de líneas es la real de `productos/`, no la
simplificada de la web vieja; y un producto sin PDF **no rompe la ficha** (muestra "Solicitar
ficha desde Contacto").

**Inventario de componentes (tres capas).**
*Layout:* `BaseLayout` (head, SEO, JSON-LD), `TopBar` (3 teléfonos + mail + redes), `SiteHeader`
(sticky verde 92px, dropdowns, CTA), `MobileNav`, `SiteFooter` (5 columnas oscuro),
`FloatingWhatsApp`, `BackToTop`.
*Primitivas:* `Hero` (tipográfico sobre verde profundo), `SectionTitle` (barra izquierda 4px),
`CardGrid`, `LineCard`, `ProductCard`, `CropCard`, `FeatureList`, `MediaBand` (1/3 texto · 2/3
imagen), `CTABand` (gradiente + WhatsApp), `StatsStrip`, `DifferentialStrip` (reemplaza la franja
de marcas de PronoAgro), `SpecTable`, `PresentationGallery`.
*Dominio:* `PdfDownload` (con fallback), `ProductFilter` (dos rutas estáticas), `ContactForm`,
`ContactInfoCard`, `PlantsMap` (iframe lazy).

Cada componente es un `.astro` autónomo con props tipadas y sin lógica de datos embebida: los datos
los resuelve la página vía `lib/`.

**Tokens y estilos.** Un solo origen: `src/styles/tokens.css` + `global.css` (reset, tipografía
base, utilidades). Ningún color, radio ni sombra hardcodeado: siempre `var(--token)`. Paleta de
`explore.md` §4:

- Marca: `--brand-50/100/200/500/600/700/900`, con `--brand-500: #007B3C` (muestreado del logo).
- Acento: `--accent-fill #E2A41A`, `--accent-text #9A6E06`, `--accent-hover #C98F12` (relleno y
  texto separados por contraste AA).
- Neutros: `--bg`, `--surface`, `--surface-alt`, `--border`, `--text`, `--text-muted`,
  `--text-on-dark`; sistema: `--whatsapp`, `--danger`, `--focus-ring`.
- Tipografía: Barlow (display/UI) + Inter (cuerpo, cifras tabulares), auto-hospedadas con
  `@fontsource`, sin CDN de Google. Escala con `clamp()`. Radios 4px, ease 220ms.

**Pipeline de assets.** Material crudo en `productos/` (gitignored) → selección manual → fotos a
`src/assets/` para que `astro:assets` genere AVIF/WebP q60 con `srcset` → PDFs comprimidos a
`public/files/` con nombre estable por slug. Cuando falta foto, se usa el patrón tipográfico
(bloque verde + nombre), nunca una imagen de otro producto.

**No-JS-first.** El sitio funciona completo sin JavaScript: dropdowns por `:hover`/`:focus-within`,
`MobileNav` con `details/summary`, `ProductFilter` resuelto por dos páginas estáticas (no filtro en
cliente), `BackToTop` como ancla, WhatsApp como link `wa.me`. Presupuesto de JS de autor: **≤2 KB
inline** en todo el sitio. Sin islas de framework en v1.

**Formulario.** Servicio estático (Formspree o Web3Forms, decisión en Fase 5) con `action` POST
directo desde el HTML: cero backend. Campos nombre/email/teléfono/área/mensaje; anti-spam con
honeypot + timestamp + validación HTML5. Sin JS sigue enviando. El aviso por WhatsApp a ventas se
resuelve como configuración del proveedor, no como código nuevo.

## 4. Entregables

```
src/styles/     tokens.css · global.css
src/content/    config.ts · products/*.md (16) · crops/*.md (9) · site/*.md
src/lib/        products.ts · crops.ts · taxonomy.ts · seo.ts
src/components/ inventario §3.3 (~27 archivos .astro)
src/layouts/    BaseLayout.astro
src/pages/      index · la-empresa · que-hacemos · productos/index · productos/[slug]
                cultivos/extensivos · cultivos/intensivos · cultivos/[slug]
                manuales · contacto · 404
src/assets/     products/<linea>/<slug>/ · crops/ · brand/
public/files/   fichas técnicas + manuales comprimidos
public/         favicon.svg
docs/           openspec/rediseno-pronoagro/* · inspiracion-diseno.md · backlog.md
```

Configuración: `astro.config.mjs` (sitemap, `site`), `tsconfig.json` strict, `content/config.ts`
con schemas. Dependencias: Astro, `@astrojs/sitemap`, `@fontsource/barlow`, `@fontsource/inter`,
`sharp`. Nada más.

## 5. Restricciones y reglas

| Regla | Valor |
|---|---|
| Build total | **≤ 20 MB** y ≤ 5.000 archivos (límite de upload de Wix Headless) |
| PDFs | ≤ ~500 KB por archivo; los manuales de 44 MB no se publican sin recomprimir |
| Código por archivo | **≤ 400 líneas de código** (comentarios no cuentan) |
| Cabecera de archivo | Todo archivo arranca explicando qué es y qué responsabilidad tiene |
| Comentarios | Una línea sobre cada bloque de código relevante |
| Estático | Sin Express, sin SSR, sin endpoints, sin DB. `output: 'static'` |
| Wix | Solo Headless (upload de `dist/`). **Nunca** tocar el sitio Wix Editor en producción |
| Git | Commits locales únicamente (sin push), conventional commits en inglés, work-units ~400 líneas |
| `dist/` | No se versiona; no se commitean binarios > ~1 MB sin consultar |
| Accesibilidad | HTML semántico, jerarquía de títulos, `alt`, foco visible, contraste AA |
| Contenido | Datos desde `docs/ficha-empresa.md`; nada se inventa ni se copia de PronoAgro |

Implicancia del límite de 400 líneas: `SiteHeader`, `ContactForm` y las páginas densas se parten en
subcomponentes **antes** de llegar al tope, no después.

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **PDFs suman 87 MB** (Canpholiar 44,3 MB, MicroAR 12,6 MB) | Recomprimir a ≤500 KB c/u en Fase 4; si no baja, enlace externo o se omite en v1 |
| **Imágenes crudas 65,7 MB** | `astro:assets` AVIF/WebP q60 + `srcset`; objetivo ≤4 MB para todo el catálogo |
| **Falta foto hero** | Hero tipográfico sobre `--brand-900`, fiel a PronoAgro; la foto entra después sin cambiar estructura |
| **Fotos de cultivo < 501px** | Válidas para cards de 1–2 columnas; nunca en hero ni `MediaBand`. Pedir originales |
| **Logo sin SVG** (PNG 212×78) | Placeholder vectorial provisional + pedido formal del vector; el token de marca ya está definido |
| **Datos inconsistentes** (Full Sulgomag/Sulfomag, "M0 12%") | Normalizar al cargar contenido (Fase 2) contra `contenido-relevado.md` |
| **PDFs faltantes por producto** | `PdfDownload` con fallback "Solicitar desde Contacto"; el diseño lo asume como estado válido |
| **Copiar contenido de PronoAgro por inercia** | Lista de "no trasladar" en §1 y revisión de contenido antes de cada commit de página |
| **Fuentes auto-hospedadas pesan** | Solo los pesos usados (2 por familia), `font-display: swap`, subset latino |

## 7. Criterios de éxito

1. `npm run build` termina sin errores ni warnings de schema.
2. `npm run check` pasa (TS strict + content collections).
3. Las 10 rutas responden y son alcanzables desde header/footer; ningún link interno roto.
4. Todo producto es alcanzable **por los dos caminos** y llega a la misma ficha.
5. Responsive verificado en 375 / 768 / 1024 / 1440: sin overflow ni texto cortado.
6. `dist/` pesa **≤ 20 MB** con ≤ 5.000 archivos (medido, no estimado).
7. El sitio es navegable y el formulario enviable con JavaScript desactivado.
8. Todo archivo de código tiene header de documentación y ≤ 400 líneas.
9. Contraste AA en texto sobre marca y sobre acento; foco visible en todos los interactivos.
10. Lighthouse móvil: Performance ≥ 90, Accesibilidad ≥ 95, SEO ≥ 95.
11. `inspiracion-diseno.md` refleja PronoAgro como referencia principal.

## 8. Plan por fases

Espeja las fases 1–5 del `backlog.md`. Cada fase cierra con un commit work-unit y un criterio
verificable.

**Fase 1 — Base tecnológica y sistema de diseño.** Scaffold Astro (TS strict), `tokens.css` +
`global.css`, `BaseLayout`, `TopBar`, `SiteHeader`, `MobileNav`, `SiteFooter`, flotantes,
sitemap/robots/favicon, `404`, Home mínimo.
*Cierra cuando:* hay skeleton con header/footer reales, tokens aplicados y build verde.

**Fase 2 — Modelo de contenido.** Schemas `products`/`crops`/`site`, 16 productos y 9 cultivos
cargados, helpers en `lib/`, imágenes optimizadas a `src/assets/`, PDFs comprimidos a
`public/files/`.
*Cierra cuando:* `npm run check` valida todo y las imágenes pesan ≤4 MB.

**Fase 3 — Institucional.** Home completo, `La Empresa`, `¿Qué Hacemos?`, `StatsStrip`,
`MediaBand`, `CTABand`, `DifferentialStrip`.
*Cierra cuando:* las 3 páginas están completas y aprobables visualmente.

**Fase 4 — Catálogo por los dos caminos.** Índice por línea, `cultivos/extensivos` e `intensivos`,
páginas por cultivo, ficha de producto (`SpecTable`, `PresentationGallery`, `PdfDownload`), índice
de `Manuales`.
*Cierra cuando:* cualquier producto se alcanza por línea y por cultivo, con PDF o fallback.

**Fase 5 — Contacto, SEO y QA.** `ContactForm` con proveedor elegido, `ContactInfoCard`,
`PlantsMap`, meta por página, JSON-LD, auditoría de presupuesto, Lighthouse y revisión móvil.
*Cierra cuando:* un correo real llega a la casilla y `dist/` cumple el presupuesto.

**Primer slice.** Fase 1 sin la Home, en un work-unit de ~400 líneas: (1) scaffold + strict +
sitemap, (2) `tokens.css` y `global.css`, (3) `BaseLayout` + `TopBar` + `SiteHeader` + `MobileNav` +
`SiteFooter`, (4) `/` con `Hero` y `SectionTitle` como prueba de sistema. Ese slice es revisable de
una sentada, fija el sistema visual antes de producir 25 componentes, y desbloquea todo lo demás
sin depender de PDFs ni de fotos que todavía no existen.
