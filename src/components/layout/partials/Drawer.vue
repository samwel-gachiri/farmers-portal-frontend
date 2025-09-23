<template>
  <div class="app-drawer-wrap">
    <div class="app-drawer-bg">
      <div class="app-drawer-shape shape-1"></div>
      <div class="app-drawer-shape shape-2"></div>
    </div>
    <div class="app-drawer-glass">
      <!-- Header: Brand + User (minimal) -->
      <div class="app-drawer-header">
        <div class="app-brand-row">
          <logo-title class="app-brand" />
          <span class="app-portal-badge">Portal</span>
        </div>
        <div class="app-user-mini" v-if="displayName || userRole">
          <avatar class="mr-2" />
          <div class="app-user-info tw-flex tw-flex-row">
            <div class="app-user-name">{{ displayName || 'User' }}</div>
            <div class="app-role-chip">
              <span>{{ userRole || 'Guest' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation (minimal, clean, modern icons) -->
      <nav class="app-nav-list">
        <template v-for="(item, i) in minimalNav">
          <router-link
            v-if="canView(item)"
            :key="i"
            :to="item.link"
            class="app-nav-item"
            active-class="app-nav-active"
            exact
          >
            <span class="app-nav-icon">
              <v-icon :color="item.iconColor || 'primary'">{{ item.icon }}</v-icon>
            </span>
            <span class="app-nav-text">{{ item.text }}</span>
          </router-link>
        </template>
      </nav>

      <!-- Feedback (minimal) -->
      <div class="app-feedback-section">
        <v-btn block text color="primary" class="app-feedback-btn" @click="$emit('openFeedback')">
          <v-icon left>mdi-lightbulb-outline</v-icon>
          Suggest Improvement
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>

import jwtDecode from 'jwt-decode';
import LogoTitle from '@/components/shared/LogoText.vue';
import Avatar from '@/components/layout/partials/nav/Avatar.vue';
import { getCurrentUserId } from '@/utils/roles.js';

export default {
  name: 'AppDrawer',
  components: { LogoTitle, Avatar },
  data: () => ({
    minimalNav: [
      // Common: Dashboard
      {
        icon: 'mdi-apps-box',
        text: 'Dashboard',
        link: { name: 'Dashboard' },
        roles: ['FARMER', 'BUYER', 'EXPORTER', 'SYSTEM_ADMIN', 'ZONE_SUPERVISOR'],
        iconColor: '#222',
      },
      // Farmer
      {
        icon: 'mdi-barn',
        text: 'My Farm',
        // Use a function to generate the link with the current user id
        get link() {
          const id = getCurrentUserId();
          return id ? { name: 'MyFarm', params: { farmerId: id } } : { name: 'MyFarm' };
        },
        roles: ['FARMER'],
        iconColor: '#16a34a',
      },
      {
        icon: 'mdi-sprout-outline',
        text: 'Harvest & Yields',
        link: { name: 'HarvestAndYields' },
        roles: ['FARMER'],
        iconColor: '#f97316',
      },
      {
        icon: 'mdi-format-list-bulleted-square',
        text: 'Listings',
        link: { name: 'Listings' },
        roles: ['FARMER'],
        iconColor: '#6366f1',
      },
      {
        icon: 'mdi-truck-delivery-outline',
        text: 'Farmer Orders',
        link: { name: 'FarmerOrders' },
        roles: ['FARMER'],
        iconColor: '#0ea5e9',
      },
      // Buyer
      {
        icon: 'mdi-magnify',
        text: 'Browse Listings',
        link: { name: 'BrowseListings' },
        roles: ['BUYER'],
        iconColor: '#6366f1',
      },
      {
        icon: 'mdi-cart-outline',
        text: 'My Orders',
        link: { name: 'BuyerOrders' },
        roles: ['BUYER'],
        iconColor: '#0ea5e9',
      },
      // Exporter
      {
        icon: 'mdi-map-marker-path',
        text: 'Zone Management',
        link: { name: 'ZoneManagement' },
        roles: ['EXPORTER'],
        iconColor: '#f59e42',
      },
      {
        icon: 'mdi-account-group',
        text: 'System Admins',
        link: { name: 'SystemAdminsManagement' },
        roles: ['EXPORTER'],
        iconColor: '#6366f1',
      },
      {
        icon: 'mdi-account-tie',
        text: 'Zone Supervisors',
        link: { name: 'ZoneSupervisorsManagement' },
        roles: ['EXPORTER'],
        iconColor: '#16a34a',
      },
      {
        icon: 'mdi-account-multiple',
        text: 'Farmers',
        link: { name: 'FarmersManagement' },
        roles: ['EXPORTER'],
        iconColor: '#f97316',
      },
      {
        icon: 'mdi-calendar-clock',
        text: 'Pickup Schedules',
        link: { name: 'PickupSchedulesManagement' },
        roles: ['EXPORTER'],
        iconColor: '#0ea5e9',
      },
      {
        icon: 'mdi-comment-multiple-outline',
        text: 'Zone Comments',
        link: { name: 'ZoneCommentsManagement' },
        roles: ['EXPORTER'],
        iconColor: '#f59e42',
      },
      // Zone Supervisor
      {
        icon: 'mdi-map-marker-path',
        text: 'Zone Management',
        link: { name: 'ZoneManagement' },
        roles: ['ZONE_SUPERVISOR'],
        iconColor: '#f59e42',
      },
      // System Admin
      {
        icon: 'mdi-account-group',
        text: 'Users Report',
        link: { name: 'UsersReport' },
        roles: ['SYSTEM_ADMIN'],
        iconColor: '#6366f1',
      },
      {
        icon: 'mdi-file-document-outline',
        text: 'Orders Report',
        link: { name: 'OrdersReport' },
        roles: ['SYSTEM_ADMIN'],
        iconColor: '#0ea5e9',
      },
    ],
  }),
  computed: {
    displayName() {
      const token = this.$store.state.auth.token;
      if (!token) return '';
      try {
        const decoded = jwtDecode(token);
        const user = decoded.user || {};
        return user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || '';
      } catch (e) { return ''; }
    },
    userRole() {
      const token = this.$store.state.auth.token;
      if (!token) return null;
      try {
        const decoded = jwtDecode(token);
        return decoded.role || decoded.user?.role || null;
      } catch (error) { return null; }
    },
  },
  methods: {
    canView(item) {
      return !item.roles || item.roles.length === 0
        ? true
        : (this.userRole && item.roles.includes(this.userRole));
    },
  },
};
</script>

<style scoped>
.app-drawer-wrap {
  position: relative;
  height: 100vh;
  min-width: 300px;
  max-width: 360px;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 20;
  right: 0;
  box-shadow: -4px 0 32px rgba(34,197,94,0.06);
}
.app-drawer-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.app-drawer-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);
  opacity: 0.18;
  animation: app-drawer-float 18s ease-in-out infinite;
}
.app-drawer-shape.shape-1 {
  width: 180px; height: 180px; top: -40px; right: -40px;
  background: radial-gradient(circle at 70% 30%, #a7f3d0 0%, #38bdf8 80%, transparent 100%);
  animation-delay: 0s;
}
.app-drawer-shape.shape-2 {
  width: 120px; height: 120px; bottom: 10%; right: 10%;
  background: radial-gradient(circle at 80% 80%, #c7d2fe 0%, #f0abfc 80%, transparent 100%);
  animation-delay: 2.5s;
}
@keyframes app-drawer-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(18px) scale(1.03); }
}
.app-drawer-glass {
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.92);
  border-left: 1px solid rgba(34,197,94,0.08);
  box-shadow: -4px 0 32px rgba(34,197,94,0.06);
  backdrop-filter: blur(12px) saturate(160%);
  border-top-right-radius: 24px;
  overflow: hidden;
}
.app-drawer-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 24px 18px 12px 18px;
  border-bottom: 1px solid rgba(34,197,94,0.08);
  background: rgba(255,255,255,0.98);
  z-index: 2;
}
.app-brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.app-brand {
  margin-bottom: 2px;
}
.app-portal-badge {
  background: #16a34a;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 10px;
  margin-left: 4px;
  letter-spacing: 0.02em;
  box-shadow: 0 1px 4px rgba(34,197,94,0.08);
}
.app-user-mini {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(34,197,94,0.08);
  box-shadow: 0 1px 4px rgba(34,197,94,0.04);
}
.app-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.app-user-name {
  font-weight: 700;
  font-size: 1.01rem;
  color: #0f172a;
}
.app-role-chip {
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  color: #334155;
  background: rgba(34,197,94,0.08);
  border: 1px solid rgba(34,197,94,0.08);
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: 600;
}
.app-nav-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 18px 0 0 0;
  flex: 1 1 auto;
}
.app-nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 24px 10px 24px;
  border-radius: 12px;
  color: #222;
  font-weight: 500;
  font-size: 1.01rem;
  text-decoration: none;
  transition: background 0.18s, color 0.18s;
}
.app-nav-item:hover {
  background: rgba(34,197,94,0.07);
  color: #16a34a;
}
.app-nav-active {
  background: rgba(34,197,94,0.13) !important;
  color: #16a34a !important;
  font-weight: 700;
}
.app-nav-icon {
  display: flex;
  align-items: center;
  font-size: 1.3em;
}
.app-nav-text {
  font-size: 1.01rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}
.app-feedback-section {
  padding: 18px 18px 18px 18px;
  margin-top: auto;
  border-top: 1px solid rgba(34,197,94,0.08);
  background: rgba(255,255,255,0.98);
  box-shadow: 0 -2px 8px rgba(34,197,94,0.03);
}
.app-feedback-btn {
  font-weight: 600;
  font-size: 1.01rem;
  letter-spacing: 0.01em;
  border-radius: 10px;
  padding: 10px 0;
  text-transform: none;
}
@media (max-width: 1200px) {
  .app-drawer-wrap { min-width: 220px; }
}
@media (max-width: 960px) {
  .app-drawer-wrap { min-width: 0; max-width: 100vw; }
  .app-nav-text { font-size: 0.95rem; }
  .app-nav-item { min-height: 38px; }
}
</style>
}
