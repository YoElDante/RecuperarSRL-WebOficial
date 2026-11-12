# Tareas de implementación — Rediseño web RECUPERAR

> Fase SDD: **tasks**. Cambio: `rediseno-pronoagro`. Fecha: 2026-11-11.
> Insumos: `proposal.md`, `specs.md`, `design.md`, `docs/ficha-empresa.md`, `docs/contenido-relevado.md`.
> Este documento es la **checklist ejecutable** del orquestador. No contiene código.

## 0. Cómo se ejecuta

- Un **work unit (WU)** = un commit local, conventional commit en inglés, ~400 líneas.
  Sin push. Formato: `feat:`, `content:`, `docs:`, `chore:`, `refactor:`, `fix:`.
- Cada tarea (T) indica archivos, dependencia y **verificación**. Nada se marca hecho sin verificación.
- Regla dura: archivo > 400 líneas → **se parte en la tarea, no después**. Al llegar a ~300 se extrae.
- Todo archivo arranca con header de documentación y comentario de una línea por bloque relevante.
- Marcas: **🔒 asset-blocked** = no se puede cerrar sin material del cliente.
  **⏸ diferido** = se ejecuta, pero deja un estado válido sin el insumo.

### Comandos de verificación (se referencian por nombre)

| Alias | Comando |
|---|---|
| `BUILD` | `npm run build` |
| `CHECK` | `npm run check` |
| `MANUAL` | revisión en 375 / 768 / 1024 / 1440 con JS desactivado |
| `BUDGET` | script PowerShell de design.md §11: `dist/` ≤ 20 MB y ≤ 5.000 archivos |
| `LINES` | script PowerShell de design.md §11: ningún `.astro`/`.ts` supera 400 líneas |

---

## Fase 1 — Base tecnológica y sistema de diseño

### WU-01 · Slice 1 — Fase 1 sin Home (PRIMER WORK UNIT, se revisa de una sentada)

El slice fija el sistema visual antes de producir los ~27 componentes y no depende de PDFs ni de
fotos inexistentes. Por la regla de 400 líneas se entrega en 6 commits encadenados; el WU se revisa
como bloque completo.

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T1.1 | Scaffold Astro 5 estático + TS strict + deps mínimas (`@astrojs/sitemap`, `@fontsource/barlow`, `@fontsource/inter`, `sharp`), `site` en `astro.config.mjs` | `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore` | — | `npm install` + `BUILD` |
| T1.2 | `tokens.css` (paleta, escala `clamp()`, espaciado, radios 4px, 3 sombras, `--header-h`) y `global.css` (reset, tipografía, `:focus-visible`, utilidades `.container/.section/.grid/.visually-hidden/.skip-link/.prose`, guarda `prefers-reduced-motion`) | `src/styles/tokens.css`, `src/styles/global.css` | T1.1 | `BUILD`; ningún color hardcodeado en revisión |
| T1.3 | Contenido mínimo del shell: schema `site` reducido a `contacto` (oficina, mails, `telefonos[]` por zona, whatsapp, `redes[]`) + helper de lectura | `src/content/config.ts`, `src/content/site/contacto.md`, `src/lib/site.ts` | T1.1 | `CHECK`; datos carácter por carácter vs `ficha-empresa.md` |
| T1.4 | Primitivas de prueba del sistema: `Icon` (mapa SVG local), `Hero` (`variant: home\|page`), `SectionTitle` (barra ámbar 4px) | `src/components/primitives/Icon.astro`, `Hero.astro`, `SectionTitle.astro` | T1.2 | `BUILD` + `LINES` |
| T1.5 | `BaseLayout` (head, `lang="es-AR"`, fuentes `@fontsource`, skip-link, `main`, monta shell) + `TopBar` (3 teléfonos, mail, 4 redes, oculto <1024px) | `src/layouts/BaseLayout.astro`, `src/components/layout/TopBar.astro` | T1.3, T1.4 | `BUILD`; `LINES`; top bar correcto en 1024 y 1440 |
| T1.6 | `SiteHeader` sticky (92/64px, `--brand-600`, `aria-current`), `HeaderDropdown` (`:hover`/`:focus-within`), `MobileNav` (`<details>/<summary>`, contactos dentro) | `src/components/layout/SiteHeader.astro`, `HeaderDropdown.astro`, `MobileNav.astro` | T1.5 | `BUILD`; `LINES`; navegación completa con JS off en 375 y 1024 |
| T1.7 | `SiteFooter` 5 columnas oscuro + `FloatingWhatsApp` + `BackToTop` (ancla `#top`) | `src/components/layout/SiteFooter.astro`, `FloatingWhatsApp.astro`, `BackToTop.astro` | T1.5 | `BUILD`; `LINES`; `MANUAL` en 375 (flotante no tapa el footer) |
| T1.8 | `/` mínimo de prueba de sistema: `Hero` + `SectionTitle` + un `CTABand` provisional sin copy de negocio inventado | `src/pages/index.astro` | T1.6, T1.7 | `BUILD`; `/` renderiza con header y footer; sin scroll horizontal en 375 |

