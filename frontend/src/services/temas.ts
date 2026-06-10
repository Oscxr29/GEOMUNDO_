import api from "./api";

export interface ApiTema {
  id: string;
  nombre: string;
  descripcion: string;
  orden: number;
}

export interface ApiActividad {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: number;
  orden: number;
}

export interface TemaConActividades extends ApiTema {
  actividades: ApiActividad[];
}

export async function getTemas() {
  const response = await api.get("/tema");
  return response.data.data as ApiTema[];
}

export async function getActividadesByTemaId(temaId: string) {
  const response = await api.get(`/actividades/${temaId}`);
  return response.data.data as ApiActividad[];
}