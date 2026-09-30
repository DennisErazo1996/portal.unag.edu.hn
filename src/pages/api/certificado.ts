import type { APIRoute } from 'astro';
import { esCodigoValido, getCertificadoByCodigo } from '@/lib/strapi-certificados';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const codigo = (url.searchParams.get('codigo') || '').trim();

  if (!esCodigoValido(codigo)) {
    return new Response(JSON.stringify({ error: 'Código inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let certificado;
  try {
    certificado = await getCertificadoByCodigo(codigo);
  } catch {
    return new Response(JSON.stringify({ error: 'Error consultando el certificado' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!certificado) {
    return new Response(JSON.stringify({ error: 'Código no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const pdfRes = await fetch(certificado.url);
  if (!pdfRes.ok || !pdfRes.body) {
    return new Response(JSON.stringify({ error: 'No se pudo obtener el certificado' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(pdfRes.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificado-${codigo}.pdf"`,
    },
  });
};
