import api from './api';

// ── existente — no se toca ──────────────────────────────────────
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

// ── NUEVO ───────────────────────────────────────────────────────
export interface IRankEntry {
  posicion:       number;
  id:             string;
  estudiante:     string;
  actividad:      string;
  tema:           string;
  puntaje:        number;
  totalPreguntas: number;
  fecha:          string;   // "YYYY-MM-DD"
}

export async function getRanking(actividad?: string, limit = 20): Promise<IRankEntry[]> {
  const params: Record<string, string | number> = { limit };
  if (actividad && actividad !== 'todas') params.actividad = actividad;

  const res = await api.get('/sesiones/ranking', { params });
  return res.data.data as IRankEntry[];
}