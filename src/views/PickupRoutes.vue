<template>
  <div class="p-4">
    <h1 class="text-2xl font-semibold mb-4">Pickup Routes</h1>
    <div class="flex items-center gap-2 mb-4">
      <input type="date" v-model="selectedDate" class="border p-2 rounded" />
      <button @click="openCreate" class="bg-green-600 text-white px-3 py-2 rounded">New Route</button>
    </div>
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="routes.length === 0" class="text-gray-500">No routes for selected date.</div>
    <table v-else class="min-w-full bg-white shadow rounded">
      <thead>
        <tr class="bg-gray-100 text-left text-sm uppercase tracking-wider">
          <th class="px-4 py-2">Route ID</th>
          <th class="px-4 py-2">Scheduled</th>
          <th class="px-4 py-2">Stops</th>
          <th class="px-4 py-2">Status</th>
          <th class="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in routes" :key="r.routeId" class="border-t hover:bg-gray-50">
          <td class="px-4 py-2 font-mono text-xs">{{ r.routeId }}</td>
          <td class="px-4 py-2">{{ formatDateTime(r.scheduledDate) }}</td>
          <td class="px-4 py-2">{{ r.stops.length }}</td>
          <td class="px-4 py-2">
            <span :class="statusClass(r.status)" class="px-2 py-1 rounded text-xs font-semibold">{{ r.status }}</span>
          </td>
          <td class="px-4 py-2 text-right">
            <button @click="selectRoute(r.routeId)" class="text-blue-600 hover:underline text-sm">View</button>
          </td>
        </tr>
      </tbody>
    </table>

    <PickupRouteDetail v-if="activeRoute" :route-id="activeRoute" @close="activeRoute=null" />
    <CreatePickupRouteModal v-if="showCreate" @close="showCreate=false" @created="onCreated" />
  </div>
</template>

<script>
import pickupRouteService from '@/services/pickupRoute.service.js';
import PickupRouteDetail from './PickupRoutes/PickupRouteDetail.vue';
import CreatePickupRouteModal from './PickupRoutes/CreatePickupRouteModal.vue';

export default {
  components: { PickupRouteDetail, CreatePickupRouteModal },
  data() {
    return {
      selectedDate: new Date().toISOString().substring(0, 10),
      routes: [],
      loading: false,
      activeRoute: null,
      showCreate: false,
    };
  },
  created() {
    this.fetchRoutes();
  },
  methods: {
    async fetchRoutes() {
      this.loading = true;
      try {
        const data = await pickupRouteService.listRoutes(this.selectedDate);
        this.routes = data.data || data; // supports Result wrapper or raw list
      } catch (e) { this.routes = []; }
      this.loading = false;
    },
    openCreate() { this.showCreate = true; },
    onCreated(route) {
      this.routes.unshift(route);
      this.showCreate = false;
    },
    selectRoute(id) { this.activeRoute = id; },
    statusClass(status) {
      switch (status) {
        case 'PLANNED': return 'bg-blue-100 text-blue-700';
        case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700';
        case 'COMPLETED': return 'bg-green-100 text-green-700';
        case 'CANCELLED': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-600';
      }
    },
    formatDateTime(dt) {
      if (!dt) return '';
      return new Date(dt).toLocaleString();
    },
  },
};
</script>

<style scoped>
table { border-collapse: separate; border-spacing: 0; }
</style>
