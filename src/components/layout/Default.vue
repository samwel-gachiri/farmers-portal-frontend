<template>
  <v-app id="agri-future">
    <!-- Navigation Drawer (Toggles on nav icon click) -->
    <v-navigation-drawer
        class="sidebar futuristic-drawer"
        :clipped="false"
        v-model="drawer"
        app
        :mini-variant.sync="mini"
        :permanent="false"
        :temporary="!drawer"
        @mouseover="mini = false"
        @mouseleave="mini = true"
    >
      <drawer :mini="mini" />
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
        app
        :flat="true"
        color="#ebedf1"
        class="glass-navbar"
        :elevate-on-scroll="true"
    >
      <v-app-bar-nav-icon
          class="tw-block"
          @click="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="ar-logo ml-2">
        <!-- Logo placeholder -->
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

      <!-- User Area -->
      <div class="user-area tw-flex tw-items-center tw-border-l-2 tw-border-opacity-50 tw-pl-4">
        <notification-bell class="mr-2" />
        <avatar ref="avatar" />
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

    <!-- Main Content -->
    <v-main class="futuristic-main">
      <v-container
          class="tw-min-h-full tw-bg-bottom tw-pb-40 lg:tw-pb-16"
          fluid
      >
        <div class="content-container tw-pb-10 md:tw-pb-48 tw-h-full tw-w-full">
          <transition name="fade" mode="out-in">
            <div>
              <slot></slot>
            </div>
          </transition>
        </div>
      </v-container>
    </v-main>

    <!-- Bottom Navigation (Mobile Only) -->
    <bottom-nav v-if="$vuetify.breakpoint.smAndDown" />

    <!-- AI Assistant Dialog -->
    <ai-assistant ref="assistant"/>

    <!-- Screen Idle Component -->
    <screen-idle :dialog="isAppIdle" />
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
// Import the new BottomNav component
import BottomNav from '@/components/layout/partials/BottomNav.vue';

export default {
  name: 'FuturisticLayout',
  components: {
    ScreenIdle,
    Avatar,
    Drawer,
    NotificationBell,
    AiAssistant,
    BottomNav,
  },
  data: () => ({
    drawer: false, // Set to true by default to show drawer content immediately
    mini: false,
    isAppIdle: false,
  }),
  computed: {
    ...mapGetters('auth', ['authenticatedUser']),
    // ...mapGetters('farm', ['currentWeather']),
  },
  methods: {
    isAuthenticated,
    activateAI() {
      this.$refs.assistant.openDialog();
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
  mounted() {
    if (this.$vuetify.breakpoint.mdAndUp) {
      // Enable features for desktop if needed
    }
  },
  watch: {
    drawer(val) {
      this.mini = !val;
    },
  },
};
</script>

<style scoped>
/* Glass Morphism Design */
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

.futuristic-main {
  background-color: white;
}

/* AR Logo Animation */
.ar-logo:hover {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
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

/* Hide the sidebar drawer on small screens */
@media (max-width: 959px) {
  .sidebar {
    display: none !important;
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
</style>
