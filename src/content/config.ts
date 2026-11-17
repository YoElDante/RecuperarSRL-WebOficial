/*
 * Content collections schema — the "model" layer of the site.
 *
 * Three collections live in the repo as Markdown with typed frontmatter:
 *  - products: one file per product (16 total) across 5 real business lines.
 *  - crops:    one file per crop (9 total), grouped by extensivo / intensivo.
 *  - site:     institutional copy and contact data, discriminated by `pagina`.
 *
 * Images are NOT stored in the schema: they are resolved by slug at build time
 * from src/assets (see src/lib/assets.ts). This keeps content portable and
 * means a missing photo never breaks the build.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* Shared shape for a downloadable document (ficha técnica or manual). */
const archivoSchema = z.object({
  url: z.string(),
  externo: z.boolean().optional(),
  pesoKb: z.number().optional(),
});

/* Real product lines, taken from the `productos/` source folders. */
const lineaSchema = z.enum([
  'arrancadores',
  'bioestimulantes',
  'correctores',
  'jardin',
  'mejoradores',
]);

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    nombre: z.string(),
    linea: lineaSchema,
    resumen: z.string(),
    composicion: z.string().default(''),
    formaFisica: z.enum(['microgranulado', 'granulado', 'liquido']).default('granulado'),
    mezclaQuimica: z.boolean().default(false),
    presentaciones: z.array(z.string()).default([]),
    fichaTecnica: archivoSchema.optional(),
    manual: archivoSchema.optional(),
    cultivos: z.array(z.string()).default([]),
    aplicaciones: z
      .array(z.object({ cultivo: z.string(), dosis: z.string() }))
      .optional(),
    destacado: z.boolean().default(false),
    orden: z.number().default(0),
  }),
});

const crops = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/crops' }),
  schema: z.object({
    nombre: z.string(),
    tipo: z.enum(['extensivo', 'intensivo']),
    resumen: z.string(),
    orden: z.number().default(0),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/site' }),
  schema: z.discriminatedUnion('pagina', [
    z.object({
      pagina: z.literal('home'),
      hero: z.object({
        kicker: z.string(),
        titulo: z.string(),
        bajada: z.string(),
      }),
      diferenciales: z
        .array(z.object({ titulo: z.string(), texto: z.string() }))
        .length(4),
      bandaEmpresa: z.object({
        titulo: z.string(),
        texto: z.string(),
        items: z.array(z.string()),
      }),
      ctaBands: z.array(z.object({ titulo: z.string(), texto: z.string() })),
      stats: z.array(z.object({ valor: z.string(), label: z.string() })),
    }),
    z.object({
      pagina: z.literal('empresa'),
      titulo: z.string(),
      intro: z.string(),
      secciones: z.array(z.object({ titulo: z.string(), texto: z.string() })),
      /* Aerial photo of the plant, shown beside the company sections. */
      aerea: z.object({
        caption: z.string(),
        alt: z.string(),
      }),
    }),
    z.object({
      pagina: z.literal('que-hacemos'),
      titulo: z.string(),
      intro: z.string(),
      secciones: z.array(z.object({ titulo: z.string(), texto: z.string() })),
    }),
    z.object({
      pagina: z.literal('contacto'),
      oficina: z.string(),
      mails: z.array(z.string()),
      telefonos: z.array(z.object({ zona: z.string(), telefono: z.string() })),
      whatsapp: z.string(),
      formEndpoint: z.string(),
      formProveedor: z.enum(['formspree', 'web3forms']),
      privacidadTexto: z.string(),
      plantas: z.array(z.object({ nombre: z.string(), direccion: z.string() })),
      redes: z.array(z.object({ nombre: z.string(), url: z.string() })),
    }),
  ]),
});

export const collections = { products, crops, site };
