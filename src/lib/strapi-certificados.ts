const BASE = import.meta.env.STRAPI_URL || import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const TOKEN = import.meta.env.STRAPI_TOKEN || import.meta.env.VITE_STRAPI_TOKEN || '';

export interface Certificado {
  name: string;
  url: string;
}

function buildUrl(path: string): string {
  return path.startsWith('http') ? path : `${BASE}${path}`;
}

export function esCodigoValido(codigo: string): boolean {
  return /^[a-zA-Z0-9-]{1,64}$/.test(codigo);
}

export async function getCertificadoByCodigo(codigo: string): Promise<Certificado | null> {
  if (!esCodigoValido(codigo)) return null;

  const params = new URLSearchParams({
    'filters[name][$eqi]': `${codigo}.pdf`,
  });

  const url = buildUrl(`/api/upload/files?${params.toString()}`);
  const headers: Record<string, string> = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`Strapi ${res.status} ${res.statusText} consultando certificado`);
  }

  const json = await res.json();
  const item = Array.isArray(json) ? json[0] : json?.data?.[0];
  if (!item) return null;

  const fileUrl = item.url || item.attributes?.url;
  const name = item.name || item.attributes?.name;
  if (!fileUrl) return null;

  return { name, url: buildUrl(fileUrl) };
}
