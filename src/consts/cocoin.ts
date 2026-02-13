interface DocumentoCOCOIN {
  title: string;
  description?: string;
  date?: string;
  file: string;
}

interface CategoriaCOCOIN {
  categoria: string;
  documentos: DocumentoCOCOIN[];
}

const cocoinDocumentos: CategoriaCOCOIN[] = [
  {
    categoria: "1. Organización para la Implementación del MARCI",
    documentos: [
      {
        title: "1.1 Acta de compromiso para la implementación del MARCI",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/1.1-ACTA-DE-COMPROMISO-PARA-LA-IMPLEMENTACION-DEL-MARCI.pdf"
      },
      {
        title: "1.2 Acta de juramentación del Comité - COCOIN",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/1.2-ACTA-DE-JURAMENTACION-DEL-COMITE-COCOIN.pdf"
      },
      {
        title: "1.3 Acta de juramentación Subcomité - COCOIN",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/1.3-ACTA-DE-JURAMENTACION-SUBCOMITE-COCOIN.pdf"
      },
      {
        title: "1.4 Reglamento para la creación y funcionamiento del COCOIN",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/1.4-REGLAMENTO-PARA-LA-CREACION-Y-FUNCIONAMIENTO-DEL-COCOIN.pdf"
      },
      {
        title: "1.5 Plan anual de trabajo del COCOIN",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/1.5-PLAN-ANUAL-DE-TRABAJO-DEL-COCOIN.pdf"
      }
    ]
  },
  {
    categoria: "2. Componente Entorno de Control",
    documentos: [
      {
        title: "2.1 Políticas institucionales",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/2.1-POLITICAS-INSTITUCIONALES.pdf"
      },
      {
        title: "2.2 Plan de necesidades de personal",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/2.2-PLAN-DE-NECESIDADES-DE-PERSONAL.pdf"
      },
      {
        title: "2.3 Plan anual de capacitación",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/2.3-PLAN-ANUAL-DE-CAPACITACION.pdf"
      }
    ]
  },
  {
    categoria: "3. Componente Evaluación de Riesgos",
    documentos: [
      {
        title: "3.1 Evaluación de riesgos de la Unidad de Auditoría Interna",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.1.-EVALUACION-DE-RIESGOS-DE-LA-UNIDAD-DE-AUDITORIA-INTERNA.pdf"
      },
      {
        title: "3.2 Evaluación de riesgos de la Unidad de Asesoría Legal",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.2.-EVALUACION-DE-RIESGOS-DE-LA-UNIDAD-DE-ASESORIA-LEGAL.pdf"
      },
      {
        title: "3.3 Evaluación de riesgos de Almacén",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.3.-EVALUACION-DE-RIESGOS-DE-ALMACEN.pdf"
      },
      {
        title: "3.4 Evaluación de riesgos del Departamento de Contabilidad",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.4.-EVALUACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-CONTABILIDAD.pdf"
      },
      {
        title: "3.5 Evaluación de riesgos del Departamento de Tesorería",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.5.-EVALUACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-TESORERIA.pdf"
      },
      {
        title: "3.6 Evaluación de riesgos de la Unidad Administradora de Proyectos",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.6.-EVALUACION-DE-RIESGOS-DE-LA-UNIDAD-ADMINISTRADORA-DE-PROYECTOS.pdf"
      },
      {
        title: "3.7 Evaluación de riesgos de Unidades Ejecutoras",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.7.-EVALUACION-DE-RIESGOS-DE-UNIDADES-EJECUTORAS.pdf"
      },
      {
        title: "3.8 Evaluación de riesgos del Departamento de Preinterventoría",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.8.-EVALUACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-PREINTERVENTORIA.pdf"
      },
      {
        title: "3.9 Evaluación de riesgos del Departamento de Recursos Humanos",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.9.-EVALUACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-RECURSOS-HUMANOS.pdf"
      },
      {
        title: "3.10 Evaluación de riesgos del Departamento de Bienes Nacionales",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.10.-EVALUACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-BIENES-NACIONALES.pdf"
      },
      {
        title: "3.11 Evaluación de riesgos del Departamento de Proveeduría",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.11.-EVALUACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-PROVEEDURIA.pdf"
      },
      {
        title: "3.12 Evaluación de riesgos del Departamento de Presupuesto UNAG",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.12.-EVALUACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-PRESUPUESTO-UNAG.pdf"
      }
    ]
  },
  {
    categoria: "4. Componente Actividades de Control",
    documentos: [
      {
        title: "4.1 Plan de mitigación de riesgos de la Unidad Auditoría Interna",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.1-PLAN-DE-MITIGACION-DE-RIESGOS-DE-LA-UNIDAD-AUDITORIA-INTERNA.pdf"
      },
      {
        title: "4.2 Plan de mitigación de riesgos de la Unidad de Asesoría Legal",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.2-PLAN-DE-MITIGACION-DE-RIESGOS-DE-LA-UNIDAD-DE-ASESORIA-LEGAL.pdf"
      },
      {
        title: "4.3 Plan de mitigación de riesgos de Almacén",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.3-PLAN-DE-MITIGACION-DE-RIESGOS-DE-ALMACEN.pdf"
      },
      {
        title: "4.4 Plan de mitigación de riesgos del Departamento de Contabilidad",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.4-PLAN-DE-MITIGACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-CONTABILIDAD.pdf"
      },
      {
        title: "4.5 Plan de mitigación de riesgos del Departamento de Tesorería",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.5-PLAN-DE-MITIGACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-TESORERIA.pdf"
      },
      {
        title: "4.6 Plan de mitigación de riesgos de la Unidad Administradora de Proyectos",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.6-PLAN-DE-MITIGACION-DE-RIESGOS-DE-LA-UNIDAD-ADMINISTRADORA-DE-PROYECTOS.pdf"
      },
      {
        title: "4.7 Plan de mitigación de riesgos de Unidades Ejecutoras",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.7-PLAN-DE-MITIGACION-DE-RIESGOS-DE-UNIDADES-EJECUTORAS.pdf"
      },
      {
        title: "4.8 Plan de mitigación de riesgos del Departamento de Preinterventoría",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.8-PLAN-DE-MITIGACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-PREINTERVENTORIA.pdf"
      },
      {
        title: "4.9 Plan de mitigación de riesgos del Departamento de Recursos Humanos",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.9-PLAN-DE-MITIGACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-RECURSOS-HUMANOS.pdf"
      },
      {
        title: "4.10 Plan de mitigación de riesgos del Departamento de Bienes Nacionales",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.10-PLAN-DE-MITIGACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-BIENES-NACIONALES.pdf"
      },
      {
        title: "4.11 Plan de mitigación de riesgos del Departamento de Proveeduría",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.11-PLAN-DE-MITIGACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-PROVEEDURIA.pdf"
      },
      {
        title: "4.12 Plan de mitigación de riesgos del Departamento de Presupuesto",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/3.12.-EVALUACION-DE-RIESGOS-DEL-DEPARTAMENTO-DE-PRESUPUESTO-UNAG.pdf"
      },
      {
        title: "4.13 Plan de tecnología",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.13-PLAN-DE-TECNOLOGIA.pdf"
      },
      {
        title: "4.14 Informe de cumplimiento de planificación institucional I trimestre",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.14-INFORME-DE-CUMPLIMIENTO-DE-PLANIFICACION-INSTITUCIONAL-I-TRIMESTRE.pdf"
      },
      {
        title: "4.15 Informe de cumplimiento de planificación institucional II trimestre",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.15-INFORME-DE-CUMPLIMIENTO-DE-PLANIFICACION-INSTITUCIONAL-II-TRIMESTRE.pdf"
      },
      {
        title: "4.16 Plan anual de vacaciones",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.16-PLAN-ANUAL-DE-VACACIONES.pdf"
      },
      {
        title: "4.17 Registro de cauciones y fianzas",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/4.17-REGISTRO-DE-CAUCIONES-Y-FIANZAS.pdf"
      }
    ]
  },
  {
    categoria: "5. Componente de Información y Comunicación",
    documentos: [
      {
        title: "5.1 Información interna mínima",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/5.1-INFORMACION-INTERNA-MINIMA.pdf"
      },
      {
        title: "5.2 Información externa mínima",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/09/5.2-INFORMACION-EXTERNA-MINIMA.pdf"
      },
      {
        title: "Boletín COCOIN - Edición No. 1",
        date: "Abril 2023",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/10/COCOIN-Boletin-informativo-edicion-n°-1.pdf"
      },
      {
        title: "Boletín COCOIN - Edición No. 2",
        date: "Junio 2023",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/10/COCOIN-Boletin-informativo-edicion-n°-2.pdf"
      },
      {
        title: "Boletín COCOIN - Edición No. 3",
        date: "Septiembre 2023",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/11/COCOIN-Boletin-informativo-edicion-n°-3.pdf"
      },
      {
        title: "Boletín COCOIN - Edición No. 4",
        date: "Diciembre 2023",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2023/12/COCOIN-Boletin-informativo-edicion-n°-4.pdf"
      },
      {
        title: "Boletín COCOIN - Edición No. 5",
        date: "Enero - Marzo 2025",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2025/04/cocoin-boletin-informativo-edicion-5.pdf"
      },
      {
        title: "Boletín COCOIN - Edición No. 6",
        date: "Abril - Junio 2025",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2025/07/BOLETIN_COCOIN_ABRIL_JUNIO_2025-min.pdf"
      },
      {
        title: "Boletín COCOIN - Edición No. 8",
        date: "Octubre - Noviembre 2025",
        file: "https://portal.unag.edu.hn/wp-content/uploads/2025/12/Boletin-informativo-N-8-COCOIN-UNAG-Octubre_Noviembre-2025-min.pdf"
      }
    ]
  }
];

export default cocoinDocumentos;
