
import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = import.meta.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cargar la base de conocimientos de la UNAG
    const knowledgeBasePath = path.join(process.cwd(), 'src', 'data', 'unag-knowledge.md');
    let knowledgeBase = '';
    try {
      knowledgeBase = fs.readFileSync(knowledgeBasePath, 'utf-8');
    } catch (error) {
      console.warn('No se pudo cargar la base de conocimientos:', error);
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
      7. Usa buena ortografía y gramática en tus respuestas en español.
      8. Usa la informacion del sitio web de la UNAG para responder preguntas https://portal.unag.edu.hn.

      INFORMACIÓN OFICIAL DE LA UNAG:
      ${knowledgeBase}
    `;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Entendido. Soy el asistente virtual de la UNAG. Estoy listo para ayudar con información sobre la universidad, sus carreras, admisiones y más. ¿En qué puedo ayudarte hoy?" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error', stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};