<template>
  <v-container class="tw-bg-gray-50">
      <v-dialog v-model="listingDialog" max-width="500px">
        <create-listing/>
        <v-btn
            class="tw-bg-white"
            color="error"
            text
            @click="listingDialog = false"
        >
          Close
        </v-btn>
      </v-dialog>
    <v-dialog v-model="photoCaptureDialog" max-width="500px">
        <PhotoCapture/>
      </v-dialog>
      <!-- Dashboard Header -->
<!--      <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800">Farmer Dashboard</h1>-->
<!--      <v-row class="tw-mb-3">-->
<!--        <v-col cols="12">-->
<!--&lt;!&ndash;          <p class="tw-text-gray-600">Welcome back, {{ user.name }}! Here's your overview.</p>&ndash;&gt;-->
<!--        </v-col>-->
<!--      </v-row>-->

      <!-- Stats Cards -->
      <div class="tw-flex tw-w-full tw-flex-row tw-gap-5 tw-mb-4">
          <v-card  class="tw-w-full tw-pl-4 tw-pt-2 tw-rounded-lg tw-shadow-md hover:shadow-lg transition-shadow">
            <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800">Sales Made</h2>
            <p class="tw-text-3xl tw-font-bold tw-text-green-600">{{liveCount.activeListings}}</p>
<!--            <p class="tw-text-gray-500">Active listings</p>-->
          </v-card>
          <v-card  class="tw-w-full tw-pl-4 tw-pt-2 tw-rounded-lg tw-shadow-md hover:shadow-lg transition-shadow">
            <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800"><v-icon>mdi-account-group</v-icon> Interactions</h2>
            <p class="tw-text-3xl tw-font-bold tw-text-blue-600">{{liveCount.buyersInteraction}}</p>
<!--            <p class="tw-text-gray-500">This month</p>-->
          </v-card>
          <v-card  class="tw-w-full tw-pl-4 tw-pt-2 tw-rounded-lg tw-shadow-md hover:shadow-lg transition-shadow">
            <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800"><v-icon>mdi-cash-multiple</v-icon> Revenue</h2>
            <p class="tw-text-3xl tw-font-bold tw-text-purple-600">{{liveCount.revenue30Days.currency + liveCount.revenue30Days.price.toLocaleString()}}</p>
<!--            <p class="tw-text-gray-500">Last 30 days</p>-->
          </v-card>
      </div>
    <v-row v-if="false">
      <v-col v-for="(quickLink, i) in quickLinks" :key="i" cols="12" md="4"
      >
        <v-hover v-slot="{ hover }">
          <v-card
              rounded="lg"
              :elevation="hover ? 12 : 4"
              class="pa-6 tw-text-center benefit-card"
              :color="quickLink.color"
              dark
              @click="quickLinkClicked(quickLink.link)"
          >
            <v-avatar v-if="quickLink.class != null" size="80" :color="quickLink.iconColor" class="mb-4">
              <v-icon :class="quickLink.class" size="40">{{ quickLink.icon }}</v-icon>
            </v-avatar>
            <v-avatar v-else size="80" :color="quickLink.iconColor" class="mb-4">
              <v-icon size="40">{{ quickLink.icon }}</v-icon>
            </v-avatar>
            <h3 class="text-h5 tw-font-weight-bold mb-3">{{ quickLink.title }}</h3>
            <p class="text-body-1">{{ quickLink.text }}</p>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <card-title
              icon="mdi-corn"
          >
            <h1 class="tw-text-lg tw-font-bold tw-text-gray-800">Post Produce</h1>
          </card-title>
          <v-card-text>
            <div>
              <v-text-field
                  v-model="newProducePost.name"
                  label="name"
              ></v-text-field>
              <!-- add a div below with quantity and price arranged horizontally -->
              <div class="tw-flex tw-gap-4">
                <v-text-field
                    v-model="newProducePost.quantity"
                  label="Quantity"
                  class="tw-flex-1"
                ></v-text-field>
                <v-text-field
                  v-model="newProducePost.price"
                  label="Price"
                  class="tw-flex-1"
                ></v-text-field>
              </div>
              <v-card-actions>
                <v-btn
                  block
                  @click="photoCaptureDialog = true"
                  color="primary"
                >Submit</v-btn>
              </v-card-actions>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <card-title
              icon="mdi-basket"
          >
            <h1 class="tw-text-lg tw-font-bold tw-text-gray-800">Buyers Requests</h1>
          </card-title>
          <v-card-text>
            <h6>no request made</h6>
            <v-icon>mdi-clock</v-icon>
          </v-card-text>
        </v-card>
        <v-card
            rounded
        >
        </v-card>
      </v-col>
    </v-row>
      <!-- Stats Cards -->
