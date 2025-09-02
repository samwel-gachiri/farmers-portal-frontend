<template>
  <Default>
    <div class="tw-p-6 tw-space-y-6 tw-bg-gray-50 tw-min-h-screen">
      <!-- Header -->
      <div class="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-4">
        <div>
          <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800">Farmers Management</h1>
          <p class="tw-text-sm tw-text-gray-600">List & filter farmers within your exporter zones and open farmer profile actions.</p>
        </div>
        <div class="tw-flex tw-items-center tw-gap-2">
          <v-btn color="primary" :loading="loadingFarmers" @click="refreshCurrent" class="tw-rounded-lg" small>
            <v-icon left small>mdi-refresh</v-icon>Refresh
          </v-btn>
          <v-btn color="success" small class="tw-rounded-lg" @click="openAddFarmerDialog">
            <v-icon left small>mdi-account-plus</v-icon>Add Farmer
          </v-btn>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="tw-bg-white tw-shadow-sm tw-rounded-xl tw-border tw-border-gray-200 tw-p-5 tw-space-y-5">
        <div class="tw-grid md:tw-grid-cols-4 tw-gap-5">
          <!-- Zone Selector -->
          <div>
            <label class="tw-block tw-font-medium tw-text-gray-700 tw-mb-2">Zone</label>
            <div class="tw-relative">
              <select
                v-model="selectedZone"
                @focus="fetchZones"
                @change="onZoneChange"
                class="tw-w-full tw-p-3 tw-bg-gray-50 tw-rounded-lg tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-border-blue-500 focus:tw-bg-white tw-transition"
                :disabled="loadingZones"
              >
                <option :value="null" disabled>Select zone</option>
                <option v-for="z in zones" :key="z.id" :value="z">{{ z.name }}</option>
              </select>
              <div v-if="loadingZones" class="tw-absolute tw-inset-y-0 tw-right-3 tw-flex tw-items-center">
                <v-progress-circular indeterminate color="primary" size="18" width="2" />
              </div>
            </div>
          </div>
          <!-- Search -->
            <div class="md:tw-col-span-2">
              <label class="tw-block tw-font-medium tw-text-gray-700 tw-mb-2">Search</label>
              <input
                v-model.trim="search"
                type="text"
                placeholder="Search by name or phone"
                class="tw-w-full tw-p-3 tw-bg-gray-50 tw-rounded-lg tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-border-blue-500 focus:tw-bg-white tw-transition"
              />
            </div>
          <!-- Extra Filters (future) -->
          <div>
            <label class="tw-block tw-font-medium tw-text-gray-700 tw-mb-2">Filter</label>
            <select v-model="statusFilter" class="tw-w-full tw-p-3 tw-bg-gray-50 tw-rounded-lg tw-border tw-border-gray-300 focus:tw-outline-none tw-transition">
              <option value="">All</option>
              <option value="withLocation">With Location</option>
              <option value="missingLocation">Missing Location</option>
            </select>
          </div>
        </div>
        <div class="tw-flex tw-flex-wrap tw-gap-3">
          <v-chip v-if="selectedZone" close small color="primary" outlined @click:close="clearZone">
            Zone: {{ selectedZone?.name }}
          </v-chip>
          <v-chip v-if="search" close small color="indigo" outlined @click:close="search = ''">Search: {{ search }}</v-chip>
          <v-chip v-if="statusFilter" close small color="teal" outlined @click:close="statusFilter = ''">Filter: {{ readableStatus }}</v-chip>
          <div v-if="!selectedZone && !search && !statusFilter" class="tw-text-xs tw-text-gray-500">No filters applied</div>
        </div>
      </div>

      <!-- Content Split -->
      <div class="tw-grid lg:tw-grid-cols-3 tw-gap-6">
        <!-- Farmers List -->
        <div class="lg:tw-col-span-2 tw-space-y-4">
          <div class="tw-bg-white tw-rounded-xl tw-border tw-border-gray-200 tw-shadow-sm tw-overflow-hidden">
            <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-3 tw-bg-blue-600 tw-text-white">
              <div class="tw-font-semibold">Farmers <span class="tw-text-white/80 tw-text-xs">({{ filteredFarmers.length }})</span></div>
              <div class="tw-flex tw-items-center tw-gap-2">
                <v-btn small text class="tw-text-white" @click="exportCsv" :disabled="!filteredFarmers.length">
                  <v-icon left small>mdi-download</v-icon> Export
                </v-btn>
              </div>
            </div>
            <div v-if="loadingFarmers" class="tw-p-10 tw-text-center">
              <v-progress-circular indeterminate color="primary" size="40" />
              <div class="tw-mt-3 tw-text-sm tw-text-gray-600">Loading farmers...</div>
            </div>
            <div v-else>
              <div v-if="!filteredFarmers.length" class="tw-p-8 tw-text-center tw-text-gray-500 tw-text-sm">No farmers match the current filters.</div>
              <ul v-else class="tw-divide-y tw-bg-gray-50">
                <li v-for="farmer in paginatedFarmers" :key="farmer.id" class="tw-p-4 tw-grid md:tw-grid-cols-12 tw-gap-4 hover:tw-bg-white tw-transition">
                  <div class="md:tw-col-span-5">
                    <div class="tw-font-semibold tw-text-gray-800 tw-flex tw-items-center tw-gap-2">
                      <v-icon small color="green" v-if="hasLocation(farmer)">mdi-map-marker</v-icon>
                      {{ displayName(farmer) }}
                    </div>
                    <div class="tw-text-xs tw-text-gray-500">ID: {{ farmer.id }}</div>
                  </div>
                  <div class="md:tw-col-span-3 tw-text-sm">
                    <div class="tw-text-gray-700">{{ farmer.phoneNumber || farmer.phone || '—' }}</div>
                    <div class="tw-text-xs tw-text-gray-500">Phone</div>
                  </div>
                  <div class="md:tw-col-span-2 tw-text-sm">
                    <div class="tw-text-gray-700">{{ summarizeProduces(farmer) }}</div>
                    <div class="tw-text-xs tw-text-gray-500">Produce</div>
                  </div>
                  <div class="md:tw-col-span-2 tw-flex tw-items-center tw-gap-2 tw-justify-end">
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" small icon color="primary" @click="openProfile(farmer)">
                          <v-icon small>mdi-account-box</v-icon>
                        </v-btn>
                      </template>
                      <span>Open Profile</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" small icon color="indigo" :disabled="!hasLocation(farmer)" @click="focusFarmerOnMap(farmer)">
                          <v-icon small>mdi-map-search</v-icon>
                        </v-btn>
                      </template>
                      <span>Focus on Map</span>
                    </v-tooltip>
                  </div>
                </li>
              </ul>
              <!-- Pagination -->
              <div v-if="pages > 1" class="tw-flex tw-items-center tw-justify-between tw-p-4 tw-bg-white tw-border-t tw-border-gray-200">
                <div class="tw-text-xs tw-text-gray-500">Page {{ page }} / {{ pages }}</div>
                <div class="tw-flex tw-gap-2">
                  <v-btn small outlined :disabled="page===1" @click="page--">Prev</v-btn>
                  <v-btn small outlined :disabled="page===pages" @click="page++">Next</v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Map / Details Side Panel -->
        <div class="tw-space-y-4">
          <div class="tw-bg-white tw-rounded-xl tw-border tw-border-gray-200 tw-shadow-sm tw-overflow-hidden">
            <div class="tw-bg-teal-600 tw-text-white tw-px-5 tw-py-3 tw-font-semibold tw-flex tw-items-center tw-justify-between">
              <span>Farmers Map</span>
              <v-btn icon small text class="tw-text-white" :disabled="!selectedZone || !farmers.length" @click="fitAllFarmers">
                <v-icon small>mdi-crosshairs-gps</v-icon>
              </v-btn>
            </div>
            <div class="tw-relative" style="height:380px;">
              <div v-if="!mapView" class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-text-gray-400 tw-text-sm">Map initializing...</div>
              <div :id="mapId" class="tw-w-full tw-h-full tw-bg-gray-200"></div>
            </div>
          </div>
          <div v-if="selectedFarmer" class="tw-bg-white tw-rounded-xl tw-border tw-border-gray-200 tw-shadow-sm tw-p-5 tw-space-y-2">
            <div class="tw-flex tw-items-center tw-justify-between">
              <h3 class="tw-font-semibold tw-text-gray-800 tw-text-lg">Selected Farmer</h3>
              <v-btn icon small @click="selectedFarmer=null"><v-icon small>mdi-close</v-icon></v-btn>
            </div>
            <div class="tw-text-sm tw-text-gray-700 tw-font-medium">{{ displayName(selectedFarmer) }}</div>
            <div class="tw-text-xs tw-text-gray-500">{{ selectedFarmer.phoneNumber || selectedFarmer.phone || 'No phone' }}</div>
            <div class="tw-text-xs tw-text-gray-500" v-if="hasLocation(selectedFarmer)">Lat: {{ selectedFarmer.latitude }}, Lng: {{ selectedFarmer.longitude }}</div>
            <div class="tw-flex tw-gap-2 tw-mt-2">
              <v-btn small color="primary" @click="openProfile(selectedFarmer)"><v-icon left small>mdi-account-box</v-icon> Profile</v-btn>
              <v-btn small outlined color="indigo" :disabled="!hasLocation(selectedFarmer)" @click="focusFarmerOnMap(selectedFarmer)"><v-icon left small>mdi-map-marker</v-icon> Locate</v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Snackbar -->
      <v-snackbar v-model="snackbar.show" :timeout="4500" top right :color="snackbarColor(snackbar.color)" elevation="6">
        <div class="tw-flex tw-items-center tw-gap-2">
          <v-icon small v-if="snackbar.color==='success'">mdi-check-circle</v-icon>
          <v-icon small v-else-if="snackbar.color==='error'">mdi-alert-circle</v-icon>
          <v-icon small v-else-if="snackbar.color==='warning'">mdi-alert</v-icon>
          <v-icon small v-else>mdi-information</v-icon>
          <span class="tw-font-medium tw-text-sm">{{ snackbar.message }}</span>
          <v-spacer></v-spacer>
          <v-btn icon small text @click="snackbar.show=false"><v-icon small>mdi-close</v-icon></v-btn>
        </div>
      </v-snackbar>
      <!-- Assisted Farmer Registration Dialog -->
      <AssistedFarmerRegistration
        v-if="selectedZone"
        v-model="showAddFarmerDialog"
        :zoneId="selectedZone?.id"
        :zone="selectedZone"
        @closed="handleFarmerDialogClosed"
      />
    </div>
  </Default>
