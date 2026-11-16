# Diseño técnico — Rediseño web RECUPERAR

> Fase SDD: **design**. Cambio: `rediseno-pronoagro`. Fecha: 2026-11-11.
> Insumo: `proposal.md` + `specs.md`. Este documento describe **cómo se implementa**.
> Restricciones aplicables a todo lo de abajo: Astro 5 estático, TS strict, sin SSR/Express/DB,
> ≤400 líneas de código por archivo, header de documentación y comentario sobre cada bloque relevante.

## 1. Reglas de arquitectura que ordenan el resto

1. **Las páginas son controladores.** Consultan datos en build y bajan props; `src/lib/**` es la única
   puerta a las colecciones. En producción no corre código nuestro.
2. **`src/components/**` no importa `astro:content`.** Recibe props tipadas: un componente que necesita
   datos no es un componente, es una página.
3. **`BaseLayout` sí consulta `site`** y reparte contacto/navegación a `TopBar`, `SiteFooter` y
   `MobileNav`; evita cascada de props en 12 rutas.
4. **Un solo origen de estilo:** `tokens.css`; ningún color, radio, sombra o duración hardcodeado.

## 2. Árbol final

```
web/
├── astro.config.mjs · tsconfig.json (strict) · package.json
├── public/                       logo.webp · favicon.ico · robots.txt (generado)
│   └── files/                    fichas/<slug>.pdf · manuales/<slug>.pdf
└── src/
    ├── assets/
    │   ├── brand/logo-recuperar.svg · logo-recuperar-onDark.svg (provisorios)
    │   ├── products/<linea>/<slug>/frente.png · atras.png · detalle.png
    │   └── crops/<slug>.jpg
    ├── components/
    │   ├── layout/     TopBar · SiteHeader · HeaderDropdown · MobileNav · SiteFooter
    │   │               FloatingWhatsApp · BackToTop
    │   ├── primitives/ Hero · SectionTitle · CardGrid · LineCard · ProductCard · CropCard
    │   │               FeatureList · MediaBand · CTABand · StatsStrip · DifferentialStrip
    │   │               SpecTable · PresentationGallery · Icon
    │   └── domain/     LineSection · PdfDownload · ProductFilter · ContactForm · ContactField
    │                   ContactInfoCard · SalesContacts · PlantsMap
    ├── content/
    │   ├── config.ts             defineCollection ×3
    │   ├── products/<slug>.md    16
    │   ├── crops/<slug>.md       9
    │   └── site/                 home.md · empresa.md · que-hacemos.md · contacto.md
    ├── layouts/BaseLayout.astro
    ├── lib/                      products.ts · crops.ts · taxonomy.ts · site.ts · seo.ts
    ├── pages/                    (ver §8)
    └── styles/                   tokens.css · global.css
```

`lib/site.ts` se agrega a los cuatro helpers de la propuesta: la regla 3 exige leer contacto y navegación una sola vez.

## 3. Schemas de contenido (`src/content/config.ts`)

Loader `glob()` de la Content Layer API en los tres casos. En Astro 5 el render de cuerpos se hace con
`import { render } from 'astro:content'`, no con `entry.render()`.

**`products` — `src/content/products/<slug>.md`**

```ts
nombre: string                    // "MicroCanphos Soja" (capitalización normalizada)
linea: 'arrancadores' | 'bioestimulantes' | 'correctores' | 'jardin' | 'mejoradores'
resumen: string                   // 1–2 líneas; alimenta ProductCard y fallback de meta description
composicion: string               // "P2O5 25,4 % · S 7 % · Ca 8,5 % · Mg 1 %"
formaFisica: 'microgranulado' | 'granulado' | 'liquido'
mezclaQuimica: boolean            // default false
presentaciones: Array<{
  nombre: string                  // "Big Bag de 600 kg"
  fotos: Array<{ src: ImageMetadata; alt: string }>   // [] cuando no hay foto
}>
fichaTecnica?: ArchivoRef         // { url: '/files/fichas/<slug>.pdf' } | { url: 'https://…'; externo: true }
manual?: ArchivoRef
cultivos: string[]                // ids de crops; [] = sólo alcanzable por línea (ver §7)
aplicaciones?: Array<{ cultivo: string; dosis: string }>   // sólo donde exista tabla real
destacado?: boolean               // default false; usado por el home
orden: number                     // desempate final por nombre si hay duplicados
```

