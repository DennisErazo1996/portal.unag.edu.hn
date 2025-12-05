import { defineCollection, z } from 'astro:content';

const comunicadosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Convocatoria', 'Aviso', 'Graduación', 'Licitación', 'Académico']),
    date: z.date(),
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
  'comunicados': comunicadosCollection,
};
