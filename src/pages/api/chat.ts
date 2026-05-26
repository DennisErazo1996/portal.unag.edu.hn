import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { getChatProvider, type ChatMessage, type ProviderType } from '@/lib/chat-providers';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;

export const prerender = false;

// Cache para la base de conocimientos (se carga una sola vez)
let knowledgeCache: { base: string; calendario: string; siteContent: string } | null = null;

async function loadKnowledgeBase() {
  if (knowledgeCache) return knowledgeCache;

  const basePath = path.join(process.cwd(), 'src', 'data');
  
  let base = '';
  let calendario = '';
  let siteContent = '';

  try {
    base = await fs.readFile(path.join(basePath, 'unag-knowledge.md'), 'utf-8');
  } catch (error) {
    console.warn('No se pudo cargar la base de conocimientos:', error);
  }

  try {
    calendario = await fs.readFile(path.join(basePath, 'calendario_academico.md'), 'utf-8');
  } catch (error) {
    console.warn('No se pudo cargar el calendario académico:', error);
  }

  try {
    siteContent = await fs.readFile(path.join(basePath, 'site-content.md'), 'utf-8');
  } catch (error) {
    console.warn('No se pudo cargar el contenido del sitio:', error);
  }

  knowledgeCache = { base, calendario, siteContent };
  return knowledgeCache;
}

function buildSystemPrompt(knowledge: { base: string; calendario: string; siteContent: string }): string {
  return `
    Eres un asistente virtual útil y amigable para la Universidad Nacional de Agricultura (UNAG) de Honduras.
    Tu objetivo es ayudar a estudiantes, aspirantes y visitantes con información sobre la universidad.
    
    Instrucciones clave:
    1. Solo responde preguntas relacionadas con la UNAG (carreras, admisiones, historia, ubicación, vida estudiantil, etc.).
    2. Si te preguntan sobre otros temas no relacionados, responde amablemente que solo puedes asistir con información de la UNAG.
    3. Mantén un tono profesional, motivador y cortés.
    4. La UNAG está ubicada en Catacamas, Olancho.
    5. Sé conciso pero informativo.
    6. Responde preguntas relacionadas con la agricultura.
    7. Busca primeramente información localmente y luego en internet si no la sabes.
    8. Prioriza información actualizada del calendario académico oficial.
    9. Eres el asistente del sitio oficial de la UNAG, por lo que debes usar la información del contenido del sitio para responder preguntas específicas sobre la página.
    10. No puedes generar documentos como pdfs, solo puedes proporcionar texto plano.
    11. Usa buena ortografía y gramática en tus respuestas en español.
    12. Cuando te pregunten por páginas específicas, usa la información del contenido del sitio.
    13. Cuando menciones páginas del sitio, usa siempre la URL completa con https://unag.edu.hn como prefijo. Por ejemplo: [Ver más](https://unag.edu.hn/organizacion/rectoria/rector). Nunca uses rutas relativas como /organizacion/...

    INFORMACIÓN OFICIAL DE LA UNAG:
    ${knowledge.base}

    CALENDARIO ACADÉMICO OFICIAL:
    ${knowledge.calendario}

    CONTENIDO DEL SITIO WEB:
    ${knowledge.siteContent}
  `;
}

export const POST: APIRoute = async ({ request }) => {
  // Rate limiting
  const ip = getClientIp(request);
  const { allowed, remaining, resetInMs } = checkRateLimit(ip);

  if (!allowed) {
    const retryAfter = Math.ceil(resetInMs / 1000);
    return new Response(
      JSON.stringify({
        error: 'Too many requests. Please wait before sending another message.',
        code: 'RATE_LIMITED',
        retryAfterSeconds: retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { messages, provider = 'openai' } = body as { 
      messages?: ChatMessage[]; 
      provider?: ProviderType;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate message count and content length
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `Message history exceeds the ${MAX_MESSAGES}-message limit.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const oversized = messages.some(
      (m) => typeof m.content !== 'string' || m.content.length > MAX_MESSAGE_LENGTH
    );
    if (oversized) {
      return new Response(
        JSON.stringify({ error: `Each message must be under ${MAX_MESSAGE_LENGTH} characters.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Cargar base de conocimientos (con cache)
    const knowledge = await loadKnowledgeBase();
    const systemPrompt = buildSystemPrompt(knowledge);

    // Obtener el provider correcto usando el factory
    const chatProvider = getChatProvider(provider);

    const reply = await chatProvider({
      systemPrompt,
      messages,
    });

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': String(remaining),
      },
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);

    // Error de quota (429)
    if (error.status === 429 || error.message?.includes('quota')) {
      return new Response(JSON.stringify({ 
        error: 'Quota exceeded. Please try again later.',
        code: 'QUOTA_EXCEEDED'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Error de API key no configurada
    if (error.message?.includes('API_KEY')) {
      return new Response(JSON.stringify({ 
        error: error.message,
        code: 'API_KEY_MISSING'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      error: error.message || 'Internal Server Error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
