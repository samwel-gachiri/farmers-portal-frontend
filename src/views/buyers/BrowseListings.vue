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
<!--              <p>Status: <span class="tw-font-bold tw-text-green-600" v-if="listing.status === 'ACTIVE'">Active</span>-->
<!--                <span class="tw-font-bold tw-text-red-600" v-else>Inactive</span>-->
<!--              </p>-->
            </v-card-text>

            <!-- Actions -->
            <v-card-actions>
              <v-btn color="primary" class="tw-w-full" variant="flat">View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </Default>
</template>

<script>
import axios from 'axios';
import Default from '@/components/layout/Default.vue';

export default {
  components: { Default },
  data() {
    return {
      listings: [],
      searchQuery: '',
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
    async fetchListings() {
      try {
        const response = await axios.get('/farmers-service/listing/list');
        this.listings = response.data.data;
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    },
  },
};
</script>

<style>
/* Additional Tailwind styles */
</style>
