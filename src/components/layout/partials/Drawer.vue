<template>
  <div class="futuristic-drawer tw-border-l-5">
    <!-- Drawer Header with Holographic Effect -->
    <div class="drawer-header">
      <logo-title class="holographic-logo"></logo-title>
      <UserRole/>
      <div class="connection-status">
        <v-chip v-if="false" small label class="status-chip" :color="connectionColor">
          <v-icon small left>mdi-access-point</v-icon>
          {{ connectionStatus }}
        </v-chip>
      </div>
    </div>

    <!-- Main Navigation -->
    <v-list dense class="nav-list">
      <!-- Farm AI Special Item -->
      <v-menu
          right
          offset-x
          open-on-hover
          close-delay="100"
          open-delay="300"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-list-item
              key="aiagent"
              link
              :to="{ name: 'FarmAI' }"
              active-class="nav-active"
              class="nav-item ai-nav-item"
              v-bind="attrs"
              v-on="on"
          >
            <v-list-item-action>
              <div class="ai-icon-container">
                <v-icon left class="gradient-icon">mdi-sparkles</v-icon>
              </div>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="nav-text">
                Farm AI
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-card class="hover-menu-card" max-width="250">
          <v-card-text class="py-2">
            <div class="font-weight-medium mb-1">Farm AI</div>
            <div class="text-caption">AI-powered farming insights and recommendations</div>
          </v-card-text>
        </v-card>
      </v-menu>

      <!-- Regular Navigation Items -->
      <template v-for="(item, i) in items">
        <v-menu
            v-if="viewPermissions((item.roles))"
            :key="i"
            right
            offset-x
            open-on-hover
            close-delay="100"
            open-delay="300"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item
                link
                :to="item.link"
                active-class="nav-active"
                class="nav-item"
                v-bind="attrs"
                v-on="on"
            >
              <v-list-item-action>
                <v-icon :color="item.iconColor || 'primary'">{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="nav-text">
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action v-if="item.notifications" class="notification-badge">
                <v-badge
                    color="error"
                    :content="item.notifications"
                    inline
                ></v-badge>
              </v-list-item-action>
            </v-list-item>
          </template>
          <v-card class="hover-menu-card" max-width="250">
            <v-card-text class="py-2">
              <div class="font-weight-medium mb-1">{{ item.text }}</div>
              <div class="text-caption">{{ item.desc || 'Navigate to ' + item.text }}</div>
            </v-card-text>
          </v-card>
        </v-menu>
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
import {
  getCurrentUserId, getCurrentUserRole, isAuthenticated, viewPermissions,
} from '@/utils/roles.js';
import LogoTitle from '@/components/shared/LogoText.vue';
import axios from 'axios';
import UserRole from '@/components/layout/partials/nav/UserRole.vue';

export default {
  name: 'FuturisticDrawer',
  methods: {
    viewPermissions,
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
      this.connectionStatus = this.isOnline ? 'Connected' : 'Offline';
    },
    async submitFeatureRequest() {
      if (!this.featureRequest.trim()) return;

      this.isSubmitting = true;
      try {
        // Here you would typically send to your backend
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
  },
  components: { UserRole, LogoTitle },
  data: () => ({
    items: [
      {
        icon: 'mdi-view-dashboard',
        text: 'Dashboard',
        link: { name: 'Dashboard' },
        roles: ['buyer', 'admin'],
        iconColor: 'black',
      },
      {
        icon: 'mdi-account-group',
        text: 'Community',
        desc: 'Look for farmers and buyers here',
        link: { name: 'Community' },
        roles: ['farmer', 'buyer', 'anybody'],
        iconColor: 'primary',
      },
      {
        icon: 'mdi-cash-multiple',
        text: 'My Sales',
        desc: 'Post your produce here',
        link: { name: 'Listings' },
        roles: ['farmer'],
        iconColor: 'black',
        notifications: 0,
      },
      {
        icon: 'mdi-cash-multiple',
        text: 'My Requests',
        desc: 'Post what you want supplied here',
        link: { name: 'Requests' },
        roles: ['buyer'],
        iconColor: 'black',
        notifications: 0,
      },
      {
        icon: 'mdi-magnify',
        text: 'Browse Listings',
        desc: 'Look for produce here',
        link: { name: 'BrowseListings' },
        roles: ['buyer', 'anybody'],
        iconColor: 'black',
      },
      {
        icon: 'mdi-magnify',
        text: 'Browse Request',
        desc: 'Look for buyers request here and make a bid to supply',
        link: { name: 'BrowseRequests' },
        roles: ['farmer', 'anybody'],
        iconColor: 'black',
      },
      {
        icon: 'mdi-cart',
        text: 'My Orders',
        desc: 'View what you ordered here',
        link: { name: 'BuyerOrders' },
        roles: ['buyer'],
        iconColor: 'black',
      },
      {
        icon: 'mdi-sprout',
        text: 'My Farm',
        desc: 'View your farm here',
        link: { name: 'Produces', params: { farmerId: getCurrentUserId() } },
        roles: ['farmer'],
        iconColor: 'darkgreen',
      },
      {
        icon: 'mdi-chart-areaspline',
        text: 'Reports',
        desc: 'View your sales report here',
        link: { name: 'FarmerReport' },
        roles: ['farmer'],
        iconColor: 'black',
      },
      {
        icon: 'mdi-chart-bar',
        text: 'Reports',
        desc: 'View your spending report here',
        link: { name: 'BuyerReport' },
        roles: ['buyer'],
        iconColor: 'black',
      },
      {
        icon: 'mdi-account-supervisor',
        text: 'Users',
        desc: 'View active users and sign in graph here',
        link: { name: 'UsersReport' },
        roles: ['admin'],
        iconColor: 'red',
      },
      {
        icon: 'mdi-package-variant',
        text: 'Orders',
        link: { name: 'OrdersReport' },
        roles: ['admin'],
        iconColor: 'deep-orange',
      },
      {
        icon: 'mdi-map-marker-radius',
        text: 'Zone Management',
        link: { name: 'OperatingZonesManagement' },
        roles: ['exporter'],
        iconColor: 'green',
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
    isAuthenticated,
    connectionColor() {
      return this.isOnline ? 'success' : 'error';
    },
  },
  mounted() {
    // Check online status
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
.hover-menu-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.futuristic-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(245, 250, 240, 0.95)) !important;
  backdrop-filter: blur(5px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  padding-left: 0;
}

.drawer-header {
  position: relative;
  padding-left: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.holographic-logo {
  /* filter: drop-shadow(0 0 5px rgba(100, 255, 100, 0.3)); */
  /* transition: all 0.3s ease; */
}

.holographic-logo:hover {
  filter: drop-shadow(0 0 10px rgba(100, 255, 100, 0.5));
}

.connection-status {
  position: absolute;
  bottom: 5px;
  right: 0;
}

.status-chip {
  font-size: 0.6rem;
  height: 20px;
  border-radius: 10px;
}

.nav-list {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}

.nav-item {
  border-radius: 8px;
  /* transition: all 0.3s ease; */
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.03) !important;
  /* transform: translateX(3px); */
}

.nav-active {
  background: rgba(226,232,240,255) !important;
  margin-right: 8px !important;
  /* color: var(--v-primary-base) !important; */
}

.nav-active .nav-text {
  /* color: var(--v-primary-base) !important; */
  font-weight: 800;
}

.nav-text {
  font-weight: 800;
  font-size: 0.9rem;
}

.ai-nav-item {
  /* background: #0D2B1D !important; */
  /* border: 1px dashed rgba(100, 200, 100, 0.3); */
  margin-bottom: 8px !important;
}

.ai-icon-container {
  /* position: relative; */
  padding: 0;
}

.gradient-icon {
  background: linear-gradient(45deg, #8d08e8, #05d30f);
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
  /* animation: pulse 2s infinite; */
  z-index: 1;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
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

/* Responsive Adjustments */
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
