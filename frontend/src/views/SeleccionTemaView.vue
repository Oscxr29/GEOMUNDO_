<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";
import { themeCatalog, type ThemeContent } from "../data/catalog";

const router = useRouter();
const progreso = useProgresoStore();

function seleccionarTema(id: string, nombre: string, activityId: string, activityName: string) {
  progreso.setTemaId(id);
  progreso.setTema(nombre);
  progreso.setActividadId(activityId);
  progreso.setActividad(activityName);
  router.push(`/actividad/${id}`);
}

function empezarTema(tema: ThemeContent) {
  const firstActivity = tema.activities[0];
  if (!firstActivity) return;

  seleccionarTema(tema.id, tema.title, firstActivity.id, firstActivity.title);
}
</script>

<template>
  <main class="mx-auto max-w-7xl">
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <span class="badge border-0 bg-[var(--sky)]/25 px-3 py-2 text-[var(--ink)]">Ruta de aprendizaje</span>
        <h1 class="mt-3 text-3xl font-black md:text-5xl">Selecciona un tema</h1>
        <p class="mt-2 max-w-3xl text-slate-600">Cada tema viene con actividades cortas, objetivo claro y retroalimentación para que el avance sea fácil de revisar.</p>
      </div>
      <button class="btn btn-ghost self-start md:self-auto" @click="router.push('/')">Volver</button>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <article v-for="tema in themeCatalog" :key="tema.id" class="geo-card rounded-[2rem] p-6 md:p-7">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span class="inline-flex rounded-full bg-[var(--sky)]/25 px-3 py-1 text-sm font-semibold text-[var(--ink)]">{{ tema.level }}</span>
            <h2 class="mt-4 text-2xl font-black md:text-3xl">{{ tema.icon }} {{ tema.title }}</h2>
            <p class="mt-2 text-slate-600">{{ tema.subtitle }}</p>
          </div>
          <div class="rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm">
            <p class="font-semibold text-[var(--ink)]">Duración</p>
            <p>{{ tema.duration }}</p>
          </div>
        </div>

        <p class="mt-4 max-w-2xl text-slate-600">{{ tema.description }}</p>

        <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-2xl bg-[var(--sky)]/15 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Enfoque</p>
            <p class="mt-1 font-semibold">{{ tema.focus }}</p>
          </div>
          <div class="rounded-2xl bg-[var(--mint)]/15 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actividades</p>
            <p class="mt-1 font-semibold">{{ tema.activities.length }} propuestas</p>
          </div>
          <div class="rounded-2xl bg-[var(--lilac)]/15 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nivel</p>
            <p class="mt-1 font-semibold">{{ tema.level }}</p>
          </div>
          <div class="rounded-2xl bg-[var(--coral)]/15 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Objetivo</p>
            <p class="mt-1 font-semibold">Aprendizaje observable</p>
          </div>
        </div>

        <div class="mt-6 grid gap-3 md:grid-cols-2">
          <div v-for="activity in tema.activities" :key="activity.id" class="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actividad</p>
            <h3 class="mt-2 text-xl font-bold">{{ activity.title }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ activity.description }}</p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              <span class="rounded-full bg-[var(--sky)]/20 px-3 py-1">Nivel {{ activity.level }}</span>
              <span class="rounded-full bg-[var(--mint)]/20 px-3 py-1">{{ activity.duration }}</span>
            </div>
          </div>
        </div>

        <button class="btn mt-6 border-0 bg-[var(--mint)] text-[var(--ink)]" @click="empezarTema(tema)">
          Empezar este tema
        </button>
      </article>
    </div>
  </main>
</template>