### WU-02 · Cierre de Fase 1

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T1.9 | `404` (H1 + enlaces a Inicio, Productos, Contacto) y `BaseLayout` aceptando `noindex` | `src/pages/404.astro`, `src/layouts/BaseLayout.astro` | T1.8 | `BUILD`; `/404` abre y tiene un solo `<h1>` |
| T1.10 | `sitemap` + `robots.txt` (referencia al sitemap) + `favicon.svg` provisorio + logo vectorial de marca en `src/assets/brand/` | `astro.config.mjs`, `public/robots.txt`, `public/favicon.svg`, `src/assets/brand/logo-recuperar.svg` | T1.8 | `BUILD`; `dist/sitemap-index.xml` y `dist/robots.txt` existen |
| T1.11 | Alinear docs: `inspiracion-diseno.md` pasa a PronoAgro como referencia principal y Fertinagro como secundaria; `backlog.md` marca Fase 1 | `docs/inspiracion-diseno.md`, `docs/backlog.md` | T1.10 | revisión de contenido (commit `docs:`) |

**Definition of Done — Fase 1**
- [ ] `BUILD` y `CHECK` verdes; `dist/index.html` existe en la raíz.
- [ ] `LINES` sin archivos > 400 líneas.
- [ ] Un solo `<header>` y un solo `<footer>` en `/` y `/404`.
- [ ] Navegación completa con JS desactivado en 375 y 1440.
- [ ] Los 5 teléfonos y 4 redes coinciden con `ficha-empresa.md`.
- [ ] Ningún color, radio ni sombra hardcodeado fuera de `tokens.css`.
- [ ] `inspiracion-diseno.md` declara PronoAgro como referencia principal.

---

## Fase 2 — Modelo de contenido

### WU-03 · Schemas y taxonomía

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T2.1 | Schema `products` completo (`linea` enum 5 valores, `presentaciones[]` con fotos `image()`, `fichaTecnica`/`manual` como `ArchivoRef` interno o externo, `cultivos[]`, `orden`) | `src/content/config.ts` | T1.3 | `CHECK` sin warnings |
| T2.2 | Schema `crops` (nombre, `tipo` enum, resumen, imagen opcional, orden) + `site` completo como `discriminatedUnion('pagina')` (`home` con 4 diferenciales exactos, `empresa`, `que-hacemos`, `contacto`) | `src/content/config.ts` | T2.1 | `CHECK`; si supera 400 líneas, partir en `config/` por colección |
| T2.3 | `taxonomy.ts`: `LINEAS` (5, con label/descripción/orden/icono), `TIPOS_CULTIVO`, `groupByLinea`, `getLineaLabel`, `getTiposCultivo`, `ordenarProductos` (nombre como desempate) | `src/lib/taxonomy.ts` | T2.2 | `CHECK`; test manual de orden determinista |

### WU-04 · Assets de imagen (material local en `productos/`, fuera de git)

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T2.4 | Selección de fotos de presentación según tabla design.md §7 → `src/assets/products/<linea>/<slug>/` (14 productos; `green-up` y `super-fertil` quedan sin foto a propósito) | `src/assets/products/**` | T2.1 | `BUDGET` de `src/assets` ≤ 4 MB; ninguna foto de otro producto reutilizada |
| T2.5 | 9 fotos de cultivo desde el export de la web actual → `src/assets/crops/<slug>.jpg` (≤ 480 px) | `src/assets/crops/**` | T2.2 | revisión visual; nunca usadas en `Hero` ni `MediaBand` |

### WU-05 · Cultivos

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T2.6 | 9 cultivos en `.md`: `soja`, `maiz`, `trigo-cebada`, `girasol`, `alfalfa`, `mani` (extensivos) · `tomate`, `hortalizas`, `papas` (intensivos) | `src/content/crops/*.md` (9) | T2.5 | `CHECK`; 6 + 3 exactos por tipo |

