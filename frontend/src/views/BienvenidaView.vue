<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getTemas } from "../services/temas";

const router = useRouter();
const totalTemas = ref(0);
const errorCarga = ref<string | null>(null);

onMounted(async () => {
  try {
    totalTemas.value = (await getTemas()).length;
  } catch (error) {
    console.error(error);
    errorCarga.value = "No se pudieron cargar los temas. Verifica que el servidor esté activo.";
  }
});
</script>

<template>
  <main class="mx-auto max-w-6xl">
    <section class="hero-panel geo-card rounded-[2rem] p-8 md:p-12">
      <div class="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div class="space-y-6">
          <div class="space-y-3">
            <span class="badge border-0 bg-(--sky)/25 px-3 py-2 text-(--ink)">GeoMundo · 2° grado</span>
            <h1 class="max-w-2xl text-4xl font-black leading-tight md:text-6xl">Aprende geometría con retos cortos, contenido claro y seguimiento de avance.</h1>
            <p class="max-w-2xl text-lg text-slate-600 md:text-xl">
              Recorre temas en orden, resuelve actividades guiadas y revisa tu avance antes de registrar la calificación final.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button class="btn border-0 bg-(--mint) text-(--ink) hover:bg-(--sky)" @click="router.push('/temas')">
              Comenzar recorrido
            </button>
            <button class="btn btn-ghost" @click="router.push('/temas')">
              Ver temas disponibles
            </button>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-3xl bg-white/70 p-5 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Temas</p>
              <p class="mt-2 text-3xl font-black">{{ totalTemas }}</p>
              <p class="mt-1 text-sm text-slate-600">Bloques de aprendizaje listos.</p>
              <p v-if="errorCarga" class="mt-2 text-sm text-red-400">{{ errorCarga }}</p>
            </div>
            <div class="rounded-3xl bg-white/70 p-5 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Duración</p>
              <p class="mt-2 text-3xl font-black">10-12 min</p>
              <p class="mt-1 text-sm text-slate-600">Sesiones breves y guiadas.</p>
            </div>
            <div class="rounded-3xl bg-white/70 p-5 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Formato</p>
              <p class="mt-2 text-3xl font-black">Paso a paso</p>
              <p class="mt-1 text-sm text-slate-600">Ideal para pruebas en vivo.</p>
            </div>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <article class="rounded-[1.75rem] bg-(--sky)/18 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Tema destacado</p>
            <h2 class="mt-3 text-2xl font-black">Figuras planas</h2>
            <p class="mt-2 text-slate-600">Reconoce, clasifica y compara formas básicas con ejemplos cotidianos.</p>
          </article>
          <article class="rounded-[1.75rem] bg-(--lilac)/18 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Método</p>
            <h2 class="mt-3 text-2xl font-black">Aprendizaje guiado</h2>
            <p class="mt-2 text-slate-600">Cada actividad tiene objetivos claros, checkpoints y cierre final.</p>
          </article>
          <article class="rounded-[1.75rem] bg-(--mint)/18 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Evaluación</p>
            <h2 class="mt-3 text-2xl font-black">Registro de avance</h2>
            <p class="mt-2 text-slate-600">La calificación se guarda para verificar progreso en BD.</p>
          </article>
          <article class="rounded-[1.75rem] bg-(--coral)/22 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Meta</p>
            <h2 class="mt-3 text-2xl font-black">Ver resultados</h2>
            <p class="mt-2 text-slate-600">Revisa retroalimentación y vuelve a intentarlo si hace falta.</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>