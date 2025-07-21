<template>
  <v-dialog v-model="dialog" max-width="700px" persistent>
    <v-card>
      <v-card-title class="tw-font-bold tw-text-lg tw-bg-blue-100">
        Add Farmers to Zone: <span class="tw-text-blue-700 tw-ml-2">{{ zone?.name }}</span>
      </v-card-title>
      <v-card-text>
        <div class="tw-space-y-6">
          <FarmerSignUp @farmer-registered="handleFarmerRegistered" />
          <div v-if="addedFarmers.length" class="tw-mt-4">
            <h3 class="tw-font-semibold tw-text-green-700 tw-mb-2">Farmers Added to Zone</h3>
            <ul class="tw-list-disc tw-pl-6">
              <li v-for="farmer in addedFarmers" :key="farmer.id" class="tw-mb-1">
                {{ farmer.name }} ({{ farmer.phoneNumber }})
              </li>
            </ul>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="resetForm" class="tw-mr-2">Add Another Farmer</v-btn>
        <v-spacer />
        <v-btn color="success" @click="closeDialog">Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import FarmerSignUp from '@/components/auth/FarmerSignUp.vue';
import axios from 'axios';

export default {
  name: 'AssistedFarmerRegistration',
  components: { FarmerSignUp },
  props: {
    zoneId: { type: [String, Number], required: true },
    zone: { type: Object, required: true },
    value: { type: Boolean, default: false }, // v-model for dialog
  },
  data() {
    return {
      dialog: this.value,
      addedFarmers: [],
      lastFarmer: null,
    };
  },
  watch: {
    value(val) { this.dialog = val; },
    dialog(val) { this.$emit('input', val); },
  },
  methods: {
    async handleFarmerRegistered(farmer) {
      // farmer: { id, name, phoneNumber, ... }
      this.lastFarmer = farmer;
      try {
        await axios.post(`/exporters-service/exporter/zones/${this.zoneId}/farmers/${farmer.id}`);
        this.addedFarmers.push(farmer);
        this.$toast.success('Farmer added to zone successfully');
      } catch (error) {
        this.$toast.error(`Failed to add farmer to zone: ${error.message}`);
      }
    },
    resetForm() {
      // Reset FarmerSignUp by emitting event or using key
      this.lastFarmer = null;
      // Optionally, you can use a key prop on FarmerSignUp to force re-render
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('closed'); // parent should fetchZoneFarmers
    },
  },
};
</script>

<style scoped>
/* ...existing code... */
</style>
