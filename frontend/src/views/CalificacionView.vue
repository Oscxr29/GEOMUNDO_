<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";
import { ref } from "vue";
import { saveSesionCalificacion } from "../services/session";

const router = useRouter();
const progreso = useProgresoStore();

const porcentaje = progreso.totalPreguntas > 0
  ? Math.round((progreso.puntaje / progreso.totalPreguntas) * 100)
  : 0;

const ringColor = porcentaje >= 80 ? "var(--jade)" : porcentaje >= 50 ? "var(--saffron)" : "var(--coral)";
const circumference = 2 * Math.PI * 58;
const strokeOffset = circumference - (porcentaje / 100) * circumference;

const saving = ref(false);
const message = ref<string | null>(null);
const saved = ref(false);

async function onGuardar() {
  message.value = null;
  saving.value = true;
  try {
    const payload = {
      estudiante: progreso.estudiante || undefined,
      tema: progreso.temaSeleccionado,
      actividad: progreso.actividadSeleccionada,
      actividadId: progreso.actividadId,
      puntaje: progreso.puntaje,
      totalPreguntas: progreso.totalPreguntas,
      respuestas: progreso.respuestas,
    };
    const res = await saveSesionCalificacion(payload);
    message.value = "¡Calificación guardada correctamente! 🎉";
    saved.value = true;
    console.log("Guardado:", res);
  } catch (err) {
    console.error(err);
    message.value = "Error al guardar la calificación. Intenta de nuevo.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <main class="mx-auto max-w-3xl">
    <section class="geo-card rounded-2xl p-8 md:p-12 anim-scale-in text-center">
      <span class="badge badge-jade">Calificación final</span>
      <h1 class="mt-4 text-3xl font-black md:text-4xl" style="color:var(--ink)">
        Resultado listo para guardar
      </h1>
      <p class="mt-2 text-sm" style="color:var(--ink-mid)">
        {{ progreso.estudiante ? `¡Bien hecho, ${progreso.estudiante}!` : '¡Bien hecho!' }}
        Aquí está tu resultado final.
      </p>

      <!-- Ring SVG centrado -->
      <div class="mt-8 flex justify-center">
        <div class="progress-ring" style="width:160px;height:160px">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="58" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="13"/>
            <circle
              cx="80" cy="80" r="58"
              fill="none"
              :stroke="ringColor"
              stroke-width="13"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeOffset"
              style="transition:stroke-dashoffset 1.2s ease"
            />
          </svg>
          <div class="progress-ring__label">
            <div class="text-4xl font-black" :style="{ color: ringColor }">{{ porcentaje }}%</div>
            <div class="text-xs mt-0.5" style="color:var(--ink-soft)">aciertos</div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mx-auto mt-8 grid max-w-md gap-3 text-left sm:grid-cols-3">
        <div class="mini-stat mini-stat-jade text-center">
          <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--jade-dk)">Tema</p>
          <p class="mt-2 text-sm font-black leading-snug" style="color:var(--ink)">
            {{ progreso.temaSeleccionado || '—' }}
          </p>
        </div>
        <div class="mini-stat mini-stat-azure text-center">
          <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--sky)">Actividad</p>
          <p class="mt-2 text-sm font-black leading-snug" style="color:var(--ink)">
            {{ progreso.actividadSeleccionada || '—' }}
          </p>
        </div>
        <div class="mini-stat mini-stat-saffron text-center">
          <p class="text-xs font-bold uppercase tracking-widest" style="color:#a07010">Aciertos</p>
          <p class="mt-2 text-2xl font-black" :style="{ color: ringColor }">
            {{ progreso.puntaje }}<span class="text-sm font-semibold" style="color:var(--ink-soft)">/{{ progreso.totalPreguntas }}</span>
          </p>
        </div>
      </div>

      <!-- Acciones -->
      <div class="mt-8 flex flex-col items-center gap-3">
        <div class="flex flex-wrap justify-center gap-3">
          <button
            class="btn btn-jade"
            @click="onGuardar"
            :disabled="saving || saved"
          >
            {{ saving ? '⏳ Guardando…' : saved ? '✅ Guardado' : '💾 Guardar calificación' }}
          </button>
          <button class="btn btn-azure" @click="router.push('/clasificacion')">
            🏆 Ver clasificación
          </button>
          <button class="btn btn-ghost" @click="router.push('/temas')">
            ↺ Empezar otra vez
          </button>
          <button class="btn btn-ghost" @click="router.push('/')">
            ← Inicio
          </button>
        </div>

        <p
          v-if="message"
          class="text-sm font-semibold mt-1"
          :style="{ color: saved ? 'var(--jade-dk)' : '#ff6b6b' }"
        >
          {{ message }}
        </p>
      </div>
    </section>
  </main>
</template>