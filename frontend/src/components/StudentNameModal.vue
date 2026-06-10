<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/60" @click="onCancel"></div>
    <div class="relative w-full max-w-md p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm neon-btn">
      <h3 class="text-xl font-bold neon-text mb-3">Ingresa tu nombre</h3>
      <p class="text-sm text-slate-300 mb-4">Este nombre se guardará con tu calificación.</p>

      <input v-model="name" type="text" placeholder="Tu nombre" class="input input-bordered w-full mb-4" />

      <div class="flex justify-end gap-3">
        <button class="btn btn-ghost" @click="onCancel">Cancelar</button>
        <button class="btn neon-btn" @click="onConfirm" :disabled="!name || !name.trim()">Continuar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits<{
  (e: 'confirm', name: string): void;
  (e: 'cancel'): void;
}>();

const props = defineProps<{ initial?: string }>();

const name = ref(props.initial ?? '');

function onConfirm() {
  emit('confirm', name.value.trim());
}

function onCancel() {
  emit('cancel');
}
</script>

<style scoped>
.neon-btn { padding: 0.5rem 1rem; border-radius: 12px; }
</style>
