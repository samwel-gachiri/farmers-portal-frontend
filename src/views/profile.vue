<template>
  <default>
      <div
        class="no-scroll-width tw-w-full tw-flex md:tw-flex-row tw-flex-col tw-h-screen"
      >
        <v-dialog v-model="addProduceDialog" max-width="500px">
          <add-farmer-produce
              :farmer-produces="farmer.farmerProduces"
          ></add-farmer-produce>
        </v-dialog>
        <v-dialog v-model="listingDialog" max-width="500px">
          <create-listing></create-listing>
        </v-dialog>
        <!-- Profile details    -->
        <div
            class="tw-h-full  md:tw-w-auto tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-3 tw-pb-3"
        >
          <h2
              class="tw-font-bold"
          >{{ farmer.name }}</h2>
          <v-img
              height="200px"
              width="200px"
              class="tw-border tw-rounded-full"
          />
          <div class="tw-flex tw-my-4 tw-gap-5">
            <v-btn
                small
                outlined
                v-if="getCurrentUserId !== farmer.id"
            >connect</v-btn>
            <v-btn
                small
                outlined
                @click="openShareDialog"
            >
              <v-icon>mdi mdi-share</v-icon>
              Share
            </v-btn>
          </div>
          <div
              class="tw-flex tw-h-full tw-w-full tw-justify-center tw-items-center tw-flex-col tw-gap-5"
          >
            <h2 v-if="false">{{ "⭐⭐⭐" }}</h2>
            <div
                class="tw-flex tw-w-full tw-flex-row tw-justify-center tw-items-center"
            >
              <div
                  class="tw-flex tw-flex-col tw-justify-center tw-items-center"
              >
                <span class="tw-font-bold">{{ farmer.location.customName }}</span>
                <h2>({{ farmer.location.latitude }}, {{ farmer.location.longitude }})</h2>
              </div>
              <v-btn
                  v-if="getCurrentUserId === farmer.id"
                  @click="getLocation"
              >
                <v-icon color="linear-gradient(green, red)" >mdi-google-maps</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <!-- Produces   -->
        <div
            class="tw-w-full md:tw-border-t-0 tw-border-t-2 md:tw-border-l-2 tw-border-l-0 tw-flex tw-justify-center tw-items-center tw-flex-col tw-bg-gray-100
  "
        >
          <h2 class="title tw-font-bold tw-p-4 tw-shadow-2xl">{{getCurrentUserId === farmer.id? 'My': `${farmer.name}'s` }} farm Produces</h2>
          <v-icon class="">mdi-cow</v-icon>
          <v-icon class="">mdi-corn</v-icon>
          <v-btn
              v-if="getCurrentUserId === farmer.id"
              class="tw-ml-4"
              color="secondary"
              @click="addProduceDialog = true"
          >Add produces you sell</v-btn>
          <div
              class="produce-list tw-bg-gray-100 tw-w-full tw-gap-5"
          >
            <div
                v-for="(produce, i) in farmer.farmerProduces"
                v-bind:key="i"
                class="produce-list-child tw-m-4 tw-p-4"
            >
              <div
                  class="tw-my-3 tw-flex tw-flex-row"
              >
                <v-icon
                    size="100px"
                >mdi mdi-image</v-icon>
                <div class="tw-flex tw-flex-col tw-justify-center tw-items-start">
                  {{ produce.farmProduce.name }}
                  <h3>{{ produce.farmProduce.description }}</h3>
                </div>
              </div>
              <h2
                  v-if="false"
                  class="tw-mb-3 tw-ml-4"
              > ⭐⭐⭐ </h2>
              <v-btn
                  class="tw-ml-4 mdi-sal tw-rounded-none"
                  dense
                  outlined
                  @click="listingDialog = true"
                  v-if="getCurrentUserId === farmer.id"
              >
                <v-icon>mdi-set-all</v-icon>
                Market this produce
              </v-btn>
            </div>
          </div>
        </div>
      </div>
      <!-- Share Dialog -->
      <v-dialog v-model="showDialog" max-width="400">
        <v-card>
          <v-card-title>Share this profile</v-card-title>
          <v-card-text>
            <v-list>
              <!-- Copy URL -->
              <v-list-item @click="copyUrl">
                <v-list-item-icon>
                  <v-icon>mdi-content-copy</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Copy URL</v-list-item-title>
              </v-list-item>

              <!-- Share to WhatsApp -->
              <v-list-item @click="shareToWhatsApp">
                <v-list-item-icon>
                  <v-icon>mdi-whatsapp</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Share to WhatsApp</v-list-item-title>
              </v-list-item>

              <!-- Share to Facebook -->
              <v-list-item @click="shareToFacebook">
                <v-list-item-icon>
                  <v-icon>mdi-facebook</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Share to Facebook</v-list-item-title>
              </v-list-item>

              <!-- Share to Instagram -->
              <v-list-item @click="shareToInstagram">
                <v-list-item-icon>
                  <v-icon>mdi-instagram</v-icon>
                </v-list-item-icon>
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

      <!-- Snackbar for feedback -->
      <v-snackbar v-model="showSnackbar" :timeout="3000">
        {{ snackbarMessage }}
      </v-snackbar>
  </default>
