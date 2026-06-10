<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";

const router = useRouter();
const progreso = useProgresoStore();
const porcentaje = progreso.totalPreguntas > 0
  ? Math.round((progreso.puntaje / progreso.totalPreguntas) * 100)
  : 0;

const ringColor = porcentaje >= 80 ? "var(--jade)" : porcentaje >= 50 ? "var(--saffron)" : "var(--coral)";
const headline = porcentaje >= 80 ? "¡Excelente trabajo! 🌟" : porcentaje >= 50 ? "¡Bien hecho! 👍" : "¡Puedes mejorar! 💪";
</script>

<template>
  <main class="mx-auto max-w-5xl">
    <section class="geo-card rounded-2xl p-6 md:p-10 anim-fade-up">
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <!-- ── IZQUIERDA ──────────────────────────── -->
        <div>
          <span class="badge badge-coral">Retroalimentación</span>
          <h1 class="mt-4 text-3xl font-black md:text-4xl" style="color:var(--ink)">
            Revisa tu avance
          </h1>
          <p class="mt-2 text-sm max-w-xl" style="color:var(--ink-mid)">
            Revisa el resultado antes de guardar la calificación final. Aquí verás el resumen del tema, la actividad y el porcentaje de acierto.
          </p>

          <!-- Métricas -->
          <div class="mt-7 grid gap-3 sm:grid-cols-3">
            <div class="mini-stat mini-stat-jade text-center">
              <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--jade-dk)">Aciertos</p>
              <p class="mt-2 text-4xl font-black" style="color:var(--jade)">{{ progreso.puntaje }}</p>
            </div>
            <div class="mini-stat mini-stat-azure text-center">
              <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--sky)">Total</p>
              <p class="mt-2 text-4xl font-black" style="color:var(--ink)">{{ progreso.totalPreguntas }}</p>
            </div>
            <div class="mini-stat mini-stat-saffron text-center">
              <p class="text-xs font-bold uppercase tracking-widest" style="color:#a07010">Porcentaje</p>
              <p class="mt-2 text-4xl font-black" :style="{ color: ringColor }">{{ porcentaje }}%</p>
            </div>
          </div>

          <!-- Banner resultado -->
          <div
            class="mt-5 rounded-xl p-4"
            :style="{
              background: porcentaje >= 80 ? 'var(--jade-lt)' : porcentaje >= 50 ? 'rgba(255,209,102,0.10)' : 'var(--coral-lt)',
              borderLeft: `4px solid ${ringColor}`
            }"
          >
            <p class="font-bold text-sm" :style="{ color: ringColor }">{{ headline }}</p>
            <p class="mt-1 text-xs" style="color:var(--ink-mid)">
              {{ porcentaje >= 80
                ? 'Resultado sobresaliente. Guarda tu calificación y continúa al siguiente nivel.'
                : porcentaje >= 50
                ? 'Buen avance. Puedes guardar o reintentar para mejorar tu puntaje.'
                : 'No te desanimes. Regresa a la actividad y vuelve a intentarlo.'
              }}
            </p>
          </div>
        </div>

        <!-- ── DERECHA ─────────────────────────────── -->
        <div
          class="rounded-2xl p-6"
          style="background:var(--surface);border:1px solid var(--border-md)"
        >
          <p class="text-xs font-bold uppercase tracking-widest mb-4" style="color:var(--ink-soft)">
            Resumen
          </p>

          <div class="space-y-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest mb-1" style="color:var(--ink-soft)">Tema</p>
              <p class="text-lg font-black" style="color:var(--ink)">
                {{ progreso.temaSeleccionado || 'No seleccionado' }}
              </p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-widest mb-1" style="color:var(--ink-soft)">Actividad</p>
              <p class="text-lg font-black" style="color:var(--ink)">
                {{ progreso.actividadSeleccionada || 'No seleccionada' }}
              </p>
            </div>
            <div
              class="rounded-xl p-3 text-xs leading-relaxed"
              style="background:var(--azure-lt);border:1px solid rgba(0,229,255,0.18);color:var(--ink-mid)"
            >
              💡 Si algo no salió bien, regresa a la actividad y vuelve a intentarlo antes de guardar el resultado final.
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-2.5">
            <button class="btn btn-jade w-full" @click="router.push('/calificacion')">
              ✓ Ir a calificación
            </button>
            <button class="btn btn-ghost w-full" @click="router.push('/temas')">
              ← Volver a temas
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>