</template>

<script>
import axios from 'axios';
import Default from '@/components/layout/Default.vue';
import { getCurrentUserId } from '@/utils/roles.js';
import AssistedFarmerRegistration from '@/components/AssistedFarmerRegistration.vue';

export default {
  name: 'FarmersManagement',
  components: { Default, AssistedFarmerRegistration },
  data() {
    return {
      zones: [],
      selectedZone: null,
      loadingZones: false,
      farmers: [],
      loadingFarmers: false,
      search: '',
      statusFilter: '',
      snackbar: { show: false, message: '', color: 'info' },
      page: 1,
      perPage: 15,
      mapId: `farmers-map-${Math.random().toString(36).substr(2, 8)}`,
      mapView: null,
      EsriMap: null,
      EsriMapView: null,
      EsriGraphic: null,
      EsriPoint: null,
      selectedFarmer: null,
      showAddFarmerDialog: false,
    };
  },
  computed: {
    filteredFarmers() {
      let list = this.farmers;
      if (this.statusFilter) {
        list = list.filter((f) => (this.statusFilter === 'withLocation' ? this.hasLocation(f) : !this.hasLocation(f)));
      }
      if (this.search) {
        const q = this.search.toLowerCase();
        list = list.filter((f) => (this.displayName(f) || '').toLowerCase().includes(q) || (f.phoneNumber || f.phone || '').toLowerCase().includes(q));
      }
      return list;
    },
    paginatedFarmers() {
      const start = (this.page - 1) * this.perPage;
      return this.filteredFarmers.slice(start, start + this.perPage);
    },
    pages() { return Math.ceil(this.filteredFarmers.length / this.perPage) || 1; },
    readableStatus() {
      switch (this.statusFilter) {
        case 'withLocation': return 'With Location';
        case 'missingLocation': return 'Missing Location';
        default: return '';
      }
    },
  },
  watch: {
    filteredFarmers() { if (this.page > this.pages) this.page = 1; },
  },
  async mounted() {
    await this.loadArcGIS();
    this.initMap();
    this.fetchZones();
  },
  methods: {
    async fetchZones() {
      if (this.loadingZones || this.zones.length) return;
      this.loadingZones = true;
      try {
        // Use canonical admin-service endpoint
        const response = await axios.get(`/api/admin-service/zones/exporter/${getCurrentUserId()}`);
        this.zones = response.data.data || [];
        // Auto-select first zone to streamline workflow
        if (!this.selectedZone && this.zones.length) {
          this.selectedZone = this.zones[0];
          this.fetchFarmers();
        }
      } catch (e) {
        this.showSnackbar('Failed to fetch zones', 'error');
      } finally { this.loadingZones = false; }
    },
    async fetchFarmers() {
      if (!this.selectedZone) return;
      this.loadingFarmers = true;
      try {
        // Prefer canonical admin-service endpoint for listing farmers in a zone
        const response = await axios.get(`/api/admin-service/zones/${this.selectedZone.id}/farmers`);
        this.farmers = response.data.data || [];
        this.page = 1;
        this.renderFarmersOnMap();
        if (!this.farmers.length) this.showSnackbar('No farmers found in this zone', 'info');
      } catch (e) {
        this.showSnackbar('Failed to load farmers', 'error');
        this.farmers = [];
        this.renderFarmersOnMap();
      } finally { this.loadingFarmers = false; }
    },
    onZoneChange() {
      this.farmers = [];
      this.selectedFarmer = null;
      this.renderFarmersOnMap();
      this.fetchFarmers();
    },
    clearZone() { this.selectedZone = null; this.farmers = []; this.renderFarmersOnMap(); },
    displayName(f) { return f?.farmerName || f?.name || 'Unnamed'; },
    summarizeProduces(f) {
      if (f?.produces && Array.isArray(f.produces) && f.produces.length) {
        return f.produces.slice(0, 2).map((p) => p.name || p.produceType || p.type).join(', ') + (f.produces.length > 2 ? '…' : '');
      }
      return f?.produceType || '—';
    },
    hasLocation(f) { return !!(f && (f.latitude || f.lat) && (f.longitude || f.lng)); },
    openProfile(f) {
      if (!f) return;
      this.$router.push({ name: 'Produces', params: { farmerId: f.id } });
    },
    openAddFarmerDialog() {
      if (!this.selectedZone) {
        // If zones exist but none selected pick first; else prompt
        if (this.zones.length) {
          this.selectedZone = this.zones[0];
          this.fetchFarmers();
        } else {
          this.showSnackbar('No zones available. Create or load zones first.', 'warning');
          return;
        }
      }
      this.showAddFarmerDialog = true;
    },
    handleFarmerDialogClosed() { this.showAddFarmerDialog = false; this.fetchFarmers(); },
    focusFarmerOnMap(f) {
      if (!this.mapView || !this.hasLocation(f)) return;
      const lon = f.longitude || f.lng; const lat = f.latitude || f.lat;
      this.mapView.goTo({ center: [lon, lat], zoom: 14 }).catch(() => {});
      this.selectedFarmer = f;
    },
    exportCsv() {
      const rows = [['ID', 'Name', 'Phone', 'Latitude', 'Longitude', 'Produces']];
      this.filteredFarmers.forEach((f) => rows.push([
        f.id, this.displayName(f), f.phoneNumber || f.phone || '', f.latitude || f.lat || '', f.longitude || f.lng || '', this.summarizeProduces(f),
      ]));
      const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'farmers.csv'; a.click(); URL.revokeObjectURL(url);
      this.showSnackbar('Export complete', 'success');
    },
    refreshCurrent() { if (this.selectedZone) this.fetchFarmers(); else this.fetchZones(); },
    showSnackbar(message, color = 'info') { this.snackbar = { show: true, message, color }; },
    snackbarColor(kind) {
      switch (kind) {
        case 'success': return 'green lighten-1';
        case 'error': return 'red lighten-1';
        case 'warning': return 'amber darken-2';
        case 'info': return 'blue lighten-1';
        default: return 'primary';
      }
    },
    async loadArcGIS() {
      if (!window.require) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script'); s.src = 'https://js.arcgis.com/4.25/init.js'; s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
          const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://js.arcgis.com/4.25/esri/themes/light/main.css'; document.head.appendChild(l);
        });
      }
      if (!this.EsriMap) {
        await new Promise((resolve, reject) => {
          try { window.require(['esri/Map', 'esri/views/MapView', 'esri/Graphic', 'esri/geometry/Point'], (Map, MapView, Graphic, Point) => { this.EsriMap = Map; this.EsriMapView = MapView; this.EsriGraphic = Graphic; this.EsriPoint = Point; resolve(); }); } catch (e) { reject(e); }
        });
      }
    },
    initMap() {
      if (this.mapView || !this.EsriMapView) return;
      const el = document.getElementById(this.mapId);
      if (!el) return;
      this.mapView = new this.EsriMapView({
        container: el,
        map: new this.EsriMap({ basemap: 'streets-navigation-vector' }),
        center: [36.8219, -1.2921],
        zoom: 7,
      });
    },
    renderFarmersOnMap() {
      if (!this.mapView || !this.EsriGraphic || !this.EsriPoint) return;
      this.mapView.graphics.removeAll();
      this.farmers.filter((f) => this.hasLocation(f)).forEach((f) => {
        const point = new this.EsriPoint({ longitude: f.longitude || f.lng, latitude: f.latitude || f.lat });
        const g = new this.EsriGraphic({
          geometry: point, symbol: { type: 'simple-marker', color: 'green', size: 7 }, attributes: f, popupTemplate: { title: this.displayName(f), content: `${f.phoneNumber || f.phone || ''}` },
        });
        this.mapView.graphics.add(g);
      });
    },
    fitAllFarmers() {
      if (!this.mapView) return; if (!this.mapView.graphics.items.length) return; this.mapView.goTo(this.mapView.graphics.items).catch(() => {});
    },
  },
  beforeDestroy() { if (this.mapView) { this.mapView.destroy(); this.mapView = null; } },
};
</script>

<style scoped>
/* Minimal additional styles if needed */
</style>
