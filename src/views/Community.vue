<template>
  <Default>
    <div class="tw-pl-4">
      <!-- Header -->
      <h1 class="tw-text-4xl font-bold tw-text-green-800">Farmers & Buyers</h1>
      <p class="">Connecting farmers and buyers in real-time</p>
      <div class="tw-flex md:tw-flex-row tw-flex-col tw-gap-5 tw-my-5">
          <v-combobox
              label="Search farmer"
              dense
              success
              class="tw-bg-white tw-shadow-md tw-font-semibold"
          ></v-combobox>
          <v-select
              label="Category of Farmer"
              dense
              :items="['ALL', 'SELLING']"
              class="tw-bg-white tw-shadow-md tw-font-semibold"
          ></v-select>
          <v-combobox
              label="Search Buyer"
              dense
              success
              class="tw-bg-white tw-shadow-md tw-font-semibold"
          ></v-combobox>
          <v-select
              label="Category of Buyer"
              dense
              :items="['ALL', 'REQUESTING']"
              class="tw-bg-white tw-shadow-md tw-font-semibold"
          ></v-select>
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
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import googleMapsLoader from '@/components/GoogleMapsLoader.js';
import axios from 'axios';

export default {
  components: { Default },
  data() {
    return {
      map: null,
      center: { lat: null, lng: null },
      farmersLocation: [],
      buyersLocation: [],
      directionsService: null,
      directionsRenderer: null,
      distance: null,
    };
  },
  methods: {
    loadMap() {
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

            this.farmersLocation.forEach((farmerLocation) => {
              const newMarker = new google.maps.Marker({
                position: { lat: farmerLocation.latitude, lng: farmerLocation.longitude },
                map: this.map,
                icon: {
                  // eslint-disable-next-line global-require
                  url: require('@/assets/images/farmer_map_icon.png'),
                  scaledSize: new google.maps.Size(50, 50),
                },
              });

              newMarker.addListener('click', () => {
                this.$toast.success(`Farmer: ${farmerLocation.farmer.name}`);
              });

              newMarker.addListener('mouseover', () => {
                newMarker.setTitle(`${farmerLocation.farmer.name}\n\n\bPRODUCES\n${farmerLocation.farmer.farmerProduces.length > 0 ? farmerLocation.farmer.farmerProduces.map((farmerProduce) => farmerProduce.farmProduce.name).join('\n') : 'none'}`);
              });
            });
            this.buyersLocation.forEach((buyerLocation) => {
              const newMarker = new google.maps.Marker({
                position: { lat: buyerLocation.latitude, lng: buyerLocation.longitude },
                map: this.map,
                icon: {
                  // eslint-disable-next-line global-require
                  url: require('@/assets/images/buyer_map_icon.png'),
                  scaledSize: new google.maps.Size(50, 50),
                },
              });

              newMarker.addListener('click', () => {
                this.$toast.success(`Buyer: ${buyerLocation.buyer.name}`);
              });

              newMarker.addListener('mouseover', () => {
                newMarker.setTitle(`${buyerLocation.farmer.name}\n\n\bPRODUCES\n${buyerLocation.buyer.preferredProduces.length > 0 ? buyerLocation.farmer.farmerProduces.map((farmerProduce) => farmerProduce.farmProduce.name).join('\n') : 'none'}`);
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
            alert(`Directions request failed due to ${status}`);
          }
        },
      );
    },
  },
  mounted() {
    axios.get('/farmers-service/location/farmers')
      .then((response) => {
        if (response.data.success) {
          this.farmersLocation = response.data.data;
          this.loadMap();
        } else {
          this.$toast.error('Failed to load farmers locations');
        }
      })
      .catch((reason) => this.$toast.error(reason.message));

    axios.get('/buyers-service/location/buyers')
      .then((response) => {
        if (response.data.success) {
          this.buyersLocation = response.data.data;
        } else {
          this.$toast.error('Failed to load buyers locations');
        }
      })
      .catch((reason) => this.$toast.error(reason.message));
  },
};
</script>

<style scoped>
/* Add Tailwind CSS classes or custom styles here */
</style>
