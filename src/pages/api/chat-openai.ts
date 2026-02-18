import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
//import { PDFParse } from 'pdf-parse';

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
    const { messages } = body;

    if (!messages) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
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

    const calendarioAcademicoPath = path.join(process.cwd(), 'src', 'data', 'calendario_academico.md');
    let calendarioAcademico = '';
    try {
      calendarioAcademico = fs.readFileSync(calendarioAcademicoPath, 'utf-8');
    } catch (error) {
      console.warn('No se pudo cargar el calendario académico:', error);
    }

    
    // const calendarioPdfPath = path.join(process.cwd(), 'public', 'documents', 'calendario-academico.pdf');
    // let calendarioAcademico = '';
    // try {
    //   const dataBuffer = fs.readFileSync(calendarioPdfPath);
    //   const parser = new PDFParse({ data: dataBuffer });
    //   const pdfData = await parser.getText();
    //   calendarioAcademico = pdfData.text;
    // } catch (error) {
    //   console.warn('No se pudo cargar el calendario académico:', error);
    // }

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
      7. Busca primeramente informacion localmente y luego en internet si no la sabes.
      8. Prioriza infromación actualizada del calendario académico oficial.

      Aquí tienes información adicional y la del calendario académico oficial para ayudarte a responder mejor las preguntas:

      INFORMACIÓN OFICIAL DE LA UNAG:
      ${knowledgeBase}

      CALENDARIO ACADÉMICO OFICIAL:
      ${calendarioAcademico}
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      model: "gpt-4o-mini",
    });

    const text = completion.choices[0].message.content;

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    
    // Check for 429 error specifically (OpenAI also uses 429)
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
