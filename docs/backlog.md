# Backlog — Web Oficial RECUPERAR S.R.L.

> Plan de trabajo por fases. Referencias de propósito: `docs/ficha-empresa.md` (datos oficiales),
> `docs/inspiracion-diseno.md` (diseño: PronoAgro como referencia principal, Fertinagro en el
> top bar). Nota clave del proceso: **el sitio viejo sigue online hasta que el nuevo esté
> aprobado**; el swap de dominio es el último paso.
>
> Estado del código: ver `docs/openspec/rediseno-pronoagro/tasks.md` (checklist ejecutable) y
> `docs/openspec/rediseno-pronoagro/design.md` (contratos de componentes y rutas).

## Estado actual

| # | Ítem | Estado |
|---|---|---|
| 0 | Repo inicializado y conectado a GitHub (`main`) | ✅ |
| 0 | Investigación Wix Headless + decisión Astro | ✅ |
| 0 | Docs base (perfil técnico, arquitectura, contenido) | ✅ |
| 0 | Artefactos SDD del rediseño (`docs/openspec/rediseno-pronoagro/`) | ✅ |
| 0 | Ejemplo funcional del sitio completo en Astro (10 rutas, 35 páginas generadas) | ✅ |

## Fase 1 — Base tecnológica

- [x] Scaffold Astro (TS strict, minimal) + commit inicial del proyecto
- [x] `BaseLayout` con header (menú), footer (contactos + redes) y estilos base
- [x] Configurar sitemap + robots + favicon
- [x] Definir tokens visuales básicos (paleta desde logo actual, tipografías Barlow + Inter)
- [x] Top bar de teléfonos de venta por zona (patrón Fertinagro)
- **Cierre cuando:** existe un skeleton navegable de 1 página con header/footer. → ✅

## Fase 2 — Modelo de contenido

- [x] Schema de `products` (líneas reales de `productos/`, composición, presentaciones, PDFs, cultivos)
- [x] Schema de `crops` (extensivo / intensivo + descripción)
- [x] Colección `site` para textos institucionales
- [x] Carga inicial: 16 productos (14 relevados de la web actual + Microar, Ferti Pasturas,
      Nitro Value y la variante MicroCanphos 2020 registrados en `productos/`)
- [x] Selección y optimización del material de `productos/` → `src/assets/` (14 fotos de producto
      + 9 de cultivo; Astro las convierte a WebP en build)
- [ ] Copiar y comprimir los PDFs a `public/files/` — **bloqueado por peso** (87 MB crudos)
- **Cierre cuando:** la colección compila con el schema y los datos están cargados. → ✅

## Fase 3 — Institucional

- [x] Home/landing institucional (hero, 4 diferenciales, 5 líneas, banda de empresa, stats,
      destacados, dos caminos por cultivo, CTA y teaser de contacto)
- [x] Página `La Empresa` (historia, misión, I+D, cantera propia)
- [x] Página `¿Qué Hacemos?` (tecnologías, planta, procesos)
- [ ] Compresión y carga de fotos institucionales — **bloqueado**: falta material del cliente
- **Cierre cuando:** las 3 páginas estén aprobadas por el cliente. → ⏳ pendiente de revisión

## Fase 4 — Catálogo por los dos caminos

- [x] Índice de productos por **línea** (5 agrupaciones, filtro por anclas sin JS)
- [x] Secciones `cultivos/extensivos` e `cultivos/intensivos` con cada cultivo
- [x] Página por cultivo listando sus productos (misma ficha por ambos caminos)
- [x] **Ficha de producto**: presentaciones, composición, tabla de especificaciones y descargas
- [x] Página `Manuales de Uso` con estado vacío honesto y fallback a contacto
- [ ] Fichas técnicas y manuales reales en `public/files/` — **bloqueado por peso**
- **Cierre cuando:** cualquier producto es alcanzable por ambos caminos con PDFs reales. → ⏳

## Fase 5 — Contacto

- [x] Formulario estático (nombre, email, teléfono, área, mensaje + honeypot y consentimiento)
- [ ] Reemplazar `formEndpoint` (`https://formspree.io/f/REEMPLAZAR`) por el endpoint real
- [ ] Auto-respuesta al consultante (decisión pendiente: servicio externo vs Workers)
- [x] Datos de contacto y mapa de plantas (oficina + planta + yacimiento)
- **Cierre cuando:** un correo real llega a la casilla y el usuario recibe la respuesta. → ⏳

## Fase 6 — SEO, performance y QA

- [x] Meta titles/descriptions por página con palabras clave del rubro
- [x] JSON-LD Organization, canonical, Open Graph, sitemap y robots
- [x] Presupuesto del build: **7,85 MB** sobre 20 MB disponibles
- [ ] Lighthouse: performance ≥ 90 móvil, accesibilidad ≥ 95 (medir en staging)
- [ ] Pruebas en móvil real + navegadores
- **Cierre cuando:** pantallazo verde y el cliente navega la web en staging.

## Fase 7 — Deploy y migración

- [ ] Deploy a Wix Headless (upload de `dist/` o `npx wix release`)
- [ ] Aprobación final del cliente sobre la URL de staging
- [ ] Apuntar dominio `recuperarsrl.com.ar` (DNS) al nuevo sitio
- [ ] Plan de rollback: viejo sitio Wix queda intacto hasta el swap
- **Cierre cuando:** la web oficial responde con el nuevo diseño.

## Fase futura (fuera del MVP)

- Blog (migración del contenido existente, si lo agregan)
- Multilenguaje (si hay demanda de exportación)
- Nuevas secciones / campañas

## Preguntas respondidas (nov-2026, cliente)

1. **PDFs:** hay fichas técnicas de algunos productos; generar/actualizar el resto es tarea
   incremental del cliente ("las placas" y material siguen creciendo). El diseño debe soportar
   fichas con **falta de PDF** (mostrar "solicitar desde contacto" en lo que falte) → implementado
   en `PdfDownload`.
2. **Email del formulario:** hoy lo resuelve Wix; se mantiene el requisito de dejar el mail
   visible en la casilla de la empresa; ideal híbrido con aviso por WhatsApp (ver perfil
   técnico, sección Formulario).
3. **Identidad:** el cliente produce el material gráfico que haga falta (sabe convertir a WebP).
4. **Fotos:** existen fotos de presentaciones y placas para redes de los productos → el diseño
   SÍ cuenta con imágenes reales.

## Material crudo disponible

- `productos/` (fuera de git): **5 líneas, 16 productos**, con fotos (PNG/JPEG) y 19 PDFs.
- Los PDFs agrupados por cultivo de la web vieja siguen siendo referencia; la meta es ficha
  técnica + manual por producto.
- Logos: solo PNG 212×78; falta el vector (SVG). El sitio usa un logotipo tipográfico provisorio.

## Preguntas abiertas (bloquean detalles, no el arranque)

1. ¿Qué casilla(s) reciben el foco del formulario de contacto (hoy: ventas1@ y expo@)?
2. ¿El WhatsApp de aviso es el general de ventas (351 6529666) o por vendedor/zona?
3. Preferencia de tipografía/servicio de tipografías para la marca (propuesta actual: Barlow + Inter).
4. ¿Quién aprueba los textos institucionales propuestos (relevados de la web actual) antes del
   deploy final?