`presentaciones` absorbe `presentaciones[] + imagenesPresentacion[]` en **un solo array**: dos arrays
paralelos se desalinean al agregar una foto y la galería termina mostrando la bolsa equivocada.

**`crops` — `src/content/crops/<slug>.md`**

```ts
nombre: string                    // "Trigo y Cebada"
tipo: 'extensivo' | 'intensivo'
resumen: string
imagen?: ImageMetadata            // <=480 px de origen: válida para card, nunca para hero
orden: number                     // body Markdown = descripción larga opcional
```

**`site` — `src/content/site/*.md`**, `z.discriminatedUnion('pagina', …)`:
`home` exige `hero`, `diferenciales` (exactamente 4), `bandaEmpresa`, `ctaBands`, `stats`;
`empresa` y `que-hacemos` exigen `intro` y `secciones[]` (`{titulo, texto, items?}`);
`contacto` exige `contacto` (oficina, mails, `telefonos[]` por zona, whatsapp, `formEndpoint`,
`formProveedor`, `privacidadTexto`), `plantas[]` y `redes[]`.

## 4. Flujo de datos

Sólo `src/pages/**`, `src/layouts/**` y `src/lib/**` tocan `astro:content`; los componentes reciben
todo por props. `taxonomy.ts` no lee colecciones: exporta constantes y funciones puras.

| Helper | Exporta | Nota |
|---|---|---|
| `products.ts` | `getAllProducts`, `getProducto(slug)`, `getByLinea(id)`, `getByCultivo(id)`, `getRelacionados(slug, n=3)`, `getDestacados`, `getAllDownloads`, `pdfExists(url)` | `getByCultivo` es la consulta inversa: filtra `cultivos.includes(id)`. `getAllDownloads` usa `node:fs.statSync` en build para peso real y `existsSync` para el fallback. |
| `crops.ts` | `getAllCrops`, `getCropsByTipo(tipo)`, `getCultivo(slug)`, `getCropsDeProducto(refs)`, `countProductosPorCultivo` | Devuelve `CropResumen` (sin body) para cards. |
| `taxonomy.ts` | `LINEAS` (id, label, descripcion, orden, icono), `TIPOS_CULTIVO`, `groupByLinea`, `getLineaLabel`, `getTiposCultivo(producto)`, `ordenarProductos` | `getTiposCultivo` deriva el conjunto de tipos; nunca se guarda en el contenido. |
| `site.ts` | `getPagina('home'\|'empresa'\|'que-hacemos'\|'contacto')`, `getContacto`, `getRedes`, `getNav` | `getNav` arma Productos (5 líneas) y Cultivos (2 tipos) para los dropdowns. |
| `seo.ts` | `buildMeta({titulo, descripcion, canonical})`, `organizationJsonLd(contacto)`, `absoluteUrl(path)` | `Organization` una vez por página; `logo` apunta al SVG de marca. |

## 5. Contratos de componentes

**Layout** (`src/components/layout/`)

| Componente | Props | Responsabilidad |
|---|---|---|
| `TopBar` | `contactos: Contacto` `redes: RedSocial[]` | Franja fina ≥1024px: 3 teléfonos de venta, mail, 4 redes. |
| `SiteHeader` | `nav: NavItem[]` `actual: string` | Shell sticky 92/64px, logo, nav, CTA Contacto, monta `MobileNav` <1024px. |
| `HeaderDropdown` | `item: NavItem` `actual: string` | `<details>`-less list con `:hover`/`:focus-within`, borde ámbar, `aria-current`. |
| `MobileNav` | `nav: NavItem[]` `contactos: Contacto` `redes: RedSocial[]` | `<details>/<summary>`, panel a pantalla completa con contactos. |
| `SiteFooter` | `lineas: Linea[]` `cultivos: CropResumen[]` `contactos: Contacto` `redes: RedSocial[]` | 5 columnas oscuras, NAP completo, copyright. |
| `FloatingWhatsApp` | `telefono: string` `label?: string` | Enlace fijo `wa.me`, safe-area, ≥44px. |
| `BackToTop` | — | Ancla `#top`, ubicada sobre el flotante. |

