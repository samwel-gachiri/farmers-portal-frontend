<template>
  <v-app class="tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-white tw-to-gray-100">
    <v-card
      class="tw-px-10 tw-pb-8 tw-bg-white tw-shadow-2xl tw-rounded-3xl tw-max-w-4xl tw-mx-auto tw-mt-10 tw-border tw-border-gray-200 tw-flex tw-flex-col tw-items-center"
      elevation="1"
    >
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
  mounted() {
    const role = getCurrentUserRole();
    if (!role) {
      this.$toast.info('Please select a role to sign in');
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      this.$router.push({
        name: 'Home',
        query: {
          redirect: btoa(currentPath),
        },
      });
    } else {
      this.$toast.info(`Signing in as ${role}`);
    }
  },
  computed: {
    getCurrentUserRole,
  },
};
</script>

<style scoped>
/* Tailwind handles all styling */
</style>