### WU-06 · Productos (un commit por línea)

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T2.7 | `arrancadores` (5): microar, microcanphos, microcanphos-2020, microcanphos-soja, microfusion | `src/content/products/*.md` | T2.4, T2.6 | `CHECK`; suma por línea = 5 |
| T2.8 | `bioestimulantes` (1): canpholiar | idem | T2.7 | `CHECK` |
| T2.9 | `correctores` (4): fertical, fertical-mgo, full-sulfomag, yag — normalizar "Full Sulgomag", "M0 12 %" | idem | T2.8 | `CHECK`; `cultivos: []` en los 4 |
| T2.10 | `jardin` (2): green-up, super-fertil (sin fotos, no rompen) | idem | T2.9 | `CHECK`; `presentaciones[].fotos: []` |
| T2.11 | `mejoradores` (4): canphos, ferti-pasturas, n30, nitro-value | idem | T2.10 | `CHECK`; total 16 productos |
| T2.12 | Verificar el mapeo producto→cultivo de design.md §7 (todas las filas ⚠) contra los PDFs disponibles y corregir contenido | `src/content/products/*.md` | T2.11 | revisión contra PDF; commit `content: verify crop mapping` |

### WU-07 · Helpers de lectura

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T2.13 | `products.ts`: `getAllProducts`, `getProducto`, `getByLinea`, `getByCultivo` (consulta inversa), `getRelacionados`, `getDestacados` | `src/lib/products.ts` | T2.11 | `CHECK` |
| T2.14 | `downloads.ts` (separado si `products.ts` pasa 300 líneas): `getAllDownloads`, `pdfExists` con `node:fs` en build, peso real de archivo | `src/lib/downloads.ts` | T2.13 | `CHECK` |
| T2.15 | `crops.ts`: `getAllCrops`, `getCropsByTipo`, `getCultivo`, `getCropsDeProducto`, `countProductosPorCultivo` | `src/lib/crops.ts` | T2.13 | `CHECK` |
| T2.16 | Validación de referencia producto→cultivo: cultivo inexistente falla el build con mensaje que nombra archivo y campo | `src/lib/crops.ts` | T2.15 | `BUILD` con un cultivo falso temporal → falla; revertir |

**Definition of Done — Fase 2**
- [ ] `CHECK` valida las 3 colecciones sin errores ni warnings de schema.
- [ ] 16 productos (5/1/4/2/4) y 9 cultivos (6/3) cargados.
- [ ] Imágenes de `src/assets/` suman ≤ 4 MB.
- [ ] Agregar un producto nuevo requiere solo un `.md` (probado y revertido).
- [ ] Ningún campo publicado contradice `contenido-relevado.md`.
- [ ] `LINES` limpio.

---

## Fase 3 — Institucional

### WU-08 · Primitivas de banda

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T3.1 | `CTABand`, `DifferentialStrip`, `StatsStrip`, `FeatureList` | `src/components/primitives/*.astro` | Fase 2 | `BUILD` + `LINES` |
| T3.2 | `MediaBand` (1/3 texto · 2/3 imagen, fallback a panel tipográfico), `CardGrid`, `LineCard` | idem | T3.1 | `BUILD`; fallback probado sin imagen |

### WU-09 · Copy institucional en `site`

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T3.3 | `home.md`: hero, 4 diferenciales, banda empresa, 2 `ctaBands`, `stats` | `src/content/site/home.md` | T2.2 | `CHECK`; exactamente 4 diferenciales |
| T3.4 | `empresa.md` (historia, misión, I+D, cantera San Ramón) y `que-hacemos.md` (tecnologías, planta Puerto Caroya, plantas llave en mano) | `src/content/site/*.md` | T3.3 | `CHECK`; todo dato rastreable a `ficha-empresa.md` |

### WU-10 · Páginas institucionales

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T3.5 | `/` completa en el orden hero → diferenciales → líneas → banda empresa → CTA → contacto. El bloque de formulario se sustituye por `ContactInfoCard` + CTA a `/contacto` ⏸ hasta T5.4 | `src/pages/index.astro` | T3.2, T3.3, T2.15 | `BUILD`; un solo `<h1>`; conteo de líneas calculado desde la colección; `MANUAL` |
| T3.6 | `/la-empresa` (hero interior + breadcrumb + `MediaBand` + `FeatureList` + `StatsStrip` + `CTABand`) | `src/pages/la-empresa.astro` | T3.4 | `BUILD`; `MANUAL` |
| T3.7 | `/que-hacemos` (hero interior + breadcrumb + `FeatureList` + `MediaBand` + `CTABand`) | `src/pages/que-hacemos.astro` | T3.4 | `BUILD`; `MANUAL` |
| T3.8 | Revisión de contenido de las 3 páginas con lista de "no trasladar" (marcas de terceros, granos, nutrición animal, "30 años", SENASA) | — | T3.7 | checklist manual antes del commit |