**Primitivas** (`src/components/primitives/`)

| Componente | Props | Responsabilidad |
|---|---|---|
| `Hero` | `variant: 'home'\|'page'` `titulo: string` `kicker?: string` `bajada?: string` `acciones?: Accion[]` `imagen?: ImageMetadata` | Hero tipográfico sobre `--brand-900`; `imagen` opcional no cambia la estructura. |
| `SectionTitle` | `titulo: string` `eyebrow?: string` `descripcion?: string` `id?: string` `align?: 'left'\|'center'` | Barra izquierda 4px `--accent-fill`, jerarquía h2 + eyebrow. |
| `CardGrid` | `columnas?: 2\|3\|4` `children` | Grilla responsiva 1→2→N con `auto-fit` y gap de escala. |
| `LineCard` | `linea: Linea` `cantidad: number` | Card con borde superior ámbar, conteo real y CTA al ancla de la línea. |
| `ProductCard` | `producto: ProductResumen` `mostrarLinea?: boolean` | Foto de frente o bloque tipográfico; enlaza a `/productos/<slug>`. |
| `CropCard` | `cultivo: CropResumen` | Foto ≤480px o bloque tipográfico; enlaza a `/cultivos/<slug>`. |
| `FeatureList` | `items: Feature[]` `columnas?: 2\|3` `numerado?: boolean` | Diferenciales, tecnologías y pasos de proceso. |
| `MediaBand` | `titulo: string` `texto: string` `accion?: Accion` `imagen?: ImageMetadata` `invertida?: boolean` `tono?: 'claro'\|'oscuro'` | Banda 1/3 texto · 2/3 imagen; sin imagen → panel tipográfico. |
| `CTABand` | `titulo: string` `texto?: string` `whatsapp: string` `accionSecundaria?: Accion` | Gradiente de marca + botón WhatsApp + secundario. |
| `StatsStrip` | `items: Stat[]` | Cifras verificables, sin animación ni contadores. |
| `DifferentialStrip` | `items: Diferencial[]` | Reemplazo de la franja de marcas: 4 diferenciales propios. |
| `SpecTable` | `filas: Array<{etiqueta: string; valor: string}>` | `<table>` con `th` de fila; envuelto en contenedor con scroll-x contenido. |
| `PresentationGallery` | `producto: string` `presentaciones: Presentacion[]` | 1–3 fotos con `alt` compuesto; no renderiza si no hay fotos. |
| `Icon` | `name: IconName` `size?: number` `label?: string` | SVG inline desde un mapa local; sin FontAwesome ni CDN. |

**Dominio** (`src/components/domain/`)

| Componente | Props | Responsabilidad |
|---|---|---|
| `LineSection` | `linea: Linea` `productos: ProductResumen[]` | Encabezado de línea + ancla `#linea-<id>` + grilla. |
| `PdfDownload` | `tipo: 'ficha'\|'manual'` `producto: {slug, nombre}` `documento?: Documento` | Descarga con peso o fallback "Solicitar desde Contacto" (CAP-10). |
| `ProductFilter` | `lineas: Array<{id,label,cantidad}>` `actual?: string` | Barra de anclas a las 5 líneas; cero JS. |
| `ContactForm` | `endpoint: string` `proveedor: 'formspree'\|'web3forms'` `compacto?: boolean` `productoInicial?: string` | Form POST nativo, honeypot, validación HTML5. |
| `ContactField` | `name: string` `label: string` `type: string` `required?: boolean` `hint?: string` `options?: string[]` `minLength?: number` | Campo con label, hint y `aria-describedby`. |
| `ContactInfoCard` | `contactos: Contacto` | Oficina, teléfonos por zona, mail, WhatsApp. |
| `SalesContacts` | `zonas: ZonaVenta[]` `administracion: string` | Tabla de teléfonos por zona reutilizable en home y contacto. |
| `PlantsMap` | `plantas: Planta[]` | iframe `loading="lazy"` por búsqueda de dirección + enlace alternativo. |

