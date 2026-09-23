// One-off migration script: reads src/content/comunicados/*.md and creates
// matching entries in Strapi (category-portal + posts-portal), uploading
// each attachment file to the Media Library.
//
// Run manually, once, per target Strapi instance:
//   STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=xxx node scripts/migrate-comunicados-to-strapi.mjs
//
// It is NOT wired into build/deploy — this is intentional, run by hand only.
// Safe to re-run: skips entries whose slug already exists in posts-portals.

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const COMUNICADOS_DIR = path.join(ROOT, 'src', 'content', 'comunicados');
const PUBLIC_DIR = path.join(ROOT, 'public');

const STRAPI_URL = process.env.STRAPI_URL || process.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || process.env.VITE_STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('Missing STRAPI_TOKEN (or VITE_STRAPI_TOKEN) env var. Aborting.');
  process.exit(1);
}

const headersJson = {
  Authorization: `Bearer ${STRAPI_TOKEN}`,
  'Content-Type': 'application/json',
};
const headersAuth = { Authorization: `Bearer ${STRAPI_TOKEN}` };

function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter found');
  return { frontmatter: yaml.load(match[1]) || {}, body: match[2].trim() };
}

async function strapiFetch(pathname, options = {}) {
  const res = await fetch(`${STRAPI_URL}${pathname}`, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Strapi ${options.method || 'GET'} ${pathname} -> ${res.status}: ${text}`);
  }
  return res.json();
}

const categoryCache = new Map();

async function findOrCreateCategory(name) {
  if (!name) return null;
  if (categoryCache.has(name)) return categoryCache.get(name);

  const found = await strapiFetch(
    `/api/category-portals?filters[name][$eq]=${encodeURIComponent(name)}`,
    { headers: headersAuth }
  );
  if (found.data?.length) {
    const id = found.data[0].id;
    categoryCache.set(name, id);
    return id;
  }

  const created = await strapiFetch('/api/category-portals', {
    method: 'POST',
    headers: headersJson,
    body: JSON.stringify({ data: { name } }),
  });
  const id = created.data.id;
  categoryCache.set(name, id);
  console.log(`  + categoría creada: "${name}" (id ${id})`);
  return id;
}

function guessMime(ext) {
  const map = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
  };
  return map[ext.toLowerCase()] || 'application/octet-stream';
}

async function uploadAttachment(url) {
  // url is like "/documents/comunicados/foo.pdf" -> public/documents/comunicados/foo.pdf
  const relPath = decodeURIComponent(url.replace(/^\//, ''));
  const filePath = path.join(PUBLIC_DIR, relPath);
  if (!existsSync(filePath)) {
    console.warn(`  ! archivo no encontrado, se omite: ${filePath}`);
    return null;
  }
  const buffer = await readFile(filePath);
  const filename = path.basename(filePath);
  const ext = path.extname(filename);
  const blob = new Blob([buffer], { type: guessMime(ext) });

  const form = new FormData();
  form.append('files', blob, filename);

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: headersAuth,
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed for ${filename}: ${res.status} ${text}`);
  }
  const [uploaded] = await res.json();
  console.log(`  + archivo subido: ${filename} (media id ${uploaded.id})`);
  return uploaded.id;
}

async function entryExists(slug) {
  const found = await strapiFetch(
    `/api/posts-portals?filters[slug][$eq]=${encodeURIComponent(slug)}`,
    { headers: headersAuth }
  );
  return found.data?.length > 0;
}

function sanitizeSlug(raw) {
  return raw.replace(/[^A-Za-z0-9-_.~]/g, '-').replace(/-+/g, '-');
}

async function migrateFile(filename) {
  const slug = sanitizeSlug(filename.replace(/\.md$/, ''));
  console.log(`\n> ${slug}`);

  if (await entryExists(slug)) {
    console.log('  = ya existe en Strapi, se omite');
    return;
  }

  const raw = await readFile(path.join(COMUNICADOS_DIR, filename), 'utf-8');
  const { frontmatter, body } = splitFrontmatter(raw);

  const categoryId = await findOrCreateCategory(frontmatter.category);

  const attachments = [];
  for (const att of frontmatter.attachments || []) {
    const fileId = await uploadAttachment(att.url);
    if (fileId) {
      attachments.push({ name: att.name, file: fileId });
    }
  }

  const data = {
    title: frontmatter.title,
    slug,
    description: frontmatter.description,
    content: body,
    date: frontmatter.date instanceof Date
      ? frontmatter.date.toISOString().split('T')[0]
      : frontmatter.date,
    featured: !!frontmatter.featured,
    order: frontmatter.order ?? null,
    category_portal: categoryId,
    attachments,
  };

  const created = await strapiFetch('/api/posts-portals', {
    method: 'POST',
    headers: headersJson,
    body: JSON.stringify({ data }),
  });
  console.log(`  + entrada creada (id ${created.data.id}, publicada: ${!!created.data.publishedAt})`);
}

async function main() {
  const files = (await readdir(COMUNICADOS_DIR)).filter((f) => f.endsWith('.md'));
  console.log(`Migrando ${files.length} comunicados desde ${COMUNICADOS_DIR}`);
  console.log(`Destino: ${STRAPI_URL}`);

  for (const file of files) {
    try {
      await migrateFile(file);
    } catch (err) {
      console.error(`  ! error migrando ${file}:`, err.message);
    }
  }
  console.log('\nMigración terminada.');
}

main();