**Definition of Done — Fase 3**
- [ ] Las 3 páginas completas y aprobables visualmente en 375/768/1024/1440.
- [ ] `<title>` y description propios por página, distintos del home.
- [ ] Copy institucional editable desde `src/content/site/`, no desde `.astro`.
- [ ] Cero afirmaciones no rastreables a los docs fuente.
- [ ] Fallback tipográfico funcionando donde falta foto institucional 🔒.
- [ ] `LINES` limpio; `BUILD` verde.

---

## Fase 4 — Catálogo por los dos caminos

### WU-11 · Componentes de catálogo

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T4.1 | `ProductCard` (foto o bloque tipográfico de marca) y `CropCard` | `src/components/primitives/*.astro` | Fase 3 | `BUILD`; slugs sin foto correctos |
| T4.2 | `SpecTable` (tabla semántica, `th` de fila, scroll-x contenido) y `PresentationGallery` (no renderiza sin fotos) | idem | T4.1 | `BUILD`; `MANUAL` 375 sin overflow |
| T4.3 | `PdfDownload` con dos estados: descarga (tipo + peso + `download`) o fallback "Solicitar desde Contacto" → `/contacto#formulario` | `src/components/domain/PdfDownload.astro` | T2.14 | `BUILD`; probado con PDF presente y ausente |
| T4.4 | `LineSection` (ancla `#linea-<id>`) y `ProductFilter` (5 anclas, cero JS) | `src/components/domain/LineSection.astro`, `ProductFilter.astro` | T4.1 | `BUILD`; `LINES` |

### WU-12 · Catálogo por línea

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T4.5 | `/productos`: hero interior + `ProductFilter` + 5 `LineSection` con conteo; suma exacta 16 | `src/pages/productos/index.astro` | T4.4 | `BUILD`; `dist/productos/index.html` con 16 productos |
| T4.6 | `/productos/[slug]`: breadcrumb, badge de línea, galería, `SpecTable`, 2× `PdfDownload`, cultivos, 2–3 relacionados (nunca a sí mismo), `CTABand` | `src/pages/productos/[slug].astro` | T4.5 | `BUILD`; 16 archivos en `dist/productos/`; `LINES` ≤ 400 (si no, extraer bloque de relacionados a componente) |

### WU-13 · Catálogo por cultivo

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T4.7 | `/cultivos/extensivos` e `/cultivos/intensivos`: grilla de `CropCard` + enlace cruzado al otro tipo | `src/pages/cultivos/extensivos.astro`, `intensivos.astro` | T4.1 | `BUILD`; 6 y 3 cultivos |
| T4.8 | `/cultivos/[slug]`: H1, descripción, "N productos recomendados" (consulta inversa), grilla, CTA; estado vacío EB5.2 | `src/pages/cultivos/[slug].astro` | T4.7, T2.15 | `BUILD`; 9 páginas; producto abre **la misma** ficha que por línea |

### WU-14 · Manuales

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T4.9 | `/manuales`: tabla por línea con producto, tipo, peso real y descarga; excluye PDFs ausentes; advertencia de build si > 500 KB | `src/pages/manuales/index.astro` | T4.3, T2.14 | `BUILD`; total listado = archivos reales declarados; sin href muertos |
| T4.10 | Recompresión de PDFs a ≤ 500 KB en `public/files/fichas/` y `public/files/manuales/` con nombre por slug **🔒 asset-blocked** (Canpholiar 44,3 MB y MicroAR 12,6 MB: si no bajan, enlace externo o ⏸ fuera de v1) | `public/files/**` | T4.9 | `BUDGET`; cada PDF declarado existe o cae al fallback |

**Definition of Done — Fase 4**
- [ ] Todo producto se alcanza por línea y por cultivo y llega a la misma ficha (mismo `<title>` y `<h1>`).
- [ ] 16 fichas + 9 cultivos + índice + manuales generados en `dist/`.
- [ ] Ninguna ficha con enlace roto; Fertical y Ferti Pasturas muestran fallback.
- [ ] `/manuales` lista solo documentos existentes.
- [ ] Sin overflow en 375 (tablas y galerías incluidas).
- [ ] `LINES` limpio; `BUILD` y `CHECK` verdes.

---

## Fase 5 — Contacto, SEO y QA