## 6. Tokens y estilos globales

`src/styles/tokens.css` — único origen, bloque `:root`:

```css
/* marca (verde muestreado del logo) */
--brand-50:#EEF6F1; --brand-100:#D6E9DD; --brand-200:#A9D3B9; --brand-500:#007B3C;
--brand-600:#006B34; --brand-700:#00542A; --brand-900:#0A2E1B;
/* acento (relleno y texto separados por contraste) + neutros */
--accent-fill:#E2A41A; --accent-hover:#C98F12; --accent-text:#9A6E06;
--bg:#F7F9F7; --surface:#fff; --surface-alt:#F0F4F0; --border:#E1E8E1;
--text:#1A211C; --text-muted:#5E6B60; --text-on-dark:#D8E5DB;
--whatsapp:#25D366; --danger:#C0392B; --focus-ring:rgba(0,123,60,.28);
/* tipografía (auto-hospedada), escala, radios y movimiento */
--font-display:'Barlow',system-ui,sans-serif; --font-body:'Inter',system-ui,sans-serif;
--fs-hero:clamp(2.25rem,6vw,3.75rem); --fs-h2:clamp(1.75rem,3vw,2.5rem);
--fs-h3:1.25rem; --fs-body:1rem; --fs-sm:.875rem; --fs-eyebrow:.75rem;
--radius:4px; --dur:220ms; --ease:cubic-bezier(.2,.7,.3,1);
--space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
--space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;
--shadow-1:0 1px 2px rgba(10,46,27,.06); --shadow-2:0 4px 16px rgba(10,46,27,.08);
--shadow-3:0 12px 32px rgba(10,46,27,.12);
--container:1240px; --header-h:92px; --header-h-sm:64px; --z-header:100; --z-floating:200;
```

`global.css`: reset mínimo, `html{scroll-behavior:smooth}` con guarda `prefers-reduced-motion`,
`body` con `--font-body`, `h1–h3` con `--font-display`, `:focus-visible` con outline 2px +
`--focus-ring`, `img{max-width:100%;height:auto}`, utilidades `.container`, `.section`,
`.grid`, `.visually-hidden`, `.skip-link`, `.prose`. Breakpoints **480 / 768 / 1024 / 1280**;
mobile-first con `min-width`.

Contraste verificado (AA): blanco sobre `--brand-500` = 5,4:1 ✓ · `--text-muted` sobre blanco = 5,6:1 ✓ ·
`--accent-text` sobre blanco = 4,6:1 ✓ · `--text` sobre `--accent-fill` = 7,6:1 ✓. Blanco sobre
`--accent-fill` = 2,2:1 ✗ → **prohibido**; los botones ámbar llevan texto `--text`.

Fuentes: `@fontsource/barlow` 700/800 + `@fontsource/inter` 400/500, subset `latin`, `display:swap`, dos pesos por familia, sin CDN.

## 7. Pipeline de assets

Origen crudo en `productos/<Línea>/<Producto>/` (gitignored) → selección manual → `src/assets/`
(que `astro:assets` convierte a AVIF/WebP q60 con `srcset`) y PDFs recomprimidos a `public/files/`.

Rutas de las fotos relativas a `productos/<Línea>/<Producto>/`:

| slug | foto de frente | ficha | manual |
|---|---|---|---|
| `microar` | `Bolsa de Fertilizante Micro AR.png` | ✓ | — |
| `microcanphos` | `Microcanphos bolsa de frente (sin fondo).png` | ✓ | ✓ |
| `microcanphos-2020` | `Microcanphos 2020 bolsa de frente (sin fondo).png` | ✓ | ✓ |
| `microcanphos-soja` | `Microcanphos bolsa de frente (sin fondo).png` | ✓ | ✓ |
| `microfusion` | `Microfusión bolsa frente ( sin fondo).png` | ✓ | ✓ |
| `canpholiar` | `CANPHOLIAR (SIN FONDO).png` | ✓ | — |
| `fertical` | `BOLSA FERTICAL.PNG` | — | — |
| `fertical-mgo` | `Fertical + Mg bolsa de frente (sin fondo).png` | ✓ | — |
| `full-sulfomag` | `Full Sulfomag bolsa de frente (sin fondo).png` | ✓ | — |
| `yag` | `BOLSA YAG.PNG` | ✓ | — |
| `green-up` | **sin foto** → placeholder | ✓ | — |
| `super-fertil` | **sin foto** → placeholder | ✓ | — |
| `canphos` | `Bolsa canphos sin fondo.png` | ✓ | — |
| `ferti-pasturas` | `Ferti Pasturas bolsa de frente (sin fondo).png` | — | — |
| `n30` | `BOLSA N030.png` | ✓ | ✓ |
| `nitro-value` | `Nitro Value bolsa de frente (sin fondo).png` | ✓ | — |

