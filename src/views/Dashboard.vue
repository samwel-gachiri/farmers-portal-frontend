<template>
  <Default>
    <div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-screen">
      <h2 class="blue--text">Class Balances</h2>
      <v-select
          label="Select school"
          v-model="selectedDatabase"
          :items="databases"
          @change="fetchClassBalances">
      </v-select>
      <apexchart class="" type="line" :options="chartOptions" :series="chartSeries"></apexchart>
    </div>
  </Default>
</template>

<script>
import axios from 'axios';
import VueApexCharts from 'vue-apexcharts';
import Default from '@/components/layout/Default';

export default {
  components: {
    Default,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      selectedDatabase: 'mainschool',
      databases: ['mainschool', 'kimorori'],
      classBalances: [],
      chartOptions: {
        chart: {
          id: 'class-balance-chart',
        },
        xaxis: {
          categories: [],
        },
      },
      chartSeries: [
        {
          name: 'Balance',
          data: [],
        },
      ],
    };
  },
  methods: {
    fetchClassBalances() {
      axios.get(`/${this.selectedDatabase}/classes/balance`)
        .then((response) => {
          this.classBalances = response.data.data;
          this.updateChart();
        })
        .catch((error) => {
          console.error('Error fetching class balances:', error);
        });
    },
    updateChart() {
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          categories: this.classBalances.map((c) => c.name),
        },
      };
      this.chartSeries = [
        {
          name: 'Balance',
          data: this.classBalances.map((c) => c.balance),
        },
      ];
    },
  },
  mounted() {
    this.fetchClassBalances();
  },
};
</script>
