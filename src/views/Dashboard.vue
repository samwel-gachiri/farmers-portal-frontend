<template>
  <Default>
    <v-container class="tw-bg-gray-50 tw-min-h-screen p-8">
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
      <v-dialog v-model="dialog">
        <listing :listing-id="selectedListingId"></listing>
      </v-dialog>
    <!-- Dashboard Header -->
    <v-row class="tw-mb-8">
      <v-col cols="12">
        <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800">Farmer Dashboard</h1>
        <p class="tw-text-gray-600">Welcome back, {{ user.name }}! Here's your overview.</p>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="tw-mb-8">
      <v-col cols="12" md="4">
        <v-card class="tw-p-6 tw-rounded-lg tw-shadow-md hover:shadow-lg transition-shadow">
          <h2 class="tw-text-xl font-semibold text-gray-800">Total Listings</h2>
          <p class="tw-text-3xl tw-font-bold tw-text-green-600">{{liveCount.activeListings}}</p>
          <p class="tw-text-gray-500">Active listings</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="tw-p-6 tw-rounded-lg tw-shadow-md hover:shadow-lg transition-shadow">
          <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800">Buyer Interactions</h2>
          <p class="tw-text-3xl tw-font-bold tw-text-blue-600">{{liveCount.buyersInteraction}}</p>
          <p class="tw-text-gray-500">This month</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="tw-p-6 tw-rounded-lg tw-shadow-md hover:shadow-lg transition-shadow">
          <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800">Revenue</h2>
          <p class="tw-text-3xl tw-font-bold tw-text-purple-600">{{liveCount.revenue30Days.currency + liveCount.revenue30Days.price.toLocaleString()}}</p>
          <p class="tw-text-gray-500">Last 30 days</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Listings -->
    <v-row class="tw-mb-8">
      <v-col cols="12">
        <v-card class="tw-p-6 tw-rounded-lg tw-shadow-md">
          <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">Recent Listings</h2>
          <v-data-table
              :headers="headers"
              :items="listings"
              :loading="loading"
              :items-per-page="size"
              :page.sync="page"
              @update:page="fetchListings"
              class="elevation-1"
          >
            <!--            :server-items-length="totalElements"-->
            <!-- Custom Row Template -->
            <template v-slot:item.actions="{ item }">
              <v-btn small color="primary" @click="viewDetails(item)">View</v-btn>
            </template>
          </v-data-table>

          <v-pagination v-model="page" :length="totalPages-1" @input="fetchListings" />
          <!-- Dialog for Listing Details -->
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row>
      <v-col cols="12">
        <v-card class="tw-p-6 tw-rounded-lg tw-shadow-md">
          <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">Quick Actions</h2>
          <div class="tw-flex md:tw-flex-row tw-flex-col tw-gap-5">
            <v-btn color="primary" class="flex-1" @click="listingDialog = true">
              <v-icon left>mdi-plus</v-icon>
              Add New Listing
            </v-btn>
            <v-btn color="secondary" class="flex-1" @click="this.$router.push({name: 'Reports'})">
              <v-icon left>mdi-chart-line</v-icon>
              View Analytics
            </v-btn>
            <v-btn color="success" class="flex-1">
              <v-icon left>mdi-email</v-icon>
              Message Buyers
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default';
import { mapState } from 'vuex';
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles';
import CreateListing from '@/components/CreateListing';
import Listing from '@/components/Listing';

export default {
  components: {
    Listing, CreateListing, Default,
  },
  data() {
    return {
      loading: false,
      listingDialog: false,
      headers: [
        // { text: 'ID', value: 'id' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price', value: 'price.price' },
        { text: 'Unit', value: 'unit' },
        { text: 'Rating', value: 'rating' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      // Data
      listings: [],
      selectedListingId: '',
      dialog: false,
      liveCount: {
        activeListings: 3,
        buyersInteraction: 1,
        revenue30Days: {
          price: 100,
          currency: 'KSH',
        },
      },
      totalElements: 0,
      totalPages: 0,
      size: 10,
      page: 0,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
  mounted() {
    this.fetchLiveCount();
    this.fetchListings();
  },
  methods: {
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
        const response = await axios.get('/api/dashboard/live/count', {
          params: {
            farmerId: getCurrentUserId(),
          },
        });
        if (response.data.success === true) this.liveCount = response.data.data;
      } catch (error) {
        this.$toast.error('Error fetching listings:', error.message);
      } finally {
        this.loading = false;
      }
    },
    async fetchListings() {
      this.loading = true;
      try {
        const response = await axios.get('/listing/farmer', {
          params: {
            farmerId: getCurrentUserId(), // Replace with actual farmer ID
            page: this.page,
            size: this.size,
          },
        });
        const data = response.data.data;
        this.listings = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      } catch (error) {
        this.$toast.error('Error fetching listings:', error.message);
      } finally {
        this.loading = false;
      }
    },
    // View details of a listing
    viewDetails(item) {
      this.selectedListingId = item.id;
      this.dialog = true;
    },
    // Accept an order
    acceptOrder(order) {
      axios.put(`/listing/order/accept?orderId=${order.id}`).then((response) => {
        if (response.data.success === true) {
          this.$toast.success('Order accepted', order.id);
        } else {
          this.$toast.error(response.data.msg, 'Failed to accept');
        }
      })
        .catch((error) => {
          this.$toast.error(error.message);
        });
    },
    confirmPayment(order) {
      axios.put(`/listing/order/confirm-payment?orderId=${order.id}`).then((response) => {
        if (response.data.success === true) {
          this.$toast.success('Payment confirmed', order.id);
        } else {
          this.$toast.error(response.data.msg, 'Failed to confirm payment');
        }
      })
        .catch((error) => {
          this.$toast.error(error.message);
        });
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
