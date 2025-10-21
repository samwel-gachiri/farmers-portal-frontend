<template>
  <Default>
    <div class="batch-management-page">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="mdi mdi-package-variant"></i>
            EUDR Batch Management
          </h1>
          <p class="page-subtitle">
            Create and manage EUDR-compliant batches with full traceability
          </p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            @click="showCreateBatchDialog = true"
            class="create-btn"
          >
            <v-icon left>mdi-plus</v-icon>
            Create Batch
          </v-btn>
        </div>
      </div>

      <!-- Batch Statistics Cards -->
      <div class="batch-stats-grid">
        <v-card class="stats-card total-batches" elevation="2">
          <v-card-text>
            <div class="stats-content">
              <div class="stats-icon">
                <v-icon large color="primary">mdi-package-variant</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ batchStats.total }}</h3>
                <p class="stats-label">Total Batches</p>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="stats-card compliant-batches" elevation="2">
          <v-card-text>
            <div class="stats-content">
              <div class="stats-icon">
                <v-icon large color="success">mdi-shield-check</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ batchStats.compliant }}</h3>
                <p class="stats-label">Compliant Batches</p>
                <div class="stats-progress">
                  <v-progress-linear
                    :value="batchStats.compliancePercentage"
                    color="success"
                    height="4"
                    rounded
                  ></v-progress-linear>
                  <span class="progress-text">{{ batchStats.compliancePercentage }}%</span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="stats-card pending-batches" elevation="2">
          <v-card-text>
            <div class="stats-content">
              <div class="stats-icon">
                <v-icon large color="warning">mdi-clock-outline</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ batchStats.pending }}</h3>
                <p class="stats-label">Pending Review</p>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="stats-card verified-batches" elevation="2">
          <v-card-text>
            <div class="stats-content">
              <div class="stats-icon">
                <v-icon large color="purple">mdi-cube-outline</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ batchStats.blockchainVerified }}</h3>
                <p class="stats-label">Blockchain Verified</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Batch List -->
      <v-card class="batch-list-card" elevation="2">
        <v-card-title>
          <v-icon left color="primary">mdi-format-list-bulleted</v-icon>
          Batch List
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            label="Search batches..."
            single-line
            hide-details
            outlined
            dense
            class="search-field"
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="batchHeaders"
            :items="filteredBatches"
            :loading="loading"
            :items-per-page="10"
            class="batch-table"
          >
            <template v-slot:item.batchCode="{ item }">
              <div class="batch-code">
                <strong>{{ item.batchCode }}</strong>
                <v-chip
                  v-if="item.isHederaVerified"
                  x-small
                  color="purple"
                  text-color="white"
                  class="ml-2"
                >
                  <v-icon x-small left>mdi-cube-outline</v-icon>
                  Verified
                </v-chip>
              </div>
            </template>

            <template v-slot:item.commodity="{ item }">
              <div class="commodity-info">
                <strong>{{ item.commodityDescription }}</strong>
                <br>
                <small class="text--secondary">{{ item.hsCode }}</small>
              </div>
            </template>

            <template v-slot:item.quantity="{ item }">
              <span>{{ item.quantity }} {{ item.unit }}</span>
            </template>

            <template v-slot:item.complianceStatus="{ item }">
              <v-chip
                :color="getComplianceStatusColor(item.complianceStatus)"
                :text-color="getComplianceStatusTextColor(item.complianceStatus)"
                small
              >
                <v-icon small left>{{ getComplianceStatusIcon(item.complianceStatus) }}</v-icon>
                {{ item.complianceStatus }}
              </v-chip>
            </template>

            <template v-slot:item.riskLevel="{ item }">
              <v-chip
                :color="getRiskLevelColor(item.riskLevel)"
                :text-color="getRiskLevelTextColor(item.riskLevel)"
                small
              >
                {{ item.riskLevel }}
              </v-chip>
            </template>

            <template v-slot:item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="action-buttons">
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="viewBatchDetails(item)"
                  title="View Details"
                >
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="secondary"
                  @click="editBatch(item)"
                  title="Edit Batch"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.isHederaVerified"
                  icon
                  small
                  color="purple"
                  @click="verifyBlockchain(item)"
                  title="Verify on Blockchain"
                >
                  <v-icon small>mdi-shield-check</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="info"
                  @click="generateQRCode(item)"
                  title="Generate QR Code"
                >
                  <v-icon small>mdi-qrcode</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Create Batch Dialog -->
      <v-dialog v-model="showCreateBatchDialog" max-width="800px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">Create New EUDR Batch</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="showCreateBatchDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form ref="batchForm" v-model="batchFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="newBatch.batchCode"
                    label="Batch Code"
                    :rules="[rules.required]"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="newBatch.commodityType"
                    :items="commodityTypes"
                    label="Commodity Type"
                    :rules="[rules.required]"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="newBatch.commodityDescription"
                    label="Commodity Description"
                    :rules="[rules.required]"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="newBatch.hsCode"
                    label="HS Code"
                    :rules="[rules.required]"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="newBatch.quantity"
                    label="Quantity"
                    type="number"
                    :rules="[rules.required, rules.positiveNumber]"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="newBatch.unit"
                    :items="units"
                    label="Unit"
                    :rules="[rules.required]"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="newBatch.countryOfProduction"
                    :items="countries"
                    label="Country of Production"
                    :rules="[rules.required]"
                    outlined
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="newBatch.countryRiskLevel"
                    :items="riskLevels"
                    label="Country Risk Level"
                    :rules="[rules.required]"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="newBatch.productionUnits"
                    :items="availableProductionUnits"
                    item-text="unitName"
                    item-value="id"
                    label="Production Units"
                    multiple
                    chips
                    :rules="[rules.required]"
                    outlined
                    dense
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip
                        v-if="index < 2"
                        small
                        close
                        @click:close="removeProductionUnit(item.id)"
                      >
                        {{ item.unitName }}
                      </v-chip>
                      <span
                        v-if="index === 2"
                        class="grey--text text-caption"
                      >
                        (+{{ newBatch.productionUnits.length - 2 }} others)
                      </span>
                    </template>
                  </v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="newBatch.notes"
                    label="Additional Notes"
                    outlined
                    dense
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="showCreateBatchDialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              @click="createBatch"
              :loading="creatingBatch"
              :disabled="!batchFormValid"
            >
              Create Batch
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Loading Overlay -->
      <v-overlay :value="loading" z-index="1000">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
        <p class="mt-4 text-center">Loading batch data...</p>
      </v-overlay>
    </div>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import { getCurrentUserId } from '@/utils/roles.js';

