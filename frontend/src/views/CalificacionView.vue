<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";
import { ref } from "vue";
import { saveSesionCalificacion } from "../services/session";

const router = useRouter();
const progreso = useProgresoStore();

const porcentaje = progreso.totalPreguntas > 0 ? Math.round((progreso.puntaje / progreso.totalPreguntas) * 100) : 0;
const saving = ref(false);
const message = ref<string | null>(null);

async function onGuardar() {
  message.value = null;
  saving.value = true;
  try {
    const payload = {
      estudiante: undefined,
      tema: progreso.temaSeleccionado,
      actividad: progreso.actividadSeleccionada,
      puntaje: progreso.puntaje,
      totalPreguntas: progreso.totalPreguntas,
    };
    const res = await saveSesionCalificacion(payload);
    message.value = 'Calificación guardada correctamente.';
    console.log('Guardado:', res);
  } catch (err) {
    console.error(err);
    message.value = 'Error al guardar la calificación.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <main class="mx-auto max-w-6xl">
    <section class="geo-card rounded-[2rem] p-8 md:p-10 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Calificación final</p>
      <h1 class="mt-4 text-3xl font-black md:text-5xl">Resultado listo para guardar</h1>

      <div class="mt-10 flex justify-center">
        <div class="radial-progress text-[var(--mint)]" :style="{ '--value': porcentaje }" role="progressbar">
          {{ porcentaje }}%
        </div>
      </div>

      <div class="mx-auto mt-8 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
        <div class="rounded-3xl bg-[var(--mint)]/16 p-5">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tema</p>
          <p class="mt-2 font-bold text-[var(--ink)]">{{ progreso.temaSeleccionado || 'No seleccionado' }}</p>
        </div>
        <div class="rounded-3xl bg-[var(--sky)]/16 p-5">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actividad</p>
          <p class="mt-2 font-bold text-[var(--ink)]">{{ progreso.actividadSeleccionada || 'No seleccionada' }}</p>
        </div>
        <div class="rounded-3xl bg-[var(--lilac)]/16 p-5">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Aciertos</p>
          <p class="mt-2 font-bold text-[var(--ink)]">{{ progreso.puntaje }}/{{ progreso.totalPreguntas }}</p>
        </div>
      </div>

      <div class="mt-8 flex flex-col items-center gap-3">
        <div class="flex flex-wrap justify-center gap-3">
          <button class="btn border-0 bg-[var(--mint)] text-[var(--ink)]" @click="onGuardar" :disabled="saving">{{ saving ? 'Guardando...' : 'Guardar calificación' }}</button>
          <button class="btn btn-ghost" @click="router.push('/temas')">Empezar otra vez</button>
          <button class="btn btn-ghost" @click="router.push('/')">Ir al inicio</button>
        </div>
        <p v-if="message" class="text-sm text-slate-600">{{ message }}</p>
      </div>
    </section>
  </main>
</template>