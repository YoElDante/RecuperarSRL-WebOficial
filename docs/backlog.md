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

- [ ] Schema de `products` (líneas, composición, presentaciones, PDFs, cultivos)
- [ ] Schema de `crops` (extensivo / intensivo + descripción)
- [ ] Colección `site` para textos institucionales
- [ ] Carga inicial de los 14 productos relevados (docs/contenido-relevado.md)
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

## Preguntas abiertas (bloquean detalles, no el arranque)

1. **Email del formulario:** ¿qué casillas usan y si tienen un SMTP propio (Google Workspace /
   corporativo)? Define entre servicio externo y backend propio.
2. **PDFs por producto:** ¿existen fichas técnicas/manuales **individuales** por producto, o solo
   los agrupados por cultivo que publicó la web actual?
3. **Fotos de productos:** ¿hay fotos de las presentaciones (big bags, bolsas, bidones)? El diseño
   actual casi no las tiene.
4. **Identidad visual:** ¿hay manual de marca (colores, tipografía)? ¿El logo actual es final?
5. ¿El contenido institucional y las fichas los provee ustedes editados, o los proponemos desde lo relevado y los aprueban?
