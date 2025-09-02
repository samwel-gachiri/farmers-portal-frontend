<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded shadow-lg w-full max-w-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Create Pickup Route</h2>
      <form @submit.prevent="submit">
        <label class="block text-sm font-medium mb-1">Scheduled Date & Time</label>
        <input type="datetime-local" v-model="scheduledDate" class="border w-full p-2 rounded mb-4" required />
        <label class="block text-sm font-medium mb-1">Zone</label>
        <select v-model="zoneId" class="border w-full p-2 rounded mb-4" required>
          <option disabled value="">Select zone</option>
          <option v-for="z in zones" :key="z.id" :value="z.id">{{ z.name }}</option>
        </select>
        <label class="block text-sm font-medium mb-1">Farmers (multi-select)</label>
        <div class="border rounded p-2 h-40 overflow-y-auto mb-4">
          <label v-for="f in farmers" :key="f.id" class="flex items-center text-sm space-x-2 py-1">
            <input type="checkbox" :value="f.id" v-model="farmerIds" />
            <span>{{ f.name }}</span>
          </label>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-3 py-2 rounded border">Cancel</button>
          <button type="submit" :disabled="submitting" class="px-3 py-2 rounded bg-green-600 text-white">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import pickupRouteService from '@/services/pickupRoute.service.js';

export default {
  data() {
    return {
      scheduledDate: new Date().toISOString().substring(0, 16), zones: [], farmers: [], zoneId: '', exporterId: '', farmerIds: [], submitting: false,
    };
  },
  created() {
    // TODO fetch zones & farmers for user context
    // Placeholder demo data
    this.zones = [{ id: 'demo-zone', name: 'Demo Zone' }];
    // Placeholder exporter selection; replace with real fetch
    this.exporterId = this.$store.getters['auth/authenticatedUser']?.exporterId || 'demo-exporter';
    this.farmers = [];
  },
  methods: {
    async submit() {
      if (this.farmerIds.length === 0) { alert('Select at least one farmer'); return; }
      this.submitting = true;
      try {
        const route = await pickupRouteService.createRoute({
          scheduledDate: this.scheduledDate, zoneId: this.zoneId, exporterId: this.exporterId, farmerIds: this.farmerIds,
        });
        this.$emit('created', route);
      } catch (e) { console.error(e); alert('Failed to create'); }
      this.submitting = false;
    },
  },
};
</script>
