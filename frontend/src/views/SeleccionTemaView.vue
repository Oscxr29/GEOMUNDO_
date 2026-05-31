<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";

const router = useRouter();
const progreso = useProgresoStore();

const temas = [
  { id: "1", nombre: "Figuras planas", descripcion: "Círculo, triángulo, cuadrado y rectángulo." },
  { id: "2", nombre: "Perímetro", descripcion: "Suma de lados para rodear una figura." },
  { id: "3", nombre: "Área", descripcion: "Espacio que ocupa una superficie." },
];

function seleccionarTema(id: string, nombre: string) {
  progreso.setTema(nombre);
  router.push(`/actividad/${id}`);
}
</script>

<template>
  <main class="mx-auto max-w-6xl">
    <div class="mb-8 flex items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black md:text-5xl">Selecciona un tema</h1>
        <p class="mt-2 text-slate-600">Elige el contenido que vas a practicar primero.</p>
      </div>
      <button class="btn btn-ghost" @click="router.push('/')">Volver</button>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      <article v-for="tema in temas" :key="tema.id" class="geo-card rounded-3xl p-6">
        <span class="badge border-0 bg-[var(--sky)]/25">Tema disponible</span>
        <h2 class="mt-4 text-2xl font-bold">{{ tema.nombre }}</h2>
        <p class="mt-2 text-slate-600">{{ tema.descripcion }}</p>
        <button class="btn mt-6 border-0 bg-[var(--mint)] text-[var(--ink)]" @click="seleccionarTema(tema.id, tema.nombre)">
          Continuar
        </button>
      </article>
    </div>
  </main>
</template>