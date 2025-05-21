<template>
  <v-app id="agri-future">
    <!-- Futuristic Navigation Drawer -->
    <v-navigation-drawer
        class="sidebar futuristic-drawer"
        :clipped="false"
        v-model="drawer"
        app
        :mini-variant.sync="mini"
        :permanent="$vuetify.breakpoint.mdAndUp"
        :temporary="$vuetify.breakpoint.smAndDown"
        @mouseover="mini = false"
        @mouseleave="mini = true"
    >
      <drawer :mini="mini" v-if="drawer"/>
    </v-navigation-drawer>

    <!-- Holographic App Bar -->
    <v-app-bar
        app
        :flat="true"
        color="white"
        class="glass-navbar"
        :elevate-on-scroll="true"
    >
      <v-app-bar-nav-icon
          class="tw-block lg:tw-hidden"
          @click.stop="mini = !mini"
      >
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <!-- Augmented Reality Logo -->
      <v-toolbar-title class="ar-logo ml-2">
<!--        <v-img-->
<!--            :src="require('@/assets/ar-logo.gif')"-->
<!--            contain-->
<!--            height="40"-->
<!--            width="120"-->
<!--            @click="$router.push('/dashboard')"-->
<!--            class="clickable-logo"-->
<!--        />-->
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- AI Assistant Button -->
      <v-btn
          v-if="false"
          fab
          small
          color="primary"
          class="mr-2 ai-assistant"
          @click="activateAI"
      >
        <v-icon>mdi-robot-happy</v-icon>
      </v-btn>

      <!-- Weather Status -->
      <div v-if="false" class="weather-status mr-4 hidden-sm-and-down">
        <v-icon color="yellow">mdi-weather-sunny</v-icon>
        <span class="ml-1">28°C</span>
      </div>

      <!-- User Area -->
      <div class="user-area tw-flex tw-items-center tw-border-l-2 tw-border-opacity-50 tw-pl-4">
        <notification-bell class="mr-2" />
        <avatar />
        <div v-if="!isAuthenticated()" class="ml-4">
          <v-btn
              color="primary"
              class="login-btn"
              to="/signin"
              depressed
              rounded
          >
            <span class="mr-1">Login</span>
            <v-icon small>mdi-login</v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <!-- Main Content with Parallax Background -->
    <v-main class="futuristic-main">
      <v-container
          class="tw-min-h-full tw-bg-bottom tw-pb-40 lg:tw-pb-16"
          fluid
      >

        <!-- Responsive Content Container -->
        <div class="content-container tw-pb-10 md:tw-pb-48 tw-h-full tw-w-full">
          <transition name="fade" mode="out-in">
            <div>
              <slot></slot>
            </div>
          </transition>
        </div>
      </v-container>
    </v-main>

<!--    &lt;!&ndash; Floating Action Button for Mobile &ndash;&gt;-->
<!--    <v-fab-transition>-->
<!--      <v-btn-->
<!--          v-show="$vuetify.breakpoint.smAndDown"-->
<!--          color="primary"-->
<!--          dark-->
<!--          fixed-->
<!--          bottom-->
<!--          right-->
<!--          fab-->
<!--          @click="drawer = !drawer"-->
<!--          class="mobile-menu-btn"-->
<!--      >-->
<!--        <v-icon>mdi-menu</v-icon>-->
<!--      </v-btn>-->
<!--    </v-fab-transition>-->

    <!-- AI Assistant Dialog -->
    <ai-assistant :dialog="aiDialog" @close="aiDialog = false" />

    <!-- Screen Idle Component -->
    <screen-idle :dialog="isAppIdle" />

    <!-- Data Visualization Overlay -->
    <!-- <data-overlay v-if="showDataOverlay" /> -->
  </v-app>
</template>

<script>
import Drawer from '@/components/layout/partials/Drawer.vue';
import Avatar from '@/components/layout/partials/nav/Avatar.vue';
import ScreenIdle from '@/components/shared/ScreenIdle.vue';
import { isAuthenticated } from '@/utils/roles.js';
import { mapGetters } from 'vuex';
import NotificationBell from '@/components/layout/partials/nav/NotificationBell.vue';
import AiAssistant from '@/components/ai/AiAssistant.vue';
// import DataOverlay from '@/components/data/DataOverlay.vue';

export default {
  name: 'FuturisticLayout',
  components: {
    ScreenIdle,
    Avatar,
    Drawer,
    NotificationBell,
    AiAssistant,
    // DataOverlay,
  },
  data: () => ({
    drawer: null,
    mini: true,
    isAppIdle: false,
    aiDialog: false,
    showDataOverlay: false,
  }),
  computed: {
    ...mapGetters('auth', ['authenticatedUser']),
    ...mapGetters('farm', ['currentWeather']),
  },
  methods: {
    isAuthenticated,
    activateAI() {
      this.aiDialog = true;
      // Trigger voice recognition
      this.$voice.startListening();
    },
    checkWeather() {
      // Fetch weather data from IoT sensors
      // this.$store.dispatch('farm/fetchWeather');
    },
  },
  mounted() {
    // Initialize weather check
    // this.checkWeather();
    // setInterval(this.checkWeather, 1800000); // Every 30 minutes

    // Enable data overlay on desktop
    if (this.$vuetify.breakpoint.mdAndUp) {
      this.showDataOverlay = true;
    }
  },
};
</script>

<style scoped>
/* Futuristic Glass Morphism Design */
.glass-navbar {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1) !important;
}

.futuristic-drawer {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.futuristic-drawer:hover {
  /* box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1); */
}

.futuristic-main {
  /* background: linear-gradient(
      to bottom right,
      rgba(245, 250, 240, 0.9),
      rgba(230, 245, 220, 0.9)
  ); */
  background-color: #ebedf1;
  /* background-image: url('~@/assets/bg-pattern.png'); */
  background-size: cover;
  background-attachment: fixed;
}

/* Animated Background Elements */
.bg-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(100, 200, 100, 0.2);
  border-radius: 50%;
  animation: float 15s infinite linear;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-1000px) translateX(1000px);
    opacity: 0;
  }
}

/* Responsive Adjustments */
@media (max-width: 960px) {
  .glass-navbar {
    background: rgba(255, 255, 255, 0.95) !important;
  }

  .futuristic-drawer {
    width: 280px !important;
  }
}

/* AR Logo Animation */
.ar-logo:hover {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* AI Assistant Button */
.ai-assistant {
  box-shadow: 0 0 15px rgba(100, 255, 100, 0.5);
  animation: glow 2s infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 10px rgba(100, 255, 100, 0.5);
  }
  to {
    box-shadow: 0 0 20px rgba(100, 255, 100, 0.8);
  }
}

/* Content Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>

<!--        <v-btn :to="{ name: 'Notifications' }" class="tw-mb-2" icon>-->
<!--          <v-badge-->
<!--              overlap-->
<!--              :color="$store.getters.notificationCount === 0 ? 'success' : 'error'"-->
<!--              :content="$store.getters.notificationCount === 0 ? '0' : $store.getters.notificationCount"-->
<!--          >-->
<!--            <v-icon class="c-gray-text">mdi-bell</v-icon>-->
<!--          </v-badge>-->
<!--        </v-btn>-->
    // getClient() {
    //   axios.get(`/customer/gis/clients/validateclient?pin=${this.authenticatedUser['custom:kra-pin']}&email=${this.authenticatedUser.email}`)
    //     .then((response) => {
    //       this.$store.commit('setClient', response?.data?.object);
    //     });
    // },
