<template>
  <Default>
    <FarmerDashboard v-if="user && user['custom:role'] === 'farmer'"/>
    <BuyerDashboard v-if="user && user['custom:role'] === 'buyer'"/>
    <AdminDashboard v-if="user && user['custom:role'] === 'admin'"/>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import { mapState } from 'vuex';
import FarmerDashboard from '@/components/layout/dashboard/FarmerDashboard.vue';
import AdminDashboard from '@/components/layout/dashboard/AdminDashboard.vue';
import BuyerDashboard from '@/components/layout/dashboard/BuyerDashboard.vue';

export default {
  components: {
    BuyerDashboard,
    AdminDashboard,
    FarmerDashboard,
    Default,
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
  mounted() {
    if (this.user == null || this.user === '') {
      this.$router.push({ name: 'Landing' });
    }
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
