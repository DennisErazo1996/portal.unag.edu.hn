/**
 * Script de indexación de contenido del sitio
 * Genera un archivo markdown con todo el contenido para el chatbot
 * 
 * Ejecutar: node scripts/index-content.mjs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUTPUT_FILE = path.join(SRC, 'data', 'site-content.md');

// ============================================
// Utilidades
// ============================================

async function readFileContent(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

async function getFilesRecursive(dir, extension) {
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await getFilesRecursive(fullPath, extension));
      } else if (entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directorio no existe
  }
  return files;
}

function extractTextFromAstro(content) {
  // Remover el frontmatter (código entre ---)
  const parts = content.split('---');
  if (parts.length >= 3) {
    content = parts.slice(2).join('---');
  }
  
  // Extraer texto visible de las etiquetas HTML
  const textContent = content
    // Remover scripts y styles
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Extraer contenido de etiquetas con texto
    .replace(/<(h[1-6]|p|li|span|a|td|th)[^>]*>([^<]+)<\/\1>/gi, '$2\n')
    // Remover todas las etiquetas HTML restantes
    .replace(/<[^>]+>/g, ' ')
    // Limpiar espacios múltiples
    .replace(/\s+/g, ' ')
    .replace(/\{[^}]+\}/g, '') // Remover expresiones JSX
    .trim();
  
  return textContent;
}

function extractMarkdownContent(content) {
  // Remover frontmatter YAML
  const parts = content.split('---');
  if (parts.length >= 3) {
    const frontmatter = parts[1];
    const body = parts.slice(2).join('---');
    
    // Extraer título del frontmatter
    const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Extraer descripción
    const descMatch = frontmatter.match(/description:\s*["']?([^"'\n]+)["']?/);
    const description = descMatch ? descMatch[1] : '';
    
    return { title, description, body: body.trim() };
  }
  return { title: '', description: '', body: content };
}

function getPageTitle(filePath) {
  const name = path.basename(filePath, '.astro');
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getPageCategory(filePath) {
  const relativePath = path.relative(path.join(SRC, 'pages'), filePath);
  const parts = relativePath.split(path.sep);
  if (parts.length > 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  return 'General';
}

// ============================================
// Indexadores específicos
// ============================================

async function indexCarreras() {
  const content = await readFileContent(path.join(SRC, 'consts', 'carreras.ts'));
  if (!content) return '';
  
  // Extraer el array de carreras
  const match = content.match(/const carreras = \[([\s\S]*?)\];/);
  if (!match) return '';
  
  let output = '## Carreras Universitarias\n\n';
  output += 'La UNAG ofrece las siguientes carreras:\n\n';
  
  // Parsear manualmente las carreras
  const carreraRegex = /nombre:\s*["']([^"']+)["'][\s\S]*?sedes:\s*\[([^\]]+)\]/g;
  let carrera;
  while ((carrera = carreraRegex.exec(content)) !== null) {
    const nombre = carrera[1];
    const sedes = carrera[2].replace(/["']/g, '').split(',').map(s => s.trim()).join(', ');
    output += `- **${nombre}**: Disponible en ${sedes}\n`;
  }
  
  return output + '\n';
}

async function indexComunicados() {
  const comunicadosDir = path.join(SRC, 'content', 'comunicados');
  const files = await getFilesRecursive(comunicadosDir, '.md');
  
  if (files.length === 0) return '';
  
  let output = '## Comunicados Oficiales\n\n';
  
  for (const file of files) {
    const content = await readFileContent(file);
    if (!content) continue;
    
    const { title, description, body } = extractMarkdownContent(content);
    output += `### ${title || path.basename(file, '.md')}\n`;
    if (description) output += `${description}\n`;
    output += `${body.substring(0, 500)}...\n\n`;
  }
  
  return output;
}

async function indexNormativas() {
  const content = await readFileContent(path.join(SRC, 'consts', 'normativas.ts'));
  if (!content) return '';
  
  let output = '## Normativas Institucionales\n\n';
  
  const normativaRegex = /nombre:\s*["']([^"']+)["']/g;
  let match;
  while ((match = normativaRegex.exec(content)) !== null) {
    output += `- ${match[1]}\n`;
  }
  
  return output + '\n';
}

async function indexMisionVision() {
  const content = await readFileContent(path.join(SRC, 'consts', 'mision-vision.ts'));
  if (!content) return '';
  
  let output = '## Misión y Visión\n\n';
  
  const misionMatch = content.match(/mision:\s*["'`]([^"'`]+)["'`]/s);
  const visionMatch = content.match(/vision:\s*["'`]([^"'`]+)["'`]/s);
  
  if (misionMatch) output += `**Misión:** ${misionMatch[1].trim()}\n\n`;
  if (visionMatch) output += `**Visión:** ${visionMatch[1].trim()}\n\n`;
  
  return output;
}

async function indexPages() {
  const pagesDir = path.join(SRC, 'pages');
  const files = await getFilesRecursive(pagesDir, '.astro');
  
  // Excluir páginas especiales
  const excludePatterns = ['404', '[slug]', 'index', 'api'];
  const pageFiles = files.filter(f => {
    const name = path.basename(f, '.astro');
    return !excludePatterns.some(p => name.includes(p));
  });
  
  let output = '## Páginas del Sitio\n\n';
  
  // Agrupar por categoría
  const categories = {};
  
  for (const file of pageFiles) {
    const category = getPageCategory(file);
    if (!categories[category]) categories[category] = [];
    
    const title = getPageTitle(file);
    const relativePath = '/' + path.relative(pagesDir, file)
      .replace('.astro', '')
      .replace(/\\/g, '/');
    
    categories[category].push({ title, path: relativePath });
  }
  
  for (const [category, pages] of Object.entries(categories)) {
    output += `### ${category}\n`;
    for (const page of pages) {
      output += `- ${page.title} (${page.path})\n`;
    }
    output += '\n';
  }
  
  return output;
}

async function indexSedes() {
  let output = '## Sedes Regionales\n\n';
  output += '- **Campus Central**: Catacamas, Olancho\n';
  output += '- **Sede Regional Comayagua**: Comayagua\n';
  output += '- **Sede Regional Tomalá**: Lempira\n';
  output += '- **Sede Regional Mistruck**: La Mosquitia\n\n';
  return output;
}

async function indexFacultades() {
  const facultadesDir = path.join(SRC, 'consts', 'facultades');
  const files = await getFilesRecursive(facultadesDir, '.ts');
  
  let output = '## Facultades\n\n';
  output += '- Facultad de Ciencias Agrarias\n';
  output += '- Facultad de Ciencias de la Tierra y la Conservación\n';
  output += '- Facultad de Ciencias Económicas y Administrativas\n';
  output += '- Facultad de Ciencias Tecnológicas\n';
  output += '- Facultad de Ciencias\n';
  output += '- Facultad de Medicina Veterinaria y Zootecnia\n\n';
  
  return output;
}

async function indexAutoridades() {
  let output = '## Autoridades Universitarias\n\n';
  
  // Rector
  output += '### Rector\n';
  output += '- **Nombre:** M. Sc. Víctor Javier González\n';
  output += '- **Cargo:** Rector de la Universidad Nacional de Agricultura\n';
  output += '- **Correo:** rectoria@unag.edu.hn\n';
  output += '- **Página:** /organizacion/rectoria/rector\n\n';
  
  return output;
}

async function indexJDU() {
  const content = await readFileContent(path.join(SRC, 'consts', 'miembros-jdu.ts'));
  if (!content) return '';
  
  let output = '## Junta de Dirección Universitaria (JDU)\n\n';
  output += 'La Junta de Dirección Universitaria (JDU) es el máximo órgano de gobierno de la UNAG.\n\n';
  output += '### Miembros de la JDU:\n\n';
  
  // Extraer miembros
  const miembroRegex = /nombreCompleto:\s*["']([^"']+)["'][\s\S]*?cargo:\s*["']([^"']+)["'][\s\S]*?biografia:\s*\[([\s\S]*?)\]/g;
  let match;
  
  while ((match = miembroRegex.exec(content)) !== null) {
    const nombre = match[1];
    const cargo = match[2];
    let biografia = match[3]
      .replace(/<[^>]+>/g, '') // Remover HTML
      .replace(/["']/g, '')
      .replace(/,\s*$/g, '')
      .substring(0, 300);
    
    output += `#### ${nombre}\n`;
    output += `- **Cargo:** ${cargo}\n`;
    output += `- **Biografía:** ${biografia.trim()}...\n\n`;
  }
  
  output += '**Página oficial:** /organizacion/junta-de-direccion-universitaria\n\n';
  
  return output;
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('🔍 Indexando contenido del sitio...\n');
  
  const timestamp = new Date().toISOString();
  
  let content = `# Contenido del Sitio Web UNAG
  
> Archivo generado automáticamente el ${timestamp}
> Este archivo es utilizado por el chatbot para responder preguntas sobre el sitio.

---

## Información General

La **Universidad Nacional de Agricultura (UNAG)** es una institución de educación superior pública de Honduras, 
ubicada en Catacamas, Olancho. Fue fundada en 1950 y es la única universidad del país especializada en ciencias agrícolas.

**Sitio web oficial:** https://unag.edu.hn

---

`;

  // Indexar cada sección
  console.log('📚 Indexando carreras...');
  content += await indexCarreras();
  
  console.log('🏛️ Indexando facultades...');
  content += await indexFacultades();
  
  console.log('📍 Indexando sedes...');
  content += await indexSedes();
  
  console.log('� Indexando autoridades...');
  content += await indexAutoridades();
  
  console.log('🏛️ Indexando JDU...');
  content += await indexJDU();
  
  console.log('�📋 Indexando misión y visión...');
  content += await indexMisionVision();
  
  console.log('📜 Indexando normativas...');
  content += await indexNormativas();
  
  console.log('📰 Indexando comunicados...');
  content += await indexComunicados();
  
  console.log('📄 Indexando páginas...');
  content += await indexPages();
  
  // Guardar archivo
  await fs.writeFile(OUTPUT_FILE, content, 'utf-8');
  
  const stats = await fs.stat(OUTPUT_FILE);
  console.log(`\n✅ Indexación completada!`);
  console.log(`📁 Archivo: ${OUTPUT_FILE}`);
  console.log(`📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
}

main().catch(console.error);
