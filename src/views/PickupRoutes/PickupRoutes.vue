<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <input type="date" v-model="date" class="border p-2 rounded" />
      <button class="px-3 py-2 bg-green-600 text-white rounded" @click="openCreate">New Route</button>
    </div>
    <div>
      <h3 class="font-semibold mb-2">Routes on {{ date }}</h3>
      <ul class="space-y-2">
        <li v-for="r in routes" :key="r.routeId" class="p-3 border rounded flex justify-between items-center">
          <div>
            <div class="font-medium">Route {{ r.routeId }}</div>
            <div class="text-xs text-gray-500">Stops: {{ r.stopCount }} • Status: {{ r.status }}</div>
          </div>
          <button class="text-blue-600" @click="select(r.routeId)">Open</button>
        </li>
      </ul>
    </div>

    <CreatePickupRouteModal v-if="showCreate" @close="showCreate=false" @created="onCreated" />
    <PickupRouteDetail v-if="selected" :route-id="selected" @close="selected=null" />
  </div>
</template>
<script>
import pickupRouteService from '@/services/pickupRoute.service.js';
import CreatePickupRouteModal from './CreatePickupRouteModal.vue';
import PickupRouteDetail from './PickupRouteDetail.vue';

export default {
  components: { CreatePickupRouteModal, PickupRouteDetail },
  data() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      date: today,
      routes: [],
      showCreate: false,
      selected: null,
    };
  },
  created() { this.load(); },
  methods: {
    async load() {
      const result = await pickupRouteService.listRoutes(this.date);
      this.routes = result.data || result; // unwrap tolerant
    },
    openCreate() { this.showCreate = true; },
    async onCreated() { this.showCreate = false; await this.load(); },
    select(id) { this.selected = id; },
  },
};
</script>
