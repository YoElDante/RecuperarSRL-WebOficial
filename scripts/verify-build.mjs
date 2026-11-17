/*
 * verify-build.mjs — post-build QA gate (also runs in CI).
 *
 * Checks the things that break silently in a static site:
 *  1. every internal href/src respects the configured base (Pages subpath);
 *  2. every page has a title and a meta description;
 *  3. no page repeats an id (invalid HTML, breaks anchors and a11y);
 *  4. the whole dist/ stays inside the hosting budget.
 *
 * Usage: node scripts/verify-build.mjs [base]
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

// Base path the build was produced with ('/' locally, '/<repo>' on Pages).
const base = process.argv[2] ?? '/';
const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
const dist = path.resolve('dist');

/* Hosting budget. The original 20 MB gate came from the Wix Headless drop
   ceiling; the premium plan gives 50 GB of media, so the budget now guards
   against accidental bloat rather than a platform limit. The technical film
   alone is ~45 MB, so the default has to accommodate it. */
const BUDGET_MB = Number(process.env.BUDGET_MB ?? 120);
const BUDGET_BYTES = BUDGET_MB * 1024 * 1024;

const problems = [];

// Recursively collect every file under dist/.
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const label = path.relative(dist, file);

  // 1. Internal references must carry the deployment base.
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (prefix && !ref.startsWith(`${prefix}/`) && ref !== prefix) {
      problems.push(`${label}: internal URL without base -> ${ref}`);
    }
  }

  // 2. Indexable pages need a title and a description.
  const isUtilityPage = label === '404.html' || label.includes('gracias');
  if (!isUtilityPage) {
    if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${label}: missing <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(html)) {
      problems.push(`${label}: missing meta description`);
    }
  }

  // 3. Duplicate ids break in-page anchors.
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) problems.push(`${label}: duplicated id "${id}"`);
    seen.add(id);
  }
}

// 4. Hosting budget (guards against accidental bloat; see BUDGET_MB above).
let total = 0;
for (const file of files) total += (await stat(file)).size;
if (total > BUDGET_BYTES) {
  problems.push(`dist is ${(total / 1024 / 1024).toFixed(2)} MB, over the ${BUDGET_MB} MB budget`);
}

// 5. Critical routes must exist. A route directory can vanish from the build
// without failing anything (e.g. excluded by a .gitignore pattern in CI), so the
// deploy is gated on the routes the site cannot live without.
const REQUIRED_ROUTES = [
  'index.html',
  '404.html',
  'productos/index.html',
  'cultivos/extensivos/index.html',
  'cultivos/intensivos/index.html',
  'la-empresa/index.html',
  'que-hacemos/index.html',
  'manuales/index.html',
  'contacto/index.html',
];
for (const route of REQUIRED_ROUTES) {
  if (!files.includes(path.join(dist, ...route.split('/')))) {
    problems.push(`missing required route: ${route}`);
  }
}

// 6. Every product page must be built: one index + one page per product.
const productPages = htmlFiles.filter((file) =>
  path.relative(dist, file).replace(/\\/g, '/').startsWith('productos/'),
);
if (productPages.length < 17) {
  problems.push(
    `only ${productPages.length} product pages built, expected at least 17 (index + 16 products)`,
  );
}

console.log(`Checked ${htmlFiles.length} HTML files, ${files.length} files total.`);
console.log(`dist size: ${(total / 1024 / 1024).toFixed(2)} MB / ${BUDGET_MB} MB`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(` - ${problem}`);
  process.exit(1);
}

console.log('Build verification passed.');
