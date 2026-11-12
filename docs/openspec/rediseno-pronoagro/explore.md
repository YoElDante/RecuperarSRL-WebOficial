# Exploración — Rediseño web RECUPERAR (referencia PronoAgro)

> Fase SDD: explore. Cambio: `rediseno-pronoagro`. Fecha: 2026-11-11.
> Fuente: análisis de `inspiraciones/` (PronoAgro, Fertinagro, Recuperar actual) + docs del repo.

## 1. Referencia principal: PronoAgro

Sitio de una sola página, HTML plano + un `<style>` inline + FontAwesome + Roboto. Sin framework.
Portable a Astro de forma mecánica: `:root` → tokens, cada `<section>` → componente.

### Orden de secciones del home
1. Hero parallax estático (85vh, overlay, H1 900, 1 CTA "VER SOLUCIONES", indicador de scroll).
2. Grid 4 cards de soluciones.
3. Franja de logos de marcas representadas (8).
4. Banda parallax 1/3 texto + 2/3 imagen (Nutrición Animal).
5. CTA band gradiente + WhatsApp.
6. 3 cards de servicios con ícono.
7. CTA band gradiente + WhatsApp.
8. Banda parallax empresa + bloque social.
9. Contacto 1/3 info + 2/3 formulario (select "Área a Consultar").
10. Footer 5 columnas oscuro.
11. Flotantes: WhatsApp + back-to-top.

### Sistema de diseño extraído
- Verdes: `#335C3D` (header/bandas), `#203b27` (dropdowns/títulos), logo real `#005C38`.
- Acento ámbar: `#E2A41A` (botones primarios, bordes top, kickers). Hover `#d19513`.
- Neutros: bg `#f7f9f7`, surface `#fff`, border `#e1e8e1`, text `#222a24`, muted `#5e6b60`,
  surface-alt `#f0f4f0`, footer `#2b2826`, footer text `#b8b0ac`.
- Tipografía: Roboto (300/400/500/700/900). Titulares 900 uppercase, `line-height:1.2`.
- Radio: **4px en TODO**. Sombras: 3 niveles. Transición: `all .25s ease-in-out`.
- Grid: 12 cols, container 1240px, header sticky 92px.
- Breakpoints reales: solo 640 y 992 (debilidad: saltar 1→4 columnas en cards).
- Firma visual: `.feature-card` con `border-top: 4px solid #E2A41A`; CTA anclado al pie.
- `.section-title-group`: `border-left: 4px solid` + padding-left 1rem.
- Animaciones: mínimas (pivotMouse, hover lift, subrayado nav, acordeón mobile). Sin scroll-reveal.

### Reutilizable (patrón, no contenido)
Header sticky verde de una fila + dropdowns con borde ámbar · hero estático tipográfico ·
section title con barra izquierda · cards con borde superior de acento · banda parallax 1/3-2/3 ·
CTA band gradiente + WhatsApp · form 1/3 info + 2/3 · footer 5 columnas · flotantes · tokens planos.

### NO trasladar (específico de PronoAgro)
Marcas representadas (es distribuidor; Recuperar fabrica) · comercio de granos/logística/comex ·
Nutrición Animal + `#964529` · Xarvio · portal de clientes · "30 años" (Recuperar fundó 2000) ·
form `/action.php` · SENASA 8874/A/E (dato ajeno).

## 2. Comparación con las otras referencias

- **Fertinagro**: aporta solo el **top bar fino** de contactos (teléfonos de venta por zona) y el
  patrón "kicker + titular". Su hero con video y sus stats con CountUp no entran (presupuesto 20MB).
- **Recuperar actual (Wix)**: aporta **todo el contenido** (textos institucionales, 4 "PRIMERA",
  I+D, ácidos fúlvicos, recomendaciones por cultivo) y su verde real `#007B3C`. No tiene hero,
  ni sistema visual, ni fotografía institucional. PDFs 4× más pesados de lo admisible.

## 3. Mapa de contenido y material real

| Página | Texto | Imágenes | Estado |
|---|---|---|---|
| `/` Home | ✅ (web actual) | ❌ sin hero | Falta foto hero |
| `/la-empresa` | ✅ | ❌ | Texto listo, imagen falta |
| `/que-hacemos` | ✅ | ❌ | Texto listo, imagen falta |
| `/productos` | ✅ 5 líneas / 16 productos | ✅ 16 bolsas | Casi listo |
| `/productos/[slug]` | ✅ 14 de 16 (faltan Microar, Ferti Pasturas, Nitro Value, MicroCanphos 2020) | ✅ bolsas + tablas | Datos parciales |
| `/cultivos/extensivos` | ✅ 6 cultivos | ⚠️ fotos <501px | Texto listo, imagen baja |
| `/cultivos/intensivos` | ✅ 3 entradas | ⚠️ fotos <501px | Texto listo, imagen baja |
| `/manuales` | ✅ 19 PDFs (87 MB) | — | Compresión obligatoria |
| `/contacto` | ✅ (ficha-empresa) | ⚠️ sin coords de plantas | Datos listos |

