# Backlog — Web Oficial RECUPERAR S.R.L.

> Plan de trabajo por fases. Mentón clave del proceso: **el sitio viejo sigue online hasta que
> el nuevo esté aprobado**; el swap de dominio es el último paso.

## Estado actual

| # | Ítem | Estado |
|---|---|---|
| 0 | Repo inicializado y conectado a GitHub (`main`) | ✅ |
| 0 | Investigación Wix Headless + decisión Astro | ✅ |
| 0 | Docs base (perfil técnico, arquitectura, contenido) | ✅ |

## Fase 1 — Base tecnológica

- [ ] Scaffold Astro (TS strict, minimal) + commit inicial del proyecto
- [ ] `BaseLayout` con header (menu), footer (contactos + redes) y estilos base
- [ ] Configurar sitemap + robots + favicon
- [ ] Definir tokens visuales básicos (paleta desde logo actual, tipografías)
- **Cierre cuando:** existe un skeleton navegable de 1 página con header/footer.

## Fase 2 — Modelo de contenido

- [ ] Schema de `products` (líneas reales de `productos/`, composición, presentaciones, PDFs, cultivos)
- [ ] Schema de `crops` (extensivo / intensivo + descripción)
- [ ] Colección `site` para textos institucionales
- [ ] Carga inicial: 16 productos (14 relevados de la web actual + Microar, Ferti Pasturas,
      Nitro Value y la variante MicroCanphos 2020 registrados en `productos/`)
- [ ] Selección y optimización del material de `productos/` → `src/assets/` + `public/files/`
- **Cierre cuando:** la colección compila con el schema y los datos están cargados.

## Fase 3 — Institucional

- [ ] Home/landing institucional (presentación, diferenciales, plantas, CTA contacto)
- [ ] Página `La Empresa` (historia, misión, I+D, cantera propia)
- [ ] Página `¿Qué Hacemos?` (tecnologías, planta, procesos)
- [ ] Compresión y carga de fotos institucionales
- **Cierre cuando:** las 3 páginas estén aprobadas por el cliente.

## Fase 4 — Catálogo por los dos caminos

- [ ] Índice de productos por **línea** (5 agrupaciones)
- [ ] Secciones `cultivos/extensivos` e `cultivos/intensivos` con cada cultivo
- [ ] Página por cultivo listando sus productos
- [ ] **Ficha de producto**: presentaciones con fotos, composición, envases, descarga de
      ficha técnica + manual (PDFs en `public/files/`)
- [ ] Página `Manuales de Uso` índice de todos los PDFs
- **Cierre cuando:** cualquier producto es alcanzable por ambos caminos con PDFs reales.

## Fase 5 — Contacto

- [ ] Formulario (nombre, email, teléfono, mensaje + validación y spam)
- [ ] Envío de mail a la empresa **+ auto-respuesta al consultante** (decisión pendiente:
      servicio externo vs backend en Workers — ver perfil técnico)
- [ ] Datos de contacto y mapa/selección de plantas
- **Cierre cuando:** un correo real llega a la casilla y el usuario recibe la respuesta.

## Fase 6 — SEO, performance y QA

- [ ] Meta titles/descriptions por página con palabras clave del rubro
- [ ] Lighthouse: performance ≥ 90 móvil, accesibilidad ≥ 95
- [ ] Revisión del presupuesto total del build (≤ 20 MB)
- [ ] Pruebas en móvil real + navegadores
- **Cierre cuando:** pantal baneo verde y el cliente navega la web en staging.
-preview en `*.wix-site-host.com`

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
   fichas con **falta de PDF** (mostrar "solicitar desde contacto" en lo que falte).
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

## Preguntas abiertas (bloquean detalles, no el arranque)

1. ¿Qué casilla(s) reciben el foco del formulario de contacto (hoy: ventas1@ y expo@)?
2. ¿El WhatsApp de aviso es el general de ventas (351 6529666) o por vendedor/zona?
3. Preferencia de tipografía/servicio de tipografías para la marca (falta definirla).
4. ¿Quién aprueba los textos institucionales propuestos (relevados de la web actual) antes del
   deploy final?

