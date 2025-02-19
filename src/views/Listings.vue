<template>
  <Default>
    <div v-if="listings.length === 0"
         class="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-flex tw-justify-center tw-items-center tw-flex-col tw-w-full tw-h-full">
      <div class="tw-mb-3">
        <LogoTitle>
          <h2 class="c-green-text tw-text-md tw-font-bold tw-mb-4 md:tw-mb-0 md:tw-mr-4">
            Let your sales skyrocket!
          </h2>
        </LogoTitle>
      </div>
      <div
          class="tw-flex md:tw-flex-row tw-flex-col"
      >
        <h2>You have not sold your produce</h2>
        <v-btn
            dense
            class="tw-rounded-lg tw-ml-5"
            color="secondary"
            @click="listingDialog = true"
        >Sell your produce</v-btn>
      </div>
    </div>
    <div class="" v-else>
      <div class="tw-flex tw-flex-row tw-p-5">
        <h2 class="tw-font-bold tw-text-green-800">You have made the following sales</h2>
        <v-btn
            dense
            class="tw-rounded-lg tw-ml-5"
            color="secondary"
            @click="listingDialog = true"
        >Sell your produce</v-btn>
      </div>
      <div>
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
        <v-dialog v-model="dialog" max-width="600px">
          <listing :listing-id="this.selectedListingId"></listing>
        </v-dialog>
      </div>
    </div>
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
  </Default>
</template>

<script>

import Default from '@/components/layout/Default.vue';
import LogoTitle from '@/components/shared/LogoText.vue';
import CreateListing from '@/components/CreateListing.vue';
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles.js';
import Listing from '@/components/Listing.vue';

export default {
  components: {
    Listing, CreateListing, LogoTitle, Default,
  },
  data() {
    return {
      listingDialog: false,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price', value: 'price.price' },
        { text: 'Unit', value: 'unit' },
        { text: 'Rating', value: 'rating' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      // Data
      listings: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
      page: 0,
      loading: false,
      // Dialog
      dialog: false,
      selectedListingId: '',
    };
  },
  mounted() {
    this.fetchListings();
  },
  computed: {
    getCurrentUserId,
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
    async fetchListings() {
      this.loading = true;
      try {
        const response = await axios.get('/listing/farmer', {
          params: {
            farmerId: getCurrentUserId(),
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
  },
  watch: {
    listingDialog(newValue) {
      if (newValue !== true) {
        this.fetchFarmerDetails();
        this.fetchListings();
      }
    },
  },
};
</script>

<style scoped>

</style>
