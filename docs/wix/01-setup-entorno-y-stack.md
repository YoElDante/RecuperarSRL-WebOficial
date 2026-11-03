# Setup del entorno de desarrollo y manifiesto tecnológico

> Web Oficial RECUPERAR S.R.L. — Verificado el 2026-11-03.
>
> **Nota clave sobre rutas de Wix:** hay dos ecosistemas diferentes y NO son intercambiables.
> Este documento refleja la ruta decidida para este proyecto (Astro + Wix Headless) y deja
> documentada, a título de referencia, la ruta alternativa (Velo + Git Integration for Sites).

---

## 1. Las dos rutas de Wix (comparación)

| | **Ruta A — Astro + Wix Headless (DECIDIDA)** | **Ruta B — Velo + Git Integration for Sites** |
|---|---|---|
| Repositorio | Nuestro repo propio: `YoElDante/RecuperarSRL-WebOficial` | Repo creado y gestionado por Velo/Wix |
| Framework | Astro (salida estática) | Velo (JavaScript/TypeScript propietario de Wix) |
| Local Editor | No se necesita | Obligatorio para probar en tiempo real |
| Requisito Node.js | VLC LTS (v18+ funciona; v20+ recomendado) | v24.22.1 o superior |
| Deploy | Upload en `wix.com/headless/drop` o `npx wix release` | `wix-cli` publish desde el repo vinculado |
| Portabilidad | Total: el mismo `dist/` corre en Netlify/Vercel/Cloudflare Pages/GitHub Pages | Nula: el código Velo sólo corre en servidores Wix |
| Integración con Wix | Business APIs (CMS, ecommerce, payments) opcional vía Headless | Nativa del editor |

**Por qué la Ruta A:** el sitio actual vive en Wix Editor y *no se puede exportar*; el nuevo sitio
se construye desde cero en tecnología portable. Wix Headless permite aprovechar el hosting pago
(pueden ver [About Wix-Managed Headless](https://dev.wix.com/docs/go-headless/wix-managed-headless/about-wix-managed-headless)
y [About Supported Frameworks](https://dev.wix.com/docs/go-headless/wix-managed-headless/about-supported-frameworks),
donde **Astro es el framework con integración completa recomendado por Wix**). El mismo build es
 portable si más adelante decidimos dejar Wix.

## 2. Manifiesto tecnológico (Ruta A)

| Capa | Tecnología | Versión | Justificación |
|---|---|---|---|
| Framework front-end | Astro | 5.x (SSG) | Framework recomendado por Wix para Headless; salida 100% estática, portable |
| Lenguaje | TypeScript | 5.x | Tipado estándar del ecosistema Astro; reduce errores en runtime |
| Runtime | Node.js | v22 LTS (instalado: v22.23.4) | Suficiente para Astro; la v24 sólo es requisito de la Ruta B |
| Gestor de paquetes | npm | 11.x (instalado: 11.12.1) | Estándar; no se necesita yarn |
| Control de versiones | Git + GitHub | Git 2.56 | Repo propio, flujo estándar de ramas y PRs |
| Hosting / Deploy | Wix Headless | — | Aprovecha el año de hosting pagado; CDN global + SSL incluidos |
| Estilos | Se decide al armar el layout | — | Batería en el aire: CSS nativo o Tailwind |

## 3. Requisitos del entorno local (estado actual)

| Requisito | Estado | Acción |
|---|---|---|
| Git | ✅ 2.56.0 | — |
| Node.js | ✅ v22.23.4 | Suficiente para la Ruta A |
| npm | ✅ 11.12.1 | — |
| Autenticación GitHub | ✅ `gh` CLI autenticado (HTTPS, token con scope `repo`) | — |
| Wix CLI (`@wix/cli`) | ⬜ No instalado | Sólo necesario antes del deploy: `npm install -g @wix/cli` |

## 4. Pasos para dejar el entorno preparado

1. **Scaffold del proyecto Astro** en la raíz del repo (ya conectado a GitHub):
   ```powershell
   npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
   npm install
   ```
2. **Estructura base:** `src/pages/` (secciones de la web), `src/layouts/`, `src/components/`,
   `public/` (assets optimizados — recordar el presupuesto de **20 MB total** del upload directo
   a Wix Headless: fotos en WebP/AVIF y comprimidas).
3. **Commit inicial del scaffold** y push a `origin/main`.
4. **Verificar el build** antes de deployar:
   ```powershell
   npm run build   # genera dist/
   npm run preview # prueba local del build
   ```
5. **Al momento de publicar (fin del desarrollo):**
   - Opción rápida: arrastrar `dist/` en <https://wix.com/headless/drop> (sitio estático, hasta 20 MB).
   - Opción CLI (`npm install -g @wix/cli` antes): inicializar el proyecto headless local apuntando
     `outputDirectory` a `dist/` y publicar con `npx wix release`.
6. **Dominio:** al final, apuntar el dominio actual a la nueva web (cambio de DNS A/CNAME en el
   panel de Wix si el dominio está registrado allí). El sitio viejo sigue en línea hasta el swap.

## 5. Referencia — Setup de la Ruta B (Velo + Git Integration)*

*\* Sólo aplica si el sitio se desarrolla en Velo/Wix Studio. Documentada por estar la fuente
oficial vinculada en `00-contexto-wix-git-integration.md`.*

- Finalizar la conexión sitio→GitHub desde el editor (crea el repo e instala la app "Velo").
- Requiere: Git, **Node v24.22.1+**, npm/yarn, clave SSH en GitHub.
- Instalar CLI global: `npm install -g @wix/cli`.
- Ejecutar los comandos de clonación provistos por el panel de Wix (`Local Dev Setup`).
- Restricciones: sin Velo Packages; repo/app no eliminables; editor web en modo lectura.