Las fotos "sin fondo" (PNG con transparencia) van a `presentaciones[].fotos`; las versiones `(cel)`
sirven como respaldo pero no se publican en v1. Las tablas (`Tabla nutricional …`) **no** se usan como
imagen: su contenido se vuelca en `composicion` y `aplicaciones[]`.

Cultivos: las 9 fotos salen del export de la web actual en
`inspiraciones/web recuperar srl actual/…_files/` (`soja-01.jpg`, `MAIX.jpg`, `trigo+.jpg`,
`Alfalfa.jpg`, `girasol-01.jpg`, `maní.jpg`, `tomate.jpg`, `hortalizas.jpg`, `papas.jpg`) y van a
`src/assets/crops/<slug>.jpg`. Todas miden <501px: se renderizan a 480px como máximo y **nunca** en
`Hero`, `MediaBand` ni `og:image`.

Placeholders: `src/assets/brand/logo-recuperar.svg` (wordmark vectorial provisorio trazado del PNG
212×78) y un panel tipográfico CSS (`--brand-100` + nombre en Barlow 700) cuando falta foto de
producto. No se genera ningún bitmap de relleno ni se reutiliza la foto de otro producto.

**Mapeo provisional producto → cultivo.** Cultivos (9): extensivos `soja`, `maiz`, `trigo-cebada`,
`alfalfa`, `girasol`, `mani`; intensivos `tomate`, `hortalizas`, `papas`. Los correctores (`fertical`,
`fertical-mgo`, `full-sulfomag`, `yag`) y jardinería (`green-up`, `super-fertil`) quedan con
`cultivos: []` en v1: la web actual los agrupa como "Enmiendas y acondicionadores" y "Jardín", no por
cultivo. El resto se asigna por nombre de producto y tablas disponibles; **toda fila con ⚠ se verifica
contra el PDF en Fase 2**.

| cultivo | productos | confianza |
|---|---|---|
| `soja` | microar, microcanphos, microcanphos-2020, microcanphos-soja, microfusion | alta (nombre + tablas de aplicación) |
| `maiz` | microcanphos, microcanphos-2020, microfusion, n30, nitro-value | ⚠ media |
| `trigo-cebada` | microfusion, n30, nitro-value | ⚠ media |
| `girasol` | microcanphos, microfusion | ⚠ media |
| `alfalfa` | ferti-pasturas, n30 | ⚠ media |
| `mani` | microfusion | ⚠ baja |
| `tomate` | canpholiar | ⚠ baja |
| `hortalizas` | canpholiar | ⚠ baja |
| `papas` | canpholiar | ⚠ baja |

## 8. Rutas

| Ruta | Archivo | Renderiza |
|---|---|---|
| `/` | `pages/index.astro` | Hero · DifferentialStrip · CardGrid+LineCard · MediaBand · CTABand · ContactInfoCard+ContactForm |
| `/la-empresa` | `pages/la-empresa.astro` | Hero(page) · MediaBand · FeatureList · StatsStrip · CTABand |
| `/que-hacemos` | `pages/que-hacemos.astro` | Hero(page) · FeatureList · MediaBand · CTABand |
| `/productos` | `pages/productos/index.astro` | Hero(page) · ProductFilter · 5× LineSection |
| `/productos/[slug]` | `pages/productos/[slug].astro` | Hero(page) · PresentationGallery · SpecTable · 2× PdfDownload · CropCard · ProductCard · CTABand |
| `/cultivos/extensivos` | `pages/cultivos/extensivos.astro` | Hero(page) · CardGrid+CropCard (tipo extensivo) |
| `/cultivos/intensivos` | `pages/cultivos/intensivos.astro` | idem, tipo intensivo |
| `/cultivos/[slug]` | `pages/cultivos/[slug].astro` | Hero(page) · CardGrid+ProductCard · CTABand |
| `/manuales` | `pages/manuales/index.astro` | Hero(page) · tabla de descargas por línea |
| `/contacto` | `pages/contacto/index.astro` | Hero(page) · ContactInfoCard · ContactForm · SalesContacts · PlantsMap |
| `/contacto/gracias` | `pages/contacto/gracias.astro` | confirmación + WhatsApp (`noindex`) |
| `/404` | `pages/404.astro` | mensaje + 3 enlaces (`noindex`) |

