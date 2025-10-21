<template>
  <div class="production-unit-manager">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-map-marker-multiple</v-icon>
        Production Units Management
        <v-spacer />
        <v-btn
          color="primary"
          @click="showCreateDialog = true"
          :disabled="loading"
        >
          <v-icon left>mdi-plus</v-icon>
          Add Farm
        </v-btn>
      </v-card-title>

      <!-- Production Units List -->
      <v-card-text>
        <v-row v-if="productionUnits.length === 0 && !loading">
          <v-col cols="12" class="text-center py-8">
            <v-icon size="64" color="grey lighten-1">mdi-map-marker-off</v-icon>
            <h3 class="grey--text mt-4">No Production Units</h3>
            <p class="grey--text">Add your first farm boundary to get started</p>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="unit in productionUnits"
            :key="unit.id"
            cols="12"
            md="6"
            lg="4"
          >
            <production-unit-card
              :unit="unit"
              @edit="editUnit"
              @delete="deleteUnit"
              @view="viewUnit"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog
      v-model="showCreateDialog"
      max-width="1200"
      persistent
      scrollable
    >
      <production-unit-form
        :unit="editingUnit"
        :farmer-id="farmerId"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog
      v-model="showViewDialog"
      max-width="1000"
      scrollable
    >
      <production-unit-viewer
        v-if="viewingUnit"
        :unit="viewingUnit"
        @close="showViewDialog = false"
        @edit="editFromViewer"
      />
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ deletingUnit?.unitName }}"?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
            :loading="deleting"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading Overlay -->
    <v-overlay v-model="loading" absolute>
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <!-- Snackbar for messages -->
    <v-snackbar
      v-model="showMessage"
      :color="messageType"
      timeout="4000"
      bottom
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { productionUnitService } from '@/services/productionUnitService.js';

import ProductionUnitCard from './ProductionUnitCard.vue';
import ProductionUnitForm from './ProductionUnitForm.vue';
import ProductionUnitViewer from './ProductionUnitViewer.vue';

export default {
  name: 'ProductionUnitManager',
  components: {
    ProductionUnitCard,
    ProductionUnitForm,
    ProductionUnitViewer,
  },
  props: {
    farmerId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      productionUnits: [],
      loading: false,

      // Dialog states
      showCreateDialog: false,
      showViewDialog: false,
      showDeleteDialog: false,

      // Current items
      editingUnit: null,
      viewingUnit: null,
      deletingUnit: null,
      deleting: false,

      // Messages
      showMessage: false,
      message: '',
      messageType: 'success',
    };
  },

  async mounted() {
    await this.loadProductionUnits();
  },

  methods: {
    async loadProductionUnits() {
      this.loading = true;
      try {
        const response = await productionUnitService.getByFarmer(this.farmerId);
        this.productionUnits = response.data || [];
      } catch (error) {
        this.showError('Failed to load production units');
        console.error('Error loading production units:', error);
      } finally {
        this.loading = false;
      }
    },

    editUnit(unit) {
      this.editingUnit = { ...unit };
      this.showCreateDialog = true;
    },

    viewUnit(unit) {
      this.viewingUnit = unit;
      this.showViewDialog = true;
    },

    deleteUnit(unit) {
      this.deletingUnit = unit;
      this.showDeleteDialog = true;
    },

    editFromViewer(unit) {
      this.showViewDialog = false;
      this.editingUnit = { ...unit };
      this.showCreateDialog = true;
    },

    async handleSave(unitData) {
      try {
        if (this.editingUnit?.id) {
          // Update existing unit
          await productionUnitService.update(this.editingUnit.id, unitData);
          this.showSuccess('Production unit updated successfully');
        } else {
          // Create new unit
          await productionUnitService.create({
            ...unitData,
            farmerId: this.farmerId,
          });
          this.showSuccess('Production unit created successfully');
        }

        await this.loadProductionUnits();
        this.handleCancel();
      } catch (error) {
        this.showError('Failed to save production unit');
        console.error('Error saving production unit:', error);
      }
    },

    handleCancel() {
      this.showCreateDialog = false;
      this.editingUnit = null;
    },

    async confirmDelete() {
      if (!this.deletingUnit) return;

      this.deleting = true;
      try {
        await productionUnitService.delete(this.deletingUnit.id);
        this.showSuccess('Production unit deleted successfully');
        await this.loadProductionUnits();
        this.showDeleteDialog = false;
        this.deletingUnit = null;
      } catch (error) {
        this.showError('Failed to delete production unit');
        console.error('Error deleting production unit:', error);
      } finally {
        this.deleting = false;
      }
    },

    showSuccess(message) {
      this.message = message;
      this.messageType = 'success';
      this.showMessage = true;
    },

    showError(message) {
      this.message = message;
      this.messageType = 'error';
      this.showMessage = true;
    },
  },
};
</script>

<style scoped>
.production-unit-manager {
  position: relative;
}
</style>
