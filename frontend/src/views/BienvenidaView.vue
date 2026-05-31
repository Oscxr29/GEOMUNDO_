<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <main class="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
    <section class="geo-card w-full rounded-3xl p-8 md:p-12">
      <div class="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <span class="badge mb-4 border-0 bg-[var(--sky)]/30 text-[var(--ink)]">GeoMundo · 2° grado</span>
          <h1 class="text-4xl font-black leading-tight md:text-6xl">Aprende geometría jugando y resolviendo retos.</h1>
          <p class="mt-4 max-w-xl text-lg text-slate-600">
            Una experiencia guiada para reconocer figuras, practicar actividades y registrar tu avance de forma simple.
          </p>
          <button class="btn mt-8 border-0 bg-[var(--mint)] text-[var(--ink)] hover:bg-[var(--sky)]" @click="router.push('/temas')">
            Empezar
          </button>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-3xl bg-[var(--sky)]/20 p-5">
            <p class="text-sm font-semibold uppercase tracking-[0.2em]">Tema</p>
            <p class="mt-2 text-xl font-bold">Figuras geométricas</p>
          </div>
          <div class="rounded-3xl bg-[var(--lilac)]/20 p-5">
            <p class="text-sm font-semibold uppercase tracking-[0.2em]">Método</p>
            <p class="mt-2 text-xl font-bold">Paso a paso</p>
          </div>
          <div class="rounded-3xl bg-[var(--mint)]/20 p-5">
            <p class="text-sm font-semibold uppercase tracking-[0.2em]">Evaluación</p>
            <p class="mt-2 text-xl font-bold">Resultado final</p>
          </div>
          <div class="rounded-3xl bg-[var(--coral)]/25 p-5">
            <p class="text-sm font-semibold uppercase tracking-[0.2em]">Meta</p>
            <p class="mt-2 text-xl font-bold">Aprendizaje claro</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>