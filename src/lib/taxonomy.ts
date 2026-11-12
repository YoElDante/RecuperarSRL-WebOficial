/*
 * Taxonomy — pure constants and helpers for the two navigation paths.
 *
 * There is ONE products collection and TWO ways to reach it: by product line
 * (camino 1) and by crop type (camino 2). This module owns the line metadata
 * and the crop-type metadata; it never reads collections, so it stays pure and
 * testable.
 */
export type LineaId =
  | 'arrancadores'
  | 'bioestimulantes'
  | 'correctores'
  | 'jardin'
  | 'mejoradores';

export interface Linea {
  id: LineaId;
  label: string;
  descripcion: string;
  orden: number;
  icono: string;
}

export const LINEAS: Linea[] = [
  {
    id: 'arrancadores',
    label: 'Arrancadores y Fertilizantes',
    descripcion:
      'Microgranulados y mezclas para arranque y nutrición de cultivos extensivos.',
    orden: 1,
    icono: 'seed',
  },
  {
    id: 'bioestimulantes',
    label: 'Bioestimulantes',
    descripcion:
      'Ácidos fúlvicos y húmicos para potenciar el desarrollo y la calidad.',
    orden: 2,
    icono: 'leaf',
  },
  {
    id: 'correctores',
    label: 'Correctores de Suelo',
    descripcion:
      'Enmiendas cálcicas y sulfuradas para recuperar y equilibrar el suelo.',
    orden: 3,
    icono: 'soil',
  },
  {
    id: 'jardin',
    label: 'Jardinería',
    descripcion:
      'Fertilizantes de liberación gradual y triple efecto para parques y jardines.',
    orden: 4,
    icono: 'flower',
  },
  {
    id: 'mejoradores',
    label: 'Mejoradores de Eficiencia',
    descripcion:
      'Soluciones que mejoran la disponibilidad y el aprovechamiento de nutrientes.',
    orden: 5,
    icono: 'drop',
  },
];

export type TipoCultivo = 'extensivo' | 'intensivo';

export interface TipoCultivoInfo {
  id: TipoCultivo;
  label: string;
  plural: string;
  descripcion: string;
}

export const TIPOS_CULTIVO: TipoCultivoInfo[] = [
  {
    id: 'extensivo',
    label: 'Extensivo',
    plural: 'Extensivos',
    descripcion: 'Soja, maíz, trigo, girasol, alfalfa y maní.',
  },
  {
    id: 'intensivo',
    label: 'Intensivo',
    plural: 'Intensivos',
    descripcion: 'Tomate, hortalizas y papas.',
  },
];

/* Look up a line label from its id. */
export function getLineaLabel(id: string): string {
  return LINEAS.find((l) => l.id === id)?.label ?? id;
}

/* Look up the type info from its id. */
export function getTipoCultivoInfo(id: TipoCultivo): TipoCultivoInfo | undefined {
  return TIPOS_CULTIVO.find((t) => t.id === id);
}

/* Deterministic sort: by `orden`, then alphabetically by name. */
export function ordenarPorNombre<T extends { nombre: string; orden?: number }>(
  a: T,
  b: T,
): number {
  const ordenA = a.orden ?? 0;
  const ordenB = b.orden ?? 0;
  if (ordenA !== ordenB) return ordenA - ordenB;
  return a.nombre.localeCompare(b.nombre, 'es');
}
