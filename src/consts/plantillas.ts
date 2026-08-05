export interface Plantilla {
  nombre: string;
  descripcion?: string;
  archivo: string;
  miniatura: string;
  formato: 'DOCX' | 'PPTX' | 'PNG';
  fondoOscuro?: boolean;
  orientacion?: 'horizontal' | 'vertical';
}

export interface GrupoPlantillas {
  id: string;
  nombre: string;
  descripcion: string;
  items: Plantilla[];
}

export const gruposPlantillas: GrupoPlantillas[] = [
  {
    id: 'logos',
    nombre: 'Logos',
    descripcion: 'Logotipo y escudo institucional en sus variantes de color, negro y blanco.',
    items: [
      {
        nombre: 'Logotipo UNAG',
        descripcion: 'Versión a color',
        archivo: '/documents/plantillas/logos/unag-color.png',
        miniatura: '/documents/plantillas/logos/unag-color.png',
        formato: 'PNG',
        orientacion: 'horizontal'
      },
      {
        nombre: 'Logotipo UNAG',
        descripcion: 'Versión en negro',
        archivo: '/documents/plantillas/logos/unag-negro.png',
        miniatura: '/documents/plantillas/logos/unag-negro.png',
        formato: 'PNG',
        orientacion: 'horizontal'
      },
      {
        nombre: 'Logotipo UNAG',
        descripcion: 'Versión en negativo',
        archivo: '/documents/plantillas/logos/unag-blanco.png',
        miniatura: '/documents/plantillas/logos/unag-blanco.png',
        formato: 'PNG',
        fondoOscuro: true,
        orientacion: 'horizontal'
      },
      {
        nombre: 'Escudo UNAG',
        descripcion: 'Versión a color',
        archivo: '/documents/plantillas/logos/unag-escudo-color.png',
        miniatura: '/documents/plantillas/logos/unag-escudo-color.png',
        formato: 'PNG',
        orientacion: 'vertical'
      },
      {
        nombre: 'Escudo UNAG — Negro',
        descripcion: 'Versión en negro',
        archivo: '/documents/plantillas/logos/unag-escudo-negro.png',
        miniatura: '/documents/plantillas/logos/unag-escudo-negro.png',
        formato: 'PNG',
        orientacion: 'vertical'
      },
      {
        nombre: 'Escudo UNAG — Blanco',
        descripcion: 'Versión en negativo',
        archivo: '/documents/plantillas/logos/unag-escudo-blanco.png',
        miniatura: '/documents/plantillas/logos/unag-escudo-blanco.png',
        formato: 'PNG',
        fondoOscuro: true,
        orientacion: 'vertical'
      },
      {
        nombre: 'Logo Oficial — Color',
        descripcion: 'Escudo y logotipo combinados.',
        archivo: '/documents/plantillas/logos/unag-oficial-color.png',
        miniatura: '/documents/plantillas/logos/unag-oficial-color.png',
        formato: 'PNG',
        orientacion: 'horizontal'
      },
      {
        nombre: 'Logo Oficial — Negro',
        descripcion: 'Escudo y logotipo combinados.',
        archivo: '/documents/plantillas/logos/unag-oficial-negro.png',
        miniatura: '/documents/plantillas/logos/unag-oficial-negro.png',
        formato: 'PNG',
        orientacion: 'horizontal'
      },
      {
        nombre: 'Logo Oficial — Blanco',
        descripcion: 'Escudo y logotipo combinados.',
        archivo: '/documents/plantillas/logos/unag-oficial-blanco.png',
        miniatura: '/documents/plantillas/logos/unag-oficial-blanco.png',
        formato: 'PNG',
        fondoOscuro: true,
        orientacion: 'horizontal'
      },
    ],
  },
  // {
  //   id: 'portadas',
  //   nombre: 'Portadas',
  //   descripcion: 'Portadas institucionales para documentos e informes en formato Word.',
  //   items: [
  //     {
  //       nombre: 'Portada — Cultivos',
  //       archivo: '/documents/plantillas/portadas/portada-unag-cultivos.docx',
  //       miniatura: '/img/plantillas/portada-unag-cultivos.png',
  //       formato: 'DOCX',
  //       orientacion: 'vertical'
  //     },
  //     {
  //       nombre: 'Portada — Verde Oscuro',
  //       archivo: '/documents/plantillas/portadas/portada-unag-darkgreen.docx',
  //       miniatura: '/img/plantillas/portada-unag-darkgreen.jpeg',
  //       formato: 'DOCX',
  //       orientacion: 'vertical'
  //     },
  //     {
  //       nombre: 'Portada — Rombos',
  //       archivo: '/documents/plantillas/portadas/portada-unag-rombos.docx',
  //       miniatura: '/img/plantillas/portada-unag-rombos.png',
  //       formato: 'DOCX',
  //       orientacion: 'vertical'
  //     },
  //   ],
  // },
  {
    id: 'diplomas',
    nombre: 'Diplomas',
    descripcion: 'Plantillas de diploma y reconocimiento en formato Word.',
    items: [
      {
        nombre: 'Reconocimiento — Modelo 1',
        descripcion: 'Diploma para galardones y reconocimientos.',
        archivo: '/documents/plantillas/diplomas/plantilla-diploma.docx',
        miniatura: '/img/plantillas/plantilla-diploma.jpeg',
        formato: 'DOCX',
        orientacion: 'vertical'
      },
      {
        nombre: 'Diploma — Modelo 1',
        descripcion: 'Diploma para eventos.',
        archivo: '/documents/plantillas/diplomas/plantilla-diploma-2.docx',
        miniatura: '/img/plantillas/plantilla-diploma-2.png',
        formato: 'DOCX',
        orientacion: 'horizontal'
      },
      {
        nombre: 'Reconocimiento - Modelo 2',
        descripcion: 'Diploma para galardones y reconocimientos.',
        archivo: '/documents/plantillas/diplomas/plantilla-reconocimiento.docx',
        miniatura: '/img/plantillas/plantilla-reconocimiento.png',
        formato: 'DOCX',
        orientacion: 'vertical'
      },
    ],
  },
  {
    id: 'presentaciones',
    nombre: 'Presentaciones',
    descripcion: 'Plantillas de PowerPoint para presentaciones institucionales.',
    items: [
      {
        nombre: 'Presentación — Cultivos',
        descripcion: 'Plantilla de presentación con temática de cultivos.',
        archivo: '/documents/plantillas/presentaciones/presentacion-unag-cultivos.pptx',
        miniatura: '/img/plantillas/presentacion-unag-cultivos.jpeg',
        formato: 'PPTX',
        orientacion: 'horizontal'
      },
      {
        nombre: 'Presentación — Leche',
        descripcion: 'Plantilla de presentación con temática de lácteos.',
        archivo: '/documents/plantillas/presentaciones/presentacion-unag-leche.pptx',
        miniatura: '/img/plantillas/presentacion-unag-leche.jpeg',
        formato: 'PPTX',
        orientacion: 'horizontal'
      },
      {
        nombre: 'Presentación — Montañas',
        descripcion: 'Plantilla de presentación con temática de montañas.',
        archivo: '/documents/plantillas/presentaciones/presentacion-unag-mountains.pptx',
        miniatura: '/img/plantillas/presentacion-unag-mountains.jpeg',
        formato: 'PPTX',
        orientacion: 'horizontal'
      },
    ],
  },
];

export default gruposPlantillas;
