<template>
  <Default>
    <div class="compliance-dashboard-page">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="mdi mdi-shield-check"></i>
            EUDR Compliance Dashboard
          </h1>
          <p class="page-subtitle">
            Monitor your EU Deforestation Regulation compliance status and requirements
          </p>
        </div>
        <div class="header-actions">
          <v-chip
            :color="getComplianceStatusColor(overallCompliance.status)"
            :text-color="getComplianceStatusTextColor(overallCompliance.status)"
            large
            class="compliance-chip"
          >
            <v-icon left small>{{ getComplianceStatusIcon(overallCompliance.status) }}</v-icon>
            {{ overallCompliance.status }}
          </v-chip>
          <v-btn
            color="primary"
            @click="generateComplianceReport"
            :loading="generatingReport"
            class="report-btn"
          >
            <v-icon left>mdi-file-document</v-icon>
            Generate Report
          </v-btn>
        </div>
      </div>

      <!-- Compliance Overview Cards -->
      <div class="compliance-overview-grid">
        <v-card class="overview-card production-units" elevation="2">
          <v-card-text>
            <div class="card-content">
              <div class="card-icon">
                <v-icon large color="success">mdi-map-marker-radius</v-icon>
              </div>
              <div class="card-info">
                <h3 class="card-number">{{ complianceStats.productionUnits.total }}</h3>
                <p class="card-label">Production Units</p>
                <div class="card-progress">
                  <v-progress-linear
                    :value="complianceStats.productionUnits.compliantPercentage"
                    color="success"
                    height="6"
                    rounded
                  ></v-progress-linear>
                  <span class="progress-text">
                    {{ complianceStats.productionUnits.compliantPercentage }}% Compliant
                  </span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="overview-card batches" elevation="2">
          <v-card-text>
            <div class="card-content">
              <div class="card-icon">
                <v-icon large color="primary">mdi-package-variant</v-icon>
              </div>
              <div class="card-info">
                <h3 class="card-number">{{ complianceStats.batches.total }}</h3>
                <p class="card-label">EUDR Batches</p>
                <div class="card-progress">
                  <v-progress-linear
                    :value="complianceStats.batches.compliantPercentage"
                    color="primary"
                    height="6"
                    rounded
                  ></v-progress-linear>
                  <span class="progress-text">
                    {{ complianceStats.batches.compliantPercentage }}% Compliant
                  </span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="overview-card documents" elevation="2">
          <v-card-text>
            <div class="card-content">
              <div class="card-icon">
                <v-icon large color="info">mdi-file-document-check</v-icon>
              </div>
              <div class="card-info">
                <h3 class="card-number">{{ complianceStats.documents.total }}</h3>
                <p class="card-label">Documents</p>
                <div class="card-progress">
                  <v-progress-linear
                    :value="complianceStats.documents.verifiedPercentage"
                    color="info"
                    height="6"
                    rounded
                  ></v-progress-linear>
                  <span class="progress-text">
                    {{ complianceStats.documents.verifiedPercentage }}% Verified
                  </span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="overview-card alerts" elevation="2">
          <v-card-text>
            <div class="card-content">
              <div class="card-icon">
                <v-icon large color="warning">mdi-alert-circle</v-icon>
              </div>
              <div class="card-info">
                <h3 class="card-number">{{ complianceStats.alerts.active }}</h3>
                <p class="card-label">Active Alerts</p>
                <div class="alert-breakdown">
                  <span class="alert-high">{{ complianceStats.alerts.high }} High</span>
                  <span class="alert-medium">{{ complianceStats.alerts.medium }} Medium</span>
                  <span class="alert-low">{{ complianceStats.alerts.low }} Low</span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Compliance Requirements Checklist -->
      <v-card class="requirements-card" elevation="2">
        <v-card-title>
          <v-icon left color="primary">mdi-clipboard-check</v-icon>
          EUDR Compliance Requirements
        </v-card-title>
        <v-card-text>
          <div class="requirements-grid">
            <div
              v-for="requirement in complianceRequirements"
              :key="requirement.id"
              class="requirement-item"
              :class="{ 'completed': requirement.completed }"
            >
              <div class="requirement-status">
                <v-icon
                  :color="requirement.completed ? 'success' : 'grey'"
                  size="20"
                >
                  {{ requirement.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                </v-icon>
              </div>
              <div class="requirement-content">
                <h4 class="requirement-title">{{ requirement.title }}</h4>
                <p class="requirement-description">{{ requirement.description }}</p>
                <div class="requirement-actions" v-if="!requirement.completed">
                  <v-btn
                    small
                    color="primary"
                    text
                    @click="handleRequirementAction(requirement)"
                  >
                    {{ requirement.actionText }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Recent Activity Timeline -->
      <v-card class="activity-card" elevation="2">
        <v-card-title>
          <v-icon left color="primary">mdi-timeline</v-icon>
          Recent Compliance Activity
        </v-card-title>
        <v-card-text>
          <v-timeline dense>
            <v-timeline-item
              v-for="activity in recentActivity"
              :key="activity.id"
              :color="getActivityColor(activity.type)"
              small
            >
              <template v-slot:icon>
                <v-icon small>{{ getActivityIcon(activity.type) }}</v-icon>
              </template>
              <div class="activity-content">
                <h4 class="activity-title">{{ activity.title }}</h4>
                <p class="activity-description">{{ activity.description }}</p>
                <span class="activity-time">{{ formatDateTime(activity.timestamp) }}</span>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>

      <!-- Blockchain Verification Status -->
      <v-card class="blockchain-card" elevation="2">
        <v-card-title>
          <v-icon left color="purple">mdi-cube-outline</v-icon>
          Hedera Blockchain Verification
        </v-card-title>
        <v-card-text>
          <div class="blockchain-stats">
            <div class="blockchain-stat">
              <v-icon large color="success">mdi-shield-check</v-icon>
              <div class="stat-info">
                <h3>{{ blockchainStats.verifiedRecords }}</h3>
                <p>Verified Records</p>
              </div>
            </div>
            <div class="blockchain-stat">
              <v-icon large color="info">mdi-clock-outline</v-icon>
              <div class="stat-info">
                <h3>{{ blockchainStats.pendingVerification }}</h3>
                <p>Pending Verification</p>
              </div>
            </div>
            <div class="blockchain-stat">
              <v-icon large color="primary">mdi-link</v-icon>
              <div class="stat-info">
                <h3>{{ blockchainStats.totalTransactions }}</h3>
                <p>Total Transactions</p>
              </div>
            </div>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="wallet-connection">
            <div v-if="walletConnected" class="wallet-connected">
              <v-icon color="success" left>mdi-wallet</v-icon>
              <span>Wallet Connected: {{ formatAddress(walletAccount) }}</span>
              <v-btn small text color="error" @click="disconnectWallet">
                Disconnect
              </v-btn>
            </div>
            <div v-else class="wallet-disconnected">
              <v-btn
                color="primary"
                @click="connectWallet"
                :loading="connectingWallet"
              >
                <v-icon left>mdi-wallet</v-icon>
                Connect Hedera Wallet
              </v-btn>
              <p class="wallet-help">
                Connect your Hedera wallet to verify compliance records on the blockchain
              </p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Loading Overlay -->
      <v-overlay :value="loading" z-index="1000">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
        <p class="mt-4 text-center">Loading compliance data...</p>
      </v-overlay>
    </div>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import { getCurrentUserId } from '@/utils/roles.js';
import { hederaWalletService } from '@/services/hederaWalletService.js';

export default {
  name: 'ComplianceDashboardView',
  components: {
    Default,
  },
  data() {
    return {
      loading: false,
      generatingReport: false,
      connectingWallet: false,
      walletConnected: false,
      walletAccount: null,
      overallCompliance: {
        status: 'PARTIAL_COMPLIANCE',
        percentage: 75,
      },
      complianceStats: {
        productionUnits: {
          total: 5,
          compliant: 4,
          compliantPercentage: 80,
        },
        batches: {
          total: 12,
          compliant: 9,
          compliantPercentage: 75,
        },
        documents: {
          total: 28,
          verified: 25,
          verifiedPercentage: 89,
        },
        alerts: {
          active: 3,
          high: 1,
          medium: 1,
          low: 1,
        },
      },
      complianceRequirements: [
        {
          id: 1,
          title: 'Production Unit Mapping',
          description: 'Map all production units with precise polygon coordinates',
          completed: true,
          actionText: 'Map Units',
        },
        {
          id: 2,
          title: 'Deforestation Risk Assessment',
          description: 'Complete risk assessment for all production areas',
          completed: true,
          actionText: 'Assess Risk',
        },
        {
          id: 3,
          title: 'Supply Chain Documentation',
          description: 'Upload all required supply chain documents',
          completed: false,
          actionText: 'Upload Documents',
        },
        {
          id: 4,
          title: 'Due Diligence Statement',
          description: 'Generate and submit due diligence statement',
          completed: false,
          actionText: 'Generate Statement',
        },
        {
          id: 5,
          title: 'Third-Party Verification',
          description: 'Complete third-party verification process',
          completed: false,
          actionText: 'Request Verification',
        },
        {
          id: 6,
          title: 'Blockchain Verification',
          description: 'Verify all records on Hedera blockchain',
          completed: true,
          actionText: 'Verify Records',
        },
      ],
      recentActivity: [
        {
          id: 1,
          type: 'document_uploaded',
          title: 'Document Uploaded',
          description: 'Land ownership certificate uploaded for Production Unit A',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: 2,
          type: 'alert_resolved',
          title: 'Alert Resolved',
          description: 'Medium severity deforestation alert marked as resolved',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        },
        {
          id: 3,
          type: 'batch_created',
          title: 'Batch Created',
          description: 'New EUDR batch created for coffee harvest',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
          id: 4,
          type: 'verification_completed',
          title: 'Blockchain Verification',
          description: 'Production unit coordinates verified on Hedera',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
      ],
      blockchainStats: {
        verifiedRecords: 45,
        pendingVerification: 3,
        totalTransactions: 48,
      },
    };
  },
  computed: {
    currentFarmerId() {
      return getCurrentUserId() || this.$route.params.farmerId;
    },
  },
  async mounted() {
    await this.loadComplianceData();
    this.checkWalletConnection();
  },
  methods: {
    async loadComplianceData() {
      this.loading = true;
      try {
        // Load compliance data from API
        // This would be implemented with actual API calls
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      } catch (error) {
        console.error('Failed to load compliance data:', error);
        this.$toast.error('Failed to load compliance data');
      } finally {
        this.loading = false;
      }
    },

    async generateComplianceReport() {
      this.generatingReport = true;
      try {
        // Generate compliance report
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate report generation
        this.$toast.success('Compliance report generated successfully');
      } catch (error) {
        console.error('Failed to generate report:', error);
        this.$toast.error('Failed to generate compliance report');
      } finally {
        this.generatingReport = false;
      }
    },

    async connectWallet() {
      this.connectingWallet = true;
      try {
        const result = await hederaWalletService.connectWallet();
        this.walletConnected = result.isConnected;
        this.walletAccount = result.account;
        this.$toast.success('Wallet connected successfully');
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        this.$toast.error('Failed to connect wallet');
      } finally {
        this.connectingWallet = false;
      }
    },

    async disconnectWallet() {
      try {
        await hederaWalletService.disconnectWallet();
        this.walletConnected = false;
        this.walletAccount = null;
        this.$toast.success('Wallet disconnected');
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    },

    checkWalletConnection() {
      const status = hederaWalletService.getWalletStatus();
      this.walletConnected = status.isConnected;
      this.walletAccount = status.account;
    },

    handleRequirementAction(requirement) {
      // Handle requirement action based on type
      switch (requirement.id) {
        case 3:
          this.$router.push({ name: 'DocumentManagement' });
          break;
        case 4:
          this.$router.push({ name: 'DueDiligenceStatement' });
          break;
        case 5:
          this.$router.push({ name: 'ThirdPartyVerification' });
          break;
        default:
          this.$toast.info('Feature coming soon');
      }
    },

    getComplianceStatusColor(status) {
      switch (status) {
        case 'FULLY_COMPLIANT':
          return 'success';
        case 'PARTIAL_COMPLIANCE':
          return 'warning';
        case 'NON_COMPLIANT':
          return 'error';
        default:
          return 'grey';
      }
    },

    getComplianceStatusTextColor(status) {
      switch (status) {
        case 'FULLY_COMPLIANT':
          return 'white';
        case 'PARTIAL_COMPLIANCE':
          return 'black';
        case 'NON_COMPLIANT':
          return 'white';
        default:
          return 'white';
      }
    },

    getComplianceStatusIcon(status) {
      switch (status) {
        case 'FULLY_COMPLIANT':
          return 'mdi-check-circle';
        case 'PARTIAL_COMPLIANCE':
          return 'mdi-alert-circle';
        case 'NON_COMPLIANT':
          return 'mdi-close-circle';
        default:
          return 'mdi-help-circle';
      }
    },

    getActivityColor(type) {
      switch (type) {
        case 'document_uploaded':
          return 'info';
        case 'alert_resolved':
          return 'success';
        case 'batch_created':
          return 'primary';
        case 'verification_completed':
          return 'purple';
        default:
          return 'grey';
      }
    },

    getActivityIcon(type) {
      switch (type) {
        case 'document_uploaded':
          return 'mdi-file-upload';
        case 'alert_resolved':
          return 'mdi-check-circle';
        case 'batch_created':
          return 'mdi-package-variant';
        case 'verification_completed':
          return 'mdi-shield-check';
        default:
          return 'mdi-information';
      }
    },

    formatDateTime(date) {
      return new Date(date).toLocaleString();
    },

    formatAddress(address) {
      if (!address) return '';
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },
  },
  meta() {
    return {
      title: 'EUDR Compliance Dashboard',
    };
  },
};
</script>

<style scoped>
.compliance-dashboard-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 12px;
  border-left: 4px solid #dc2626;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title i {
  color: #dc2626;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.compliance-chip {
  font-weight: 600;
}

.report-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
}

.compliance-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.overview-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  flex-shrink: 0;
}

.card-info {
  flex: 1;
}

.card-number {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.card-label {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 12px 0;
}

.card-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-text {
  font-size: 0.8rem;
  color: #6b7280;
}

.alert-breakdown {
  display: flex;
  gap: 8px;
  font-size: 0.8rem;
}

.alert-high {
  color: #dc2626;
  font-weight: 600;
}

.alert-medium {
  color: #ea580c;
  font-weight: 600;
}

.alert-low {
  color: #eab308;
  font-weight: 600;
}

.requirements-card,
.activity-card,
.blockchain-card {
  margin-bottom: 30px;
  border-radius: 12px;
}

.requirements-grid {
  display: grid;
  gap: 16px;
}

.requirement-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.requirement-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.requirement-item.completed {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
}

.requirement-status {
  flex-shrink: 0;
  padding-top: 2px;
}

.requirement-content {
  flex: 1;
}

.requirement-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.requirement-description {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.requirement-actions {
  margin-top: 8px;
}

.activity-content {
  padding-left: 8px;
}

.activity-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.activity-description {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.blockchain-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.blockchain-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.stat-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.stat-info p {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

.wallet-connection {
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.wallet-connected {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.wallet-disconnected {
  text-align: center;
}

.wallet-help {
  font-size: 0.9rem;
  color: #64748b;
  margin: 8px 0 0 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: stretch;
  }

  .compliance-overview-grid {
    grid-template-columns: 1fr;
  }

  .blockchain-stats {
    grid-template-columns: 1fr;
  }
}
</style>"
