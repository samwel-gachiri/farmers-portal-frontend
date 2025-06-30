<template>
  <Default>
    <div class="tw-p-4 tw-bg-gray-50 min-h-screen">
      <!-- Header -->
      <div>
        <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-6">
          Operating Zones Management
        </h1>
      </div>

      <!-- Action Tabs -->
      <div class="tw-mb-6">
        <div class="tw-flex tw-border-b tw-space-x-4">
          <button
            class="tw-py-2 tw-px-4 tw-font-semibold tw-transition-colors tw-duration-200"
            :class="activeTab === 0 ? 'tw-border-b-2 tw-border-blue-500 tw-text-blue-600 tw-bg-white' : 'tw-text-gray-600 hover:tw-bg-gray-100'"
            @click="activeTab = 0"
          >Create Zone</button>
          <button
            class="tw-py-2 tw-px-4 tw-font-semibold tw-transition-colors tw-duration-200"
            :class="activeTab === 1 ? 'tw-border-b-2 tw-border-blue-500 tw-text-blue-600 tw-bg-white' : 'tw-text-gray-600 hover:tw-bg-gray-100'"
            @click="activeTab = 1"
          >View All Zones</button>
          <button
            class="tw-py-2 tw-px-4 tw-font-semibold tw-transition-colors tw-duration-200"
            :class="activeTab === 2 ? 'tw-border-b-2 tw-border-blue-500 tw-text-blue-600 tw-bg-white' : 'tw-text-gray-600 hover:tw-bg-gray-100'"
            @click="activeTab = 2"
          >Zone Farmers</button>
        </div>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 0">
        <!-- Create Zone Tab -->
        <div class="tw-flex tw-flex-wrap tw--mx-2">
          <!-- Form Section -->
          <div class="tw-w-full md:tw-w-1/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-blue-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-font-semibold tw-text-lg">
                Create New Operating Zone
              </div>
              <div class="tw-p-6">
                <form @submit.prevent="createZone" ref="createForm">
                  <div class="tw-mb-5">
                    <label class="tw-block tw-mb-2 tw-font-medium tw-text-gray-700">Zone Name</label>
                    <input
                      v-model="newZone.name"
                      type="text"
                      class="tw-w-full tw-border tw-border-gray-300 tw-rounded-full tw-p-3 tw-bg-gray-50 focus:tw-outline-none focus:tw-border-blue-500 focus:tw-bg-white tw-transition"
                      :class="{'tw-border-red-500': !newZone.name && formTouched}"
                      required
                      placeholder="Enter zone name"
                    />
                  </div>
                  <!-- produceType select hidden for now -->
                  <div class="tw-mb-5" style="display:none">
                    <label class="tw-block tw-mb-2 tw-font-medium tw-text-gray-700">Produce Type</label>
                    <select v-model="newZone.produceType" class="tw-w-full tw-border tw-rounded-full tw-p-3 tw-bg-gray-50">
                      <option v-for="type in produceTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>
                  <div class="tw-mb-5">
                    <label class="tw-block tw-mb-2 tw-font-medium tw-text-gray-700">Center Latitude</label>
                    <input
                      v-model.number="newZone.centerLatitude"
                      type="number"
                      step="any"
                      class="tw-w-full tw-border tw-border-gray-300 tw-rounded-full tw-p-3 tw-bg-gray-50 focus:tw-outline-none focus:tw-border-blue-500 focus:tw-bg-white tw-transition"
                      :class="{'tw-border-red-500': !rules.latitude(newZone.centerLatitude) && formTouched}"
                      required
                      placeholder="e.g. -1.2921"
                    />
                  </div>
                  <div class="tw-mb-5">
                    <label class="tw-block tw-mb-2 tw-font-medium tw-text-gray-700">Center Longitude</label>
                    <input
                      v-model.number="newZone.centerLongitude"
                      type="number"
                      step="any"
                      class="tw-w-full tw-border tw-border-gray-300 tw-rounded-full tw-p-3 tw-bg-gray-50 focus:tw-outline-none focus:tw-border-blue-500 focus:tw-bg-white tw-transition"
                      :class="{'tw-border-red-500': !rules.longitude(newZone.centerLongitude) && formTouched}"
                      required
                      placeholder="e.g. 36.8219"
                    />
                  </div>
                  <div class="tw-mb-6">
                    <label class="tw-block tw-mb-2 tw-font-medium tw-text-gray-700">Radius (KM)</label>
                    <input
                      v-model.number="newZone.radiusKm"
                      type="number"
                      step="any"
                      class="tw-w-full tw-border tw-border-gray-300 tw-rounded-full tw-p-3 tw-bg-gray-50 focus:tw-outline-none focus:tw-border-blue-500 focus:tw-bg-white tw-transition"
                      :class="{'tw-border-red-500': !rules.positive(newZone.radiusKm) && formTouched}"
                      required
                      placeholder="e.g. 10"
                    />
                  </div>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-py-3 tw-px-4 tw-rounded-lg tw-w-full tw-font-semibold tw-shadow-md tw-transition"
                  >
                    <span v-if="loading">Creating...</span>
                    <span v-else>Create Zone</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <!-- Map Section -->
          <div class="tw-w-full md:tw-w-2/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-green-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-font-semibold tw-text-lg">
                Zone Preview
              </div>
              <div class="tw-p-0">
                <div id="createMapView" class="tw-h-96 tw-rounded-b-xl tw-overflow-hidden"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 1">
        <!-- View All Zones Tab -->
        <div class="tw-flex tw-flex-wrap tw--mx-2">
          <div class="tw-w-full md:tw-w-1/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-purple-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-font-semibold tw-text-lg">
                Zones List
              </div>
              <div class="tw-p-6">
                <button
                  @click="fetchAllZones"
                  :disabled="loading"
                  class="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-py-3 tw-px-4 tw-rounded-lg tw-w-full tw-font-semibold tw-shadow-md tw-transition tw-mb-4"
                >
                  <span v-if="loading">Loading...</span>
                  <span v-else>Load Zones</span>
                </button>
                <ul v-if="allZones.length > 0" class="tw-divide-y tw-rounded-lg tw-bg-gray-50 tw-shadow-inner">
                  <li
                    v-for="zone in allZones"
                    :key="zone.id"
                    @click="selectZone(zone)"
                    :class="['tw-p-4 tw-cursor-pointer tw-transition tw-rounded-lg', selectedZone && selectedZone.id === zone.id ? 'tw-bg-blue-100 tw-shadow' : 'hover:tw-bg-gray-100']"
                  >
                    <div class="tw-font-semibold tw-text-gray-800">{{ zone.name }}</div>
                    <div class="tw-text-xs tw-text-gray-600">
                      {{ zone.produceType }} - {{ zone.radiusKm }}km
                    </div>
                  </li>
                </ul>
                <div v-else-if="!loading" class="tw-mt-4 tw-text-blue-700 tw-bg-blue-50 tw-p-3 tw-rounded-lg tw-shadow-inner">
                  No zones found for this exporter
                </div>
              </div>
            </div>
          </div>
          <div class="tw-w-full md:tw-w-2/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-indigo-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-font-semibold tw-text-lg">
                Zones Map View
              </div>
              <div class="tw-p-0">
                <div id="allZonesMapView" class="tw-h-96 tw-rounded-b-xl tw-overflow-hidden"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 2">
        <!-- Zone Farmers Tab -->
        <div class="tw-flex tw-flex-wrap tw--mx-2">
          <div class="tw-w-full md:tw-w-1/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-orange-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-font-semibold tw-text-lg">
                Zone Farmers
              </div>
              <div class="tw-p-6">
                <div class="tw-mb-5">
                  <label class="tw-block tw-mb-2 tw-font-medium tw-text-gray-700">Select Zone</label>
                  <select
                    v-model="selectedZoneFarmersZone"
                    class="tw-w-full tw-border tw-border-gray-300 tw-rounded-full tw-p-3 tw-bg-gray-50 focus:tw-outline-none focus:tw-border-blue-500 focus:tw-bg-white tw-transition"
                    :disabled="loadingZones"
                    @focus="fetchZoneOptions"
                  >
                    <option v-for="zone in zoneOptions" :key="zone.id" :value="zone">
                      {{ zone.name }}
                    </option>
                  </select>
                </div>
                <button
                  @click="fetchZoneFarmers"
                  :disabled="loading"
                  class="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-py-3 tw-px-4 tw-rounded-lg tw-w-full tw-font-semibold tw-shadow-md tw-transition tw-mb-4"
                >
                  <span v-if="loading">Loading...</span>
                  <span v-else>Load Farmers</span>
                </button>
                <ul v-if="zoneFarmers.length > 0" class="tw-divide-y tw-rounded-lg tw-bg-gray-50 tw-shadow-inner">
                  <li
                    v-for="farmer in zoneFarmers"
                    :key="farmer.id"
                    @click="selectFarmer(farmer)"
                    :class="['tw-p-4 tw-cursor-pointer tw-transition tw-rounded-lg', selectedFarmer && selectedFarmer.id === farmer.id ? 'tw-bg-green-100 tw-shadow' : 'hover:tw-bg-gray-100']"
                  >
                    <div class="tw-font-semibold tw-text-gray-800">{{ farmer.farmerName }}</div>
                    <div class="tw-text-xs tw-text-gray-600">
                      maize - 20 acres
                    </div>
                  </li>
                </ul>
                <div v-else-if="!loading && farmerZoneId" class="tw-mt-4 tw-text-blue-700 tw-bg-blue-50 tw-p-3 tw-rounded-lg tw-shadow-inner">
                  No farmers found in this zone
                </div>
              </div>
            </div>
          </div>
          <div class="tw-w-full md:tw-w-2/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-teal-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-flex tw-items-center tw-font-semibold tw-text-lg">
                <span>Farmers Map View</span>
                <button
                  v-if="selectedZoneFarmersZone"
                  @click="addZoneFarmers"
                  :disabled="loading"
                  class="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-py-2 tw-px-4 tw-rounded-lg tw-ml-4 tw-font-semibold tw-shadow-md tw-transition"
                >
                  <span v-if="loading">Adding...</span>
                  <span v-else>Add Zone Farmers</span>
                </button>
              </div>
              <div class="tw-p-0">
                <div id="farmersMapView" class="tw-h-96 tw-rounded-b-xl tw-overflow-hidden"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Snackbar -->
      <div
        v-if="snackbar.show"
        :class="[
          'tw-fixed tw-top-6 tw-right-6 tw-z-50 tw-p-4 tw-rounded-xl tw-shadow-xl tw-flex tw-items-center tw-text-base tw-font-semibold',
          snackbar.color === 'success' ? 'tw-bg-green-500 tw-text-white' :
          snackbar.color === 'error' ? 'tw-bg-red-500 tw-text-white' :
          snackbar.color === 'warning' ? 'tw-bg-yellow-400 tw-text-gray-900' :
          'tw-bg-blue-500 tw-text-white'
        ]"
      >
        <span>{{ snackbar.message }}</span>
        <button class="tw-ml-4 tw-bg-transparent tw-border-none tw-text-white tw-font-bold hover:tw-text-gray-200" @click="snackbar.show = false">Close</button>
      </div>
    </div>
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
      formTouched: false,

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
      selectedZoneFarmersZone: null,
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
      this.formTouched = true;
      // Simple validation for required fields
      if (
        !this.newZone.name
        || !this.rules.latitude(this.newZone.centerLatitude)
        || !this.rules.longitude(this.newZone.centerLongitude)
        || !this.rules.positive(this.newZone.radiusKm)
      ) {
        this.showSnackbar('Please fill all required fields correctly.', 'error');
        return;
      }
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
      this.formTouched = false;
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
      if (!this.selectedZoneFarmersZone) {
        this.showSnackbar('Please select a zone', 'warning');
        return;
      }

      this.loading = true;
      try {
        const response = await axios.get(`/farmers-service/exporter/zones/${this.selectedZoneFarmersZone.id}/farmers`);
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
    async addZoneFarmers() {
      if (!this.selectedZoneFarmersZone) {
        this.showSnackbar('Please select a zone', 'warning');
        return;
      }
      // Extract only the path portion
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      await this.$router.push({
        name: 'SignIn',
        query: {
          mode: 'exporter',
          zoneId: this.selectedZoneFarmersZone.id,
          r: btoa(currentPath), // Encode the current path
        },
      });
      this.showSnackbar('Redirecting to add farmers', 'info');
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
