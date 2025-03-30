<template>
  <v-container class="p-6">
    <div class="tw-flex tw-flex-row tw-justify-between">
      <h1 class="tw-text-xl tw-font-bold tw-mb-4">Admin Dashboard</h1>
      <v-btn
          @click="fetchData"
          color="primary"
          class="tw-border-4"
          outlined
      >
        <v-icon color="primary">mdi-reload</v-icon>
        Reload</v-btn>
    </div>
    <v-row>
      <!-- Produce Sales Pie Chart -->
      <v-col cols="12" md="6">
        <v-card class="tw-rounded-2xl tw-shadow-lg tw-p-4">
          <h2 class="tw-text-lg tw-font-semibold tw-text-left">Total Sales per Produce</h2>
          <apexchart
              type="pie"
              :options="pieChartOptions"
              :series="pieChartSeries"
              class="tw-mt-4"
          />
        </v-card>
      </v-col>

      <!-- Daily Listings & Orders Line Chart -->
      <v-col cols="12" md="6">
        <v-card class="tw-rounded-2xl tw-shadow-lg p-4">
          <h2 class="tw-text-lg tw-font-semibold tw-text-center">Daily Listings & Orders</h2>
          <apexchart
              type="line"
              :options="lineChartOptions"
              :series="lineChartSeries"
              class="tw-mt-4"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import VueApexCharts from 'vue-apexcharts';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      // Pie Chart: Total Sales Per Produce
      pieChartSeries: [],
      pieChartOptions: {
        chart: {
          type: 'pie',
          toolbar: { show: true },
        },
        labels: [], // Labels set dynamically
      },

      // Line Chart: Daily Listings & Orders
      lineChartSeries: [],
      lineChartOptions: {
        chart: {
          type: 'area',
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: [], // Dates formatted dynamically
          title: { text: 'Date' },
          labels: {
            rotate: -45,
            formatter: (value) => this.formatDate(value),
          },
        },
        yaxis: {
          title: { text: 'Count' },
        },
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      await this.fetchProduceSales();
      await this.fetchDailyListings();
    },
    async fetchProduceSales() {
      try {
        const response = await axios.get('/api/admin/produce-sales');
        const data = response.data;

        this.pieChartSeries = data.map((item) => Math.round(item.totalSales));
        this.pieChartOptions = {
          ...this.pieChartOptions,
          labels: data.map((item) => item.name), // Fix for correct produce names
        };
      } catch (error) {
        console.error('Error fetching produce sales:', error);
      }
    },
    async fetchDailyListings() {
      try {
        const response = await axios.get('/api/admin/daily-listings');
        const data = response.data;

        const formattedDates = data.map((item) => this.formatDate(item.listingDate));

        this.lineChartOptions = {
          ...this.lineChartOptions,
          xaxis: {
            ...this.lineChartOptions.xaxis,
            categories: formattedDates, // Fix for proper date display
          },
        };

        this.lineChartSeries = [
          {
            name: 'Total Listings',
            data: data.map((item) => item.totalListings),
          },
          {
            name: 'Total Orders',
            data: data.map((item) => item.totalOrders),
          },
        ];
      } catch (error) {
        console.error('Error fetching daily listings:', error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).format(date);
    },
  },
};
</script>

<style scoped>
/* Tailwind utilities are already applied via classes */
</style>
