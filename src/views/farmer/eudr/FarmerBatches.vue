<template>
  <div class="farmer-batches">
    <v-container fluid>
      <!-- Header -->
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <v-icon large color="purple" class="mr-3">mdi-package-variant</v-icon>
              <div>
                <h1 class="text-h4 font-weight-bold">My Batches</h1>
                <p class="text-subtitle-1 text--secondary mb-0">
                  Create and manage your commodity batches for EUDR compliance
                </p>
              </div>
            </div>
            <v-btn
              color="primary"
              @click="showCreateDialog = true"
              elevation="2"
            >
              <v-icon left>mdi-plus</v-icon>
              Create Batch
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Batch Statistics -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card active" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-package</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ activeBatches }}</div>
              <div class="text-caption">Active Batches</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card transferred" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-truck</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ transferredBatches }}</div>
              <div class="text-caption">Transferred</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card total-volume" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-weight</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ totalVolume }}</div>
              <div class="text-caption">Total Volume (kg)</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card compliant" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-shield-check</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ compliantBatches }}%</div>
              <div class="text-caption">EUDR Compliant</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Batch Filters -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" sm="6" md="3">
                  <v-select
                    v-model="statusFilter"
                    :items="statusOptions"
                    label="Filter by Status"
                    dense
                    outlined
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-select
                    v-model="commodityFilter"
                    :items="commodityOptions"
                    label="Filter by Commodity"
                    dense
                    outlined
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    v-model="dateFrom"
                    label="From Date"
                    type="date"
                    dense
                    outlined
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    v-model="dateTo"
                    label="To Date"
                    type="date"
                    dense
                    outlined
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Batches List -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
              My Commodity Batches
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search batches..."
                single-line
                hide-details
                dense
                outlined
                class="search-field"
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="filteredBatches"
              :search="search"
              :loading="loading"
              class="elevation-0"
            >
              <template v-slot:item.batchId="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="getCommodityColor(item.commodity)" class="mr-2">
                    {{ getCommodityIcon(item.commodity) }}
                  </v-icon>
                  <span class="font-weight-medium">{{ item.batchId }}</span>
                </div>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  text-color="white"
                  small
                >
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.volume="{ item }">
                {{ item.volume }} kg
              </template>
              <template v-slot:item.createdAt="{ item }">
                {{ formatDate(item.createdAt) }}
              </template>
              <template v-slot:item.compliance="{ item }">
                <div class="d-flex align-center">
                  <v-progress-circular
                    :value="item.complianceScore"
                    :color="getComplianceColor(item.complianceScore)"
                    size="30"
                    width="3"
                    class="mr-2"
                  >
                    <span class="text-caption">{{ item.complianceScore }}%</span>
                  </v-progress-circular>
                </div>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="viewBatch(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.status === 'Created'"
                  icon
                  small
                  color="warning"
                  @click="editBatch(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.status === 'Created'"
                  icon
                  small
                  color="success"
                  @click="transferBatch(item)"
                >
                  <v-icon>mdi-truck</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Create Batch Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="700px" persistent>
      <v-card>
        <v-card-title class="text-h5">Create New Batch</v-card-title>
        <v-card-text>
          <v-form ref="createForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newBatch.commodity"
                  :items="commodityOptions.filter(c => c.value !== 'All')"
                  label="Commodity Type"
                  :rules="[v => !!v || 'Commodity is required']"
                  required
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newBatch.productionUnitId"
                  :items="productionUnitOptions"
                  label="Production Unit"
                  :rules="[v => !!v || 'Production unit is required']"
                  required
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newBatch.volume"
                  label="Volume (kg)"
                  type="number"
                  :rules="[v => !!v || 'Volume is required', v => v > 0 || 'Volume must be positive']"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newBatch.harvestDate"
                  label="Harvest Date"
                  type="date"
                  :rules="[v => !!v || 'Harvest date is required']"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newBatch.quality"
                  :items="qualityOptions"
                  label="Quality Grade"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newBatch.moistureContent"
                  label="Moisture Content (%)"
                  type="number"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="newBatch.notes"
                  label="Notes (Optional)"
                  rows="3"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancelCreate">Cancel</v-btn>
          <v-btn
            color="primary"
            :disabled="!formValid"
            :loading="creating"
            @click="createBatch"
          >
            Create Batch
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'FarmerBatches',
  data() {
    return {
      loading: false,
      search: '',
      statusFilter: 'All',
      commodityFilter: 'All',
      dateFrom: '',
      dateTo: '',
      showCreateDialog: false,
      formValid: false,
      creating: false,
      statusOptions: ['All', 'Created', 'Transferred', 'Processing', 'Completed'],
      commodityOptions: [
        { text: 'All Commodities', value: 'All' },
        { text: 'Coffee', value: 'Coffee' },
        { text: 'Cocoa', value: 'Cocoa' },
        { text: 'Palm Oil', value: 'Palm Oil' },
        { text: 'Soy', value: 'Soy' },
        { text: 'Rubber', value: 'Rubber' },
      ],
      qualityOptions: ['Premium', 'Grade A', 'Grade B', 'Standard'],
      headers: [
        { text: 'Batch ID', value: 'batchId', sortable: true },
        { text: 'Commodity', value: 'commodity', sortable: true },
        { text: 'Volume', value: 'volume', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
        { text: 'Created', value: 'createdAt', sortable: true },
        { text: 'Compliance', value: 'compliance', sortable: true },
        {
          text: 'Actions', value: 'actions', sortable: false, width: '150px',
        },
      ],
      batches: [
        {
          id: 1,
          batchId: 'CB-2024-001',
          commodity: 'Coffee',
          volume: 500,
          status: 'Created',
          createdAt: '2024-12-15',
          complianceScore: 95,
          productionUnit: 'North Field Coffee',
          quality: 'Premium',
        },
        {
          id: 2,
          batchId: 'CC-2024-002',
          commodity: 'Cocoa',
          volume: 300,
          status: 'Transferred',
          createdAt: '2024-12-10',
          complianceScore: 88,
          productionUnit: 'South Valley Cocoa',
          quality: 'Grade A',
        },
        {
          id: 3,
          batchId: 'CB-2024-003',
          commodity: 'Coffee',
          volume: 750,
          status: 'Processing',
          createdAt: '2024-12-05',
          complianceScore: 92,
          productionUnit: 'East Hill Plantation',
          quality: 'Premium',
        },
      ],
      productionUnitOptions: [
        { text: 'North Field Coffee', value: 1 },
        { text: 'South Valley Cocoa', value: 2 },
        { text: 'East Hill Plantation', value: 3 },
      ],
      newBatch: {
        commodity: '',
        productionUnitId: null,
        volume: null,
        harvestDate: '',
        quality: '',
        moistureContent: null,
        notes: '',
      },
    };
  },
  computed: {
    filteredBatches() {
      let filtered = this.batches;

      if (this.statusFilter !== 'All') {
        filtered = filtered.filter((batch) => batch.status === this.statusFilter);
      }

      if (this.commodityFilter !== 'All') {
        filtered = filtered.filter((batch) => batch.commodity === this.commodityFilter);
      }

      if (this.dateFrom) {
        filtered = filtered.filter((batch) => batch.createdAt >= this.dateFrom);
      }

      if (this.dateTo) {
        filtered = filtered.filter((batch) => batch.createdAt <= this.dateTo);
      }

      return filtered;
    },
    activeBatches() {
      return this.batches.filter((batch) => ['Created', 'Transferred', 'Processing'].includes(batch.status)).length;
    },
    transferredBatches() {
      return this.batches.filter((batch) => batch.status === 'Transferred').length;
    },
    totalVolume() {
      return this.batches.reduce((sum, batch) => sum + batch.volume, 0);
    },
    compliantBatches() {
      const compliant = this.batches.filter((batch) => batch.complianceScore >= 80).length;
      return this.batches.length > 0 ? Math.round((compliant / this.batches.length) * 100) : 0;
    },
  },
  methods: {
    getStatusColor(status) {
      const colors = {
        Created: 'info',
        Transferred: 'warning',
        Processing: 'primary',
        Completed: 'success',
      };
      return colors[status] || 'grey';
    },
    getCommodityColor(commodity) {
      const colors = {
        Coffee: 'brown',
        Cocoa: 'orange',
        'Palm Oil': 'green',
        Soy: 'yellow',
        Rubber: 'grey',
      };
      return colors[commodity] || 'grey';
    },
    getCommodityIcon(commodity) {
      const icons = {
        Coffee: 'mdi-coffee',
        Cocoa: 'mdi-food',
        'Palm Oil': 'mdi-leaf',
        Soy: 'mdi-soy-sauce',
        Rubber: 'mdi-tire',
      };
      return icons[commodity] || 'mdi-package';
    },
    getComplianceColor(score) {
      if (score >= 90) return 'success';
      if (score >= 80) return 'warning';
      return 'error';
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    viewBatch(batch) {
      // Navigate to batch details
      this.$router.push({
        name: 'BatchDetails',
        params: { batchId: batch.id },
      });
    },
    editBatch(batch) {
      // Open edit dialog
      console.log('Edit batch:', batch);
    },
    transferBatch(batch) {
      // Open transfer dialog
      console.log('Transfer batch:', batch);
    },
    cancelCreate() {
      this.showCreateDialog = false;
      this.resetForm();
    },
    async createBatch() {
      if (!this.$refs.createForm.validate()) return;

      this.creating = true;
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate batch ID
        const commodityCode = this.newBatch.commodity.substring(0, 2).toUpperCase();
        const year = new Date().getFullYear();
        const sequence = String(this.batches.length + 1).padStart(3, '0');
        const batchId = `${commodityCode}-${year}-${sequence}`;

        // Add to list (in real app, this would come from API response)
        const newId = Math.max(...this.batches.map((b) => b.id)) + 1;
        this.batches.unshift({
          id: newId,
          batchId,
          commodity: this.newBatch.commodity,
          volume: this.newBatch.volume,
          status: 'Created',
          createdAt: new Date().toISOString().split('T')[0],
          complianceScore: 85, // Would be calculated based on production unit compliance
          productionUnit: this.productionUnitOptions.find((u) => u.value === this.newBatch.productionUnitId)?.text,
          quality: this.newBatch.quality,
        });

        this.showCreateDialog = false;
        this.resetForm();
        this.$toast.success('Batch created successfully!');
      } catch (error) {
        this.$toast.error('Failed to create batch');
      } finally {
        this.creating = false;
      }
    },
    resetForm() {
      this.newBatch = {
        commodity: '',
        productionUnitId: null,
        volume: null,
        harvestDate: '',
        quality: '',
        moistureContent: null,
        notes: '',
      };
      if (this.$refs.createForm) {
        this.$refs.createForm.resetValidation();
      }
    },
  },
};
</script>

<style scoped>
.farmer-batches {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.stat-card {
  transition: transform 0.2s;
  color: white;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.active {
  background: linear-gradient(135deg, #2196f3, #1565c0);
}

.stat-card.transferred {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.stat-card.total-volume {
  background: linear-gradient(135deg, #9c27b0, #6a1b9a);
}

.stat-card.compliant {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
}

.search-field {
  max-width: 300px;
}
</style>
