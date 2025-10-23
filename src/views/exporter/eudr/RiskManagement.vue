<template>
  <div class="risk-management">
    <v-container fluid>
      <!-- Header -->
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <v-icon large color="orange" class="mr-3">mdi-alert-octagon</v-icon>
              <div>
                <h1 class="text-h4 font-weight-bold">Risk Management</h1>
                <p class="text-subtitle-1 text--secondary mb-0">
                  Assess and mitigate supply chain risks for EUDR compliance
                </p>
              </div>
            </div>
            <v-btn
              color="primary"
              @click="runRiskAssessment"
              elevation="2"
              :loading="assessmentRunning"
            >
              <v-icon left>mdi-refresh</v-icon>
              Run Assessment
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Risk Overview -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card class="risk-card high-risk" elevation="4">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-alert-circle</v-icon>
              <div class="text-h3 font-weight-bold mt-2">{{ highRiskCount }}</div>
              <div class="text-subtitle-2">High Risk</div>
              <div class="text-caption">Immediate attention required</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="risk-card medium-risk" elevation="4">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-alert</v-icon>
              <div class="text-h3 font-weight-bold mt-2">{{ mediumRiskCount }}</div>
              <div class="text-subtitle-2">Medium Risk</div>
              <div class="text-caption">Monitor closely</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="risk-card low-risk" elevation="4">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-information</v-icon>
              <div class="text-h3 font-weight-bold mt-2">{{ lowRiskCount }}</div>
              <div class="text-subtitle-2">Low Risk</div>
              <div class="text-caption">Standard monitoring</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="risk-card no-risk" elevation="4">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-check-circle</v-icon>
              <div class="text-h3 font-weight-bold mt-2">{{ noRiskCount }}</div>
              <div class="text-subtitle-2">No Risk</div>
              <div class="text-caption">Compliant suppliers</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Risk Factors Analysis -->
      <v-row class="mb-4">
        <v-col cols="12" md="8">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-chart-pie</v-icon>
              Risk Factor Analysis
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="text-subtitle-2 mb-2">Country Risk Distribution</div>
                  <div class="risk-factor-item">
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span>High Risk Countries</span>
                      <span class="font-weight-bold">{{ countryRisk.high }}%</span>
                    </div>
                    <v-progress-linear
                      :value="countryRisk.high"
                      color="error"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </div>
                  <div class="risk-factor-item">
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span>Medium Risk Countries</span>
                      <span class="font-weight-bold">{{ countryRisk.medium }}%</span>
                    </div>
                    <v-progress-linear
                      :value="countryRisk.medium"
                      color="warning"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </div>
                  <div class="risk-factor-item">
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span>Low Risk Countries</span>
                      <span class="font-weight-bold">{{ countryRisk.low }}%</span>
                    </div>
                    <v-progress-linear
                      :value="countryRisk.low"
                      color="success"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-subtitle-2 mb-2">Deforestation Alerts</div>
                  <div class="risk-factor-item">
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span>Active Alerts</span>
                      <span class="font-weight-bold">{{ deforestationAlerts.active }}</span>
                    </div>
                    <v-progress-linear
                      :value="(deforestationAlerts.active / deforestationAlerts.total) * 100"
                      color="error"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </div>
                  <div class="risk-factor-item">
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span>Resolved Alerts</span>
                      <span class="font-weight-bold">{{ deforestationAlerts.resolved }}</span>
                    </div>
                    <v-progress-linear
                      :value="(deforestationAlerts.resolved / deforestationAlerts.total) * 100"
                      color="success"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="warning" class="mr-2">mdi-alert-circle</v-icon>
              Recent Risk Events
            </v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item
                  v-for="event in recentRiskEvents"
                  :key="event.id"
                  @click="viewRiskEvent(event)"
                  class="risk-event-item"
                >
                  <v-list-item-icon>
                    <v-icon :color="getRiskColor(event.severity)">
                      {{ getRiskIcon(event.type) }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ event.title }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ event.supplier }} • {{ formatDate(event.date) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-chip
                      :color="getRiskColor(event.severity)"
                      text-color="white"
                      x-small
                    >
                      {{ event.severity }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Risk Assessment Table -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
              Supplier Risk Assessment
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search suppliers..."
                single-line
                hide-details
                dense
                outlined
                class="search-field"
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="riskAssessments"
              :search="search"
              :loading="loading"
              class="elevation-0"
            >
              <template v-slot:item.supplier="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="32" class="mr-3">
                    <v-icon color="primary">mdi-account</v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ item.supplierName }}</div>
                    <div class="text-caption text--secondary">{{ item.region }}</div>
                  </div>
                </div>
              </template>
              <template v-slot:item.riskLevel="{ item }">
                <v-chip
                  :color="getRiskColor(item.riskLevel)"
                  text-color="white"
                  small
                >
                  {{ item.riskLevel }}
                </v-chip>
              </template>
              <template v-slot:item.riskScore="{ item }">
                <div class="d-flex align-center">
                  <v-progress-circular
                    :value="item.riskScore"
                    :color="getScoreColor(item.riskScore)"
                    size="40"
                    width="4"
                    class="mr-2"
                  >
                    <span class="text-caption">{{ item.riskScore }}</span>
                  </v-progress-circular>
                </div>
              </template>
              <template v-slot:item.lastAssessment="{ item }">
                {{ formatDate(item.lastAssessment) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="viewAssessment(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="warning"
                  @click="createMitigation(item)"
                >
                  <v-icon>mdi-shield-alert</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="info"
                  @click="reassessRisk(item)"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'RiskManagement',
  data() {
    return {
      loading: false,
      assessmentRunning: false,
      search: '',
      headers: [
        { text: 'Supplier', value: 'supplier', sortable: true },
        { text: 'Risk Level', value: 'riskLevel', sortable: true },
        { text: 'Risk Score', value: 'riskScore', sortable: true },
        { text: 'Country Risk', value: 'countryRisk', sortable: true },
        { text: 'Last Assessment', value: 'lastAssessment', sortable: true },
        {
          text: 'Actions', value: 'actions', sortable: false, width: '150px',
        },
      ],
      riskAssessments: [
        {
          id: 1,
          supplierName: 'Green Valley Farm',
          region: 'Central Kenya',
          riskLevel: 'Low',
          riskScore: 25,
          countryRisk: 'Low',
          lastAssessment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: 2,
          supplierName: 'Mountain Coffee Co.',
          region: 'Western Region',
          riskLevel: 'Medium',
          riskScore: 65,
          countryRisk: 'Standard',
          lastAssessment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          id: 3,
          supplierName: 'Sunrise Plantation',
          region: 'Eastern Province',
          riskLevel: 'High',
          riskScore: 85,
          countryRisk: 'High',
          lastAssessment: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
      countryRisk: {
        high: 15,
        medium: 35,
        low: 50,
      },
      deforestationAlerts: {
        active: 3,
        resolved: 12,
        total: 15,
      },
      recentRiskEvents: [
        {
          id: 1,
          title: 'Deforestation Alert Detected',
          supplier: 'Sunrise Plantation',
          type: 'deforestation',
          severity: 'High',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          id: 2,
          title: 'Country Risk Level Updated',
          supplier: 'Mountain Coffee Co.',
          type: 'country',
          severity: 'Medium',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          id: 3,
          title: 'Supplier Documentation Gap',
          supplier: 'Valley Farms Ltd',
          type: 'documentation',
          severity: 'Medium',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ],
    };
  },
  computed: {
    highRiskCount() {
      return this.riskAssessments.filter((r) => r.riskLevel === 'High').length;
    },
    mediumRiskCount() {
      return this.riskAssessments.filter((r) => r.riskLevel === 'Medium').length;
    },
    lowRiskCount() {
      return this.riskAssessments.filter((r) => r.riskLevel === 'Low').length;
    },
    noRiskCount() {
      return this.riskAssessments.filter((r) => r.riskLevel === 'None').length;
    },
  },
  methods: {
    getRiskColor(riskLevel) {
      const colors = {
        High: 'error',
        Medium: 'warning',
        Low: 'info',
        None: 'success',
      };
      return colors[riskLevel] || 'grey';
    },
    getRiskIcon(type) {
      const icons = {
        deforestation: 'mdi-tree-outline',
        country: 'mdi-map',
        documentation: 'mdi-file-alert',
        supplier: 'mdi-account-alert',
      };
      return icons[type] || 'mdi-alert';
    },
    getScoreColor(score) {
      if (score >= 80) return 'error';
      if (score >= 60) return 'warning';
      if (score >= 40) return 'info';
      return 'success';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    async runRiskAssessment() {
      this.assessmentRunning = true;
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.$toast.success('Risk assessment completed successfully');
      } catch (error) {
        this.$toast.error('Failed to run risk assessment');
      } finally {
        this.assessmentRunning = false;
      }
    },
    viewRiskEvent(event) {
      console.log('View risk event:', event);
    },
    viewAssessment(assessment) {
      console.log('View assessment:', assessment);
    },
    createMitigation(assessment) {
      console.log('Create mitigation for:', assessment);
    },
    reassessRisk(assessment) {
      console.log('Reassess risk for:', assessment);
    },
  },
};
</script>

<style scoped>
.risk-management {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.risk-card {
  transition: transform 0.2s;
  color: white;
}

.risk-card:hover {
  transform: translateY(-2px);
}

.risk-card.high-risk {
  background: linear-gradient(135deg, #f44336, #c62828);
}

.risk-card.medium-risk {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.risk-card.low-risk {
  background: linear-gradient(135deg, #2196f3, #1565c0);
}

.risk-card.no-risk {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
}

.risk-factor-item {
  margin-bottom: 16px;
}

.risk-event-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.risk-event-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.search-field {
  max-width: 300px;
}
</style>
