<template>
  <div class="exporter-dashboard tw-min-h-screen tw-bg-gray-50">
    <!-- Header Section -->
    <div class="tw-bg-white tw-shadow-sm tw-border-b tw-border-gray-200">
      <div class="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div class="tw-py-6">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <h1 class="tw-text-2xl tw-font-bold tw-text-gray-900">Exporter Dashboard</h1>
              <p class="tw-text-sm tw-text-gray-600 tw-mt-1">
                Welcome back, {{ currentUser.fullName }}
              </p>
            </div>
            <div class="tw-flex tw-items-center tw-space-x-4">
              <v-chip color="success" small>
                <v-icon left small>mdi-check-circle</v-icon>
                {{ verificationStatus }}
              </v-chip>
              <v-btn color="primary" @click="refreshData" :loading="loading">
                <v-icon left>mdi-refresh</v-icon>
                Refresh
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div class="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-8">
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6 tw-mb-8">
        <!-- Total Zones Card -->
        <v-card class="tw-h-32 tw-relative tw-overflow-hidden" elevation="2">
          <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-br tw-from-blue-500 tw-to-blue-600"></div>
          <v-card-text class="tw-relative tw-z-10 tw-text-white tw-h-full tw-flex tw-flex-col tw-justify-between">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-blue-100 tw-text-sm">Total Zones</p>
                <p class="tw-text-3xl tw-font-bold">{{ analytics.totalZones }}</p>
              </div>
              <v-icon large color="white" class="tw-opacity-80">mdi-map-marker-radius</v-icon>
            </div>
            <div class="tw-flex tw-items-center tw-text-blue-100 tw-text-xs">
              <v-icon small class="tw-mr-1">mdi-trending-up</v-icon>
              <span>{{ analytics.zoneGrowth }}% from last month</span>
            </div>
          </v-card-text>
        </v-card>

        <!-- Total Farmers Card -->
        <v-card class="tw-h-32 tw-relative tw-overflow-hidden" elevation="2">
          <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-br tw-from-green-500 tw-to-green-600"></div>
          <v-card-text class="tw-relative tw-z-10 tw-text-white tw-h-full tw-flex tw-flex-col tw-justify-between">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-green-100 tw-text-sm">Total Farmers</p>
                <p class="tw-text-3xl tw-font-bold">{{ analytics.totalFarmers }}</p>
              </div>
              <v-icon large color="white" class="tw-opacity-80">mdi-account-group</v-icon>
            </div>
            <div class="tw-flex tw-items-center tw-text-green-100 tw-text-xs">
              <v-icon small class="tw-mr-1">mdi-trending-up</v-icon>
              <span>{{ analytics.farmerGrowth }}% from last month</span>
            </div>
          </v-card-text>
        </v-card>

        <!-- System Admins Card -->
        <v-card class="tw-h-32 tw-relative tw-overflow-hidden" elevation="2">
          <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-br tw-from-purple-500 tw-to-purple-600"></div>
          <v-card-text class="tw-relative tw-z-10 tw-text-white tw-h-full tw-flex tw-flex-col tw-justify-between">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-purple-100 tw-text-sm">System Admins</p>
                <p class="tw-text-3xl tw-font-bold">{{ analytics.activeSystemAdmins }}</p>
              </div>
              <v-icon large color="white" class="tw-opacity-80">mdi-account-cog</v-icon>
            </div>
            <div class="tw-flex tw-items-center tw-text-purple-100 tw-text-xs">
              <v-icon small class="tw-mr-1">mdi-account-plus</v-icon>
              <span>{{ analytics.activeSystemAdmins }} active</span>
            </div>
          </v-card-text>
        </v-card>

        <!-- Zone Supervisors Card -->
        <v-card class="tw-h-32 tw-relative tw-overflow-hidden" elevation="2">
          <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-br tw-from-orange-500 tw-to-orange-600"></div>
          <v-card-text class="tw-relative tw-z-10 tw-text-white tw-h-full tw-flex tw-flex-col tw-justify-between">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-orange-100 tw-text-sm">Zone Supervisors</p>
                <p class="tw-text-3xl tw-font-bold">{{ analytics.activeZoneSupervisors }}</p>
              </div>
              <v-icon large color="white" class="tw-opacity-80">mdi-account-supervisor</v-icon>
            </div>
            <div class="tw-flex tw-items-center tw-text-orange-100 tw-text-xs">
              <v-icon small class="tw-mr-1">mdi-account-check</v-icon>
              <span>{{ analytics.activeZoneSupervisors }} active</span>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Main Content Grid -->
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-8">
        <!-- Zone Overview -->
        <div class="lg:tw-col-span-2">
          <v-card elevation="2" class="tw-mb-6">
            <v-card-title class="tw-flex tw-items-center tw-justify-between">
              <div class="tw-flex tw-items-center">
                <v-icon class="tw-mr-2" color="primary">mdi-map-marker-radius</v-icon>
                <span>Zone Overview</span>
              </div>
              <v-btn small text @click="$router.push({ name: 'ZoneManagement' })">
                View All
                <v-icon right small>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="tw-space-y-4">
                <div v-for="zone in analytics.zoneBreakdown.slice(0, 5)" :key="zone.zoneId" 
                     class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 tw-rounded-lg">
                  <div class="tw-flex tw-items-center">
                    <div class="tw-w-3 tw-h-3 tw-bg-blue-500 tw-rounded-full tw-mr-3"></div>
                    <div>
                      <p class="tw-font-medium tw-text-gray-900">{{ zone.zoneName }}</p>
                      <p class="tw-text-sm tw-text-gray-600">{{ zone.farmerCount }} farmers</p>
                    </div>
                  </div>
                  <div class="tw-text-right">
                    <p class="tw-text-sm tw-text-gray-600">{{ zone.supervisorCount }} supervisors</p>
                    <v-chip small :color="zone.farmerCount > 10 ? 'success' : 'warning'">
                      {{ zone.farmerCount > 10 ? 'Active' : 'Growing' }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Recent Activities -->
          <v-card elevation="2">
            <v-card-title class="tw-flex tw-items-center">
              <v-icon class="tw-mr-2" color="primary">mdi-clock-outline</v-icon>
              <span>Recent Activities</span>
            </v-card-title>
            <v-card-text>
              <v-timeline dense>
                <v-timeline-item
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  :color="activity.color"
                  small
                >
                  <div class="tw-flex tw-items-center tw-justify-between">
                    <div>
                      <p class="tw-font-medium">{{ activity.title }}</p>
                      <p class="tw-text-sm tw-text-gray-600">{{ activity.description }}</p>
                    </div>
                    <span class="tw-text-xs tw-text-gray-500">{{ formatTime(activity.timestamp) }}</span>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </div>

        <!-- Right Sidebar -->
        <div class="tw-space-y-6">
          <!-- Quick Actions -->
          <v-card elevation="2">
            <v-card-title class="tw-flex tw-items-center">
              <v-icon class="tw-mr-2" color="primary">mdi-lightning-bolt</v-icon>
              <span>Quick Actions</span>
            </v-card-title>
            <v-card-text>
              <div class="tw-space-y-3">
                <v-btn block color="primary" @click="$router.push({ name: 'ZoneManagement' })">
                  <v-icon left>mdi-plus</v-icon>
                  Create New Zone
                </v-btn>
                <v-btn block color="success" @click="$router.push({ name: 'SystemAdminsManagement' })">
                  <v-icon left>mdi-account-plus</v-icon>
                  Add System Admin
                </v-btn>
                <v-btn block color="info" @click="$router.push({ name: 'ZoneSupervisorsManagement' })">
                  <v-icon left>mdi-account-supervisor</v-icon>
                  Add Zone Supervisor
                </v-btn>
                <v-btn block color="orange" @click="$router.push({ name: 'PickupSchedulesManagement' })">
                  <v-icon left>mdi-truck-delivery</v-icon>
                  View Pickups
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- System Health -->
          <v-card elevation="2">
            <v-card-title class="tw-flex tw-items-center">
              <v-icon class="tw-mr-2" color="primary">mdi-heart-pulse</v-icon>
              <span>System Health</span>
            </v-card-title>
            <v-card-text>
              <div class="tw-space-y-4">
                <div class="tw-flex tw-items-center tw-justify-between">
                  <span class="tw-text-sm">Active Zones</span>
                  <v-chip small color="success">{{ analytics.totalZones }}/{{ analytics.totalZones }}</v-chip>
                </div>
                <div class="tw-flex tw-items-center tw-justify-between">
                  <span class="tw-text-sm">System Load</span>
                  <v-chip small color="success">Normal</v-chip>
                </div>
                <div class="tw-flex tw-items-center tw-justify-between">
                  <span class="tw-text-sm">Data Sync</span>
                  <v-chip small color="success">Up to date</v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Performance Metrics -->
          <v-card elevation="2">
            <v-card-title class="tw-flex tw-items-center">
              <v-icon class="tw-mr-2" color="primary">mdi-chart-line</v-icon>
              <span>Performance</span>
            </v-card-title>
            <v-card-text>
              <div class="tw-space-y-4">
                <div>
                  <div class="tw-flex tw-justify-between tw-mb-1">
                    <span class="tw-text-sm">Zone Utilization</span>
                    <span class="tw-text-sm">85%</span>
                  </div>
                  <v-progress-linear value="85" color="success" height="6" rounded></v-progress-linear>
                </div>
                <div>
                  <div class="tw-flex tw-justify-between tw-mb-1">
                    <span class="tw-text-sm">Farmer Engagement</span>
                    <span class="tw-text-sm">92%</span>
                  </div>
                  <v-progress-linear value="92" color="primary" height="6" rounded></v-progress-linear>
                </div>
                <div>
                  <div class="tw-flex tw-justify-between tw-mb-1">
                    <span class="tw-text-sm">Pickup Efficiency</span>
                    <span class="tw-text-sm">78%</span>
                  </div>
                  <v-progress-linear value="78" color="warning" height="6" rounded></v-progress-linear>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <v-overlay v-model="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template><
script>
import { mapGetters } from 'vuex'

export default {
  name: 'ExporterDashboard',
  data() {
    return {
      loading: false,
      analytics: {
        totalZones: 0,
        totalFarmers: 0,
        activeSystemAdmins: 0,
        activeZoneSupervisors: 0,
        zoneGrowth: 0,
        farmerGrowth: 0,
        zoneBreakdown: []
      },
      recentActivities: []
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
    verificationStatus() {
      return this.currentUser?.verificationStatus || 'Verified'
    }
  },
  async mounted() {
    await this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      this.loading = true
      try {
        // Load system analytics
        const analyticsResponse = await this.$http.get(`/api/exporters-service/exporter/${this.currentUser.id}/analytics`)
        if (analyticsResponse.data.success) {
          this.analytics = analyticsResponse.data.data
        }

        // Load recent activities
        const activitiesResponse = await this.$http.get('/api/admin-service/recent-activities')
        if (activitiesResponse.data.success) {
          this.recentActivities = activitiesResponse.data.data.map(activity => ({
            ...activity,
            color: this.getActivityColor(activity.type),
            timestamp: new Date(activity.createdAt)
          }))
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        this.$toast.error('Failed to load dashboard data')
      } finally {
        this.loading = false
      }
    },

    async refreshData() {
      await this.loadDashboardData()
      this.$toast.success('Dashboard data refreshed')
    },

    getActivityColor(type) {
      const colors = {
        'ZONE_CREATED': 'primary',
        'FARMER_ADDED': 'success',
        'SUPERVISOR_ASSIGNED': 'info',
        'PICKUP_SCHEDULED': 'warning',
        'ADMIN_CREATED': 'purple'
      }
      return colors[type] || 'grey'
    },

    formatTime(timestamp) {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) return `${days}d ago`
      if (hours > 0) return `${hours}h ago`
      if (minutes > 0) return `${minutes}m ago`
      return 'Just now'
    }
  }
}
</script>

<style scoped>
/* Custom styles for the dashboard */
.exporter-dashboard {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* Card hover effects */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

/* Timeline customization */
:deep(.v-timeline-item__body) {
  padding-left: 16px !important;
}

/* Progress bar styling */
:deep(.v-progress-linear) {
  border-radius: 10px;
}

/* Button styling */
.v-btn {
  text-transform: none !important;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tw-grid-cols-1.md\:tw-grid-cols-2.lg\:tw-grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .tw-grid-cols-1.md\:tw-grid-cols-2.lg\:tw-grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>