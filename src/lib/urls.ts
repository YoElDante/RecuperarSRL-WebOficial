/*
 * URL helper — the single place that knows about the deployment subpath.
 *
 * GitHub Pages serves project sites under /<repo>/, so every internal link and
 * asset path must be prefixed with Astro's configured `base`. Instead of
 * scattering string concatenation across components, everything that emits an
 * internal URL calls `url()`.
 *
 * `import.meta.env.BASE_URL` is '/' in local dev and in a root deployment, and
 * '/RecuperarSRL-WebOficial/' on the Pages preview, so the same code works in
 * both without conditionals at the call site.
 */

/* Astro's base, always with a trailing slash ('/' or '/repo/'). */
export const BASE = import.meta.env.BASE_URL;

/* True when the build is served from a subpath (i.e. the Pages preview). */
export const IS_SUBPATH_BUILD = BASE !== '/';

/* Prefix an internal path with the base; leave external URLs and anchors alone. */
export function url(path: string): string {
  if (!path.startsWith('/')) return path;
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  return `${base}${path}`;
}
