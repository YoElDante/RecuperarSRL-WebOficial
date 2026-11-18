# Perfil estético — RECUPERAR S.R.L.

> Fuente de verdad del aspecto visual del sitio. Si un componente necesita un color, un
> tamaño de letra o un criterio de imagen, la respuesta está acá y en `src/styles/tokens.css`.
> La paleta no se inventó: sale del tema del sitio oficial actual y del logo de la empresa.

---

## 1. De dónde sale la paleta

El sitio oficial (Wix) declara su paleta como variables `--color_NN` en el HTML de la portada:
66 posiciones, 25 colores distintos. Eso es el sistema declarado por la empresa, no una
impresión de pantalla.

Contraste con el logo: los píxeles opacos de `public/logo.webp` miden **#107A4B**; el tema
declara **#0F7945**. Es el mismo verde con un punto de diferencia en el canal verde, así que
se adopta el hex del tema. El `#007E49` que aparece repetido en el HTML es la aproximación
que dejó el editor de Wix en algunos bloques; no se usa.

---

## 2. Paleta oficial

| Rol | Hex | Slot del tema | Uso |
|---|---|---|---|
| Verde marca | `#0F7945` | 2, 18 | color principal: header, botones, títulos sobre claro |
| Verde oscuro | `#0A512E` | 19 | bandas oscuras, degradados |
| Verde profundo | `#052817` | 20 | footer, velos, sombras |
| Lima | `#A5C044` | 5, 32 | acento de relleno: eyebrows, bordes superiores, kicker |
| Oliva | `#536121` | 34 | acento de texto: numeración, detalles |
| Oliva oscuro | `#2A3110` | 35 | reservado, aún sin uso |
| Marfil | `#FBFBEC` | 4, 27 | fondo de página |
| Blanco cálido | `#FCFCFB` | 0, 6, 11 | superficies, tarjetas, texto de botón |
| Blanco hueso | `#FDFDF5` | 26 | superficies alternas |
| Negro de texto | `#161616` | 3, 25 | texto principal |
| Gris grafito | `#3F3F3F` | 9, 14 | texto secundario |
| Gris medio | `#7E7E7E` | 8, 13 | metadatos, deshabilitados |
| Gris claro | `#BDBDBD` | 7, 12 | líneas sobre fondo oscuro |
| Menta | `#90F1C2` | 16 | sin uso en el sitio nuevo |
| Verde brillante | `#21E384` | 17 | sin uso en el sitio nuevo |

La rampa lima/oliva completa del tema es `#E6E687`, `#C9C92A`, `#D2E0A2`, `#7D9231`,
`#656515`. No hace falta usarla entera: el sitio se queda con el relleno (`#A5C044`), el
hover (`#7D9231`) y el texto (`#536121`).

**El ámbar anterior (`#E2A41A`) no es de la empresa.** Venía de un sitio de referencia. Se
retiró por completo.

---

## 3. Roles en el sitio nuevo

Los tokens viven en `src/styles/tokens.css` y ningún componente puede escribir un hex.

| Token | Valor | Origen |
|---|---|---|
| `--brand-50` | `#E8F1DF` | derivado: 8 % de verde sobre marfil |
| `--brand-100` | `#D1E4CE` | derivado: 18 % |
| `--brand-200` | `#B9D7BD` | derivado: 28 % |
| `--brand-500` | `#0F7945` | oficial |
| `--brand-600` | `#0C6339` | derivado: 18 % más oscuro, para hover y header |
| `--brand-700` | `#0A512E` | oficial |
| `--brand-900` | `#052817` | oficial |
| `--accent-fill` | `#A5C044` | oficial |
| `--accent-hover` | `#7D9231` | oficial |
| `--accent-text` | `#536121` | oficial |
| `--bg` | `#FBFBEC` | oficial |
| `--surface` | `#FFFFFF` | blanco puro para tarjetas |
| `--surface-alt` | `#FDFDF5` | oficial |
| `--border` | `#E3E3D2` | derivado: un paso por debajo del marfil |
| `--text` | `#161616` | oficial |
| `--text-muted` | `#3F3F3F` | oficial |
| `--text-on-dark` | `#D7E2DA` | derivado del marfil, para párrafos sobre verde |

`--brand-600` es el único verde que no está en el tema: el oficial sobre blanco da 5.47:1 y
alcanza, pero el header necesita margen para el hover y el texto chico de navegación. Se
obtiene oscureciendo el verde oficial un 18 %, sin cambiar el tono.

---

## 4. Contraste medido (WCAG 2.1)

