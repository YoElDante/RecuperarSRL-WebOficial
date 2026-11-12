/*
 * Site queries — institutional copy, contact data and navigation.
 *
 * BaseLayout reads the `site` collection once and passes contact + nav down to
 * the shell, so individual pages never have to wire it themselves.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { LINEAS, TIPOS_CULTIVO } from './taxonomy';

type SiteEntry = CollectionEntry<'site'>;
type PaginaNombre = SiteEntry['data']['pagina'];

/* The contact page shape, reused by the shell components. */
export type ContactoData = Extract<SiteEntry['data'], { pagina: 'contacto' }>;

/* Strongly typed lookup of one `site` page by its `pagina` discriminant. */
export async function getPagina<T extends PaginaNombre>(
  pagina: T,
): Promise<Extract<SiteEntry['data'], { pagina: T }> | undefined> {
  const entries = await getCollection('site');
  const found = entries.find((e) => e.data.pagina === pagina);
  return found?.data as Extract<SiteEntry['data'], { pagina: T }> | undefined;
}

/* Convenience wrappers for the pages consumed by the layout. */
export async function getContacto() {
  return getPagina('contacto');
}

export async function getHome() {
  return getPagina('home');
}

/* A single navigation entry, optionally with a dropdown. */
export interface NavItem {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
}

/* Main navigation: product lines and crop types feed the two dropdowns. */
export function getNav(): NavItem[] {
  return [
    {
      label: 'Productos',
      href: '/productos',
      children: LINEAS.map((linea) => ({
        label: linea.label,
        href: `/productos#linea-${linea.id}`,
      })),
    },
    {
      label: 'Cultivos',
      href: '/cultivos/extensivos',
      children: TIPOS_CULTIVO.map((tipo) => ({
        label: tipo.plural,
        href: `/cultivos/${tipo.id}s`,
      })),
    },
    { label: 'La Empresa', href: '/la-empresa' },
    { label: '¿Qué Hacemos?', href: '/que-hacemos' },
  ];
}
