<template>
  <v-container fluid class="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
    <!-- Header Section -->
    <div class="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-start sm:tw-items-center tw-mb-8">
      <div>
        <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-2">Exporter Dashboard</h1>
        <p class="tw-text-gray-600">Comprehensive system oversight and management</p>
      </div>
      <div class="tw-flex tw-gap-3 tw-mt-4 sm:tw-mt-0">
        <v-btn color="primary" @click="refreshData" :loading="loading">
          <v-icon left>mdi-refresh</v-icon>
          Refresh
        </v-btn>
        <v-btn color="success" @click="exportReport">
          <v-icon left>mdi-download</v-icon>
          Export
        </v-btn>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <v-row class="tw-mb-8">
      <v-col cols="12" sm="6" md="3">
        <v-card class="tw-rounded-xl tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-h-full">
          <v-card-text class="tw-p-6">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-sm tw-text-gray-600 tw-mb-1">Total Zones</p>
                <p class="tw-text-3xl tw-font-bold tw-text-blue-600">{{ analytics.totalZones }}</p>
              </div>
              <v-avatar color="blue" class="tw-bg-blue-100">
                <v-icon color="blue">mdi-map-marker-multiple</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="tw-rounded-xl tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-h-full">
          <v-card-text class="tw-p-6">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-sm tw-text-gray-600 tw-mb-1">Active Farmers</p>
                <p class="tw-text-3xl tw-font-bold tw-text-green-600">{{ analytics.totalFarmers }}</p>
              </div>
              <v-avatar color="green" class="tw-bg-green-100">
                <v-icon color="green">mdi-account-group</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="tw-rounded-xl tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-h-full">
          <v-card-text class="tw-p-6">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-sm tw-text-gray-600 tw-mb-1">System Admins</p>
                <p class="tw-text-3xl tw-font-bold tw-text-purple-600">{{ analytics.activeSystemAdmins }}</p>
              </div>
              <v-avatar color="purple" class="tw-bg-purple-100">
                <v-icon color="purple">mdi-account-tie</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="tw-rounded-xl tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-h-full">
          <v-card-text class="tw-p-6">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-sm tw-text-gray-600 tw-mb-1">Zone Supervisors</p>
                <p class="tw-text-3xl tw-font-bold tw-text-orange-600">{{ analytics.activeZoneSupervisors }}</p>
              </div>
              <v-avatar color="orange" class="tw-bg-orange-100">
                <v-icon color="orange">mdi-account-supervisor</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Grid -->
    <v-row>
      <!-- Zone Management -->
      <v-col cols="12" lg="8">
        <v-card class="tw-rounded-xl tw-shadow-md tw-h-full">
          <v-card-title class="tw-bg-gradient-to-r tw-from-blue-500 tw-to-green-500 tw-text-white tw-rounded-t-xl">
            <v-icon class="tw-mr-2">mdi-map</v-icon>
            Zone Management
          </v-card-title>
          <v-card-text class="tw-p-0">
            <ArcGISZoneManager
              :zones="zones"
              :farmers="farmers"
              :user-role="'EXPORTER'"
              @zone-selected="onZoneSelected"
              @zone-created="onZoneCreated"
              @zone-updated="onZoneUpdated"
              @zone-deleted="onZoneDeleted"
              @show-message="showMessage"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Quick Actions & Analytics -->
      <v-col cols="12" lg="4">
        <div class="tw-space-y-6">
          <!-- Quick Actions -->
          <v-card class="tw-rounded-xl tw-shadow-md">
            <v-card-title class="tw-text-lg tw-font-semibold">
              <v-icon class="tw-mr-2">mdi-lightning-bolt</v-icon>
              Quick Actions
            </v-card-title>
            <v-card-text>
              <div class="tw-space-y-3">
                <v-btn
                  block
                  color="primary"
                  variant="outlined"
                  @click="openCreateSystemAdminDialog"
                >
                  <v-icon left>mdi-account-plus</v-icon>
                  Add System Admin
                </v-btn>
                <v-btn
                  block
                  color="success"
                  variant="outlined"
                  @click="openCreateZoneSupervisorDialog"
                >
                  <v-icon left>mdi-account-supervisor</v-icon>
                  Add Zone Supervisor
                </v-btn>
                <v-btn
                  block
                  color="info"
                  variant="outlined"
                  @click="openRolePermissionsDialog"
                >
                  <v-icon left>mdi-shield-account</v-icon>
                  Manage Permissions
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Zone Breakdown -->
          <v-card class="tw-rounded-xl tw-shadow-md">
            <v-card-title class="tw-text-lg tw-font-semibold">
              <v-icon class="tw-mr-2">mdi-chart-pie</v-icon>
              Zone Breakdown
            </v-card-title>
            <v-card-text>
              <div class="tw-space-y-3">
                <div v-for="zone in analytics.zoneBreakdown" :key="zone.zoneId" 
                     class="tw-flex tw-justify-between tw-items-center tw-p-3 tw-bg-gray-50 tw-rounded-lg">
                  <div>
                    <p class="tw-font-medium tw-text-sm">{{ zone.zoneName }}</p>
                    <p class="tw-text-xs tw-text-gray-600">{{ zone.farmerCount }} farmers</p>
                  </div>
                  <v-chip size="small" :color="getZoneStatusColor(zone.farmerCount)">
                    {{ zone.supervisorCount }} supervisors
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Recent Activity -->
          <v-card class="tw-rounded-xl tw-shadow-md">
            <v-card-title class="tw-text-lg tw-font-semibold">
              <v-icon class="tw-mr-2">mdi-history</v-icon>
              Recent Activity
            </v-card-title>
            <v-card-text>
              <v-timeline density="compact" class="tw-mt-2">
                <v-timeline-item
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  :dot-color="activity.color"
                  size="small"
                >
                  <div class="tw-text-sm">
                    <p class="tw-font-medium">{{ activity.title }}</p>
                    <p class="tw-text-gray-600 tw-text-xs">{{ formatTime(activity.timestamp) }}</p>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- System Admin Management Dialog -->
    <v-dialog v-model="createSystemAdminDialog" max-width="500">
      <v-card>
        <v-card-title>Create System Admin</v-card-title>
        <v-card-text>
          <v-form ref="systemAdminForm" v-model="systemAdminFormValid">
            <v-text-field
              v-model="newSystemAdmin.fullName"
              label="Full Name"
              :rules="[rules.required]"
              variant="outlined"
            />
            <v-text-field
              v-model="newSystemAdmin.email"
              label="Email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
            />
            <v-text-field
              v-model="newSystemAdmin.phoneNumber"
              label="Phone Number"
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="createSystemAdminDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="createSystemAdmin"
            :loading="creatingSystemAdmin"
            :disabled="!systemAdminFormValid"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Zone Supervisor Management Dialog -->
    <v-dialog v-model="createZoneSupervisorDialog" max-width="500">
      <v-card>
        <v-card-title>Create Zone Supervisor</v-card-title>
        <v-card-text>
          <v-form ref="zoneSupervisorForm" v-model="zoneSupervisorFormValid">
            <v-text-field
              v-model="newZoneSupervisor.fullName"
              label="Full Name"
              :rules="[rules.required]"
              variant="outlined"
            />
            <v-text-field
              v-model="newZoneSupervisor.email"
              label="Email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
            />
            <v-text-field
              v-model="newZoneSupervisor.phoneNumber"
              label="Phone Number"
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="createZoneSupervisorDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="createZoneSupervisor"
            :loading="creatingZoneSupervisor"
            :disabled="!zoneSupervisorFormValid"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for messages -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template><
