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
    preguntaActual: 0,          // ← NUEVO: índice 0-based de la pregunta visible
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
    setPreguntaActual(index: number) {     // ← NUEVO
      this.preguntaActual = index;
    },
    limpiarEvaluacion() {
      this.puntaje = 0;
      this.totalPreguntas = 0;
      this.preguntaActual = 0;            // ← reset también
      this.respuestas = [];
    },
  },
});