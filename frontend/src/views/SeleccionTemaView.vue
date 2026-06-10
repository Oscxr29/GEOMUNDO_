<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useProgresoStore } from "../stores/progreso";
import { getActividadesByTemaId, getTemas, type TemaConActividades } from "../services/temas";

const router = useRouter();
const progreso = useProgresoStore();

const temas = ref<TemaConActividades[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const cardIcons = ["📐", "🌍", "📊", "🧠", "🔬", "🏛️"];

interface CardAccent {
  border: string;
  glow: string;
  badge: string;
  badgeText: string;
}

const cardAccents: CardAccent[] = [
  { border: "rgba(0,229,255,0.30)", glow: "rgba(0,229,255,0.08)", badge: "rgba(0,229,255,0.14)", badgeText: "var(--sky)" },
  { border: "rgba(183,126,255,0.30)", glow: "rgba(183,126,255,0.08)", badge: "rgba(183,126,255,0.14)", badgeText: "var(--lilac)" },
  { border: "rgba(0,255,200,0.25)",   glow: "rgba(0,255,200,0.06)",  badge: "rgba(0,255,200,0.14)",   badgeText: "var(--mint)" },
  { border: "rgba(255,209,102,0.30)", glow: "rgba(255,209,102,0.06)",badge: "rgba(255,209,102,0.14)", badgeText: "var(--gold)" },
];

// Helper tipado — elimina el "posiblemente undefined" del template
function acento(index: number): CardAccent {
  return cardAccents[index % cardAccents.length]!;
}

async function cargarTemas() {
  loading.value = true;
  error.value = null;
  try {
    const apiTemas = await getTemas();
    const temasConActividades = await Promise.all(
      apiTemas.map(async (tema) => ({
        ...tema,
        actividades: await getActividadesByTemaId(tema.id),
      }))
    );
    temas.value = temasConActividades;
  } catch (requestError) {
    console.error(requestError);
    error.value = "No se pudieron cargar los temas. Intenta de nuevo.";
  } finally {
    loading.value = false;
  }
}

function seleccionarActividad(tema: TemaConActividades, activityId: string, activityName: string) {
  if (!progreso.estudiante || !progreso.estudiante.trim()) {
    const nombre = window.prompt("Por favor ingresa tu nombre para que la calificación quede registrada:");
    if (!nombre || !nombre.trim()) return;
    progreso.setEstudiante(nombre.trim());
  }
  progreso.setTemaId(tema.id);
  progreso.setTema(tema.nombre);
  progreso.setActividadId(activityId);
  progreso.setActividad(activityName);
  progreso.limpiarEvaluacion();
  router.push(`/actividad/${activityId}`);
}

function empezarTema(tema: TemaConActividades) {
  const firstActivity = tema.actividades[0];
  if (!firstActivity) return;
  seleccionarActividad(tema, firstActivity.id, firstActivity.nombre);
}

onMounted(cargarTemas);
</script>

<template>
  <main class="mx-auto max-w-7xl">
    <!-- ── ENCABEZADO ──────────────────────────────── -->
    <div class="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <span class="badge badge-azure">Ruta de aprendizaje</span>
        <h1 class="mt-3 text-3xl font-black md:text-4xl" style="color:var(--ink)">
          Selecciona un tema
        </h1>
        <p class="mt-2 text-sm max-w-xl" style="color:var(--ink-mid)">
          Cada tema carga sus actividades desde la base de datos para que tu avance quede registrado.
        </p>
      </div>

      <!-- Controles derechos -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
        <!-- Input nombre -->
        <div class="flex-1 min-w-0 sm:w-64">
          <label class="block text-xs font-bold uppercase tracking-widest mb-1.5" style="color:var(--ink-soft)">
            Tu nombre
          </label>
          <input
            v-model="progreso.estudiante"
            type="text"
            placeholder="Ej. María González"
            class="input w-full"
          />
        </div>

        <!-- Botones de nav -->
        <div class="flex gap-2 shrink-0">
          <button
            class="btn btn-azure"
            @click="router.push('/clasificacion')"
          >
            🏆 Clasificación
          </button>
          <button class="btn btn-ghost" @click="router.push('/')">
            ← Inicio
          </button>
        </div>
      </div>
    </div>

    <!-- ── LOADING ────────────────────────────────── -->
    <div v-if="loading" class="grid gap-6 lg:grid-cols-2">
      <div
        v-for="n in 2"
        :key="n"
        class="geo-card rounded-2xl p-6 md:p-7"
        style="min-height:220px"
      >
        <div class="space-y-3">
          <div class="h-3 w-28 rounded-full" style="background:var(--border-md);animation:pulse-soft 1.5s ease-in-out infinite"></div>
          <div class="h-7 w-3/4 rounded-xl" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .1s"></div>
          <div class="h-3 w-full rounded-full" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .2s"></div>
          <div class="grid grid-cols-2 gap-3 mt-4">
            <div class="h-20 rounded-xl" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .3s"></div>
            <div class="h-20 rounded-xl" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .4s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── ERROR ──────────────────────────────────── -->
    <div v-else-if="error" class="geo-alert geo-alert-error">⚠️ {{ error }}</div>

    <!-- ── VACÍO ──────────────────────────────────── -->
    <div v-else-if="temas.length === 0" class="geo-card p-12 text-center anim-scale-in">
      <div class="text-5xl mb-4">📭</div>
      <h2 class="text-xl font-black" style="color:var(--ink)">Sin temas aún</h2>
      <p class="mt-2 text-sm" style="color:var(--ink-soft)">No hay temas disponibles en este momento.</p>
    </div>

    <!-- ── TEMAS ──────────────────────────────────── -->
    <div v-else class="grid gap-6 lg:grid-cols-2">
      <article
        v-for="(tema, index) in temas"
        :key="tema.id"
        class="geo-card rounded-2xl p-6 md:p-7 anim-fade-up"
        :class="`delay-${(index % 4) + 1}`"
        :style="{
          borderColor: acento(index).border,
          boxShadow: `0 20px 48px rgba(2,8,16,0.72), 0 0 28px ${acento(index).glow}`
        }"
      >
        <!-- Cabecera tema -->
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
              :style="{ background: acento(index).badge, color: acento(index).badgeText, border: `1.5px solid ${acento(index).border}` }"
            >
              {{ cardIcons[index % cardIcons.length] }} Tema {{ index + 1 }}
            </span>
            <h2 class="mt-3 text-2xl font-black md:text-3xl" style="color:var(--ink)">
              {{ tema.nombre }}
            </h2>
            <p class="mt-1.5 text-sm leading-relaxed" style="color:var(--ink-mid)">
              {{ tema.descripcion }}
            </p>
          </div>
          <div
            class="rounded-xl px-4 py-3 text-center shrink-0"
            style="background:var(--surface-strong);border:1px solid var(--border-md)"
          >
            <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--ink-soft)">Actividades</p>
            <p class="mt-1 text-2xl font-black" style="color:var(--ink)">{{ tema.actividades.length }}</p>
          </div>
        </div>

        <!-- Grid actividades -->
        <div class="mt-5 grid gap-3 md:grid-cols-2">
          <button
            v-for="activity in tema.actividades"
            :key="activity.id"
            type="button"
            class="rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-1 cursor-pointer"
            style="background:var(--surface);border-color:var(--border-md)"
            @mouseenter="($event.currentTarget as HTMLElement).style.borderColor = acento(index).border"
            @mouseleave="($event.currentTarget as HTMLElement).style.borderColor = 'var(--border-md)'"
            @click="seleccionarActividad(tema, activity.id, activity.nombre)"
          >
            <p class="text-xs font-bold uppercase tracking-widest" style="color:var(--ink-soft)">Actividad</p>
            <h3 class="mt-1.5 text-base font-black" style="color:var(--ink)">{{ activity.nombre }}</h3>
            <p class="mt-1 text-xs leading-relaxed" style="color:var(--ink-mid)">{{ activity.descripcion }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span class="badge badge-azure text-[10px] px-2 py-0.5">Nivel {{ activity.nivel }}</span>
              <span class="badge badge-jade text-[10px] px-2 py-0.5">Orden {{ activity.orden }}</span>
            </div>
          </button>
        </div>

        <!-- Botón empezar -->
        <button
          class="btn btn-jade mt-5 w-full sm:w-auto"
          @click="empezarTema(tema)"
        >
          ▶ Empezar este tema
        </button>
      </article>
    </div>
  </main>
</template>