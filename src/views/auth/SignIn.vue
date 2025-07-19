<template>
  <v-app>
    <v-main>
      <div class="minimal-bg">
        <!-- Minimal SVG background graphic -->
        <svg
          class="minimal-bg-svg"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="400"
            cy="300"
            rx="320"
            ry="180"
            fill="#1976d2"
            fill-opacity="0.08"
          />
          <ellipse
            cx="600"
            cy="100"
            rx="120"
            ry="60"
            fill="#43a047"
            fill-opacity="0.1"
          />
          <ellipse
            cx="200"
            cy="500"
            rx="100"
            ry="40"
            fill="#fffde7"
            fill-opacity="0.13"
          />
        </svg>
      </div>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="pa-6" elevation="12" rounded="xl">
              <v-card-title class="justify-center">
                <v-avatar size="64">
                  <v-img src="@/assets/images/happy-farmer.jpg" alt="Happy Farmer" />
                </v-avatar>
              </v-card-title>
              <v-card-subtitle class="text-center text-h5 font-weight-bold mb-2">
                Login
              </v-card-subtitle>
              <v-card-text>
                <v-btn-toggle v-model="inputType" class="mb-4" mandatory>
                  <v-btn value="email" variant="outlined">Email</v-btn>
                  <v-btn value="phone" variant="outlined">Phone</v-btn>
                </v-btn-toggle>
                <div v-if="inputType === 'email'">
                  <v-text-field
                    v-model="emailOrPhone"
                    label="Email"
                    type="email"
                    prepend-inner-icon="mdi-email-outline"
                    outlined
                    dense
                    required
                    autocomplete="off"
                  />
                </div>
                <div v-else class="tw-mb-6">
                  <vue-phone-number-input
                    v-model="phoneNumber"
                    :default-country-code="'KE'"
                    :preferred-countries="['KE', 'US', 'GB']"
                    class="w-100"
                    show-code-on-list
                    aria-label="Phone"
                    @update="onPhoneUpdate"
                  />
                </div>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  prepend-inner-icon="mdi-lock-outline"
                  outlined
                  dense
                  required
                  autocomplete="off"
                  class="mt-2"
                />
                <v-btn
                  color="primary"
                  class="mt-4"
                  block
                  large
                  rounded
                  @click="signIn"
                >
                  Sign In
                </v-btn>
                <div class="mt-3 text-center">
                  <span class="text-caption">Forgot password?</span>
                  <v-btn
                    text
                    color="primary"
                    class="ml-1"
                    small
                    @click="$router.push({ name: 'ForgotPassword' })"
                  >Reset</v-btn>
                </div>
                <div class="mt-2 text-center">
                  <span class="text-caption">Don't have an account?</span>
                  <v-btn
                    text
                    color="primary"
                    class="ml-1"
                    small
                    @click="$router.push({ name: 'SignUp' })"
                  >
                    Sign Up
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { getCurrentUserRole } from '@/utils/roles.js';

export default {
  components: { VuePhoneNumberInput },
  data() {
    return {
      inputType: 'email',
      emailOrPhone: '',
      phoneNumber: '',
      fullPhoneNumber: '',
      password: '',
    };
  },
  mounted() {
    // If role is empty, redirect to Home with redirect to SignIn
    const role = getCurrentUserRole();
    if (!role) {
      this.$toast.info('Please select a role to sign in');
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      this.$router.push({
        name: 'Home',
        query: {
          redirect: btoa(currentPath),
        },
      });
    } else {
      this.$toast.info(`Signing in as ${role}`);
    }
  },
  methods: {
    onPhoneUpdate(phoneData) {
      // Get the full international number with country code
      this.fullPhoneNumber = phoneData.e164 || phoneData.formatInternational;
      this.emailOrPhone = this.fullPhoneNumber;
    },
    async signIn() {
      try {
        const payload = {
          emailOrPhone: this.emailOrPhone,
          password: this.password,
          roleType: getCurrentUserRole().toUpperCase(),
        };
        const response = await axios.post('/api/auth/login', payload);
        const data = response.data.data;
        await this.$store.dispatch('auth/signIn', { data });
        // Redirect to intended route or dashboard
        const redirect = this.$route.query.redirect;
        if (redirect) {
          this.$router.push(redirect);
        } else {
          this.$router.push({ name: 'Dashboard' });
        }
      } catch (error) {
        // TODO: handle error (e.g., show error toast)
        this.$toast.error(`Login failed: ${error.response?.data?.message || error.message}`);
      }
    },
  },
};
</script>

<style scoped>
/* Vuetify handles most styling. Custom styles for vue-phone-number-input: */
.vue-phone-number-input__input-wrapper {
  display: flex;
  gap: 0.5rem;
}
.vue-phone-number-input__country-selector {
  border-radius: 20px !important;
  border: 1px solid #d1d5db;
  background: #fff;
  margin: 0.5rem 0.75rem;
}
.input-tel input-phone-number {
  border-radius: 0.75rem;
  border: 1px solid #0e5acc;
  background: #fff;
  padding: 0.5rem 0.75rem;
  flex: 1;
}
.vue-phone-number-input__country-selector:focus,
.vue-phone-number-input__input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px #1976d2;
  outline: none;
}

/* Minimal background graphic styles */
.minimal-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.minimal-bg-svg {
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 0;
  display: block;
}
</style>
