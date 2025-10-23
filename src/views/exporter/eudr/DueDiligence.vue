<template>
  <div class="due-diligence">
    <v-container fluid>
      <!-- Header -->
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <v-icon large color="amber" class="mr-3">mdi-gavel</v-icon>
              <div>
                <h1 class="text-h4 font-weight-bold">Due Diligence</h1>
                <p class="text-subtitle-1 text--secondary mb-0">
                  Conduct comprehensive supplier due diligence for EUDR compliance
                </p>
              </div>
            </div>
            <v-btn
              color="primary"
              @click="showNewAssessmentDialog = true"
              elevation="2"
            >
              <v-icon left>mdi-plus</v-icon>
              New Assessment
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Due Diligence Overview -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card class="dd-card completed" elevation="4">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-check-circle</v-icon>
              <div class="text-h3 font-weight-bold mt-2">{{ completedAssessments }}</div>
              <div class="text-subtitle-2">Completed</div>
              <div class="text-caption">Ready for export</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="dd-card in-progress" elevation="4">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-clock-outline</v-icon>
              <div class="text-h3 font-weight-bold mt-2">{{ inProgressAssessments }}</div>
              <div class="text-subtitle-2">In Progress</div>
              <div class="text-caption">Under review</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="dd-card pending" elevation="4">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-alert-circle</v-icon>
              <div class="text-h3 font-weight-bold mt-2">{{ pendingAssessments }}</div>
              <div class="text-subtitle-2">Pending</div>
              <div class="text-caption">Awaiting information</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="dd-card failed" elevation="4">
            <v-card-text class="text-center">
              <v-icon large color="white">mdi-close-circle</v-icon>
              <div class="text-h3 font-weight-bold mt-2">{{ failedAssessments }}</div>
              <div class="text-subtitle-2">Failed</div>
              <div class="text-caption">Requires action</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Due Diligence Checklist -->
      <v-row class="mb-4">
        <v-col cols="12" md="8">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-clipboard-check</v-icon>
              EUDR Due Diligence Checklist
            </v-card-title>
            <v-card-text>
              <div class="checklist-section">
                <div class="text-subtitle-1 font-weight-bold mb-3">
                  <v-icon color="success" class="mr-2">mdi-map-marker</v-icon>
                  Geolocation Information
                </div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.geolocation.coordinates"
                        label="GPS coordinates of production areas"
                        readonly
                      ></v-checkbox>
                    </div>
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.geolocation.polygons"
                        label="Polygon boundaries defined"
                        readonly
                      ></v-checkbox>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.geolocation.verification"
                        label="Third-party verification completed"
                        readonly
                      ></v-checkbox>
                    </div>
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.geolocation.monitoring"
                        label="Satellite monitoring active"
                        readonly
                      ></v-checkbox>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="checklist-section">
                <div class="text-subtitle-1 font-weight-bold mb-3">
                  <v-icon color="info" class="mr-2">mdi-calendar</v-icon>
                  Production Dates
                </div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.dates.harvest"
                        label="Harvest dates recorded"
                        readonly
                      ></v-checkbox>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.dates.cutoff"
                        label="Post-cutoff date compliance"
                        readonly
                      ></v-checkbox>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="checklist-section">
                <div class="text-subtitle-1 font-weight-bold mb-3">
                  <v-icon color="warning" class="mr-2">mdi-file-document</v-icon>
                  Documentation
                </div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.documentation.supplier"
                        label="Supplier declarations"
                        readonly
                      ></v-checkbox>
                    </div>
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.documentation.certificates"
                        label="Certificates and permits"
                        readonly
                      ></v-checkbox>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.documentation.contracts"
                        label="Supply contracts"
                        readonly
                      ></v-checkbox>
                    </div>
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.documentation.invoices"
                        label="Transaction records"
                        readonly
                      ></v-checkbox>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="checklist-section">
                <div class="text-subtitle-1 font-weight-bold mb-3">
                  <v-icon color="error" class="mr-2">mdi-alert-octagon</v-icon>
                  Risk Assessment
                </div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.risk.country"
                        label="Country risk assessment"
                        readonly
                      ></v-checkbox>
                    </div>
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.risk.deforestation"
                        label="Deforestation risk analysis"
                        readonly
                      ></v-checkbox>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.risk.supplier"
                        label="Supplier risk profile"
                        readonly
                      ></v-checkbox>
                    </div>
                    <div class="checklist-item">
                      <v-checkbox
                        v-model="checklist.risk.mitigation"
                        label="Mitigation measures implemented"
                        readonly
                      ></v-checkbox>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="success" class="mr-2">mdi-progress-check</v-icon>
              Completion Progress
            </v-card-title>
            <v-card-text>
              <div class="progress-item">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span>Overall Completion</span>
                  <span class="font-weight-bold">{{ overallProgress }}%</span>
                </div>
                <v-progress-linear
                  :value="overallProgress"
                  color="primary"
                  height="12"
                  rounded
                ></v-progress-linear>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="progress-breakdown">
                <div class="progress-item">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span>Geolocation</span>
                    <span class="text-caption">{{ geolocationProgress }}%</span>
                  </div>
                  <v-progress-linear
                    :value="geolocationProgress"
                    color="success"
                    height="6"
                    rounded
                  ></v-progress-linear>
                </div>
                <div class="progress-item">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span>Production Dates</span>
                    <span class="text-caption">{{ datesProgress }}%</span>
                  </div>
                  <v-progress-linear
                    :value="datesProgress"
                    color="info"
                    height="6"
                    rounded
                  ></v-progress-linear>
                </div>
                <div class="progress-item">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span>Documentation</span>
                    <span class="text-caption">{{ documentationProgress }}%</span>
                  </div>
                  <v-progress-linear
                    :value="documentationProgress"
                    color="warning"
                    height="6"
                    rounded
                  ></v-progress-linear>
                </div>
                <div class="progress-item">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span>Risk Assessment</span>
                    <span class="text-caption">{{ riskProgress }}%</span>
                  </div>
                  <v-progress-linear
                    :value="riskProgress"
                    color="error"
                    height="6"
                    rounded
                  ></v-progress-linear>
                </div>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="next-actions">
                <div class="text-subtitle-2 mb-2">Next Actions</div>
                <v-list dense>
                  <v-list-item
                    v-for="action in nextActions"
                    :key="action.id"
                    class="px-0"
                  >
                    <v-list-item-icon class="mr-2">
                      <v-icon :color="action.priority === 'High' ? 'error' : 'warning'" small>
                        mdi-circle
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="text-caption">
                        {{ action.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Due Diligence Assessments Table -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
              Due Diligence Assessments
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search assessments..."
                single-line
                hide-details
                dense
                outlined
                class="search-field"
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="assessments"
              :search="search"
              :loading="loading"
              class="elevation-0"
            >
              <template v-slot:item.supplier="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="32" class="mr-3">
                    <v-icon color="primary">mdi-account</v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ item.supplierName }}</div>
                    <div class="text-caption text--secondary">{{ item.batchId }}</div>
                  </div>
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
              <template v-slot:item.progress="{ item }">
                <div class="d-flex align-center">
                  <v-progress-circular
                    :value="item.progress"
                    :color="getProgressColor(item.progress)"
                    size="30"
                    width="3"
                    class="mr-2"
                  >
                    <span class="text-caption">{{ item.progress }}%</span>
                  </v-progress-circular>
                </div>
              </template>
              <template v-slot:item.dueDate="{ item }">
                <span :class="getDueDateClass(item.dueDate)">
                  {{ formatDate(item.dueDate) }}
                </span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="viewAssessment(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="success"
                  @click="continueAssessment(item)"
                  :disabled="item.status === 'Completed'"
                >
                  <v-icon>mdi-play</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="info"
                  @click="generateStatement(item)"
                  :disabled="item.status !== 'Completed'"
                >
                  <v-icon>mdi-file-document</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- New Assessment Dialog -->
    <v-dialog v-model="showNewAssessmentDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h5">Start New Due Diligence Assessment</v-card-title>
        <v-card-text>
          <v-form ref="assessmentForm" v-model="formValid">
            <v-select
              v-model="newAssessment.supplierId"
              :items="supplierOptions"
              label="Select Supplier"
              :rules="[v => !!v || 'Supplier is required']"
              required
              outlined
            ></v-select>
            <v-select
              v-model="newAssessment.batchId"
              :items="batchOptions"
              label="Select Batch"
              :rules="[v => !!v || 'Batch is required']"
              required
              outlined
            ></v-select>
            <v-text-field
              v-model="newAssessment.dueDate"
              label="Due Date"
              type="date"
              :rules="[v => !!v || 'Due date is required']"
              required
              outlined
            ></v-text-field>
            <v-textarea
              v-model="newAssessment.notes"
              label="Assessment Notes (Optional)"
              rows="3"
              outlined
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancelNewAssessment">Cancel</v-btn>
          <v-btn
            color="primary"
            :disabled="!formValid"
            :loading="creating"
            @click="createAssessment"
          >
            Start Assessment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'DueDiligence',
  data() {
    return {
      loading: false,
      search: '',
      showNewAssessmentDialog: false,
      formValid: false,
      creating: false,
      headers: [
        { text: 'Supplier/Batch', value: 'supplier', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
        { text: 'Progress', value: 'progress', sortable: true },
        { text: 'Due Date', value: 'dueDate', sortable: true },
        { text: 'Assessor', value: 'assessor', sortable: true },
        {
          text: 'Actions', value: 'actions', sortable: false, width: '150px',
        },
      ],
      assessments: [
        {
          id: 1,
          supplierName: 'Green Valley Farm',
          batchId: 'CB-2024-001',
          status: 'Completed',
          progress: 100,
          dueDate: '2024-12-20',
          assessor: 'John Smith',
        },
        {
          id: 2,
          supplierName: 'Mountain Coffee Co.',
          batchId: 'CC-2024-002',
          status: 'In Progress',
          progress: 75,
          dueDate: '2024-12-25',
          assessor: 'Jane Doe',
        },
        {
          id: 3,
          supplierName: 'Sunrise Plantation',
          batchId: 'SP-2024-003',
          status: 'Pending',
          progress: 25,
          dueDate: '2024-12-30',
          assessor: 'Mike Johnson',
        },
      ],
      supplierOptions: [
        { text: 'Green Valley Farm', value: 1 },
        { text: 'Mountain Coffee Co.', value: 2 },
        { text: 'Sunrise Plantation', value: 3 },
      ],
      batchOptions: [
        { text: 'CB-2024-001', value: 1 },
        { text: 'CC-2024-002', value: 2 },
        { text: 'SP-2024-003', value: 3 },
      ],
      newAssessment: {
        supplierId: null,
        batchId: null,
        dueDate: '',
        notes: '',
      },
      checklist: {
        geolocation: {
          coordinates: true,
          polygons: true,
          verification: false,
          monitoring: true,
        },
        dates: {
          harvest: true,
          cutoff: true,
        },
        documentation: {
          supplier: true,
          certificates: false,
          contracts: true,
          invoices: true,
        },
        risk: {
          country: true,
          deforestation: false,
          supplier: true,
          mitigation: false,
        },
      },
      nextActions: [
        { id: 1, title: 'Complete third-party verification', priority: 'High' },
        { id: 2, title: 'Upload missing certificates', priority: 'High' },
        { id: 3, title: 'Finalize deforestation analysis', priority: 'Medium' },
        { id: 4, title: 'Implement mitigation measures', priority: 'Medium' },
      ],
    };
  },
  computed: {
    completedAssessments() {
      return this.assessments.filter((a) => a.status === 'Completed').length;
    },
    inProgressAssessments() {
      return this.assessments.filter((a) => a.status === 'In Progress').length;
    },
    pendingAssessments() {
      return this.assessments.filter((a) => a.status === 'Pending').length;
    },
    failedAssessments() {
      return this.assessments.filter((a) => a.status === 'Failed').length;
    },
    geolocationProgress() {
      const items = Object.values(this.checklist.geolocation);
      return Math.round((items.filter(Boolean).length / items.length) * 100);
    },
    datesProgress() {
      const items = Object.values(this.checklist.dates);
      return Math.round((items.filter(Boolean).length / items.length) * 100);
    },
    documentationProgress() {
      const items = Object.values(this.checklist.documentation);
      return Math.round((items.filter(Boolean).length / items.length) * 100);
    },
    riskProgress() {
      const items = Object.values(this.checklist.risk);
      return Math.round((items.filter(Boolean).length / items.length) * 100);
    },
    overallProgress() {
      return Math.round((this.geolocationProgress + this.datesProgress + this.documentationProgress + this.riskProgress) / 4);
    },
  },
  methods: {
    getStatusColor(status) {
      const colors = {
        Completed: 'success',
        'In Progress': 'primary',
        Pending: 'warning',
        Failed: 'error',
      };
      return colors[status] || 'grey';
    },
    getProgressColor(progress) {
      if (progress >= 90) return 'success';
      if (progress >= 70) return 'primary';
      if (progress >= 50) return 'warning';
      return 'error';
    },
    getDueDateClass(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

      if (daysUntilDue < 0) return 'error--text';
      if (daysUntilDue <= 3) return 'warning--text';
      return '';
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    viewAssessment(assessment) {
      console.log('View assessment:', assessment);
    },
    continueAssessment(assessment) {
      console.log('Continue assessment:', assessment);
    },
    generateStatement(assessment) {
      console.log('Generate statement for:', assessment);
    },
    cancelNewAssessment() {
      this.showNewAssessmentDialog = false;
      this.resetForm();
    },
    async createAssessment() {
      if (!this.$refs.assessmentForm.validate()) return;

      this.creating = true;
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add to list (in real app, this would come from API response)
        const newId = Math.max(...this.assessments.map((a) => a.id)) + 1;
        this.assessments.unshift({
          id: newId,
          supplierName: this.supplierOptions.find((s) => s.value === this.newAssessment.supplierId)?.text,
          batchId: this.batchOptions.find((b) => b.value === this.newAssessment.batchId)?.text,
          status: 'Pending',
          progress: 0,
          dueDate: this.newAssessment.dueDate,
          assessor: 'Current User',
        });

        this.showNewAssessmentDialog = false;
        this.resetForm();
        this.$toast.success('Due diligence assessment started successfully!');
      } catch (error) {
        this.$toast.error('Failed to create assessment');
      } finally {
        this.creating = false;
      }
    },
    resetForm() {
      this.newAssessment = {
        supplierId: null,
        batchId: null,
        dueDate: '',
        notes: '',
      };
      if (this.$refs.assessmentForm) {
        this.$refs.assessmentForm.resetValidation();
      }
    },
  },
};
</script>

<style scoped>
.due-diligence {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.dd-card {
  transition: transform 0.2s;
  color: white;
}

.dd-card:hover {
  transform: translateY(-2px);
}

.dd-card.completed {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
}

.dd-card.in-progress {
  background: linear-gradient(135deg, #2196f3, #1565c0);
}

.dd-card.pending {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.dd-card.failed {
  background: linear-gradient(135deg, #f44336, #c62828);
}

.checklist-section {
  margin-bottom: 24px;
}

.checklist-item {
  margin-bottom: 8px;
}

.progress-item {
  margin-bottom: 16px;
}

.progress-breakdown .progress-item {
  margin-bottom: 12px;
}

.next-actions {
  background: rgba(0, 0, 0, 0.02);
  padding: 12px;
  border-radius: 8px;
}

.search-field {
  max-width: 300px;
}
</style>
