import { promises as fs } from 'node:fs';
import path from 'node:path';
import OpenAI from 'openai';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'i18n.json');

const TRANSLATION_FREE_MODELS = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-120b:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
];

const BRAND_TERMS = ['UNAG', 'IAIP', 'ONADICI', 'SysUNAG', 'Moodle'];
const COMMON_UPPERCASE_WORDS = new Set(['DE', 'LA', 'EL', 'Y', 'DEL', 'EN', 'A', 'AL', 'LOS', 'LAS', 'UN', 'UNA']);

let cacheLoaded = false;
let cache: Record<string, string> = {};
let dirty = false;
let writeCachePending: Promise<void> = Promise.resolve();

type MaskResult = {
  text: string;
  placeholders: Map<string, string>;
};

function buildProtectedRegexes() {
  const escapedBrands = BRAND_TERMS.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  return {
    brandNames: new RegExp(`\\b(?:${escapedBrands.join('|')})\\b`, 'gi'),
    url: /\bhttps?:\/\/[^\s<>")]+/gi,
    email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    numbers: /\b\d[\d.,/%:-]*\b/g,
    acronyms: /\b[A-ZÁÉÍÓÚÜÑ]{2,4}\b/g,
  };
}

function collectMatches(text: string, regex: RegExp): Array<{ start: number; end: number; value: string }> {
  const matches: Array<{ start: number; end: number; value: string }> = [];
  const source = regex.global ? regex : new RegExp(regex.source, `${regex.flags}g`);

  let match: RegExpExecArray | null;
  while ((match = source.exec(text)) !== null) {
    if (match[0].length === 0) {
      source.lastIndex += 1;
      continue;
    }

    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      value: match[0],
    });
  }

  return matches;
}

function maskProtectedSegments(input: string): MaskResult {
  const regexes = buildProtectedRegexes();
  const acronymMatches = collectMatches(input, regexes.acronyms).filter(
    (item) => !COMMON_UPPERCASE_WORDS.has(item.value)
  );

  const allMatches = [
    ...collectMatches(input, regexes.url),
    ...collectMatches(input, regexes.email),
    ...collectMatches(input, regexes.brandNames),
    ...acronymMatches,
    ...collectMatches(input, regexes.numbers),
  ].sort((a, b) => a.start - b.start || b.end - a.end);

  const nonOverlapping: Array<{ start: number; end: number; value: string }> = [];
  let lastEnd = -1;

  for (const item of allMatches) {
    if (item.start >= lastEnd) {
      nonOverlapping.push(item);
      lastEnd = item.end;
    }
  }

  if (nonOverlapping.length === 0) {
    return { text: input, placeholders: new Map() };
  }

  let output = '';
  let cursor = 0;
  const placeholders = new Map<string, string>();

  nonOverlapping.forEach((segment, index) => {
    const token = `__KEEP_${index}__`;
    output += input.slice(cursor, segment.start);
    output += token;
    cursor = segment.end;
    placeholders.set(token, segment.value);
  });

  output += input.slice(cursor);
  return { text: output, placeholders };
}

function unmaskProtectedSegments(input: string, placeholders: Map<string, string>): string {
  let output = input;

  for (const [token, original] of placeholders.entries()) {
    output = output.split(token).join(original);
  }

  return output;
}

async function ensureCacheLoaded() {
  if (cacheLoaded) {
    return;
  }

  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    cache = typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    cache = {};
  }

  cacheLoaded = true;
}

async function writeCacheAtomic() {
  if (!dirty) {
    return;
  }
  // Serialize concurrent writes to avoid ENOENT race condition when
  // multiple workers call this simultaneously with the same temp filename.
  writeCachePending = writeCachePending
    .then(async () => {
      if (!dirty) return;
      await fs.mkdir(CACHE_DIR, { recursive: true });
      const tempFile = `${CACHE_FILE}.tmp`;
      await fs.writeFile(tempFile, JSON.stringify(cache, null, 2), 'utf-8');
      await fs.rename(tempFile, CACHE_FILE);
      dirty = false;
    })
    .catch(() => {
      // Cache write failure is non-fatal; the next build will re-translate.
    });
  return writeCachePending;
}

function parseJsonArray(raw: string): string[] {
  const trimmed = raw.trim();

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

  const parsed = JSON.parse(candidate);

  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === 'string')) {
    throw new Error('OpenAI response is not a JSON string array.');
  }

  return parsed;
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function requestTranslations(openai: OpenAI, payload: string[]): Promise<string[]> {
  const systemPrompt =
    'You translate Spanish website text to English. Preserve meaning, capitalization, punctuation, and spacing. Do not add explanations. Return only a valid JSON array of strings. Keep placeholders like __KEEP_0__ unchanged.';

  for (const model of TRANSLATION_FREE_MODELS) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        temperature: 0,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(payload) },
        ],
      });
      const rawContent = completion.choices[0]?.message?.content ?? '[]';
      return parseJsonArray(rawContent);
    } catch (err) {
      console.warn(`[auto-translate] Model "${model}" failed: ${String(err).slice(0, 160)}`);
    }
  }

  throw new Error('[auto-translate] All translation models failed for this chunk.');
}

export async function translateTexts(texts: string[]): Promise<string[]> {
  await ensureCacheLoaded();

  if (texts.length === 0) {
    return [];
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://portal.unag.edu.hn',
      'X-Title': 'UNAG Portal Translator',
    },
  });

  const uniqueTexts = Array.from(new Set(texts));
  const missing = uniqueTexts.filter((text) => cache[text] === undefined);

  if (missing.length > 0) {
    const chunks = chunkArray(missing, 20);

    for (const chunk of chunks) {
      const masked = chunk.map((text) => maskProtectedSegments(text));
      const payload = masked.map((item) => item.text);

      let translatedMasked: string[] = [];
      try {
        translatedMasked = await requestTranslations(openai, payload);
      } catch {
        translatedMasked = [];
      }

      if (translatedMasked.length !== chunk.length) {
        translatedMasked = [];

        for (const single of payload) {
          try {
            const one = await requestTranslations(openai, [single]);
            translatedMasked.push(one[0] ?? single);
          } catch {
            translatedMasked.push(single);
          }
        }
      }

      translatedMasked.forEach((translated, index) => {
        const original = chunk[index];
        const restored = unmaskProtectedSegments(translated, masked[index].placeholders);
        cache[original] = restored;
        dirty = true;
      });
    }

    await writeCacheAtomic();
  }

  return texts.map((text) => cache[text] ?? text);
}
