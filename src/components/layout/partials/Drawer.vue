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
        </div>
        <div class="app-user-mini tw-w-full" v-if="displayName || userRole">
          <span class="app-portal-badge">Portal</span>
<!--          <avatar class="mr-2" />-->
          <div class="app-user-info tw-flex tw-flex-row tw-border tw-py-2 tw-px-4 tw-rounded-lg">
            <div class="app-user-name">{{ displayName || 'User' }}</div>
            <div class="app-role-chip">
              <span>{{ userRole || 'Guest' }}</span>
            </div>
          </div>
        </div>

        <!-- Role Indicator -->
        <role-indicator />
      </div>

      <!-- Navigation (comprehensive, role-based) -->
      <nav class="app-nav-list">
        <template v-for="(item, i) in navigationItems">
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
// eslint-disable-next-line vue/no-unused-components
import Avatar from '@/components/layout/partials/nav/Avatar.vue';
import RoleIndicator from '@/components/shared/RoleIndicator.vue';
import { getCurrentUserId } from '@/utils/roles.js';

export default {
  name: 'AppDrawer',
  // eslint-disable-next-line vue/no-unused-components
  components: { LogoTitle, Avatar, RoleIndicator },
  data: () => ({
    navigationItems: [
      // Common: Dashboard for all roles
      {
        icon: 'mdi-apps-box',
        text: 'Dashboard',
        link: { name: 'Dashboard' },
        roles: ['FARMER', 'BUYER', 'EXPORTER', 'SYSTEM_ADMIN', 'ZONE_SUPERVISOR'],
        iconColor: '#222',
      },

      // === FARMER PORTAL ===
      {
        icon: 'mdi-barn',
        text: 'My Farm',
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
        text: 'Orders',
        link: { name: 'FarmerOrders' },
        roles: ['FARMER'],
        iconColor: '#0ea5e9',
      },
      {
        icon: 'mdi-chart-line',
        text: 'Reports',
        link: { name: 'FarmerReports' },
        roles: ['FARMER'],
        iconColor: '#8b5cf6',
      },

      // === BUYER PORTAL ===
      {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        icon: 'mdi-account-group',
        text: 'My Farmers',
        link: { name: 'MyFarmers' },
        roles: ['BUYER'],
        iconColor: '#16a34a',
      },
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
      {
        icon: 'mdi-map-marker-path',
        text: 'Pickup Planning',
        link: { name: 'PickupPlanning' },
        roles: ['BUYER'],
        iconColor: '#f59e0b',
      },
      {
        icon: 'mdi-chart-areaspline',
        text: 'Analytics',
        link: { name: 'BuyerAnalytics' },
        roles: ['BUYER'],
        iconColor: '#8b5cf6',
      },

      // === EXPORTER PORTAL (Super Admin role: 'exporter') ===
      {
        icon: 'mdi-map-marker-radius',
        text: 'Zone Management',
        link: { name: 'ZoneManagement' },
        roles: ['EXPORTER', 'SYSTEM_ADMIN'],
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
        icon: 'mdi-account-supervisor',
        text: 'Zone Supervisors',
        link: { name: 'ZoneSupervisorsManagement' },
        roles: ['EXPORTER', 'SYSTEM_ADMIN'],
        iconColor: '#16a34a',
      },
      {
        icon: 'mdi-account-multiple',
        text: 'Farmers Management',
        link: { name: 'FarmersManagement' },
        roles: ['EXPORTER', 'SYSTEM_ADMIN'],
        iconColor: '#f97316',
      },
      {
        icon: 'mdi-truck-delivery',
        text: 'Pickup Schedules',
        link: { name: 'PickupSchedulesManagement' },
        roles: ['EXPORTER', 'SYSTEM_ADMIN'],
        iconColor: '#0ea5e9',
      },
      {
        icon: 'mdi-routes',
        text: 'Pickup Routes',
        link: { name: 'PickupRoutes' },
        roles: ['EXPORTER', 'SYSTEM_ADMIN'],
        iconColor: '#ec4899',
      },
      {
        icon: 'mdi-comment-multiple-outline',
        text: 'Zone Comments',
        link: { name: 'ZoneCommentsManagement' },
        roles: ['EXPORTER', 'SYSTEM_ADMIN'],
        iconColor: '#f59e42',
      },
      {
        icon: 'mdi-chart-box-outline',
        text: 'System Analytics',
        link: { name: 'SystemAnalytics' },
        roles: ['EXPORTER', 'SYSTEM_ADMIN'],
        iconColor: '#8b5cf6',
      },

      // === ZONE SUPERVISOR PORTAL ===
      {
        icon: 'mdi-map-marker-path',
        text: 'Zone Management',
        link: { name: 'ZoneManagement' },
        roles: ['ZONE_SUPERVISOR'],
        iconColor: '#f59e42',
      },
      {
        icon: 'mdi-comment-multiple-outline',
        text: 'Zone Comments',
        link: { name: 'ZoneCommentsManagement' },
        roles: ['ZONE_SUPERVISOR'],
        iconColor: '#f59e42',
      },
      {
        icon: 'mdi-account-multiple',
        text: 'Zone Farmers',
        link: { name: 'ZoneFarmers' },
        roles: ['ZONE_SUPERVISOR'],
        iconColor: '#16a34a',
      },
      {
        icon: 'mdi-truck-delivery',
        text: 'Zone Pickups',
        link: { name: 'ZonePickups' },
        roles: ['ZONE_SUPERVISOR'],
        iconColor: '#0ea5e9',
      },

      // === SYSTEM ADMIN PORTAL ===
      {
        icon: 'mdi-account-group',
        text: 'Users Report',
        link: { name: 'UsersReport' },
        roles: ['ADMIN'],
        iconColor: '#6366f1',
      },
      {
        icon: 'mdi-file-document-outline',
        text: 'Orders Report',
        link: { name: 'OrdersReport' },
        roles: ['ADMIN'],
        iconColor: '#0ea5e9',
      },
      {
        icon: 'mdi-chart-line',
        text: 'System Reports',
        link: { name: 'SystemReports' },
        roles: ['ADMIN'],
        iconColor: '#8b5cf6',
      },
      {
        icon: 'mdi-cog',
        text: 'System Settings',
        link: { name: 'SystemSettings' },
        roles: ['ADMIN'],
        iconColor: '#64748b',
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
  /* border: 1px solid rgba(34,197,94,0.08);*/
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
