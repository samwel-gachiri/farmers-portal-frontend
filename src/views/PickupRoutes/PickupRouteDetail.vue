<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-end z-40">
    <div class="bg-white w-full max-w-3xl h-full flex flex-col shadow-lg">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-semibold">Route {{ route?.routeId }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-black">✕</button>
      </div>
      <div class="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 space-y-4">
          <div class="h-80 bg-gray-200 flex items-center justify-center rounded relative">
            <div class="text-gray-600">Map placeholder (integrate Leaflet)</div>
          </div>
          <div>
            <h3 class="font-semibold mb-2">Stops</h3>
            <ol class="space-y-2">
              <li v-for="s in route?.stops || []" :key="s.stopId" class="p-2 border rounded flex justify-between items-center">
                <div>
                  <div class="text-sm font-medium">{{ s.farmerId }}</div>
                  <div class="text-xs text-gray-500">Order: {{ s.sequenceOrder }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <select v-model="stopStatus[s.stopId]" @change="updateStopStatus(s)" class="text-xs border rounded p-1">
                    <option>PENDING</option>
                    <option>ARRIVED</option>
                    <option>COMPLETED</option>
                    <option>SKIPPED</option>
                  </select>
                </div>
              </li>
            </ol>
          </div>
        </div>
        <div class="space-y-4">
          <div class="border rounded p-4">
            <h3 class="font-semibold mb-2">Route Status</h3>
            <select v-model="routeStatus" @change="updateRouteStatus" class="border rounded p-2 w-full">
              <option>PLANNED</option>
              <option>IN_PROGRESS</option>
              <option>COMPLETED</option>
              <option>CANCELLED</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pickupRouteService from '@/services/pickupRoute.service.js';

export default {
  props: { routeId: { type: String, required: true } },
  data() {
    return { route: null, routeStatus: 'PLANNED', stopStatus: {} };
  },
  created() { this.load(); },
  methods: {
    async load() {
      this.route = await pickupRouteService.getRoute(this.routeId);
      this.routeStatus = this.route.status;
      this.stopStatus = this.route.stops.reduce((acc, s) => { acc[s.stopId] = s.status; return acc; }, {});
    },
    async updateRouteStatus() {
      await pickupRouteService.updateRouteStatus(this.route.routeId, this.routeStatus);
      await this.load();
    },
    async updateStopStatus(stop) {
      await pickupRouteService.updateStopStatus(this.route.routeId, stop.stopId, this.stopStatus[stop.stopId]);
      await this.load();
    },
  },
};
</script>

<style scoped>
</style>
