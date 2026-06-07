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

const cardIcons = ["📐", "📦", "📊", "🧠"];

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
  // Asegurar que haya un nombre de estudiante antes de iniciar la actividad
  if (!progreso.estudiante || !progreso.estudiante.trim()) {
    const nombre = window.prompt("Por favor ingresa tu nombre para que la calificación quede registrada:");
    if (!nombre || !nombre.trim()) {
      // Si no ingresa nombre, no navegamos
      return;
    }
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
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <span class="badge border-0 bg-(--sky)/25 px-3 py-2 text-(--ink)">Ruta de aprendizaje</span>
        <h1 class="mt-3 text-3xl font-black md:text-5xl">Selecciona un tema</h1>
        <p class="mt-2 max-w-3xl text-slate-600">Cada tema carga sus actividades reales desde la base de datos para que la navegación lleve a preguntas auténticas.</p>
      </div>
      <div class="w-full md:w-1/3">
        <label class="text-sm font-semibold text-slate-600">Tu nombre (se guardará con la calificación)</label>
        <input v-model="progreso.estudiante" type="text" placeholder="Ingresa tu nombre" class="mt-2 input input-bordered w-full" />
      </div>
      <button class="btn btn-ghost self-start md:self-auto" @click="router.push('/')">Volver</button>
    </div>

    <div v-if="loading" class="grid gap-6 lg:grid-cols-2">
      <div v-for="n in 2" :key="n" class="geo-card rounded-4xl p-6 md:p-7" style="min-height:240px">
        <div class="h-4 w-28 rounded-full" style="background:var(--border-md);animation:pulse-soft 1.5s ease-in-out infinite"></div>
        <div class="mt-4 h-8 w-3/4 rounded-full" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .1s"></div>
        <div class="mt-3 h-4 w-full rounded-full" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .2s"></div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="h-20 rounded-2xl" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .3s"></div>
          <div class="h-20 rounded-2xl" style="background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite .4s"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="geo-alert geo-alert-error">
      ⚠️ {{ error }}
    </div>

    <div v-else-if="temas.length === 0" class="geo-card p-12 text-center anim-scale-in">
      <div class="text-5xl mb-4">📭</div>
      <h2 class="text-xl font-black" style="color:var(--ink)">Sin temas aún</h2>
      <p class="mt-2 text-slate-500 text-sm">No hay temas disponibles en este momento.</p>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-2">
      <article
        v-for="(tema, index) in temas"
        :key="tema.id"
        class="geo-card rounded-4xl p-6 md:p-7 anim-fade-up"
        :class="`delay-${(index % 4) + 1}`"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span class="inline-flex rounded-full bg-(--sky)/25 px-3 py-1 text-sm font-semibold text-(--ink)">{{ cardIcons[index % cardIcons.length] }} Tema {{ index + 1 }}</span>
            <h2 class="mt-4 text-2xl font-black md:text-3xl" style="color:var(--ink)">{{ tema.nombre }}</h2>
            <p class="mt-2 text-slate-600">{{ tema.descripcion }}</p>
          </div>
          <div class="rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm">
            <p class="font-semibold text-(--ink)">Actividades</p>
            <p>{{ tema.actividades.length }}</p>
          </div>
        </div>

        <div class="mt-6 grid gap-3 md:grid-cols-2">
          <button
            v-for="activity in tema.actividades"
            :key="activity.id"
            type="button"
            class="rounded-3xl border border-slate-200 bg-white/80 p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5"
            @click="seleccionarActividad(tema, activity.id, activity.nombre)"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actividad</p>
            <h3 class="mt-2 text-xl font-bold" style="color:var(--ink)">{{ activity.nombre }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ activity.descripcion }}</p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              <span class="rounded-full bg-(--sky)/20 px-3 py-1">Nivel {{ activity.nivel }}</span>
              <span class="rounded-full bg-(--mint)/20 px-3 py-1">Orden {{ activity.orden }}</span>
            </div>
          </button>
        </div>

        <button class="btn mt-6 border-0 bg-(--mint) text-(--ink)" @click="empezarTema(tema)">
          Empezar este tema
        </button>
      </article>
    </div>
  </main>
</template>
