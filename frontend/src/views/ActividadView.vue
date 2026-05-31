<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";

const route = useRoute();
const router = useRouter();
const progreso = useProgresoStore();

const temaId = computed(() => String(route.params.temaId ?? ""));

function continuar() {
  progreso.setActividad(`Actividad del tema ${temaId.value}`);
  router.push("/retroalimentacion");
}
</script>

<template>
  <main class="mx-auto max-w-5xl">
    <section class="geo-card rounded-3xl p-8 md:p-10">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Actividad guiada</p>
      <h1 class="mt-3 text-3xl font-black md:text-5xl">Practica paso a paso</h1>
      <p class="mt-4 max-w-3xl text-slate-600">
        Aquí aparecerán las preguntas y opciones del tema seleccionado. Por ahora dejamos la estructura base lista para conectar con el backend.
      </p>

      <div class="mt-8 rounded-2xl bg-[var(--sky)]/15 p-5">
        <p class="font-semibold">Tema seleccionado:</p>
        <p class="text-lg">{{ progreso.temaSeleccionado || `Tema ${temaId}` }}</p>
      </div>

      <div class="mt-8 flex gap-3">
        <button class="btn border-0 bg-[var(--mint)] text-[var(--ink)]" @click="continuar">Ver retroalimentación</button>
        <button class="btn btn-ghost" @click="router.push('/temas')">Cambiar tema</button>
      </div>
    </section>
  </main>
</template>