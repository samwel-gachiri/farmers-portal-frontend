<template>
  <Default>
    <v-card class="p-6 shadow-lg rounded-lg">
      <v-card-title class="text-2xl font-bold mb-4">
        Farmer sales report
      </v-card-title>
      <v-card-text>
        <apexchart
            type="bar"
            :options="chartOptions"
            :series="series"
        ></apexchart>

        <v-simple-table class="mt-6">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Produce</th>
              <th class="text-left">Quantity sold</th>
              <th class="text-left">Total sales</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in salesData" :key="index">
              <td>{{ item.produce }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.sales }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </Default>
</template>

<script>

import Default from '@/components/layout/Default';
import { viewPermissions, getCurrentUserRole, getCurrentUserId } from '@/utils/roles';
import VueApexCharts from 'vue-apexcharts';

export default {
  components: {
    Default,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      salesData: [
        { produce: 'Tomatoes', quantity: 120, sales: 600 },
        { produce: 'Potatoes', quantity: 200, sales: 800 },
        { produce: 'Carrots', quantity: 150, sales: 750 },
        { produce: 'Onions', quantity: 100, sales: 500 },
        { produce: 'Cabbage', quantity: 80, sales: 400 },
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
        },
        xaxis: {
          categories: [],
        },
        colors: ['#4CAF50'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '70%',
            endingShape: 'rounded',
          },
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: 'Sales by produce',
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
          },
        },
      },
      series: [
        {
          name: 'Total Sales',
          data: [],
        },
      ],
    };
  },
  computed: {
    getCurrentUserId,
    getCurrentUserRole,
  },
  methods: {
    viewPermissions,
  },
  mounted() {
    this.chartOptions.xaxis.categories = this.salesData.map(
        (item) => item.produce,
    );
    this.series = [
      {
        name: 'Total Sales',
        data: this.salesData.map((item) => item.sales),
      },
    ];
    const maxSales = Math.max(...this.salesData.map((item) => item.sales));
    const bestProduce = this.salesData.find(
        (item) => item.sales === maxSales,
    ).produce;
    this.$toast.success(`The produce making the highest sales is: ${bestProduce}`);
  },
};
</script>

<style scoped>
.produce-list {
  max-height: 100vh;
  overflow: scroll;
}
.full-width {
  width: 90vw;
}

@media (min-width: 768px) {
  .full-width {
    width: 100vw;
  }
}

@media (min-width: 1300px) {
  .full-width {
    width: 80vw;
  }
}

</style>
