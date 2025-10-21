<template>
  <Default>
    <div class="document-management-page">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="mdi mdi-file-document-multiple"></i>
            EUDR Document Management
          </h1>
          <p class="page-subtitle">
            Secure document storage with IPFS and Hedera blockchain verification
          </p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            @click="showUploadDialog = true"
            class="upload-btn"
          >
            <v-icon left>mdi-cloud-upload</v-icon>
            Upload Document
          </v-btn>
          <v-btn
            color="secondary"
            @click="checkIpfsStats"
            outlined
            class="stats-btn"
          >
            <v-icon left>mdi-chart-line</v-icon>
            IPFS Stats
          </v-btn>
        </div>
      </div>

      <!-- Document Statistics Cards -->
      <div class="document-stats-grid">
        <v-card class="stats-card total-documents" elevation="2">
          <v-card-text>
            <div class="stats-content">
              <div class="stats-icon">
                <v-icon large color="primary">mdi-file-document-multiple</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ documentStats.totalDocuments }}</h3>
                <p class="stats-label">Total Documents</p>
                <span class="stats-size">{{ formatFileSize(documentStats.totalSize) }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="stats-card ipfs-documents" elevation="2">
          <v-card-text>
            <div class="stats-content">
              <div class="stats-icon">
                <v-icon large color="purple">mdi-cube-outline</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ documentStats.ipfsDocuments }}</h3>
                <p class="stats-label">IPFS Stored</p>
                <div class="stats-progress">
                  <v-progress-linear
                    :value="documentStats.ipfsPercentage"
                    color="purple"
                    height="4"
                    rounded
                  ></v-progress-linear>
                  <span class="progress-text">{{ documentStats.ipfsPercentage }}%</span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="stats-card verified-documents" elevation="2">
          <v-card-text>
            <div class="stats-content">
              <div class="stats-icon">
                <v-icon large color="success">mdi-shield-check</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ documentStats.hederaVerified }}</h3>
                <p class="stats-label">Blockchain Verified</p>
                <div class="stats-progress">
                  <v-progress-linear
                    :value="documentStats.hederaPercentage"
                    color="success"
                    height="4"
                    rounded
                  ></v-progress-linear>
                  <span class="progress-text">{{ documentStats.hederaPercentage }}%</span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="stats-card document-types" elevation="2">
          <v-card-text>
            <div class="stats-content">
              <div class="stats-icon">
                <v-icon large color="info">mdi-file-tree</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ Object.keys(documentStats.typeBreakdown).length }}</h3>
                <p class="stats-label">Document Types</p>
                <span class="stats-detail">{{ getMostCommonType() }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Document List -->
      <v-card class="document-list-card" elevation="2">
        <v-card-title>
          <v-icon left color="primary">mdi-format-list-bulleted</v-icon>
          Document Library
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            label="Search documents..."
            single-line
            hide-details
            outlined
            dense
            class="search-field"
          ></v-text-field>
          <v-select
            v-model="filterType"
            :items="documentTypeOptions"
            label="Filter by type"
            outlined
            dense
            clearable
            class="ml-4 filter-select"
          ></v-select>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="documentHeaders"
            :items="filteredDocuments"
            :loading="loading"
            :items-per-page="10"
            class="document-table"
          >
            <template v-slot:item.fileName="{ item }">
              <div class="file-info">
                <v-icon :color="getFileTypeColor(item.mimeType)" class="mr-2">
                  {{ getFileTypeIcon(item.mimeType) }}
                </v-icon>
                <div>
                  <strong>{{ item.fileName }}</strong>
                  <br>
                  <small class="text--secondary">{{ formatFileSize(item.fileSize) }}</small>
                </div>
              </div>
            </template>

            <template v-slot:item.documentType="{ item }">
              <v-chip
                small
                :color="getDocumentTypeColor(item.documentType)"
                text-color="white"
              >
                {{ formatDocumentType(item.documentType) }}
              </v-chip>
            </template>

            <template v-slot:item.status="{ item }">
              <div class="status-indicators">
                <v-chip
                  v-if="item.isIpfsVerified"
                  x-small
                  color="purple"
                  text-color="white"
                  class="mr-1"
                >
                  <v-icon x-small left>mdi-cube-outline</v-icon>
                  IPFS
                </v-chip>
                <v-chip
                  v-if="item.isHederaVerified"
                  x-small
                  color="success"
                  text-color="white"
                >
                  <v-icon x-small left>mdi-shield-check</v-icon>
                  Hedera
                </v-chip>
              </div>
            </template>

            <template v-slot:item.uploadedAt="{ item }">
              {{ formatDateTime(item.uploadedAt) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="action-buttons">
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="viewDocument(item)"
                  title="View Document"
                >
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="secondary"
                  @click="downloadDocument(item)"
                  title="Download"
                >
                  <v-icon small>mdi-download</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.isHederaVerified"
                  icon
                  small
                  color="success"
                  @click="verifyIntegrity(item)"
                  title="Verify Integrity"
                >
                  <v-icon small>mdi-shield-check</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="info"
                  @click="shareDocument(item)"
                  title="Share"
                >
                  <v-icon small>mdi-share</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="error"
                  @click="deleteDocument(item)"
                  title="Delete"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Upload Dialog -->
      <v-dialog v-model="showUploadDialog" max-width="600px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">Upload Document to IPFS</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="showUploadDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form ref="uploadForm" v-model="uploadFormValid">
              <v-file-input
                v-model="selectedFile"
                label="Select Document"
                :rules="[rules.required]"
                accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx,.txt,.json"
                outlined
                dense
                show-size
                @change="validateSelectedFile"
              ></v-file-input>

              <v-select
                v-model="uploadData.documentType"
                :items="documentTypeOptions"
                label="Document Type"
                :rules="[rules.required]"
                outlined
                dense
              ></v-select>

              <v-text-field
                v-model="uploadData.ownerEntityId"
                label="Owner Entity ID"
                :rules="[rules.required]"
                outlined
                dense
              ></v-text-field>

              <v-select
                v-model="uploadData.ownerEntityType"
                :items="ownerEntityTypes"
                label="Owner Entity Type"
                :rules="[rules.required]"
                outlined
                dense
              ></v-select>

              <v-textarea
                v-model="uploadData.description"
                label="Description (Optional)"
                outlined
                dense
                rows="3"
              ></v-textarea>

              <div v-if="fileValidation.errors.length > 0" class="file-errors">
                <v-alert type="error" dense>
                  <ul class="mb-0">
                    <li v-for="error in fileValidation.errors" :key="error">{{ error }}</li>
                  </ul>
                </v-alert>
              </div>

              <div v-if="uploadProgress > 0" class="upload-progress">
                <v-progress-linear
                  :value="uploadProgress"
                  color="primary"
                  height="8"
                  rounded
                ></v-progress-linear>
                <p class="text-center mt-2">Uploading to IPFS... {{ uploadProgress }}%</p>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="showUploadDialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              @click="uploadDocument"
              :loading="uploading"
              :disabled="!uploadFormValid || !fileValidation.isValid"
            >
              Upload to IPFS
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- IPFS Stats Dialog -->
      <v-dialog v-model="showStatsDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">IPFS Network Statistics</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="showStatsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="ipfs-stats">
              <div class="stat-item">
                <v-icon color="purple" class="mr-2">mdi-cube-outline</v-icon>
                <span class="stat-label">Total Pins:</span>
                <span class="stat-value">{{ ipfsStats.totalPins }}</span>
              </div>
              <div class="stat-item">
                <v-icon color="info" class="mr-2">mdi-harddisk</v-icon>
                <span class="stat-label">Total Size:</span>
                <span class="stat-value">{{ formatFileSize(ipfsStats.totalSize) }}</span>
              </div>
              <div class="stat-item">
                <v-icon :color="ipfsStats.isConnected ? 'success' : 'error'" class="mr-2">
                  {{ ipfsStats.isConnected ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
                <span class="stat-label">Connection:</span>
                <span class="stat-value">{{ ipfsStats.isConnected ? 'Connected' : 'Disconnected' }}</span>
              </div>
              <div class="stat-item">
                <v-icon color="primary" class="mr-2">mdi-web</v-icon>
                <span class="stat-label">Gateway:</span>
                <span class="stat-value">{{ ipfsStats.gatewayUrl }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Loading Overlay -->
      <v-overlay :value="loading" z-index="1000">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
        <p class="mt-4 text-center">Loading documents...</p>
      </v-overlay>
    </div>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import { getCurrentUserId } from '@/utils/roles.js';
import { ipfsDocumentService } from '@/services/ipfsDocumentService.js';

export default {
  name: 'DocumentManagementView',
  components: {
    Default,
  },
  data() {
    return {
      loading: false,
      uploading: false,
      showUploadDialog: false,
      showStatsDialog: false,
      uploadFormValid: false,
      searchQuery: '',
      filterType: null,
      selectedFile: null,
      uploadProgress: 0,
      documentStats: {
        totalDocuments: 0,
        totalSize: 0,
        ipfsDocuments: 0,
        hederaVerified: 0,
        ipfsPercentage: 0,
        hederaPercentage: 0,
        typeBreakdown: {},
      },
      documents: [],
      uploadData: {
        documentType: '',
        ownerEntityId: '',
        ownerEntityType: 'FARMER',
        description: '',
      },
      fileValidation: {
        isValid: true,
        errors: [],
      },
      ipfsStats: {
        totalPins: 0,
        totalSize: 0,
        isConnected: false,
        gatewayUrl: '',
      },
      documentHeaders: [
        { text: 'File', value: 'fileName', sortable: true },
        { text: 'Type', value: 'documentType', sortable: true },
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Uploaded', value: 'uploadedAt', sortable: true },
        {
          text: 'Actions', value: 'actions', sortable: false, width: '200px',
        },
      ],
      ownerEntityTypes: [
        { text: 'Farmer', value: 'FARMER' },
        { text: 'Production Unit', value: 'PRODUCTION_UNIT' },
        { text: 'Batch', value: 'BATCH' },
        { text: 'Processor', value: 'PROCESSOR' },
      ],
      rules: {
        required: (value) => !!value || 'This field is required',
      },
    };
  },
  computed: {
    currentUserId() {
      return getCurrentUserId();
    },
    documentTypeOptions() {
      return ipfsDocumentService.getDocumentTypes();
    },
    filteredDocuments() {
      let filtered = this.documents;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((doc) => doc.fileName.toLowerCase().includes(query)
          || doc.documentType.toLowerCase().includes(query));
      }

      if (this.filterType) {
        filtered = filtered.filter((doc) => doc.documentType === this.filterType);
      }

      return filtered;
    },
  },
  async mounted() {
    await this.loadDocuments();
    this.setupUploadProgressListener();
  },
  beforeDestroy() {
    this.removeUploadProgressListener();
  },
  methods: {
    async loadDocuments() {
      this.loading = true;
      try {
        if (this.currentUserId) {
          this.documents = await ipfsDocumentService.getDocumentsByOwner(
            this.currentUserId,
            'FARMER',
          );
          this.calculateDocumentStats();
        }
      } catch (error) {
        console.error('Failed to load documents:', error);
        this.$toast.error('Failed to load documents');
      } finally {
        this.loading = false;
      }
    },

    calculateDocumentStats() {
      const total = this.documents.length;
      const ipfsCount = this.documents.filter((d) => d.isIpfsVerified).length;
      const hederaCount = this.documents.filter((d) => d.isHederaVerified).length;
      const totalSize = this.documents.reduce((sum, d) => sum + d.fileSize, 0);

      const typeBreakdown = {};
      this.documents.forEach((doc) => {
        typeBreakdown[doc.documentType] = (typeBreakdown[doc.documentType] || 0) + 1;
      });

      this.documentStats = {
        totalDocuments: total,
        totalSize,
        ipfsDocuments: ipfsCount,
        hederaVerified: hederaCount,
        ipfsPercentage: total > 0 ? Math.round((ipfsCount / total) * 100) : 0,
        hederaPercentage: total > 0 ? Math.round((hederaCount / total) * 100) : 0,
        typeBreakdown,
      };
    },

    validateSelectedFile() {
      if (this.selectedFile) {
        this.fileValidation = ipfsDocumentService.validateFile(this.selectedFile);
      } else {
        this.fileValidation = { isValid: true, errors: [] };
      }
    },

    async uploadDocument() {
      if (!this.$refs.uploadForm.validate() || !this.fileValidation.isValid) return;

      this.uploading = true;
      this.uploadProgress = 0;

      try {
        const metadata = {
          description: this.uploadData.description,
          uploadedBy: this.currentUserId,
          uploadedAt: new Date().toISOString(),
        };

        const result = await ipfsDocumentService.uploadDocument(
          this.selectedFile,
          this.uploadData.documentType,
          this.uploadData.ownerEntityId,
          this.uploadData.ownerEntityType,
          this.currentUserId,
          metadata,
        );

        if (result.success) {
          this.showUploadDialog = false;
          this.resetUploadForm();
          await this.loadDocuments();
          this.$toast.success('Document uploaded to IPFS successfully!');
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Failed to upload document:', error);
        this.$toast.error('Failed to upload document to IPFS');
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },

    resetUploadForm() {
      this.selectedFile = null;
      this.uploadData = {
        documentType: '',
        ownerEntityId: '',
        ownerEntityType: 'FARMER',
        description: '',
      };
      this.fileValidation = { isValid: true, errors: [] };
      if (this.$refs.uploadForm) {
        this.$refs.uploadForm.resetValidation();
      }
    },

    async downloadDocument(document) {
      try {
        await ipfsDocumentService.downloadDocument(document.id);
        this.$toast.success('Document downloaded successfully');
      } catch (error) {
        console.error('Failed to download document:', error);
        this.$toast.error('Failed to download document');
      }
    },

    async verifyIntegrity(document) {
      try {
        const result = await ipfsDocumentService.checkDocumentIntegrity([document.id]);
        const integrity = result.results[0];

        if (integrity.isValid) {
          this.$toast.success('Document integrity verified successfully');
        } else {
          this.$toast.warning('Document integrity verification failed');
        }
      } catch (error) {
        console.error('Failed to verify document integrity:', error);
        this.$toast.error('Failed to verify document integrity');
      }
    },

    async shareDocument(document) {
      try {
        const shareLink = await ipfsDocumentService.createSharingLink(document.id, 24);

        if (shareLink.success) {
          // Copy to clipboard
          await navigator.clipboard.writeText(shareLink.shareUrl);
          this.$toast.success('Share link copied to clipboard');
        }
      } catch (error) {
        console.error('Failed to create share link:', error);
        this.$toast.error('Failed to create share link');
      }
    },

    async deleteDocument(document) {
      // Show confirmation via toast
      this.$toast.warning(`Deleting "${document.fileName}"...`);

      try {
        await ipfsDocumentService.deleteDocument(document.id);
        await this.loadDocuments();
        this.$toast.success('Document deleted successfully');
      } catch (error) {
        console.error('Failed to delete document:', error);
        this.$toast.error('Failed to delete document');
      }
    },

    viewDocument(document) {
      // Open document in new tab if it's a viewable type
      const previewUrl = ipfsDocumentService.generatePreviewUrl(document);
      if (previewUrl) {
        window.open(previewUrl, '_blank');
      } else {
        this.$toast.info('Document preview not available for this file type');
      }
    },

    async checkIpfsStats() {
      try {
        this.ipfsStats = await ipfsDocumentService.getIpfsStats();
        this.showStatsDialog = true;
      } catch (error) {
        console.error('Failed to get IPFS stats:', error);
        this.$toast.error('Failed to get IPFS statistics');
      }
    },

    setupUploadProgressListener() {
      window.addEventListener('documentUploadProgress', this.handleUploadProgress);
    },

    removeUploadProgressListener() {
      window.removeEventListener('documentUploadProgress', this.handleUploadProgress);
    },

    handleUploadProgress(event) {
      this.uploadProgress = event.detail.percentCompleted;
    },

    getFileTypeIcon(mimeType) {
      return ipfsDocumentService.getFileTypeIcon(mimeType);
    },

    getFileTypeColor(mimeType) {
      const colorMap = {
        'application/pdf': 'red',
        'image/jpeg': 'green',
        'image/png': 'green',
        'image/tiff': 'green',
        'application/msword': 'blue',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'blue',
        'text/plain': 'grey',
        'application/json': 'orange',
      };
      return colorMap[mimeType] || 'grey';
    },

    getDocumentTypeColor(documentType) {
      const colorMap = {
        LAND_OWNERSHIP_CERTIFICATE: 'green',
        FARMING_LICENSE: 'blue',
        ENVIRONMENTAL_PERMIT: 'teal',
        ORGANIC_CERTIFICATE: 'green',
        QUALITY_CERTIFICATE: 'purple',
        EXPORT_LICENSE: 'indigo',
        PHYTOSANITARY_CERTIFICATE: 'cyan',
        INVOICE: 'orange',
        PACKING_LIST: 'brown',
        BILL_OF_LADING: 'deep-purple',
        INSURANCE_CERTIFICATE: 'red',
        THIRD_PARTY_VERIFICATION: 'pink',
        RISK_ASSESSMENT_REPORT: 'amber',
        DUE_DILIGENCE_STATEMENT: 'lime',
        SUPPLY_CHAIN_MAP: 'light-green',
        DEFORESTATION_ANALYSIS: 'deep-orange',
        SATELLITE_IMAGERY: 'blue-grey',
        FIELD_INSPECTION_REPORT: 'yellow',
        CORRECTIVE_ACTION_PLAN: 'red',
        COMPLIANCE_REPORT: 'green',
        OTHER: 'grey',
      };
      return colorMap[documentType] || 'grey';
    },

    formatDocumentType(documentType) {
      return documentType.replace(/_/g, ' ').toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
    },

    formatFileSize(bytes) {
      return ipfsDocumentService.formatFileSize(bytes);
    },

    formatDateTime(date) {
      return new Date(date).toLocaleString();
    },

    getMostCommonType() {
      const types = Object.entries(this.documentStats.typeBreakdown);
      if (types.length === 0) return 'None';

      const mostCommon = types.reduce((a, b) => (a[1] > b[1] ? a : b));
      return this.formatDocumentType(mostCommon[0]);
    },
  },
  meta() {
    return {
      title: 'Document Management - EUDR Compliance',
    };
  },
};
</script>

<style scoped>
.document-management-page {
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
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border-left: 4px solid #0ea5e9;
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
  color: #0ea5e9;
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

.upload-btn, .stats-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
}

.document-stats-grid {
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

.stats-size, .stats-detail {
  font-size: 0.8rem;
  color: #6b7280;
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

.document-list-card {
  border-radius: 12px;
  margin-bottom: 30px;
}

.search-field, .filter-select {
  max-width: 250px;
}

.document-table {
  margin-top: 16px;
}

.file-info {
  display: flex;
  align-items: center;
}

.status-indicators {
  display: flex;
  gap: 4px;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.file-errors {
  margin-top: 16px;
}

.upload-progress {
  margin-top: 16px;
}

.ipfs-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-weight: 500;
  min-width: 120px;
}

.stat-value {
  font-weight: 600;
  color: #1e293b;
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

  .upload-btn, .stats-btn {
    flex: 1;
  }

  .document-stats-grid {
    grid-template-columns: 1fr;
  }

  .search-field, .filter-select {
    max-width: none;
  }
}
</style>"
