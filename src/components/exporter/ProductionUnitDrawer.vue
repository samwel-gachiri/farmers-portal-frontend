<template>
  <div class="tw-h-full tw-flex tw-flex-col tw-bg-white tw-relative" :class="{ 'tw-fixed tw-inset-0 tw-z-50 tw-bottom-0 tw-left-0 tw-right-0 tw-top-0': isFullscreen }">
    <!-- Map Container (Full Height) -->
    <div ref="mapView" class="tw-w-full tw-h-full"></div>

    <!-- Toolbar: Drawing Tools + Basemap Toggle + Fullscreen (Top Right) -->
    <div class="tw-absolute tw-top-3 tw-right-3 tw-z-20 tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-3 tw-flex tw-gap-2 tw-items-center">
      <!-- Drawing Tools -->
      <div class="tw-flex tw-gap-2">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              small
              :color="isDrawing ? 'primary' : 'default'"
              :disabled="isDrawing || loading"
              @click="startDrawing"
              icon
            >
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Draw Unit</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              small
              color="red"
              :disabled="!unitPolygon || loading"
              @click="clearDrawing"
              icon
            >
              <v-icon small>mdi-eraser</v-icon>
            </v-btn>
          </template>
          <span>Clear</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              small
              color="success"
              :disabled="!unitPolygon || loading"
              @click="saveUnit"
              icon
            >
              <v-icon small>mdi-check-circle</v-icon>
            </v-btn>
          </template>
          <span>Done</span>
        </v-tooltip>
      </div>

      <!-- Separator -->
      <v-divider vertical></v-divider>

      <!-- Basemap Toggle -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: onTooltip, attrs: attrsTooltip }">
              <v-btn
                v-bind="{ ...attrs, ...attrsTooltip }"
                v-on="{ ...on, ...onTooltip }"
                small
                icon
              >
                <v-icon small>mdi-layers</v-icon>
              </v-btn>
            </template>
            <span>Map Layer</span>
          </v-tooltip>
        </template>
        <v-list dense>
          <v-list-item @click="changeBasemap('hybrid')">
            <v-list-item-title>
              <v-icon small :color="currentBasemap === 'hybrid' ? 'primary' : ''">
                mdi-check-circle
              </v-icon>
              Hybrid (Satellite + Labels)
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="changeBasemap('satellite')">
            <v-list-item-title>
              <v-icon small :color="currentBasemap === 'satellite' ? 'primary' : ''">
                mdi-check-circle
              </v-icon>
              Satellite Only
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="changeBasemap('streets')">
            <v-list-item-title>
              <v-icon small :color="currentBasemap === 'streets' ? 'primary' : ''">
                mdi-check-circle
              </v-icon>
              Street Map
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Separator -->
      <v-divider vertical></v-divider>

      <!-- Fullscreen Toggle -->
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            small
            :color="isFullscreen ? 'primary' : 'default'"
            @click="toggleFullscreen"
            icon
          >
            <v-icon small>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
          </v-btn>
        </template>
        <span>{{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}</span>
      </v-tooltip>
    </div>

    <!-- Coordinates Display (Top Right) -->
    <div v-if="farmerLocation" class="tw-absolute tw-top-3 tw-right-3 tw-z-20">
      <v-chip small color="white" text-color="green darken-2" class="tw-shadow-lg">
        <v-icon left x-small>mdi-crosshairs-gps</v-icon>
        {{ farmerLocation.lat.toFixed(4) }}, {{ farmerLocation.lng.toFixed(4) }}
      </v-chip>
    </div>

    <!-- Unit Info (Bottom Left) -->
    <div v-if="unitPolygon" class="tw-absolute tw-bottom-3 tw-left-3 tw-z-20">
      <v-card class="tw-shadow-lg">
        <v-card-text class="tw-py-2 tw-px-3">
          <div class="tw-text-xs tw-space-y-1">
            <div><strong>Area:</strong> {{ unitArea.toFixed(2) }} ha</div>
            <div><strong>Perimeter:</strong> {{ unitPerimeter.toFixed(0) }} m</div>
            <div><strong>Points:</strong> {{ unitPointCount }}</div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Status Indicator (Bottom Right) -->
    <div v-if="isDrawing" class="tw-absolute tw-bottom-3 tw-right-3 tw-z-20">
      <v-card class="tw-shadow-lg tw-bg-blue-50">
        <v-card-text class="tw-py-2 tw-px-3">
          <div class="tw-text-xs tw-font-medium tw-text-blue-700">
            Drawing: {{ drawingPoints.length }} points
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Loading Overlay -->
    <v-overlay :value="loading" absolute>
      <v-progress-circular
        indeterminate
        size="64"
        color="green"
      ></v-progress-circular>
      <div class="tw-mt-4 tw-text-white tw-font-medium tw-text-center">{{ loadingMessage }}</div>
    </v-overlay>

    <!-- Success/Error Snackbars -->
    <v-snackbar
        v-model="showSuccessMessage"
        color="success"
        timeout="3000"
        bottom
        left
    >
      {{ successMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showSuccessMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
        v-model="showErrorMessage"
        color="error"
        timeout="5000"
        bottom
        left
    >
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showErrorMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { loadModules, loadScript } from 'esri-loader';

export default {
  name: 'ProductionUnitDrawer',
  props: {
    initialLocation: {
      type: Object,
      default: () => ({ lat: -1.2921, lng: 36.8219 }),
    },
    existingUnits: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // Map and ArcGIS objects
      map: null,
      view: null,
      sketchViewModel: null,
      graphicsLayer: null,
      unitGeometry: null,
      unitArea: 0,
      unitPerimeter: 0,
      unitPointCount: 0,
      currentDrawingAction: null,

      // Farmer location
      farmerLocation: null,

      // Drawing state
      isDrawing: false,
      unitPolygon: null,
      drawingPoints: [],

      // UI state
      loading: true,
      loadingMessage: 'Initializing map...',
      showSuccessMessage: false,
      showErrorMessage: false,
      successMessage: '',
      errorMessage: '',
      isFullscreen: false,
      currentBasemap: 'hybrid',

      // Geometry modules
      geometryEngine: null,
      Graphic: null,
      Polygon: null,

      // Symbol configurations
      POLYGON_SYMBOL: {
        type: 'simple-fill',
        color: [51, 153, 51, 0.4],
        outline: {
          color: [51, 153, 51, 0.8],
          width: 2,
        },
      },
    };
  },

  async mounted() {
    this.farmerLocation = {
      lat: this.initialLocation.lat || -1.2921,
      lng: this.initialLocation.lng || 36.8219,
    };
    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', this.handleKeydown);
    // Delay initialization to prevent concurrent loading
    await this.$nextTick();
    // Additional safety delay to prevent stack overflow
    await new Promise((resolve) => setTimeout(resolve, 100));
    await this.initializeMap();
  },

  beforeDestroy() {
    // Remove keyboard event listener
    document.removeEventListener('keydown', this.handleKeydown);
    if (this.view) {
      this.view.destroy();
    }
  },

  methods: {
    async initializeMap() {
      try {
        this.loadingMessage = 'Loading ArcGIS API...';

        // Use a flag to prevent multiple concurrent loads
        // eslint-disable-next-line no-underscore-dangle
        if (window.__ARCGIS_LOAD_IN_PROGRESS__) {
          this.loadingMessage = 'Waiting for ArcGIS to load...';
          // Wait for other load to finish
          let attempts = 0;
          // eslint-disable-next-line no-underscore-dangle
          while (window.__ARCGIS_LOAD_IN_PROGRESS__ && attempts < 50) {
            // eslint-disable-next-line no-await-in-loop
            await new Promise((resolve) => setTimeout(resolve, 100));
            attempts += 1;
          }
        }

        // Check if ArcGIS is already loaded to prevent multiple loads
        if (!window.require) {
          // eslint-disable-next-line no-underscore-dangle
          window.__ARCGIS_LOAD_IN_PROGRESS__ = true;
          try {
            await loadScript({
              url: 'https://js.arcgis.com/4.28/',
              css: 'https://js.arcgis.com/4.28/esri/themes/light/main.css',
            });
          } finally {
            // eslint-disable-next-line no-underscore-dangle
            window.__ARCGIS_LOAD_IN_PROGRESS__ = false;
          }
        } else {
          this.loadingMessage = 'ArcGIS API already loaded, loading modules...';
        }

        this.loadingMessage = 'Loading map modules...';

        // Load required ArcGIS modules with retry logic
        const [
          Map,
          MapView,
          SketchViewModel,
          GraphicsLayer,
          Graphic,
          geometryEngine,
          Point,
          Polygon,
        ] = await this.loadModulesWithRetry([
          'esri/Map',
          'esri/views/MapView',
          'esri/widgets/Sketch/SketchViewModel',
          'esri/layers/GraphicsLayer',
          'esri/Graphic',
          'esri/geometry/geometryEngine',
          'esri/geometry/Point',
          'esri/geometry/Polygon',
        ]);

        // Store modules for later use
        this.geometryEngine = geometryEngine;
        this.Graphic = Graphic;
        this.Polygon = Polygon;

        this.loadingMessage = 'Setting up map...';

        // Check if container still exists before creating map
        if (!this.$refs.mapView) {
          this.showError('Map container not found. Please refresh the page.');
          this.loading = false;
          return;
        }

        // Create graphics layer for production units
        this.graphicsLayer = new GraphicsLayer({
          title: 'Production Units',
        });

        // Create map
        this.map = new Map({
          basemap: 'hybrid',
          layers: [this.graphicsLayer],
        });

        // Create map view
        this.view = new MapView({
          container: this.$refs.mapView,
          map: this.map,
          center: [this.farmerLocation.lng, this.farmerLocation.lat],
          zoom: 17,
        });

        // Wait for view to load
        await this.view.when();

        this.sketchViewModel = new SketchViewModel({
          view: this.view,
          layer: this.graphicsLayer,
          polygonSymbol: this.POLYGON_SYMBOL,
          defaultUpdateOptions: {
            tool: 'reshape',
            toggleToolOnClick: false,
          },
        });

        // Set up sketch event listeners
        this.setupSketchEvents(geometryEngine);

        // Add farmer location marker
        this.addFarmerLocationMarker(Graphic, Point);

        // Add existing units
        await this.displayExistingUnits(Graphic);

        this.loading = false;
        this.showSuccess('Map initialized successfully!');
      } catch (error) {
        console.error('Map initialization error:', error);

        // Handle stack overflow errors
        if (error.message && error.message.includes('stack')) {
          this.showError('Map initialization failed due to resource limit. Please refresh the page.');
          this.loading = false;
          return;
        }

        // Check if it's a duplicate load error
        if (error.message && error.message.includes('already loaded')) {
          // Try to recover by waiting and reloading just the modules
          this.loadingMessage = 'Recovering from duplicate load...';
          await new Promise((resolve) => setTimeout(resolve, 500));
          try {
            const [
              Map,
              MapView,
              SketchViewModel,
              GraphicsLayer,
              Graphic,
              geometryEngine,
              Point,
              Polygon,
            ] = await loadModules([
              'esri/Map',
              'esri/views/MapView',
              'esri/widgets/Sketch/SketchViewModel',
              'esri/layers/GraphicsLayer',
              'esri/Graphic',
              'esri/geometry/geometryEngine',
              'esri/geometry/Point',
              'esri/geometry/Polygon',
            ]);

            // Retry map creation with already-loaded modules
            this.geometryEngine = geometryEngine;
            this.Graphic = Graphic;
            this.Polygon = Polygon;

            if (!this.$refs.mapView) {
              this.showError('Map container not found.');
              this.loading = false;
              return;
            }

            this.graphicsLayer = new GraphicsLayer({
              title: 'Production Units',
            });

            this.map = new Map({
              basemap: 'hybrid',
              layers: [this.graphicsLayer],
            });

            this.view = new MapView({
              container: this.$refs.mapView,
              map: this.map,
              center: [this.farmerLocation.lng, this.farmerLocation.lat],
              zoom: 17,
            });

            await this.view.when();

            this.sketchViewModel = new SketchViewModel({
              view: this.view,
              layer: this.graphicsLayer,
              polygonSymbol: this.POLYGON_SYMBOL,
              defaultUpdateOptions: {
                tool: 'reshape',
                toggleToolOnClick: false,
              },
            });

            this.setupSketchEvents(geometryEngine);
            this.addFarmerLocationMarker(Graphic, Point);
            await this.displayExistingUnits(Graphic);

            this.loading = false;
            this.showSuccess('Map recovered and initialized!');
          } catch (recoveryError) {
            console.error('Recovery failed:', recoveryError);
            this.showError(`Failed to initialize map: ${recoveryError.message}`);
            this.loading = false;
          }
        } else {
          this.showError(`Failed to initialize map: ${error.message}`);
          this.loading = false;
        }
      }
    },

    // eslint-disable-next-line consistent-return
    async loadModulesWithRetry(modules, retries = 3) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < retries; i += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          return await loadModules(modules);
        } catch (error) {
          console.error(`Attempt ${i + 1} failed:`, error);
          if (i === retries - 1) throw error;
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    },

    addFarmerLocationMarker(Graphic, Point) {
      const locationGraphic = new Graphic({
        geometry: new Point({
          longitude: this.farmerLocation.lng,
          latitude: this.farmerLocation.lat,
        }),
        symbol: {
          type: 'simple-marker',
          color: [0, 100, 255],
          size: 12,
          outline: {
            color: [255, 255, 255],
            width: 2,
          },
        },
        attributes: {
          title: 'Farm Center',
        },
      });

      this.graphicsLayer.add(locationGraphic);
    },

    async displayExistingUnits(Graphic) {
      if (!this.existingUnits || this.existingUnits.length === 0) return;

      try {
        this.existingUnits.forEach((unit) => {
          if (unit.geometry) {
            const graphic = new Graphic({
              geometry: {
                type: 'polygon',
                rings: unit.geometry.coordinates || unit.geometry.rings,
                spatialReference: { wkid: 4326 },
              },
              symbol: {
                type: 'simple-fill',
                color: [100, 100, 100, 0.3],
                outline: {
                  color: [100, 100, 100, 0.8],
                  width: 1.5,
                },
              },
              attributes: {
                title: unit.name || 'Production Unit',
                unitId: unit.id,
              },
            });
            this.graphicsLayer.add(graphic);
          }
        });
      } catch (error) {
        console.error('Error displaying existing units:', error);
      }
    },

    setupSketchEvents(geometryEngine) {
      this.sketchViewModel.on('create', async (event) => {
        if (event.state === 'start') {
          this.isDrawing = true;
          this.showSuccess('Started drawing unit boundary');
        } else if (event.state === 'complete') {
          this.unitGeometry = event.graphic.geometry;
          this.unitPolygon = event.graphic.geometry;
          await this.calculateUnitArea(geometryEngine);
          this.isDrawing = false;
          this.showSuccess('Finished drawing unit boundary');
          this.$emit('unit-drawn', {
            geometry: this.unitGeometry,
            area: this.unitArea,
          });
        } else if (event.state === 'cancel') {
          this.isDrawing = false;
        }
      });

      this.sketchViewModel.on('update', async (event) => {
        if (event.state === 'complete') {
          this.unitGeometry = event.graphics[0].geometry;
          this.unitPolygon = event.graphics[0].geometry;
          await this.calculateUnitArea(geometryEngine);
          this.$emit('unit-updated', {
            geometry: this.unitGeometry,
            area: this.unitArea,
          });
        }
      });
    },

    startDrawing() {
      if (this.sketchViewModel) {
        this.sketchViewModel.create('polygon');
        this.isDrawing = true;
      }
    },

    async calculateUnitArea(geometryEngine) {
      if (this.unitGeometry) {
        try {
          // Calculate area in square meters
          const areaInSquareMeters = geometryEngine.planarArea(this.unitGeometry, 'square-meters');
          const perimeterInMeters = geometryEngine.planarLength(this.unitGeometry, 'meters');
          // Convert to hectares (1 hectare = 10000 square meters)
          this.unitArea = Math.abs(areaInSquareMeters) / 10000;
          this.unitPerimeter = perimeterInMeters;
          if (this.unitGeometry.rings && this.unitGeometry.rings[0]) {
            this.unitPointCount = this.unitGeometry.rings[0].length - 1;
          }
        } catch (error) {
          console.error('Error calculating area:', error);
          this.showError('Error calculating area');
          this.unitArea = 0;
          this.unitPerimeter = 0;
        }
      }
    },

    clearDrawing() {
      if (this.currentDrawingAction) {
        try {
          this.currentDrawingAction.destroy();
        } catch (e) {
          console.error('Error destroying draw action:', e);
        }
        this.currentDrawingAction = null;
      }

      if (this.graphicsLayer) {
        // Remove all graphics except the farmer location marker (first graphic)
        const graphics = this.graphicsLayer.graphics.items;
        if (graphics.length > 1) {
          this.graphicsLayer.removeMany(graphics.slice(1));
        }
      }

      this.unitPolygon = null;
      this.unitArea = 0;
      this.unitPerimeter = 0;
      this.unitPointCount = 0;
      this.isDrawing = false;
      this.showSuccess('Cleared drawing');
    },

    saveUnit() {
      if (!this.unitPolygon) {
        this.showError('No unit boundary to save.');
        return;
      }

      try {
        // Emit event with unit data
        this.$emit('save-unit', {
          geometry: this.unitPolygon,
          area: this.unitArea,
          perimeter: this.unitPerimeter,
          pointCount: this.unitPointCount,
        });

        this.showSuccess(`Unit saved! Area: ${this.unitArea.toFixed(5)} hectares`);
      } catch (error) {
        console.error('Error saving unit:', error);
        this.showError('Failed to save unit. Please try again.');
      }
    },

    showSuccess(message) {
      this.successMessage = message;
      this.showSuccessMessage = true;
    },

    showError(message) {
      this.errorMessage = message;
      this.showErrorMessage = true;
    },

    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      if (this.view) {
        // Force map to resize after fullscreen toggle
        setTimeout(() => {
          this.view.resize();
        }, 100);
      }
    },

    changeBasemap(basemapName) {
      if (this.map) {
        this.map.basemap = basemapName;
        this.currentBasemap = basemapName;
      }
    },

    handleKeydown(event) {
      // Exit fullscreen when Escape is pressed
      if (event.key === 'Escape' && this.isFullscreen) {
        this.isFullscreen = false;
      }
    },
  },
};
</script>

<style scoped>
/* Ensure proper z-indexing for floating elements */
.tw-z-10 {
  z-index: 10;
}

/* Custom scrollbar for small screens */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
