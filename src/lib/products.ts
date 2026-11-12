/*
 * Product queries — the only gate between pages and the `products` collection.
 *
 * Components never import `astro:content`; pages call these helpers in build
 * time and pass plain, typed objects down. `getByCultivo` is the reverse
 * lookup that makes the "reach the same product by crop" path work.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { LineaId } from './taxonomy';
import { LINEAS, ordenarPorNombre } from './taxonomy';

export interface Documento {
  url: string;
  externo?: boolean;
  pesoKb?: number;
}

export interface Producto {
  slug: string;
  nombre: string;
  linea: LineaId;
  resumen: string;
  composicion: string;
  formaFisica: 'microgranulado' | 'granulado' | 'liquido';
  mezclaQuimica: boolean;
  presentaciones: string[];
  fichaTecnica?: Documento;
  manual?: Documento;
  cultivos: string[];
  aplicaciones?: { cultivo: string; dosis: string }[];
  destacado: boolean;
  orden: number;
}

/* Convert a raw collection entry into the flat, typed Producto shape. */
function toProducto(entry: CollectionEntry<'products'>): Producto {
  const d = entry.data;
  return {
    slug: entry.id,
    nombre: d.nombre,
    linea: d.linea,
    resumen: d.resumen,
    composicion: d.composicion,
    formaFisica: d.formaFisica,
    mezclaQuimica: d.mezclaQuimica,
    presentaciones: d.presentaciones,
    fichaTecnica: d.fichaTecnica,
    manual: d.manual,
    cultivos: d.cultivos,
    aplicaciones: d.aplicaciones,
    destacado: d.destacado,
    orden: d.orden,
  };
}

/* Every product, deterministically ordered. */
export async function getAllProducts(): Promise<Producto[]> {
  const entries = await getCollection('products');
  return entries.map(toProducto).sort(ordenarPorNombre);
}

/* One product by slug. */
export async function getProducto(slug: string): Promise<Producto | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug);
}

/* Products belonging to a single business line (camino 1). */
export async function getByLinea(linea: LineaId): Promise<Producto[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.linea === linea);
}

/* Products recommended for a crop, via the reverse lookup (camino 2). */
export async function getByCultivo(cultivoSlug: string): Promise<Producto[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.cultivos.includes(cultivoSlug));
}

/* Featured products for the home page. */
export async function getDestacados(): Promise<Producto[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.destacado);
}

/* Up to `n` related products, same line first, never the product itself. */
export async function getRelacionados(slug: string, n = 3): Promise<Producto[]> {
  const all = await getAllProducts();
  const actual = all.find((p) => p.slug === slug);
  if (!actual) return [];
  const mismaLinea = all.filter((p) => p.slug !== slug && p.linea === actual.linea);
  const otraLinea = all.filter((p) => p.slug !== slug && p.linea !== actual.linea);
  return [...mismaLinea, ...otraLinea].slice(0, n);
}

/* Lines with their real product count, for the home and index grids. */
export async function getLineasConConteo() {
  const all = await getAllProducts();
  return LINEAS.map((linea) => ({
    ...linea,
    cantidad: all.filter((p) => p.linea === linea.id).length,
  }));
}

/* Every declared downloadable document, flattened for the manuals index. */
export async function getAllDownloads() {
  const all = await getAllProducts();
  const rows: Array<{
    producto: string;
    slug: string;
    linea: LineaId;
    tipo: 'ficha' | 'manual';
    url: string;
    externo?: boolean;
    pesoKb?: number;
  }> = [];
  for (const p of all) {
    if (p.fichaTecnica) {
      rows.push({ producto: p.nombre, slug: p.slug, linea: p.linea, tipo: 'ficha', ...p.fichaTecnica });
    }
    if (p.manual) {
      rows.push({ producto: p.nombre, slug: p.slug, linea: p.linea, tipo: 'manual', ...p.manual });
    }
  }
  return rows;
}
