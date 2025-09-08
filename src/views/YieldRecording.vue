<template>
  <Default>
    <div class="yield-recording-page million-dollar-bg">
      <div class="bg-shape bg-1"></div>
      <div class="bg-shape bg-2"></div>
      <div class="bg-shape bg-3"></div>
      <v-container class="glass-container py-10 px-4" fluid>
        <v-row class="mb-8" align="center" justify="space-between">
          <v-col cols="12" md="7">
            <h1 class="display-2 font-weight-bold text-primary mb-2 d-flex align-center">
              <v-icon color="primary" large class="mr-3">mdi-seed</v-icon>
              Record Harvest Yield
            </h1>
          </v-col>
        </v-row>
        <v-row class="mb-10" dense>
          <v-col cols="12" md="6">
            <v-card class="pa-6 elevation-10 glass-card">
              <yield-entry-form
                :produces="produces"
                :units="units"
                :form="form"
                :submit="submitYield"
              />
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6 elevation-10 glass-card mb-6">
              <yield-summary-card
                :total-yields="yieldHistory.length"
                :total-yield-amount="totalYieldAmount"
                :average-yield="averageYield"
              />
            </v-card>
            <v-card class="pa-6 elevation-10 glass-card">
              <yield-chart :yields-by-month="yieldsByMonth" />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h2 class="display-1 font-weight-bold mb-4 text-primary d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-timeline-clock</v-icon>
              Yield History
            </h2>
            <v-alert v-if="yieldHistory.length === 0" type="info" class="my-8" border="left" colored-border>
              No yields recorded yet.
            </v-alert>
            <v-row v-else class="flex-wrap" dense>
              <v-col v-for="yieldItem in yieldHistory" :key="yieldItem.id" cols="12" md="6" lg="4">
                <yield-record-card
                  :yield-item="yieldItem"
                  @edit="editYield"
                  @delete="deleteYield"
                  @list="listForSale"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-dialog v-model="editDialog" max-width="500px" persistent>
          <v-card class="glass-modal pa-8">
            <v-card-title class="headline text-primary">Edit Yield</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="submitEditYield">
                <v-text-field
                  v-model.number="editForm.yieldAmount"
                  label="Yield Amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  outlined
                  dense
                  required
                  class="mb-4"
                />
                <v-select
                  v-model="editForm.yieldUnit"
                  :items="units"
                  label="Unit"
                  outlined
                  dense
                  required
                  class="mb-4"
                />
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editForm.harvestDate"
                      label="Harvest Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                      required
                      class="mb-4"
                    />
                  </template>
                  <v-date-picker v-model="editForm.harvestDate" @input="menu = false"></v-date-picker>
                </v-menu>
                <v-textarea
                  v-model="editForm.notes"
                  label="Notes"
                  outlined
                  dense
                  rows="2"
                  class="mb-4"
                />
                <v-row class="mt-4" dense>
                  <v-col cols="6">
                    <v-btn color="success" block type="submit">Save</v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn color="secondary" block @click="editDialog = false">Cancel</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </Default>
</template>

<script>

import axios from 'axios';
import Default from '@/components/layout/Default.vue';
import YieldEntryForm from '@/components/yield/YieldEntryForm.vue';
import YieldRecordCard from '@/components/yield/YieldRecordCard.vue';
import YieldSummaryCard from '@/components/yield/YieldSummaryCard.vue';
import YieldChart from '@/components/yield/YieldChart.vue';

