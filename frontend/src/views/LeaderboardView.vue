<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getRanking, type IRankEntry } from "../services/session";

const router = useRouter();

const loading  = ref(true);
const error    = ref<string | null>(null);
const entries  = ref<IRankEntry[]>([]);
const actividadFiltro = ref("todas");

// ── Actividades únicas para el selector ─────────────────────────
const actividades = computed(() => {
  const set = new Set(entries.value.map((e) => e.actividad));
  return ["todas", ...Array.from(set)];
});

// ── Filas filtradas (el filtro se aplica volviendo a llamar la API) ──
const entriesFiltradas = computed(() =>
  actividadFiltro.value === "todas"
    ? entries.value
    : entries.value.filter((e) => e.actividad === actividadFiltro.value)
);

// ── Fetch real ───────────────────────────────────────────────────
async function fetchRanking() {
  loading.value = true;
  error.value   = null;
  try {
    // Trae siempre el top 50 completo; el filtro por actividad
    // se hace en el cliente para que el selector funcione sin
    // volver a llamar la API cada vez.
    entries.value = await getRanking(undefined, 50);
  } catch (err) {
    console.error(err);
    error.value = "No se pudo cargar la clasificación. Verifica tu conexión.";
  } finally {
    loading.value = false;
  }
}

// ── Helpers de presentación ──────────────────────────────────────
function medalEmoji(pos: number): string | number {
  if (pos === 1) return "🥇";
  if (pos === 2) return "🥈";
  if (pos === 3) return "🥉";
  return pos;
}

function pct(entry: IRankEntry): number {
  return entry.totalPreguntas > 0
    ? Math.round((entry.puntaje / entry.totalPreguntas) * 100)
    : 0;
}

function rowClass(pos: number): string {
  if (pos === 1) return "rank-1";
  if (pos === 2) return "rank-2";
  if (pos === 3) return "rank-3";
  return "";
}

onMounted(fetchRanking);
</script>