<!--      <v-row class="tw-mb-8">-->
        <!--      <v-col cols="12" md="4">-->
        <!--        <v-card rounded="xl" class="tw-pl-4 tw-pt-2 tw-rounded-lg tw-shadow-md hover:shadow-lg transition-shadow">-->
        <!--          <h2 class="tw-text-xl font-semibold text-gray-800">Total Listings</h2>-->
        <!--          <p class="tw-text-3xl tw-font-bold tw-text-green-600">{{liveCount.activeListings}}</p>-->
        <!--          <p class="tw-text-gray-500">Active listings</p>-->
        <!--        </v-card>-->
        <!--      </v-col>-->
        <!--      <v-col cols="12" md="4">-->
        <!--        <v-card rounded="xl" class="tw-pl-4 tw-pt-2 tw-rounded-lg tw-shadow-md hover:shadow-lg transition-shadow">-->
        <!--          <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800">Buyer Interactions</h2>-->
        <!--          <p class="tw-text-3xl tw-font-bold tw-text-blue-600">{{liveCount.buyersInteraction}}</p>-->
        <!--          <p class="tw-text-gray-500">This month</p>-->
        <!--        </v-card>-->
        <!--      </v-col>-->
<!--        <v-col cols="12">-->
<!--          <v-card rounded="xl" class="tw-pl-4 tw-pt-2 tw-rounded-lg tw-shadow-md hover:shadow-lg transition-shadow">-->
<!--            <apexchart-->
<!--                type="bar"-->
<!--                height="400"-->
<!--                :options="chartOptions"-->
<!--                :series="series"-->
<!--            ></apexchart>-->
<!--            <v-data-table-->
<!--              :headers="headers"-->
<!--              :items="listings"-->
<!--              :loading="loading"-->
<!--              :items-per-page="size"-->
<!--              :page.sync="page"-->
<!--              @update:page="fetchListings"-->
<!--              class="elevation-1"-->
<!--            >-->
<!--              <template v-slot:item.createdAt="{ item }">-->
<!--                <h2>{{ formatToHumanWithTime(item.createdAt) }}</h2>-->
<!--              </template>-->
<!--            </v-data-table>-->
<!--            <v-pagination v-model="page" :length="totalPages-1" @input="fetchListings" />-->
<!--          </v-card>-->
<!--        </v-col>-->
<!--      </v-row>-->
      <!-- Quick Actions -->
<!--      <v-row>-->
<!--        <v-col cols="12">-->
<!--          <v-card class="tw-p-6 tw-rounded-lg tw-shadow-md">-->
<!--            <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">Quick Actions</h2>-->
<!--            <div class="tw-flex md:tw-flex-row tw-flex-col tw-gap-5">-->
<!--              <v-btn color="primary" class="flex-1" @click="listingDialog = true">-->
<!--                <v-icon left>mdi-plus</v-icon>-->
<!--                Add New Listing-->
<!--              </v-btn>-->
<!--            </div>-->
<!--          </v-card>-->
<!--        </v-col>-->
<!--      </v-row>-->
    </v-container>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles.js';
import CreateListing from '@/components/listing/CreateListing.vue';
import pluralize from 'pluralize';
import { formatToHumanWithTime } from '@/utils/time.js';
import CardTitle from '@/components/shared/CardTitle.vue';
import PhotoCapture from '@/components/pictures/PhotoCapture.vue';
// import VueApexCharts from 'vue-apexcharts';

