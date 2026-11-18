/*
 * convert-images.mjs — turns the client's raw images into the WebP the site ships.
 *
 * The raw material lives outside the repository: `productos/` is gitignored
 * (original photos, 1–3 MB each) and `src/assets/` only holds the versioned
 * result. This script is the bridge, so it is the only place that knows which
 * original photo belongs to which product slug.
 *
 * Rules:
 *  - WebP at quality 90, with the alpha channel kept lossless: the bags are
 *    cutouts and their edges are what show against the card background.
 *  - Longest edge capped, because nothing is rendered wider than ~600 px.
 *  - A product photo without transparency is reported: a bag cutout with a
 *    baked background breaks the catalog grid.
 *
 * Usage: node scripts/convert-images.mjs [products|crops|img|all]
 */
import { readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const QUALITY = 90;
/* The catalog renders bags at 600 px max (see ProductCard srcset), so a 700 px
   source is all the quality the page can show: at q90 a 1000 px bag weighs
   three times more than the 700 px version and looks the same. */
const MAX_WIDTH = 700;

/* Product slug -> original photo, relative to the `productos/` inbox. */
const PRODUCTOS = {
  microar: 'Arrancadores y Fertilizantes/MICROAR/Bolsa de Fertilizante Micro AR.webp',
  microcanphos: 'Arrancadores y Fertilizantes/MICROCANPHOS/Microcanphos bolsa de frente (sin fondo).png',
  'microcanphos-2020':
    'Arrancadores y Fertilizantes/MICROCANPHOS 2020/Microcanphos 2020 bolsa de frente (sin fondo).png',
  'microcanphos-soja':
    'Arrancadores y Fertilizantes/MICROCANPHOS SOJA/Microcanphos bolsa de frente (sin fondo).png',
  microfusion: 'Arrancadores y Fertilizantes/MICROFUSION/Microfusión bolsa frente ( sin fondo).png',
  canpholiar: 'BioEstimulantes/CANPHOLIAR/CANPHOLIAR (SIN FONDO).png',
  fertical: 'Correctores de Suelo/FERTICAL/BOLSA FERTICAL.PNG',
  'fertical-mgo': 'Correctores de Suelo/FERTICAL + MgO/Fertical + Mg bolsa de frente (sin fondo).png',
  'full-sulfomag': 'Correctores de Suelo/FULL SULGOMAG/Full Sulfomag bolsa de frente (sin fondo).png',
  yag: 'Correctores de Suelo/YAG/BOLSA YAG.PNG',
  canphos: 'Mejoradores de Eficiencia/CANPHOS/Bolsa canphos sin fondo.png',
  'ferti-pasturas': 'Mejoradores de Eficiencia/FERTI PASTURAS/Ferti Pasturas bolsa de frente (sin fondo).png',
  n30: 'Mejoradores de Eficiencia/N30/BOLSA N030.png',
  'nitro-value': 'Mejoradores de Eficiencia/NITRO VALUE/Nitro Value bolsa de frente (sin fondo).png',
};

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

/* Encode one file to WebP and report the weight change. */
async function convert(source, target) {
  const meta = await sharp(source).metadata();
  const buffer = await sharp(source)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, alphaQuality: 100, effort: 6 })
    .toBuffer();

  await writeFile(target, buffer);
  const before = (await stat(source)).size;
  const size = `${meta.width}x${meta.height}`;
  const alpha = meta.hasAlpha ? '' : '  [SIN ALPHA]';
  console.log(
    `${path.basename(target).padEnd(26)} ${kb(before).padStart(8)} -> ${kb(buffer.length).padStart(7)}  ${size}${alpha}`,
  );

  return { sinAlpha: !meta.hasAlpha };
}

/* Products: rebuild every bag from the original in `productos/`. */
async function products() {
  console.log('--- productos ---');
  let missing = 0;
  let flat = 0;

  for (const [slug, relative] of Object.entries(PRODUCTOS)) {
    const source = path.join('productos', relative);
    if (!(await stat(source).catch(() => null))) {
      console.log(`${slug.padEnd(26)} fuente no encontrada: ${relative}`);
      missing++;
      continue;
    }
    const result = await convert(source, `src/assets/products/${slug}.webp`);
    if (result.sinAlpha) flat++;
  }

  console.log(`faltantes: ${missing} | con fondo horneado: ${flat}`);
}

/* Crops and posters: same treatment, in place, dropping the JPEG original. */
async function inPlace(dir, extensions) {
  console.log(`--- ${dir} ---`);
  const files = (await readdir(dir)).filter((file) => extensions.test(file));

  for (const file of files) {
    const source = path.join(dir, file);
    await convert(source, source.replace(extensions, '.webp'));
    await unlink(source);
  }
}

const mode = process.argv[2] ?? 'all';

if (mode === 'products' || mode === 'all') await products();
if (mode === 'crops' || mode === 'all') await inPlace('src/assets/crops', /\.jpe?g$/i);
if (mode === 'img' || mode === 'all') await inPlace('src/assets/img', /\.jpe?g$/i);
