<script setup lang="ts">

interface Order {
  id: string;
  cliente: string;
  total: number;
}

defineProps<{
  orders: Order[];
}>();

</script>

<template>

  <div class="overflow-x-auto">

    <table class="table table-zebra bg-white rounded-xl">

      <thead>

        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Total</th>
        </tr>

      </thead>

      <tbody>

        <tr
          v-for="order in orders"
          :key="order.id"
        >

          <td>{{ order.id }}</td>

          <td>{{ order.cliente }}</td>

          <td>${{ order.total }}</td>

        </tr>

      </tbody>

    </table>

  </div>

</template>