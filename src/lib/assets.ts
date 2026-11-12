/*
 * Asset resolution — maps a product/crop slug to its optimized image.
 *
 * Images live in src/assets and are imported eagerly so Astro can process them
 * with `astro:assets` (AVIF/WebP + srcset). Products without a photo simply
 * return undefined and the UI falls back to a typographic panel.
 */
import type { ImageMetadata } from 'astro';

/* All product photos, keyed by their file path. */
const productModules = import.meta.glob<ImageMetadata>('../assets/products/*.webp', {
  eager: true,
  import: 'default',
});

/* All crop photos, keyed by their file path. */
const cropModules = import.meta.glob<ImageMetadata>('../assets/crops/*.jpg', {
  eager: true,
  import: 'default',
});

/* Return the main product image for a slug, or undefined if it has none. */
export function getProductImage(slug: string): ImageMetadata | undefined {
  return productModules[`../assets/products/${slug}.webp`];
}

/* Return the crop image for a slug, or undefined if it has none. */
export function getCropImage(slug: string): ImageMetadata | undefined {
  return cropModules[`../assets/crops/${slug}.jpg`];
}
