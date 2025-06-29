<template>
  <Default>
    <v-container fluid class="tw-p-4">
      <!-- Header -->
      <v-row>
        <v-col cols="12">
          <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-6">
            Operating Zones Management
          </h1>
        </v-col>
      </v-row>

      <!-- Action Tabs -->
      <v-row>
        <v-col cols="12">
          <v-tabs v-model="activeTab" class="tw-mb-6">
            <v-tab>Create Zone</v-tab>
            <v-tab>View All Zones</v-tab>
            <v-tab>Zone Farmers</v-tab>
          </v-tabs>
        </v-col>
      </v-row>

      <!-- Tab Content -->
      <v-tabs-items v-model="activeTab">
        <!-- Create Zone Tab -->
        <v-tab-item>
          <v-row>
            <!-- Form Section -->
            <v-col cols="12" md="4">
              <v-card class="tw-shadow-lg">
                <v-card-title class="tw-bg-blue-500 tw-text-white">
                  Create New Operating Zone
                </v-card-title>
                <v-card-text class="tw-p-6">
                  <v-form ref="createForm" v-model="formValid">
                    <v-text-field
                        v-model="newZone.name"
                        label="Zone Name"
                        :rules="[rules.required]"
                        outlined
                        class="tw-mb-4"
                    ></v-text-field>

                    <v-select
                        v-if="false"
                        v-model="newZone.produceType"
                        :items="produceTypes"
                        label="Produce Type"
                        outlined
                        class="tw-mb-4"
                    ></v-select>

                    <v-text-field
                        v-model.number="newZone.centerLatitude"
                        label="Center Latitude"
                        type="number"
                        step="any"
                        :rules="[rules.required, rules.latitude]"
                        outlined
                        class="tw-mb-4"
                    ></v-text-field>

                    <v-text-field
                        v-model.number="newZone.centerLongitude"
                        label="Center Longitude"
                        type="number"
                        step="any"
                        :rules="[rules.required, rules.longitude]"
                        outlined
                        class="tw-mb-4"
                    ></v-text-field>

                    <v-text-field
                        v-model.number="newZone.radiusKm"
                        label="Radius (KM)"
                        type="number"
                        step="any"
                        :rules="[rules.required, rules.positive]"
                        outlined
                        class="tw-mb-4"
                    ></v-text-field>

                    <v-btn
                        @click="createZone"
                        :disabled="!formValid || loading"
                        :loading="loading"
                        color="primary"
                        block
                        large
                    >
                      Create Zone
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Map Section -->
            <v-col cols="12" md="8">
              <v-card class="tw-shadow-lg">
                <v-card-title class="tw-bg-green-500 tw-text-white">
                  Zone Preview
                </v-card-title>
                <v-card-text class="tw-p-0">
                  <div id="createMapView" class="tw-h-96"></div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- View All Zones Tab -->
        <v-tab-item>
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="tw-shadow-lg">
                <v-card-title class="tw-bg-purple-500 tw-text-white">
                  Zones List
                </v-card-title>
                <v-card-text>
                  <v-btn
                      @click="fetchAllZones"
                      :loading="loading"
                      color="primary"
                      block
                      class="tw-mb-4"
                  >
                    Load Zones
                  </v-btn>

                  <v-list v-if="allZones.length > 0">
                    <v-list-item
                        v-for="zone in allZones"
                        :key="zone.id"
                        @click="selectZone(zone)"
                        :class="{ 'tw-bg-blue-100': selectedZone && selectedZone.id === zone.id }"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ zone.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ zone.produceType }} - {{ zone.radiusKm }}km
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                  <v-alert
                      v-else-if="!loading"
                      type="info"
                      class="tw-mt-4"
                  >
                    No zones found for this exporter
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="8">
              <v-card class="tw-shadow-lg">
                <v-card-title class="tw-bg-indigo-500 tw-text-white">
                  Zones Map View
                </v-card-title>
                <v-card-text class="tw-p-0">
                  <div id="allZonesMapView" class="tw-h-96"></div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- Zone Farmers Tab -->
        <v-tab-item>
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="tw-shadow-lg">
                <v-card-title class="tw-bg-orange-500 tw-text-white">
                  Zone Farmers
                </v-card-title>
                <v-card-text>
                  <v-combobox
                      v-model="selectedZoneId"
                      :items="zoneOptions"
                      item-text="name"
                      item-value="id"
                      label="Select Zone"
                      outlined
                      class="tw-mb-4"
                      :loading="loadingZones"
                      :disabled="loadingZones"
                      @focus="fetchZoneOptions"
                  ></v-combobox>

                  <v-btn
                      @click="fetchZoneFarmers"
                      :loading="loading"
                      color="primary"
                      block
                      class="tw-mb-4"
                  >
                    Load Farmers
                  </v-btn>

                  <v-list v-if="zoneFarmers.length > 0">
                    <v-list-item
                        v-for="farmer in zoneFarmers"
                        :key="farmer.id"
                        @click="selectFarmer(farmer)"
                        :class="{ 'tw-bg-green-100': selectedFarmer && selectedFarmer.id === farmer.id }"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ farmer.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ farmer.phoneNumber || 'No phone' }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                  <v-alert
                      v-else-if="!loading && farmerZoneId"
                      type="info"
                      class="tw-mt-4"
                  >
                    No farmers found in this zone
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="8">
              <v-card class="tw-shadow-lg">
                <v-card-title class="tw-bg-teal-500 tw-text-white">
                  Farmers Map View
                </v-card-title>
                <v-card-text class="tw-p-0">
                  <div id="farmersMapView" class="tw-h-96"></div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>

      <!-- Success/Error Snackbar -->
      <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="4000"
          top
      >
        {{ snackbar.message }}
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </Default>
</template>

