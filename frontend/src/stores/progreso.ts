export interface RespuestaSeleccionada {
  preguntaId: string;
  opcionId: string | null;
}

import { defineStore } from "pinia";

export const useProgresoStore = defineStore("progreso", {
  state: () => ({
    temaId: "",
    temaSeleccionado: "",
    actividadId: "",
    actividadSeleccionada: "",
    estudiante: "",
    puntaje: 0,
    totalPreguntas: 0,
    respuestas: [] as RespuestaSeleccionada[],
  }),
  actions: {
    setEstudiante(nombre: string) {
      this.estudiante = nombre;
    },
    setTemaId(temaId: string) {
      this.temaId = temaId;
    },
    setTema(tema: string) {
      this.temaSeleccionado = tema;
    },
    setActividadId(actividadId: string) {
      this.actividadId = actividadId;
    },
    setActividad(actividad: string) {
      this.actividadSeleccionada = actividad;
    },
    setResultado(puntaje: number, totalPreguntas: number) {
      this.puntaje = puntaje;
      this.totalPreguntas = totalPreguntas;
    },
    setRespuestas(respuestas: RespuestaSeleccionada[]) {
      this.respuestas = respuestas;
    },
    limpiarEvaluacion() {
      this.puntaje = 0;
      this.totalPreguntas = 0;
      this.respuestas = [];
    },
  },
});