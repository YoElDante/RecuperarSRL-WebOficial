# Especificaciones de comportamiento — Rediseño web RECUPERAR

> Fase SDD: **spec**. Cambio: `rediseno-pronoagro`. Fecha: 2026-11-11.
> Insumo: `proposal.md` (aprobada) + `explore.md`.
> Este documento define **qué debe hacer** el sitio, en términos verificables. El **cómo** está en
> `design.md`. No contiene código.
>
> Regla transversal: todo dato publicado proviene de `docs/ficha-empresa.md` o
> `docs/contenido-relevado.md`. Nada se inventa y nada se copia de la referencia visual.

## 0. Convenciones

| Término | Definición |
|---|---|
| **Línea** | Agrupación comercial real de productos. Cinco valores: `arrancadores`, `bioestimulantes`, `correctores`, `jardin`, `mejoradores`. |
| **Cultivo** | Entidad de la colección `crops`, con `tipo` = `extensivo` \| `intensivo`. |
| **Taxonomía dual** | Dos caminos de navegación (por línea y por cultivo) sobre **una sola** colección de productos. |
| **Ficha** | Página `/productos/[slug]`. Es el destino final de ambos caminos y debe ser idéntica. |
| **Fallback de PDF** | Estado válido de un producto sin ficha técnica ni manual: se ofrece "Solicitar desde Contacto" en lugar de una descarga rota. |
| **No-JS** | Navegador con JavaScript desactivado. Es un modo soportado, no un caso borde. |
| **Riesgo de contenido** | Texto, número o afirmación que no aparece en los docs fuente. Prohibido. |

Prioridad de requisitos: **[M]** obligatorio para v1, **[D]** deseable, se puede diferir sin romper
la spec.

---

## CAP-1 · Shell global

### Propósito
Dar a todo el sitio una cabecera, un cierre y una navegación consistentes, usables con una mano en
el celular y completos sin JavaScript.

### Requisitos

**R1.1 [M]** `TopBar` muestra exactamente los datos de contacto de cabecera: mail
`expo@recuperarsrl.com.ar`, teléfono `+54 351 4816012` y los tres teléfonos de venta por zona
(Núcleo `351 6529666`, Mesopotamia `3436 443000`, Centro y Norte `351 6411025`), más los cuatro
perfiles sociales. Todo teléfono es un enlace `tel:` sin espacios ni guiones en el `href`.

**R1.2 [M]** `TopBar` se oculta por debajo de 1024px y sus datos se repiten dentro de `MobileNav`.
Ningún dato de contacto queda inaccesible en móvil.

**R1.3 [M]** `SiteHeader` es `position: sticky`, fondo `--brand-600`, altura 92px en ≥768px y 64px en
<768px. Al hacer scroll de 200px el header sigue visible y no tapa el contenido (se usa
`scroll-margin-top` en los destinos de ancla).

**R1.4 [M]** El header contiene el logo enlazado a `/`, la navegación principal (Inicio, La Empresa,
¿Qué Hacemos?, Productos, Cultivos, Manuales) y un CTA "Contacto" hacia `/contacto`. El ítem de la
página actual se marca con `aria-current="page"`.

**R1.5 [M]** Los menús desplegables de Productos y Cultivos se abren con `:hover` **y** con
`:focus-within`, y cierran al perder el foco. Son navegables solo con teclado: Tab entra al
disparador, Tab vuelve a entrar a los ítems, Escape no es requisito (no hay JS).

**R1.6 [M]** `MobileNav` usa `<details>/<summary>`, existe solo por debajo de 1024px, contiene la
navegación completa, los teléfonos, el mail y las redes, y permite cerrar el panel.

**R1.7 [M]** `SiteFooter` tiene cinco columnas en ≥1024px (Marca, Líneas, Cultivos, Institucional,
Contacto) y colapsa en acordeón o columna única en móvil. Incluye razón social, año de fundación,
direcciones de oficina y plantas, y la línea de copyright.

**R1.8 [M]** `FloatingWhatsApp` es un enlace `https://wa.me/5493516529666` fijo abajo a la derecha,
con `aria-label` explícito, tamaño de toque ≥44×44px y respeto de `env(safe-area-inset-bottom)`.

