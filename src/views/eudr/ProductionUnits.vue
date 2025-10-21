<template>
  <Default>
    <div class="production-units-page">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="mdi mdi-map-marker-radius"></i>
            Production Units Management
          </h1>
          <p class="page-subtitle">
            Manage your farm production units with precise polygon mapping for EUDR compliance
          </p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            @click="showCreateDialog = true"
            class="create-btn"
          >
            <v-icon left>mdi-plus</v-icon>
            Add Production Unit
          </v-btn>
        </div>
      </div>

      <!-- Production Units Manager Component -->
      <ProductionUnitManager
        :farmer-id="currentFarmerId"
        @unit-created="handleUnitCreated"
        @unit-updated="handleUnitUpdated"
      />

      <!-- Create Production Unit Dialog -->
      <v-dialog v-model="showCreateDialog" max-width="800px" persistent>
        <ProductionUnitForm
          :farmer-id="currentFarmerId"
          @created="handleUnitCreated"
          @cancelled="showCreateDialog = false"
        />
      </v-dialog>

      <!-- Success Snackbar -->
      <v-snackbar
        v-model="showSuccess"
        color="success"
        timeout="3000"
        top
      >
        {{ successMessage }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showSuccess = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import ProductionUnitManager from '@/components/eudr/ProductionUnitManager.vue';
import ProductionUnitForm from '@/components/eudr/ProductionUnitForm.vue';
import { getCurrentUserId } from '@/utils/roles.js';

export default {
  name: 'ProductionUnitsView',
  components: {
    Default,
    ProductionUnitManager,
    ProductionUnitForm,
  },
  data() {
    return {
      showCreateDialog: false,
      showSuccess: false,
      successMessage: '',
    };
  },
  computed: {
    currentFarmerId() {
      return getCurrentUserId() || this.$route.params.farmerId;
    },
  },
  methods: {
    handleUnitCreated(unit) {
      this.showCreateDialog = false;
      this.successMessage = `Production unit "${unit.unitName}" created successfully!`;
      this.showSuccess = true;
    },
    handleUnitUpdated(unit) {
      this.successMessage = `Production unit "${unit.unitName}" updated successfully!`;
      this.showSuccess = true;
    },
  },
  meta() {
    return {
      title: 'Production Units - EUDR Compliance',
    };
  },
};
</script>

<style scoped>
.production-units-page {
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
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border-left: 4px solid #16a34a;
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
  color: #16a34a;
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
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.2);
}

.create-btn:hover {
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  transform: translateY(-1px);
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
}
</style>"
