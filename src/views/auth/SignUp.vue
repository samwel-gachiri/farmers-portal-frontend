<template>
  <v-app class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-white tw-to-gray-100">
    <v-card class="tw-px-8 tw-bg-white tw-shadow-xl tw-rounded-2xl tw-max-w-6xl tw-mx-auto tw-mt-10">
      <CardTitle icon="mdi-account" class="tw-text-blue-600 tw-mb-2">
        <h2 class="tw-text-2xl tw-font-semibold">Sign up</h2>
      </CardTitle>
      <!-- Render FarmerSignUp if role is farmer -->
      <FarmerSignUp v-if="getCurrentUserRole === 'farmer'" />
      <!-- Render BuyerSignUp if role is buyer -->
      <BuyerSignUp v-if="getCurrentUserRole === 'buyer'" />
      <!-- Render ExporterSignUp if role is exporter -->
      <ExporterSignUp v-if="getCurrentUserRole === 'exporter'" />
    </v-card>
  </v-app>
</template>

<script>
// eslint-disable-next-line import/newline-after-import
import { getCurrentUserRole } from '@/utils/roles.js';
import FarmerSignUp from '@/components/auth/FarmerSignUp.vue';
import BuyerSignUp from '@/components/auth/BuyerSignUp.vue';
import ExporterSignUp from '@/components/auth/ExporterSignUp.vue';
import CardTitle from '@/components/shared/CardTitle.vue';

export default {
  components: {
    CardTitle,
    FarmerSignUp,
    BuyerSignUp,
    ExporterSignUp,
  },
  methods: {
  },
  computed: {
    getCurrentUserRole,
  },
};
</script>

<style scoped>
/* Tailwind handles all styling */
</style>
