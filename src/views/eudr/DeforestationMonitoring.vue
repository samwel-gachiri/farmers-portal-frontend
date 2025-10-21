<template>
  <Default>
    <div class="deforestation-monitoring-page">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="mdi mdi-satellite-variant"></i>
            Deforestation Monitoring
          </h1>
          <p class="page-subtitle">
            Real-time satellite monitoring and deforestation alerts for your production units
          </p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            @click="refreshMonitoring"
            :loading="refreshing"
            class="refresh-btn"
          >
            <v-icon left>mdi-refresh</v-icon>
            Refresh Data
          </v-btn>
          <v-btn
            color="secondary"
            @click="showSettings = true"
            outlined
            class="settings-btn"
          >
            <v-icon left>mdi-cog</v-icon>
            Settings
          </v-btn>
        </div>
      </div>

      <!-- Alert Status Cards -->
      <div class="alert-status-grid">
        <v-card class="status-card high-severity" elevation="2">
          <v-card-text>
            <div class="status-content">
              <div class="status-icon">
                <v-icon large color="error">mdi-alert-circle</v-icon>
              </div>
              <div class="status-info">
                <h3 class="status-number">{{ alertSummary.highSeverityAlerts }}</h3>
                <p class="status-label">High Severity Alerts</p>
                <span class="status-trend" :class="getTrendClass('high')">
                  <v-icon small>{{ getTrendIcon('high') }}</v-icon>
                  {{ getTrendText('high') }}
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="status-card medium-severity" elevation="2">
          <v-card-text>
            <div class="status-content">
              <div class="status-icon">
                <v-icon large color="warning">mdi-alert</v-icon>
              </div>
              <div class="status-info">
                <h3 class="status-number">{{ alertSummary.mediumSeverityAlerts }}</h3>
                <p class="status-label">Medium Severity Alerts</p>
                <span class="status-trend" :class="getTrendClass('medium')">
                  <v-icon small>{{ getTrendIcon('medium') }}</v-icon>
                  {{ getTrendText('medium') }}
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="status-card low-severity" elevation="2">
          <v-card-text>
            <div class="status-content">
              <div class="status-icon">
                <v-icon large color="info">mdi-information</v-icon>
              </div>
              <div class="status-info">
                <h3 class="status-number">{{ alertSummary.lowSeverityAlerts }}</h3>
                <p class="status-label">Low Severity Alerts</p>
                <span class="status-trend" :class="getTrendClass('low')">
                  <v-icon small>{{ getTrendIcon('low') }}</v-icon>
                  {{ getTrendText('low') }}
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="status-card total-alerts" elevation="2">
          <v-card-text>
            <div class="status-content">
              <div class="status-icon">
                <v-icon large color="primary">mdi-chart-line</v-icon>
              </div>
              <div class="status-info">
                <h3 class="status-number">{{ alertSummary.totalAlerts }}</h3>
                <p class="status-label">Total Alerts (30 days)</p>
                <span class="last-alert" v-if="alertSummary.lastAlertDate">
                  Last: {{ formatDate(alertSummary.lastAlertDate) }}
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Deforestation Monitoring Dashboard Component -->
      <DeforestationMonitoringDashboard
        :farmer-id="currentFarmerId"
        :production-unit-id="selectedProductionUnit"
        @alert-selected="handleAlertSelected"
        @configuration-updated="handleConfigurationUpdated"
      />

      <!-- Settings Dialog -->
      <v-dialog v-model="showSettings" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Monitoring Settings</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="showSettings = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form ref="settingsForm">
              <v-switch
                v-model="settings.monitoringEnabled"
                label="Enable Real-time Monitoring"
                color="primary"
                class="mb-4"
              ></v-switch>

              <v-text-field
                v-model.number="settings.bufferDistanceKm"
                label="Buffer Distance (km)"
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                suffix="km"
                outlined
                class="mb-4"
              ></v-text-field>

              <v-subheader>Alert Thresholds</v-subheader>
              <v-text-field
                v-model.number="settings.alertThresholds.highSeverityDistance"
                label="High Severity Distance (km)"
                type="number"
                step="0.1"
                outlined
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model.number="settings.alertThresholds.mediumSeverityDistance"
                label="Medium Severity Distance (km)"
                type="number"
                step="0.1"
                outlined
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model.number="settings.alertThresholds.minimumConfidence"
                label="Minimum Confidence"
                type="number"
                step="0.01"
                min="0"
                max="1"
                outlined
                class="mb-4"
              ></v-text-field>

              <v-subheader>Notifications</v-subheader>
              <v-switch
                v-model="settings.notificationSettings.enableEmailNotifications"
                label="Email Notifications"
                color="primary"
                class="mb-2"
              ></v-switch>

              <v-switch
                v-model="settings.notificationSettings.highSeverityImmediate"
                label="Immediate High Severity Alerts"
                color="primary"
                class="mb-2"
              ></v-switch>

              <v-switch
                v-model="settings.notificationSettings.dailySummaryEnabled"
                label="Daily Summary Reports"
                color="primary"
              ></v-switch>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="showSettings = false">Cancel</v-btn>
            <v-btn color="primary" @click="saveSettings" :loading="savingSettings">
              Save Settings
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Hedera Wallet Integration -->
      <v-dialog v-model="showWalletDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Connect Hedera Wallet</span>
          </v-card-title>
          <v-card-text>
            <p class="mb-4">
              Connect your Hedera wallet to verify alert integrity on the blockchain.
            </p>
            <v-btn
              color="primary"
              block
              @click="connectWallet"
              :loading="connectingWallet"
              class="mb-2"
            >
              <v-icon left>mdi-wallet</v-icon>
              Connect with HashPack
            </v-btn>
            <v-btn
              color="secondary"
              block
              @click="connectWallet"
              :loading="connectingWallet"
              outlined
            >
              <v-icon left>mdi-wallet-outline</v-icon>
              Connect with Blade Wallet
            </v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="showWalletDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Loading Overlay -->
      <v-overlay :value="loading" z-index="1000">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
        <p class="mt-4 text-center">Loading deforestation data...</p>
      </v-overlay>
    </div>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import DeforestationMonitoringDashboard from '@/components/eudr/DeforestationMonitoringDashboard.vue';
