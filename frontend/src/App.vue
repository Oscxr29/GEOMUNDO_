
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen app-shell">
    <header class="mx-auto mb-6 flex max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/55 px-5 py-3 backdrop-blur">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">GeoMundo</p>
        <p class="text-sm font-medium text-[var(--ink)]">Ruta de aprendizaje en geometría</p>
      </div>
      <div class="hidden rounded-full bg-[var(--mint)]/20 px-4 py-2 text-sm font-semibold text-[var(--ink)] md:block">
        Contenido organizado para práctica y pruebas
      </div>
    </header>

    <router-view />
  </div>

</template>