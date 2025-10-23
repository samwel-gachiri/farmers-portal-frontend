<template>
  <div class="farmer-eudr-status">
    <v-container fluid>
      <!-- Header Section -->
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-icon large color="success" class="mr-3">mdi-shield-check</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold">My EUDR Compliance Status</h1>
              <p class="text-subtitle-1 text--secondary mb-0">
                Track your compliance with EU Deforestation Regulation
              </p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Compliance Score Card -->
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="compliance-score-card" elevation="3">
            <v-card-text class="text-center">
              <div class="compliance-score-circle">
                <v-progress-circular
                  :value="complianceScore"
                  :color="getScoreColor(complianceScore)"
                  size="120"
                  width="12"
                  class="mb-3"
                >
                  <span class="text-h3 font-weight-bold">{{ complianceScore }}%</span>
                </v-progress-circular>
              </div>
              <h3 class="text-h6 font-weight-bold mb-2">Compliance Score</h3>
              <v-chip
                :color="getScoreColor(complianceScore)"
                text-color="white"
                small
              >
                {{ getComplianceStatus(complianceScore) }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Quick Stats -->
        <v-col cols="12" md="8">
          <v-row>
            <v-col cols="6" sm="3">
              <v-card class="stat-card" elevation="2">
                <v-card-text class="text-center">
                  <v-icon large color="green">mdi-map-marker-check</v-icon>
                  <div class="text-h4 font-weight-bold mt-2">{{ stats.verifiedUnits }}</div>
                  <div class="text-caption">Verified Units</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card class="stat-card" elevation="2">
                <v-card-text class="text-center">
                  <v-icon large color="blue">mdi-file-check</v-icon>
                  <div class="text-h4 font-weight-bold mt-2">{{ stats.approvedDocuments }}</div>
                  <div class="text-caption">Approved Docs</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card class="stat-card" elevation="2">
                <v-card-text class="text-center">
                  <v-icon large color="orange">mdi-alert-circle</v-icon>
                  <div class="text-h4 font-weight-bold mt-2">{{ stats.pendingActions }}</div>
                  <div class="text-caption">Pending Actions</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card class="stat-card" elevation="2">
                <v-card-text class="text-center">
                  <v-icon large color="purple">mdi-package-variant</v-icon>
                  <div class="text-h4 font-weight-bold mt-2">{{ stats.activeBatches }}</div>
                  <div class="text-caption">Active Batches</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Action Items -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon color="warning" class="mr-2">mdi-clipboard-list</v-icon>
              Required Actions
            </v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item
                  v-for="action in requiredActions"
                  :key="action.id"
                  @click="handleAction(action)"
                  class="action-item"
                >
                  <v-list-item-icon>
                    <v-icon :color="action.priority === 'high' ? 'error' : 'warning'">
                      {{ action.icon }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ action.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ action.description }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-chip
                      :color="action.priority === 'high' ? 'error' : 'warning'"
                      text-color="white"
                      x-small
                    >
                      {{ action.priority.toUpperCase() }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-btn
                v-if="requiredActions.length === 0"
                color="success"
                text
                block
                disabled
              >
                <v-icon left>mdi-check-circle</v-icon>
                All actions completed!
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Recent Activity -->
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon color="info" class="mr-2">mdi-timeline</v-icon>
              Recent Activity
            </v-card-title>
            <v-card-text>
              <v-timeline dense>
                <v-timeline-item
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  :color="activity.color"
                  small
                >
                  <div class="d-flex justify-space-between">
                    <div>
                      <strong>{{ activity.title }}</strong>
                      <div class="text-caption">{{ activity.description }}</div>
                    </div>
                    <small class="text--secondary">{{ formatDate(activity.date) }}</small>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Compliance Breakdown -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title>Compliance Breakdown</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="3" v-for="category in complianceCategories" :key="category.name">
                  <div class="compliance-category">
                    <div class="d-flex align-center mb-2">
                      <v-icon :color="category.color" class="mr-2">{{ category.icon }}</v-icon>
                      <span class="font-weight-medium">{{ category.name }}</span>
                    </div>
                    <v-progress-linear
                      :value="category.score"
                      :color="category.color"
                      height="8"
                      rounded
                      class="mb-1"
                    ></v-progress-linear>
                    <div class="text-caption text--secondary">
                      {{ category.score }}% - {{ category.status }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'FarmerEudrStatus',

  data() {
    return {
      complianceScore: 78,
      stats: {
        verifiedUnits: 3,
        approvedDocuments: 12,
        pendingActions: 2,
        activeBatches: 5,
      },
      requiredActions: [
        {
          id: 1,
          title: 'Upload Land Ownership Certificate',
          description: 'Required for Production Unit #2',
          priority: 'high',
          icon: 'mdi-file-upload',
          route: 'FarmerDocuments',
        },
        {
          id: 2,
          title: 'Update GPS Coordinates',
          description: 'Coordinates needed for Unit #3',
          priority: 'medium',
          icon: 'mdi-map-marker',
          route: 'FarmerProductionUnits',
        },
      ],
      recentActivity: [
        {
          id: 1,
          title: 'Document Approved',
          description: 'Farming License verified by exporter',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          color: 'success',
        },
        {
          id: 2,
          title: 'Batch Created',
          description: 'Coffee Batch #CB-2024-001 created',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          color: 'info',
        },
        {
          id: 3,
          title: 'Deforestation Alert',
          description: 'Alert resolved for Production Unit #1',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          color: 'warning',
        },
      ],
      complianceCategories: [
        {
          name: 'Documentation',
          score: 85,
          color: 'blue',
          icon: 'mdi-file-document',
          status: 'Good',
        },
        {
          name: 'Land Verification',
          score: 75,
          color: 'green',
          icon: 'mdi-map-check',
          status: 'Needs Improvement',
        },
        {
          name: 'Deforestation Risk',
          score: 90,
          color: 'orange',
          icon: 'mdi-tree',
          status: 'Excellent',
        },
        {
          name: 'Batch Tracking',
          score: 65,
          color: 'purple',
          icon: 'mdi-package',
          status: 'Needs Attention',
        },
      ],
    };
  },

  methods: {
    getScoreColor(score) {
      if (score >= 80) return 'success';
      if (score >= 60) return 'warning';
      return 'error';
    },

    getComplianceStatus(score) {
      if (score >= 80) return 'Compliant';
      if (score >= 60) return 'Needs Improvement';
      return 'Non-Compliant';
    },

    handleAction(action) {
      this.$router.push({ name: action.route });
    },

    formatDate(date) {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
        .format(Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)), 'day');
    },
  },
};
</script>

<style scoped>
.farmer-eudr-status {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.compliance-score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.compliance-score-card .v-card__text {
  padding: 30px;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.action-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.compliance-category {
  padding: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}
</style>
