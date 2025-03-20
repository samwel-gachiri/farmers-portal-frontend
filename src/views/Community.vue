<template>
  <Default>
    <div class="tw-pl-4">
      <!-- Header -->
      <h1 class="tw-text-4xl font-bold tw-text-green-800">Farmers & Buyers</h1>
      <p class="">Connecting farmers and buyers in real-time</p>
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
      <!-- Map Section -->
      <v-row class="tw-h-full">
        <v-col cols="12" md="8" class="rounded-lg overflow-hidden tw-shadow-2xl tw-bg-white">
          <div ref="map" class="tw-h-full tw-w-full" style="height: 500px;"></div>
        </v-col>

        <!-- Sidebar for Farmers/Buyers List -->
        <v-col cols="12" md="4" class="tw-space-y-4">
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
                  @click="setFocusToLocation(buyerLocation.latitude, buyerLocation.longitude)"
              >
                <v-list-item-content>
                  <v-list-item-title class="tw-text-green-900 tw-font-extrabold">{{ buyerLocation.buyer.name }}</v-list-item-title>
                  <v-list-item-subtitle class="tw-text-gray-400">
                    Interested in: {{ buyerLocation.buyer.preferredProduces.map(p => p.bsfarmProduce.name).join(', ') || 'None' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

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
    <!-- Dialog for Marker Info -->
    <v-dialog v-model="userDialog" v-if="false" max-width="400">
      <v-card v-if="selectedUserFromMap?.role === 'farmer'">
        <v-card-title>{{ selectedUserFromMap?.name }}</v-card-title>
        <v-card-actions>
          <v-btn @click="toggleConnection">
            <v-icon v-if="isConnected">mdi-check-circle</v-icon>
            {{ isConnected ? "Disconnect" : "Connect" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <FarmerListingsDialog
        :selected-farmer="selectedUserFromMap"
        :buyer-id="getCurrentUserId()"
        @close="selectedUserFromMap = null"
    />
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import googleMapsLoader from '@/components/GoogleMapsLoader.js';
import axios from 'axios';
import { mapGetters, mapState } from 'vuex';
import FarmerListingsDialog from '@/components/listing/FarmerListingsDialog.vue';
import { getCurrentUserId } from '@/utils/roles.js';

export default {
  components: { FarmerListingsDialog, Default },
  data() {
    return {
      map: null,
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
        this.setFocusToLocation(newFarmerLocation.latitude, newFarmerLocation.longitude);
      }
    },
    selectedBuyer(newBuyerLocation, oldBuyerLocation) {
      this.$toast.show('Seleted buyer');
      console.log(`new ${newBuyerLocation}`);
      console.log(`old ${oldBuyerLocation}`);
      if (newBuyerLocation != null) {
        console.log('setting focus');
        // this.setFocusToLocation(newBuyerLocation.latitude, newBuyerLocation.longitude);
      }
    },
  },
  methods: {
    getCurrentUserId,
    checkConnectionStatus(role, id) {
      this.$toast.success(`Checking ${id} from ${role}s`);
      return false;
    },
    buyFarmProduce(productId, productName) {
      this.$toast.success(`Buy ${productId} - ${productName}`);
    },
    toggleConnection() {
    },
    loadMap() {
      this.$toast.show('loading map');
      googleMapsLoader.load()
        .then((google) => {
          this.directionsService = new google.maps.DirectionsService();
          this.directionsRenderer = new google.maps.DirectionsRenderer();
          this.directionsRenderer.setMap(this.map);

          navigator.geolocation.getCurrentPosition((position) => {
            this.map = new google.maps.Map(this.$refs.map, {
              center: { lat: position.coords.latitude, lng: position.coords.longitude },
              zoom: 8,
              heading: 320,
              tilt: 0.0,
              mapId: '8fafea89cad68455',
              rotateControl: true,
              disableDefaultUI: false,
            });
            this.center.lat = position.coords.latitude;
            this.center.lng = position.coords.longitude;

            const marker = new google.maps.Marker({
              position: { lat: position.coords.latitude, lng: position.coords.longitude },
              map: this.map,
            });

            marker.addListener('click', () => {
              this.$toast.success('You clicked your location!');
            });

            this.filteredFarmers.forEach((farmerLocation) => {
              const farmerMarker = new google.maps.Marker({
                position: { lat: farmerLocation.latitude, lng: farmerLocation.longitude },
                map: this.map,
                icon: {
                  // eslint-disable-next-line global-require
                  url: require('@/assets/images/farmer_map_icon.png'),
                  scaledSize: new google.maps.Size(50, 50),
                },
              });

              // Create an InfoWindow instance (used for popups)
              const infoWindow = new google.maps.InfoWindow();

              farmerMarker.addListener('mouseover', () => {
                const isConnected = this.checkConnectionStatus('farmer', farmerLocation.farmer.id);
                const productsHtml = farmerLocation.farmer.farmerProduces.map((product) => `
                    <div>${product.farmProduce.name} - ${product.status}
                    ${
  product.status === 'ON_SALE'
    ? `<button style="background-color: green; color: white;" onclick="buyFarmProduce(${product.id}, '${product.farmProduce.name}')">>Buy</button>`
    : ''
}</div>`);

                const content = `
                    <div style="max-width: 250px;">
                      <h3>${farmerLocation.farmer.name}</h3>
                      <div>${productsHtml}</div>
                      <button id="connect-btn" style="margin-top: 10px;">
                        ${isConnected ? 'Disconnect ✅' : 'Connect'}
                      </button>
                    </div>
                  `;
                // Set content and open InfoWindow at the marker
                infoWindow.setContent(content);
                infoWindow.open(this.map, farmerMarker);

                // Wait for DOM to be ready before adding click events
                setTimeout(() => {
                  document.getElementById('connect-btn').addEventListener('click', () => {
                    // toggleConnection(); // Handle connection toggle
                  });
                }, 100);
              });
              //
              farmerMarker.addListener('click', () => {
                this.selectedUserFromMap = { ...farmerLocation, role: 'farmer' };
                this.userDialog = true;
              });
              farmerMarker.addListener('mouseout', () => {
                // Wait for DOM to be ready before adding click events
                setTimeout(() => {
                  infoWindow.close();
                }, 500);
              });
            });
            this.filteredBuyers.forEach((buyerLocation) => {
              const buyerMarker = new google.maps.Marker({
                position: { lat: buyerLocation.latitude, lng: buyerLocation.longitude },
                map: this.map,
                icon: {
                  // eslint-disable-next-line global-require
                  url: require('@/assets/images/buyer_map_icon.png'),
                  scaledSize: new google.maps.Size(50, 50),
                },
              });

              buyerMarker.addListener('click', () => {
                this.$toast.success(`Buyer: ${buyerLocation.buyer.name}`);
                this.selectedUserFromMap = { ...buyerLocation, role: 'buyer' };
                this.userDialog = true;
              });

              const infoWindow = new google.maps.InfoWindow();
              buyerMarker.addListener('mouseover', () => {
                const isConnected = this.checkConnectionStatus('buyer', buyerLocation.buyer.id);
                // Set content and open InfoWindow at the marker
                infoWindow.setContent(`<div style="max-width: 250px;">
                  <h3>${buyerLocation.buyer.name}</h3>
                  <div>${buyerLocation.buyer.preferredProduces.map((product) => `
                    <div>${product.bsfarmProduce.name} - ${product.status}
                    ${
  product.status === 'REQUESTING'
    ? `<button style="background-color: green; color: white;" onclick="buyFarmProduce(${product.id}, '${product.farmProduce.name}')">>Buy</button>`
    : ''
}</div>`)}</div>
                  <button id="connect-btn" style="margin-top: 10px;">
                    ${isConnected ? 'Disconnect ✅' : 'Connect'}
                  </button>
                </div>`);
                infoWindow.open(this.map, buyerMarker);
              });
              buyerMarker.addListener('mouseout', () => {
                // Wait for DOM to be ready before adding click events
                setTimeout(() => {
                  infoWindow.close();
                }, 500);
              });
            });
          }, (error) => {
            this.$toast.error(error.message);
          }, { enableHighAccuracy: true });
        })
        .catch((err) => {
          this.$toast.error(err.message);
        });
    },

    setFocusToLocation(lat, lng) {
      this.map.panTo({ lat, lng });
    },

    calculateRoute(start, end) {
      // eslint-disable-next-line no-undef,new-cap
      this.distance = new google.maps.geometry.spherical.computeDistanceBetween(
        // eslint-disable-next-line no-undef
        new google.maps.LatLng(start.lat, start.lng),
        // eslint-disable-next-line no-undef
        new google.maps.LatLng(end.lat, end.lng),
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
  },
  mounted() {
    console.log(this.user);
    axios.get('/farmers-service/location/farmers')
      .then((response) => {
        if (response.data.success) {
          this.farmersLocation = response.data.data;
          this.selectedFarmersLocations = response.data.data;
        } else {
          this.$toast.error('Failed to load farmers locations');
        }
      })
      .catch((reason) => this.$toast.error(reason.message));

    axios.get('/buyers-service/location/buyers')
      .then((response) => {
        if (response.data.success) {
          this.buyersLocation = response.data.data;
          this.selectedBuyersLocations = response.data.data;
        } else {
          this.$toast.error('Failed to load buyers locations');
        }
        this.loadMap();
      })
      .catch((reason) => this.$toast.error(reason.message));
  },
};
</script>

<style scoped>
</style>
