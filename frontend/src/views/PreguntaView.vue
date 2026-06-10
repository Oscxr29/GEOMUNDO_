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

// ── Barra de progreso ─────────────────────────────────────────────
// Usamos currentIndex + 1 para mostrar la pregunta en curso (1-based).
// Al evaluar (submitted) mostramos 100%.
const progresoPct = computed(() => {
  if (!totalPreguntas.value) return 0;
  if (submitted.value) return 100;
  return Math.round(((currentIndex.value + 1) / totalPreguntas.value) * 100);
});

// Mantener el store sincronizado con la pregunta actual
watch(currentIndex, (val) => progreso.setPreguntaActual(val));

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
const headline = computed(() => porcentaje.value >= 80 ? "¡Resultado increíble! 🌟" : porcentaje.value >= 50 ? "¡Buen trabajo! 👍" : "¡Sigue intentándolo! 💪");
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
    progreso.setPreguntaActual(0);
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
  if (currentIndex.value > 0) currentIndex.value -= 1;
}

function irSiguiente() {
  if (currentIndex.value < preguntas.value.length - 1) currentIndex.value += 1;
}

function evaluarRespuestas() {
  if (!preguntas.value.length) return;
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
        <!-- ── COLUMNA IZQUIERDA ─────────────────────── -->
        <div>
          <span class="badge badge-azure">Pregunta guiada</span>
          <h1
            class="mt-4 text-3xl font-black md:text-4xl"
            style="letter-spacing:-0.02em;color:var(--ink)"
          >
            {{ actividadNombre || "Resuelve la actividad" }}
          </h1>
          <p class="mt-2 text-sm" style="color:var(--ink-mid)">
            {{ temaNombre }} · {{ totalPreguntas }} preguntas
          </p>

          <!-- ── BARRA DE PROGRESO ─────────────────── -->
          <div v-if="!loading && !error && totalPreguntas" class="mt-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold" style="color:var(--ink-soft)">
                {{ submitted ? "¡Completado!" : `Pregunta ${currentIndex + 1} / ${totalPreguntas}` }}
              </span>
              <span
                class="text-xs font-bold px-2 py-0.5 rounded-full"
                :style="{
                  background: submitted ? 'rgba(0,229,160,0.15)' : 'rgba(0,229,255,0.12)',
                  color: submitted ? 'var(--jade)' : 'var(--sky)'
                }"
              >
                {{ progresoPct }}%
              </span>
            </div>
            <div class="progress-bar-track">
              <div
                class="progress-bar-fill"
                :style="{ width: progresoPct + '%' }"
              />
            </div>
          </div>
          <!-- ─────────────────────────────────────── -->

          <!-- Loading skeleton -->
          <div
            v-if="loading"
            class="mt-6 rounded-2xl border p-6"
            style="background:var(--paper);border-color:var(--border-md)"
          >
            <div class="space-y-3">
              <div class="h-3 w-32 rounded-full" style="background:var(--border-md);animation:pulse-soft 1.5s ease-in-out infinite"></div>
              <div class="h-16 rounded-2xl" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .1s"></div>
              <div class="h-12 rounded-xl" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .2s"></div>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="mt-6 geo-alert geo-alert-error">
            {{ error }}
            <div class="mt-3">
              <button class="btn btn-ghost" @click="router.push('/temas')">← Volver a temas</button>
            </div>
          </div>

          <!-- Preguntas activas -->
          <template v-else>
            <div v-if="!submitted && currentQuestion" class="mt-6 space-y-4">
              <!-- Tarjeta de pregunta -->
              <div
                class="rounded-2xl p-5 border"
                style="background:var(--surface);border-color:var(--border-md)"
              >
                <div class="flex items-center justify-between gap-3 mb-4">
                  <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--ink-soft)">
                    Pregunta {{ currentIndex + 1 }} de {{ totalPreguntas }}
                  </p>
                  <span class="badge badge-jade">Nivel {{ currentQuestion.orden || currentIndex + 1 }}</span>
                </div>

                <h2 class="text-xl font-black leading-snug" style="color:var(--ink)">
                  {{ currentQuestion.enunciado }}
                </h2>

                <!-- Opciones -->
                <div class="mt-5 grid gap-2.5">
                  <label
                    v-for="opcion in currentQuestion.opciones"
                    :key="opcion.id"
                    class="flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all"
                    :style="{
                      background: respuestas[currentQuestion.id] === opcion.id
                        ? 'rgba(0,229,255,0.08)'
                        : 'rgba(255,255,255,0.025)',
                      borderColor: respuestas[currentQuestion.id] === opcion.id
                        ? 'rgba(0,229,255,0.50)'
                        : 'var(--border-md)',
                      boxShadow: respuestas[currentQuestion.id] === opcion.id
                        ? '0 0 14px rgba(0,229,255,0.15)'
                        : 'none'
                    }"
                  >
                    <input
                      v-model="respuestas[currentQuestion.id]"
                      type="radio"
                      :name="currentQuestion.id"
                      :value="opcion.id"
                      class="sr-only"
                    />
                    <span
                      class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black"
                      :style="{
                        background: respuestas[currentQuestion.id] === opcion.id
                          ? 'var(--sky)'
                          : 'rgba(0,229,255,0.12)',
                        color: respuestas[currentQuestion.id] === opcion.id
                          ? '#041820'
                          : 'var(--sky)'
                      }"
                    >
                      {{ String.fromCharCode(65 + currentQuestion.opciones.findIndex((item) => item.id === opcion.id)) }}
                    </span>
                    <p class="font-semibold text-sm leading-snug" style="color:var(--ink)">
                      {{ opcion.texto }}
                    </p>
                  </label>
                </div>
              </div>

              <!-- Navegación -->
              <div class="flex flex-wrap items-center justify-between gap-3">
                <button
                  class="btn btn-ghost"
                  @click="irAnterior"
                  :disabled="currentIndex === 0"
                >
                  ← Anterior
                </button>
                <div class="flex items-center gap-2">
                  <button
                    class="btn btn-ghost"
                    @click="irSiguiente"
                    :disabled="currentIndex >= totalPreguntas - 1"
                  >
                    Siguiente →
                  </button>
                  <button
                    class="btn btn-jade"
                    @click="evaluarRespuestas"
                    :disabled="!totalPreguntas"
                  >
                    ✓ Evaluar
                  </button>
                </div>
              </div>
            </div>

            <!-- ── RESULTADOS ─────────────────────── -->
            <div v-else class="mt-6 space-y-4">
              <div class="geo-alert geo-alert-success text-base">
                {{ headline }} Resolviste <strong>{{ puntajeCalculado }}</strong> de <strong>{{ totalPreguntas }}</strong> correctamente.
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="mini-stat mini-stat-jade">
                  <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--jade-dk)">Aciertos</p>
                  <p class="mt-2 text-4xl font-black" style="color:var(--jade)">{{ puntajeCalculado }}</p>
                </div>
                <div class="mini-stat mini-stat-saffron">
                  <p class="text-xs font-bold uppercase tracking-widest" style="color:#a07010">Porcentaje</p>
                  <p class="mt-2 text-4xl font-black" style="color:var(--gold)">{{ porcentaje }}%</p>
                </div>
              </div>

              <!-- Revisión -->
              <div
                class="rounded-2xl p-5 border"
                style="background:var(--surface);border-color:var(--border-md)"
              >
                <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color:var(--ink-soft)">
                  Revisión de respuestas
                </p>
                <div class="space-y-3">
                  <div
                    v-for="(item, index) in resultado"
                    :key="item.pregunta.id"
                    class="rounded-xl border p-4"
                    :style="{
                      background: item.isCorrect ? 'var(--jade-lt)' : 'var(--coral-lt)',
                      borderColor: item.isCorrect ? 'rgba(0,229,160,0.25)' : 'rgba(255,107,107,0.25)'
                    }"
                  >
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <p class="text-sm font-black" style="color:var(--ink)">
                        Pregunta {{ item.pregunta.orden || index + 1 }}
                      </p>
                      <span class="badge" :class="item.isCorrect ? 'badge-jade' : 'badge-coral'">
                        {{ item.isCorrect ? '✓ Correcta' : '✗ Incorrecta' }}
                      </span>
                    </div>
                    <p class="text-sm mb-2" style="color:var(--ink-mid)">{{ item.pregunta.enunciado }}</p>
                    <div class="space-y-1 text-xs" style="color:var(--ink-soft)">
                      <p><strong style="color:var(--ink-mid)">Tu respuesta:</strong> {{ item.selectedId ? item.pregunta.opciones.find((o) => o.id === item.selectedId)?.texto : 'Sin responder' }}</p>
                      <p><strong style="color:var(--ink-mid)">Correcta:</strong> {{ item.correctOption?.texto || 'N/D' }}</p>
                      <p v-if="item.pregunta.explicacion">
                        <strong style="color:var(--ink-mid)">Explicación:</strong> {{ item.pregunta.explicacion }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex flex-wrap gap-2.5">
                <button class="btn btn-jade" @click="guardarCalificacion" :disabled="saving || saved">
                  <span v-if="saving">⏳ Guardando…</span>
                  <span v-else-if="saved">✅ Guardado</span>
                  <span v-else>💾 Guardar calificación</span>
                </button>
                <button class="btn btn-saffron" @click="router.push('/retroalimentacion')">
                  Retroalimentación
                </button>
                <button class="btn btn-ghost" @click="reiniciarActividad">↺ Reintentar</button>
              </div>

              <p
                v-if="saveMessage"
                class="text-sm font-semibold"
                :style="{ color: saved ? 'var(--jade-dk)' : '#ff6b6b' }"
              >
                {{ saveMessage }}
              </p>
            </div>
          </template>
        </div>

        <!-- ── COLUMNA DERECHA (resumen) ─────────── -->
        <div
          class="rounded-2xl p-5 border sticky top-6"
          style="background:var(--surface);border-color:var(--border-md)"
        >
          <p class="text-xs font-bold uppercase tracking-widest mb-4" style="color:var(--ink-soft)">
            Resumen
          </p>

          <!-- Ring SVG -->
          <div class="progress-ring mx-auto" style="width:150px;height:150px">
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="58" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12" />
              <circle
                cx="75" cy="75" r="58"
                fill="none"
                :stroke="ringColor"
                stroke-width="12"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeOffset"
                style="transition:stroke-dashoffset 1.1s ease"
              />
            </svg>
            <div class="progress-ring__label">
              <div class="text-3xl font-black" :style="{ color: ringColor }">{{ porcentaje }}%</div>
              <div class="text-xs mt-0.5" style="color:var(--ink-soft)">aciertos</div>
            </div>
          </div>

          <div class="mt-4 space-y-2.5">
            <div class="mini-stat mini-stat-azure">
              <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--sky)">Tema</p>
              <p class="mt-1 text-sm font-black" style="color:var(--ink)">{{ temaNombre }}</p>
            </div>
            <div class="mini-stat mini-stat-jade">
              <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--jade-dk)">Actividad</p>
              <p class="mt-1 text-sm font-black" style="color:var(--ink)">{{ actividadNombre }}</p>
            </div>
            <div class="mini-stat mini-stat-saffron">
              <p class="text-xs font-bold uppercase tracking-widest" style="color:#a07010">Preguntas</p>
              <p class="mt-1 text-sm font-black" style="color:var(--ink)">{{ totalPreguntas }}</p>
            </div>
          </div>

          <hr class="geo-divider" />

          <div
            class="rounded-xl p-4"
            style="background:var(--violet-lt);border:1.5px solid rgba(183,126,255,0.20)"
          >
            <p class="text-xs font-bold uppercase tracking-widest mb-1.5" style="color:#c09fff">Consejo</p>
            <p class="text-xs leading-relaxed" style="color:var(--ink-mid)">
              Revisa tus respuestas, luego guarda la calificación para registrar tu avance y continuar con la retroalimentación.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>