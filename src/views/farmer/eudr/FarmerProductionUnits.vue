<template>
  <div class="farmer-production-units">
    <v-container fluid>
      <!-- Header -->
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <v-icon large color="green" class="mr-3">mdi-map-marker-radius</v-icon>
              <div>
                <h1 class="text-h4 font-weight-bold">My Production Units</h1>
                <p class="text-subtitle-1 text--secondary mb-0">
                  Manage your farm production areas and land verification
                </p>
              </div>
            </div>
            <v-btn
              color="primary"
              @click="showAddDialog = true"
              elevation="2"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Production Unit
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Summary Cards -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="success">mdi-check-circle</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ verifiedUnits }}</div>
              <div class="text-caption">Verified Units</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="warning">mdi-clock-outline</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ pendingUnits }}</div>
              <div class="text-caption">Pending Verification</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="info">mdi-ruler-square</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ totalArea }}</div>
              <div class="text-caption">Total Hectares</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card" elevation="3">
            <v-card-text class="text-center">
              <v-icon large color="error">mdi-alert-circle</v-icon>
              <div class="text-h4 font-weight-bold mt-2">{{ alertsCount }}</div>
              <div class="text-caption">Active Alerts</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Production Units List -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
              Production Units
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search units..."
                single-line
                hide-details
                dense
                outlined
                class="search-field"
              ></v-text-field>
            </v-card-title>

            <v-data-table
              :headers="headers"
              :items="productionUnits"
              :search="search"
              :loading="loading"
              class="elevation-0"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  text-color="white"
                  small
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.area="{ item }">
                {{ item.area }} ha
              </template>

              <template v-slot:item.coordinates="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      v-bind="attrs"
                      v-on="on"
                      :color="item.coordinates ? 'success' : 'warning'"
                      text-color="white"
                      small
                    >
                      {{ item.coordinates ? 'Available' : 'Missing' }}
                    </v-chip>
                  </template>
                  <span v-if="item.coordinates">{{ item.coordinates }}</span>
                  <span v-else>GPS coordinates not provided</span>
                </v-tooltip>
              </template>

              <template v-slot:item.alerts="{ item }">
                <v-chip
                  :color="item.alerts > 0 ? 'error' : 'success'"
                  text-color="white"
                  small
                >
                  {{ item.alerts }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="viewUnit(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="warning"
                  @click="editUnit(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="info"
                  @click="viewOnMap(item)"
                >
                  <v-icon>mdi-map</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Add Production Unit Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h5">Add New Production Unit</v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="formValid">
            <v-text-field
              v-model="newUnit.name"
              label="Unit Name"
              :rules="[v => !!v || 'Name is required']"
              required
              outlined
            ></v-text-field>

            <v-text-field
              v-model="newUnit.area"
              label="Area (Hectares)"
              type="number"
              :rules="[v => !!v || 'Area is required', v => v > 0 || 'Area must be positive']"
              required
              outlined
            ></v-text-field>

            <v-text-field
              v-model="newUnit.coordinates"
              label="GPS Coordinates (Lat, Lng)"
              placeholder="e.g., -1.2345, 36.7890"
              outlined
            ></v-text-field>

            <v-text-field
              v-model="newUnit.region"
              label="Administrative Region"
              outlined
            ></v-text-field>

            <v-textarea
              v-model="newUnit.description"
              label="Description"
              rows="3"
              outlined
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancelAdd">Cancel</v-btn>
          <v-btn
            color="primary"
            :disabled="!formValid"
            :loading="saving"
            @click="saveUnit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'FarmerProductionUnits',

  data() {
    return {
      loading: false,
      search: '',
      showAddDialog: false,
      formValid: false,
      saving: false,

      headers: [
        { text: 'Unit Name', value: 'name', sortable: true },
        { text: 'Area', value: 'area', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
        { text: 'Coordinates', value: 'coordinates', sortable: false },
        { text: 'Region', value: 'region', sortable: true },
        { text: 'Alerts', value: 'alerts', sortable: true },
        {
          text: 'Actions', value: 'actions', sortable: false, width: '150px',
        },
      ],

      productionUnits: [
        {
          id: 1,
          name: 'North Field Coffee',
          area: 5.2,
          status: 'Verified',
          coordinates: '-1.2345, 36.7890',
          region: 'Central Kenya',
          alerts: 0,
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          name: 'South Valley Cocoa',
          area: 3.8,
          status: 'Pending',
          coordinates: null,
          region: 'Western Region',
          alerts: 1,
          createdAt: '2024-02-20',
        },
        {
          id: 3,
          name: 'East Hill Plantation',
          area: 7.5,
          status: 'Verified',
          coordinates: '-1.3456, 36.8901',
          region: 'Eastern Province',
          alerts: 0,
          createdAt: '2024-03-10',
        },
      ],

      newUnit: {
        name: '',
        area: null,
        coordinates: '',
        region: '',
        description: '',
      },
    };
  },

  computed: {
    verifiedUnits() {
      return this.productionUnits.filter((unit) => unit.status === 'Verified').length;
    },

    pendingUnits() {
      return this.productionUnits.filter((unit) => unit.status === 'Pending').length;
    },

    totalArea() {
      return this.productionUnits.reduce((sum, unit) => sum + unit.area, 0).toFixed(1);
    },

    alertsCount() {
      return this.productionUnits.reduce((sum, unit) => sum + unit.alerts, 0);
    },
  },

  methods: {
    getStatusColor(status) {
      const colors = {
        Verified: 'success',
        Pending: 'warning',
        Rejected: 'error',
        'Under Review': 'info',
      };
      return colors[status] || 'grey';
    },

    viewUnit(unit) {
      // Navigate to unit details
      this.$router.push({
        name: 'ProductionUnitDetails',
        params: { unitId: unit.id },
      });
    },

    editUnit(unit) {
      // Open edit dialog
      console.log('Edit unit:', unit);
    },

    viewOnMap(unit) {
      // Open map view
      console.log('View on map:', unit);
    },

    cancelAdd() {
      this.showAddDialog = false;
      this.resetForm();
    },

    async saveUnit() {
      if (!this.$refs.addForm.validate()) return;

      this.saving = true;

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add to list (in real app, this would come from API response)
        const newId = Math.max(...this.productionUnits.map((u) => u.id)) + 1;
        this.productionUnits.push({
          id: newId,
          ...this.newUnit,
          status: 'Pending',
          alerts: 0,
          createdAt: new Date().toISOString().split('T')[0],
        });

        this.showAddDialog = false;
        this.resetForm();

        this.$toast.success('Production unit added successfully!');
      } catch (error) {
        this.$toast.error('Failed to add production unit');
      } finally {
        this.saving = false;
      }
    },

    resetForm() {
      this.newUnit = {
        name: '',
        area: null,
        coordinates: '',
        region: '',
        description: '',
      };
      if (this.$refs.addForm) {
        this.$refs.addForm.resetValidation();
      }
    },
  },
};
</script>

<style scoped>
.farmer-production-units {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.summary-card {
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.search-field {
  max-width: 300px;
}

.v-data-table >>> .v-data-table__wrapper {
  border-radius: 8px;
}
</style>
