<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-100">
    <form
      class="tw-bg-white tw-rounded-2xl tw-px-6 tw-py-8 tw-w-full tw-max-w-xs tw-flex tw-flex-col tw-items-center tw-border tw-border-gray-200 tw-shadow-lg"
      @submit.prevent="signIn"
      autocomplete="off"
    >
      <img
        src="@/assets/images/happy-farmer.jpg"
        alt="Happy Farmer"
        class="tw-w-20 tw-h-20 tw-object-cover tw-rounded-full tw-mb-3"
      />
      <h2 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-2">Login</h2>
      <div class="tw-w-full tw-space-y-4 tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-bg-gray-50">
        <div class="tw-flex tw-justify-center tw-space-x-1 tw-mb-1">
          <button
            type="button"
            :class="inputType === 'email' ? 'tw-bg-green-100 tw-text-green-700' : 'tw-bg-gray-100 tw-text-gray-700'"
            class="tw-px-3 tw-py-1 tw-rounded-lg tw-font-medium tw-transition"
            @click="inputType = 'email'"
          >
            Email
          </button>
          <button
            type="button"
            :class="inputType === 'phone' ? 'tw-bg-green-100 tw-text-green-700' : 'tw-bg-gray-100 tw-text-gray-700'"
            class="tw-px-3 tw-py-1 tw-rounded-lg tw-font-medium tw-transition"
            @click="inputType = 'phone'"
          >
            Phone
          </button>
        </div>
        <div v-if="inputType === 'email'">
          <input
            v-model="emailOrPhone"
            type="email"
            placeholder="Email"
            class="tw-w-full tw-py-2 tw-px-3 tw-border tw-border-gray-300 tw-rounded-xl tw-bg-white tw-text-base tw-shadow-sm focus:tw-border-primary focus:tw-ring-2 focus:tw-ring-primary tw-transition tw-outline-none"
            required
            aria-label="Email"
          />
        </div>
        <div v-else>
          <vue-phone-number-input
            v-model="phoneNumber"
            :default-country-code="'KE'"
            :preferred-countries="['KE', 'US', 'GB']"
            class="tw-w-full custom-phone-input"
            show-code-on-list
            aria-label="Phone"
            @update="onPhoneUpdate"
          />
        </div>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="tw-w-full tw-py-2 tw-px-3 tw-border tw-border-gray-300 tw-rounded-xl tw-bg-white tw-text-base tw-shadow-sm focus:tw-border-primary focus:tw-ring-2 focus:tw-ring-primary tw-transition tw-outline-none"
          required
          aria-label="Password"
        />
        <button
          type="submit"
          class="tw-bg-primary tw-text-white tw-font-semibold tw-py-2 tw-rounded-lg tw-w-full tw-text-base tw-transition tw-border tw-border-primary hover:tw-bg-primary-dark focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-primary tw-shadow"
        >
          Sign In
        </button>
      </div>
      <div class="tw-mt-3 tw-text-xs tw-text-gray-500">
        <span>Forgot password?</span>
        <a href="#" class="tw-text-green-600 hover:tw-underline tw-ml-1">Reset</a>
      </div>
    </form>
  </div>
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
  methods: {
    onPhoneUpdate(phoneData) {
      // Get the full international number with country code
      this.fullPhoneNumber = phoneData.e164 || phoneData.formatInternational;
      this.emailOrPhone = this.fullPhoneNumber; // Update emailOrPhone with full phone number
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
        // Dispatch the signIn action with the user data
        await this.$store.dispatch('auth/signIn', {
          data,
        });
        // TODO: handle success (e.g., redirect, show toast)
      } catch (error) {
        // TODO: handle error (e.g., show error toast)
      }
    },
  },
};
</script>

<style scoped>
/* Tailwind handles all styling */
:root {
  --tw-primary: #2563eb; /* Example primary color (blue-600) */
  --tw-primary-dark: #1e40af; /* Example primary dark (blue-800) */
}
.tw-bg-primary {
  background-color: var(--tw-primary);
}
.tw-border-primary {
  border-color: var(--tw-primary);
}
.tw-bg-primary-dark {
  background-color: var(--tw-primary-dark);
}
.tw-ring-primary {
  --tw-ring-color: var(--tw-primary);
}
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');

/* Custom styles for vue-phone-number-input */
.custom-phone-input >>> .vue-phone-number-input__input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.custom-phone-input >>> .vue-phone-number-input__country-selector {
  border-radius: 20px !important;
  border: 1px solid #d1d5db;
  background: #fff;
  margin: 0.5rem 0.75rem;
}

.custom-phone-input >>> .input-tel input-phone-number {
  border-radius: 0.75rem;
  border: 1px solid #0e5acc;
  background: #fff;
  padding: 0.5rem 0.75rem;
  flex: 1;
}

/* Focus styles */
.custom-phone-input >>> .vue-phone-number-input__country-selector:focus,
.custom-phone-input >>> .vue-phone-number-input__input:focus {
  border-color: var(--tw-primary);
  box-shadow: 0 0 0 2px var(--tw-primary);
  outline: none;
}
</style>
