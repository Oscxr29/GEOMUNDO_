<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";
import { getPreguntasByActividadId, type PreguntaActividad } from "../services/preguntas";
import { saveSesionCalificacion } from "../services/session";

const route = useRoute();
const router = useRouter();
const progreso = useProgresoStore();

const actividadId = computed(() => String(route.params.actividadId ?? ""));
const preguntas = ref<PreguntaActividad[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const submitted = ref(false);
const saving = ref(false);
const saved = ref(false);
const saveMessage = ref<string | null>(null);
const currentIndex = ref(0);
const respuestas = reactive<Record<string, string>>({});

const temaNombre = computed(() => progreso.temaSeleccionado || "Tema seleccionado");
const actividadNombre = computed(() => preguntas.value[0]?.actividad?.nombre || progreso.actividadSeleccionada || "Actividad seleccionada");
const totalPreguntas = computed(() => preguntas.value.length);
const currentQuestion = computed(() => preguntas.value[currentIndex.value]);

const resultado = computed(() => preguntas.value.map((pregunta) => {
  const selectedId = respuestas[pregunta.id] ?? null;
  const correctOption = pregunta.opciones.find((opcion) => opcion.esCorrecta) ?? null;

  return {
    pregunta,
    selectedId,
    correctOption,
    isCorrect: Boolean(correctOption && selectedId === correctOption.id),
  };
}));

const puntajeCalculado = computed(() => resultado.value.filter((item) => item.isCorrect).length);
const porcentaje = computed(() => totalPreguntas.value > 0 ? Math.round((puntajeCalculado.value / totalPreguntas.value) * 100) : 0);
const ringColor = computed(() => porcentaje.value >= 80 ? "var(--jade)" : porcentaje.value >= 50 ? "var(--saffron)" : "var(--coral)");
const headline = computed(() => porcentaje.value >= 80 ? "¡Resultado increíble!" : porcentaje.value >= 50 ? "¡Buen trabajo!" : "¡Sigue intentándolo!");
const circumference = 2 * Math.PI * 64;
const strokeOffset = computed(() => circumference - (porcentaje.value / 100) * circumference);

async function loadPreguntas() {
  loading.value = true;
  error.value = null;
  submitted.value = false;
  saved.value = false;
  saveMessage.value = null;

  try {
    const data = await getPreguntasByActividadId(actividadId.value);
    preguntas.value = data;
    currentIndex.value = 0;

    Object.keys(respuestas).forEach((key) => delete respuestas[key]);
    progreso.respuestas.forEach((respuesta) => {
      if (respuesta.opcionId) {
        respuestas[respuesta.preguntaId] = respuesta.opcionId;
      }
    });
  } catch (requestError) {
    console.error(requestError);
    error.value = "No se pudieron cargar las preguntas de esta actividad.";
  } finally {
    loading.value = false;
  }
}

function irAnterior() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
}

function irSiguiente() {
  if (currentIndex.value < preguntas.value.length - 1) {
    currentIndex.value += 1;
  }
}

function evaluarRespuestas() {
  if (!preguntas.value.length) {
    return;
  }

  submitted.value = true;
  progreso.setActividadId(actividadId.value);
  progreso.setActividad(actividadNombre.value);
  progreso.setResultado(puntajeCalculado.value, totalPreguntas.value);
  progreso.setRespuestas(
    preguntas.value.map((pregunta) => ({
      preguntaId: pregunta.id,
      opcionId: respuestas[pregunta.id] ?? null,
    }))
  );
}

async function guardarCalificacion() {
  saveMessage.value = null;
  saving.value = true;

  try {
    const payload = {
      estudiante: progreso.estudiante || undefined,
      tema: progreso.temaSeleccionado,
      actividad: progreso.actividadSeleccionada,
      actividadId: progreso.actividadId,
      puntaje: puntajeCalculado.value,
      totalPreguntas: totalPreguntas.value,
      respuestas: progreso.respuestas,
    };

    await saveSesionCalificacion(payload);
    saved.value = true;
    saveMessage.value = "Calificación guardada correctamente.";
  } catch (requestError) {
    console.error(requestError);
    saveMessage.value = "No se pudo guardar la calificación. Intenta de nuevo.";
  } finally {
    saving.value = false;
  }
}

function reiniciarActividad() {
  submitted.value = false;
  saved.value = false;
  saveMessage.value = null;
  currentIndex.value = 0;
  progreso.limpiarEvaluacion();
  Object.keys(respuestas).forEach((key) => delete respuestas[key]);
}

