<template>
  <Default>
    <div class="tw-p-4 tw-bg-gray-50 min-h-screen">
      <!-- Header -->
      <div>
        <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-6">
          Zone Management
        </h1>
      </div>

      <!-- Action Tabs -->
      <div class="tw-mb-6">
        <div class="tw-flex tw-border-b tw-space-x-4">
          <button
            v-if="hasPermission('CREATE_ZONE')"
            class="tw-py-2 tw-px-4 tw-font-semibold tw-transition-colors tw-duration-200"
            :class="activeTab === 0 ? 'tw-border-b-2 tw-border-blue-500 tw-text-blue-600 tw-bg-white' : 'tw-text-gray-600 hover:tw-bg-gray-100'"
            @click="activeTab = 0"
          >Create Zone</button>
          <button
            v-if="hasPermission('UPDATE_ZONE') || hasPermission('VIEW_ZONE_SUPERVISOR')"
            class="tw-py-2 tw-px-4 tw-font-semibold tw-transition-colors tw-duration-200"
            :class="activeTab === 1 ? 'tw-border-b-2 tw-border-blue-500 tw-text-blue-600 tw-bg-white' : 'tw-text-gray-600 hover:tw-bg-gray-100'"
            @click="activeTab = 1"
          >View All Zones</button>
          <button
            v-if="hasPermission('VIEW_ZONE_SUPERVISOR')"
            class="tw-py-2 tw-px-4 tw-font-semibold tw-transition-colors tw-duration-200"
            :class="activeTab === 2 ? 'tw-border-b-2 tw-border-blue-500 tw-text-blue-600 tw-bg-white' : 'tw-text-gray-600 hover:tw-bg-gray-100'"
            @click="activeTab = 2"
          >Zone Details</button>
        </div>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 0 && hasPermission('CREATE_ZONE')">
        <!-- Create Zone Tab -->
        <div class="tw-flex tw-flex-wrap tw--mx-2">
          <!-- Form Section -->
          <div class="tw-w-full md:tw-w-1/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-blue-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-font-semibold tw-text-lg">
                Create New Zone
              </div>
              <div class="tw-p-6">
                <ZoneForm
                  :zone="newZone"
                  :formTouched="formTouched"
                  :rules="rules"
                  :loading="loading"
                  @submit="createZone"
                  @update:zone="newZone = $event"
                  ref="createForm"
                />
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
                <ZoneMap
                  ref="createMap"
                  :center="[newZone.centerLongitude, newZone.centerLatitude]"
                  :radiusKm="newZone.radiusKm"
                  @click="updateCoordinates"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 1 && (hasPermission('UPDATE_ZONE') || hasPermission('VIEW_ZONE_SUPERVISOR'))">
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
                <ZoneList
                  :zones="allZones"
                  :selectedZone="selectedZone"
                  :loading="loading"
                  @select="selectZone"
                />
              </div>
            </div>
          </div>
          <div class="tw-w-full md:tw-w-2/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-indigo-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-font-semibold tw-text-lg">
                Zones Map View
              </div>
              <div class="tw-p-0">
                <ZoneMap
                  ref="allZonesMap"
                  :zones="allZones"
                  :selectedZone="selectedZone"
                />
              </div>
              <!-- Edit Zone Form -->
              <div v-if="selectedZone && hasPermission('UPDATE_ZONE')" class="tw-p-6 tw-border-t tw-border-gray-200">
                <h3 class="tw-font-semibold tw-mb-4 tw-text-lg">Edit Selected Zone</h3>
                <ZoneForm
                  :zone="editZone"
                  :formTouched="formTouched"
                  :rules="rules"
                  :loading="loading"
                  @submit="updateZone"
                  @update:zone="editZone = $event"
                  ref="editZoneForm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 2 && hasPermission('VIEW_ZONE_SUPERVISOR')">
        <!-- Zone Details Tab -->
        <div class="tw-flex tw-flex-wrap tw--mx-2">
          <div class="tw-w-full md:tw-w-1/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-teal-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-font-semibold tw-text-lg">
                Select Zone
              </div>
              <div class="tw-p-6">
                <ZoneSelector
                  :zones="zoneOptions"
                  :selectedZone="selectedZoneDetails"
                  :loading="loadingZones"
                  @fetch="fetchZoneOptions"
                  @select="selectZoneDetails"
                />
              </div>
            </div>
          </div>
          <div class="tw-w-full md:tw-w-2/3 tw-px-2 tw-mb-4">
            <div class="tw-bg-white tw-shadow-xl tw-rounded-xl tw-border tw-border-gray-200">
              <div class="tw-bg-teal-500 tw-text-white tw-p-4 tw-rounded-t-xl tw-font-semibold tw-text-lg">
                Zone Details
              </div>
              <div class="tw-p-6">
                <ZoneDetails
                  :zone="selectedZoneDetails"
                  :supervisors="zoneSupervisors"
                  :loading="loading"
                  @fetch-supervisors="fetchZoneSupervisors"
                />
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
import jwtDecode from 'jwt-decode';
import Default from '@/components/layout/Default.vue';
import { getCurrentUserId } from '@/utils/roles.js';
import ZoneForm from '@/components/zone/ZoneForm.vue';
import ZoneMap from '@/components/zone/ZoneMap.vue';
import ZoneList from '@/components/zone/ZoneList.vue';
import ZoneSelector from '@/components/zone/ZoneSelector.vue';
import ZoneDetails from '@/components/zone/ZoneDetails.vue';

