<template>
  <div class="deforestation-monitoring-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <h2 class="dashboard-title">
        <i class="fas fa-satellite-dish"></i>
        Real-time Deforestation Monitoring
      </h2>
      <div class="header-actions">
        <button
          @click="refreshAlerts"
          :disabled="loading"
          class="btn btn-primary"
        >
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
          Refresh
        </button>
        <button
          @click="showConfiguration = true"
          class="btn btn-secondary"
        >
          <i class="fas fa-cog"></i>
          Settings
        </button>
      </div>
    </div>

    <!-- Alert Summary Cards -->
    <div class="alert-summary-grid">
      <div class="summary-card high-severity">
        <div class="card-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="card-content">
          <h3>{{ alertSummary.highSeverityAlerts }}</h3>
          <p>High Severity Alerts</p>
        </div>
      </div>

      <div class="summary-card medium-severity">
        <div class="card-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="card-content">
          <h3>{{ alertSummary.mediumSeverityAlerts }}</h3>
          <p>Medium Severity Alerts</p>
        </div>
      </div>

      <div class="summary-card low-severity">
        <div class="card-icon">
          <i class="fas fa-info-circle"></i>
        </div>
        <div class="card-content">
          <h3>{{ alertSummary.lowSeverityAlerts }}</h3>
          <p>Low Severity Alerts</p>
        </div>
      </div>

      <div class="summary-card total-alerts">
        <div class="card-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="card-content">
          <h3>{{ alertSummary.totalAlerts }}</h3>
          <p>Total Alerts (30 days)</p>
        </div>
      </div>
    </div>

    <!-- Interactive Map Section -->
    <div class="map-section">
      <div class="map-header">
        <h3>Production Units & Deforestation Alerts</h3>
        <div class="map-controls">
          <div class="filter-group">
            <label>Alert Type:</label>
            <select v-model="mapFilters.alertType" @change="updateMapFilters">
              <option value="">All Types</option>
              <option value="GLAD_DEFORESTATION">GLAD Deforestation</option>
              <option value="FIRE_ALERT">Fire Alerts</option>
              <option value="TREE_LOSS">Tree Loss</option>
            </select>
          </div>
        </div>
      </div>

      <div class="map-container">
        <div id="deforestation-map" class="monitoring-map"></div>
      </div>
    </div>

    <!-- Recent Alerts Table -->
    <div class="alerts-table-section">
      <div class="table-header">
        <h3>Recent Deforestation Alerts</h3>
      </div>

      <div class="table-container">
        <table class="alerts-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Production Unit</th>
              <th>Alert Type</th>
              <th>Severity</th>
              <th>Distance</th>
              <th>Confidence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in recentAlerts" :key="alert.id">
              <td>{{ formatDateTime(alert.alertDate) }}</td>
              <td>{{ alert.productionUnitName }}</td>
              <td>{{ formatAlertType(alert.alertType) }}</td>
              <td>{{ alert.severity }}</td>
              <td>{{ alert.distanceFromUnit }} km</td>
              <td>{{ Math.round(alert.confidence * 100) }}%</td>
              <td>
                <button @click="viewAlertDetails(alert)" class="btn-icon">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeforestationMonitoringDashboard',
  data() {
    return {
      loading: false,
      showConfiguration: false,
      alertSummary: {
        totalAlerts: 0,
        highSeverityAlerts: 0,
        mediumSeverityAlerts: 0,
        lowSeverityAlerts: 0,
      },
      recentAlerts: [],
      mapFilters: {
        alertType: '',
        severity: '',
        timeRange: '30',
      },
    };
  },
  mounted() {
    this.loadAlertData();
  },
  methods: {
    async loadAlertData() {
      this.loading = true;
      try {
        // Load alert data from API
        // This would be implemented with actual API calls
        this.alertSummary = {
          totalAlerts: 15,
          highSeverityAlerts: 3,
          mediumSeverityAlerts: 7,
          lowSeverityAlerts: 5,
        };

        this.recentAlerts = [
          {
            id: '1',
            alertDate: new Date(),
            productionUnitName: 'Farm Plot A',
            alertType: 'GLAD_DEFORESTATION',
            severity: 'HIGH',
            distanceFromUnit: 0.5,
            confidence: 0.85,
          },
        ];
      } catch (error) {
        console.error('Failed to load alert data:', error);
      } finally {
        this.loading = false;
      }
    },

    async refreshAlerts() {
      await this.loadAlertData();
    },

    updateMapFilters() {
      // Update map based on filters
    },

    viewAlertDetails() {
      // View alert details
    },

    formatDateTime(date) {
      return new Date(date).toLocaleString();
    },

    formatAlertType(type) {
      const types = {
        GLAD_DEFORESTATION: 'GLAD Deforestation',
        FIRE_ALERT: 'Fire Alert',
        TREE_LOSS: 'Tree Loss',
      };
      return types[type] || type;
    },
  },
};
</script>

<style scoped>
.deforestation-monitoring-dashboard {
  padding: 20px;
  background-color: #f8f9fa;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.alert-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.summary-card.high-severity {
  border-left: 4px solid #dc3545;
}

.summary-card.medium-severity {
  border-left: 4px solid #fd7e14;
}

.summary-card.low-severity {
  border-left: 4px solid #ffc107;
}

.summary-card.total-alerts {
  border-left: 4px solid #17a2b8;
}

.map-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.map-container {
  height: 400px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.alerts-table-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.alerts-table {
  width: 100%;
  border-collapse: collapse;
}

.alerts-table th,
.alerts-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-icon {
  padding: 5px;
  border: none;
  background: none;
  cursor: pointer;
}
</style>"
