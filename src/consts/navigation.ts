// src/consts/navigation.ts
import type { NavItem } from '@/types/navigation';

const NAV_ITEMS: NavItem[] = [
  {
    type: 'link',
    label: 'Inicio',
    href: '/',
    icon: 'Home',
  },
  {
    type: 'link',
    label: 'Noticias',
    href: 'https://portal.blog.unag.edu.hn',
    icon: 'Newspaper',
  },
  {
    type: 'dropdown',
    label: 'Acerca',
    icon: 'Info',
    children: [
      { type: 'link', label: 'Misión y Visión', href: '/acerca/mision-y-vision' },
      { type: 'link', label: 'Historia', href: '/acerca/historia/' },
      { type: 'link', label: 'Normativas', href: '/acerca/normativas' },
    ],
  },
  {
    type: 'dropdown',
    label: 'Organización',
    icon: 'Building2',
    children: [
      {
        type: 'group',
        title: 'Rectoría',
        children: [
          { type: 'link', label: 'Rector', href: '/organizacion/rectoria/rector' },
          { type: 'link', label: 'Unidad de Transparencia', href: '/organizacion/rectoria/unidad-de-transparencia' },
          { type: 'link', label: 'Unidad de Género', href: '/organizacion/rectoria/unidad-de-genero/' },
          { type: 'link', label: 'Comisionado Universitario de Derechos Humanos', href: '/organizacion/rectoria/comisionado-universitario-de-derechos-humanos/' },
          { type: 'link', label: 'Asesoría Legal', href: '/organizacion/rectoria/asesoria-legal/' },
          { type: 'link', label: 'SEPEG', href: '/organizacion/rectoria/sepeg/' },
          { type: 'link', label: 'SETIC', href: 'https://setic.unag.edu.hn', target: '_blank' },
          { type: 'link', label: 'SEAPI', href: '/organizacion/rectoria/seapi/' },
        ],
      },
      {
        type: 'group',
        title: 'Vicerrectorías',
        children: [
          { type: 'link', label: 'Vicerrectoría Académica', href: '/organizacion/vicerrectorias/vicerrectoria-academica/' },
          { type: 'link', label: 'Vicerrectoría de Internacionalización', href: 'https://vri.unag.edu.hn/', target: '_blank' },
          { type: 'link', label: 'Vicerrectoría de Vida Estudiantil', href: 'https://vve.unag.edu.hn/', target: '_blank' },
        ],
      },
      { type: 'link', label: 'Secretaría General', href: '/organizacion/secretaria-general/' },
      {
        type: 'group',
        title: 'Facultades',
        children: [
          { type: 'link', label: 'Facultad de Ciencias', href: '/organizacion/facultades/facultad-de-ciencias/' },
          { type: 'link', label: 'Facultad de Ciencias Agrarias', href: '/organizacion/facultades/facultad-de-ciencias-agrarias/' },
          { type: 'link', label: 'Facultad de Ciencias de la Tierra y la Conservación', href: '/organizacion/facultades/facultad-de-ciencias-de-la-tierra-y-la-conservacion/' },
          { type: 'link', label: 'Facultad de Ciencias Tecnológicas', href: '/organizacion/facultades/facultad-de-ciencias-tecnologicas/' },
          { type: 'link', label: 'Facultad de Medicina Veterinaria y Zootecnia', href: '/organizacion/facultades/facultad-de-medicina-veterinaria-y-zootecnia/' },
          { type: 'link', label: 'Facultad de Ciencias Económicas y Administrativas', href: '/organizacion/facultades/facultad-de-ciencias-economicas-y-administrativas/' },
        ],
      },
      {
        type: 'group',
        title: 'Direcciones Académicas',
        children: [
          { type: 'link', label: 'Sistema de Docencia e Innovación Educativa', href: 'https://dasdie.unag.edu.hn/', target: '_blank' },
          { type: 'link', label: 'Sistema de Admisión', href: '/organizacion/direcciones-academicas/sistema-de-admision/' },
          { type: 'link', label: 'Sistema de Autoevaluación para la Acreditación de la Calidad Educativa', href: 'https://dasaace.unag.edu.hn/', target: '_blank' },
          { type: 'link', label: 'Sistema Académico de Cultura, Artes y Deportes', href: '/organizacion/direcciones-academicas/sistema-academico-de-cultura-artes-y-deportes/' },
          { type: 'link', label: 'Sistema de Investigación y Postgrado', href: '/organizacion/direcciones-academicas/sistema-de-investigacion-y-posgrado/' },
          { type: 'link', label: 'Sistema de Vinculación Universidad Sociedad', href: '/organizacion/direcciones-academicas/sistema-de-vinculacion-universidad-sociedad/' },
        ],
      },
      {
        type: 'group',
        title: 'Sedes Regionales',
        children: [
          { type: 'link', label: 'Comayagua', href: '/organizacion/sedes-regionales/comayagua/' },
          { type: 'link', label: 'Tomalá', href: '/organizacion/sedes-regionales/tomala/' },
          { type: 'link', label: 'Mistruck', href: '/organizacion/sedes-regionales/mistruck/' },
        ],
      },
      { type: 'link', label: 'Junta de Dirección Universitaria', href: '/organizacion/junta-de-direccion-universitaria/' },
    ],
  },
  {
    type: 'dropdown',
    label: 'Plataformas',
    icon: 'Server',
    children: [
      { type: 'link', label: 'Ingresar ERP', href: 'https://erp.unag.edu.hn/', target: '_blank' },
      { type: 'link', label: 'SysUNAG', href: 'https://sys.unag.edu.hn/login', target: '_blank' },
      { type: 'link', label: 'Sistema de Egresados', href: 'https://sys.unag.edu.hn/login_egresados', target: '_blank' },
      { type: 'link', label: 'Campus Virtual', href: 'https://moodle.unag.edu.hn', target: '_blank' },
      { type: 'link', label: 'Sistema de Educación a Distancia', href: 'https://sed.unag.edu.hn/', target: '_blank' },
    ],
  },
  {
    type: 'carreras',
    label: 'Carreras',
    icon: 'GraduationCap',
  },
  {
    type: 'dropdown',
    label: 'Biblioteca',
    icon: 'BookOpen',
    children: [
      { type: 'link', label: 'Catálogo', href: 'https://biblioteca-intra.unag.edu.hn:8000/' },
      { type: 'link', label: 'Recursos Descargables', href: 'https://portal.unag.edu.hn/recursos-descargables/' },
    ],
  },
  {
    type: 'dropdown',
    label: 'Transparencias',
    icon: 'Eye',
    children: [
      { type: 'link', label: 'Portal IAIP', href: 'https://portalunico.iaip.gob.hn/#/portal=371' },
      { type: 'link', label: 'SIELHO IAIP', href: 'https://sielho.iaip.gob.hn/solicitud/solicitante/registrar/' },
    ],
  },
  {
    type: 'dropdown',
    label: 'Admisión',
    icon: 'UserPlus',
    children: [
      { type: 'link', label: 'Procesos de Admisión', href: '/admisiones/procesos-de-admision' },
      { type: 'link', label: 'Etapas del Proceso de Admisión', href: '/admisiones/etapas-del-proceso-de-admision/' },
      { type: 'link', label: 'Validación de Pago', href: '/admisiones/validacion-de-pago' },
      { type: 'link', label: 'Instrucciones para el Día de la Prueba', href: '/admisiones/normativas-prueba-de-admision' },
      { type: 'link', label: 'Requisitos', href: '/admisiones/requisitos/' },
      { type: 'link', label: 'Preguntas Frecuentes', href: '/admisiones/preguntas-frecuentes' },
    ],
  },
  {
    type: 'dropdown',
    label: 'COCOIN',
    icon: 'FlaskConical',
    children: [
      { type: 'link', label: 'Componentes', href: '/cocoin/' },
      { type: 'link', label: 'ONADICI', href: 'https://www.onadici.gob.hn/' },
    ],
  },
  {
    type: 'dropdown',
    label: 'CGU',
    icon: 'Award',
    children: [
      { type: 'link', label: 'Actas de Reuniones', href: '/comision-para-la-gestion-universitaria/actas-de-reuniones' },
      { type: 'link', label: 'Decreto No. 9-2026', href: '/documents/cgu/decreto-cgu-2026.pdf' },
    ],
  },
];

export default NAV_ITEMS;
