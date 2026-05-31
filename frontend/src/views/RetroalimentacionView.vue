<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";

const router = useRouter();
const progreso = useProgresoStore();
</script>

<template>
  <main class="mx-auto max-w-5xl">
    <section class="geo-card rounded-3xl p-8 md:p-10">
      <span class="badge border-0 bg-[var(--coral)]/30">Retroalimentación</span>
      <h1 class="mt-4 text-3xl font-black md:text-5xl">Revisa cómo te fue</h1>
      <p class="mt-4 text-slate-600">
        Esta pantalla resumirá aciertos, errores y recomendaciones antes de registrar la calificación final.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl bg-[var(--mint)]/20 p-5">
          <p class="text-sm font-semibold uppercase tracking-[0.2em]">Aciertos</p>
          <p class="mt-2 text-3xl font-black">{{ progreso.puntaje }}</p>
        </div>
        <div class="rounded-2xl bg-[var(--sky)]/20 p-5">
          <p class="text-sm font-semibold uppercase tracking-[0.2em]">Total</p>
          <p class="mt-2 text-3xl font-black">{{ progreso.totalPreguntas }}</p>
        </div>
      </div>

      <div class="mt-8 flex gap-3">
        <button class="btn border-0 bg-[var(--mint)] text-[var(--ink)]" @click="router.push('/calificacion')">Ir a calificación</button>
        <button class="btn btn-ghost" @click="router.push('/actividad/1')">Volver a actividad</button>
      </div>
    </section>
  </main>
</template>