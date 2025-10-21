<template>
  <v-card class="production-unit-form">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">{{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
      {{ isEditing ? 'Edit Production Unit' : 'Create Production Unit' }}
      <v-spacer />
      <v-btn icon @click="$emit('cancel')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-container fluid>
        <v-row>
          <!-- Form Fields -->
          <v-col cols="12" md="4">
            <v-form ref="form" v-model="formValid">
              <v-text-field
                v-model="formData.unitName"
                label="Farm/Unit Name"
                :rules="[rules.required]"
                outlined
                dense
                prepend-inner-icon="mdi-map-marker"
              />

              <v-text-field
                v-model="formData.administrativeRegion"
                label="Administrative Region"
                outlined
                dense
                prepend-inner-icon="mdi-map"
                hint="e.g., County, Province, State"
              />

              <!-- Polygon Information Display -->
              <v-card v-if="polygonMetrics" outlined class="mt-4">
                <v-card-subtitle class="pb-1">
                  <v-icon small class="mr-1">mdi-information</v-icon>
                  Polygon Information
                </v-card-subtitle>
                <v-card-text class="pt-1">
                  <div class="polygon-info">
                    <div class="info-row">
                      <span class="info-label">Area:</span>
                      <span class="info-value">{{ polygonMetrics.areaHectares }} hectares</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Perimeter:</span>
                      <span class="info-value">{{ polygonMetrics.perimeterKm }} km</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Center:</span>
                      <span class="info-value">
                        {{ polygonMetrics.centroidLat.toFixed(4) }},
                        {{ polygonMetrics.centroidLon.toFixed(4) }}
                      </span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Validation Results -->
              <v-alert
                v-if="validationResult && !validationResult.isValid"
                type="error"
                dense
                class="mt-4"
              >
                <div class="text-caption">
                  <strong>Validation Errors:</strong>
                  <ul class="mt-1">
                    <li v-for="error in validationResult.errors" :key="error">
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </v-alert>

              <v-alert
                v-if="validationResult && validationResult.warnings.length > 0"
                type="warning"
                dense
                class="mt-2"
              >
                <div class="text-caption">
                  <strong>Warnings:</strong>
                  <ul class="mt-1">
                    <li v-for="warning in validationResult.warnings" :key="warning">
                      {{ warning }}
                    </li>
                  </ul>
                </div>
              </v-alert>

              <!-- Import/Export Options -->
              <v-expansion-panels class="mt-4" flat>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <v-icon class="mr-2">mdi-import</v-icon>
                    Import/Export Options
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="import-export-options">
                      <v-file-input
                        v-model="importFile"
                        label="Import GeoJSON/Shapefile"
                        accept=".geojson,.json,.shp,.zip"
                        outlined
                        dense
                        prepend-icon="mdi-file-import"
                        @change="handleFileImport"
                      />

                      <v-btn
                        v-if="formData.geoJsonPolygon"
                        text
                        small
                        color="primary"
                        @click="exportGeoJson"
                        class="mt-2"
                      >
                        <v-icon left small>mdi-download</v-icon>
                        Export GeoJSON
                      </v-btn>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-form>
          </v-col>

          <!-- Map Drawing Area -->
          <v-col cols="12" md="8">
            <v-card outlined>
              <v-card-title class="py-2">
                <v-icon class="mr-2">mdi-draw</v-icon>
                Draw Farm Boundary
                <v-spacer />
                <v-btn-toggle v-model="drawingMode" mandatory dense>
                  <v-btn small value="draw">
                    <v-icon small>mdi-pencil</v-icon>
                    Draw
                  </v-btn>
                  <v-btn small value="edit">
                    <v-icon small>mdi-cursor-move</v-icon>
                    Edit
                  </v-btn>
                </v-btn-toggle>
              </v-card-title>

              <v-card-text class="pa-0">
                <div class="map-container">
                  <div :id="mainMapId" class="main-map"></div>

                  <!-- Map Controls -->
                  <div class="map-controls">
                    <v-btn
                      fab
                      small
                      color="green"
                      @click="startPolygonDrawing"
                      :disabled="isDrawing"
                      class="mb-2"
                    >
                      <v-icon>mdi-vector-polygon</v-icon>
                    </v-btn>

                    <v-btn
                      fab
                      small
                      color="orange"
                      @click="clearPolygon"
                      :disabled="!hasPolygon"
                      class="mb-2"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <v-btn
                      fab
                      small
                      color="blue"
                      @click="validatePolygon"
                      :disabled="!hasPolygon"
                      class="mb-2"
                    >
                      <v-icon>mdi-check-circle</v-icon>
                    </v-btn>
                  </div>

                  <!-- Loading Overlay -->
                  <v-overlay v-model="mapLoading" absolute>
                    <v-progress-circular indeterminate size="48" />
                    <div class="mt-2 text-center">{{ mapLoadingMessage }}</div>
                  </v-overlay>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('cancel')">Cancel</v-btn>
      <v-btn
        color="primary"
        @click="save"
        :disabled="!canSave"
        :loading="saving"
      >
        {{ isEditing ? 'Update' : 'Create' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { productionUnitService } from '@/services/productionUnitService.js';

export default {
  name: 'ProductionUnitForm',
  props: {
    unit: {
      type: Object,
      default: null,
    },
    farmerId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // Color constants
      POLYGON_FILL_COLOR: [51, 153, 51, 0.4],
      POLYGON_OUTLINE_COLOR: [51, 153, 51, 0.8],

      // Null constants for repeated assignments
      NULL_METRICS: null,
      NULL_VALIDATION: null,

      formValid: false,
      saving: false,
      mapLoading: true,
      mapLoadingMessage: 'Loading map...',

      // Map IDs
      mainMapId: `main-map-${Math.random().toString(36).substr(2, 9)}`,

      // Map objects
      map: null,
      mapView: null,
      sketchViewModel: null,
      graphicsLayer: null,

      // ArcGIS modules
      Map: null,
      MapView: null,
      SketchViewModel: null,
      GraphicsLayer: null,
      Graphic: null,
      Polygon: null,
      geometryEngine: null,

      // Drawing state
      drawingMode: 'draw',
      isDrawing: false,
      hasPolygon: false,

      // Form data
      formData: {
        unitName: '',
        administrativeRegion: '',
        geoJsonPolygon: '',
      },

      // Validation and metrics
      validationResult: null,
      polygonMetrics: null,

      // Import/Export
      importFile: null,

      // Form rules
      rules: {
        required: (value) => !!value || 'This field is required',
      },
    };
  },

  computed: {
    isEditing() {
      return !!(this.unit && this.unit.id);
    },

    canSave() {
      return this.formValid
             && this.formData.geoJsonPolygon
             && this.validationResult?.isValid
             && !this.saving;
    },
  },

  watch: {
    unit: {
      immediate: true,
      handler(newUnit) {
        if (newUnit) {
          this.formData = {
            unitName: newUnit.unitName || '',
            administrativeRegion: newUnit.administrativeRegion || '',
            geoJsonPolygon: newUnit.parcelGeometry || '',
          };
        } else {
          this.resetForm();
        }
      },
    },
  },

  async mounted() {
    await this.initializeMap();
  },

  beforeDestroy() {
    this.destroyMap();
  },

  methods: {
    async initializeMap() {
      try {
        this.mapLoadingMessage = 'Loading ArcGIS modules...';
        await this.loadArcGISModules();

        this.mapLoadingMessage = 'Setting up map...';
        await this.setupMap();

        this.mapLoadingMessage = 'Getting location...';
        await this.getUserLocation();

        this.mapLoading = false;
      } catch (error) {
        console.error('Error initializing map:', error);
        this.mapLoading = false;
      }
    },

    async loadArcGISModules() {
      return new Promise((resolve) => {
        if (!window.require) {
          const script = document.createElement('script');
          script.src = 'https://js.arcgis.com/4.28/init.js';
          script.onload = () => this.loadModules().then(resolve);
          document.head.appendChild(script);

          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://js.arcgis.com/4.28/esri/themes/light/main.css';
          document.head.appendChild(link);
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
          'esri/widgets/Sketch/SketchViewModel',
          'esri/layers/GraphicsLayer',
          'esri/Graphic',
          'esri/geometry/Polygon',
          'esri/geometry/geometryEngine',
        ], (Map, MapView, SketchViewModel, GraphicsLayer, Graphic, Polygon, geometryEngine) => {
          this.Map = Map;
          this.MapView = MapView;
          this.SketchViewModel = SketchViewModel;
          this.GraphicsLayer = GraphicsLayer;
          this.Graphic = Graphic;
          this.Polygon = Polygon;
          this.geometryEngine = geometryEngine;
          resolve();
        });
      });
    },

    async setupMap() {
      // Create graphics layer
      this.graphicsLayer = new this.GraphicsLayer({
        title: 'Production Units',
      });

      // Create map
      this.map = new this.Map({
        basemap: 'hybrid',
        layers: [this.graphicsLayer],
      });

      // Create map view
      this.mapView = new this.MapView({
        container: this.mainMapId,
        map: this.map,
        center: [36.8219, -1.2921], // Default to Nairobi
        zoom: 10,
      });

      await this.mapView.when();

      // Set up sketch view model
      this.sketchViewModel = new this.SketchViewModel({
        view: this.mapView,
        layer: this.graphicsLayer,
        polygonSymbol: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          type: 'simple-fill',
          color: this.POLYGON_FILL_COLOR,
          outline: {
            color: this.POLYGON_OUTLINE_COLOR,
            width: 2,
          },
        },
      });

      // Set up event listeners
      this.setupSketchEvents();

      // Load existing polygon if editing
      if (this.isEditing && this.formData.geoJsonPolygon) {
        this.loadExistingPolygon();
      }
    },

    setupSketchEvents() {
      this.sketchViewModel.on('create', (event) => {
        if (event.state === 'start') {
          this.isDrawing = true;
        } else if (event.state === 'complete') {
          this.isDrawing = false;
          this.hasPolygon = true;
          this.handlePolygonCreated(event.graphic.geometry);
        } else if (event.state === 'cancel') {
          this.isDrawing = false;
        }
      });

      this.sketchViewModel.on('update', (event) => {
        if (event.state === 'complete') {
          this.handlePolygonUpdated(event.graphics[0].geometry);
        }
      });

      this.sketchViewModel.on('delete', () => {
        this.hasPolygon = false;
        this.formData.geoJsonPolygon = '';
        this.polygonMetrics = this.NULL_METRICS;
        this.validationResult = this.NULL_VALIDATION;
      });
    },

    async getUserLocation() {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve();
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const center = [position.coords.longitude, position.coords.latitude];
            this.mapView.goTo({ center, zoom: 15 });
            resolve();
          },
          () => {
            resolve(); // Continue with default location
          },
          { timeout: 5000 },
        );
      });
    },

    startPolygonDrawing() {
      if (this.sketchViewModel) {
        this.sketchViewModel.create('polygon');
      }
    },

    clearPolygon() {
      if (this.graphicsLayer) {
        this.graphicsLayer.removeAll();
      }
      this.hasPolygon = false;
      this.formData.geoJsonPolygon = '';
      this.polygonMetrics = this.NULL_METRICS;
      this.validationResult = this.NULL_VALIDATION;
    },

    async handlePolygonCreated(geometry) {
      await this.processPolygonGeometry(geometry);
    },

    async handlePolygonUpdated(geometry) {
      await this.processPolygonGeometry(geometry);
    },

    async processPolygonGeometry(geometry) {
      try {
        // Convert ArcGIS geometry to GeoJSON
        const geoJsonGeometry = this.arcgisToGeoJson(geometry);
        this.formData.geoJsonPolygon = JSON.stringify(geoJsonGeometry);

        // Validate polygon
        await this.validatePolygon();

        // Calculate metrics
        await this.calculateMetrics();
      } catch (error) {
        console.error('Error processing polygon geometry:', error);
      }
    },

    arcgisToGeoJson(geometry) {
      // Convert ArcGIS Polygon to GeoJSON
      return {
        type: 'Polygon',
        coordinates: geometry.rings,
      };
    },

    async validatePolygon() {
      if (!this.formData.geoJsonPolygon) return;

      try {
        const response = await productionUnitService.validatePolygon({
          geoJsonPolygon: this.formData.geoJsonPolygon,
        });

        this.validationResult = response.data;
      } catch (error) {
        console.error('Error validating polygon:', error);
        this.validationResult = {
          isValid: false,
          errors: ['Failed to validate polygon'],
          warnings: [],
        };
      }
    },

    async calculateMetrics() {
      if (!this.formData.geoJsonPolygon) return;

      try {
        const response = await productionUnitService.calculateMetrics({
          geoJsonPolygon: this.formData.geoJsonPolygon,
        });

        this.polygonMetrics = response.data;
      } catch (error) {
        console.error('Error calculating metrics:', error);
        this.polygonMetrics = null;
      }
    },

    loadExistingPolygon() {
      if (!this.formData.geoJsonPolygon) return;

      try {
        const geoJsonGeometry = JSON.parse(this.formData.geoJsonPolygon);

        const polygon = new this.Polygon({
          rings: geoJsonGeometry.coordinates,
          spatialReference: { wkid: 4326 },
        });

        const graphic = new this.Graphic({
          geometry: polygon,
          symbol: {
            type: 'simple-fill',
            color: this.POLYGON_FILL_COLOR,
            outline: {
              color: this.POLYGON_OUTLINE_COLOR,
              width: 2,
            },
          },
        });

        this.graphicsLayer.add(graphic);
        this.mapView.goTo(polygon.extent.expand(1.2));
        this.hasPolygon = true;

        // Calculate metrics for existing polygon
        this.calculateMetrics();
        this.validatePolygon();
      } catch (error) {
        console.error('Error loading existing polygon:', error);
      }
    },

    async handleFileImport(file) {
      if (!file) return;

      try {
        const text = await this.readFileAsText(file);

        if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
          const geoJson = JSON.parse(text);

          if (geoJson.type === 'FeatureCollection') {
            // Handle feature collection
            if (geoJson.features && geoJson.features.length > 0) {
              const feature = geoJson.features[0];
              if (feature.geometry && feature.geometry.type === 'Polygon') {
                this.formData.geoJsonPolygon = JSON.stringify(feature.geometry);
                this.loadPolygonFromGeoJson(feature.geometry);
              }
            }
          } else if (geoJson.type === 'Polygon') {
            // Handle single polygon
            this.formData.geoJsonPolygon = JSON.stringify(geoJson);
            this.loadPolygonFromGeoJson(geoJson);
          }
        }
      } catch (error) {
        console.error('Error importing file:', error);
        this.$emit('show-message', {
          type: 'error',
          text: 'Failed to import file. Please check the format.',
        });
      }
    },

    readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },

    loadPolygonFromGeoJson(geoJsonGeometry) {
      try {
        this.clearPolygon();

        const polygon = new this.Polygon({
          rings: geoJsonGeometry.coordinates,
          spatialReference: { wkid: 4326 },
        });

        const graphic = new this.Graphic({
          geometry: polygon,
          symbol: {
            type: 'simple-fill',
            color: this.POLYGON_FILL_COLOR,
            outline: {
              color: this.POLYGON_OUTLINE_COLOR,
              width: 2,
            },
          },
        });

        this.graphicsLayer.add(graphic);
        this.mapView.goTo(polygon.extent.expand(1.2));
        this.hasPolygon = true;

        this.validatePolygon();
        this.calculateMetrics();
      } catch (error) {
        console.error('Error loading polygon from GeoJSON:', error);
      }
    },

    exportGeoJson() {
      if (!this.formData.geoJsonPolygon) return;

      try {
        const geoJson = {
          type: 'Feature',
          properties: {
            name: this.formData.unitName,
            administrativeRegion: this.formData.administrativeRegion,
            areaHectares: this.polygonMetrics?.areaHectares,
            exportedAt: new Date().toISOString(),
          },
          geometry: JSON.parse(this.formData.geoJsonPolygon),
        };

        const blob = new Blob([JSON.stringify(geoJson, null, 2)], {
          type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.formData.unitName || 'production-unit'}.geojson`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting GeoJSON:', error);
      }
    },

    async save() {
      if (!this.canSave) return;

      this.saving = true;
      try {
        const saveData = {
          unitName: this.formData.unitName,
          geoJsonPolygon: this.formData.geoJsonPolygon,
          administrativeRegion: this.formData.administrativeRegion,
        };

        this.$emit('save', saveData);
      } catch (error) {
        console.error('Error saving production unit:', error);
      } finally {
        this.saving = false;
      }
    },

    resetForm() {
      this.formData = {
        unitName: '',
        administrativeRegion: '',
        geoJsonPolygon: '',
      };
      this.validationResult = this.NULL_VALIDATION;
      this.polygonMetrics = this.NULL_METRICS;
      this.hasPolygon = false;
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
.production-unit-form {
  max-height: 90vh;
  overflow-y: auto;
}

.map-container {
  position: relative;
  height: 400px;
}

.main-map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.polygon-info {
  font-size: 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.info-label {
  font-weight: 500;
}

.info-value {
  color: #666;
}

.import-export-options {
  padding: 8px 0;
}

/* ArcGIS custom styling */
:deep(.esri-view .esri-view-surface--inset-outline:focus::after) {
  outline: none !important;
}

:deep(.esri-attribution) {
  font-size: 10px !important;
}
</style>
