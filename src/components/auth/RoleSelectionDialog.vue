<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    transition="dialog-bottom-transition"
    class="role-selection-dialog"
  >
    <v-card class="role-dialog-card">
      <v-toolbar flat color="transparent" class="px-4 mt-2">
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
             <v-icon color="green darken-2" size="32" class="mr-2">mdi-leaf</v-icon>
             <span class="text-h6 font-weight-bold grey--text text--darken-3">AgriBackup</span>
        </div>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text class="role-dialog-content d-flex align-center">
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="10" md="8" lg="10">
              <!-- Header -->
              <div class="text-center mb-10">
                <h1 class="text-h3 font-weight-bold mb-4 grey--text text--darken-3">
                  Welcome Back!
                </h1>
                <p class="text-h6 grey--text text--darken-1">
                  You have access to multiple profiles. Which one would you like to use today?
                </p>
              </div>

              <!-- Role Cards -->
              <v-row justify="center">
                <v-col
                  v-for="role in roles"
                  :key="role.roleType"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card
                    class="role-card fill-height"
                    hover
                    ripple
                    @click="selectAndConfirm(role)"
                    :class="`role-card-${role.roleType.toLowerCase()}`"
                  >
                    <v-card-text class="role-card-content d-flex flex-column align-center justify-center pa-6 fill-height">
                      <div class="role-icon mb-6 elevation-2" :style="`background-color: ${getRoleColorById(role.roleType, true)};`">
                        <v-icon size="48" :color="getRoleColorById(role.roleType)">
                          {{ getRoleIcon(role.roleType) }}
                        </v-icon>
                      </div>

                      <h3 class="text-h5 font-weight-bold mb-2 role-title grey--text text--darken-3">
                        {{ role.displayName }}
                      </h3>
                      <p class="text-body-2 grey--text text-center mb-0">
                        {{ getRoleDescription(role.roleType) }}
                      </p>

                      <v-btn
                        text
                        :color="getRoleColorById(role.roleType)"
                        class="mt-4 font-weight-bold"
                      >
                        Select Profile <v-icon small right>mdi-arrow-right</v-icon>
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <div class="text-center mt-12">
                <p class="caption grey--text lighten-1">
                  &copy; {{ new Date().getFullYear() }} AgriBackup Inc.
                </p>
              </div>

            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RoleSelectionDialog',
  data() {
    return {
      dialog: false,
      roles: [],
      selectedRoleType: null,
      resolveCallback: null,
    };
  },
  methods: {
    show(availableRoles) {
      this.roles = availableRoles || [];
      this.selectedRoleType = null;
      this.dialog = true;

      // Return promise that resolves when user selects a role
      return new Promise((resolve) => {
        this.resolveCallback = resolve;
      });
    },
    selectAndConfirm(role) {
      // Select and immediately confirm in one click
      this.selectedRoleType = role.roleType;
      if (this.resolveCallback) {
        this.dialog = false;
        this.resolveCallback(this.selectedRoleType);
        this.resolveCallback = null;
      }
    },
    getRoleIcon(roleType) {
      const icons = {
        FARMER: 'mdi-sprout',
        BUYER: 'mdi-shopping',
        EXPORTER: 'mdi-airplane',
        SUPPLIER: 'mdi-link-variant',
        AGGREGATOR: 'mdi-warehouse',
        PROCESSOR: 'mdi-factory',
        IMPORTER: 'mdi-import',
        AUTHORISED_REPRESENTATIVE: 'mdi-account-tie',
      };
      return icons[roleType] || 'mdi-account';
    },
    getRoleColorById(roleType, isBackground = false) {
      const colors = {
        FARMER: 'green darken-2',
        BUYER: 'orange darken-2',
        EXPORTER: 'purple darken-2',
        SUPPLIER: 'blue darken-2',
        AGGREGATOR: 'brown darken-2',
        PROCESSOR: 'indigo darken-2',
        IMPORTER: 'teal darken-2',
        AUTHORISED_REPRESENTATIVE: 'indigo darken-2',
      };
      const color = colors[roleType] || 'grey darken-2';

      if (isBackground) {
        // Map ease color names to likely hex/rgba for background tint
        const lightColors = {
          FARMER: '#e8f5e9', // green lighten-5
          BUYER: '#fff3e0', // orange lighten-5
          EXPORTER: '#f3e5f5', // purple lighten-5
          SUPPLIER: '#e3f2fd', // blue lighten-5
          AGGREGATOR: '#efebe9', // brown lighten-5
          PROCESSOR: '#e8eaf6', // indigo lighten-5
          IMPORTER: '#e0f2f1', // teal lighten-5
          AUTHORISED_REPRESENTATIVE: '#e8eaf6', // indigo lighten-5
        };
        return lightColors[roleType] || '#f5f5f5';
      }
      return color;
    },
    getRoleDescription(roleType) {
      const descriptions = {
        FARMER: 'Manage your farm, crops, and harvest records.',
        BUYER: 'Source fresh produce and manage orders.',
        EXPORTER: 'Ensure compliance and manage export shipments.',
        SUPPLIER: 'Manage aggregation, processing, and distribution.',
        IMPORTER: 'Import produce and manage compliance.',
        AUTHORISED_REPRESENTATIVE: 'Represent non-EU exporters for compliance.',
      };
      return descriptions[roleType] || 'Access your dashboard.';
    },
  },
};
</script>

<style scoped>
.role-dialog-card {
  background: #f8fafc; /* Light grey-blue background */
}

.role-dialog-content {
  /* Center content vertically if screen is large enough */
  min-height: calc(100vh - 64px);
}

.role-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 24px !important;
  border: 1px solid rgba(0,0,0,0.05);
}

.role-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08) !important;
  border-color: transparent !important;
}

/* Hover borders colors per role */
.role-card-farmer:hover { border: 2px solid #388e3c !important; } /* green darken-2 */
.role-card-buyer:hover { border: 2px solid #f57c00 !important; } /* orange darken-2 */
.role-card-exporter:hover { border: 2px solid #7b1fa2 !important; } /* purple darken-2 */
.role-card-supplier:hover { border: 2px solid #1976d2 !important; } /* blue darken-2 */
.role-card-importer:hover { border: 2px solid #00796b !important; } /* teal darken-2 */
.role-card-authorised_representative:hover { border: 2px solid #303f9f !important; } /* indigo darken-2 */

.role-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.role-card:hover .role-icon {
  transform: scale(1.1);
}

.role-title {
  letter-spacing: -0.5px;
}
</style>
