# Arquitectura y estructura del proyecto (Astro)

> Traduce tu mentalidad **MVC de Express/Astro** al modelo de Astro.
> Documentación de estructura — sin código.

## De MVC a Astro

| Rol MVC (tu experiencia Express) | En Astro | Por qué |
|---|---|---|
| **Modelo** (datos, esquemas) | `src/content/` — Content Collections | Archivos (MD/JSON) por producto, con **schema tipado**. El contenido vive en el repo, versionado en Git |
| **Vista** (plantillas) | `src/layouts/` + `src/components/` | Layouts = páginas maestras; components = bloques reutilizables (card, hero, nav) |
| **Controlador** (rutas) | `src/pages/` — file-based routing | Cada archivo dentro de `pages/` ES una ruta. No se declara `app.get(...)`: los "controllers" son archivos |
| Lógica auxiliar | `src/lib/` | Funciones compartidas (parseo, orden, helpers de taxonomías) |

**La diferencia con Express:** Express corre siempre y decide por pedido. Astro **ejecuta los "controllers" al momento del build** (`npm run build`) y congela el resultado como HTML en `dist/`. En producción no hay servidor ejecutando tu código → eso es justo lo que Wix Headless aloja.

## Estructura del repo

```
/
├── src/
│   ├── content/            # MODELO — contenido versionado
│   │   ├── products/       # 1 archivo por producto (ficha técnica completa)
│   │   ├── crops/          # cultivos (extensivo / intensivo + descripción)
│   │   └── site/           # textos institucionales (empresa, qué hacemos)
│   ├── assets/             # imágenes de origEN (Astro las optimiza a WebP/AVIF)
│   ├── components/         # VISTA — bloques UI (ProductoCard, Hero, Nav, Footer, Form...)
│   ├── layouts/            # plantillas de página (BaseLayout, ...)
│   ├── pages/              # CONTROLADOR — rutas file-based
│   │   ├── index.astro             → /
│   │   ├── la-empresa/            → /la-empresa
│   │   ├── que-hacemos/           → /que-hacemos
│   │   ├── productos/             → catálogo + fichas + filtro por línea
│   │   ├── cultivos/              → caminos intensivo / extensivo
│   │   ├── manuales/              → índice de PDFs
│   │   └── contacto/              → formulario
│   ├── lib/                # helpers de datos/orden
│   └── styles/             # CSS global
├── public/                 # archivos servidos tal cual
│   └── files/              # PDFs descargables (fichas, manuales)
├── docs/
└── dist/                   # build (solo local, NO se versiona)
```

## El modelo de datos: dos caminos, un catálogo

La clave del pedido del negocio ("llegar a los mismos productos por caminos diferentes") es la
**taxonomía dual sobre una única colección de productos**:

**`products` (schema, campos principales)**

La taxonomía de líneas es la real del negocio, tomada de la carpeta `productos/` (no la
simplificada de la web vieja):

| Línea | Valor `enum` | Productos detectados |
|---|---|---|
| Arrancadores y Fertilizantes | `arrancadores` | Microar, MicroCanphos, MicroCanphos 2020, MicroCanphos Soja, Microfusión |
| Bioestimulantes | `bioestimulantes` | Canpholiar |
| Correctores de Suelo | `correctores` | Fertical, Fertical + MgO, Full Sulfomag, Yag |
| Jardinería | `jardin` | Green Up, Súper Fertil |
| Mejoradores de Eficiencia | `mejoradores` | Canphos, Ferti Pasturas, N30, Nitro Value |

| Campo | Tipo | Uso |
|---|---|---|
| `nombre` | string | Título de la ficha |
| `linea` | enum (ver arriba) | Camino por producto: agrupación en el índice |
| `composicion` | string | N, P2O5, etc. (texto libre; el acreditado son los PDFs) |
| `mezcla` / `formaFisica` | enum | Datos tipo "Química", "Microgranulado" |
| `presentaciones` | array de string | "Big Bag de 600 Kg", "Bolsa de 20 kg" |
| `imagenesPresentacion` | array de 'asset' | Fotos por presentación |
| `fichaTecnica` / `manual` | 'file' (.pdf en `public/files/`) | Descargas |
| `cultivos` | array de referencia (`crops`) | El camino por cultivo |
| `tipoCultivo` | enum (`extensivo` / `intensivo`) derivado de `cultivos` | Para agrupar |

- **Camino 1 (por producto):** página índice agrupada por `linea` → ficha.
- **Camino 2 (por cultivo):** páginas `cultivos/extensivos` e `intensivos`, listan cultivos → cultivo listando sus productos → la **misma ficha**.
- Agregar un producto nuevo mañana = agregar un archivo + construir; no re-trabajar diseño.

## Accesibilidad / SEO base (no negociable en el MVP)

- HTML semántico, `alt` en imágenes, títulos jerárquicos.
- `<title>` y meta description por página; sitemap y robots en el build.
- Performance: imágenes con `src/assets` (AVIF/WebP automático), JS mínimo (Astro "zero JS" por defecto).

**Materiales crudos — regla importante**

- El material de origen (fotos en alta, placas de redes, PDFs) vive en `productos/` en la raíz del
  repo, organizado como `productos/<Línea>/<Producto>/`. Está **fuera del control de versiones**
  (`.gitignore`): son ~148 MB de binarios, no es código del sitio.
- El flujo de trabajo: del material crudo se **selecciona y optimiza** lo que el sitio necesita →
  las imágenes van a `src/assets/` (WebP/AVIF), los PDFs finales comprimidos van a `public/files/`
  (concretar con cliente, y verificar presupuesto de 20 MB antes del deploy).
- Ingresar/aumentar material crudo **no** genera build ni commits: la recompensa es estrictamente manual.

## Reglas de assets (presupuesto 20 MB)

| Tipo | Regla |
|---|---|
| Fotos originales | `src/assets/` (JPEG/RAW fuente) — Astro optimiza al build |
| PDFs | `public/files/`, comprimir antes de subir (objetivo por archivo ≤ ~500 KB) |
| Logo/iconografía | SVG cuando se pueda |
| Total del build | Verificar antes del deploy: 20 MB máx (si se excede, usar la vía CLI) |
