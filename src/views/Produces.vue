<template>
  <default>
    <div v-if="!loading" class="tw-w-full tw-h-screen">
      <!-- Dialogs -->
      <v-dialog v-model="addProduceDialog" max-width="500px">
        <v-card rounded="xl">
          <v-card-title class="headline">Add Farmer Produce</v-card-title>
          <v-card-text>
            <add-farmer-produce :farmer-produces="farmer.farmerProduces"></add-farmer-produce>
          </v-card-text>
          <v-card-actions class="tw-justify-end">
            <v-btn color="primary" @click="addProduceDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="listingDialog" max-width="500px">
        <create-listing></create-listing>
      </v-dialog>

      <!-- Main Content -->
      <div class="tw-p-8">
        <!-- Header -->
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
          <h2 class="tw-text-2xl tw-font-bold">
            {{ getCurrentUserId === farmer.id ? 'My' : `${farmer.name}'s` }} Farm Produces
          </h2>
          <v-btn
              v-if="getCurrentUserId === farmer.id"
              color="primary"
              @click="addProduceDialog = true"
          >
            <v-icon class="mdi" left>mdi-leaf</v-icon>
            Add Produce
          </v-btn>
        </div>

        <!-- Produces Table -->
        <v-data-table
            :headers="produceTableHeaders"
            :items="farmer.farmerProduces"
            :loading="loading"
            class="elevation-1"
        >
          <!--            :server-items-length="totalElements"-->
          <!-- Custom Row Template -->
          <template v-slot:item.actions="{ item }">
            <v-btn small color="primary" @click="listingDialog = true">Market {{item.farmProduce.name}}</v-btn>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-else class="tw-flex tw-justify-center tw-items-center tw-h-screen">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <!-- Share Dialog -->
    <v-dialog v-model="showDialog" max-width="400">
      <v-card>
        <v-card-title>Share this profile</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item @click="copyUrl">
              <v-list-item-icon><v-icon>mdi-content-copy</v-icon></v-list-item-icon>
              <v-list-item-title>Copy URL</v-list-item-title>
            </v-list-item>
            <v-list-item @click="shareToWhatsApp">
              <v-list-item-icon><v-icon>mdi-whatsapp</v-icon></v-list-item-icon>
              <v-list-item-title>Share to WhatsApp</v-list-item-title>
            </v-list-item>
            <v-list-item @click="shareToFacebook">
              <v-list-item-icon><v-icon>mdi-facebook</v-icon></v-list-item-icon>
              <v-list-item-title>Share to Facebook</v-list-item-title>
            </v-list-item>
            <v-list-item @click="shareToInstagram">
              <v-list-item-icon><v-icon>mdi-instagram</v-icon></v-list-item-icon>
              <v-list-item-title>Share to Instagram</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Feedback -->
    <v-snackbar v-model="showSnackbar" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </default>
</template>

<script>
import { getCurrentUserId } from '@/utils/roles.js';
import axios from 'axios';
import CreateListing from '@/components/listing/CreateListing.vue';
import AddFarmerProduce from '@/components/AddFarmersProduce.vue';
import Default from '@/components/layout/Default.vue';
import Auth from '@aws-amplify/auth';

export default {
  components: { Default, AddFarmerProduce, CreateListing },
  data() {
    return {
      produceTableHeaders: [
        { text: 'Produce', value: 'farmProduce.name' },
        { text: 'Description', value: 'farmProduce.description' },
        { text: 'Farming Type', value: 'farmProduce.farmingType' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      farmer: {
        id: '',
        name: '',
        email: '',
        phoneNumber: '',
        createdAt: '2025-01-25T09:38:38.536Z',
        location: {
          latitude: 0.0,
          longitude: 0.0,
          customName: '',
        },
        farmerProduces: [],
      },
      addProduceDialog: false,
      listingDialog: false,
      showDialog: false,
      showSnackbar: false,
      snackbarMessage: '',
      loading: false,
    };
  },
  mounted() {
    this.loading = true;
    this.fetchFarmerDetails();
  },
  computed: {
    getCurrentUserId,
  },
  methods: {
    fetchFarmerDetails() {
      axios.get(`/farmers-service/farmer?farmerId=${this.$route.params.farmerId}`)
        .then(async (response) => {
          if (response.data.data == null) {
            const user = await Auth.currentAuthenticatedUser();
            if (user !== null && user.attributes.sub === this.$route.params.farmerId) {
              this.farmer = {
                id: user.attributes.sub,
                name: user.attributes.name,
                email: '',
                phoneNumber: user.attributes.phone_number,
                createdAt: '',
                farmerProduces: [],
              };
              axios.post('/farmers-service/farmer', this.farmer).then((res) => {
                if (res.data.success === true) {
                  this.$toast.success('User added to database');
                }
              });
            }
            this.$toast.error('User not found');
            this.$router.go(-1);
          }
          this.farmer = { ...this.farmer, ...response.data.data };
        })
        .catch((e) => {
          this.$toast.error(e.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openShareDialog() {
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    },
    copyUrl() {
      const currentUrl = window.location.href;
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          this.snackbarMessage = 'URL copied to clipboard!';
          this.showSnackbar = true;
        })
        .catch((err) => {
          this.snackbarMessage = 'Failed to copy URL.';
          this.showSnackbar = true;
          this.$toast.error('Failed to copy URL: ', err.message);
        });
    },
    shareToWhatsApp() {
      const currentUrl = encodeURIComponent(window.location.href);
      window.open(`https://wa.me/?text=${currentUrl}`, '_blank');
    },
    shareToFacebook() {
      const currentUrl = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank');
    },
    shareToInstagram() {
      this.snackbarMessage = 'Instagram does not support direct URL sharing.';
      this.showSnackbar = true;
      window.open('https://www.instagram.com', '_blank');
    },
  },
  watch: {
    listingDialog(newValue) {
      if (newValue !== true) {
        this.fetchFarmerDetails();
      }
    },
  },
};
</script>

<style scoped>
.tw-bg-gradient-to-r {
  background: linear-gradient(to right, #e0f7fa, #e8f5e9);
}
</style>
