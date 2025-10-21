<template>
  <v-card class="production-unit-viewer">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2" color="primary">mdi-map-marker</v-icon>
      {{ unit.unitName }}
      <v-spacer />
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-row>
        <!-- Basic Information -->
        <v-col cols="12" md="6">
          <v-card outlined class="mb-4">
            <v-card-subtitle class="pb-0">
              <v-icon small class="mr-1">mdi-information</v-icon>
              Basic Information
            </v-card-subtitle>
            <v-card-text>
              <v-simple-table dense>
                <tbody>
                  <tr>
                    <td class="font-weight-medium">Unit Name:</td>
                    <td>{{ unit.unitName }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium">Area:</td>
                    <td>{{ unit.areaHectares }} hectares</td>
                  </tr>
                  <tr v-if="unit.administrativeRegion">
                    <td class="font-weight-medium">Region:</td>
                    <td>{{ unit.administrativeRegion }}</td>
                  </tr>
                  <tr v-if="unit.lastVerifiedAt">
                    <td class="font-weight-medium">Last Verified:</td>
                    <td>{{ formatDate(unit.lastVerifiedAt) }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>

          <!-- Verification Status -->
          <v-card outlined class="mb-4">
            <v-card-subtitle class="pb-0">
              <v-icon small class="mr-1">mdi-shield-check</v-icon>
              Verification Status
            </v-card-subtitle>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon
                  :color="unit.isHederaVerified ? 'success' : 'grey'"
                  class="mr-2"
                >
                  {{ unit.isHederaVerified ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                </v-icon>
                <span>Hedera Blockchain Verified</span>
              </div>

              <div v-if="unit.hederaTransactionId" class="mt-2">
                <v-text-field
                  :value="unit.hederaTransactionId"
                  label="Hedera Transaction ID"
                  readonly
                  dense
                  outlined
                  append-icon="mdi-content-copy"
                  @click:append="copyToClipboard(unit.hederaTransactionId)"
                />
              </div>

              <div v-if="unit.hederaHash" class="mt-2">
                <v-text-field
                  :value="unit.hederaHash"
                  label="Polygon Hash"
                  readonly
                  dense
                  outlined
                  append-icon="mdi-content-copy"
                  @click:append="copyToClipboard(unit.hederaHash)"
                />
              </div>
            </v-card-text>
          </v-card>

          <!-- Coordinates -->
          <v-card outlined v-if="unit.wgs84Coordinates">
            <v-card-subtitle class="pb-0">
              <v-icon small class="mr-1">mdi-crosshairs-gps</v-icon>
              WGS84 Coordinates
            </v-card-subtitle>
            <v-card-text>
              <v-textarea
                :value="formatCoordinates(unit.wgs84Coordinates)"
                label="Polygon Coordinates (Lat, Lng)"
                readonly
                dense
                outlined
                rows="4"
                append-icon="mdi-content-copy"
                @click:append="copyToClipboard(unit.wgs84Coordinates)"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Map Visualization -->
        <v-col cols="12" md="6">
          <v-card outlined class="mb-4">
            <v-card-subtitle class="pb-0">
              <v-icon small class="mr-1">mdi-map</v-icon>
              Polygon Visualization
            </v-card-subtitle>
            <v-card-text>
              <div class="map-container">
                <div id="unit-map" class="unit-map"></div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Statistics -->
          <v-card outlined>
            <v-card-subtitle class="pb-0">
              <v-icon small class="mr-1">mdi-chart-line</v-icon>
              Statistics
            </v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h6 primary--text">{{ coordinateCount }}</div>
                    <div class="text-caption">Coordinates</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h6 success--text">{{ unit.areaHectares }}</div>
                    <div class="text-caption">Hectares</div>
                  </div>
                </v-col>
              </v-row>

              <v-row v-if="perimeter">
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h6 info--text">{{ perimeter }}</div>
                    <div class="text-caption">Perimeter (km)</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h6 warning--text">{{ shape }}</div>
                    <div class="text-caption">Shape</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('close')">Close</v-btn>
      <v-btn
        color="primary"
        @click="$emit('edit', unit)"
      >
        <v-icon left>mdi-pencil</v-icon>
        Edit
      </v-btn>
      <v-btn
        color="secondary"
        @click="downloadGeoJSON"
        outlined
      >
        <v-icon left>mdi-download</v-icon>
        Export GeoJSON
      </v-btn>
    </v-card-actions>

    <!-- Snackbar for messages -->
    <v-snackbar
      v-model="showMessage"
      :color="messageType"
      timeout="3000"
      bottom
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  name: 'ProductionUnitViewer',
  props: {
    unit: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      showMessage: false,
      message: '',
      messageType: 'success',
    };
  },
  computed: {
    coordinateCount() {
      if (!this.unit.wgs84Coordinates) return 0;
      return this.unit.wgs84Coordinates.split(';').length;
    },
    perimeter() {
      // Calculate perimeter from coordinates (simplified)
      if (!this.unit.wgs84Coordinates) return '0.0';
      // This would need actual calculation based on coordinates
      return '2.5'; // Placeholder
    },
    shape() {
      // Determine shape based on coordinate count
      const count = this.coordinateCount;
      if (count === 4) return 'Rectangle';
      if (count < 6) return 'Simple';
      if (count < 10) return 'Complex';
      return 'Very Complex';
    },
  },
  mounted() {
    this.initializeMap();
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    initializeMap() {
      // Initialize map (placeholder - would use Leaflet or similar)
      // For now, just show a placeholder
      const mapElement = document.getElementById('unit-map');
      if (mapElement) {
        mapElement.innerHTML = `
          <div class="map-placeholder">
            <v-icon size="48" color="grey lighten-2">mdi-map</v-icon>
            <p class="grey--text mt-2">Map visualization would appear here</p>
            <p class="caption grey--text">Showing polygon for ${this.unit.unitName}</p>
          </div>
        `;
      }
    },

    formatCoordinates(coordinates) {
      if (!coordinates) return '';

      return coordinates
        .split(';')
        .map((coord, index) => `${index + 1}. ${coord}`)
        .join('\n');
    },

    formatDate(date) {
      if (!date) return 'Never';
      return new Date(date).toLocaleDateString();
    },

    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.showSuccess('Copied to clipboard');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        this.showError('Failed to copy to clipboard');
      }
    },

    downloadGeoJSON() {
      try {
        // Create GeoJSON from unit data
        const geoJSON = {
          type: 'Feature',
          properties: {
            name: this.unit.unitName,
            area: this.unit.areaHectares,
            region: this.unit.administrativeRegion,
            verified: this.unit.isHederaVerified,
            lastVerified: this.unit.lastVerifiedAt,
          },
          geometry: {
            type: 'Polygon',
            coordinates: this.parseCoordinatesToGeoJSON(),
          },
        };

        // Create download link
        const dataStr = JSON.stringify(geoJSON, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.unit.unitName.replace(/\s+/g, '_')}_polygon.geojson`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showSuccess('GeoJSON downloaded successfully');
      } catch (error) {
        console.error('Failed to download GeoJSON:', error);
        this.showError('Failed to download GeoJSON');
      }
    },

    parseCoordinatesToGeoJSON() {
      if (!this.unit.wgs84Coordinates) return [];

      try {
        const coordinates = this.unit.wgs84Coordinates
          .split(';')
          .map((coord) => {
            const [lat, lng] = coord.split(',').map(Number);
            return [lng, lat]; // GeoJSON uses [lng, lat] format
          });

        // Ensure polygon is closed
        if (coordinates.length > 0) {
          const first = coordinates[0];
          const last = coordinates[coordinates.length - 1];
          if (first[0] !== last[0] || first[1] !== last[1]) {
            coordinates.push(first);
          }
        }

        return [coordinates]; // Polygon coordinates are nested array
      } catch (error) {
        console.error('Failed to parse coordinates:', error);
        return [];
      }
    },

    showSuccess(message) {
      this.message = message;
      this.messageType = 'success';
      this.showMessage = true;
    },

    showError(message) {
      this.message = message;
      this.messageType = 'error';
      this.showMessage = true;
    },
  },
};
</script>

<style scoped>
.production-unit-viewer {
  max-height: 90vh;
}

.map-container {
  height: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.unit-map {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px;
}

.v-simple-table td {
  padding: 8px 16px !important;
}

.font-weight-medium {
  font-weight: 500 !important;
}
</style>"
