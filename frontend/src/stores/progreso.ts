import { defineStore } from "pinia";

export const useProgresoStore = defineStore("progreso", {
  state: () => ({
    temaSeleccionado: "",
    actividadSeleccionada: "",
    puntaje: 0,
    totalPreguntas: 0,
  }),
  actions: {
    setTema(tema: string) {
      this.temaSeleccionado = tema;
    },
    setActividad(actividad: string) {
      this.actividadSeleccionada = actividad;
    },
    setResultado(puntaje: number, totalPreguntas: number) {
      this.puntaje = puntaje;
      this.totalPreguntas = totalPreguntas;
    },
  },
});