script>
import ArcGISZoneManager from '@/components/zone/ArcGISZoneManager.vue'

export default {
  name: 'ExporterDashboard',
  components: {
    ArcGISZoneManager
  },
  data() {
    return {
      loading: false,
      analytics: {
        totalZones: 0,
        totalFarmers: 0,
        activeSystemAdmins: 0,
        activeZoneSupervisors: 0,
        zoneBreakdown: []
      },
      zones: [],
      farmers: [],
      recentActivities: [],
      
      // Dialog states
      createSystemAdminDialog: false,
      createZoneSupervisorDialog: false,
      rolePermissionsDialog: false,
      
      // Form data
      newSystemAdmin: {
        fullName: '',
        email: '',
        phoneNumber: ''
      },
      newZoneSupervisor: {
        fullName: '',
        email: '',
        phoneNumber: ''
      },
      
      // Form validation
      systemAdminFormValid: false,
      zoneSupervisorFormValid: false,
      creatingSystemAdmin: false,
      creatingZoneSupervisor: false,
      
      // Validation rules
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(value) || 'Invalid email.'
        }
      },
      
      // Snackbar
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      }
    }
  },
  mounted() {
    this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      this.loading = true
      
      try {
        await Promise.all([
          this.loadAnalytics(),
          this.loadZones(),
          this.loadFarmers(),
          this.loadRecentActivities()
        ])
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        this.showMessage({ type: 'error', text: 'Failed to load dashboard data' })
      } finally {
        this.loading = false
      }
    },

    async loadAnalytics() {
      try {
        const response = await this.$http.get('/api/exporters-service/exporter/analytics')
        if (response.data.success) {
          this.analytics = response.data.data
        }
      } catch (error) {
        console.error('Error loading analytics:', error)
      }
    },

    async loadZones() {
      try {
        const response = await this.$http.get('/api/admin-service/zones')
        if (response.data.success) {
          this.zones = response.data.data
        }
      } catch (error) {
        console.error('Error loading zones:', error)
      }
    },

    async loadFarmers() {
      try {
        const response = await this.$http.get('/api/zone-supervisor-service/farmers')
        if (response.data.success) {
          this.farmers = response.data.data
        }
      } catch (error) {
        console.error('Error loading farmers:', error)
      }
    },

    async loadRecentActivities() {
      // Mock recent activities - in production, this would come from an audit log
      this.recentActivities = [
        {
          id: 1,
          title: 'New zone "North Region" created',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          color: 'blue'
        },
        {
          id: 2,
          title: 'System Admin John Doe added',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          color: 'green'
        },
        {
          id: 3,
          title: 'Zone Supervisor assigned to Central Zone',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          color: 'orange'
        },
        {
          id: 4,
          title: 'Permissions updated for Zone Supervisor role',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          color: 'purple'
        }
      ]
    },

    async refreshData() {
      await this.loadDashboardData()
      this.showMessage({ type: 'success', text: 'Dashboard data refreshed' })
    },

    exportReport() {
      // Mock export functionality
      this.showMessage({ type: 'info', text: 'Export functionality coming soon' })
    },

    openCreateSystemAdminDialog() {
      this.newSystemAdmin = { fullName: '', email: '', phoneNumber: '' }
      this.createSystemAdminDialog = true
    },

    openCreateZoneSupervisorDialog() {
      this.newZoneSupervisor = { fullName: '', email: '', phoneNumber: '' }
      this.createZoneSupervisorDialog = true
    },

    openRolePermissionsDialog() {
      this.showMessage({ type: 'info', text: 'Role permissions management coming soon' })
    },

    async createSystemAdmin() {
      if (!this.systemAdminFormValid) return

      this.creatingSystemAdmin = true

      try {
        const response = await this.$http.post('/api/exporters-service/exporter/system-admins', this.newSystemAdmin)
        
        if (response.data.success) {
          this.showMessage({ type: 'success', text: 'System Admin created successfully' })
          this.createSystemAdminDialog = false
          await this.loadAnalytics()
        }
      } catch (error) {
        console.error('Error creating system admin:', error)
        this.showMessage({ type: 'error', text: 'Failed to create System Admin' })
      } finally {
        this.creatingSystemAdmin = false
      }
    },

    async createZoneSupervisor() {
      if (!this.zoneSupervisorFormValid) return

      this.creatingZoneSupervisor = true

      try {
        const response = await this.$http.post('/api/exporters-service/exporter/zone-supervisors', this.newZoneSupervisor)
        
        if (response.data.success) {
          this.showMessage({ type: 'success', text: 'Zone Supervisor created successfully' })
          this.createZoneSupervisorDialog = false
          await this.loadAnalytics()
        }
      } catch (error) {
        console.error('Error creating zone supervisor:', error)
        this.showMessage({ type: 'error', text: 'Failed to create Zone Supervisor' })
      } finally {
        this.creatingZoneSupervisor = false
      }
    },

    onZoneSelected(zone) {
      console.log('Zone selected:', zone)
    },

    async onZoneCreated(zone) {
      this.zones.push(zone)
      await this.loadAnalytics()
      this.showMessage({ type: 'success', text: `Zone "${zone.name}" created successfully` })
    },

    async onZoneUpdated(zone) {
      const index = this.zones.findIndex(z => z.id === zone.id)
      if (index !== -1) {
        this.zones.splice(index, 1, zone)
      }
      this.showMessage({ type: 'success', text: `Zone "${zone.name}" updated successfully` })
    },

    async onZoneDeleted(zoneId) {
      this.zones = this.zones.filter(z => z.id !== zoneId)
      await this.loadAnalytics()
      this.showMessage({ type: 'success', text: 'Zone deleted successfully' })
    },

    getZoneStatusColor(farmerCount) {
      if (farmerCount === 0) return 'grey'
      if (farmerCount < 5) return 'orange'
      if (farmerCount < 15) return 'blue'
      return 'green'
    },

    formatTime(timestamp) {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      return `${days}d ago`
    },

    showMessage(message) {
      this.snackbar = {
        show: true,
        text: message.text,
        color: message.type === 'error' ? 'error' : message.type === 'warning' ? 'warning' : 'success'
      }
    }
  }
}
</script>

<style scoped>
/* Custom gradient background */
.tw-bg-gradient-to-r {
  background: linear-gradient(to right, #3b82f6, #10b981);
}

/* Hover effects */
.hover\:tw-shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.tw-transition-shadow {
  transition: box-shadow 0.3s ease-in-out;
}

/* Custom scrollbar for timeline */
:deep(.v-timeline) {
  max-height: 300px;
  overflow-y: auto;
}

/* Card hover animations */
.v-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>