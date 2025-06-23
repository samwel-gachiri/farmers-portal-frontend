<template>
  <v-app id="agri-future">
    <!-- Navigation Drawer -->
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
          v-show="$vuetify.breakpoint.mdAndUp"
          class="tw-block lg:tw-hidden"
          @click.stop="mini = !mini"
      >
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="ar-logo ml-2">
        <!-- Logo placeholder -->
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- AI Assistant Button -->
      <v-btn
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

    <!-- Main Content -->
    <v-main class="futuristic-main">
      <v-container
          class="tw-min-h-full tw-bg-bottom tw-pb-40 lg:tw-pb-16"
          fluid
      >
        <div class="content-container tw-pb-10 md:tw-pb-48 tw-h-full tw-w-full">
          <transition name="fade" mode="out-in">
            <div>
              <div class="background-animation">
                <div class="circle circle-1"></div>
                <div class="circle circle-2"></div>
                <div class="circle circle-3"></div>
              </div>
              <slot></slot>
            </div>
          </transition>
        </div>
      </v-container>
    </v-main>

    <!-- Mobile Menu Button -->
    <v-btn
        v-show="$vuetify.breakpoint.smAndDown"
        color="primary"
        dark
        fixed
        bottom
        right
        fab
        @click="toggleDrawer"
        class="mobile-menu-btn"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

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

export default {
  name: 'FuturisticLayout',
  components: {
    ScreenIdle,
    Avatar,
    Drawer,
    NotificationBell,
    AiAssistant,
  },
  data: () => ({
    drawer: true, // Set to true by default to show drawer content immediately
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
.background-animation {
  background-color: #f3ecec;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.20;
}

.circle-1 {
  width: 500px;
  height: 500px;
  background: var(--v-primary-base);
  top: -100px;
  left: -100px;
  /* animation: circle-clockwise 15s infinite linear; */
}

.circle-2 {
  width: 400px;
  height: 400px;
  background: var(--v-secondary-base);
  bottom: -100px;
  right: -50px;
  /* animation: circle-clockwise 18s infinite linear; */
  /* animation-delay: 2s; */
}

.circle-3 {
  width: 300px;
  height: 300px;
  background: var(--v-accent-base);
  top: 50%;
  left: 30%;
  /* animation: circle-clockwise 12s infinite linear; */
  /* animation-delay: 4s; */
}

/* Clockwise circular motion */
@keyframes circle-clockwise {
  0% {
    transform: rotate(0deg) translateX(150px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(150px) rotate(-360deg);
  }
}

/* Anticlockwise circular motion */
@keyframes circle-anticlockwise {
  0% {
    transform: rotate(0deg) translateX(200px) rotate(0deg);
  }
  100% {
    transform: rotate(-360deg) translateX(200px) rotate(360deg);
  }
}
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

/* Mobile Menu Button */
.mobile-menu-btn {
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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
