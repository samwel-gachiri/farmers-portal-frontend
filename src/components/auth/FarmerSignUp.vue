<template>
    <div class="tw-space-y-4">
        <v-dialog v-model="farmMapDialog">
            <FarmMap
                @farm-boundary-updated="handleFarmBoundaryUpdate"
                @farm-boundary-created="handleFarmBoundaryUpdate"
            />
        </v-dialog>
        <terms-and-conditions ref="termsDialog"/>
        <v-text-field
            label="Full Name"
            :outlined="true"
            :filled="false"
            dense
            v-model="form.name"
            :rules="[required('Name'), noDigitFormat()]"
            :hide-details="false"
            class="modern-input"
        />
        <div>
            <vue-phone-number-input
                v-model="form.phoneNumber"
                :default-country-code="'KE'"
                :preferred-countries="['KE', 'US', 'GB']"
                show-code-on-list
                @update="onPhoneUpdate"
            />
        </div>
        <div>
            <v-text-field
                v-model="form.email"
                label="Email Address"
                :outlined="true"
                :filled="false"
                dense
                :rules="[emailFormat()]"
                :hide-details="false"
                class="modern-input"
            />
        </div>
        <v-text-field
            label="Farm Name"
            dense
            v-model="form.farmName"
            :outlined="true"
            :filled="false"
            :rules="[required('Farm name'), noDigitFormat()]"
            :hide-details="false"
            class="modern-input"
        />

        <v-text-field
            label="Farm Size (acres)"
            :outlined="true"
            :filled="false"
            dense
            append-icon="mdi-map"
            @click:append="farmMapDialog = true"
            v-model="form.farmSize"
            :rules="[required('Farm size')]"
            :hide-details="false"
            class="modern-input"
        />

        <v-text-field
            label="Farm Location"
            dense
            v-model="form.location.customName"
            append-icon="mdi-map-marker"
            @click:append="getUserLocation"
            :rules="[required('Location')]"
            :hide-details="false"
            class="modern-input"
        />
        <v-text-field
            label="Password"
            type="password"
            v-model="form.password"
            :outlined="true"
            :filled="false"
            dense
            :rules="[required('Password')]"
            :hide-details="false"
            class="modern-input"
        />
        <v-checkbox
            id="checkbox"
            dense
            v-model="form.terms"
            :rules="[check()]"
            :color="'primary'"
            :hide-details="false"
        >
            <template v-slot:label>
                <div class="tw-text-sm tw-text-gray-600">
                I agree to the
                <a
                    class="tw-text-blue-600 hover:tw-text-blue-800 tw-underline"
                    href="#"
                    @click.prevent="openTermsDialog"
                >
                    Terms and Conditions
                </a>
                </div>
            </template>
        </v-checkbox>
        <!-- Modern Sign Up Button -->
        <button
            type="button"
            class="tw-bg-gradient-to-r tw-from-blue-600 tw-to-blue-400 tw-text-white tw-font-semibold tw-py-3 tw-px-6 tw-rounded-xl tw-shadow-lg tw-transition hover:tw-from-blue-700 hover:tw-to-blue-500 tw-w-full tw-mt-4 tw-text-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-300"
            @click="signUpUser"
        >
            Sign Up
        </button>
    </div>
</template>
<script>
import axios from 'axios';
// add default and phone number prop here
import TermsAndConditions from '@/components/auth/TermsAndConditions.vue';
import FarmMap from '@/components/FarmMap.vue';
import validations from '@/utils/validations.js';
import VuePhoneNumberInput from 'vue-phone-number-input';

export default {
  components: { FarmMap, TermsAndConditions, VuePhoneNumberInput },
  props: {
    phoneNumber: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {
        name: '',
        phoneNumber: '',
        email: '',
        password: '', // Added password field
        farmName: '',
        farmSize: '',
        location: {
          customName: '',
          lat: '',
          lng: '',
        },
      },
      userRole: 'farmer', // Default role
      farmMapDialog: false,
      ...validations,
    };
  },
  methods: {
    async signUpUser() {
      try {
        const userPayload = {
          user: {
            fullName: this.form.name,
            email: this.form.email,
            phoneNumber: this.form.fullPhoneNumber,
            password: this.form.password,
          },
          farmName: this.form.farmName,
          farmSize: parseFloat(this.form.farmSize.replace('acres', '').replace('acre', '').trim()) || 0,
          location: {
            latitude: parseFloat(this.form.location.lat) || 0,
            longitude: parseFloat(this.form.location.lng) || 0,
            customName: this.form.location.customName,
          },
          farmerProduces: [],
        };
        const saveResponse = await axios.post('/api/auth/register/farmer', userPayload);
        if (saveResponse.data.success === true) {
          this.user = { ...this.user, ...saveResponse.data.data };
          this.$toast.success(`${this.userRole} profile set up`, 'success');
        } else {
          this.$toast.error(saveResponse.data.msg, 'Error');
        }
      } catch (error) {
        this.$toast.error('Error signing up user:', error.message);
      }
    },
    getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.form.location.lat = position.coords.latitude;
          this.form.location.lng = position.coords.longitude;
          this.form.location.customName = `(${this.form.location.lat.toFixed(4)}, ${this.form.location.lng.toFixed(4)})`;
        },
      );
    },
    onPhoneUpdate(phoneData) {
      // Get the full international number with country code
      this.form.fullPhoneNumber = phoneData.e164 || phoneData.formatInternational;
    },
    openTermsDialog() {
      this.$refs.termsDialog.openDialog();
    },
    handleFarmBoundaryUpdate(payload) {
      // eslint-disable-next-line no-unused-vars
      const { geometry, area, location } = payload;
      this.form.farmSize = `${area.toFixed(5)} acres`;
      this.form.location.lat = location.lat.toFixed(4);
      this.form.location.lng = location.lng.toFixed(4);
      this.form.location.customName = `(${this.form.location.lat}, ${this.form.location.lng})`;
      this.farmMapDialog = false;
      this.$toast.success('Farm size received as', area.toString());
    },
  },
};
</script>
<style>
</style>
