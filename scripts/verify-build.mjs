/*
 * verify-build.mjs — post-build QA gate (also runs in CI).
 *
 * Checks the things that break silently in a static site:
 *  1. every internal href/src respects the configured base (Pages subpath);
 *  2. every page has a title and a meta description;
 *  3. no page repeats an id (invalid HTML, breaks anchors and a11y);
 *  4. the whole dist/ stays inside the 20 MB hosting budget.
 *
 * Usage: node scripts/verify-build.mjs [base]
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

// Base path the build was produced with ('/' locally, '/<repo>' on Pages).
const base = process.argv[2] ?? '/';
const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
const dist = path.resolve('dist');
const BUDGET_BYTES = 20 * 1024 * 1024;

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

// 4. Hosting budget (Wix Headless upload limit).
let total = 0;
for (const file of files) total += (await stat(file)).size;
if (total > BUDGET_BYTES) {
  problems.push(`dist is ${(total / 1024 / 1024).toFixed(2)} MB, over the 20 MB budget`);
}

console.log(`Checked ${htmlFiles.length} HTML files, ${files.length} files total.`);
console.log(`dist size: ${(total / 1024 / 1024).toFixed(2)} MB / 20 MB`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(` - ${problem}`);
  process.exit(1);
}

console.log('Build verification passed.');
