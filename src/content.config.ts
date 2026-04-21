import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const comunicadosCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comunicados' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Convocatoria', 'Aviso', 'Graduación', 'Licitación', 'Académico']),
    date: z.coerce.date(),
    order: z.number().optional(), // Orden de publicación (mayor = más reciente) para desempate en misma fecha
    image: z.string().optional(),
    featured: z.boolean().default(false),
    attachments: z.array(z.object({
      name: z.string(),
      url: z.string(),
      type: z.string().optional(),
    })).optional(),
  }),
});

export const collections = {
  comunicados: comunicadosCollection,
};
