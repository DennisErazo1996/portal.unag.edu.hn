import { defineCollection, z } from 'astro:content';

const comunicadosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Convocatoria', 'Evento', 'Aviso', 'Graduación', 'Becas', 'Académico']),
    date: z.date(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  'comunicados': comunicadosCollection,
};