### Inventario de productos (5 líneas / 16 productos, `productos/`, gitignored)
Arrancadores: Microar, MicroCanphos, MicroCanphos 2020, MicroCanphos Soja, Microfusión.
Bioestimulantes: Canpholiar. Correctores: Fertical, Fertical+MgO, Full Sulfomag, Yag.
Jardinería: Green Up, Súper Fértil. Mejoradores: Canphos, Ferti Pasturas, N30, Nitro Value.

### Inventario de assets (crudo)
- 62 imágenes = 65,7 MB. 19 PDFs = 87 MB (Canpholiar 44,3 MB; MicroAR 12,6 MB).
- Fotos de cultivo: 9 archivos, todos <501px de ancho (sirven para cards, no para hero).
- Logo solo PNG 212×78 (sin SVG).

## 4. Tokens propuestos (identidad Recuperar + estructura PronoAgro)

```css
:root {
  /* Verde de marca muestreado del logo de Recuperar */
  --brand-50:#EEF6F1; --brand-100:#D6E9DD; --brand-200:#A9D3B9;
  --brand-500:#007B3C; --brand-600:#006B34; --brand-700:#00542A; --brand-900:#0A2E1B;
  /* Acento ámbar (de PronoAgro), separado relleno vs texto por contraste */
  --accent-fill:#E2A41A; --accent-text:#9A6E06; --accent-hover:#C98F12;
  /* Neutros */
  --bg:#F7F9F7; --surface:#FFFFFF; --surface-alt:#F0F4F0; --border:#E1E8E1;
  --text:#1A211C; --text-muted:#5E6B60; --text-on-dark:#D8E5DB;
  --whatsapp:#25D366; --danger:#C0392B; --focus-ring:rgba(0,123,60,.28);
}
```

- Tipografía recomendada: **Barlow** (display/UI) + **Inter** (cuerpo, cifras tabulares),
  auto-hospedadas con `@fontsource`. Alternativa fiel: Roboto sola.
- Escala: hero `clamp(2.25rem,6vw,3.75rem)/800`, h2 `clamp(1.75rem,3vw,2.5rem)/800`,
  body 1rem, eyebrow `.75rem/700 uppercase`.
- Espaciado: escala 4→96px. Radios 4px (no pill). Sombras 3 niveles. Ease `cubic-bezier(.2,.7,.3,1)` 220ms.
- Breakpoints: 480 / 768 / 1024 / 1280 (mejora sobre los dos de PronoAgro).

## 5. Componentes Astro (inventario)

`BaseLayout` (SEO + JSON-LD) · `TopBar` (3 teléfonos de venta + mail + redes) · `SiteHeader`
(sticky verde, dropdowns Productos/Cultivos, CTA Contacto) · `MobileNav` · `Hero` · `SectionTitle`
· `CardGrid`+`LineCard` · `ProductCard` · `CropCard` · `FeatureList` · `MediaBand` · `CTABand` ·
`StatsStrip` · `DifferentialStrip` (reemplaza logos de marcas) · `SpecTable` · `PresentationGallery`
· `PdfDownload` (con fallback "Solicitar desde Contacto") · `ProductFilter` (2 rutas estáticas,
cero JS) · `ContactForm` (honeypot + timestamp) · `ContactInfoCard` · `PlantsMap` (iframe lazy) ·
`SiteFooter` · `FloatingWhatsApp` + `BackToTop`.

## 6. Riesgos y gaps

1. **PDFs 87 MB → espec 20 MB.** Recomprimir a ≤300-500 KB c/u. Manuales opcionales: decidir
   cliente (Drive externo o omitir).
2. **Imágenes crudas 65,7 MB.** Optimizar con `astro:assets` (avif/webp, q60). Objetivo ≤4 MB producto.
3. **Falta foto hero.** Mientras tanto: hero tipográfico sobre `--brand-900` (fiel a PronoAgro).
4. **Fotos de cultivo <501px.** Válidas para cards; pedir originales.
5. **Logo sin SVG.** Pedir vector.
6. **Formulario**: usar Formspree/Web3Forms (perfil-técnico), reutilizar honeypot de PronoAgro.
7. **No copiar de PronoAgro**: SENASA, teléfonos, "30 años", horarios, coordenadas.
8. **Deuda de datos**: Full Sulgomag vs Sulfomag, Súper Fértil vs Super Fertil, "M0 12%" → "Mo 12%".
