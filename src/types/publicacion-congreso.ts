export type PublicacionCongreso = {
  autores: string;
  titulo: string;
  evento: string;
  lugar: string;
  fecha: string;
  year: number;
  tipo?: 'oral' | 'poster';
}
