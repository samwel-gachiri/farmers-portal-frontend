<template>
  <div>
    <v-list dense>
      <div class="tw-mx-8 tw-py-3 md:tw-py-5 tw-mb-8">
          <div v-if="isAuthenticated">
            <avatar/>
          </div>
          <div v-else>
            <router-link to="SignIn">Login
              <v-icon>mdi-login</v-icon>
            </router-link>
          </div>
      </div>
      <template v-for="item in items">
        <v-list-item
            :key="item.text"
            link
            :to="item.link"
            active-class="nav-active"
            class="tw-mx-6 md:tw-mt-2 mdi-lis tw-mt-5"
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
import avatar from '@/components/layout/partials/nav/Avatar';
import { isAuthenticated } from '@/utils/roles';

export default {
  name: 'Drawer',
  components: { avatar },
  data: () => ({
    items: [
      { icon: 'mdi-apps', text: 'Dashboard', link: { name: 'Dashboard' } },
      { icon: 'mdi-account-group', text: 'Community', link: { name: 'Community' } },
      // { icon: 'mdi-tractor', text: 'Sell produce', link: { name: 'sales', query: { toSamwel: true } } },
      { icon: 'mdi-cash-multiple', text: 'My Sales', link: { name: 'Listings' } },
      { icon: 'mdi-corn', text: 'Requests', link: { name: 'Requests' } },
      { icon: 'mdi-chart-pie', text: 'Reports', link: { name: 'Report' } },
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
  margin-left: 1.5rem;
}
</style>
