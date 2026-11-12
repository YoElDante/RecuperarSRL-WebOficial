/*
 * robots.txt — generated at build time so it always matches the deployment.
 *
 * Production (root deployment) invites crawlers and points at the sitemap.
 * A subpath build is the staging preview on GitHub Pages, so it disallows
 * everything to keep the demo out of search results.
 */
import type { APIRoute } from 'astro';
import { IS_SUBPATH_BUILD } from '../lib/urls';
import { absoluteUrl } from '../lib/seo';

export const GET: APIRoute = () => {
  const body = IS_SUBPATH_BUILD
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap-index.xml')}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
