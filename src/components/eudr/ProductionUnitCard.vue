<template>
  <v-card class="production-unit-card" elevation="2">
    <v-card-title class="pb-2">
      <div class="d-flex align-center w-100">
        <v-icon class="mr-2" color="green">mdi-map-marker</v-icon>
        <span class="text-truncate">{{ unit.unitName }}</span>
        <v-spacer />
        <v-chip
          :color="hederaVerified ? 'green' : 'orange'"
          :text-color="hederaVerified ? 'white' : 'black'"
          small
        >
          <v-icon left small>
            {{ hederaVerified ? 'mdi-shield-check' : 'mdi-shield-alert' }}
          </v-icon>
          {{ hederaVerified ? 'Verified' : 'Pending' }}
        </v-chip>
      </div>
    </v-card-title>

    <v-card-text class="pb-2">
      <div class="unit-details">
        <!-- Area Information -->
        <div class="detail-row">
          <v-icon small class="mr-2">mdi-ruler-square</v-icon>
          <span class="detail-label">Area:</span>
          <span class="detail-value">{{ formatArea(unit.areaHectares) }} hectares</span>
        </div>

        <!-- Location Information -->
        <div v-if="unit.administrativeRegion" class="detail-row">
          <v-icon small class="mr-2">mdi-map</v-icon>
          <span class="detail-label">Region:</span>
          <span class="detail-value">{{ unit.administrativeRegion }}</span>
        </div>

        <!-- Last Verified -->
        <div v-if="unit.lastVerifiedAt" class="detail-row">
          <v-icon small class="mr-2">mdi-clock-check</v-icon>
          <span class="detail-label">Verified:</span>
          <span class="detail-value">{{ formatDate(unit.lastVerifiedAt) }}</span>
        </div>

        <!-- Coordinates Preview -->
        <div v-if="unit.wgs84Coordinates" class="detail-row">
          <v-icon small class="mr-2">mdi-crosshairs-gps</v-icon>
          <span class="detail-label">Coordinates:</span>
          <span class="detail-value text-truncate">
            {{ coordinatesPreview }}
          </span>
        </div>
      </div>
    </v-card-text>

    <!-- Polygon Preview Map -->
    <div v-if="unit.parcelGeometry" class="polygon-preview">
      <div :id="mapId" class="preview-map"></div>
      <v-overlay v-model="mapLoading" absolute>
        <v-progress-circular indeterminate size="24" />
      </v-overlay>
    </div>

    <v-card-actions class="pt-0">
      <v-btn
        text
        small
        color="primary"
        @click="$emit('view', unit)"
      >
        <v-icon left small>mdi-eye</v-icon>
        View
      </v-btn>

      <v-btn
        text
        small
        color="orange"
        @click="$emit('edit', unit)"
      >
        <v-icon left small>mdi-pencil</v-icon>
        Edit
      </v-btn>

      <v-spacer />

      <v-btn
        text
        small
        color="error"
        @click="$emit('delete', unit)"
      >
        <v-icon left small>mdi-delete</v-icon>
        Delete
      </v-btn>
    </v-card-actions>

    <!-- Hedera Verification Badge -->
    <div v-if="hederaVerified" class="hedera-badge">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            color="green"
            size="20"
          >
            mdi-blockchain
          </v-icon>
        </template>
        <span>Verified on Hedera DLT</span>
      </v-tooltip>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'ProductionUnitCard',
  props: {
    unit: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mapId: `preview-map-${Math.random().toString(36).substr(2, 9)}`,
      mapView: null,
      mapLoading: false,
    };
  },
  computed: {
    hederaVerified() {
      return !!(this.unit.hederaTransactionId && this.unit.hederaHash);
    },

    coordinatesPreview() {
      if (!this.unit.wgs84Coordinates) return 'N/A';
      const coords = this.unit.wgs84Coordinates.split(';');
      return `${coords.length} points`;
    },
  },

  mounted() {
    if (this.unit.parcelGeometry) {
      this.$nextTick(() => {
        this.initializePreviewMap();
      });
    }
  },

  beforeDestroy() {
    this.destroyMap();
  },

  methods: {
    formatArea(area) {
      if (!area) return '0';
      return parseFloat(area).toFixed(2);
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    },

    async initializePreviewMap() {
      if (!this.unit.parcelGeometry || this.mapView) return;

      this.mapLoading = true;

      try {
        // Load ArcGIS modules
        await this.loadArcGIS();

        const map = new this.Map({
          basemap: 'satellite',
        });

        this.mapView = new this.MapView({
          container: this.mapId,
          map,
          ui: {
            components: [], // Remove all UI components for preview
          },
        });

        await this.mapView.when();

        // Add polygon to map
        this.addPolygonToMap();
      } catch (error) {
        console.error('Error initializing preview map:', error);
      } finally {
        this.mapLoading = false;
      }
    },

    async loadArcGIS() {
      return new Promise((resolve) => {
        if (window.require && this.Map) {
          resolve();
          return;
        }

        if (!window.require) {
          const script = document.createElement('script');
          script.src = 'https://js.arcgis.com/4.28/init.js';
          script.onload = () => this.loadModules().then(resolve);
          document.head.appendChild(script);
        } else {
          this.loadModules().then(resolve);
        }
      });
    },

    loadModules() {
      return new Promise((resolve) => {
        window.require([
          'esri/Map',
          'esri/views/MapView',
          'esri/Graphic',
          'esri/geometry/Polygon',
        ], (Map, MapView, Graphic, Polygon) => {
          this.Map = Map;
          this.MapView = MapView;
          this.Graphic = Graphic;
          this.Polygon = Polygon;
          resolve();
        });
      });
    },

    addPolygonToMap() {
      if (!this.mapView || !this.unit.parcelGeometry) return;

      try {
        // Parse GeoJSON geometry
        const geoJsonGeometry = typeof this.unit.parcelGeometry === 'string'
          ? JSON.parse(this.unit.parcelGeometry)
          : this.unit.parcelGeometry;

        // Convert GeoJSON to ArcGIS Polygon
        const polygon = new this.Polygon({
          rings: geoJsonGeometry.coordinates,
          spatialReference: { wkid: 4326 },
        });

        const graphic = new this.Graphic({
          geometry: polygon,
          symbol: {
            type: 'simple-fill',
            color: [51, 153, 51, 0.6],
            outline: {
              color: [51, 153, 51, 1],
              width: 2,
            },
          },
        });

        this.mapView.graphics.add(graphic);

        // Zoom to polygon extent
        this.mapView.goTo(polygon.extent.expand(1.2));
      } catch (error) {
        console.error('Error adding polygon to preview map:', error);
      }
    },

    destroyMap() {
      if (this.mapView) {
        this.mapView.destroy();
        this.mapView = null;
      }
    },
  },
};
</script>

<style scoped>
.production-unit-card {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.unit-details {
  min-height: 120px;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-label {
  font-weight: 500;
  margin-right: 8px;
  min-width: 80px;
}

.detail-value {
  color: #666;
  flex: 1;
}

.polygon-preview {
  position: relative;
  height: 150px;
  margin: 0 16px 16px 16px;
  border-radius: 4px;
  overflow: hidden;
}

.preview-map {
  width: 100%;
  height: 100%;
}

.hedera-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Ensure card content fills available space */
.v-card__text {
  flex: 1;
}

/* Custom styling for ArcGIS preview */
:deep(.esri-view .esri-view-surface--inset-outline:focus::after) {
  outline: none !important;
}

:deep(.esri-attribution) {
  display: none !important;
}
</style>
