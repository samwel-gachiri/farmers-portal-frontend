<template>
  <nav class="tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-bg-white tw-shadow-lg tw-z-50 tw-flex tw-justify-around tw-items-center tw-h-16">
    <router-link
      v-for="item in filteredNavItems"
      :key="item.text"
      :to="item.link"
      class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-h-full"
      :aria-label="item.text"
      exact
    >
      <v-btn icon :color="isActive(item) ? 'primary' : 'grey darken-1'" class="tw-mb-0.5" :aria-label="item.text">
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
      <span class="tw-text-xs tw-leading-none tw-font-medium tw-text-gray-700" :class="{'tw-text-primary': isActive(item)}">
        {{ item.short || item.text.split(' ')[0] }}
      </span>
    </router-link>
  </nav>
</template>

<script>
import { getCurrentUserId, viewPermissions, getCurrentUserRole } from '@/utils/roles.js';

export default {
  name: 'BottomNav',
  methods: {
    viewPermissions,
    isActive(item) {
      // Check if the current route matches the nav item
      return this.$route.name === (item.link && item.link.name);
    },
  },
  computed: {
    navItems() {
      // Only show a subset of main navigation items for mobile
      const items = [
        {
          icon: 'mdi-view-dashboard',
          text: 'Dashboard',
          short: 'Home',
          link: { name: 'Dashboard' },
          roles: ['buyer', 'admin'],
        },
        {
          icon: 'mdi-account-group',
          text: 'Community',
          short: 'Comm',
          link: { name: 'Community' },
          roles: ['farmer', 'buyer', 'anybody'],
        },
        {
          icon: 'mdi-cash-multiple',
          text: 'My Sales',
          short: 'Sales',
          link: { name: 'Listings' },
          roles: ['farmer'],
        },
        {
          icon: 'mdi-sprout',
          text: 'My Farm',
          short: 'Farm',
          link: { name: 'Produces', params: { farmerId: getCurrentUserId() } },
          roles: ['farmer'],
        },
      ];
      // If farmer, ensure Orders/Browse Requests aren't present
      const role = getCurrentUserRole && getCurrentUserRole();
      if (role === 'FARMER') {
        return items.filter((i) => !['My Orders', 'Browse Requests'].includes(i.text));
      }
      return items;
    },
    filteredNavItems() {
      // Filter nav items based on permissions
      return this.navItems.filter((item) => this.viewPermissions(item.roles));
    },
  },
};
</script>

<style scoped>
/* Ensure the nav is always above other content */
nav {
  box-shadow: 0 -2px 12px rgba(0,0,0,0.07);
}
</style>
