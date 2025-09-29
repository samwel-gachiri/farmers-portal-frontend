<template>
  <v-app>
    <div class="tw-relative tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-50">
      <!-- Decorative SVG background graphics -->
      <svg
        class="tw-absolute tw-top-0 tw-left-0 tw-w-1/3 tw-h-1/3 tw-opacity-30 tw-pointer-events-none"
        viewBox="0 0 400 400"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="200" cy="200" r="180" fill="#34d399" />
        <ellipse cx="100" cy="300" rx="80" ry="40" fill="#3b82f6" />
      </svg>
      <svg
        class="tw-absolute tw-bottom-0 tw-right-0 tw-w-1/4 tw-h-1/4 tw-opacity-20 tw-pointer-events-none"
        viewBox="0 0 300 300"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="50" y="50" width="200" height="200" rx="60" fill="#fbbf24" />
        <circle cx="250" cy="250" r="40" fill="#10b981" />
      </svg>
      <div class="tw-bg-white tw-rounded-xl tw-shadow-lg tw-px-8 tw-py-10 tw-w-full tw-max-w-md tw-flex tw-flex-col tw-items-center">
        <div class="tw-text-center tw-mb-8">
          <h1 class="tw-text-3xl tw-font-bold tw-text-gray-900 tw-mb-2">AgriBackup Portals</h1>
          <!-- <p class="tw-text-gray-600">Choose your portal to continue</p> -->
        </div>
        <div class="tw-flex tw-flex-col tw-gap-4 tw-w-full">
          <!-- Farmer Portal -->
          <button
            class="portal-card farmer-portal"
            @click="openSignIn('farmer')"
            aria-label="Access Farmer Portal"
          >
            <div class="portal-icon">
              <v-icon size="32" color="white">mdi-barn</v-icon>
            </div>
            <div class="portal-content">
              <h3 class="portal-title">Farmer Portal</h3>
              <p class="portal-description">Get guided Crop growth and Market access</p>
            </div>
            <v-icon color="white" class="portal-arrow">mdi-arrow-right</v-icon>
          </button>

          <!-- Buyer Portal -->
          <button
            class="portal-card buyer-portal"
            @click="openSignIn('buyer')"
            aria-label="Access Buyer Portal"
          >
            <div class="portal-icon">
              <v-icon size="32" color="white">mdi-cart</v-icon>
            </div>
            <div class="portal-content">
              <h3 class="portal-title">Buyer Portal</h3>
              <p class="portal-description">Register your own Farmers and Buy from farmers</p>
            </div>
            <v-icon color="white" class="portal-arrow">mdi-arrow-right</v-icon>
          </button>

          <!-- Exporter Portal -->
          <button
            class="portal-card exporter-portal"
            @click="showExporterRoles = true"
            aria-label="Access Exporter Portal"
          >
            <div class="portal-icon">
              <v-icon size="32" color="white">mdi-export</v-icon>
            </div>
            <div class="portal-content">
              <h3 class="portal-title">Exporter Portal</h3>
              <p class="portal-description">Manage all your farmers, zones and logistics</p>
            </div>
            <v-icon color="white" class="portal-arrow">mdi-arrow-right</v-icon>
            <!-- Yellow King Icon at 45 degrees -->
            <v-icon size="20" color="yellow" class="king-icon">mdi-crown</v-icon>
          </button>

        </div>
      </div>

      <!-- Exporter Role Selection Dialog -->
      <v-dialog v-model="showExporterRoles" max-width="400" persistent>
        <v-card class="exporter-roles-dialog">
          <v-card-title class="tw-text-center tw-pb-4">
            <span class="tw-text-xl tw-font-semibold">Select Your Role</span>
          </v-card-title>
          <v-card-text class="tw-px-6">
            <div class="tw-flex tw-flex-col tw-gap-3">
              <button
                class="role-button super-admin-role"
                @click="openSignIn('exporter')"
                aria-label="Sign in as Super Admin"
              >
                <v-icon left color="white">mdi-account-star</v-icon>
                Super Admin
                <span class="role-subtitle">Full system access</span>
              </button>
              <button
                class="role-button system-admin-role"
                @click="openSignIn('system_admin')"
                aria-label="Sign in as System Admin"
              >
                <v-icon left color="white">mdi-account-cog</v-icon>
                System Admin
                <span class="role-subtitle">System management</span>
              </button>
              <button
                class="role-button zone-supervisor-role"
                @click="openSignIn('zone_supervisor')"
                aria-label="Sign in as Zone Supervisor"
              >
                <v-icon left color="white">mdi-account-supervisor</v-icon>
                Zone Supervisor
                <span class="role-subtitle">Zone oversight</span>
              </button>
            </div>
          </v-card-text>
          <v-card-actions class="tw-justify-center tw-pb-6">
            <v-btn text @click="showExporterRoles = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
