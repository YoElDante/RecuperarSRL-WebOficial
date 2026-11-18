/*
 * Site queries — institutional copy, contact data and navigation.
 *
 * BaseLayout reads the `site` collection once and passes contact + nav down to
 * the shell, so individual pages never have to wire it themselves.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { TIPOS_CULTIVO } from './taxonomy';
import { url } from './urls';

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

/* Main navigation: Empresa first, then a direct products link and the crop-type path. */
export function getNav(): NavItem[] {
  return [
    { label: 'La Empresa', href: url('/la-empresa') },
    { label: 'Productos', href: url('/productos') },
    {
      label: 'Tipos de cultivo',
      href: url('/cultivos/extensivos'),
      children: TIPOS_CULTIVO.map((tipo) => ({
        label: tipo.label,
        href: url(`/cultivos/${tipo.id}s`),
      })),
    },
    { label: '¿Qué Hacemos?', href: url('/que-hacemos') },
  ];
}
