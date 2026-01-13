<template>
  <Default ref="default" :key="authKey">
    <!-- Use computed currentRole for better reactivity -->
    <FarmerDashboard v-if="user && currentRole === 'farmer'"/>
    <AggregatorDashboard v-if="user && currentRole === 'aggregator'"/>
    <BuyerDashboard v-if="user && currentRole === 'buyer'"/>
    <AdminDashboard v-if="user && currentRole === 'admin'"/>
    <ExporterDashboardLayout v-if="user && currentRole === 'exporter'"/>
    <SystemAdminDashboard v-if="user && currentRole === 'system_admin'"/>
    <ZoneSupervisorDashboard v-if="user && currentRole === 'zone_supervisor'"/>
    <ARDashboardRedirect v-if="user && currentRole === 'authorised_representative'"/>
    <SupplierDashboard v-if="user && ['supplier', 'processor', 'trader', 'warehouse'].includes(currentRole)"/>

    <!-- Loading state while auth loads -->
    <div v-if="!user && !isLoading" class="tw-flex tw-items-center tw-justify-center tw-h-64">
      <v-progress-circular indeterminate color="green" />
    </div>
  </Default>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Default from '@/components/layout/Default.vue';
import FarmerDashboard from '@/components/layout/dashboard/FarmerDashboard.vue';
import AggregatorDashboard from '@/views/aggregator/AggregatorDashboard.vue';
import AdminDashboard from '@/components/layout/dashboard/AdminDashboard.vue';
import BuyerDashboard from '@/views/buyers/BuyerDashboard.vue';
import ExporterDashboardLayout from '@/views/exporter/EudrDashboard.vue';
// import ExporterDashboardLayout from '@/components/layout/dashboard/ExporterDashboard.vue';
import SystemAdminDashboard from '@/components/layout/dashboard/SystemAdminDashboard.vue';
import ZoneSupervisorDashboard from '@/components/layout/dashboard/ZoneSupervisorDashboard.vue';
import SupplierDashboard from '@/views/supplier/SupplierDashboard.vue';
// eslint-disable-next-line import/no-unresolved

// AR Dashboard Redirect Component - redirects to dedicated AR Dashboard
const ARDashboardRedirect = {
  name: 'ARDashboardRedirect',
  mounted() {
    this.$router.replace({ name: 'ARDashboard' });
  },
  render() {
    return null;
  },
};

export default {
  components: {
    BuyerDashboard,
    AdminDashboard,
    FarmerDashboard,
    AggregatorDashboard,
    ExporterDashboardLayout,
    SystemAdminDashboard,
    ZoneSupervisorDashboard,
    ARDashboardRedirect,
    SupplierDashboard,
    Default,
  },
  data: () => ({
    isLoading: true,
  }),
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    ...mapGetters('auth', ['role']),
    // Use computed property for role to ensure Vue reactivity
    currentRole() {
      return this.role || this.$store.getters['auth/role'] || '';
    },
    // Key to force re-render when auth changes
    authKey() {
      return `dashboard-${this.currentRole}-${this.user ? this.user.id || 'user' : 'none'}`;
    },
  },
  mounted() {
    // Give a brief moment for auth state to hydrate
    this.$nextTick(() => {
      this.isLoading = false;
      if (this.user == null || this.user === '') {
        this.$router.push({ name: 'Landing' });
        if (this.$refs.default?.$refs?.avatar?.logout) {
          this.$refs.default.$refs.avatar.logout();
        }
      }
    });
  },
};
</script>

<style scoped>
/* Tailwind-like utility classes */
.bg-gray-50 {
  background-color: #f9fafb;
}
.min-h-screen {
  min-height: 100vh;
}
.p-8 {
  padding: 2rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.text-3xl {
  font-size: 1.875rem;
}
.font-bold {
  font-weight: 700;
}
.text-gray-800 {
  color: #1f2937;
}
.text-gray-600 {
  color: #4b5563;
}
.text-green-600 {
  color: #16a34a;
}
.text-blue-600 {
  color: #2563eb;
}
.text-purple-600 {
  color: #9333ea;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.transition-shadow {
  transition: box-shadow 0.3s ease-in-out;
}
.flex {
  display: flex;
}
.space-x-4 > * + * {
  margin-left: 1rem;
}

</style>
