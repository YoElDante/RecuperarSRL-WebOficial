/*
 * make-white-logo.mjs — derives the negative version of the wordmark.
 *
 * The company only supplied the green mark, and green on the green hero
 * measures 1.02:1, which is invisible. Instead of a white plate, the mark is
 * recoloured: the alpha channel is kept untouched (that is where the
 * antialiasing lives) and every opaque pixel becomes pure white, so the result
 * is the same drawing, not a traced approximation.
 *
 * Usage: node scripts/make-white-logo.mjs
 */
import sharp from 'sharp';

const SOURCE = 'src/assets/logos/LOGO RECUPERAR SD 680x274.webp';
const TARGET = 'src/assets/logos/logo-blanco.webp';

const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

/* Paint every pixel white and carry the original alpha over. */
for (let i = 0; i < data.length; i += info.channels) {
  data[i] = 255;
  data[i + 1] = 255;
  data[i + 2] = 255;
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .webp({ quality: 90, alphaQuality: 100, effort: 6 })
  .toFile(TARGET);

console.log(`${TARGET} — ${info.width}x${info.height}, alpha conservado`);