`getStaticPaths` puebla 16 fichas, 9 cultivos y ningún duplicado. Las rutas estáticas
`extensivos`/`intensivos` se resuelven antes que `[slug].astro` y ningún cultivo se llama así.

## 9. Formulario

- Endpoint, proveedor y textos legales se leen de `site/contacto.md` y se pasan a `ContactForm` como
  props; cambiar de Formspree a Web3Forms es un cambio de frontmatter, no de componente.
- `action` POST directo en el HTML; sin `fetch`, sin estado del cliente, sin endpoint propio.
- Campos: `nombre`, `email`, `telefono`, `area` (select: Núcleo / Mesopotamia / Centro y Norte /
  Administración / Otro), `mensaje`, `acepto`.
- Honeypot: `_gotcha` (Formspree) o `botcheck` (Web3Forms), oculto con clase + `aria-hidden` +
  `tabindex="-1"`; el componente elige el nombre según `proveedor`. Sin captcha de terceros.
- Extras del proveedor: `_subject` = "Consulta web — {área}", `_next` = `/contacto/gracias`.
- Marca de tiempo: ≤120 bytes de JS inline para prellenar `productoInicial` y el timestamp. Es
  **mejora progresiva**: si no corre, el POST sigue siendo válido (spec R7.6).

## 10. Partición por límite de 400 líneas

| Archivo | Riesgo | Partición prevista |
|---|---|---|
| `SiteHeader.astro` | alto (logo + nav + 2 dropdowns + CTA) | `HeaderDropdown` ya extraído; el header sólo mapea. |
| `MobileNav.astro` | alto (2 niveles + contactos) | Acordeón por grupo con `<details>` en loop; sin markup repetido. |
| `ContactForm.astro` | alto (6 campos + honeypot + estados) | `ContactField` por campo; el form queda en ~140 líneas. |
| `productos/[slug].astro` | alto (galería + tabla + descargas + relacionados) | Todo en componentes; la página sólo orquesta y arma props (~150). |
| `productos/index.astro` · `index.astro` | medio | Todo en `LineSection`/primitivas; la página sólo compone y arma props. |
| `lib/products.ts` | medio | Si supera 400 se parte `downloads.ts` (fs + tamaños) fuera. |

Regla operativa: al llegar a ~300 líneas se extrae, no se espera al tope.

## 11. Comandos de build y verificación

```bash
npm install
npm run dev        # localhost:4321
npm run build      # dist/ estático
npm run check      # astro check: TS strict + content collections
npm run preview    # sirve dist/
```

```powershell
# Presupuesto de build: ≤20 MB y ≤5.000 archivos
$d = Get-ChildItem dist -Recurse -File
"{0:N2} MB / {1} archivos" -f (($d | Measure-Object Length -Sum).Sum / 1MB), $d.Count

# Guarda de 400 líneas (ignora comentarios y líneas vacías)
Get-ChildItem src -Recurse -Include *.astro,*.ts | ForEach-Object {
  $n = (Get-Content $_ | Where-Object { $_ -match '\S' -and $_ -notmatch '^\s*(//|\*|/\*|<!--)' }).Count
  if ($n -gt 400) { "$($_.FullName): $n" }
}
```

Verificación manual por fase: 375/768/1024/1440 sin overflow, navegación con JS desactivado,
Lighthouse móvil (Performance ≥90, A11y ≥95, SEO ≥95) sobre `npm run preview`.