</template>

<script>

import { getCurrentUserId } from '@/utils/roles';
import axios from 'axios';
import CreateListing from '@/components/CreateListing';
import AddFarmerProduce from '@/components/AddFarmersProduce';
import Default from '@/components/layout/Default';

export default {
  components: { Default, AddFarmerProduce, CreateListing },
  data() {
    return {
      farmer: {
        id: 'string',
        name: 'string',
        email: 'string',
        phoneNumber: 'string',
        createdAt: '2025-01-25T09:38:38.536Z',
        // rating: 3,
        location: {
          latitude: 0.0,
          longitude: 0.0,
          customName: '',
        },
        farmerProduces: [
          {
            id: 'string',
            farmer: 'string',
            farmProduce: {
              id: 'string',
              name: 'string',
              description: 'string',
              farmingType: 'string',
              status: 'INACTIVE',
            },
            status: 'INACTIVE',
          },
        ],
      },
      isEdit: false,
      addProduceDialog: false,
      listingDialog: false,
      showDialog: false, // Controls the visibility of the share dialog
      showSnackbar: false, // Controls the visibility of the snackbar
      snackbarMessage: '', // Message to display in the snackbar
    };
  },
  mounted() {
    this.fetchFarmerDetails();
  },
  computed: {
    getCurrentUserId,
  },
  methods: {
    getLocation() {
      this.$toast.show('Collecting location infor');
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.farmer.location.latitude = position.coords.latitude;
        this.farmer.location.longitude = position.coords.longitude;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.farmer.location.latitude},${this.farmer.location.longitude}
&location_type=ROOFTOP&result_type=street_address&key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              this.$toast.error(`Network response was not ok ${response.statusText}`);
            }
            return response.json(); // or response.text(), response.blob(), etc.
          })
          .then((data) => {
            this.farmer.location.customName = data.plus_code.compound_code;
            axios.put('/location/farmer', {
              farmerId: getCurrentUserId(),
              locationRequestDto: {
                latitude: this.farmer.location.latitude,
                longitude: this.farmer.location.longitude,
                customName: this.farmer.location.customName,
              },
            }).then((response) => {
              if (response.data.success === true) {
                this.$toast.success('Location updated successfully!');
              } else {
                this.$toast.error('Failed to update location', response.data.msg);
              }
            });
          })
          .catch((error) => {
            this.$toast.error('Error fetching location name');
          });
      },
      (positionError) => {
        this.$toast.error(positionError.message);
      });
    },
    fetchFarmerDetails() {
      axios.get(`/farmer?farmerId=${this.$route.params.farmerId}`).then((response) => {
        if (response.data.data == null) throw Error('User not found');
        this.farmer = { ...this.farmer, ...response.data.data };
      }).catch((e) => {
        this.$toast.error(e.message);
      });
      axios.get(`/location/farmer?farmerId=${this.$route.params.farmerId}`).then((response) => {
        if (response.data.success === true) {
          const data = response.data.data;
          this.farmer.location.latitude = data?.latitude;
          this.farmer.location.longitude = data?.longitude;
          this.farmer.location.customName = data?.customName;
        }
      }).catch((e) => {
        this.$toast.error(e.message);
      });
    },
    // Open the share dialog
    openShareDialog() {
      this.showDialog = true;
    },

    // Close the share dialog
    closeDialog() {
      this.showDialog = false;
    },

    // Copy the current URL to the clipboard
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

    // Share to WhatsApp
    shareToWhatsApp() {
      const currentUrl = encodeURIComponent(window.location.href);
      window.open(`https://wa.me/?text=${currentUrl}`, '_blank');
    },

    // Share to Facebook
    shareToFacebook() {
      const currentUrl = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank');
    },

    // Share to Instagram
    shareToInstagram() {
      // Instagram does not support direct sharing of URLs, so we open the Instagram homepage
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
.no-scroll-width {
  max-width: 100vw;
}
.produce-list {
  max-height: 100vh;
  width: 100%;
  overflow: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  }
.produce-list-child {
  background-color: white;
  width: 300px;
  height: 250px;
}
.title{
  font-family: "trebuc";
}
</style>
