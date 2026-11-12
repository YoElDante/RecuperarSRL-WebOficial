/*
 * Crop queries — reads the `crops` collection and joins it with products.
 *
 * Crops are grouped by type (extensivo / intensivo). The product→crop mapping
 * lives on each product (`cultivos: string[]`), so counting and joining happens
 * through the reverse lookup in products.ts.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { TipoCultivo } from './taxonomy';
import { ordenarPorNombre } from './taxonomy';
import { getByCultivo, getAllProducts } from './products';

export interface Cultivo {
  slug: string;
  nombre: string;
  tipo: TipoCultivo;
  resumen: string;
  orden: number;
}

function toCultivo(entry: CollectionEntry<'crops'>): Cultivo {
  return {
    slug: entry.id,
    nombre: entry.data.nombre,
    tipo: entry.data.tipo,
    resumen: entry.data.resumen,
    orden: entry.data.orden,
  };
}

/* Every crop, ordered. */
export async function getAllCrops(): Promise<Cultivo[]> {
  const entries = await getCollection('crops');
  return entries.map(toCultivo).sort(ordenarPorNombre);
}

/* Crops of one type (extensivo / intensivo). */
export async function getCropsByTipo(tipo: TipoCultivo): Promise<Cultivo[]> {
  const all = await getAllCrops();
  return all.filter((c) => c.tipo === tipo);
}

/* One crop by slug. */
export async function getCultivo(slug: string): Promise<Cultivo | undefined> {
  const all = await getAllCrops();
  return all.find((c) => c.slug === slug);
}

/* How many products recommend a given crop. */
export async function countProductosPorCultivo(slug: string): Promise<number> {
  return (await getByCultivo(slug)).length;
}

/*
 * Resolve the crop slugs stored on a product into full crop records, and
 * fail loudly if a product references a crop that does not exist.
 */
export async function getCultivosDeProducto(slugs: string[]): Promise<Cultivo[]> {
  const all = await getAllCrops();
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  const resolved: Cultivo[] = [];
  for (const slug of slugs) {
    const crop = bySlug.get(slug);
    if (!crop) {
      throw new Error(
        `Producto referencia un cultivo inexistente: "${slug}". Revisá el campo "cultivos" del producto.`,
      );
    }
    resolved.push(crop);
  }
  return resolved;
}

/* Sanity guard used by the catalog index to keep counts honest. */
export async function getTotalesCatalogo() {
  const [crops, products] = await Promise.all([getAllCrops(), getAllProducts()]);
  return { crops: crops.length, products: products.length };
}