export default {
  name: 'BatchManagementView',
  components: {
    Default,
  },
  data() {
    return {
      loading: false,
      creatingBatch: false,
      showCreateBatchDialog: false,
      batchFormValid: false,
      searchQuery: '',
      batchStats: {
        total: 12,
        compliant: 9,
        pending: 2,
        blockchainVerified: 8,
        compliancePercentage: 75,
      },
      batchHeaders: [
        { text: 'Batch Code', value: 'batchCode', sortable: true },
        { text: 'Commodity', value: 'commodity', sortable: false },
        { text: 'Quantity', value: 'quantity', sortable: true },
        { text: 'Compliance Status', value: 'complianceStatus', sortable: true },
        { text: 'Risk Level', value: 'riskLevel', sortable: true },
        { text: 'Created', value: 'createdAt', sortable: true },
        {
          text: 'Actions', value: 'actions', sortable: false, width: '150px',
        },
      ],
      batches: [
        {
          id: '1',
          batchCode: 'COFFEE-2024-001',
          commodityDescription: 'Arabica Coffee Beans',
          hsCode: '0901.11',
          quantity: 1000,
          unit: 'kg',
          countryOfProduction: 'Colombia',
          countryRiskLevel: 'LOW',
          complianceStatus: 'COMPLIANT',
          riskLevel: 'LOW',
          createdAt: new Date('2024-01-15'),
          isHederaVerified: true,
        },
        {
          id: '2',
          batchCode: 'COCOA-2024-002',
          commodityDescription: 'Raw Cocoa Beans',
          hsCode: '1801.00',
          quantity: 500,
          unit: 'kg',
          countryOfProduction: 'Ghana',
          countryRiskLevel: 'STANDARD',
          complianceStatus: 'PENDING_REVIEW',
          riskLevel: 'MEDIUM',
          createdAt: new Date('2024-01-20'),
          isHederaVerified: false,
        },
      ],
      newBatch: {
        batchCode: '',
        commodityType: '',
        commodityDescription: '',
        hsCode: '',
        quantity: null,
        unit: '',
        countryOfProduction: '',
        countryRiskLevel: '',
        productionUnits: [],
        notes: '',
      },
      commodityTypes: [
        'Coffee',
        'Cocoa',
        'Palm Oil',
        'Soy',
        'Cattle',
        'Wood',
        'Rubber',
      ],
      units: [
        'kg',
        'tons',
        'liters',
        'cubic meters',
        'pieces',
      ],
      countries: [
        'Brazil',
        'Colombia',
        'Ghana',
        'Indonesia',
        'Malaysia',
        'Peru',
        'Ecuador',
      ],
      riskLevels: [
        { text: 'Low Risk', value: 'LOW' },
        { text: 'Standard Risk', value: 'STANDARD' },
        { text: 'High Risk', value: 'HIGH' },
      ],
      availableProductionUnits: [
        { id: '1', unitName: 'Farm Plot A' },
        { id: '2', unitName: 'Farm Plot B' },
        { id: '3', unitName: 'Farm Plot C' },
      ],
      rules: {
        required: (value) => !!value || 'This field is required',
        positiveNumber: (value) => value > 0 || 'Must be a positive number',
      },
    };
  },
  computed: {
    currentFarmerId() {
      return getCurrentUserId() || this.$route.params.farmerId;
    },
    filteredBatches() {
      if (!this.searchQuery) return this.batches;

      const query = this.searchQuery.toLowerCase();
      return this.batches.filter((batch) => batch.batchCode.toLowerCase().includes(query)
        || batch.commodityDescription.toLowerCase().includes(query)
        || batch.countryOfProduction.toLowerCase().includes(query));
    },
  },
  async mounted() {
    await this.loadBatchData();
  },
  methods: {
    async loadBatchData() {
      this.loading = true;
      try {
        // Load batch data from API
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      } catch (error) {
        console.error('Failed to load batch data:', error);
        this.$toast.error('Failed to load batch data');
      } finally {
        this.loading = false;
      }
    },

    async createBatch() {
      if (!this.$refs.batchForm.validate()) return;

      this.creatingBatch = true;
      try {
        // Create batch via API
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

        // Add to local list (in real app, this would come from API response)
        const newBatch = {
          id: Date.now().toString(),
          ...this.newBatch,
          complianceStatus: 'PENDING_REVIEW',
          riskLevel: this.newBatch.countryRiskLevel,
          createdAt: new Date(),
          isHederaVerified: false,
        };

        this.batches.unshift(newBatch);
        this.showCreateBatchDialog = false;
        this.resetBatchForm();
        this.$toast.success('Batch created successfully');
      } catch (error) {
        console.error('Failed to create batch:', error);
        this.$toast.error('Failed to create batch');
      } finally {
        this.creatingBatch = false;
      }
    },

    resetBatchForm() {
      this.newBatch = {
        batchCode: '',
        commodityType: '',
        commodityDescription: '',
        hsCode: '',
        quantity: null,
        unit: '',
        countryOfProduction: '',
        countryRiskLevel: '',
        productionUnits: [],
        notes: '',
      };
      if (this.$refs.batchForm) {
        this.$refs.batchForm.resetValidation();
      }
    },

    removeProductionUnit(unitId) {
      const index = this.newBatch.productionUnits.indexOf(unitId);
      if (index > -1) {
        this.newBatch.productionUnits.splice(index, 1);
      }
    },

    viewBatchDetails(batch) {
      // Navigate to batch details page
      this.$router.push({ name: 'BatchDetails', params: { batchId: batch.id } });
    },

    editBatch() {
      // Open edit dialog or navigate to edit page
      this.$toast.info('Edit functionality coming soon');
    },

    async verifyBlockchain() {
      try {
        // Verify batch on blockchain
        this.$toast.success('Blockchain verification initiated');
      } catch (error) {
        this.$toast.error('Failed to verify on blockchain');
      }
    },

    generateQRCode() {
      // Generate QR code for batch
      this.$toast.info('QR code generation coming soon');
    },

    getComplianceStatusColor(status) {
      switch (status) {
        case 'COMPLIANT':
          return 'success';
        case 'PENDING_REVIEW':
          return 'warning';
        case 'NON_COMPLIANT':
          return 'error';
        default:
          return 'grey';
      }
    },

    getComplianceStatusTextColor(status) {
      switch (status) {
        case 'COMPLIANT':
          return 'white';
        case 'PENDING_REVIEW':
          return 'black';
        case 'NON_COMPLIANT':
          return 'white';
        default:
          return 'white';
      }
    },

    getComplianceStatusIcon(status) {
      switch (status) {
        case 'COMPLIANT':
          return 'mdi-check-circle';
        case 'PENDING_REVIEW':
          return 'mdi-clock-outline';
        case 'NON_COMPLIANT':
          return 'mdi-close-circle';
        default:
          return 'mdi-help-circle';
      }
    },

    getRiskLevelColor(level) {
      switch (level) {
        case 'LOW':
          return 'success';
        case 'STANDARD':
          return 'warning';
        case 'HIGH':
          return 'error';
        default:
          return 'grey';
      }
    },

    getRiskLevelTextColor(level) {
      switch (level) {
        case 'LOW':
          return 'white';
        case 'STANDARD':
          return 'black';
        case 'HIGH':
          return 'white';
        default:
          return 'white';
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
  meta() {
    return {
      title: 'Batch Management - EUDR Compliance',
    };
  },
};
</script>

<style scoped>
.batch-management-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-radius: 12px;
  border-left: 4px solid #7c3aed;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title i {
  color: #7c3aed;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.create-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.2);
}

.batch-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.stats-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-icon {
  flex-shrink: 0;
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.stats-label {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 8px 0;
}

.stats-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-text {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.batch-list-card {
  border-radius: 12px;
  margin-bottom: 30px;
}

.search-field {
  max-width: 300px;
}

.batch-table {
  margin-top: 16px;
}

.batch-code {
  display: flex;
  align-items: center;
}

.commodity-info {
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: stretch;
  }

  .create-btn {
    width: 100%;
  }

  .batch-stats-grid {
    grid-template-columns: 1fr;
  }

  .search-field {
    max-width: none;
  }
}
</style>"
