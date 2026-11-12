// Astro configuration — static institutional site for RECUPERAR S.R.L.
// Deployed as plain HTML/CSS; no server runtime is ever required.
//
// Two deployment targets share one codebase:
//  - production (default): custom domain at the root of the site;
//  - GitHub Pages preview (PAGES=true): project site served from /<repo>/,
//    which needs `base` so links and assets resolve.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The preview build is flagged by the deploy workflow, never by local dev.
const isPagesPreview = process.env.PAGES === 'true';

export default defineConfig({
  // Canonical origin: production domain, or the Pages host for the preview.
  site: isPagesPreview ? 'https://yoeldante.github.io' : 'https://www.recuperarsrl.com.ar',
  // Root deployment in production; repository subpath on GitHub Pages.
  base: isPagesPreview ? '/RecuperarSRL-WebOficial' : '/',
  // Static output: pages are rendered at build time and frozen into dist/.
  output: 'static',
  // Keep utility routes (404, post-submit confirmation) out of the sitemap.
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/contacto/gracias'),
    }),
  ],
  build: {
    // Inline tiny stylesheets to cut request count on a small marketing site.
    inlineStylesheets: 'auto',
  },
});
