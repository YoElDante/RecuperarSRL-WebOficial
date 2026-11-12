/*
 * build-pages.mjs — builds the GitHub Pages preview.
 *
 * GitHub Pages serves project sites from /<repo>/, so the build needs a base
 * path. Rather than exporting env vars by hand (which is not portable across
 * shells), this script sets PAGES=true and delegates to the normal build.
 */
import { spawnSync } from 'node:child_process';

// Signal read by astro.config.mjs to switch site/base to the Pages preview.
process.env.PAGES = 'true';

const result = spawnSync('npm run build', {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
