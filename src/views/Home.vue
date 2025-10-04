<template>
  <v-app>
    <main class="home-root">
      <div class="home-shell">
        <header class="brand">
          <img src="@/assets/images/logo.png" alt="AgriBackup" class="brand-logo" />
          <div>
            <h1 class="brand-title">AgriBackup</h1>
            <p class="brand-sub">Smart farm records · Market access · Logistics</p>
          </div>
        </header>

        <section class="portals">
          <button class="tile" @click="openSignIn('farmer')" aria-label="Farmer portal">
            <div class="tile-icon"><v-icon size="24">mdi-barn</v-icon></div>
            <div class="tile-body">
              <div class="tile-title">Farmer</div>
              <div class="tile-sub">Manage crops & record yields</div>
            </div>
            <v-icon class="tile-arrow">mdi-arrow-right</v-icon>
          </button>

          <button class="tile" @click="openSignIn('buyer')" aria-label="Buyer portal">
            <div class="tile-icon"><v-icon size="24">mdi-cart</v-icon></div>
            <div class="tile-body">
              <div class="tile-title">Buyer</div>
              <div class="tile-sub">Connect with farmers & buy produce</div>
            </div>
            <v-icon class="tile-arrow">mdi-arrow-right</v-icon>
          </button>

          <button class="tile" @click="showExporterRoles = true" aria-label="Exporter portal">
            <div class="tile-icon"><v-icon size="24">mdi-export</v-icon></div>
            <div class="tile-body">
              <div class="tile-title">Exporter</div>
              <div class="tile-sub">Manage zones & logistics</div>
            </div>
            <v-icon class="tile-arrow">mdi-arrow-right</v-icon>
          </button>
        </section>

        <footer class="home-foot muted">© AgriBackup · Privacy · Terms</footer>
      </div>

      <v-dialog v-model="showExporterRoles" max-width="420" persistent>
        <v-card class="roles-card">
          <v-card-title class="tw-justify-center">Choose Exporter Role</v-card-title>
          <v-card-text>
            <div class="roles-grid">
              <v-btn block class="role" @click="openSignIn('exporter')">Super Admin</v-btn>
              <v-btn block class="role" @click="openSignIn('system_admin')">System Admin</v-btn>
              <v-btn block class="role" @click="openSignIn('zone_supervisor')">Zone Supervisor</v-btn>
            </div>
          </v-card-text>
          <v-card-actions class="tw-justify-center">
            <v-btn text @click="showExporterRoles = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </main>
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
/* Minimal modern Home view */
.home-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg, #f8fafc, #ffffff); padding: 36px; }
.home-shell { width: 100%; max-width: 980px; background: rgba(255,255,255,0.9); border-radius: 14px; padding: 32px; box-shadow: 0 12px 40px rgba(10,20,30,0.06); display:flex; flex-direction:column; gap:28px }
.brand { display:flex; align-items:center; gap:16px }
.brand-logo { width:56px; height:56px; border-radius:10px; object-fit:contain }
.brand-title { margin:0; font-size:20px; font-weight:700; color:#0f172a }
.brand-sub { margin:0; color:#64748b; font-size:13px }
.portals { display:grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap:16px }
.tile { display:flex; align-items:center; gap:12px; padding:18px; border-radius:12px; background:linear-gradient(180deg,#ffffff,#fbfdff); border:1px solid rgba(15,23,42,0.04); cursor:pointer; transition:transform .14s ease, box-shadow .14s ease }
.tile:hover { transform:translateY(-6px); box-shadow:0 10px 30px rgba(15,23,42,0.08) }
.tile-icon { width:44px; height:44px; display:flex; align-items:center; justify-content:center; background:#eef2ff; border-radius:10px; color:#0f172a }
.tile-body { flex:1 }
.tile-title { font-weight:700; font-size:15px; color:#0f172a }
.tile-sub { font-size:13px; color:#64748b }
.tile-arrow { color:#94a3b8 }
.home-foot { text-align:center; color:#94a3b8; font-size:13px; margin-top:8px }
.muted { color:#94a3b8 }
.roles-card { border-radius:12px }
.roles-grid { display:flex; flex-direction:column; gap:10px }
.role { text-transform:none }
</style>
