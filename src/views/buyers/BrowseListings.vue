<template>
  <Default>
    <div class="tw-p-6">
      <!-- Search Bar -->
      <v-text-field
          v-model="searchQuery"
          label="Search for a produce..."
          variant="outlined"
          class="tw-mb-4"
          prepend-inner-icon="mdi-magnify"
          clearable
      ></v-text-field>

      <!-- Listings Grid -->
      <v-row>
        <v-col v-for="listing in filteredListings" :key="listing.id" cols="12" sm="6" md="4" lg="3">
          <v-card class="tw-rounded-2xl tw-shadow-lg hover:tw-shadow-xl tw-transition tw-duration-300">
            <!-- Image -->
            <v-img
                :src="listing.farmerProduce.imageUrls[0] || 'https://via.placeholder.com/200'"
                height="200"
                cover
                class="tw-rounded-t-2xl"
            ></v-img>

            <!-- Card Details -->
            <v-card-title class="tw-text-lg tw-font-semibold">{{ listing.farmerProduce.farmProduce.name }}</v-card-title>
            <v-card-text class="tw-text-gray-600">
              <p>Price: <span class="tw-font-bold">{{ listing.price.price }} {{ listing.price.currency }}</span></p>
              <p>Quantity: <span class="tw-font-bold">{{ listing.quantity }} {{ listing.unit }}</span></p>
              <p>Posted: <span class="tw-font-bold">{{formatDate(listing.createdAt) }}</span></p>
<!--              <p>Status: <span class="tw-font-bold tw-text-green-600" v-if="listing.status === 'ACTIVE'">Active</span>-->
<!--                <span class="tw-font-bold tw-text-red-600" v-else>Inactive</span>-->
<!--              </p>-->
            </v-card-text>

            <!-- Actions -->
            <v-card-actions>
              <v-btn color="primary" class="tw-w-full" variant="flat" @click="openDetails(listing)">
                View Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Dialog for Details & Ordering -->
    <v-dialog v-model="detailsDialog" max-width="700px">
      <v-card class="tw-rounded-xl tw-p-6 tw-shadow-lg">
        <v-card-title class="tw-text-2xl tw-font-bold tw-text-center">
          {{ listingToOrder?.farmerProduce.farmProduce.name }}
        </v-card-title>

        <v-card-text class="tw-space-y-4">
          <!-- Image Carousel -->
          <v-carousel show-arrows hide-delimiters height="300px">
            <v-carousel-item
                v-for="(img, index) in listingToOrder?.farmerProduce.imageUrls"
                :key="index"
                :src="img"
                class="tw-rounded-lg tw-object-cover"
            ></v-carousel-item>
          </v-carousel>

          <!-- Product Details -->
          <div class="tw-bg-gray-100 tw-p-4 tw-rounded-lg">
            <p class="tw-text-gray-700"><span class="tw-font-bold">Description:</span> {{ listingToOrder?.farmerProduce.farmProduce.description }}</p>
            <p class="tw-text-gray-700"><span class="tw-font-bold">Farming Type:</span> {{ listingToOrder?.farmerProduce.farmingType }}</p>
          </div>

          <!-- Order Section -->
          <div class="tw-bg-blue-50 tw-p-4 tw-rounded-lg tw-text-center">
            <h3 class="tw-text-xl tw-font-bold tw-text-blue-700">Place Your Order</h3>
            <v-text-field
                v-model="orderQuantity"
                label="Enter quantity"
                type="number"
                variant="outlined"
                class="tw-mt-2"
            ></v-text-field>
            <v-btn color="primary" class="tw-w-full tw-mt-2" :loading="loading" @click="orderListing">
              Order Now
            </v-btn>
          </div>
        </v-card-text>

        <v-card-actions class="tw-justify-end tw-mt-4">
          <v-btn color="red" variant="text" @click="detailsDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Default>
</template>

<script>
import axios from 'axios';
import Default from '@/components/layout/Default.vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

// Extend dayjs with relativeTime
dayjs.extend(relativeTime);

export default {
  components: { Default },
  data() {
    return {
      listings: [],
      searchQuery: '',
      detailsDialog: false,
      listingToOrder: null,
      orderQuantity: '',
      loading: false,
    };
  },
  computed: {
    filteredListings() {
      return this.listings.filter((listing) => listing.farmerProduce.farmProduce.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          || listing.farmerProduce.farmProduce.description.toLowerCase().includes(this.searchQuery.toLowerCase())
          || listing.farmerProduce.description.toLowerCase().includes(this.searchQuery.toLowerCase())
          || listing.farmerProduce.farmingType.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
  },
  mounted() {
    this.fetchListings();
  },
  methods: {
    formatDate(date) {
      return dayjs(date).fromNow(); // Converts raw date to "x time ago"
    },
    async fetchListings() {
      try {
        const response = await axios.get('/farmers-service/listing/list');
        this.listings = response.data.data;
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    },
    openDetails(listing) {
      this.listingToOrder = listing;
      this.detailsDialog = true;
    },
    async orderListing() {
      this.loading = true;
      const quantity = Number(this.orderQuantity);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        this.$toast.error('Enter a valid quantity.');
        this.loading = false;
        return;
      }

      try {
        const response = await axios.post('/farmers-service/listing/order', {
          listingId: this.listingToOrder.id,
          buyerId: this.getCurrentUserId(),
          quantity,
        });

        if (response.data.success) {
          this.$toast.success('Order placed successfully!');
          this.detailsDialog = false;
          this.listingToOrder = null;
          this.orderQuantity = '';
        } else {
          this.$toast.error(response.data.msg);
        }
      } catch (error) {
        this.$toast.error(`Error placing order: ${error.response?.data?.msg || error.message}`);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
/* Additional Tailwind styles */
</style>
