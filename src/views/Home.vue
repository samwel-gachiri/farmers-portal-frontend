<template>
  <v-app>
    <!-- Animated Background -->
    <div class="background-animation">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Main Content -->
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" class="tw-text-center">
            <!-- Logo and Title -->
            <div class="mb-10">
              <v-avatar size="80" class="mb-4">
                <v-img src="@/assets/images/logo.png"></v-img>
              </v-avatar>
              <h1 class="tw-text-xl tw-text-h3 tw-text-md-h2 tw-font-bold tw-font-weight-bold tw-mb-2">
                Welcome to <span class="">AgriConnect</span>
              </h1>
              <p class="tw-text-h6 tw-text-md-h5  tw-font-weight-regular">
                Select your role to continue to the platform
              </p>
            </div>

            <!-- Role Cards -->
            <v-row justify="center" class="mt-8">
              <!-- Farmer Card -->
              <v-col cols="12" md="4" class="d-flex">
                <v-hover v-slot="{ hover }">
                  <v-card
                      :elevation="hover ? 12 : 6"
                      class="pa-6 tw-text-center mx-auto role-card"
                      max-width="350"
                      :color="hover ? 'primary lighten-5' : 'white'"
                      @click="openSignIn('farmer')"
                  >
                    <v-avatar size="100" color="primary lighten-4" class="mb-4">
                      <v-img
                          src="@/assets/images/farmer.png"
                          :class="{ 'scale-up': hover }"
                      ></v-img>
                    </v-avatar>
                    <h3 class="tw-text-h4  tw-font-weight-bold  tw-mb-3 primary--text">Farmer</h3>
                    <p v-if="false" class="tw-text-body-1  tw-mb-6">
                      Connect with buyers, showcase your produce, and grow your farming business
                    </p>
                    <v-btn
                        color="primary"
                        large
                        :class="{ 'pulse-btn': hover , 'no-uppercase': false}"
                    >
                      Continue as Farmer
<!--                      <v-icon right>mdi-arrow-right</v-icon>-->
                    </v-btn>
                    <div class="highlight-bar" :class="{ 'active': hover }"></div>
                  </v-card>
                </v-hover>
              </v-col>

              <!-- Buyer Card -->
              <v-col cols="12" md="4" class="d-flex">
                <v-hover v-slot="{ hover }">
                  <v-card
                      :elevation="hover ? 12 : 6"
                      class="pa-6 tw-text-center mx-auto role-card"
                      max-width="350"
                      :color="hover ? 'secondary lighten-5' : 'white'"
                      @click="openSignIn('buyer')"
                  >
                    <v-avatar size="100" color="secondary lighten-4" class=" tw-mb-4">
                      <v-img
                          src="@/assets/images/buyer.png"
                          :class="{ 'scale-up': hover }"
                      ></v-img>
                    </v-avatar>
                    <h3 class="tw-text-h4  tw-font-weight-bold  tw-mb-3 secondary--text">Buyer</h3>
                    <p v-if="false" class="tw-text-body-1  tw-mb-6">
                      Source fresh produce directly from farmers with quality assurance
                    </p>
                    <v-btn
                        color="secondary"
                        large
                        :class="{ 'pulse-btn': hover, 'no-uppercase': false }"
                    >
                      Continue as Buyer
<!--                      <v-icon right>mdi-arrow-right</v-icon>-->
                    </v-btn>
                    <div class="highlight-bar" :class="{ 'active': hover }"></div>
                  </v-card>
                </v-hover>
              </v-col>

              <!-- Admin Card -->
              <v-col cols="12" md="4" class="d-flex">
                <v-hover v-slot="{ hover }">
                  <v-card
                      :elevation="hover ? 12 : 6"
                      class="pa-6 tw-text-center mx-auto role-card"
                      max-width="350"
                      :color="hover ? 'accent lighten-5' : 'white'"
                      @click="openSignIn('admin')"
                  >
                    <v-avatar size="100" color="accent lighten-4" class=" tw-mb-4">
                      <v-img
                          src="@/assets/images/admin.png"
                          :class="{ 'scale-up': hover }"
                      ></v-img>
                    </v-avatar>
                    <h3 class="tw-text-h4  tw-font-weight-bold  tw-mb-3 text-black">Admin</h3>
                    <p v-if="false" class="tw-text-body-1  tw-mb-6">
                      Manage platform operations, verify users, and ensure smooth transactions
                    </p>
                    <v-btn
                        color="accent"
                        large
                        :class="{ 'pulse-btn': hover, 'no-uppercase': false}"
                    >
                      Continue as Admin
<!--                      <v-icon right>mdi-arrow-right</v-icon>-->
                    </v-btn>
                    <div class="highlight-bar" :class="{ 'active': hover }"></div>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>

            <!-- Sign In Option -->
            <div v-if="false" class="mt-12">
              <p class="tw-text-body-1  tw-mb-2">Already have an account?</p>
              <v-btn
                  text
                  color="primary"
                  @click="$router.push({ name: 'SignIn' })"
              >
                Sign in here
                <v-icon right>mdi-login</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { getCurrentUserRole } from '@/utils/roles.js';
import { NOTIFICATIONS } from '@/utils/const.js';

export default {
  methods: {
    async openSignIn(name) {
      const userName = name.toString().toLowerCase();
      if (getCurrentUserRole() !== userName) {
        await this.$store.dispatch('auth/signOut');
        if (localStorage != null) {
          localStorage.removeItem(NOTIFICATIONS);
          if (caches) {
            caches.keys().then((arr) => {
              arr.forEach((key) => {
                caches.delete(key);
              });
            });
          }
        }
      }
      await this.$store.dispatch('auth/setViewRole', userName);
      await this.$router.push({ name: 'SignIn', query: { r: btoa(window.location.href) } });
    },
  },
  computed: {
    getCurrentUserRole,
  },
};
</script>

<style scoped>
/* Background Animation */
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
  animation: circle-clockwise 15s infinite linear;
}

.circle-2 {
  width: 400px;
  height: 400px;
  background: var(--v-secondary-base);
  bottom: -100px;
  right: -50px;
  animation: circle-clockwise 18s infinite linear;
  animation-delay: 2s;
}

.circle-3 {
  width: 300px;
  height: 300px;
  background: var(--v-accent-base);
  top: 50%;
  left: 30%;
  animation: circle-clockwise 12s infinite linear;
  animation-delay: 4s;
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(50px, 50px);
  }
  100% {
    transform: translate(0, 0);
  }
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
/* Card Styles */
.role-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
  overflow: hidden;
  position: relative;
  height: 100%;
}

.highlight-bar {
  /* position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--v-primary-base), var(--v-secondary-base));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease; */
}

.highlight-bar.active {
  transform: scaleX(1);
}

.scale-up {
  animation: scaleUp 0.5s ease forwards;
}

@keyframes scaleUp {
  to {
    transform: scale(1.1);
  }
}

.pulse-btn {
  animation: pulse 1.5s infinite;
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

/* Vuetify Overrides */
.v-application .primary {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
}

.v-application .secondary {
  background-color: #ff8f00 !important;
  border-color: #ff8f00 !important;
}

.v-application .accent {
  background-color: #00acc1 !important;
  border-color: #00acc1 !important;
}
.no-uppercase {
  text-transform: none !important;
}
</style>
