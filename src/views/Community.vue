<template>
  <Default>
    <!-- Dialog for Marker Info -->
    <v-dialog v-model="userDialog" max-width="400">
        <FarmerListingsDialog
            v-if="selectedUserFromMap?.role === 'farmer'"
            :selected-farmer="selectedUserFromMap"
            @close="selectedUserFromMap = null"
        />
        <BuyerRequestsDialog
          v-if="selectedUserFromMap?.role === 'buyer'"
          :selected-buyer="selectedUserFromMap"
          @close="selectedUserFromMap = null"
        />
<!--        <v-card-actions>-->
<!--          <v-btn @click="toggleConnection">-->
<!--            <v-icon v-if="isConnected">mdi-check-circle</v-icon>-->
<!--            {{ isConnected ? "Disconnect" : "Connect" }}-->
<!--          </v-btn>-->
<!--        </v-card-actions>-->
    </v-dialog>
    <div class="">
      <!-- Header -->
      <h1 class="tw-text-xl tw-font-bold tw-text-gray-800">Find Farmers and Buyers Here</h1>
      <div class="tw-flex md:tw-flex-row tw-flex-col tw-gap-5 tw-my-5">
        <v-select
            v-model="farmerFilter"
            :items="['All Farmers', 'Selling Farmers', 'None']"
            @change="loadMap"
            label="Select Farmers to View"
        ></v-select>

        <v-combobox
            v-model="selectedFarmer"
            :items="filteredFarmers"
            item-text="farmer.name"
            item-value=""
            return-object
            label="Search Farmers"
            :disabled="filteredFarmers.length === 0"
            clearable
        ></v-combobox>

        <!-- Filter Selection for Buyers -->
        <v-select
            v-model="buyerFilter"
            :items="['All Buyers', 'Requesting Buyers', 'None']"
            @change="loadMap"
            label="Select Buyers to View"
        ></v-select>

        <v-combobox
            v-model="selectedBuyer"
            :items="filteredBuyers"
            return-object
            item-text="buyer.name"
            label="Search Buyers"
            :disabled="filteredBuyers.length === 0"
            clearable
        >
        </v-combobox>

      </div>
      <div ref="map" id="map" class="tw-h-full tw-w-full"></div>
      <!-- Sidebar for Farmers/Buyers List -->
      <div v-if="false" class="tw-space-y-4">
        <v-card class="tw-bg-gray-800 tw-p-4 tw-rounded-lg tw-shadow-lg">
          <h2 class="tw-text-xl tw-font-semibold tw-text-green-900 tw-mb-4">Farmers Nearby</h2>
          <v-list class="tw-bg-gray-700 tw-rounded-lg">
            <v-list-item
                v-for="farmer in farmersLocation"
                :key="farmer.id"
                class="tw-mb-2 hover:tw-bg-gray-600 tw-cursor-pointer"
                @click="setFocusToLocation(farmer.latitude, farmer.longitude)"
            >
              <v-list-item-content>
                <v-list-item-title class="tw-text-green-900 tw-font-extrabold">{{ farmer.farmer.name }}</v-list-item-title>
                <v-list-item-subtitle class="tw-text-gray-400">
                  Produces: {{ farmer.farmer.farmerProduces.map(p => p.farmProduce.name).join(', ') || 'None' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card class="tw-bg-gray-800 tw-p-4 tw-rounded-lg tw-shadow-lg">
          <h2 class="tw-text-xl tw-font-semibold tw-text-green-900 tw-mb-4">Buyers Nearby</h2>
          <v-list class="tw-bg-gray-700 tw-rounded-lg">
            <v-list-item
                v-for="buyerLocation in buyersLocation"
                :key="buyerLocation.id"
                class="tw-mb-2 hover:tw-bg-gray-600 tw-cursor-pointer"
                @click="setFocusToLocation(buyerLocation.location.latitude, buyerLocation.location.longitude)"
            >
              <v-list-item-content>
                <v-list-item-title class="tw-text-green-900 tw-font-extrabold">{{ buyerLocation.name }}</v-list-item-title>
                <v-list-item-subtitle class="tw-text-gray-400">
                  Interested in: {{ buyerLocation.preferredProduces.map(p => p.bsfarmProduce.name).join(', ') || 'None' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <!-- Route Calculation Section -->
      <v-row class="tw-mt-8">
        <v-col cols="12" class="tw-text-center">
<!--          <v-btn-->
<!--              color="green"-->
<!--              class="tw-text-white"-->
<!--              @click="calculateRoute(center, farmersLocation[0])"-->
<!--          >-->
<!--            -->
<!--          </v-btn>-->
          <p v-if="distance" class="tw-text-gray-400 tw-mt-2">Distance: {{ (distance / 1000).toFixed(2) }} km</p>
        </v-col>
      </v-row>
    </div>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import googleMapsLoader from '@/components/GoogleMapsLoader.js';
// import axios from 'axios';
import { mapGetters, mapState } from 'vuex';
import FarmerListingsDialog from '@/components/listing/FarmerListingsDialog.vue';
import { getCurrentUserId } from '@/utils/roles.js';
import BuyerRequestsDialog from '@/components/request/BuyerRequestsDialog.vue';
import L from 'leaflet';
import axios from 'axios';

export default {
  components: { BuyerRequestsDialog, FarmerListingsDialog, Default },
  data() {
    return {
      map: null,
      google: null,
      markers: [],
      center: { lat: null, lng: null },
      farmersLocation: [
        {
          id: 'string',
          latitude: 0,
          longitude: 0,
          customName: 'string',
          farmer: {
            id: 'string',
            name: 'string',
            email: 'string',
            phoneNumber: 'string',
            createdAt: '2025-03-20T13:25:27.356Z',
            farmerProduces: [
              {
                id: 'string',
                farmProduce: {
                  id: 'string',
                  name: 'string',
                  description: 'string',
                  farmingType: 'string',
                  status: 'INACTIVE',
                },
                status: 'SELLING',
              },
            ],
          },
        },
      ],
      selectedFarmersLocations: [],
      buyersLocation: [
        {
          id: 'string',
          latitude: 0,
          longitude: 0,
          customName: 'string',
          buyer: {
            id: 'string',
            name: 'string',
            email: 'string',
            phoneNumber: 'string',
            createdAt: '2025-03-20T13:19:20.714Z',
            preferredProduces: [
              {
                id: 'string',
                status: 'INACTIVE',
                bsfarmProduce: {
                  id: 'string',
                  name: 'string',
                  description: 'string',
                  farmingType: 'string',
                  status: 'REQUESTING',
                },
              },
            ],
          },
        },
      ],
      selectedBuyersLocations: [],
      farmerFilter: 'All Farmers',
      buyerFilter: 'All Buyers',
      selectedFarmer: null,
      selectedBuyer: null,
      directionsService: null,
      directionsRenderer: null,
      distance: null,
      userDialog: false,
      selectedUserFromMap: null,
      isConnected: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      role: (state) => state.auth.role,
    }),
    ...mapGetters('auth', ['isAuthenticated']),
    filteredFarmers() {
      if (this.farmerFilter === 'Selling Farmers') {
        return this.farmersLocation.filter((farmer) => farmer.farmer.farmerProduces.some((produce) => produce.status === 'ON_SALE'));
      }
      if (this.farmerFilter === 'None') {
        return [];
      }
      return this.farmersLocation;
    },
    filteredBuyers() {
      if (this.buyerFilter === 'Requesting Buyers') {
        return this.buyersLocation.filter((buyer) => buyer.buyer.preferredProduces.some((preferred) => preferred.bsfarmProduce.status === 'REQUESTING'));
      }
      if (this.buyerFilter === 'None') return [];
      return this.buyersLocation;
    },
  },
  watch: {
    selectedFarmer(newFarmerLocation) {
      if (newFarmerLocation != null) {
        this.setFocusToLocation(newFarmerLocation.location.latitude, newFarmerLocation.location.longitude);
      }
    },
    selectedBuyer(newBuyerLocation) {
      this.$toast.show('Seleted buyer');
      if (newBuyerLocation != null) {
        this.setFocusToLocation(newBuyerLocation.location.latitude, newBuyerLocation.location.longitude);
      }
    },
    selectedUserFromMap(newValue) {
      if (newValue == null) {
        this.userDialog = false;
      }
    },
  },
  methods: {
    getCurrentUserId,
    buyFarmProduce(productId, productName) {
      this.$toast.success(`Buy ${productId} - ${productName}`);
    },

    initMap() {
      this.initGoogleMap();
    },
    loadMap() {
      this.loadGoogleMap();
    },
    initLeafletMap() {
      this.map = L.map('map').setView([0, 0], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);
    },
    initGoogleMap() {
      googleMapsLoader.load()
        .then((google) => {
          this.google = google;
          this.map = new google.maps.Map(this.$refs.map, {
            center: { lat: 0, lng: 0 },
            zoom: 16,
            heading: 320,
            tilt: 70.0,
            mapId: '8fafea89cad68455',
            rotateControl: true,
            disableDefaultUI: false,
          });
        })
        .then(() => {
          this.loadGoogleMap();
        })
        .catch((err) => {
          this.$toast.error(err.message);
        });
    },

    loadGoogleMap() {
      this.directionsService = new this.google.maps.DirectionsService();
      this.directionsRenderer = new this.google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);
      this.setFocusToLocation(this.center.lat, this.center.lng);
      // const marker = new this.google.maps.Marker({
      //   position: { lat: position.coords.latitude, lng: position.coords.longitude },
      //   map: this.map,
      //   label: {
      //     text: 'Your Location',
      //     color: 'white',
      //     fontSize: '12px',
      //     fontWeight: 'bold',
      //   },
      // });

      // marker.addListener('click', () => {
      //   this.$toast.success('You clicked your location!');
      // });

      this.filteredFarmers.forEach((farmerLocation) => {
        const farmerMarker = new this.google.maps.Marker({
          position: { lat: farmerLocation.location.latitude, lng: farmerLocation.location.longitude },
          map: this.map,
          icon: {
            // eslint-disable-next-line global-require
            url: require('@/assets/images/farmer_map_icon.png'),
            scaledSize: new this.google.maps.Size(50, 50),
          },
          label: {
            text: farmerLocation.name,
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          },
          title: farmerLocation.name,
        });
        farmerMarker.addListener('click', () => {
          this.selectedUserFromMap = { ...farmerLocation, role: 'farmer' };
          this.userDialog = true;
        });
      });
      this.filteredBuyers.forEach((buyerLocation) => {
        const buyerMarker = new this.google.maps.Marker({
          position: { lat: buyerLocation.location.latitude, lng: buyerLocation.location.longitude },
          map: this.map,
          icon: {
            // eslint-disable-next-line global-require
            url: require('@/assets/images/buyer_map_icon.png'),
            scaledSize: new this.google.maps.Size(50, 50),
          },
          label: {
            text: buyerLocation.name,
            color: 'yellow',
            fontSize: '12px',
            fontWeight: 'bold',
          },
          title: buyerLocation.name,
        });

        buyerMarker.addListener('click', () => {
          this.$toast.success(`Buyer: ${buyerLocation.name}`);
          this.selectedUserFromMap = { ...buyerLocation, role: 'buyer' };
          this.userDialog = true;
        });
      });
    },

    setFocusToLocation(lat, lng) {
      this.map.panTo({ lat, lng });
    },

    calculateRoute(start, end) {
      // eslint-disable-next-line no-undef,new-cap
      this.distance = new this.google.maps.geometry.spherical.computeDistanceBetween(
        // eslint-disable-next-line no-undef
        new this.google.maps.LatLng(start.lat, start.lng),
        // eslint-disable-next-line no-undef
        new this.google.maps.LatLng(end.lat, end.lng),
      );

      this.directionsService.route(
        {
          origin: start,
          destination: end,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          // eslint-disable-next-line no-undef
          if (status === google.maps.DirectionsStatus.OK) {
            this.directionsRenderer.setDirections(response);
          } else {
            this.$toast.error(`Directions request failed due to ${status}`);
          }
        },
      );
    },
    fetchUsersLocation() {
      // getting farmers location
      axios.get('/farmers-service/location/farmers', {
        params: {
          latitude: this.user.location.latitude,
          longitude: this.user.location.longitude,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.farmersLocation = response.data.data;
            this.selectedFarmersLocations = response.data.data;
          } else {
            this.$toast.error('Failed to load farmers locations');
          }
        })
        .catch((reason) => this.$toast.error(reason.message))
        .finally(() => {
          // now let's get buyer's locations
          axios.get('/buyers-service/location/buyers', {
            params: {
              latitude: this.user.location.latitude,
              longitude: this.user.location.longitude,
            },
          })
            .then((buyersLocationRes) => {
              if (buyersLocationRes.data.success) {
                this.buyersLocation = buyersLocationRes.data.data;
                this.selectedBuyersLocations = buyersLocationRes.data.data;
              } else {
                this.$toast.error('Failed to load buyers locations');
              }
              this.initMap();
            })
            .catch((reason) => this.$toast.error(reason.message));
        });
    },
  },
  mounted() {
    if (this.user.Location == null) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Update Vuex store properly
        await this.$store.dispatch('auth/updateUserLocation', location);
        this.fetchUsersLocation();
      }, (error) => {
        this.$toast.error(error.message);
      }, { enableHighAccuracy: true });
    } else {
      this.fetchUsersLocation();
    }
  },
};
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 10px;
  left: 0;
  right: 0;
}
</style>
