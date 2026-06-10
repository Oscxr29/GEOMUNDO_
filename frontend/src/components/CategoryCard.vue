<script setup lang="ts">
defineProps<{
  category: {
    id: string;
    nombre: string;
    descripcion: string;
  };
}>();
</script>

<template>

  <div class="card bg-base-100 shadow-2xl hover:scale-105 transition-all">

    <div class="card-body">

      <h2 class="card-title text-2xl">
        {{ category.nombre }}
      </h2>

      <p class="text-gray-600">
        {{ category.descripcion }}
      </p>

      <div class="card-actions justify-end">

        <button class="btn btn-primary">
          Ver categoría
        </button>

      </div>

    </div>

  </div>

</template>