**R1.9 [M]** `BackToTop` es un ancla a `#top`, no un botón con JS. Se ubica por encima del flotante
de WhatsApp y nunca cubre un control de formulario.

**R1.10 [D]** El sitio expone un `skip-link` "Saltar al contenido" como primer elemento enfocable.

### Criterios de aceptación
- Existe un único `<header>` y un único `<footer>` por página; se renderizan en todas las rutas
  incluidas `/404`.
- Con JS desactivado se puede atravesar el menú completo (escritorio por hover/focus, móvil por
  `<details>`) y llegar a las 10 rutas desde header o footer.
- En 375px no hay scroll horizontal; el header no se superpone al H1.
- Los 5 teléfonos y los 4 perfiles sociales del sitio coinciden carácter por carácter con
  `ficha-empresa.md`.

### Casos borde
- **EB1.1** Viewport entre 1024 y 1100px: los seis ítems de navegación + CTA deben entrar sin
  solaparse; si no entran, se reduce el espaciado antes de romper el layout.
- **EB1.2** El panel de `MobileNav` abierto no bloquea el scroll del body (no hay JS para hacerlo).
  Se acepta; el panel ocupa el alto disponible y se cierra con el mismo `<summary>`.
- **EB1.3** El flotante de WhatsApp no debe tapar el botón de envío del formulario en 375×667.
- **EB1.4** Con `prefers-reduced-motion: reduce` no corre ninguna transición de hover ni scroll suave.

---

## CAP-2 · Home

### Propósito
Que un productor entienda en menos de diez segundos qué hace RECUPERAR, vea las cinco líneas y
tenga un camino a producto y a contacto sin pensar.

### Requisitos