watch(actividadId, loadPreguntas, { immediate: true });
</script>

<template>
  <main class="mx-auto max-w-7xl">
    <section class="geo-card p-6 md:p-8 lg:p-10 anim-fade-up">
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <span class="badge badge-azure">Pregunta guiada</span>
          <h1 class="mt-4 text-3xl font-black md:text-5xl" style="letter-spacing:-0.02em;color:var(--ink)">
            {{ actividadNombre || "Resuelve la actividad" }}
          </h1>
          <p class="mt-3 max-w-3xl text-slate-500">
            {{ temaNombre }} ·
            {{ totalPreguntas }} preguntas con opciones y revisión al final.
          </p>

          <div v-if="loading" class="mt-8 rounded-3xl border p-6" style="background:var(--paper);border-color:var(--border-md)">
            <div class="space-y-3">
              <div class="h-4 w-32 rounded-full" style="background:var(--border-md);animation:pulse-soft 1.5s ease-in-out infinite"></div>
              <div class="h-20 rounded-3xl" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .1s"></div>
              <div class="h-14 rounded-2xl" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .2s"></div>
            </div>
          </div>

          <div v-else-if="error" class="mt-8 geo-alert geo-alert-error">
            {{ error }}
            <div class="mt-4">
              <button class="btn btn-ghost" @click="router.push('/temas')">Volver a temas</button>
            </div>
          </div>

          <template v-else>
            <div v-if="!submitted && currentQuestion" class="mt-8 space-y-5">
              <div class="rounded-3xl p-5 border" style="background:var(--paper);border-color:var(--border-md)">
                <div class="flex items-center justify-between gap-3">
                  <p class="font-display text-xs font-semibold uppercase tracking-widest" style="color:var(--ink-soft)">
                    Pregunta {{ currentIndex + 1 }} de {{ totalPreguntas }}
                  </p>
                  <span class="badge badge-jade">Nivel {{ currentQuestion.orden || currentIndex + 1 }}</span>
                </div>
                <h2 class="mt-4 text-2xl font-black" style="color:var(--ink)">
                  {{ currentQuestion.enunciado }}
                </h2>

                <div class="mt-6 grid gap-3">
                  <label
                    v-for="opcion in currentQuestion.opciones"
                    :key="opcion.id"
                    class="rounded-2xl border p-4 transition-colors cursor-pointer"
                    :class="respuestas[currentQuestion.id] === opcion.id ? 'border-(--azure) bg-(--azure-lt)' : 'border-(--border-md) bg-white'"
                  >
                    <input
                      v-model="respuestas[currentQuestion.id]"
                      type="radio"
                      :name="currentQuestion.id"
                      :value="opcion.id"
                      class="sr-only"
                    />
                    <div class="flex items-start gap-3">
                      <span class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--azure) text-xs font-black text-white">
                        {{ String.fromCharCode(65 + currentQuestion.opciones.findIndex((item) => item.id === opcion.id)) }}
                      </span>
                      <div>
                        <p class="font-bold" style="color:var(--ink)">{{ opcion.texto }}</p>
                        <p class="mt-1 text-sm text-slate-500">Selecciona la respuesta que consideres correcta.</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3">
                <button class="btn btn-ghost" @click="irAnterior" :disabled="currentIndex === 0">← Anterior</button>
                <div class="flex items-center gap-3">
                  <button class="btn btn-ghost" @click="irSiguiente" :disabled="currentIndex >= totalPreguntas - 1">Siguiente →</button>
                  <button class="btn btn-jade" @click="evaluarRespuestas" :disabled="!totalPreguntas">Evaluar respuestas</button>
                </div>
              </div>
            </div>

            <div v-else class="mt-8 space-y-5">
              <div class="geo-alert geo-alert-success">
                {{ headline }} Has resuelto {{ puntajeCalculado }} de {{ totalPreguntas }} preguntas correctamente.
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div class="mini-stat mini-stat-jade">
                  <p class="font-display text-[10px] font-semibold uppercase tracking-widest" style="color:var(--jade-dk)">Aciertos</p>
                  <p class="mt-2 text-4xl font-black font-display" style="color:var(--jade)">{{ puntajeCalculado }}</p>
                </div>
                <div class="mini-stat mini-stat-saffron">
                  <p class="font-display text-[10px] font-semibold uppercase tracking-widest" style="color:#92400e">Porcentaje</p>
                  <p class="mt-2 text-4xl font-black font-display" style="color:var(--ink)">{{ porcentaje }}%</p>
                </div>
              </div>

              <div class="rounded-3xl p-5 border" style="background:var(--paper);border-color:var(--border-md)">
                <p class="font-display text-xs font-semibold uppercase tracking-widest" style="color:var(--ink-soft)">Revisión de respuestas</p>
                <div class="mt-4 space-y-3">
                  <div
                    v-for="(item, index) in resultado"
                    :key="item.pregunta.id"
                    class="rounded-2xl border p-4"
                    :style="{ background: item.isCorrect ? 'var(--jade-lt)' : 'var(--coral-lt)', borderColor: item.isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)' }"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="text-sm font-black" style="color:var(--ink)">Pregunta {{ item.pregunta.orden || index + 1 }}</p>
                        <p class="mt-1 text-sm" style="color:var(--ink-mid)">{{ item.pregunta.enunciado }}</p>
                      </div>
                      <span class="badge" :class="item.isCorrect ? 'badge-jade' : 'badge-coral'">{{ item.isCorrect ? 'Correcta' : 'Incorrecta' }}</span>
                    </div>

                    <div class="mt-3 space-y-2 text-sm">
                      <p><strong>Tu respuesta:</strong> {{ item.selectedId ? item.pregunta.opciones.find((opcion) => opcion.id === item.selectedId)?.texto : 'Sin responder' }}</p>
                      <p><strong>Respuesta correcta:</strong> {{ item.correctOption?.texto || 'No disponible' }}</p>
                      <p v-if="item.pregunta.explicacion"><strong>Explicación:</strong> {{ item.pregunta.explicacion }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <button class="btn btn-jade" @click="guardarCalificacion" :disabled="saving || saved">
                  <span v-if="saving">⏳ Guardando...</span>
                  <span v-else-if="saved">✅ Guardado</span>
                  <span v-else>💾 Guardar calificación</span>
                </button>
                <button class="btn btn-saffron" @click="router.push('/retroalimentacion')">Ir a retroalimentación</button>
                <button class="btn btn-ghost" @click="reiniciarActividad">Reintentar actividad</button>
              </div>

              <p v-if="saveMessage" class="text-sm font-semibold" :style="{ color: saved ? 'var(--jade-dk)' : '#9f1239' }">
                {{ saveMessage }}
              </p>
            </div>
          </template>
        </div>

        <div class="rounded-2xl p-5 border" style="background:var(--paper);border-color:var(--border-md)">
          <p class="font-display text-xs font-semibold uppercase tracking-widest mb-4" style="color:var(--ink-soft)">Resumen</p>

          <div class="progress-ring mx-auto" style="width:170px;height:170px">
            <svg width="170" height="170" viewBox="0 0 170 170">
              <circle cx="85" cy="85" r="64" fill="none" stroke="var(--border-md)" stroke-width="13" />
              <circle
                cx="85" cy="85" r="64"
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
              <div class="text-4xl" :style="{ color: ringColor }">{{ porcentaje }}%</div>
              <div class="text-xs mt-1" style="color:var(--ink-soft);font-family:'Space Grotesk',sans-serif">aciertos</div>
            </div>
          </div>

          <div class="mt-5 space-y-3">
            <div class="mini-stat mini-stat-azure">
              <p class="font-display text-[10px] font-semibold uppercase tracking-widest" style="color:var(--azure)">Tema</p>
              <p class="mt-2 text-sm font-black" style="color:var(--ink)">{{ temaNombre }}</p>
            </div>
            <div class="mini-stat mini-stat-jade">
              <p class="font-display text-[10px] font-semibold uppercase tracking-widest" style="color:var(--jade-dk)">Actividad</p>
              <p class="mt-2 text-sm font-black" style="color:var(--ink)">{{ actividadNombre }}</p>
            </div>
            <div class="mini-stat mini-stat-saffron">
              <p class="font-display text-[10px] font-semibold uppercase tracking-widest" style="color:#92400e">Preguntas</p>
              <p class="mt-2 text-sm font-black" style="color:var(--ink)">{{ totalPreguntas }}</p>
            </div>
          </div>

          <hr class="geo-divider" />

          <div class="rounded-2xl p-4" style="background:var(--violet-lt);border:1.5px solid rgba(124,58,237,0.18)">
            <p class="font-display text-xs font-semibold uppercase tracking-widest mb-2" style="color:#4c1d95">Consejo</p>
            <p class="text-sm leading-relaxed" style="color:var(--ink-mid)">
              Revisa primero tus respuestas, después guarda la calificación para registrar el avance y continuar con la retroalimentación.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>