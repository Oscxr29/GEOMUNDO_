import api from './api';

export interface ISaveSesion {
  estudiante?: string;
  tema?: string;
  actividad?: string;
  puntaje: number;
  totalPreguntas: number;
}

export async function saveSesionCalificacion(payload: ISaveSesion) {
  const res = await api.post('/sesiones/calificacion', payload);
  return res.data;
}
