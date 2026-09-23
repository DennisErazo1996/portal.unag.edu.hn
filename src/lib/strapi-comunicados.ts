import { marked } from 'marked';

const BASE = import.meta.env.STRAPI_URL || import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const TOKEN = import.meta.env.STRAPI_TOKEN || import.meta.env.VITE_STRAPI_TOKEN || '';

export interface ComunicadoAttachment {
  name: string;
  url: string;
  type: string;
}

export interface Comunicado {
  id: string;
  data: {
    title: string;
    description: string;
    content: string;
    date: Date;
    category: string;
    featured: boolean;
    order: number;
    image: string | null;
    attachments: ComunicadoAttachment[];
  };
}

function buildUrl(path: string): string {
  return path.startsWith('http') ? path : `${BASE}${path}`;
}

function mediaUrl(media: any): string | null {
  const item = media?.data ?? media;
  const url = item?.attributes?.url || item?.url;
  if (!url) return null;
  return buildUrl(url);
}

function mapAttachment(att: any): ComunicadoAttachment | null {
  const file = att?.file?.data?.attributes ?? att?.file;
  if (!file?.url) return null;
  return {
    name: att.name,
    url: buildUrl(file.url),
    type: (file.ext || '').replace(/^\./, '').toUpperCase(),
  };
}

function mapItem(item: any): Comunicado {
  const a = item.attributes ?? item;
  const categoryData = a.category_portal?.data ?? a.category_portal;
  const categoryName = categoryData?.attributes?.name || categoryData?.name || '';

  return {
    id: a.slug || String(item.id),
    data: {
      title: a.title || '',
      description: a.description || '',
      content: a.content ? marked.parse(a.content) as string : '',
      date: a.date ? new Date(a.date) : new Date(0),
      category: categoryName,
      featured: !!a.featured,
      order: a.order ?? 0,
      image: a.image ? mediaUrl(a.image) : null,
      attachments: Array.isArray(a.attachments)
        ? a.attachments.map(mapAttachment).filter((x: ComunicadoAttachment | null): x is ComunicadoAttachment => x !== null)
        : [],
    },
  };
}

async function fetchJson(path: string) {
  const url = buildUrl(path);
  const headers: Record<string, string> = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Strapi ${res.status} ${res.statusText} fetching ${url}: ${text}`);
  }
  return res.json();
}

export async function getAllComunicados(): Promise<Comunicado[]> {
  const json = await fetchJson(
    '/api/posts-portals?populate[attachments][populate]=file&populate[category_portal]=true&populate[image]=true&pagination[limit]=100&sort=date:desc'
  );
  const data = json.data || [];
  return data.map(mapItem);
}

export async function getComunicadoBySlug(slug: string): Promise<Comunicado | null> {
  if (!slug) return null;
  const json = await fetchJson(
    `/api/posts-portals?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[attachments][populate]=file&populate[category_portal]=true&populate[image]=true`
  );
  const item = (json.data && json.data[0]) || null;
  return item ? mapItem(item) : null;
}
