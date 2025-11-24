import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = import.meta.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY is not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `
      Eres un asistente virtual útil y amigable para la Universidad Nacional de Agricultura (UNAG) de Honduras.
      Tu objetivo es ayudar a estudiantes, aspirantes y visitantes con información sobre la universidad.
      
      Instrucciones clave:
      1. Solo responde preguntas relacionadas con la UNAG (carreras, admisiones, historia, ubicación, vida estudiantil, etc.).
      2. Si te preguntan sobre otros temas no relacionados, responde amablemente que solo puedes asistir con información de la UNAG.
      3. Mantén un tono profesional, motivador y cortés.
      4. La UNAG está ubicada en Catacamas, Olancho.
      5. Sé conciso pero informativo.
      6. Responde preguntas relacionadas con la agricultura.
      7. Usa la informacion del sitio web de la UNAG para responder preguntas https://portal.unag.edu.hn.
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "assistant", content: "Entendido. Soy el asistente virtual de la UNAG. Estoy listo para ayudar con información sobre la universidad, sus carreras, admisiones y más. ¿En qué puedo ayudarte hoy?" },
        { role: "user", content: message }
      ],
      // Usando modelo con búsqueda web integrada
      model: "gpt-4o-mini-search-preview",
    });

    const text = completion.choices[0].message.content;

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    
    if (error.status === 429) {
       return new Response(JSON.stringify({ 
         error: 'Quota exceeded. Please try again later.',
         code: 'QUOTA_EXCEEDED'
       }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error', stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
