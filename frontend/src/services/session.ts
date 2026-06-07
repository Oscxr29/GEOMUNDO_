import api from './api';

export interface ISavedResponse {
  preguntaId: string;
  opcionId: string | null;
}

export interface ISaveSesion {
  estudiante?: string;
  tema?: string;
  actividad?: string;
  actividadId?: string;
  puntaje: number;
  totalPreguntas: number;
  respuestas?: ISavedResponse[];
}

export async function saveSesionCalificacion(payload: ISaveSesion) {
  const res = await api.post('/sesiones/calificacion', payload);
  return res.data;
}
