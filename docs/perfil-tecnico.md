# Perfil técnico del desarrollo — Web Oficial RECUPERAR S.R.L.

> Enter the project with this doc. It states the stack, the constraints and the non-negotiable
> decisions. Project docs are in Spanish; identifiers and code in English.

## Décisiones tomadas (leer antes de proponer cambios)

| Decisión | Elección | Motivo |
|---|---|---|
| Sitio actual | Rediseño desde cero; la web actual en Wix **Editor** no se exporta | Wix Editor es SaaS cerrado |
| Framework | **Astro 5.x** (SSG) | Único framework con integración nativa de Wix; salida 100% estática y portable a cualquier host |
| Hosting / deploy | **Wix Headless** (upload de `dist/` en `wix.com/headless/drop` o `npx wix release`) | Reutiliza el año de hosting pagado; CDN + SSL incluidos |
| Repositorio | `YoElDante/RecuperarSRL-WebOficial` (repo propio, no gestionado por Velo) | Ruta headless, cero lock-in |
| Stack runtime | Node.js 26 LTS, npm, TypeScript | Requisito lo cubre con holgura (la CLI de Wix pide ≥ 24.22.1) |
| Alcance | Sitio institucional: **sin e-commerce, sin pagos, sin chat, sin membresías** | Definición del negocio |
| Blog | **Fuera del MVP** (fase futura) | Definición del negocio |

## Restricciones duras del hosting

| Restricción | Impacto |
|---|---|
| 20 MB totales / 5.000 archivos (upload directo) | Presupuesto de assets: fotos optimizadas (WebP/AVIF), PDFs livianos |
| Sólo estático en el upload directo (sin server code) | El **formulario de contacto** no puede ser un server propio en ese modo → ver email a suite below |
| `index.html` en la raíz del build | Astro cumple por defecto |
| Backend vía CLI: runtime Cloudflare Workers | Opción avanzada si el formulario necesita server propio |

## Formulario de contacto — el único punto "no estático"

La web actual usa el formulario nativo de Wix (mails a las casillas de la empresa).
El cliente definió el requerimiento (nov-2026):

- **Mínimo:** las consultas siguen quedando visibles en la casilla de la empresa, como hoy.
- **Ideal (híbrido):** además del mail, notificar por **WhatsApp** al área de ventas
  (351 6529666).

Como el sitio nuevo es estático, la implementación concreta:

| Camino | Cómo | Trade-off |
|---|---|---|
| **Elegido a explorar** | Servicio de formulario estático (Formspree / Web3Forms) que entrega el mail a la casilla de la empresa + auto-respuesta al visitante; webhook hacia un proveedor de WhatsApp (Meta Cloud API u otro) para el aviso a ventas | Cero backend, deploy en segundos; dos servicios externos (con free tier) a evaluar |
| Fallback | Backend en Wix Headless vía CLI (Astro + runtime Cloudflare Workers + API de mail/WhatsApp) | Autonomía; requiere `npx wix release` y configuración inicial |

Pendiente: proveedor de email y proveedor de WhatsApp (ver backlog, Fase 5).

## Requisitos funcionales (resumen de lo relevado)

1. **Landing institucional**: presentación de la empresa, secciones clásicas, cierre con formulario de contacto.
2. **Dos caminos de navegación de productos** que convergen en el mismo catálogo:
   - por **tipo de producto / línea**;
   - por **tipo de cultivo** (intensivo / extensivo).
3. **Fichas de producto**: presentación(es) con foto, composición, envases, y descargas **PDF** (ficha técnica y manual de uso).
4. **Formulario de contacto**: mail a la empresa + mail de confirmación al que consulta.

## Fuera de alcance (v1)

- Blog, e-commerce, pagos, chat, área de clientes, multi-idioma.

## Referencias

- `docs/wix/` — decisiones sobre Wix (Headless, Git Integration).
- `docs/contenido-relevado.md` — inventario de la web actual (productos, cultivos, contacto).
- `docs/backlog.md` — plan de trabajo y preguntas abiertas.
