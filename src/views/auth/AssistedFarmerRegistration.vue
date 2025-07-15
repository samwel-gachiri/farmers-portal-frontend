<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-white tw-to-gray-100">
    <div class="tw-bg-white tw-rounded-xl tw-shadow-lg tw-px-8 tw-py-10 tw-w-full tw-max-w-sm tw-flex tw-flex-col tw-items-center">
      <h1 class="tw-text-2xl tw-font-semibold tw-mb-6 tw-text-gray-800">Sign up</h1>
      <div class="tw-flex tw-flex-col tw-gap-4 tw-w-full">
        // add farmer sign up here
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/newline-after-import
import axios from 'axios';
import { getCurrentUserRole } from '@/utils/roles.js';

export default {
  methods: {
    // add farmer to zone method here
    async addFarmerToZone() {
      try {
        await axios.post(`/farmers-service/exporter/zones/${zoneId}/farmers/${this.user.id}`);
        this.$toast.success('Farmer added to zone successfully');
      } catch (error) {
        this.$toast.error(`Failed to add farmer to zone: ${error.message}`);
      }
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