<template>
  <main class="mx-auto max-w-5xl">
    <section class="geo-card rounded-2xl p-6 md:p-10 anim-fade-up">

      <!-- ── ENCABEZADO ─────────────────────────────────────────── -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-7">
        <div>
          <span class="badge badge-saffron">🏆 Clasificación</span>
          <h1 class="mt-3 text-3xl font-black md:text-4xl" style="color:var(--ink)">
            Tabla de líderes
          </h1>
          <p class="mt-1.5 text-sm" style="color:var(--ink-mid)">
            Los mejores puntajes registrados en GeoMundo.
          </p>
        </div>
        <div class="flex gap-2 shrink-0">
          <button
            class="btn btn-ghost"
            @click="fetchRanking"
            :disabled="loading"
          >
            {{ loading ? '⏳' : '↺' }} Actualizar
          </button>
          <button class="btn btn-ghost" @click="router.push('/temas')">
            ← Temas
          </button>
        </div>
      </div>

      <!-- ── FILTRO POR ACTIVIDAD ───────────────────────────────── -->
      <div v-if="!loading && !error && actividades.length > 1" class="mb-5 flex flex-wrap items-center gap-2">
        <span
          class="text-xs font-bold uppercase tracking-widest mr-1"
          style="color:var(--ink-soft)"
        >
          Filtrar:
        </span>
        <button
          v-for="act in actividades"
          :key="act"
          class="btn text-xs px-3 py-1.5"
          :class="actividadFiltro === act ? 'btn-azure' : 'btn-ghost'"
          @click="actividadFiltro = act"
        >
          {{ act === 'todas' ? 'Todas las actividades' : act }}
        </button>
      </div>

      <!-- ── LOADING ────────────────────────────────────────────── -->
      <div v-if="loading" class="space-y-2">
        <div
          v-for="n in 7"
          :key="n"
          class="h-12 rounded-xl"
          :style="`background:var(--border);animation:pulse-soft 1.5s ease-in-out infinite ${n * 0.08}s`"
        />
      </div>

      <!-- ── ERROR ──────────────────────────────────────────────── -->
      <div v-else-if="error" class="geo-alert geo-alert-error">
        {{ error }}
        <div class="mt-3">
          <button class="btn btn-ghost" @click="fetchRanking">Reintentar</button>
        </div>
      </div>

      <!-- ── SIN DATOS ──────────────────────────────────────────── -->
      <div
        v-else-if="entriesFiltradas.length === 0"
        class="text-center py-16"
      >
        <div class="text-5xl mb-3">📊</div>
        <p class="font-bold" style="color:var(--ink)">
          {{ actividadFiltro === 'todas' ? 'Aún no hay calificaciones registradas.' : `Sin resultados para "${actividadFiltro}".` }}
        </p>
        <p class="text-sm mt-1" style="color:var(--ink-soft)">
          Completa una actividad y guarda tu calificación para aparecer aquí.
        </p>
      </div>

      <!-- ── TABLA REAL ─────────────────────────────────────────── -->
      <div
        v-else
        class="overflow-x-auto rounded-xl"
        style="border:1px solid var(--border-md)"
      >
        <table class="lb-table">
          <thead>
            <tr style="background:var(--surface-strong)">
              <th>#</th>
              <th>Estudiante</th>
              <th class="hidden sm:table-cell">Actividad</th>
              <th class="hidden md:table-cell">Tema</th>
              <th>Puntaje</th>
              <th class="hidden sm:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in entriesFiltradas"
              :key="entry.id"
              :class="rowClass(entry.posicion)"
            >
              <!-- Posición -->
              <td class="rank-cell" style="min-width:52px">
                <span v-if="entry.posicion <= 3" class="text-xl leading-none">
                  {{ medalEmoji(entry.posicion) }}
                </span>
                <span v-else class="font-black" style="color:var(--ink-soft)">
                  {{ entry.posicion }}
                </span>
              </td>

              <!-- Nombre -->
              <td>
                <span class="font-bold" style="color:var(--ink)">
                  {{ entry.estudiante }}
                </span>
              </td>

              <!-- Actividad -->
              <td class="hidden sm:table-cell">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style="background:var(--azure-lt);color:var(--sky);border:1px solid rgba(0,229,255,0.20)"
                >
                  {{ entry.actividad }}
                </span>
              </td>

              <!-- Tema -->
              <td class="hidden md:table-cell">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style="background:var(--violet-lt);color:var(--lilac);border:1px solid rgba(183,126,255,0.20)"
                >
                  {{ entry.tema }}
                </span>
              </td>

              <!-- Puntaje + mini barra -->
              <td style="min-width:120px">
                <div class="flex items-center gap-2">
                  <span class="font-black text-sm shrink-0" style="color:var(--ink)">
                    {{ entry.puntaje }}/{{ entry.totalPreguntas }}
                  </span>
                  <div class="flex-1 min-w-[40px]">
                    <div class="progress-bar-track" style="height:6px">
                      <div
                        class="progress-bar-fill"
                        :style="{
                          width: pct(entry) + '%',
                          background: pct(entry) >= 80
                            ? 'linear-gradient(90deg,var(--jade),var(--mint))'
                            : pct(entry) >= 50
                              ? 'linear-gradient(90deg,var(--gold),var(--saffron))'
                              : 'linear-gradient(90deg,var(--coral),#ff8585)'
                        }"
                      />
                    </div>
                  </div>
                  <span
                    class="text-xs font-semibold w-9 text-right shrink-0"
                    style="color:var(--ink-mid)"
                  >
                    {{ pct(entry) }}%
                  </span>
                </div>
              </td>

              <!-- Fecha -->
              <td class="hidden sm:table-cell text-xs" style="color:var(--ink-soft)">
                {{ entry.fecha }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── TOTAL ──────────────────────────────────────────────── -->
      <p
        v-if="!loading && !error && entriesFiltradas.length > 0"
        class="mt-4 text-xs text-right"
        style="color:var(--ink-soft)"
      >
        Mostrando {{ entriesFiltradas.length }} resultado{{ entriesFiltradas.length !== 1 ? 's' : '' }}
      </p>

    </section>
  </main>
</template>