**R2.1 [M]** El hero es **tipográfico**: fondo `--brand-900` con textura sutil, sin imagen. Contiene
kicker, H1 único con el posicionamiento real ("Soluciones eficientes para el máximo aprovechamiento
de nutrientes"), bajada y dos CTA: "Ver productos" → `/productos` y "Escribir por WhatsApp".
Altura mínima 70vh en ≥768px, sin `parallax` ni video.

**R2.2 [M]** `DifferentialStrip` presenta **exactamente cuatro** diferenciales, tomados de
`ficha-empresa.md`: 1ª fábrica argentina de fertilizantes microgranulados, 1ª fábrica argentina de
mezclas químicas, 1ª fábrica cordobesa de fertilizantes minerales y organominerales, 1ª fábrica
cordobesa de correctores de suelos.

**R2.3 [M]** La grilla de líneas muestra las 5 líneas con nombre, una frase de descripción y el
conteo real de productos por línea, calculado desde la colección (no escrito a mano). Cada tarjeta
enlaza a `/productos#linea-<id>`.

**R2.4 [M]** La banda de empresa (`MediaBand`, 1/3 texto · 2/3 imagen) usa un panel tipográfico verde
mientras no exista foto institucional, y enlaza a `/la-empresa`. No se referencia ninguna imagen
inexistente.

**R2.5 [M]** Hay al menos dos `CTABand` con gradiente de marca y enlace a WhatsApp, una después de la
grilla de líneas y otra antes del bloque de contacto.

**R2.6 [M]** El bloque de contacto replica el patrón 1/3 info + 2/3 formulario: `ContactInfoCard` a la
izquierda y `ContactForm` (variante compacta) a la derecha. Es el mismo componente que usa
`/contacto`, con el mismo endpoint configurado.

**R2.7 [D]** Una fila de cifras (`StatsStrip`) con solo datos verificables: fundación 2000, 2
ubicaciones productivas (Córdoba y La Rioja), 5 líneas de producto, 16 productos.

**R2.8 [M]** El orden de secciones del home es: hero → diferenciales → líneas → banda empresa →
CTA → bloque contacto. No hay sliders ni carruseles.

### Criterios de aceptación
- El home no contiene ninguna afirmación que no se pueda rastrear a `ficha-empresa.md` o
  `contenido-relevado.md` (revisión manual con lista de chequeo antes del commit).
- Un solo `<h1>`; la jerarquía de secciones no salta niveles.
- El home no supera los 900 KB de peso total transferido en la primera carga.
- Ningún texto del home menciona marcas de terceros, granos, nutrición animal, "30 años" ni SENASA.

### Casos borde
- **EB2.1** Si una línea quedara con 0 productos, su tarjeta en el home no se renderiza y la grilla
  pasa de 5 a 4 columnas sin huecos.
- **EB2.2** Si falta la foto institucional, `MediaBand` cae al panel tipográfico; el diseño no se
  rearma ni deja un `alt` vacío con imagen rota.
- **EB2.3** Con el formulario del home visible, `/contacto` sigue siendo el destino del CTA
  "Contacto" del header (no se ancla al formulario del home).

---

## CAP-3 · Páginas institucionales

### Propósito
Contar la empresa y el proceso productivo con la profundidad que el negocio ya tiene escrita, sin
inventar historia ni cifras.

### Requisitos

**R3.1 [M]** `/la-empresa` incluye: hero interior, presentación (empresa minera e industrial, 100 %
capitales nacionales, fundada en 2000), misión/posicionamiento, los cuatro diferenciales, bloque de
I+D (microgranulación, quelatado, liberación gradual de nitrógeno, extracción industrial de ácidos
fúlvicos y húmicos de compostaje), cantera propia en San Ramón (La Rioja) y CTA final.

**R3.2 [M]** `/que-hacemos` incluye: hero interior, tecnologías y procesos (pelletizado, molienda y
tratamiento de minerales), planta de Córdoba en Parque Industrial Puerto Caroya (Ruta Nac. 9 N,
km 747), desarrollo de equipamiento industrial, exportación de plantas llave en mano y capacitación,
y CTA final.

**R3.3 [M]** Ambas páginas usan un hero interior consistente (kicker + H1 + bajada) con breadcrumb
visible y navegable.

**R3.4 [M]** Las cifras mostradas (año de fundación, cantidad de plantas, líneas, productos) se
derivan del contenido o de constantes documentadas; ninguna se escribe hardcodeada en el `.astro`.

**R3.5 [M]** Ambas páginas cierran con el mismo `CTABand` hacia `/contacto` y WhatsApp.

**R3.6 [D]** Enlaces cruzados entre ambas páginas y hacia `/productos` dentro del cuerpo, al menos
dos por página.

### Criterios de aceptación
- Cada página tiene `<title>` y meta description propios, distintos del home.
- El texto institucional se edita desde `src/content/site/`, no desde el `.astro`.
- No aparece ningún dato de la empresa que no esté en `ficha-empresa.md`.

### Casos borde
- **EB3.1** Si el cliente todavía no entregó fotos de planta, los bloques usan `MediaBand` en
  variante tipográfica; la página queda aprobable y la foto entra después sin cambiar estructura.
- **EB3.2** El breadcrumb de una página de primer nivel muestra solo "Inicio / Página", sin niveles
  vacíos.

---

## CAP-4 · Catálogo por línea y ficha de producto

### Propósito
Que el catálogo completo (5 líneas, 16 productos) sea navegable por agrupación comercial y que cada
producto tenga una ficha autosuficiente con presentaciones, composición, envases y descargas.

### Requisitos

**R4.1 [M]** `/productos` lista los 16 productos agrupados en las 5 líneas reales, con un encabezado
por línea (`id="linea-<id>"`), descripción de la línea y conteo. Ninguna línea se omite si tiene
productos; ninguna se muestra vacía si no los tiene.

**R4.2 [M]** Cada `ProductCard` muestra nombre, línea, resumen corto y foto de presentación si
existe; enlaza a `/productos/<slug>`. Si no hay foto, muestra el bloque tipográfico de marca con el
nombre, nunca una imagen de otro producto.

**R4.3 [M]** `/productos` ofrece un acceso rápido a las 5 líneas mediante anclas (`#linea-...`),
resuelto sin JavaScript.

**R4.4 [M]** `/productos/[slug]` se genera para los 16 productos mediante rutas estáticas. Contiene:
breadcrumb, H1 con el nombre, badge de línea, resumen, `PresentationGallery`, `SpecTable`
(composición, forma física, mezcla química sí/no, presentaciones/envases), bloque de descargas
(`PdfDownload` para ficha técnica y manual), lista de cultivos recomendados con enlace a
`/cultivos/<slug>`, bloque de productos de la misma línea y `CTABand`.

**R4.5 [M]** `PresentationGallery` solo renderiza fotos reales declaradas en el contenido. Cada foto
tiene `alt` descriptivo que incluye el nombre del producto y, si corresponde, la presentación.

**R4.6 [M]** `SpecTable` presenta composición y envases como tabla semántica (con `th` de fila) o
lista de definiciones; se lee correctamente con lector de pantalla y en 375px no genera overflow
horizontal.

**R4.7 [M]** La ficha enlaza a un mínimo de 2 y un máximo de 3 productos de la misma línea como
"también de esta línea", y nunca se enlaza a sí misma.

**R4.8 [M]** Un slug inexistente produce la página `404` del sitio (comportamiento estático), no un
error de build ni una página vacía.

### Criterios de aceptación
- Las 16 fichas existen en `dist/productos/` con HTML completo (sin hidratación).
- La suma de productos renderizados en `/productos` es exactamente 16 y coincide con la colección.
- Toda ficha es alcanzable desde `/productos` en dos clics como máximo.
- Ningún `href` de la ficha apunta a un archivo inexistente.

### Casos borde
- **EB4.1** Producto sin ninguna foto (caso real: Green Up, Súper Fértil): la galería no se renderiza
  y la ficha abre con el bloque tipográfico a la derecha del título.
- **EB4.2** Producto con una sola foto: la galería ocupa el ancho disponible, sin columnas vacías.
- **EB4.3** Composición con texto largo: la tabla permite quiebre de línea y no desborda.
- **EB4.4** Producto con `orden` duplicado con otro: el orden final se resuelve por nombre para que
  el build sea determinista.

---

## CAP-5 · Catálogo por cultivo (convergencia)

### Propósito
Que un productor que piensa en su cultivo —no en la línea comercial— llegue al mismo producto por su
camino natural, sin duplicar contenido.

### Requisitos

**R5.1 [M]** `/cultivos/extensivos` y `/cultivos/intensivos` listan los cultivos de su `tipo`, con
foto (si existe), nombre, resumen y enlace a `/cultivos/<slug>`. Extensivos = 6, intensivos = 3.

**R5.2 [M]** `/cultivos/[slug]` se genera para los 9 cultivos. Contiene: H1 del cultivo, descripción,
grilla de productos recomendados y CTA de contacto para asesoramiento.

**R5.3 [M]** Los productos de un cultivo se obtienen por consulta inversa sobre la colección de
productos (los productos declaran sus cultivos). **No existe** una lista de productos duplicada en el
archivo del cultivo.

**R5.4 [M]** Todo producto enlazado desde una página de cultivo apunta a `/productos/<slug>` y
renderiza **la misma** ficha que desde el camino por línea. No hay fichas "por cultivo".

**R5.5 [M]** Cada página de cultivo ofrece un enlace cruzado al listado del otro tipo
(`extensivos` ↔ `intensivos`) y un breadcrumb Inicio / Cultivos / Tipo / Cultivo.

**R5.6 [M]** Las rutas estáticas `/cultivos/extensivos` e `/cultivos/intensivos` tienen precedencia
sobre la dinámica y no colisionan con ningún slug de cultivo.

**R5.7 [M]** Cada página de cultivo indica cuántos productos recomienda ("N productos
recomendados"), calculado en build.

### Criterios de aceptación
- Recorrido verificable: `/productos` → producto y `/cultivos/extensivos` → cultivo → **mismo**
  producto, con el mismo `<title>` y el mismo `<h1>` en la ficha.
- Los 9 cultivos son alcanzables desde el header (menú Cultivos) y desde el footer.
- Ningún cultivo queda sin productos en v1 (ver EB5.2 si ocurre).

### Casos borde
- **EB5.1** Un producto sin cultivos asignados (caso real: correctores de suelo y jardinería) aparece
  en el catálogo por línea y **no** en las páginas de cultivo. Es un estado válido, no un error.
- **EB5.2** Un cultivo sin productos no rompe el build: muestra "Estamos actualizando las
  recomendaciones para este cultivo" y el CTA de contacto.
- **EB5.3** Si un producto referencia un cultivo inexistente, el build falla con mensaje explícito
  (validación de referencia), no genera un enlace roto.
- **EB5.4** Un cultivo del tipo `intensivo` no aparece nunca en `/cultivos/extensivos`.

---

## CAP-6 · Índice de manuales y descargas

### Propósito
Concentrar en un solo lugar todos los PDFs publicables, con peso visible y descarga directa, sin que
el usuario tenga que entrar producto por producto.

### Requisitos

**R6.1 [M]** `/manuales` lista **todas** las descargas declaradas en el contenido (fichas técnicas y
manuales de uso), agrupadas por línea de producto.

**R6.2 [M]** Cada fila muestra: nombre del producto, tipo de documento (Ficha técnica / Manual de
uso), peso en formato legible (KB o MB) y un enlace de descarga.

**R6.3 [M]** El peso se obtiene del archivo real en build, no se escribe a mano.

**R6.4 [M]** Los enlaces a PDF usan el atributo `download` y abren en pestaña nueva con
`rel="noopener"`; el texto del enlace describe el documento, no "click aquí".

**R6.5 [M]** Cada fila enlaza además a la ficha del producto, para que el usuario vea el contexto
antes o después de descargar.

**R6.6 [M]** Un PDF declarado que no existe en disco no se lista: el sistema cae al fallback del
CAP-10. El índice nunca contiene enlaces muertos.

**R6.7 [D]** La página indica el total de documentos disponibles y, si algún archivo supera 500 KB, el
build emite una advertencia (no bloquea).

### Criterios de aceptación
- El total de documentos listados coincide con la cantidad de archivos realmente presentes en
  `public/files/` que estén declarados en contenido.
- Ningún `href` del índice responde 404.
- La página pesa menos de 200 KB (es texto + enlaces, no embebe los PDFs).

### Casos borde
- **EB6.1** Producto con ficha pero sin manual (caso real: Canpholiar, Nitro Value, Microar): se lista
  solo la ficha.
- **EB6.2** Producto sin ningún PDF (caso real: Fertical, Ferti Pasturas): no aparece en el índice,
  pero su ficha ofrece el fallback de solicitud.
- **EB6.3** PDF de 44 MB sin recomprimir: no se publica; se marca como pendiente y se resuelve en
  Fase 4 antes del deploy.

---

## CAP-7 · Contacto

### Propósito
Que una consulta comercial llegue a la casilla de la empresa y, idealmente, avise por WhatsApp, sin
backend propio y funcionando con JavaScript desactivado.

### Requisitos

**R7.1 [M]** `/contacto` presenta, en ≥1024px, una columna de información (1/3) y el formulario
(2/3). En móvil, primero la información resumida y luego el formulario.

**R7.2 [M]** `ContactInfoCard` muestra: oficina comercial (Av. La Cordillera 4985, esq. Rafael Núñez,
B° Padre Claret, CP 5009, Córdoba), los tres teléfonos de venta por zona, administración
(351 9060889), mail `ventas1@recuperarsrl.com.ar` y el enlace de WhatsApp. Todos los teléfonos son
`tel:`.

**R7.3 [M]** `PlantsMap` muestra las dos ubicaciones productivas (planta Puerto Caroya y yacimiento
San Ramón) mediante `iframe` de Google Maps con `loading="lazy"` y `title` descriptivo, usando
**búsqueda por dirección**, no coordenadas inventadas. Cada mapa ofrece además un enlace de texto
"Ver en Google Maps" que funciona sin JS.

**R7.4 [M]** El formulario envía por `POST` a un servicio estático (Formspree o Web3Forms, decisión
de Fase 5) mediante `action` en el HTML. No hay endpoint propio, ni `fetch`, ni backend.

**R7.5 [M]** Campos: nombre (obligatorio, 2–60), email (obligatorio, `type=email`), teléfono
(obligatorio, `type=tel`, 6–20 caracteres), área de consulta (select obligatorio con las zonas de
venta + Administración + Otro), mensaje (obligatorio, 10–1200 caracteres) y aceptación de uso de
datos (checkbox obligatorio). Cada campo tiene `<label>` asociado, `name` estable y `autocomplete`
adecuado.

**R7.6 [M]** Anti-spam: honeypot oculto a lectores de pantalla (`aria-hidden` + clase de ocultamiento)
más marca de tiempo como mejora progresiva. El envío **debe funcionar sin JS**: la marca de tiempo
nunca es condición de aceptación del envío.

**R7.7 [M]** Tras un envío exitoso el usuario aterriza en `/contacto/gracias`, página estática con
confirmación y accesos a WhatsApp y a productos. En error, el proveedor devuelve al formulario y se
muestra un mensaje de contacto alternativo (mail y WhatsApp visibles).

**R7.8 [M]** El formulario nunca es la única vía de contacto: mail, teléfono y WhatsApp están siempre
visibles junto a él.

**R7.9 [D]** El enlace de fallback de PDF (CAP-10) puede llegar a `/contacto#formulario` con el
producto preseleccionado en el mensaje; sin JS, aterriza igual en el formulario vacío.

### Criterios de aceptación
- Con JS desactivado, un envío real llega a la casilla configurada y el usuario ve la confirmación.
- El formulario no se puede enviar con campos obligatorios vacíos (validación HTML5 nativa).
- Ningún dato de contacto de la página difiere de `ficha-empresa.md`.
- No existe ninguna llamada a red distinta del `POST` del formulario y el iframe del mapa.

### Casos borde
- **EB7.1** Sin conexión o proveedor caído: el usuario ve mail y WhatsApp en el mismo bloque, sin
  pantalla en blanco.
- **EB7.2** Un bot que completa el honeypot recibe la página de gracias, pero el proveedor descarta el
  envío; no se muestra error al usuario legítimo.
- **EB7.3** El mapa no se carga (bloqueador de terceros): el enlace "Ver en Google Maps" sigue
  disponible y el layout no colapsa.
- **EB7.4** Aviso por WhatsApp a ventas: se configura en el proveedor, no se implementa como código.
  Si no se contrata, el requisito mínimo (mail en la casilla) sigue cumplido.

---

## CAP-8 · SEO, accesibilidad y comportamiento sin JS

### Propósito
Que el sitio sea encontrable, legible por lectores de pantalla y completamente navegable sin
JavaScript, sin coste de performance.

### Requisitos

**R8.1 [M]** Cada página define `<title>` propio (≤60 caracteres, patrón `{Sección} | RECUPERAR
S.R.L.`) y meta description propia (120–160 caracteres). Nunca quedan vacíos: hay fallback desde el
contenido `site`.

**R8.2 [M]** Cada página declara `canonical` absoluto a partir de `Astro.site`, `lang="es-AR"`,
`og:title`, `og:description`, `og:type` y `og:image` (imagen de marca por defecto).

**R8.3 [M]** Se emite JSON-LD `Organization` una sola vez por página, con `name`, `url`, `logo`,
`sameAs` (los cuatro perfiles), `address` (oficina Córdoba) y `telephone`. Sin datos inventados.

**R8.4 [M]** El build genera `sitemap.xml` con las rutas estáticas y dinámicas, y `robots.txt` que
referencia el sitemap. `/404` y `/contacto/gracias` quedan fuera de la indexación (`noindex`).

**R8.5 [M]** Toda imagen tiene `alt`: descriptivo si aporta información (foto de producto, cultivo),
`alt=""` explícito si es decorativa. Ninguna imagen de contenido queda sin atributo.

**R8.6 [M]** Jerarquía de encabezados: exactamente un `<h1>` por página, sin saltos de nivel. Los
títulos de sección usan `<h2>` y los de tarjeta `<h3>`.

**R8.7 [M]** Contraste AA verificado: texto normal ≥4.5:1, texto grande ≥3:1. El ámbar
`--accent-fill` **no** se usa como color de texto sobre blanco, y el texto sobre ámbar es oscuro
(`--text`), nunca blanco.

**R8.8 [M]** Foco visible en todos los interactivos: `:focus-visible` con outline de 2px y offset 2px
usando `--focus-ring`. Nunca `outline: none` sin reemplazo.

**R8.9 [M]** Sin JS funcionan: navegación completa, dropdowns (hover/focus), menú móvil, formulario,
mapas (enlace alternativo), descargas y anclas internas. El JS de autor total del sitio es ≤2 KB
inline; el objetivo real es 0 KB.

**R8.10 [M]** HTML semántico: `header`, `nav`, `main`, `section` con `aria-labelledby` cuando
corresponde, `footer`, listas reales para grillas de navegación.

**R8.11 [M]** `/404` tiene H1, mensaje y enlaces a Inicio, Productos y Contacto.

**R8.12 [D]** Lighthouse móvil: Performance ≥90, Accesibilidad ≥95, SEO ≥95.

### Criterios de aceptación
- Un análisis con el JS desactivado recorre las 10 rutas sin callejones sin salida.
- `sitemap.xml` contiene todas las rutas públicas y ninguna prohibida.
- Auditoría de contraste sin fallos AA en texto y en controles.
- Navegación completa por teclado de header, menú móvil y formulario, con foco siempre visible.
- `<title>` único por página en todo el sitio.

### Casos borde
- **EB8.1** Página sin descripción propia: se usa la descripción institucional por defecto, nunca
  `<meta name="description" content="">`.
- **EB8.2** Imagen cuyo `alt` describiría lo mismo que el texto adyacente: se marca decorativa
  (`alt=""`) para no duplicar la lectura.
- **EB8.3** Enlace externo (redes, WhatsApp, Maps): `rel="noopener"` y, si abre pestaña, aviso en el
  texto del enlace o `aria-label`.

---

## CAP-9 · Modelo de contenido y taxonomía dual

### Propósito
Que el contenido viva en archivos tipados versionados y que agregar un producto o un cultivo sea una
operación de datos, no de diseño.

### Requisitos

**R9.1 [M]** Existen tres colecciones: `products` (16 entradas), `crops` (9 entradas) y `site`
(bloques institucionales). Los schemas se validan en build con TypeScript estricto.

**R9.2 [M]** `products.linea` es un enum cerrado con los cinco valores reales. Un valor fuera del enum
rompe el build con mensaje claro.

**R9.3 [M]** `products.cultivos` es un array de referencias a `crops`. Es la **única** fuente de la
relación producto–cultivo; no existe lista inversa duplicada.

**R9.4 [M]** `tipoCultivo` no se almacena: se deriva de los cultivos referenciados. Un producto puede
ser extensivo, intensivo o ambos; la derivación devuelve el conjunto, nunca un valor único forzado.

**R9.5 [M]** `crops.tipo` es un enum de dos valores (`extensivo`, `intensivo`). El listado por tipo y
la página de cultivo se derivan de ese campo.

**R9.6 [M]** Los textos institucionales (home, empresa, qué hacemos, contacto) viven en `site` y las
páginas los consumen; los `.astro` no contienen copy de negocio hardcodeado (solo etiquetas de UI).

**R9.7 [M]** Los slugs son kebab-case en inglés, estables y únicos, derivados del nombre de archivo.
Cambiar un slug requiere un commit explícito de contenido.

**R9.8 [M]** Ningún campo de composición o presentación se publica sin respaldo en
`contenido-relevado.md` o en la ficha PDF correspondiente; los datos inconsistentes conocidos se
normalizan antes de cargar ("Full Sulgomag" → Full Sulfomag, "M0 12 %" → "Mo 12 %", "Súper Fértil"
con acento).

**R9.9 [M]** El contenido se carga mediante archivos `.md` con frontmatter tipado y cuerpo en
Markdown opcional para descripciones largas.

### Criterios de aceptación
- `npm run check` valida las tres colecciones sin errores ni warnings de schema.
- Agregar un producto nuevo requiere exactamente un archivo y un build; no se toca ningún `.astro`.
- El enum de líneas coincide 1:1 con las carpetas de `productos/` en el repo.
- La suma de productos por línea es 5 / 1 / 4 / 2 / 4.

### Casos borde
- **EB9.1** Producto con `cultivos: []`: válido; aparece por línea y se omite en el camino por
  cultivo.
- **EB9.2** Dos productos con el mismo `nombre`: el build advierte; los slugs siguen siendo distintos
  y las rutas no colisionan.
- **EB9.3** Referencia a un cultivo inexistente: error de validación en build, no enlace roto en
  producción.
- **EB9.4** Archivo con frontmatter incompleto: el build falla indicando archivo y campo, sin generar
  HTML parcial.

---

## CAP-10 · Fallback de descargas (producto sin PDF)

### Propósito
Que la ausencia de una ficha técnica —situación real y recurrente— sea un estado de diseño previsto y
no un enlace roto.

### Requisitos

**R10.1 [M]** Cada slot de descarga de una ficha de producto (ficha técnica, manual de uso) resuelve a
uno de dos estados: **descarga disponible** o **solicitud desde contacto**. Nunca un tercer estado
(enlace vacío, 404, botón deshabilitado sin explicación).

**R10.2 [M]** Estado "disponible": botón/enlace con el tipo de documento y su peso, atributo
`download`, `rel="noopener"` si abre pestaña.

**R10.3 [M]** Estado "solicitud": bloque con el texto "Ficha técnica en preparación — solicitarla
desde Contacto", un enlace a `/contacto#formulario` y el nombre del producto en el mensaje cuando hay
JS. Sin JS, el enlace lleva al formulario y el usuario escribe el producto.

**R10.4 [M]** La decisión entre estados es automática: el build verifica la existencia del archivo
declarado; si no existe, renderiza el fallback y emite una advertencia. No se decide a mano por
producto.

**R10.5 [M]** El fallback es visualmente equivalente en jerarquía al estado disponible: la ficha no se
ve "incompleta" ni rota.

**R10.6 [M]** Si la ficha no tiene **ningún** PDF, la ficha sigue siendo publicable y completa en el
resto del contenido.

**R10.7 [D]** Un PDF puede declararse como enlace externo (Drive u otro) cuando el cliente lo decida;
en ese caso se marca como externo y no se audita su peso.

### Criterios de aceptación
- Las 16 fichas renderizan sin enlaces rotos, incluidas las que no tienen PDF (Fertical, Ferti
  Pasturas) y las que tienen solo ficha (Microar, Canpholiar, Nitro Value).
- Todo producto con PDF real lo descarga desde su ficha y desde `/manuales`.
- Un archivo declarado y ausente no aparece nunca como enlace público.

### Casos borde
- **EB10.1** PDF declarado con nombre incorrecto: el build advierte con el path exacto y la ficha
  muestra el fallback; nada se rompe.
- **EB10.2** PDF de más de 500 KB: se sirve igual, con advertencia de presupuesto en el log de build.
- **EB10.3** Producto donde existe manual pero no ficha técnica: cada slot resuelve su estado de forma
  independiente.

---

## Matriz de trazabilidad

| Capacidad | Rutas | Fase (proposal §8) |
|---|---|---|
| CAP-1 Shell | todas | 1 |
| CAP-2 Home | `/` | 1 y 3 |
| CAP-3 Institucional | `/la-empresa`, `/que-hacemos` | 3 |
| CAP-4 Catálogo por línea | `/productos`, `/productos/[slug]` | 4 |
| CAP-5 Catálogo por cultivo | `/cultivos/*` | 4 |
| CAP-6 Manuales | `/manuales` | 4 |
| CAP-7 Contacto | `/contacto`, `/contacto/gracias` | 5 |
| CAP-8 SEO / a11y / no-JS | todas | 1, 5 y 6 |
| CAP-9 Modelo de contenido | — (build) | 2 |
| CAP-10 Fallback de PDF | `/productos/[slug]`, `/manuales` | 4 |

## Fuera de alcance (recordatorio)

Blog, e-commerce, precios, pagos, carrito, login, área de clientes, newsletter, multi-idioma, chat,
sliders con autoplay, video de fondo, scroll-reveal, contadores animados, backend propio, SSR,
endpoints, base de datos, Wix Editor/Velo/Wix Studio y migración 301 (fase 7 del backlog).
