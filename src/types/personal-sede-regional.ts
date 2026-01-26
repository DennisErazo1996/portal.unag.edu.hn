export type PersonalSedeRegional = {
  nombreCompleto: string;
  nombre?: string;
  apellido?: string;
  cargo: string;
  correo: string;
  perfil?: string;
};

export type PersonalDocenteArea = {
  area: string;
  docentes: string[];
};