<script>
import axios from 'axios';
import Default from '@/components/layout/Default.vue';
import { getCurrentUserId } from '@/utils/roles.js';

export default {
  name: 'OperatingZonesManagement',
  components: {
    Default,
  },
  data() {
    return {
      activeTab: 0,
      loading: false,
      formValid: false,

      // Create Zone Form
      newZone: {
        name: '',
        produceType: '',
        centerLatitude: null,
        centerLongitude: null,
        radiusKm: null,
      },

      // Produce types
      produceTypes: [
        'Maize', 'Beans', 'Rice', 'Wheat', 'Coffee', 'Tea',
        'Sugarcane', 'Cotton', 'Vegetables', 'Fruits', 'Other',
      ],

      // View All Zones
      allZones: [],
      selectedZone: null,

      // Zone Farmers
      farmerZoneId: '',
      zoneFarmers: [],
      selectedFarmer: null,

      // Maps
      createMapView: null,
      allZonesMapView: null,
      farmersMapView: null,

      zoneOptions: [],
      selectedZoneId: null,
      loadingZones: false,

      // Validation rules
      rules: {
        required: (value) => !!value || 'This field is required',
        latitude: (value) => {
          if (!value) return true;
          const num = parseFloat(value);
          return (num >= -90 && num <= 90) || 'Latitude must be between -90 and 90';
        },
        longitude: (value) => {
          if (!value) return true;
          const num = parseFloat(value);
          return (num >= -180 && num <= 180) || 'Longitude must be between -180 and 180';
        },
        positive: (value) => {
          if (!value) return true;
          return parseFloat(value) > 0 || 'Value must be positive';
        },
      },

      // Snackbar
      snackbar: {
        show: false,
        message: '',
        color: 'success',
      },
    };
  },

  async mounted() {
    await this.loadArcGIS();
    await this.initializeMaps();
  },

  watch: {
    activeTab(newTab) {
      this.$nextTick(() => {
        // eslint-disable-next-line default-case
        switch (newTab) {
          case 0:
            this.initializeCreateMap();
            this.resizeMap(this.createMapView);
            break;
          case 1:
            this.initializeAllZonesMap();
            this.resizeMap(this.allZonesMapView);
            break;
          case 2:
            this.initializeFarmersMap();
            this.resizeMap(this.farmersMapView);
            break;
        }
      });
    },

    'newZone.centerLatitude': function () {
      this.updateCreateMapPreview();
    },

    'newZone.centerLongitude': function () {
      this.updateCreateMapPreview();
    },

    'newZone.radiusKm': function () {
      this.updateCreateMapPreview();
    },
  },

  methods: {
    async loadArcGIS() {
      return new Promise((resolve) => {
        if (window.require) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.arcgis.com/4.25/init.js';
        script.onload = resolve;
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://js.arcgis.com/4.25/esri/themes/light/main.css';
        document.head.appendChild(link);
      });
    },

    async initializeMaps() {
      // Only load the ArcGIS API and set up the Map/MapView references
      window.require([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/geometry/Circle',
        'esri/geometry/Point',
      ], (Map, MapView, Graphic, Circle, Point) => {
        this.Map = Map;
        this.MapView = MapView;
        this.Graphic = Graphic;
        this.Circle = Circle;
        this.Point = Point;

        // Initialize the first tab's map immediately
        if (this.activeTab === 0) {
          this.initializeCreateMap();
        }
      });
    },

    initializeCreateMap() {
      if (this.createMapView || !document.getElementById('createMapView')) return;

      const createMap = new this.Map({
        // eslint-disable-next-line sonarjs/no-duplicate-string
        basemap: 'streets-navigation-vector',
      });

      this.createMapView = new this.MapView({
        container: 'createMapView',
        map: createMap,
        center: [36.8219, -1.2921],
        zoom: 10,
      });

      this.createMapView.on('click', (event) => {
        this.newZone.centerLatitude = event.mapPoint.latitude;
        this.newZone.centerLongitude = event.mapPoint.longitude;
        this.updateCreateMapPreview();
      });
    },

    initializeAllZonesMap() {
      if (this.allZonesMapView) return;

      this.$nextTick(() => {
        if (!document.getElementById('allZonesMapView')) {
          this.showSnackbar('allZonesMapView container not found');
          return;
        }

        const allZonesMap = new this.Map({
          basemap: 'streets-navigation-vector',
        });

        this.allZonesMapView = new this.MapView({
          container: 'allZonesMapView',
          map: allZonesMap,
          center: [36.8219, -1.2921],
          zoom: 8,
        });
      });
    },

    initializeFarmersMap() {
      if (this.farmersMapView) return;

      this.$nextTick(() => {
        if (!document.getElementById('farmersMapView')) {
          this.showSnackbar('farmersMapView container not found');
          return;
        }

        const farmersMap = new this.Map({
          basemap: 'streets-navigation-vector',
        });

        this.farmersMapView = new this.MapView({
          container: 'farmersMapView',
          map: farmersMap,
          center: [36.8219, -1.2921],
          zoom: 10,
        });
      });
    },
    updateCreateMapPreview() {
      if (!this.createMapView || !this.newZone.centerLatitude || !this.newZone.centerLongitude) return;

      this.createMapView.graphics.removeAll();

      const center = new this.Point({
        longitude: this.newZone.centerLongitude,
        latitude: this.newZone.centerLatitude,
      });

      // Add center point
      const centerGraphic = new this.Graphic({
        geometry: center,
        symbol: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          type: 'simple-marker',
          color: 'red',
          size: 8,
        },
      });

      this.createMapView.graphics.add(centerGraphic);

      // Add radius circle if specified
      if (this.newZone.radiusKm) {
        const circle = new this.Circle({
          center,
          radius: this.newZone.radiusKm,
          radiusUnit: 'kilometers',
        });

        const circleGraphic = new this.Graphic({
          geometry: circle,
          symbol: {
            type: 'simple-fill',
            color: [0, 100, 255, 0.1],
            outline: {
              color: [0, 100, 255, 0.8],
              width: 2,
            },
          },
        });

        this.createMapView.graphics.add(circleGraphic);

        // Center the map on the circle
        this.createMapView.goTo(circle.extent);
      } else {
        this.createMapView.goTo({
          center,
          zoom: 12,
        });
      }
    },

    async createZone() {
      if (!this.formValid) return;

      this.loading = true;
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.post('/farmers-service/exporter/zones', {
          exporterId: getCurrentUserId(),
          name: this.newZone.name,
          produceType: this.newZone.produceType,
          centerLatitude: this.newZone.centerLatitude,
          centerLongitude: this.newZone.centerLongitude,
          radiusKm: this.newZone.radiusKm,
        });

        this.showSnackbar('Zone created successfully!', 'success');
        this.resetCreateForm();
      } catch (error) {
        this.showSnackbar('Error creating zone. Please try again.', 'error');
      } finally {
        this.loading = false;
      }
    },

    resetCreateForm() {
      this.newZone = {
        name: '',
        produceType: '',
        centerLatitude: null,
        centerLongitude: null,
        radiusKm: null,
      };
      if (this.createMapView) {
        this.createMapView.graphics.removeAll();
      }
      this.$refs.createForm.reset();
    },

    async fetchAllZones() {
      if (!getCurrentUserId()) {
        this.showSnackbar('Please enter an Exporter ID', 'warning');
        return;
      }

      this.loading = true;
      try {
        const response = await axios.get(`/farmers-service/exporter/${getCurrentUserId()}/zones`);
        this.allZones = response.data.data;
        this.initializeAllZonesMap();
        this.resizeMap(this.allZonesMapView);
        this.displayZonesOnMap();

        if (this.allZones.length === 0) {
          this.showSnackbar('No zones found for this exporter', 'info');
        }
      } catch (error) {
        this.showSnackbar('Error fetching zones. Please try again.', 'error');
        this.allZones = [];
      } finally {
        this.loading = false;
      }
    },

    displayZonesOnMap() {
      if (!this.allZonesMapView) return;

      this.allZonesMapView.graphics.removeAll();

      this.allZones.forEach((zone, index) => {
        const center = new this.Point({
          longitude: zone.centerLongitude,
          latitude: zone.centerLatitude,
        });

        // Add zone circle
        const circle = new this.Circle({
          center,
          radius: zone.radiusKm,
          radiusUnit: 'kilometers',
        });

        const colors = [
          [255, 0, 0, 0.2], [0, 255, 0, 0.2], [0, 0, 255, 0.2],
          [255, 255, 0, 0.2], [255, 0, 255, 0.2], [0, 255, 255, 0.2],
        ];

        const circleGraphic = new this.Graphic({
          geometry: circle,
          symbol: {
            type: 'simple-fill',
            color: colors[index % colors.length],
            outline: {
              color: colors[index % colors.length].map((c) => (c === 0.2 ? 0.8 : c)),
              width: 2,
            },
          },
          attributes: zone,
        });

        this.allZonesMapView.graphics.add(circleGraphic);

        // Add center point
        const centerGraphic = new this.Graphic({
          geometry: center,
          symbol: {
            type: 'simple-marker',
            color: 'red',
            size: 6,
          },
        });

        this.allZonesMapView.graphics.add(centerGraphic);
      });

      if (this.allZones.length > 0) {
        // Zoom to show all zones
        this.allZonesMapView.goTo(this.allZonesMapView.graphics.items);
      }
    },

    selectZone(zone) {
      this.selectedZone = zone;

      if (this.allZonesMapView) {
        const center = new this.Point({
          longitude: zone.centerLongitude,
          latitude: zone.centerLatitude,
        });

        this.allZonesMapView.goTo({
          center,
          zoom: 12,
        });
      }
    },

    async fetchZoneOptions() {
      // Only fetch if we haven't already
      if (this.zoneOptions.length > 0) return;

      this.loadingZones = true;
      try {
        const response = await axios.get(`/farmers-service/exporter/${getCurrentUserId()}/zones`);
        this.zoneOptions = response.data.data.map((zone) => ({
          id: zone.id,
          name: zone.name,
          // Add any other properties you want to display
        }));
      } catch (error) {
        this.showSnackbar('Error fetching zones. Please try again.', 'error');
      } finally {
        this.loadingZones = false;
      }
    },

    async fetchZoneFarmers() {
      if (!this.selectedZoneId) {
        this.showSnackbar('Please select a zone', 'warning');
        return;
      }

      this.loading = true;
      try {
        const response = await axios.get(`/farmers-service/exporter/zones/${this.selectedZoneId.id}/farmers`);
        this.zoneFarmers = response.data.data;
        this.displayFarmersOnMap();
        this.initializeFarmersMap();
        this.resizeMap(this.farmersMapView);

        if (this.zoneFarmers.length === 0) {
          this.showSnackbar('No farmers found in this zone', 'info');
        }
      } catch (error) {
        this.showSnackbar('Error fetching farmers. Please try again.', 'error');
        this.zoneFarmers = [];
      } finally {
        this.loading = false;
      }
    },

    displayFarmersOnMap() {
      if (!this.farmersMapView) return;

      this.farmersMapView.graphics.removeAll();

      this.zoneFarmers.forEach((farmer) => {
        if (farmer.latitude && farmer.longitude) {
          const point = new this.Point({
            longitude: farmer.longitude,
            latitude: farmer.latitude,
          });

          const farmerGraphic = new this.Graphic({
            geometry: point,
            symbol: {
              type: 'simple-marker',
              color: 'green',
              size: 8,
              outline: {
                color: 'white',
                width: 1,
              },
            },
            attributes: farmer,
            popupTemplate: {
              title: farmer.name,
              content: `
                <p><strong>Phone:</strong> ${farmer.phoneNumber || 'N/A'}</p>
                <p><strong>Location:</strong> ${farmer.latitude}, ${farmer.longitude}</p>
              `,
            },
          });

          this.farmersMapView.graphics.add(farmerGraphic);
        }
      });

      if (this.zoneFarmers.length > 0) {
        this.farmersMapView.goTo(this.farmersMapView.graphics.items);
      }
    },

    selectFarmer(farmer) {
      this.selectedFarmer = farmer;

      if (this.farmersMapView && farmer.latitude && farmer.longitude) {
        const point = new this.Point({
          longitude: farmer.longitude,
          latitude: farmer.latitude,
        });

        this.farmersMapView.goTo({
          center: point,
          zoom: 15,
        });
      }
    },

    resizeMap(mapView) {
      if (mapView && typeof mapView.resize === 'function') {
        setTimeout(() => {
          mapView.resize();
        }, 100);
      }
    },

    showSnackbar(message, color = 'success') {
      this.snackbar = {
        show: true,
        message,
        color,
      };
    },
  },

  beforeDestroy() {
    if (this.createMapView) {
      this.createMapView.destroy();
    }
    if (this.allZonesMapView) {
      this.allZonesMapView.destroy();
    }
    if (this.farmersMapView) {
      this.farmersMapView.destroy();
    }
  },
};
</script>

<style scoped>
.v-tab {
  font-weight: 500;
}

.v-card-title {
  font-weight: 600;
}

.v-list-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.v-list-item:hover {
  background-color: #f5f5f5;
}

#createMapView,
#allZonesMapView,
#farmersMapView {
  height: 400px;
  width: 100%;
}
</style>
