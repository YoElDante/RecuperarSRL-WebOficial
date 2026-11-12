/*
 * convert-product-images.mjs — one-off / repeatable asset pipeline step.
 *
 * Converts the raw product photos in `src/assets/products` from PNG to alpha
 * WebP, capped at 1200px wide, so no binary in the repository exceeds ~1 MB
 * (see AGENTS.md, hard constraints) and the build stays inside the 20 MB budget.
 *
 * Usage: node scripts/convert-product-images.mjs [dir]
 * The PNG source is deleted after a successful conversion; re-run it whenever
 * new material lands in `productos/`.
 */
import { readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Target directory defaults to the product asset folder.
const dir = path.resolve(process.argv[2] ?? 'src/assets/products');
// Longest edge we ever render a product bag at is ~420px; 1200 keeps retina headroom.
const MAX_WIDTH = 1200;

const files = (await readdir(dir)).filter((file) => /\.png$/i.test(file));

for (const file of files) {
  const source = path.join(dir, file);
  const target = path.join(dir, file.replace(/\.png$/i, '.webp'));

  // Resize without upscaling, then encode with full alpha quality.
  const buffer = await sharp(source)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toBuffer();

  const originalSize = (await stat(source)).size;
  await writeFile(target, buffer);
  await unlink(source);

  const before = (originalSize / 1024).toFixed(0);
  const after = (buffer.length / 1024).toFixed(0);
  console.log(`${file} -> ${path.basename(target)}  ${before} KB -> ${after} KB`);
}

console.log(`Done. ${files.length} file(s) converted in ${dir}`);
