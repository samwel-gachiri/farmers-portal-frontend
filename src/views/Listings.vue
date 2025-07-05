<template>
  <Default>
    <div>
      <v-dialog v-model="listingDialog" max-width="500px">
        <create-listing/>
        <v-card-actions class="tw-justify-end">
          <v-btn color="primary"  @click="listingDialog = false">Close</v-btn>
        </v-card-actions>
      </v-dialog>

      <div>
        <div class="tw-flex tw-flex-row tw-justify-between tw-p-5">
          <v-btn
              v-if="false"
              dense
              class="tw-rounded-lg tw-ml-5"
              color="primary"
              @click="listingDialog = true"
          >
            <v-icon> mdi-shopping</v-icon>
            Sell your produce</v-btn>
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
            <template v-slot:item.file="{ item }">
              <v-btn outlined small color="secondary" @click="downloadPdf(item)">
                <v-icon color="maroon">mdi-file-pdf</v-icon>
                <v-icon color="maroon">mdi-download</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <create-listing/>
          <!-- <v-pagination v-model="page" :length="totalPages-1" @input="fetchListings" /> -->
          <!-- Dialog for Listing Details -->
          <v-dialog
              max-width="500px"
              v-model="dialog">
            <listing
                :key="this.selectedListingId"
                :listing-id="this.selectedListingId"
                @close-dialog="dialog = false"
            ></listing>
          </v-dialog>
        </div>
      </div>
    </div>
    <!-- Loading Spinner -->
<!--    <div class="tw-flex tw-justify-center tw-items-center tw-h-screen">-->
<!--      <v-progress-circular indeterminate color="primary"></v-progress-circular>-->
<!--    </div>-->
  </Default>
</template>

<script>

import Default from '@/components/layout/Default.vue';
import CreateListing from '@/components/listing/CreateListing.vue';
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles.js';
import Listing from '@/components/listing/Listing.vue';
import pluralize from 'pluralize';

export default {
  components: {
    Listing, CreateListing, Default,
  },
  data() {
    return {
      listingDialog: false,
      headers: [
        { text: 'Product', value: 'farmerProduce.farmProduce.name' },
        { text: 'Quantity', value: 'quantityWithUnit' },
        { text: 'Price', value: 'priceWithCurrency' },
        { text: 'Rating', value: 'rating' },
        { text: 'Status', value: 'status' },
        { text: 'Total Price', value: 'totalPrice' },
        { text: 'Actions', value: 'actions', sortable: false },
        { text: 'File', value: 'file', sortable: false },
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
    openListingDialog() {
      this.$toast.show('show');
      this.listingDialog = true;
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
    // View details of a listing
    viewDetails(item) {
      this.selectedListingId = item.id;
      this.dialog = true;
    },
    async downloadPdf(item) {
      this.isDownloading = true;
      await axios.get('/farmers-service/api/reports/listing/pdf', {
        params: {
          listingId: item.id,
        },
        responseType: 'arraybuffer',
      })
        .then((res) => {
          const contentDisposition = res.headers['content-disposition'];
          const fileNameRegex = /filename="(.+?)"/;
          const fileNameMatch = contentDisposition?.match(fileNameRegex);
          const fileName = fileNameMatch ? fileNameMatch[1] : 'REPORT.pdf';

          // Create a Blob from the byte array
          const blob = new Blob([res.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          // Create a temporary link to trigger the download
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();

          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((err) => {
          this.$toast.error('error', err.message);
        })
      // eslint-disable-next-line no-return-assign
        .finally(() => (this.isDownloading = false));
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