export default {
  components: {
    PhotoCapture,
    CardTitle,
    CreateListing,
    // apexchart: VueApexCharts,
  },
  data() {
    return {
      loading: false,
      listingDialog: false,
      photoCaptureDialog: false,
      headers: [
        { text: 'Product', value: 'farmerProduce.farmProduce.name' },
        { text: 'Quantity', value: 'quantityWithUnit' },
        { text: 'Price', value: 'priceWithCurrency' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'Status', value: 'status' },
        { text: 'Total Price', value: 'totalPrice' },
      ],
      // Data
      listings: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
      page: 0,
      dialog: false,
      liveCount: {
        activeListings: 3,
        buyersInteraction: 1,
        revenue30Days: {
          price: 100,
          currency: 'KSH',
        },
      },
      newProducePost: {
        name: '',
        quantity: '',
        price: '',
      },
      quickLinks: [
        {
          title: 'Farm AI',
          text: 'Get Advice on Farming Practices',
          icon: 'mdi-react',
          class: 'gradient-icon',
          iconColor: 'success',
          color: 'primary',
          link: {
            name: 'FarmAI',
          },
        },
        {
          title: 'Community',
          text: 'View farmers and buyers near you!',
          icon: 'mdi-account-group',
          iconColor: '#2064af',
          color: 'brown',
          link: {
            name: 'Community',
          },
        },
        {
          title: 'Sales',
          text: 'Sell your produce, view what you sold',
          icon: 'mdi-cash-multiple',
          iconColor: 'info',
          color: 'darkblue',
          link: {
            name: 'Listings',
          },
        },
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          stacked: false,
          toolbar: { show: false },
        },
        xaxis: {
          categories: [], // Will be populated dynamically
          title: { text: 'Sale Month' },
          labels: { rotate: -45 },
        },
        yaxis: [
          {
            title: { text: 'Total Revenue ($)' },
            labels: { formatter: (value) => `$${value.toFixed(2)}` },
          },
          {
            opposite: true,
            title: { text: 'Total Sold (kg)' },
            labels: { formatter: (value) => `${value.toFixed(1)} kg` },
          },
        ],
        plotOptions: {
          bar: {
            columnWidth: '50%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val.toFixed(1),
        },
        title: {
          text: 'Produce Sales Report',
          align: 'center',
        },
        legend: { position: 'top' },
        stroke: { width: [0, 2] }, // No stroke for bar, 2px for line
      },
      series: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
  mounted() {
    this.fetchLiveCount();
    // this.fetchSalesReport();
    // this.fetchListings();
  },
  methods: {
    formatToHumanWithTime,
    quickLinkClicked(link) {
      this.$router.push(link);
    },
    async fetchListings() {
      this.loading = true;
      try {
        const response = await axios.get('/farmers-service/listing/farmer', {
          params: {
            farmerId: getCurrentUserId(),
            page: this.page,
            size: this.size,
          },
        });
        const data = response.data.data;
        this.listings = data.content
          .map((item) => ({
            ...item,
            quantityWithUnit: `${item.quantity} ${item.quantity > 1 ? item.unit : pluralize(item.unit)}`,
            priceWithCurrency: `${item.price.currency} ${item.price.price} @ ${item.unit}`,
            totalPrice: `${item.price.currency} ${item.price.price * item.quantity}`,
          }));
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      } catch (error) {
        this.$toast.error('Error fetching listings:', error.message);
      } finally {
        this.loading = false;
      }
    },
    async fetchSalesReport() {
      try {
        await axios.get(`/farmers-service/api/dashboard/sales-report?farmerId=${getCurrentUserId()}`);
        const groupedData = {};

        // Organize data by saleMonth and produce
        this.salesData.forEach((item) => {
          if (!groupedData[item.saleMonth]) {
            groupedData[item.saleMonth] = {};
          }
          groupedData[item.saleMonth][item.produceName] = {
            totalSold: item.totalSold,
            totalRevenue: item.totalRevenue,
          };
        });

        // Extract unique produce names
        const allProduceNames = [...new Set(this.salesData.map((item) => item.produceName))];
        const categories = Object.keys(groupedData).sort(); // Sorted sale months

        // Prepare series data for revenue (bars) and total sold (line)
        const revenueSeries = {
          name: 'Total Revenue',
          type: 'column',
          data: categories.map((month) => allProduceNames.reduce((sum, produce) => sum + (groupedData[month][produce]?.totalRevenue || 0), 0)),
        };

        const soldSeries = {
          name: 'Total Sold',
          type: 'line',
          data: categories.map((month) => allProduceNames.reduce((sum, produce) => sum + (groupedData[month][produce]?.totalSold || 0), 0)),
        };

        this.chartOptions.xaxis.categories = categories;
        this.series = [revenueSeries, soldSeries];
      } catch (error) {
        this.$toast.error('Error fetching sales data:', error.message);
      }
    },
    // fetchListings() {
    //   axios.get(`/listing/farmer?farmerId=${getCurrentUserId()}`)
    //     .then((response) => {
    //       console.log(response.data.data);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    // Fetch listings from the API
    async fetchLiveCount() {
      this.loading = true;
      try {
        const response = await axios.get('/farmers-service/api/dashboard/live/count', {
          params: {
            farmerId: getCurrentUserId(),
          },
        });
        if (response.data.success === true) this.liveCount = response.data.data;
      } catch (error) {
        this.$toast.error('Error fetching live count', error.message);
      } finally {
        this.loading = false;
      }
    },
    async postProduce() {
      const formData = new FormData();
      formData.append('farmerId', getCurrentUserId());
      formData.append('name', this.newProducePost.name);
      formData.append('quantity', this.newProducePost.quantity);
      formData.append('price', this.newProducePost.price);

      if (this.newProduce.images.length) {
        this.newProduce.images.forEach((file) => {
          formData.append('images', file);
        });
      }

      try {
        const response = await axios.post('/farmers-service/farmer/add-farmer-produce', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.success) {
          this.farmerProduces = response.data.data;
          this.$toast.success('Posted successfully!');
        } else {
          this.$toast.error('Addition failed!', response.data.msg);
        }
      } catch (error) {
        this.$toast.error('Error adding produce to farmer!', `${error}`);
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    listingDialog(newValue) {
      if (newValue !== true) {
        this.fetchLiveCount();
        this.fetchListings();
      }
    },
  },
};
</script>

<style scoped>
/* Tailwind-like utility classes */
.bg-gray-50 {
  background-color: #f9fafb;
}
.min-h-screen {
  min-height: 100vh;
}
.p-8 {
  padding: 2rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.text-3xl {
  font-size: 1.875rem;
}
.font-bold {
  font-weight: 700;
}
.text-gray-800 {
  color: #1f2937;
}
.text-gray-600 {
  color: #4b5563;
}
.text-green-600 {
  color: #16a34a;
}
.text-blue-600 {
  color: #2563eb;
}
.text-purple-600 {
  color: #9333ea;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.transition-shadow {
  transition: box-shadow 0.3s ease-in-out;
}
.flex {
  display: flex;
}
.space-x-4 > * + * {
  margin-left: 1rem;
}
.flex-1 {
  flex: 1;
}
</style>