export default {
  name: 'ZoneManagement',
  components: {
    Default,
    ZoneForm,
    ZoneMap,
    ZoneList,
    ZoneSelector,
    ZoneDetails,
  },
  data() {
    return {
      activeTab: 0,
      loading: false,
      loadingZones: false,
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
      editZone: null,

      // Zone Details
      zoneOptions: [],
      selectedZoneDetails: null,
      zoneSupervisors: [],

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
  computed: {
    userPermissions() {
      const token = this.$store.state.auth.token;
      if (!token) return [];
      try {
        const decoded = jwtDecode(token);
        return decoded.user?.permissions || [];
      } catch (error) {
        console.error('Error decoding token:', error);
        return [];
      }
    },
  },
  async mounted() {
    await this.loadArcGIS();
    this.$nextTick(() => {
      if (this.hasPermission('CREATE_ZONE')) {
        this.activeTab = 0;
      } else if (this.hasPermission('UPDATE_ZONE') || this.hasPermission('VIEW_ZONE_SUPERVISOR')) {
        this.activeTab = 1;
      }
    });
  },
  watch: {
    activeTab(newTab) {
      this.$nextTick(() => {
        // eslint-disable-next-line default-case
        switch (newTab) {
          case 0:
            if (this.$refs.createMap) {
              this.$refs.createMap.initializeMap();
              this.$refs.createMap.resize();
            }
            break;
          case 1:
            if (this.$refs.allZonesMap) {
              this.$refs.allZonesMap.initializeMap();
              this.$refs.allZonesMap.resize();
            }
            break;
          case 2:
            this.fetchZoneOptions();
            break;
        }
      });
    },
    'newZone.centerLatitude': function () {
      if (this.$refs.createMap) {
        this.$refs.createMap.updatePreview();
      }
    },
    'newZone.centerLongitude': function () {
      if (this.$refs.createMap) {
        this.$refs.createMap.updatePreview();
      }
    },
    'newZone.radiusKm': function () {
      if (this.$refs.createMap) {
        this.$refs.createMap.updatePreview();
      }
    },
  },
  methods: {
    hasPermission(permission) {
      return this.userPermissions.includes(permission);
    },
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
    async createZone() {
      this.formTouched = true;
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
        const response = await axios.post(
          '/api/admin-service/zones',
          {
            name: this.newZone.name,
            produceType: this.newZone.produceType,
            centerLatitude: this.newZone.centerLatitude,
            centerLongitude: this.newZone.centerLongitude,
            radiusKm: this.newZone.radiusKm,
            exporterId: getCurrentUserId(),
          },
          { headers: { Authorization: `Bearer ${this.$store.state.auth.token}` } },
        );
        this.showSnackbar('Zone created successfully!', 'success');
        this.resetCreateForm();
      } catch (error) {
        this.showSnackbar(error.response?.data?.message || 'Error creating zone', 'error');
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
      if (this.$refs.createMap) {
        this.$refs.createMap.clearGraphics();
      }
      this.$refs.createForm.reset();
      this.formTouched = false;
    },
    async fetchAllZones() {
      if (!getCurrentUserId()) {
        this.showSnackbar('Please enter a User ID', 'warning');
        return;
      }
      this.loading = true;
      try {
        const response = await axios.get(
          `/api/admin-service/zones/exporter/${getCurrentUserId()}`,
          { headers: { Authorization: `Bearer ${this.$store.state.auth.token}` } },
        );
        this.allZones = response.data.data;
        if (this.$refs.allZonesMap) {
          this.$refs.allZonesMap.initializeMap();
          this.$refs.allZonesMap.displayZones();
          this.$refs.allZonesMap.resize();
        }
        if (this.allZones.length === 0) {
          this.showSnackbar('No zones found for this exporter', 'info');
        }
      } catch (error) {
        this.showSnackbar(error.response?.data?.message || 'Error fetching zones', 'error');
        this.allZones = [];
      } finally {
        this.loading = false;
      }
    },
    selectZone(zone) {
      this.selectedZone = zone;
      this.editZone = { ...zone };
      if (this.$refs.allZonesMap) {
        this.$refs.allZonesMap.centerOnZone(zone);
      }
    },
    async updateZone() {
      if (!this.editZone || !this.selectedZone) return;
      this.loading = true;
      try {
        await axios.put(
          `/api/admin-service/zones/${this.selectedZone.id}`,
          {
            name: this.editZone.name,
            produceType: this.editZone.produceType,
            centerLatitude: this.editZone.centerLatitude,
            centerLongitude: this.editZone.centerLongitude,
            radiusKm: this.editZone.radiusKm,
          },
          { headers: { Authorization: `Bearer ${this.$store.state.auth.token}` } },
        );
        const idx = this.allZones.findIndex((z) => z.id === this.selectedZone.id);
        if (idx !== -1) {
          this.allZones[idx] = { ...this.editZone, id: this.selectedZone.id };
        }
        this.selectedZone = { ...this.editZone, id: this.selectedZone.id };
        this.showSnackbar('Zone updated successfully!', 'success');
        if (this.$refs.allZonesMap) {
          this.$refs.allZonesMap.displayZones();
        }
      } catch (error) {
        this.showSnackbar(error.response?.data?.message || 'Error updating zone', 'error');
      } finally {
        this.loading = false;
      }
    },
    async fetchZoneOptions() {
      if (this.zoneOptions.length > 0) return;
      this.loadingZones = true;
      try {
        const response = await axios.get(
          `/api/admin-service/zones/exporter/${getCurrentUserId()}`,
          { headers: { Authorization: `Bearer ${this.$store.state.auth.token}` } },
        );
        this.zoneOptions = response.data.data.map((zone) => ({
          id: zone.id,
          name: zone.name,
        }));
      } catch (error) {
        this.showSnackbar(error.response?.data?.message || 'Error fetching zones', 'error');
      } finally {
        this.loadingZones = false;
      }
    },
    selectZoneDetails(zone) {
      this.selectedZoneDetails = zone;
      this.fetchZoneSupervisors();
    },
    async fetchZoneSupervisors() {
      if (!this.selectedZoneDetails) {
        this.showSnackbar('Please select a zone', 'warning');
        return;
      }
      this.loading = true;
      try {
        const response = await axios.get(
          `/api/admin-service/zones/${this.selectedZoneDetails.id}/supervisors`,
          { headers: { Authorization: `Bearer ${this.$store.state.auth.token}` } },
        );
        this.zoneSupervisors = response.data.data;
        if (this.zoneSupervisors.length === 0) {
          this.showSnackbar('No supervisors found for this zone', 'info');
        }
      } catch (error) {
        this.showSnackbar(error.response?.data?.message || 'Error fetching supervisors', 'error');
        this.zoneSupervisors = [];
      } finally {
        this.loading = false;
      }
    },
    updateCoordinates({ latitude, longitude }) {
      this.newZone.centerLatitude = latitude;
      this.newZone.centerLongitude = longitude;
    },
    showSnackbar(message, color = 'success') {
      this.snackbar = { show: true, message, color };
    },
  },
  beforeDestroy() {
    if (this.$refs.createMap) {
      this.$refs.createMap.destroy();
    }
    if (this.$refs.allZonesMap) {
      this.$refs.allZonesMap.destroy();
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
</style>
