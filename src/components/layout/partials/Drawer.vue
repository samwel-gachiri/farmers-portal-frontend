<template>
  <div class="futuristic-drawer tw-border-l-5">
    <!-- Drawer Header, brand + user card -->
    <div class="drawer-header">
      <div class="brand-row">
        <logo-title class="brand" />
        <span class="brand-badge">Portal</span>
      </div>
      <div class="user-mini" v-if="displayName || userRole">
        <avatar class="mr-3" />
        <div class="user-info">
          <div class="name">{{ displayName || 'User' }}</div>
          <div class="role-chip">
            <v-icon x-small left>mdi-shield-account</v-icon>
            <span>{{ userRole || 'Guest' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <div class="section-label">Navigation</div>
    <v-list dense class="nav-list">
      <v-list-item
        key="aiagent"
        link
        :to="{ name: 'FarmAI' }"
        active-class="nav-active"
        class="nav-item ai-nav-item"
      >
        <v-list-item-action>
          <v-icon left class="gradient-icon">mdi-sparkles</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="nav-text">Farm AI</v-list-item-title>
          <v-list-item-subtitle class="nav-sub">Insights & recommendations</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <template v-for="(item, i) in items">
        <v-list-item
          v-if="canView(item)"
          :key="i"
          link
          :to="item.link"
          active-class="nav-active"
          class="nav-item"
        >
          <v-list-item-action>
            <v-icon :color="item.iconColor || 'primary'">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="nav-text">{{ item.text }}</v-list-item-title>
            <v-list-item-subtitle v-if="item.desc" class="nav-sub">{{ item.desc }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="item.notifications" class="notification-badge">
            <v-badge color="error" :content="item.notifications" inline></v-badge>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>

    <!-- Feature Request Section -->
    <div class="feedback-section">
      <v-expansion-panels flat>
        <v-expansion-panel class="feedback-panel">
          <v-expansion-panel-header class="feedback-header">
            <v-icon left color="primary">mdi-lightbulb-on</v-icon>
            <span>Suggest Improvement</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="feedback-content">
            <v-textarea
                v-model="featureRequest"
                outlined
                placeholder="Describe what you'd like to see improved or added..."
                rows="2"
                hide-details
                class="request-input"
            ></v-textarea>
            <v-select
                v-model="requestType"
                :items="requestTypes"
                label="Request Type"
                outlined
                dense
                class="mt-2"
            ></v-select>
            <v-btn
                color="primary"
                small
                depressed
                @click="submitFeatureRequest"
                :loading="isSubmitting"
                class="submit-btn"
            >
              Submit
              <v-icon right>mdi-send</v-icon>
            </v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <!-- Current Weather Mini Widget -->
    <div v-if="false" class="weather-widget" @click="showWeatherDetail = true">
      <div class="weather-content">
        <v-icon large color="yellow">mdi-weather-sunny</v-icon>
        <div class="weather-info">
          <div class="weather-temp">28°C</div>
          <div class="weather-location">Field A</div>
        </div>
      </div>
    </div>

    <!-- Weather Detail Dialog -->
    <v-dialog v-model="showWeatherDetail" max-width="400">
      <v-card class="weather-dialog">
        <v-card-title class="weather-dialog-title">
          <v-icon left>mdi-weather-cloudy</v-icon>
          Field Conditions
        </v-card-title>
        <v-card-text>
          <div class="weather-stats">
            <div class="weather-stat">
              <v-icon>mdi-thermometer</v-icon>
              <span>Soil Temp: 22°C</span>
            </div>
            <div class="weather-stat">
              <v-icon>mdi-water</v-icon>
              <span>Moisture: 64%</span>
            </div>
            <div class="weather-stat">
              <v-icon>mdi-weather-windy</v-icon>
              <span>Wind: 12 km/h</span>
            </div>
          </div>
          <v-divider class="my-3"></v-divider>
          <h4 class="forecast-title">3-Day Forecast</h4>
          <div class="forecast-grid">
            <div v-for="(day, i) in forecast" :key="i" class="forecast-day">
              <div>{{ day.day }}</div>
              <v-icon>{{ day.icon }}</v-icon>
              <div>{{ day.high }}° / {{ day.low }}°</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {
  getCurrentUserId,
  getCurrentUserRole,
  isAuthenticated,
} from '@/utils/roles.js';
import LogoTitle from '@/components/shared/LogoText.vue';
import UserRole from '@/components/layout/partials/nav/UserRole.vue';
import Avatar from '@/components/layout/partials/nav/Avatar.vue';

export default {
  name: 'FuturisticDrawer',
  // eslint-disable-next-line vue/no-unused-components
  components: { UserRole, LogoTitle, Avatar },
  data: () => ({
    items: [
      {
        icon: 'mdi-view-dashboard',
        text: 'Dashboard',
        link: { name: 'Dashboard' },
        permissions: ['VIEW_EXPORTER', 'VIEW_ZONE_SUPERVISOR', 'VIEW_ZONE_FARMERS'],
        iconColor: 'black',
        desc: 'View your dashboard based on your role',
      },
      {
        icon: 'mdi-map-marker-radius',
        text: 'Zone Management',
        link: { name: 'ZoneManagement' },
        permissions: ['CREATE_ZONE', 'UPDATE_ZONE', 'VIEW_ZONE_SUPERVISOR'],
        iconColor: 'green',
        desc: 'Manage operating zones and their details',
      },
      {
        icon: 'mdi-account-group',
        text: 'Farmers Management',
        link: { name: 'FarmersManagement' },
        permissions: ['ADD_FARMER', 'EDIT_FARMER', 'VIEW_ZONE_FARMERS'],
        iconColor: 'primary',
        desc: 'Add or manage farmers in zones',
      },
      {
        icon: 'mdi-account-supervisor',
        text: 'Zone Supervisors',
        link: { name: 'ZoneSupervisorsManagement' },
        permissions: ['MANAGE_ZONE_SUPERVISOR', 'ADD_ZONE_SUPERVISOR', 'VIEW_ZONE_SUPERVISOR'],
        iconColor: 'purple',
        desc: 'Manage zone supervisors and their assignments',
      },
      {
        icon: 'mdi-account-cog',
        text: 'System Admins',
        link: { name: 'SystemAdminsManagement' },
        permissions: ['MANAGE_SYSTEM_ADMIN'],
        iconColor: 'red',
        desc: 'Manage system administrators',
      },
      {
        icon: 'mdi-truck-delivery',
        text: 'Pickup Schedules',
        link: { name: 'PickupSchedulesManagement' },
        permissions: ['SCHEDULE_PICKUP', 'VIEW_PICKUP_SCHEDULES'],
        iconColor: 'orange',
        desc: 'Schedule and view pickups for farmers',
      },
      {
        icon: 'mdi-comment-text-outline',
        text: 'Zone Comments',
        link: { name: 'ZoneCommentsManagement' },
        permissions: ['ADD_ZONE_COMMENT'],
        iconColor: 'blue',
        desc: 'Add or view comments on zones',
      },
      {
        icon: 'mdi-account-details',
        text: 'Exporter Profile',
        link: { name: 'ExporterProfile' },
        permissions: ['VIEW_EXPORTER', 'UPDATE_EXPORTER', 'VERIFY_EXPORTER'],
        iconColor: 'teal',
        desc: 'View or update your exporter profile',
      },
      {
        icon: 'mdi-sprout',
        text: 'My Farm',
        link: { name: 'MyFarm', params: { farmerId: getCurrentUserId() } },
        permissions: [],
        roles: ['FARMER'],
        iconColor: 'darkgreen',
        desc: 'View your farm details',
      },
      {
        icon: 'mdi-format-list-bulleted',
        text: 'Listings',
        link: { name: 'Listings' },
        permissions: [],
        roles: ['FARMER'],
        iconColor: 'indigo',
        desc: 'Manage and view your listings',
      },
      {
        icon: 'mdi-chart-areaspline',
        text: 'Reports',
        link: { name: 'FarmerReport' },
        permissions: [],
        roles: ['FARMER'],
        iconColor: 'black',
        desc: 'View your farming reports',
      },
    ],
    featureRequest: '',
    requestType: 'feature',
    requestTypes: [
      { text: 'Feature Request', value: 'feature' },
      { text: 'Bug Report', value: 'bug' },
      { text: 'Improvement', value: 'improvement' },
    ],
    isSubmitting: false,
    showWeatherDetail: false,
    forecast: [
      {
        day: 'Today', icon: 'mdi-weather-sunny', high: 28, low: 18,
      },
      {
        day: 'Tomorrow', icon: 'mdi-weather-partly-cloudy', high: 26, low: 17,
      },
      {
        day: 'Wed', icon: 'mdi-weather-pouring', high: 22, low: 16,
      },
    ],
    connectionStatus: 'Connected',
    isOnline: true,
  }),
  computed: {
    isAuthenticated() {
      return isAuthenticated();
    },
    displayName() {
      const token = this.$store.state.auth.token;
      if (!token) return '';
      try {
        const decoded = jwtDecode(token);
        const user = decoded.user || {};
        return user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || '';
      } catch (e) { return ''; }
    },
    connectionColor() {
      return this.isOnline ? 'success' : 'error';
    },
    userPermissions() {
      const token = this.$store.state.auth.token;
      if (!token) return [];
      try {
        const decoded = jwtDecode(token);
        return decoded.user?.permissions || [];
      } catch (error) {
        console.error('Error decoding token:', error);
        return [];
      }
    },
    userRole() {
      const token = this.$store.state.auth.token;
      if (!token) return null;
      try {
        const decoded = jwtDecode(token);
        return decoded.role || decoded.user?.role || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    },
  },
  methods: {
    // New: combine role + permission checks per item
    canView(item) {
      const roleOk = !item.roles || item.roles.length === 0
        ? true
        : (this.userRole && item.roles.includes(this.userRole));

      const perms = Array.isArray(item.permissions) ? item.permissions : [];
      const permOk = perms.length === 0
        ? true
        : perms.some((p) => this.userPermissions.includes(p));

      return roleOk && permOk;
    },
    async submitFeatureRequest() {
      if (!this.featureRequest.trim()) return;

      this.isSubmitting = true;
      try {
        await axios.post('/api/feature-requests', {
          requestType: this.requestType.toUpperCase(),
          message: this.featureRequest,
          userId: getCurrentUserId(),
          userSection: getCurrentUserRole(),
        });
        this.featureRequest = '';
        this.requestType = 'feature';
        this.$toast.success('Thank you for your suggestion!');
      } catch (error) {
        this.$toast.error('Failed to submit request. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    },
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
      this.connectionStatus = this.isOnline ? 'Connected' : 'Offline';
    },
  },
  mounted() {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  },
  beforeDestroy() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  },
};
</script>

<style scoped>
/* Modernized Drawer */
.futuristic-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.96), rgba(245, 250, 240, 0.96)) !important;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border-right: 1px solid rgba(15, 23, 42, 0.06);
  padding-left: 0;
}
.drawer-header {
  position: relative;
  padding: 12px 12px 8px 12px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}
.brand-row { display: flex; align-items: center; justify-content: space-between; }
.brand-badge { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: rgba(34,197,94,0.12); color: #16a34a; border: 1px solid rgba(34,197,94,0.25); font-weight: 700; }
.user-mini { display: flex; align-items: center; margin-top: 10px; padding: 10px; border-radius: 12px; background: rgba(255,255,255,0.7); border: 1px solid rgba(15,23,42,0.06); }
.user-info { display: flex; flex-direction: column; }
.user-info .name { font-weight: 800; font-size: 0.95rem; color: #0f172a; }
.role-chip { display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; color: #334155; background: rgba(15,23,42,0.03); border: 1px solid rgba(15,23,42,0.06); padding: 2px 8px; border-radius: 999px; margin-top: 4px; }

.section-label { font-size: 0.68rem; letter-spacing: .12em; text-transform: uppercase; color: #64748b; padding: 10px 16px 4px; }
.nav-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 4px 6px 8px;
}
.nav-item {
  border-radius: 12px;
}
.nav-item:hover {
  background: rgba(15, 23, 42, 0.035) !important;
}
.nav-active {
  background: linear-gradient(135deg, rgba(34,197,94,0.18), rgba(59,130,246,0.18)) !important;
  border: 1px solid rgba(15,23,42,0.06);
  margin-right: 4px !important;
}
.nav-active .nav-text {
  font-weight: 800;
}
.nav-text {
  font-weight: 800;
  font-size: 0.92rem;
}
.nav-sub { font-size: 0.72rem; color: #64748b; }
.ai-nav-item {
  margin-bottom: 8px !important;
}
.ai-icon-container {
  padding: 0;
}
.gradient-icon {
  background: linear-gradient(45deg, #8d08e8, #05d30f);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}
.pulse-icon {
  animation: pulse 2s infinite;
}
.ai-pulse {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: rgba(232, 232, 232, 0.2);
  border-radius: 50%;
  z-index: 1;
}
@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  70% { transform: scale(1.1); opacity: 0.3; }
  100% { transform: scale(0.95); opacity: 0.7; }
}
.feedback-section {
  padding: 8px;
  margin-top: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
.feedback-panel {
  background: transparent !important;
}
.feedback-header {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 8px;
}
.feedback-content {
  padding: 8px 0;
}
.request-input {
  font-size: 0.8rem;
}
.submit-btn {
  margin-top: 8px;
}
.weather-widget {
  padding: 8px;
  margin: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}
.weather-widget:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.weather-content {
  display: flex;
  align-items: center;
}
.weather-info {
  margin-left: 8px;
}
.weather-temp {
  font-weight: 600;
  font-size: 1.1rem;
}
.weather-location {
  font-size: 0.7rem;
  opacity: 0.8;
}
.weather-dialog {
  border-radius: 12px !important;
}
.weather-dialog-title {
  background: linear-gradient(to right, #00c853, #00b0ff);
  color: white !important;
}
.weather-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
.weather-stat {
  display: flex;
  align-items: center;
}
.weather-stat .v-icon {
  margin-right: 8px;
  color: var(--v-primary-base);
}
.forecast-title {
  margin-bottom: 8px;
  font-weight: 500;
}
.forecast-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  text-align: center;
}
.forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 960px) {
  .nav-text {
    font-size: 0.8rem;
    font-weight: bold;
  }
  .nav-item {
    margin: 2px 4px;
    min-height: 40px;
  }
  .ai-nav-item {
    margin-bottom: 8px !important;
  }
  .feedback-header {
    font-size: 0.7rem;
  }
}
</style>