export default {
  name: 'YieldRecording',
  components: {
    Default,
    YieldEntryForm,
    YieldRecordCard,
    YieldSummaryCard,
    YieldChart,
  },
  data() {
    return {
      loading: true,
      produces: [],
      units: ['kg', 'bags', 'tons', 'pieces', 'liters'],
      form: {
        farmerProduceId: '',
        yieldAmount: '',
        yieldUnit: '',
        harvestDate: '',
        seasonYear: '',
        seasonName: '',
        notes: '',
      },
      errors: {},
      yieldHistory: [],
      editDialog: false,
      editForm: {},
      editYieldId: null,
      menu: false, // for v-menu date picker
    };
  },
  computed: {
    totalYieldAmount() {
      return this.yieldHistory.reduce((sum, y) => sum + Number(y.yieldAmount || 0), 0);
    },
    averageYield() {
      if (!this.yieldHistory.length) return 0;
      return (this.totalYieldAmount / this.yieldHistory.length).toFixed(2);
    },
    yieldsByMonth() {
      // Group yields by month (e.g., '2025-09')
      const map = {};
      this.yieldHistory.forEach((y) => {
        const d = new Date(y.harvestDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        map[key] = (map[key] || 0) + Number(y.yieldAmount || 0);
      });
      return map;
    },
  },
  methods: {
    async fetchProduces() {
      try {
        const farmerId = this.$store.state.user?.id || this.$route.params.farmerId;
        const { data } = await axios.get(`/farmers-service/farmer/${farmerId}/produces`);
        this.produces = data.data || [];
      } catch {
        this.produces = [];
      }
    },
    async fetchYieldHistory() {
      this.loading = true;
      try {
        let farmerProduceId = this.form.farmerProduceId || this.$route.params.farmerProduceId;
        if (!farmerProduceId && this.produces.length > 0) {
          farmerProduceId = this.produces[0].id;
        }
        if (!farmerProduceId) {
          this.yieldHistory = [];
          this.loading = false;
          return;
        }
        const { data } = await axios.get(`/api/yields/farmer-produce/${farmerProduceId}`);
        this.yieldHistory = data.data || [];
      } catch {
        this.yieldHistory = [];
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      this.errors = {};
      if (!this.form.farmerProduceId) this.errors.farmerProduceId = 'Produce is required.';
      if (!this.form.yieldAmount || this.form.yieldAmount <= 0) this.errors.yieldAmount = 'Yield amount must be positive.';
      if (!this.form.yieldUnit) this.errors.yieldUnit = 'Unit is required.';
      if (!this.form.harvestDate) this.errors.harvestDate = 'Harvest date is required.';
      return Object.keys(this.errors).length === 0;
    },
    async submitYield() {
      if (!this.validateForm()) return;
      try {
        await axios.post('/api/yields/record', {
          ...this.form,
          yieldAmount: Number(this.form.yieldAmount),
          seasonYear: this.form.seasonYear ? Number(this.form.seasonYear) : null,
        });
        this.$toast.success('Yield recorded!');
        this.form.yieldAmount = '';
        this.form.yieldUnit = '';
        this.form.harvestDate = '';
        this.form.seasonYear = '';
        this.form.seasonName = '';
        this.form.notes = '';
        this.fetchYieldHistory();
      } catch (e) {
        this.$toast.error(e.response?.data?.message || 'Failed to record yield.');
      }
    },
    // eslint-disable-next-line no-unused-vars
    listForSale(yieldItem) {
      // Placeholder for listing yield for sale
      this.$toast.info('Listing for sale coming soon!');
    },
    formatDate(date) {
      if (!date) return '-';
      try {
        return new Date(date).toLocaleDateString();
      } catch {
        return String(date);
      }
    },
    editYield(yieldItem) {
      this.editForm = { ...yieldItem };
      this.editYieldId = yieldItem.id;
      this.editDialog = true;
    },
    async submitEditYield() {
      try {
        await axios.put(`/api/yields/${this.editYieldId}`, {
          ...this.editForm,
          yieldAmount: Number(this.editForm.yieldAmount),
        });
        this.$toast.success('Yield updated!');
        this.editDialog = false;
        this.fetchYieldHistory();
      } catch (e) {
        this.$toast.error(e.response?.data?.message || 'Failed to update yield.');
      }
    },
    async deleteYield(yieldItem) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (!confirm('Delete this yield record?')) return;
      try {
        await axios.delete(`/api/yields/${yieldItem.id}`);
        this.$toast.success('Yield deleted.');
        this.fetchYieldHistory();
      } catch (e) {
        this.$toast.error(e.response?.data?.message || 'Failed to delete yield.');
      }
    },
  },
  watch: {
    // eslint-disable-next-line func-names
    'form.farmerProduceId': function () {
      this.fetchYieldHistory();
    },
  },
  async created() {
    await this.fetchProduces();
    if (this.$route.params.farmerProduceId) {
      this.form.farmerProduceId = this.$route.params.farmerProduceId;
    }
    this.fetchYieldHistory();
    this.loading = false;
  },
};
</script>

<style scoped>
.million-dollar-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
  position: relative;
  overflow-x: hidden;
}
.glass-container {
  background: rgba(255,255,255,0.7);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255,255,255,0.25);
}
.glass-modal {
  background: rgba(255,255,255,0.95);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  border-radius: 1.5rem;
  border: 1.5px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(10px);
}
.bg-shape {
  position: absolute;
  z-index: 0;
  pointer-events: none;
}
.bg-1 {
  top: -120px;
  left: -120px;
  width: 340px;
  height: 340px;
  background: radial-gradient(circle, #a5b4fc 0%, #818cf8 100%);
  opacity: 0.25;
  border-radius: 50%;
}
.bg-2 {
  bottom: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #6ee7b7 0%, #34d399 100%);
  opacity: 0.18;
  border-radius: 50%;
}
.bg-3 {
  top: 40%;
  left: 50%;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, #fde68a 0%, #fbbf24 100%);
  opacity: 0.13;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.icon-gradient {
  display: inline-flex;
  background: linear-gradient(90deg, #6366f1 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
