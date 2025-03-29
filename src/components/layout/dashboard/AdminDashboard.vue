<template>
  <v-container>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <v-card class="p-4 text-center shadow-lg">
        <h2 class="text-xl font-semibold">Total Users</h2>
        <p class="text-3xl font-bold">1,245</p>
      </v-card>
      <v-card class="p-4 text-center shadow-lg">
        <h2 class="text-xl font-semibold">Total Transactions</h2>
        <p class="text-3xl font-bold">$45,230</p>
      </v-card>
      <v-card class="p-4 text-center shadow-lg">
        <h2 class="text-xl font-semibold">Active Farmers</h2>
        <p class="text-3xl font-bold">865</p>
      </v-card>
      <v-card class="p-4 text-center shadow-lg">
        <h2 class="text-xl font-semibold">Active Buyers</h2>
        <p class="text-3xl font-bold">380</p>
      </v-card>
    </div>

    <v-card class="mt-6 p-4">
      <h2 class="text-xl font-semibold mb-4">Sales Overview</h2>
      <apexchart type="line" height="350" :options="chartOptions" :series="chartSeries" />
    </v-card>

    <v-card class="mt-6 p-4">
      <h2 class="text-xl font-semibold mb-4">Recent Orders</h2>
      <v-simple-table>
        <thead>
        <tr>
          <th class="text-left">Buyer</th>
          <th class="text-left">Amount</th>
          <th class="text-left">Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.buyer }}</td>
          <td>{{ order.amount }}</td>
          <td :class="{'text-green-500': order.status === 'Completed', 'text-yellow-500': order.status === 'Pending'}">
            {{ order.status }}
          </td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  components: { apexchart: VueApexCharts },
  data() {
    return {
      chartOptions: {
        chart: { id: 'sales-chart' },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
      },
      chartSeries: [{ name: 'Sales', data: [5000, 7000, 8000, 12000, 15000, 20000] }],
      orders: [
        {
          id: 1, buyer: 'John Doe', amount: '$150', status: 'Completed',
        },
        {
          id: 2, buyer: 'Alice Smith', amount: '$230', status: 'Pending',
        },
        {
          id: 3, buyer: 'Michael Lee', amount: '$120', status: 'Completed',
        },
      ],
    };
  },
};
</script>

<style scoped>
.p-4 { padding: 1rem; }
.text-xl { font-size: 1.25rem; }
.text-3xl { font-size: 1.875rem; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.text-green-500 { color: #10B981; }
.text-yellow-500 { color: #F59E0B; }
</style>