import { getCurrentUserRole } from '@/utils/roles.js';

export default {
  data() {
    return {
      showExporterRoles: false,
    };
  },
  methods: {
    async openSignIn(name) {
      const userName = String(name).toLowerCase();

      // Determine portal and role context
      let portal = userName;
      let role = '';
      // exporter roles may pass specific role identifiers like 'system_admin'
      if (portal !== 'farmer' && portal !== 'buyer' && portal !== 'exporter') {
        role = portal;
        portal = 'exporter';
      }

      // If switching roles/portals, sign out current user to avoid leaking session
      if (getCurrentUserRole() !== userName) {
        await this.$store.dispatch('auth/signOut');
      }

      // Persist portal context in the auth store so SignIn/SignUp can pick it up
      await this.$store.dispatch('auth/setPortalContext', { portal, role });

      // Keep existing behavior of setting view role for UI toggles
      await this.$store.dispatch('auth/setViewRole', userName);

      // Check for redirect query param and decode if present
      let redirectPath = this.$route.query.redirect;
      if (redirectPath) {
        try {
          redirectPath = atob(redirectPath);
        } catch (e) {
          // fallback: use as is if not base64
        }
        await this.$router.push(redirectPath);
      } else {
        const defaultRedirect = this.$router.resolve({ name: 'Dashboard' }).route.fullPath;
        await this.$router.push({
          name: 'SignIn',
          query: {
            mode: 'self',
            redirect: defaultRedirect,
          },
        });
      }
    },
  },
  computed: {
    getCurrentUserRole,
  },
};
</script>

<style scoped>
/* Portal Cards - Professional, no gradients */
.portal-card {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.portal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: currentColor;
}

.portal-card:focus {
  outline: none;
  /* accessible focus ring implemented via box-shadow */
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
}

.farmer-portal {
  background: #16a34a;
  color: white;
}

.farmer-portal:hover {
  background: #15803d;
}

.farmer-portal:focus {
  box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.18);
}

.buyer-portal {
  background: #2563eb;
  color: white;
}

.buyer-portal:hover {
  background: #1d4ed8;
}

.buyer-portal:focus {
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18);
}

.exporter-portal {
  background: #7c3aed;
  color: white;
  position: relative;
}

.exporter-portal:hover {
  background: #6d28d9;
}

.exporter-portal:focus {
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.18);
}

.portal-icon {
  margin-right: 1rem;
  flex-shrink: 0;
}

.portal-content {
  flex: 1;
}

.portal-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.portal-description {
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0;
}

.portal-arrow {
  margin-left: 1rem;
  flex-shrink: 0;
}

/* Yellow King Icon at 45 degrees */
.king-icon {
  position: absolute;
  top: -8px;
  left: -8px;
  transform: rotate(45deg);
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Role Selection Dialog */
.exporter-roles-dialog {
  border-radius: 1rem !important;
}

.role-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: left;
  position: relative;
}

.role-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.super-admin-role {
  background: #7c3aed;
  color: white;
}

.super-admin-role:hover {
  background: #6d28d9;
}

.system-admin-role {
  background: #ea580c;
  color: white;
}

.system-admin-role:hover {
  background: #dc2626;
}

.zone-supervisor-role {
  background: #0891b2;
  color: white;
}

.zone-supervisor-role:hover {
  background: #0e7490;
}

.role-subtitle {
  position: absolute;
  right: 1rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Ensure SVGs don't interfere with interaction */
.tw-pointer-events-none {
  pointer-events: none;
}
</style>
