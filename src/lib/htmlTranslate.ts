import * as parse5 from 'parse5';
import { translateTexts } from './openaiTranslate';

const BLOCKED_TAGS = new Set(['script', 'style', 'code', 'pre', 'svg', 'noscript']);
const TRANSLATABLE_ATTRIBUTES = new Set(['alt', 'title', 'aria-label']);

type AttrLike = { name: string; value: string };
type NodeLike = {
  nodeName?: string;
  tagName?: string;
  value?: string;
  attrs?: AttrLike[];
  childNodes?: NodeLike[];
};

type TextSegment = {
  kind: 'text';
  node: NodeLike;
  core: string;
  leading: string;
  trailing: string;
};

type AttrSegment = {
  kind: 'attr';
  node: NodeLike;
  attrName: string;
  core: string;
};

type Segment = TextSegment | AttrSegment;

function splitWhitespace(value: string) {
  const leadingMatch = value.match(/^\s+/);
  const trailingMatch = value.match(/\s+$/);
  const leading = leadingMatch?.[0] ?? '';
  const trailing = trailingMatch?.[0] ?? '';
  const core = value.slice(leading.length, value.length - trailing.length);

  return { leading, trailing, core };
}

function walk(node: NodeLike, blocked: boolean, segments: Segment[]) {
  if (node.nodeName === '#text') {
    if (blocked) {
      return;
    }

    const textValue = typeof node.value === 'string' ? node.value : '';
    const { leading, trailing, core } = splitWhitespace(textValue);
    if (!core) {
      return;
    }

    segments.push({
      kind: 'text',
      node,
      core,
      leading,
      trailing,
    });

    return;
  }

  const isElement = typeof node.tagName === 'string';
  let nextBlocked = blocked;

  if (isElement) {
    const tagName = (node.tagName ?? '').toLowerCase();
    nextBlocked = blocked || BLOCKED_TAGS.has(tagName);

    if (!nextBlocked && Array.isArray(node.attrs)) {
      for (const attr of node.attrs) {
        if (!TRANSLATABLE_ATTRIBUTES.has(attr.name.toLowerCase())) {
          continue;
        }

        const { core } = splitWhitespace(attr.value);
        if (!core) {
          continue;
        }

        segments.push({
          kind: 'attr',
          node,
          attrName: attr.name,
          core,
        });
      }
    }
  }

  if (!Array.isArray(node.childNodes)) {
    return;
  }

  for (const child of node.childNodes) {
    walk(child, nextBlocked, segments);
  }
}

function setAttributeValue(node: NodeLike, attrName: string, value: string) {
  if (!Array.isArray(node.attrs)) {
    return;
  }

  const attr = node.attrs.find((item) => item.name === attrName);
  if (!attr) {
    return;
  }

  attr.value = value;
}

function setHtmlLangToEnglish(node: NodeLike) {
  if (typeof node.tagName === 'string' && node.tagName.toLowerCase() === 'html') {
    const attrs = Array.isArray(node.attrs) ? node.attrs : [];
    const langAttr = attrs.find((item) => item.name.toLowerCase() === 'lang');
    if (langAttr) {
      langAttr.value = 'en';
      return;
    }

    attrs.push({ name: 'lang', value: 'en' });
    node.attrs = attrs;
    return;
  }

  if (!Array.isArray(node.childNodes)) {
    return;
  }

  for (const child of node.childNodes) {
    setHtmlLangToEnglish(child);
  }
}

function isLikelyAssetPath(value: string): boolean {
  return /\.(?:png|jpe?g|webp|gif|svg|ico|css|js|mjs|pdf|xml|txt|json|webmanifest|woff2?|ttf|eot)(?:$|[?#])/i.test(
    value
  );
}

function rewriteToEnglishPath(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return value;
  if (trimmed.startsWith('#')) return value;
  if (/^(?:[a-z]+:)?\/\//i.test(trimmed)) return value;
  if (/^(?:mailto|tel|javascript):/i.test(trimmed)) return value;
  if (trimmed.startsWith('/en/')) return value;
  if (trimmed === '/en') return '/en/';
  if (trimmed.startsWith('/_astro/') || trimmed.startsWith('/img/') || trimmed.startsWith('/documents/')) return value;
  if (isLikelyAssetPath(trimmed)) return value;

  if (trimmed === '/') {
    return '/en/';
  }

  if (trimmed.startsWith('/')) {
    return `/en${trimmed}`;
  }

  return value;
}

function rewriteInternalLinksToEnglish(node: NodeLike) {
  if (typeof node.tagName === 'string' && Array.isArray(node.attrs)) {
    for (const attr of node.attrs) {
      const attrName = attr.name.toLowerCase();
      if (attrName !== 'href' && attrName !== 'action') {
        continue;
      }

      attr.value = rewriteToEnglishPath(attr.value);
    }
  }

  if (!Array.isArray(node.childNodes)) {
    return;
  }

  for (const child of node.childNodes) {
    rewriteInternalLinksToEnglish(child);
  }
}

export async function translateHtml(html: string): Promise<string> {
  const document = parse5.parse(html) as unknown as NodeLike;
  const segments: Segment[] = [];

  setHtmlLangToEnglish(document);
  rewriteInternalLinksToEnglish(document);

  walk(document, false, segments);

  const uniqueTexts = Array.from(new Set(segments.map((segment) => segment.core)));
  if (uniqueTexts.length === 0) {
    return html;
  }

  const translated = await translateTexts(uniqueTexts);
  const translationMap = new Map<string, string>();

  uniqueTexts.forEach((source, index) => {
    translationMap.set(source, translated[index] ?? source);
  });

  for (const segment of segments) {
    const translatedCore = translationMap.get(segment.core) ?? segment.core;

    if (segment.kind === 'text') {
      segment.node.value = `${segment.leading}${translatedCore}${segment.trailing}`;
      continue;
    }

    setAttributeValue(segment.node, segment.attrName, translatedCore);
  }

  return parse5.serialize(document as any);
}
