<template>
  <v-app id="inspire">
    <v-navigation-drawer
        class="sidebar"
        v-model="drawer"
        :clipped="false"
        app
    >
      <drawer />
    </v-navigation-drawer>

    <v-app-bar
        :clipped-left="false"
        app
        :flat="true"
        color="white"
        class="tw-rounded-lg"
    >
      <v-app-bar-nav-icon class="tw-block lg:tw-hidden" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
          style="width: 300px"
          class="ml-0 pl-4"
      >
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <div class="tw-w-full tw-flex tw-justify-end tw-items-center">
        <v-btn :to="{ name: 'Notifications' }" class="tw-mb-2" icon>
          <v-badge
              overlap
              :color="$store.getters.notificationCount === 0 ? 'success' : 'error'"
              :content="$store.getters.notificationCount === 0 ? '0' : $store.getters.notificationCount"
          >
            <v-icon class="c-gray-text">mdi-bell</v-icon>
          </v-badge>
        </v-btn>
        <span class="tw-h-6 tw-border-r-2 tw-border-gray-600"></span>
        <avatar />
      </div>
    </v-app-bar>

    <v-main>
      <v-container
          class="fill-height tw-min-h-full c-bg-gray tw-bg-bottom tw-pb-40 lg:tw-pb-16"
          fluid
      >

        <div class="tw-pb-10 md:tw-pb-48 ">
          <slot></slot>
        </div>

      </v-container>
    </v-main>
    <screen-idle :dialog="isAppIdle" />
  </v-app>
</template>

<script>
import Drawer from '@/components/layout/partials/Drawer';
import Avatar from '@/components/layout/partials/nav/Avatar';
import axios from 'axios';
import { mapGetters } from 'vuex';
import ScreenIdle from '@/components/shared/ScreenIdle';

export default {
  name: 'Default',
  components: { ScreenIdle, Avatar, Drawer },
  data: () => ({
    drawer: null,
  }),
  computed: {
    ...mapGetters('auth', ['authenticatedUser']),
  },
  mounted() {
    // this.getClient();
  },
  methods: {
    getClient() {
      axios.get(`/customer/gis/clients/validateclient?pin=${this.authenticatedUser['custom:kra-pin']}&email=${this.authenticatedUser.email}`)
        .then((response) => {
          this.$store.commit('setClient', response?.data?.object);
        });
    },
  },
};
</script>

<style scoped>
.sidebar {
  background-color: rgba(255, 255, 255);
}
</style>
