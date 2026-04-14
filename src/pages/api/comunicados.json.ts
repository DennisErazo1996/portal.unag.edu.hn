import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const comunicados = await getCollection('comunicados');

  const data = comunicados
    .sort((a, b) => {
      const diff = b.data.date.getTime() - a.data.date.getTime();
      if (diff !== 0) return diff;
      return (b.data.order ?? 0) - (a.data.order ?? 0);
    })
    .map((entry) => ({
      slug: entry.slug,
      title: entry.data.title,
      description: entry.data.description,
      category: entry.data.category,
      date: entry.data.date.toISOString().split('T')[0],
      featured: entry.data.featured,
      image: entry.data.image ?? null,
      attachments: entry.data.attachments ?? [],
      url: `/comunicados/${entry.slug}`,
    }));

  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
