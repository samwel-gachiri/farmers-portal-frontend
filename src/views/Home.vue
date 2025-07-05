<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-white tw-to-gray-100">
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
      await this.$router.push(
        {
          name: 'SignIn',
          query: {
            mode: 'self',
          },
        },
      );
    },
  },
  computed: {
    getCurrentUserRole,
  },
};
</script>

<style scoped>
/* Tailwind handles all styling */
</style>
