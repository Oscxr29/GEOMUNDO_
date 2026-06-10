<script setup lang="ts">
import { onMounted, ref } from "vue";

import api from "../services/api";

import CategoryCard from "../components/CategoryCard.vue";

interface Category {
  id: string;
  nombre: string;
  descripcion: string;
}

const categories = ref<Category[]>([]);

onMounted(async () => {

  try {

    const response = await api.get("/categories");

    categories.value = response.data.data;

  } catch (error) {

    console.log(error);

  }

});
</script>

<template>

  <div class="container mx-auto">

    <h1 class="text-5xl font-bold mb-10 text-center">
  Categorías
</h1>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

      <CategoryCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
      />

    </div>

  </div>

</template>