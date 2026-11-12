// Astro configuration — static institutional site for RECUPERAR S.R.L.
// Deployed as plain HTML/CSS to Wix Headless; no server runtime is ever required.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical production origin, used for sitemap, JSON-LD and absolute URLs.
  site: 'https://www.recuperarsrl.com.ar',
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
