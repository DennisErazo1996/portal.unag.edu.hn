import type { Docente } from "@/types/docente";
import type { Departamento } from "@/types/departamento";

const docentesFacultadCiencias : Docente[] = [
  {
    nombreCompleto: "Elky Marcela Bock Argueta",
    nombre: "Elky",
    apellido: "Bock",
    cargo: "Decana",
    grado: "M.Sc. en Gestión de Proyectos de Desarrollo",
    area: "",
    correo: "ebock@unag.edu.hn",
  },
  {
    nombreCompleto: "Glenda Esperanza Rodríguez",
    nombre: "Glenda",
    apellido: "Rodríguez",
    cargo: "Secretaria de Facultad",
    grado: "Licenciatura en Letras y Lenguas",
    area: "Área de desempeño profesional: Letras y Lenguas",
    correo: "grodriguez@unag.edu.hn",
  },
  {
    nombreCompleto: "Douglas Domingo Flores",
    nombre: "Douglas",
    apellido: "Flores",
    cargo: "Jefe de departamento académico de Biología y Microbiología",
    grado: "M.Sc. en Economía y Desarrollo",
    area: "Área de desempeño profesional: Biología",
    correo: "dflores@unag.edu.hn",
  },
  {
    nombreCompleto: "Elky Marcela Bock",
    nombre: "Elky",
    apellido: "Bock",
    cargo: "Jefe de departamento académico de Química",
    grado: "M.Sc. en procesamiento de Alimentos",
    area: "Área de desempeño profesional: Química",
    correo: "ebock@unag.edu.hn",
  },
  {
    nombreCompleto: "Luis Francisco Rivera",
    nombre: "Luis",
    apellido: "Rivera",
    cargo: "Jefe de departamento académico de Matemática, Física e Informática",
    grado: "Licenciatura en Matemáticas",
    area: "Área de desempeño profesional: Matemáticas",
    correo: "lrivera@unag.edu.hn",
  },
  {
    nombreCompleto: "Marla Jiménez",
    nombre: "Marla",
    apellido: "Jiménez",
    cargo: "Jefe de departamento académico",
    grado: "Licenciatura en Administración de Empresas Agrícolas",
    area: "Área de desempeño profesional: Administrativa",
    correo: "mjimenez@unag.edu.hn",
  },
];

export default docentesFacultadCiencias;

export const departamentosCiencias: Departamento[] = [
  {
    id: "biologia",
    nombre: "Biología y Microbiología",
    logo: "/img/facultades/facultad-ciencias/microbiologia-unag.png",
    placeholder: "BM",
    descripcion:
      "Departamento dedicado al estudio de los seres vivos, los microorganismos y sus interacciones con el entorno. Forma profesionales con sólidas bases en ciencias biológicas orientadas a la investigación y la salud.",
  },
  {
    id: "quimica",
    nombre: "Química",
    logo: "/img/facultades/facultad-ciencias/depto-quimica.png",
    placeholder: "Q",
    descripcion:
      "Departamento enfocado en el estudio de la materia, sus propiedades, composición y transformaciones. Ofrece formación teórica y práctica en química general, analítica y aplicada.",
  },
  {
    id: "damfi",
    nombre: "Matemática, Física e Informática",
    logo: "/img/facultades/facultad-ciencias/damfi-unag.png",
    placeholder: "MFI",
    descripcion:
      "Departamento que integra las ciencias exactas con la tecnología de la información. Promueve el pensamiento lógico-matemático y el desarrollo de competencias computacionales en sus estudiantes.",
  },
  {
    id: "letras",
    nombre: "Letras y Lenguas",
    logo: "/img/facultades/facultad-ciencias/depto-letras.png",
    placeholder: "LL",
    descripcion:
      "Departamento comprometido con el estudio del lenguaje, la literatura y las ciencias de la comunicación. Cultiva la expresión oral y escrita, la investigación lingüística y la apreciación literaria.",
  },
  {
    id: "sociales",
    nombre: "Sociales y Humanidades",
    logo: null,
    placeholder: "SH",
    descripcion:
      "Departamento orientado al análisis crítico de la sociedad, la historia y la cultura. Forma profesionales con visión humanista capaces de comprender y transformar su entorno social.",
  },
];