| Combinación | Ratio | Veredicto |
|---|---|---|
| Blanco sobre `#0F7945` | 5.47:1 | AA texto normal |
| Blanco sobre `#0C6339` | 7.34:1 | AAA |
| `#161616` sobre lima `#A5C044` | 8.81:1 | AAA |
| `#161616` sobre lima hover `#7D9231` | 5.19:1 | AA |
| Oliva `#536121` sobre marfil | 6.49:1 | AA |
| `#161616` sobre marfil | 17.33:1 | AAA |
| `#3F3F3F` sobre marfil | 10.09:1 | AAA |
| `#D7E2DA` sobre verde profundo | 11.93:1 | AAA |
| Blanco sobre verde profundo | 15.88:1 | AAA |
| Logo verde sobre placa blanca | 5.37:1 | AA |
| Logo verde sobre el verde del header | **1.02:1** | **Falla** |

De ahí dos reglas que no se negocian:

1. **El logo verde nunca va directo sobre el verde del header**: siempre sobre placa blanca.
2. **En el hero, el logo va en su versión blanca** (`src/assets/logos/logo-blanco.webp`),
   derivada del original conservando el canal alfa. Se genera con
   `node scripts/make-white-logo.mjs`.

El gris `#7E7E7E` del tema, sobre marfil, da 3.89:1: sirve para texto grande, no para
párrafos. Por eso el texto secundario usa `#3F3F3F`.

---

## 5. Tipografía

**Lo que usa la empresa hoy**, según las variables de fuente del tema:

| Nivel | Fuente | Tamaño / interlínea |
|---|---|---|
| H1 (hero) | Brandon Grotesque Light | 88 px / 1.2 |
| H2 | Brandon Grotesque Light | 72 px / 1.25 |
| H3 | Brandon Grotesque Light | 50 px / 1.34 |
| H4 | Brandon Grotesque Light | 40 px / 1.35 |
| Cuerpo grande | Avenir LT 35 Light | 20 px / 1.67 |
| Cuerpo | Avenir LT 35 Light | 18 px / 1.75 |
| Cuerpo chico | Avenir LT 35 Light | 15 px / 1.875 |
| Micro | Avenir LT 35 Light | 14 px / 1.79 |

Traducción al sitio nuevo: **Brandon Grotesque para títulos, Avenir para texto** es el par
oficial, y las dos son tipografías comerciales (HVD Fonts y Linotype). Mientras no haya
licencia, el sitio usa **Barlow** (display) e **Inter** (texto): la estructura —geométrica,
sin contraste, con títulos anchos— se respeta, el dibujo de las letras no es el original.

Candidatas libres a evaluar si se quiere acercar más: **Josefin Sans** o **Jost** para los
títulos (geometría y ojo chico, como Brandon) y **Nunito Sans** para el texto (humanista,
más cercana a Avenir que Inter). Es una decisión pendiente, no un cambio hecho.

---

## 6. Bordes, radios y sombras

- El sitio oficial es de **bordes rectos**: 21 declaraciones de `border-radius: 0` contra
  dos de `2px`. El sitio nuevo usa `--radius: 4px` como decisión propia, deliberada y
  menor: suaviza las tarjetas sin volverlas "app".
- Sombras: siempre teñidas de verde profundo (`rgba(5, 40, 23, …)`), nunca negro puro. El
  verde en la sombra es lo que hace que una tarjeta se apoye sobre el marfil y no quede
  pegada como un recorte.
- Sin bordes dobles ni contornos de color: la jerarquía se arma con fondo, borde superior de
  4 px y tipografía.

---

## 7. Imágenes

- **Las bolsas van recortadas, con transparencia.** Un recorte con fondo horneado rompe la
  grilla del catálogo: se ve la caja del archivo, no la bolsa.
- Origen: las fotos originales viven en `productos/` (fuera del repo, 1 a 3 MB cada una).
  El pipeline `node scripts/convert-images.mjs` las pasa a WebP **calidad 90**, alfa sin
  pérdida y ancho máximo de 700 px, que es más de lo que la página puede mostrar.
- Fotos de cultivo y posters: mismo tratamiento (WebP 90), en `src/assets/crops` e
  `src/assets/img`. El AVIF se conserva cuando ya es más liviano que el WebP.
- Fotografía de la empresa: planta, cantera, personal con casco, camiones. **Nada de banco
  de imágenes**: el activo visual de esta empresa es que las fotos son de su planta.
- Los velos sobre video o foto se hacen con el verde profundo en degradé, no con negro.

---

## 8. Tono visual

- Sobrio y técnico. La empresa "afirma con datos": el diseño no grita, acompaña.
- Verde como color de marca y estructura; lima como acento puntual, nunca como fondo de
  bloques grandes de texto.
- Marfil en lugar de blanco puro para el fondo: baja el brillo de pantalla y separa las
  tarjetas blancas.
- Nada de degradados multicolor, sombras azuladas, vidrio esmerilado ni animaciones
  decorativas.

---

## 9. Cómo se mantiene

1. Todo color nuevo entra primero en `src/styles/tokens.css` y después en este documento.
2. Si un color no está en la tabla de la sección 2 o 3, no es de la marca: hay que
   justificarlo acá antes de usarlo.
3. Antes de tocar un par texto/fondo, se mide el contraste. Las reglas de la sección 4 son
   el piso, no una sugerencia.
