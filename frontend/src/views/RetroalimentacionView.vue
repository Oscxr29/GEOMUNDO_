<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";

const router = useRouter();
const progreso = useProgresoStore();
const porcentaje = progreso.totalPreguntas > 0 ? Math.round((progreso.puntaje / progreso.totalPreguntas) * 100) : 0;
</script>

<template>
  <main class="mx-auto max-w-6xl">
    <section class="geo-card rounded-[2rem] p-8 md:p-10">
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span class="badge border-0 bg-[var(--coral)]/30 px-3 py-2">Retroalimentación</span>
          <h1 class="mt-4 text-3xl font-black md:text-5xl">Revisa tu avance</h1>
          <p class="mt-4 max-w-3xl text-slate-600">
            Revisa el resultado antes de guardar la calificación final. Aquí verás el resumen del tema, la actividad y el porcentaje de acierto.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-3">
            <div class="rounded-3xl bg-[var(--mint)]/16 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Aciertos</p>
              <p class="mt-2 text-3xl font-black">{{ progreso.puntaje }}</p>
            </div>
            <div class="rounded-3xl bg-[var(--sky)]/16 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total</p>
              <p class="mt-2 text-3xl font-black">{{ progreso.totalPreguntas }}</p>
            </div>
            <div class="rounded-3xl bg-[var(--lilac)]/16 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Porcentaje</p>
              <p class="mt-2 text-3xl font-black">{{ porcentaje }}%</p>
            </div>
          </div>
        </div>

        <div class="rounded-[1.75rem] bg-white/80 p-6 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Resumen</p>
          <div class="mt-4 space-y-4 text-slate-700">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Tema</p>
              <p class="mt-1 text-lg font-bold text-[var(--ink)]">{{ progreso.temaSeleccionado || 'No seleccionado' }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Actividad</p>
              <p class="mt-1 text-lg font-bold text-[var(--ink)]">{{ progreso.actividadSeleccionada || 'No seleccionada' }}</p>
            </div>
            <div class="rounded-2xl bg-[var(--sky)]/12 p-4 text-sm">
              Si algo no salió bien, regresa a la actividad y vuelve a intentarlo antes de guardar el resultado final.
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button class="btn border-0 bg-[var(--mint)] text-[var(--ink)]" @click="router.push('/calificacion')">Ir a calificación</button>
            <button class="btn btn-ghost" @click="router.push('/temas')">Volver a temas</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>