import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { translateHtml } from '../lib/htmlTranslate';

const PAGE_CACHE_DIR = path.join(process.cwd(), '.cache');
const PAGE_CACHE_FILE = path.join(PAGE_CACHE_DIR, 'i18n-pages.json');

type PageHashMap = Record<string, string>;

async function listHtmlFilesRecursively(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listHtmlFilesRecursively(fullPath);
      }

      if (entry.isFile() && fullPath.endsWith('.html')) {
        return [fullPath];
      }

      return [];
    })
  );

  return files.flat();
}

function toPosixPath(input: string): string {
  return input.split(path.sep).join('/');
}

function hashContent(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

async function loadPageHashCache(): Promise<PageHashMap> {
  try {
    const raw = await fs.readFile(PAGE_CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

async function writePageHashCache(data: PageHashMap) {
  await fs.mkdir(PAGE_CACHE_DIR, { recursive: true });
  const tempFile = `${PAGE_CACHE_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempFile, PAGE_CACHE_FILE);
}

async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let currentIndex = 0;

  async function runWorker() {
    while (true) {
      const index = currentIndex;
      currentIndex += 1;

      if (index >= items.length) {
        return;
      }

      await worker(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, limit) }, () => runWorker()));
}

export default function autoTranslateIntegration(): AstroIntegration {
  return {
    name: 'auto-translate-en-build',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);
        const htmlFiles = await listHtmlFilesRecursively(distDir);
        const sourceFiles = htmlFiles.filter((filePath) => {
          const rel = toPosixPath(path.relative(distDir, filePath));
          return !rel.startsWith('en/');
        });

        if (sourceFiles.length === 0) {
          logger.info('[auto-translate] No HTML files found to translate.');
          return;
        }

        const pageHashCache = await loadPageHashCache();
        const nextPageHashCache: PageHashMap = { ...pageHashCache };

        let translatedCount = 0;
        let skippedCount = 0;

        logger.info(`[auto-translate] Translating ${sourceFiles.length} pages (sequential to respect API rate limits)...`);
        await runWithConcurrency(sourceFiles, 1, async (sourceFile) => {
          const relativePath = toPosixPath(path.relative(distDir, sourceFile));
          const targetFile = path.join(distDir, 'en', relativePath);

          const sourceHtml = await fs.readFile(sourceFile, 'utf-8');
          const sourceHash = hashContent(sourceHtml);

          const cachedHash = pageHashCache[relativePath];
          let shouldSkip = false;

          if (cachedHash === sourceHash) {
            try {
              await fs.access(targetFile);
              shouldSkip = true;
            } catch {
              shouldSkip = false;
            }
          }

          if (shouldSkip) {
            skippedCount += 1;
            return;
          }

          const translatedHtml = await translateHtml(sourceHtml);

          await fs.mkdir(path.dirname(targetFile), { recursive: true });
          await fs.writeFile(targetFile, translatedHtml, 'utf-8');

          nextPageHashCache[relativePath] = sourceHash;
          translatedCount += 1;
        });

        await writePageHashCache(nextPageHashCache);
        logger.info(
          `[auto-translate] English pages ready in /en/ (translated: ${translatedCount}, skipped: ${skippedCount}).`
        );
      },
    },
  };
}
