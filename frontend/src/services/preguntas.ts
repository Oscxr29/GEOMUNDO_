import api from "./api";

export interface OpcionPregunta {
  id: string;
  texto: string;
  esCorrecta: boolean;
  orden: number;
}

export interface PreguntaActividad {
  id: string;
  enunciado: string;
  explicacion: string | null;
  orden: number;
  opciones: OpcionPregunta[];
  actividad?: {
    id: string;
    nombre: string;
    descripcion: string;
    nivel: number;
    orden: number;
  };
}

export async function getPreguntasByActividadId(actividadId: string) {
  const response = await api.get(`/pregunta/actividad/${actividadId}`);
  return response.data.data as PreguntaActividad[];
}