import { getCurrentUserId } from '@/utils/roles.js';
import { deforestationAlertService } from '@/services/deforestationAlertService.js';

export default {
  name: 'DeforestationMonitoringView',
  components: {
    Default,
    DeforestationMonitoringDashboard,
  },
  data() {
    return {
      loading: false,
      refreshing: false,
      showSettings: false,
      showWalletDialog: false,
      savingSettings: false,
      connectingWallet: false,
      selectedProductionUnit: null,
      alertSummary: {
        totalAlerts: 0,
        highSeverityAlerts: 0,
        mediumSeverityAlerts: 0,
        lowSeverityAlerts: 0,
        lastAlertDate: null,
      },
      settings: {
        monitoringEnabled: true,
        bufferDistanceKm: 5.0,
        alertThresholds: {
          highSeverityDistance: 1.0,
          mediumSeverityDistance: 2.0,
          lowSeverityDistance: 5.0,
          minimumConfidence: 0.4,
        },
        notificationSettings: {
          enableEmailNotifications: true,
          enableSmsNotifications: false,
          enablePushNotifications: true,
          highSeverityImmediate: true,
          dailySummaryEnabled: true,
          weeklySummaryEnabled: true,
        },
      },
      walletConnected: false,
      walletAccount: null,
    };
  },
  computed: {
    currentFarmerId() {
      return getCurrentUserId() || this.$route.params.farmerId;
    },
  },
  async mounted() {
    await this.loadData();
    await this.loadSettings();
    this.checkWalletConnection();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        if (this.currentFarmerId) {
          // Load alert summary for farmer
          const alerts = await deforestationAlertService.getAlertsByFarmer(this.currentFarmerId);
          this.calculateAlertSummary(alerts);
        }
      } catch (error) {
        console.error('Failed to load deforestation data:', error);
        this.$toast.error('Failed to load deforestation monitoring data');
      } finally {
        this.loading = false;
      }
    },

    async loadSettings() {
      try {
        const config = await deforestationAlertService.getConfiguration();
        this.settings = { ...this.settings, ...config.currentConfiguration };
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    },

    async refreshMonitoring() {
      this.refreshing = true;
      try {
        await this.loadData();
        this.$toast.success('Monitoring data refreshed successfully');
      } catch (error) {
        this.$toast.error('Failed to refresh monitoring data');
      } finally {
        this.refreshing = false;
      }
    },

    async saveSettings() {
      this.savingSettings = true;
      try {
        await deforestationAlertService.updateConfiguration(this.settings);
        this.showSettings = false;
        this.$toast.success('Settings saved successfully');
      } catch (error) {
        console.error('Failed to save settings:', error);
        this.$toast.error('Failed to save settings');
      } finally {
        this.savingSettings = false;
      }
    },

    calculateAlertSummary(alerts) {
      this.alertSummary = {
        totalAlerts: alerts.length,
        highSeverityAlerts: alerts.filter((a) => a.severity === 'HIGH').length,
        mediumSeverityAlerts: alerts.filter((a) => a.severity === 'MEDIUM').length,
        lowSeverityAlerts: alerts.filter((a) => a.severity === 'LOW').length,
        lastAlertDate: alerts.length > 0 ? alerts[0].alertDate : null,
      };
    },

    handleAlertSelected(alert) {
      // Handle alert selection - could open details dialog
      console.log('Alert selected:', alert);
    },

    handleConfigurationUpdated(config) {
      this.settings = { ...this.settings, ...config };
    },

    async connectWallet() {
      this.connectingWallet = true;
      try {
        // Integration with HashPack or Blade wallet using ethers.js
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.walletAccount = accounts[0];
          this.walletConnected = true;
          this.showWalletDialog = false;
          this.$toast.success('Wallet connected successfully');
        } else {
          this.$toast.error('No wallet extension found. Please install HashPack or Blade wallet.');
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        this.$toast.error('Failed to connect wallet');
      } finally {
        this.connectingWallet = false;
      }
    },

    checkWalletConnection() {
      // Check if wallet is already connected
      if (window.ethereum && window.ethereum.selectedAddress) {
        this.walletAccount = window.ethereum.selectedAddress;
        this.walletConnected = true;
      }
    },

    getTrendClass() {
      // Return CSS class for trend indicator
      return 'trend-stable';
    },

    getTrendIcon() {
      return 'mdi-minus';
    },

    getTrendText() {
      return 'No change';
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
  meta() {
    return {
      title: 'Deforestation Monitoring - EUDR Compliance',
    };
  },
};
</script>

<style scoped>
.deforestation-monitoring-page {
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
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
  border-radius: 12px;
  border-left: 4px solid #ea580c;
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
  color: #ea580c;
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

.refresh-btn, .settings-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
}

.refresh-btn {
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.alert-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.status-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.status-card.high-severity {
  border-left: 4px solid #dc2626;
}

.status-card.medium-severity {
  border-left: 4px solid #ea580c;
}

.status-card.low-severity {
  border-left: 4px solid #eab308;
}

.status-card.total-alerts {
  border-left: 4px solid #2563eb;
}

.status-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-icon {
  flex-shrink: 0;
}

.status-info {
  flex: 1;
}

.status-number {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.status-label {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 8px 0;
}

.status-trend {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
}

.last-alert {
  font-size: 0.8rem;
  color: #6b7280;
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

  .refresh-btn, .settings-btn {
    flex: 1;
  }

  .alert-status-grid {
    grid-template-columns: 1fr;
  }
}
</style>"
