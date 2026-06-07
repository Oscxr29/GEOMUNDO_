import { defineStore } from "pinia";

export const useProgresoStore = defineStore("progreso", {
  state: () => ({
    temaId: "",
    temaSeleccionado: "",
    actividadId: "",
    actividadSeleccionada: "",
    puntaje: 0,
    totalPreguntas: 0,
  }),
  persist: true,
  actions: {
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
  },
});