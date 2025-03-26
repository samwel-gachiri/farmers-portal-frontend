<template>
  <div>
    <v-list dense>
      <div class="tw-mx-4 tw-py-3 md:tw-py-5 tw-mb-8">
          <logo-title></logo-title>
      </div>
      <template v-for="item in items">
        <v-list-item
            v-if="viewPermissions((item.roles))"
            :key="item.text"
            link
            :to="item.link"
            active-class="nav-active"
            class="tw-mx-4 md:tw-mt-2 mdi-lis tw-mt-5 "
        >
          <v-list-item-action>
            <v-icon color="black">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="tw-text-black tw-font-bold">
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <!--    <claims-modal v-if="$route.name !== 'Dashboard'" />-->
  </div>
</template>

<script>
import { getCurrentUserId, isAuthenticated, viewPermissions } from '@/utils/roles.js';
import LogoTitle from '@/components/shared/LogoText.vue';

export default {
  name: 'Drawer',
  methods: { viewPermissions },
  components: { LogoTitle },
  data: () => ({
    items: [
      {
        icon: 'mdi-apps',
        text: 'Dashboard',
        link: { name: 'Dashboard' },
        roles: ['farmer', 'buyer'],
      },
      {
        icon: 'mdi-account-group',
        text: 'Community',
        link: { name: 'Community' },
        roles: ['farmer', 'buyer'],
      },
      {
        icon: 'mdi-web',
        text: 'Browse Listings',
        link: {
          name: 'BrowseListings',
        },
        roles: ['buyer'],
      },
      {
        icon: 'mdi-cash-multiple',
        text: 'Listings',
        link: { name: 'Listings' },
        roles: ['farmer'],
      },
      {
        icon: 'mdi-corn',
        text: 'My Produces',
        link: {
          name: 'Produces',
          params: { farmerId: getCurrentUserId() },
        },
        roles: ['farmer'],
      },
      {
        icon: 'mdi-corn',
        text: 'My Orders',
        link: {
          name: 'BuyerOrders',
        },
        roles: ['buyer'],
      },
      {
        icon: 'mdi-cart-plus',
        text: 'My Requests',
        link: { name: 'Requests' },
        roles: ['buyer'],
      },
      {
        icon: 'mdi-chart-pie',
        text: 'Reports',
        link: { name: 'FarmerReport' },
        roles: ['farmer'],
      },
      {
        icon: 'mdi-chart-pie',
        text: 'Reports',
        link: { name: 'BuyerReport' },
        roles: ['buyer'],
      },
      // { icon: 'mdi-tractor', text: 'Sell produce', link: { name: 'sales', query: { toSamwel: true } } },
    ],
  }),
  computed: {
    isAuthenticated,
  },
};
</script>

<style scoped>
.tw-font-bold {
  font-weight: 600!important;
}
.nav-active{
  background-color: #a6a6a5;
  color: white;
  margin-right: 1.5rem;
}
</style>
