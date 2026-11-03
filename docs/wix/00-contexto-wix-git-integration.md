# Contexto — Git Integration & Wix CLI for Sites

> Documento de contexto del ecosistema de desarrollo local de Wix, redactado a partir de la
> documentación oficial. Verificado el 2026-11-03.

**Origen de la documentación**

- [About Git Integration & Wix CLI for Sites](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/about-git-integration-wix-cli-for-sites)
- [Set Up Git Integration & Wix CLI for Sites](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/setting-up-git-integration-wix-cli-for-sites)

---

## 1. Alcance de estas herramientas

`Git Integration & Wix CLI for Sites` permite escribir, probar, previsualizar y publicar código
de un **sitio Wix** (Wix Editor o Wix Studio con Velo) desde el IDE local:

- El código fuente del sitio se aloja en un **repositorio de GitHub creado y vinculado por Wix**
  (no un repo existente).
- El flujo de trabajo sigue Git estándar: ramas, commits, PRs y control de versiones.
- Permite colaboración simultánea de varios desarrolladores (site + repo).

> **Importante:** este ecosistema aplica a sitios **Velo / Wix Studio / Wix Editor**.
> No aplica a proyectos **Wix Headless** (frontend propio, p. ej. Astro), que usa un flujo
> distinto: repo propio en GitHub + `npx wix release`.

## 2. Arquitectura de código (GitHub)

- El repositorio del sitio es creado por Velo al conectar el sitio con GitHub.
- Wix instala la App de GitHub **"Velo"** sobre ese repo para la comunicación bidireccional.
- Cada cambio de código sigue el flujo Git estándar.

## 3. Pruebas en tiempo real (Local Editor)

- Herramienta: **Local Editor**.
- Sincroniza en tiempo real los cambios del sistema de archivos local (IDE) con el entorno de
  pruebas de Wix, sin necesidad de commit/push previo.
- Bidireccional: los cambios visuales de diseño hechos en el Local Editor también se
  sincronizan de vuelta hacia los archivos locales del IDE.
- Se abre automáticamente en el navegador por defecto al finalizar la instalación del entorno.

## 4. Despliegue y paquetes (Wix CLI for Sites)

CLI de línea de comandos instalada globalmente:

- Build de previsualización (Preview) y publicación a producción (Publish).
- Instalación y gestión de dependencias Node (npm packages) del sitio.
- Instalación global: `npm install -g @wix/cli` (o `yarn global add @wix/cli`).

## 5. Restricciones críticas

| Restricción | Detalle |
|---|---|
| Velo Packages | **Incompatible** con la conexión a GitHub. Los paquetes estándar de npm sí son compatibles. |
| Integridad del repositorio | No eliminar el repo ni revocar el acceso de la app "Velo" en GitHub: la conexión puede romperse de forma permanente incluso restaurando el repo o reinstalando la app. |
| Modo lectura | Al conectar el sitio a GitHub, el editor web clásico entra en **modo sólo lectura** (Read-only). |
| Node.js | Versión **v24.22.1 o superior** requerida en el entorno local. |

## 6. Flujo de configuración (resumen)

1. **Conexión inicial (panel de Wix):** activar modo Dev (Velo) o iniciar codificación en
   Wix Studio → Code sidebar → GitHub → Connect to GitHub → autorizar la cuenta → crear repo →
   instalar la app "Velo" limitando el acceso a *Only select repositories* → copiar los comandos
   de terminal provistos.
2. **CLI global:** `npm install -g @wix/cli`.
3. **Clonación:** ejecutar en el directorio de trabajo los comandos copiados en el paso 1
   (clona el repo e instala dependencias). Con yarn: reemplazar `npm install` por `yarn install`.
4. El **Local Editor** se abre automáticamente y sincroniza con el IDE.
