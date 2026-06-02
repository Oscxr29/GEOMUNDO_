<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";
import { getThemeById } from "../data/catalog";

const route = useRoute();
const router = useRouter();
const progreso = useProgresoStore();

const temaId = computed(() => String(route.params.temaId ?? ""));
const tema = computed(() => getThemeById(temaId.value));
const actividad = computed(() => tema.value?.activities[0]);

function continuar() {
  if (!tema.value || !actividad.value) return;

  progreso.setTemaId(tema.value.id);
  progreso.setTema(tema.value.title);
  progreso.setActividadId(actividad.value.id);
  progreso.setActividad(actividad.value.title);
  progreso.setResultado(Math.max(actividad.value.checkpoints.length - 1, 0), actividad.value.checkpoints.length);
  router.push("/retroalimentacion");
}
</script>

<template>
  <main class="mx-auto max-w-6xl">
    <section class="geo-card rounded-[2rem] p-8 md:p-10">
      <div class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <span class="badge border-0 bg-[var(--coral)]/25 px-3 py-2 text-[var(--ink)]">Actividad guiada</span>
          <h1 class="mt-4 text-3xl font-black md:text-5xl">{{ actividad?.title || "Practica paso a paso" }}</h1>
          <p class="mt-4 max-w-3xl text-slate-600">
            Aquí verás la estructura de la actividad seleccionada, con objetivos claros y checkpoints de avance para revisar antes de guardar la calificación.
          </p>

          <div class="mt-6 grid gap-4 sm:grid-cols-3">
            <div class="rounded-3xl bg-white/80 p-4 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tema</p>
              <p class="mt-2 font-bold">{{ tema?.title || progreso.temaSeleccionado || `Tema ${temaId}` }}</p>
            </div>
            <div class="rounded-3xl bg-white/80 p-4 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Duración</p>
              <p class="mt-2 font-bold">{{ actividad?.duration || "4-5 min" }}</p>
            </div>
            <div class="rounded-3xl bg-white/80 p-4 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nivel</p>
              <p class="mt-2 font-bold">Nivel {{ actividad?.level || 1 }}</p>
            </div>
          </div>

          <div class="mt-8 rounded-[1.75rem] bg-[var(--sky)]/12 p-6">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Objetivo</p>
            <p class="mt-2 text-lg text-[var(--ink)]">{{ actividad?.objective || "Comprender y practicar el contenido paso a paso." }}</p>
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <button class="btn border-0 bg-[var(--mint)] text-[var(--ink)]" @click="continuar">Ver retroalimentación</button>
            <button class="btn btn-ghost" @click="router.push('/temas')">Cambiar tema</button>
          </div>
        </div>

        <div class="rounded-[1.75rem] bg-white/75 p-6 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Checkpoints</p>
          <ul class="mt-4 space-y-3">
            <li v-for="checkpoint in (actividad?.checkpoints || [])" :key="checkpoint" class="flex items-start gap-3 rounded-2xl bg-[var(--mint)]/12 p-4">
              <span class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--mint)] text-xs font-black text-[var(--ink)]">✓</span>
              <span class="text-slate-700">{{ checkpoint }}</span>
            </li>
          </ul>

          <div class="mt-6 rounded-3xl bg-[var(--lilac)]/12 p-5">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Descripción</p>
            <p class="mt-2 text-slate-700">{{ actividad?.description || "Actividad estructurada para continuar con la retroalimentación y el guardado de progreso." }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>