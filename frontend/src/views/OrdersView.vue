<script setup lang="ts">

import { onMounted, ref } from "vue";

import api from "../services/api";

import OrdersTable from "../components/OrdersTable.vue";

interface Order {
  id: string;
  cliente: string;
  total: number;
}

const orders = ref<Order[]>([]);

onMounted(async () => {

  try {

    const response = await api.get("/orders");

    orders.value = response.data.data;

  } catch (error) {

    console.log(error);

  }

});

</script>

<template>

  <div class="container mx-auto mt-10">

    <h1 class="text-5xl font-bold text-center mb-10">
      Pedidos
    </h1>

    <OrdersTable :orders="orders" />

  </div>

</template>