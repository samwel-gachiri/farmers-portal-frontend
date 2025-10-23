<template>
  <div class="farmer-monitoring">
    <v-container fluid>
      <!-- Header -->
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-icon large color="orange" class="mr-3">mdi-satellite-variant</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold">My Farm Monitoring</h1>
              <p class="text-subtitle-1 text--secondary mb-0">
                Satellite monitoring and deforestation alerts for your farms
              </p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Monitoring Summary -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card safe" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-shield-check</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ safeAreas }}</div>
              <div class="text-subtitle-2">Safe Areas</div>
              <div class="text-caption">No deforestation detected</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card warning" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-alert-circle</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ activeAlerts }}</div>
              <div class="text-subtitle-2">Active Alerts</div>
              <div class="text-caption">Require attention</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card resolved" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-check-circle</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ resolvedAlerts }}</div>
              <div class="text-subtitle-2">Resolved Alerts</div>
              <div class="text-caption">Successfully addressed</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card monitored" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-map-marker-radius</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ monitoredArea }}</div>
              <div class="text-subtitle-2">Monitored Area</div>
              <div class="text-caption">Hectares under surveillance</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Map and Alerts -->
      <v-row class="mb-4">
        <v-col cols="12" md="8">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-map</v-icon>
              Farm Monitoring Map
              <v-spacer></v-spacer>
              <v-btn-toggle v-model="mapView" mandatory dense>
                <v-btn small value="satellite">
                  <v-icon small>mdi-satellite-variant</v-icon>
                  Satellite
                </v-btn>
                <v-btn small value="alerts">
                  <v-icon small>mdi-alert</v-icon>
                  Alerts
                </v-btn>
                <v-btn small value="boundaries">
                  <v-icon small>mdi-vector-polygon</v-icon>
                  Boundaries
                </v-btn>
              </v-btn-toggle>
            </v-card-title>
            <v-card-text>
              <div class="map-container">
                <div class="map-placeholder">
                  <v-icon size="64" color="grey lighten-2">mdi-map</v-icon>
                  <div class="text-h6 grey--text mt-2">Interactive Farm Map</div>
                  <div class="text-caption grey--text">
                    {{ mapView === 'satellite' ? 'Satellite imagery with deforestation overlay' :
                       mapView === 'alerts' ? 'Deforestation alerts and risk zones' :
                       'Farm boundaries and production units' }}
                  </div>
                  <v-chip-group class="mt-3">
                    <v-chip small color="success" text-color="white">
                      <v-icon small left>mdi-circle</v-icon>
                      Safe Areas
                    </v-chip>
                    <v-chip small color="warning" text-color="white">
                      <v-icon small left>mdi-circle</v-icon>
                      Risk Areas
                    </v-chip>
                    <v-chip small color="error" text-color="white">
                      <v-icon small left>mdi-circle</v-icon>
                      Alert Areas
                    </v-chip>
                  </v-chip-group>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="warning" class="mr-2">mdi-alert-octagon</v-icon>
              Recent Alerts
            </v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item
                  v-for="alert in recentAlerts"
                  :key="alert.id"
                  @click="viewAlert(alert)"
                  class="alert-item"
                >
                  <v-list-item-icon>
                    <v-icon :color="getSeverityColor(alert.severity)">
                      {{ getSeverityIcon(alert.severity) }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ alert.title }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ alert.location }} • {{ formatDate(alert.date) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-chip
                      :color="getSeverityColor(alert.severity)"
                      text-color="white"
                      x-small
                    >
                      {{ alert.severity }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-btn
                v-if="recentAlerts.length === 0"
                color="success"
                text
                block
                disabled
              >
                <v-icon left>mdi-check-circle</v-icon>
                No active alerts
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Production Units Monitoring -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
              Production Units Monitoring Status
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="productionUnits"
              :loading="loading"
              class="elevation-0"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  text-color="white"
                  small
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.riskLevel="{ item }">
                <div class="d-flex align-center">
                  <v-icon
                    :color="getRiskColor(item.riskLevel)"
                    small
                    class="mr-2"
                  >
                    {{ getRiskIcon(item.riskLevel) }}
                  </v-icon>
                  {{ item.riskLevel }}
                </div>
              </template>

              <template v-slot:item.lastScan="{ item }">
                {{ formatDate(item.lastScan) }}
              </template>

              <template v-slot:item.alerts="{ item }">
                <v-chip
                  :color="item.alerts > 0 ? 'error' : 'success'"
                  text-color="white"
                  small
                >
                  {{ item.alerts }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="viewUnitDetails(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="info"
                  @click="viewOnMap(item)"
                >
                  <v-icon>mdi-map</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.alerts > 0"
                  icon
                  small
                  color="warning"
                  @click="viewAlerts(item)"
                >
                  <v-icon>mdi-alert</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Alert Details Dialog -->
    <v-dialog v-model="showAlertDialog" max-width="600px">
      <v-card v-if="selectedAlert">
        <v-card-title class="d-flex align-center">
          <v-icon :color="getSeverityColor(selectedAlert.severity)" class="mr-2">
            {{ getSeverityIcon(selectedAlert.severity) }}
          </v-icon>
          {{ selectedAlert.title }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="detail-item">
                <strong>Location:</strong> {{ selectedAlert.location }}
              </div>
              <div class="detail-item">
                <strong>Date:</strong> {{ formatDate(selectedAlert.date) }}
              </div>
              <div class="detail-item">
                <strong>Severity:</strong>
                <v-chip
                  :color="getSeverityColor(selectedAlert.severity)"
                  text-color="white"
                  small
                  class="ml-2"
                >
                  {{ selectedAlert.severity }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="detail-item">
                <strong>Confidence:</strong> {{ selectedAlert.confidence }}%
              </div>
              <div class="detail-item">
                <strong>Area Affected:</strong> {{ selectedAlert.areaAffected }} ha
              </div>
              <div class="detail-item">
                <strong>Source:</strong> {{ selectedAlert.source }}
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <div class="detail-item">
            <strong>Description:</strong>
            <p class="mt-2">{{ selectedAlert.description }}</p>
          </div>
          <div class="detail-item" v-if="selectedAlert.recommendedActions">
            <strong>Recommended Actions:</strong>
            <ul class="mt-2">
              <li v-for="action in selectedAlert.recommendedActions" :key="action">
                {{ action }}
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showAlertDialog = false">Close</v-btn>
          <v-btn
            color="primary"
            @click="respondToAlert"
            :loading="responding"
          >
            Respond to Alert
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'FarmerMonitoring',

  data() {
    return {
      loading: false,
      mapView: 'satellite',
      showAlertDialog: false,
      selectedAlert: null,
      responding: false,

      safeAreas: 3,
      activeAlerts: 2,
      resolvedAlerts: 5,
      monitoredArea: 16.5,

      headers: [
        { text: 'Unit Name', value: 'name', sortable: true },
        { text: 'Area (ha)', value: 'area', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
        { text: 'Risk Level', value: 'riskLevel', sortable: true },
        { text: 'Last Scan', value: 'lastScan', sortable: true },
        { text: 'Alerts', value: 'alerts', sortable: true },
        {
          text: 'Actions', value: 'actions', sortable: false, width: '150px',
        },
      ],

      productionUnits: [
        {
          id: 1,
          name: 'North Field Coffee',
          area: 5.2,
          status: 'Monitored',
          riskLevel: 'Low',
          lastScan: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          alerts: 0,
        },
        {
          id: 2,
          name: 'South Valley Cocoa',
          area: 3.8,
          status: 'Alert',
          riskLevel: 'High',
          lastScan: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          alerts: 2,
        },
        {
          id: 3,
          name: 'East Hill Plantation',
          area: 7.5,
          status: 'Monitored',
          riskLevel: 'Medium',
          lastScan: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          alerts: 0,
        },
      ],

      recentAlerts: [
        {
          id: 1,
          title: 'Deforestation Detected',
          location: 'South Valley Cocoa - Sector B',
          severity: 'High',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          confidence: 85,
          areaAffected: 0.3,
          source: 'Sentinel-2 Satellite',
          description: 'Satellite imagery analysis detected potential deforestation activity in the southern section of your cocoa plantation. The affected area shows significant vegetation loss compared to previous scans.',
          recommendedActions: [
            'Conduct immediate field inspection',
            'Document current land use in the affected area',
            'Provide explanation for vegetation changes',
            'Submit corrective action plan if needed',
          ],
        },
        {
          id: 2,
          title: 'Vegetation Change Alert',
          location: 'South Valley Cocoa - Sector A',
          severity: 'Medium',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          confidence: 72,
          areaAffected: 0.1,
          source: 'Landsat-8',
          description: 'Moderate vegetation changes detected. This could be due to seasonal variations or agricultural activities.',
          recommendedActions: [
            'Review recent agricultural activities',
            'Provide documentation of planned land use changes',
          ],
        },
      ],
    };
  },

  methods: {
    getStatusColor(status) {
      const colors = {
        Monitored: 'success',
        Alert: 'error',
        Warning: 'warning',
        Offline: 'grey',
      };
      return colors[status] || 'grey';
    },

    getRiskColor(riskLevel) {
      const colors = {
        Low: 'success',
        Medium: 'warning',
        High: 'error',
      };
      return colors[riskLevel] || 'grey';
    },

    getRiskIcon(riskLevel) {
      const icons = {
        Low: 'mdi-shield-check',
        Medium: 'mdi-shield-alert',
        High: 'mdi-shield-remove',
      };
      return icons[riskLevel] || 'mdi-shield';
    },

    getSeverityColor(severity) {
      const colors = {
        High: 'error',
        Medium: 'warning',
        Low: 'info',
      };
      return colors[severity] || 'grey';
    },

    getSeverityIcon(severity) {
      const icons = {
        High: 'mdi-alert-circle',
        Medium: 'mdi-alert',
        Low: 'mdi-information',
      };
      return icons[severity] || 'mdi-alert';
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    viewAlert(alert) {
      this.selectedAlert = alert;
      this.showAlertDialog = true;
    },

    viewUnitDetails(unit) {
      this.$router.push({
        name: 'FarmerProductionUnits',
        query: { unitId: unit.id },
      });
    },

    viewOnMap(unit) {
      // Focus map on specific unit
      console.log('View unit on map:', unit);
    },

    viewAlerts(unit) {
      // Show alerts for specific unit
      console.log('View alerts for unit:', unit);
    },

    async respondToAlert() {
      this.responding = true;

      try {
        // Simulate API call to respond to alert
        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.showAlertDialog = false;
        this.$toast.success('Alert response submitted successfully!');
      } catch (error) {
        this.$toast.error('Failed to submit alert response');
      } finally {
        this.responding = false;
      }
    },
  },
};
</script>

<style scoped>
.farmer-monitoring {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.summary-card {
  transition: transform 0.2s;
  color: white;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.summary-card.safe {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
}

.summary-card.warning {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.summary-card.resolved {
  background: linear-gradient(135deg, #2196f3, #1565c0);
}

.summary-card.monitored {
  background: linear-gradient(135deg, #9c27b0, #6a1b9a);
}

.map-container {
  height: 400px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.map-placeholder {
  text-align: center;
}

.alert-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.alert-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.detail-item {
  margin-bottom: 12px;
}

.detail-item strong {
  color: #2e7d32;
}
</style>