### WU-15 · Formulario

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T5.1 | Elegir proveedor estático (Formspree o Web3Forms), registrarlo y documentar la decisión | `docs/perfil-tecnico.md`, `src/content/site/contacto.md` | Fase 4 | envío de prueba real recibido en la casilla |
| T5.2 | `ContactField` (label, hint, `aria-describedby`) y `ContactForm` (POST nativo, honeypot por proveedor, `_next`, `area` select, checkbox de datos) | `src/components/domain/ContactField.astro`, `ContactForm.astro` | T5.1 | `BUILD`; `LINES` ≤ 400; envío con JS off recibe correo |
| T5.3 | `ContactInfoCard`, `SalesContacts`, `PlantsMap` (iframe `loading="lazy"` por dirección + enlace "Ver en Google Maps") | `src/components/domain/*.astro` | T5.2 | `BUILD`; datos vs `ficha-empresa.md` |
| T5.4 | `/contacto` (1/3 info · 2/3 form), `/contacto/gracias` (`noindex`), y **conectar el bloque de contacto del home** (cierra el ⏸ de T3.5) | `src/pages/contacto/index.astro`, `contacto/gracias.astro`, `src/pages/index.astro` | T5.3 | `BUILD`; envío real + confirmación; `MANUAL` 375 sin flotante sobre el botón |

### WU-16 · SEO y accesibilidad

| ID | Tarea | Archivos | Dep | Verificación |
|---|---|---|---|---|
| T5.5 | `seo.ts`: `buildMeta`, `organizationJsonLd`, `absoluteUrl`; meta por página (title ≤ 60, description 120–160, canonical, OG) y JSON-LD una vez por página | `src/lib/seo.ts`, `src/layouts/BaseLayout.astro`, todas las páginas | T5.4 | `BUILD`; `title` único por ruta; JSON-LD válido |
| T5.6 | Sitemap completo, `robots.txt` con referencia, `noindex` en `/404` y `/contacto/gracias` | `astro.config.mjs`, `public/robots.txt` | T5.5 | `BUILD`; sitemap contiene solo rutas públicas |
| T5.7 | Auditoría a11y + no-JS: jerarquía de encabezados, `alt` en toda imagen, foco visible, contraste AA, recorrido de las 10 rutas sin JS | transversal | T5.6 | checklist manual; axe sin errores AA |
| T5.8 | QA final: `BUDGET`, `LINES`, Lighthouse móvil sobre `npm run preview`, revisión en dispositivo real | — | T5.7 | Performance ≥ 90, A11y ≥ 95, SEO ≥ 95; `dist/` ≤ 20 MB |
| T5.9 | Cierre documental: `backlog.md` con fases 1–5 cerradas, decisiones registradas en `perfil-tecnico.md`, `tasks.md` con el estado real | `docs/backlog.md`, `docs/perfil-tecnico.md`, `docs/openspec/rediseno-pronoagro/tasks.md` | T5.8 | commit `docs:` |

**Definition of Done — Fase 5**
- [ ] Un correo real de prueba llega a la casilla con JS desactivado.
- [ ] `/contacto/gracias` alcanzable y fuera del índice.
- [ ] Toda página con `title`, description, canonical y OG propios; JSON-LD `Organization` una sola vez.
- [ ] Cero llamadas de red salvo el POST del formulario y el iframe del mapa.
- [ ] `BUDGET` y `LINES` cumplidos y medidos, no estimados.
- [ ] Lighthouse móvil sobre el objetivo; sitio navegable sin JS de punta a punta.

---

## Pendientes bloqueados por material del cliente

| Bloqueo | Afecta | Estado en v1 | Desbloqueo |
|---|---|---|---|
| PDFs Canpholiar (44,3 MB) y MicroAR (12,6 MB) | T4.10, T4.9 | Fallback de solicitud | Recompresión ≤ 500 KB o enlace externo |
| Logo en vector | T1.10 provisorio | SVG trazado provisional | Pedido formal del vector |
| Fotos institucionales / de planta | T3.5, T3.6, T3.7 | `MediaBand` tipográfica | Envío de originales (no rearma el diseño) |
| Foto de hero | R2.1 | Hero tipográfico (decisión de diseño) | Opcional, posterior |
| Fotos de cultivo < 501 px | T4.7 | Solo cards, nunca hero | Originales en alta |

## Orden de ejecución

`WU-01 → WU-02 → WU-03 → WU-04 → WU-05 → WU-06 → WU-07 → WU-08 → WU-09 → WU-10 → WU-11 → WU-12 → WU-13 → WU-14 → WU-15 → WU-16`

Dependencias duras: Fase 2 no arranca sin Fase 1 cerrada; `WU-12` y `WU-13` no arrancan sin `WU-07`
(helpers). T4.10 puede ejecutarse en paralelo desde `WU-11` en adelante, pero **debe** resolverse
antes de `WU-16`. Nada de Fase 4 depende de Fase 5.
