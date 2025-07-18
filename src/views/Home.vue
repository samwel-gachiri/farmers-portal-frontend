<template>
  <div class="tw-relative tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-white tw-to-gray-100">
    <!-- Decorative SVG background graphics -->
    <svg
      class="tw-absolute tw-top-0 tw-left-0 tw-w-1/3 tw-h-1/3 tw-opacity-30 tw-pointer-events-none"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="200" cy="200" r="180" fill="#34d399" />
      <ellipse cx="100" cy="300" rx="80" ry="40" fill="#3b82f6" />
    </svg>
    <svg
      class="tw-absolute tw-bottom-0 tw-right-0 tw-w-1/4 tw-h-1/4 tw-opacity-20 tw-pointer-events-none"
      viewBox="0 0 300 300"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="50" y="50" width="200" height="200" rx="60" fill="#fbbf24" />
      <circle cx="250" cy="250" r="40" fill="#10b981" />
    </svg>
    <div class="tw-bg-white tw-rounded-xl tw-shadow-lg tw-px-8 tw-py-10 tw-w-full tw-max-w-sm tw-flex tw-flex-col tw-items-center">
      <h1 class="tw-text-2xl tw-font-semibold tw-mb-6 tw-text-gray-800">Sign in as</h1>
      <div class="tw-flex tw-flex-col tw-gap-4 tw-w-full">
        <button
          class="tw-w-full tw-py-3 tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-rounded-lg tw-font-medium tw-transition tw-outline-none focus:tw-ring-2 focus:tw-ring-green-300"
          @click="openSignIn('farmer')"
          aria-label="Sign in as Farmer"
        >
          Farmer
        </button>
        <button
          class="tw-w-full tw-py-3 tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-rounded-lg tw-font-medium tw-transition tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-300"
          @click="openSignIn('buyer')"
          aria-label="Sign in as Buyer"
        >
          Buyer
        </button>
        <button
          class="tw-w-full tw-py-3 tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-text-white tw-rounded-lg tw-font-medium tw-transition tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-300"
          @click="openSignIn('exporter')"
          aria-label="Sign in as Exporter"
        >
          Exporter
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUserRole } from '@/utils/roles.js';

export default {
  methods: {
    async openSignIn(name) {
      const userName = name.toString().toLowerCase();
      if (getCurrentUserRole() !== userName) {
        await this.$store.dispatch('auth/signOut');
        if (localStorage != null) {
          // localStorage.removeItem(NOTIFICATIONS);
          try {
            // if (caches) {
            //   caches.keys().then((arr) => {
            //     arr.forEach((key) => {
            //       caches.delete(key);
            //     });
            //   });
            // }
          } catch (error) {
            this.$toast.error('Error clearing caches:', error.message);
          }
        }
      }
      await this.$store.dispatch('auth/setViewRole', userName);
      let redirect;
      if (userName === 'exporter') {
        redirect = { name: 'OperatingZonesManagement' };
      } else {
        redirect = { name: 'Dashboard' };
      }
      await this.$router.push({
        name: 'SignIn',
        query: {
          mode: 'self',
          redirect: this.$router.resolve(redirect).route.fullPath,
        },
      });
    },
  },
  computed: {
    getCurrentUserRole,
  },
};
</script>

<style scoped>
/* Tailwind handles all styling */
/* Ensure SVGs don't interfere with interaction */
.tw-pointer-events-none {
  pointer-events: none;
}
</style>
