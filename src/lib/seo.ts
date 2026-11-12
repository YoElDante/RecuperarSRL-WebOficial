/*
 * SEO helpers — page metadata and structured data.
 *
 * Every page builds a `Meta` object; BaseLayout renders it into <title>, meta
 * description, canonical and Open Graph tags. JSON-LD Organization is emitted
 * once per page from the official contact data.
 */
export const SITE_ORIGIN = 'https://www.recuperarsrl.com.ar';

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}

/* Build an absolute URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

/* Assemble page metadata with sensible defaults. */
export function buildMeta(input: {
  titulo: string;
  descripcion: string;
  canonical: string;
  noindex?: boolean;
}): Meta {
  return {
    title: input.titulo,
    description: input.descripcion,
    canonical: absoluteUrl(input.canonical),
    ogType: 'website',
    noindex: input.noindex ?? false,
  };
}

/* Minimal contact shape needed for Organization JSON-LD. */
export interface OrganizationContacto {
  mails: string[];
  telefonos: Array<{ zona: string; telefono: string }>;
  oficina: string;
  redes: Array<{ nombre: string; url: string }>;
}

/* Structured data describing the company, consumed by search engines. */
export function organizationJsonLd(contacto: OrganizationContacto) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RECUPERAR S.R.L.',
    url: SITE_ORIGIN,
    slogan: 'Soluciones eficientes para el máximo aprovechamiento de nutrientes',
    foundingDate: '2000',
    email: contacto.mails[0],
    telephone: contacto.telefonos[0]?.telefono,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacto.oficina,
      addressLocality: 'Córdoba',
      addressCountry: 'AR',
    },
    sameAs: contacto.redes.map((r) => r.url),
  };
}
