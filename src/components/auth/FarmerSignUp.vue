<template>
  <v-app>
        <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-8">
            <!-- Personal Details Section -->
            <div class="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
              <h2 class="tw-text-lg tw-font-semibold">Personal Details</h2>
                <v-text-field
                    label="Full Name"
                    :outlined="false"
                    :filled="true"
                    dense
                    v-model="form.name"
                    :rules="[required('Name'), noDigitFormat()]"
                    :hide-details="false"
                    class="modern-input tw-w-full"
                    aria-label="Full Name"
                    autocomplete="name"
                    placeholder="e.g. Jane Doe"
                />
                <vue-phone-number-input
                    v-model="form.phoneNumber"
                    :default-country-code="'KE'"
                    :preferred-countries="['KE', 'US', 'GB']"
                    show-code-on-list
                    @update="onPhoneUpdate"
                    aria-label="Phone Number"
                    class="tw-w-full"
                    placeholder="e.g. +254712345678"
                />
                <v-text-field
                    v-model="form.email"
                    label="Email Address"
                    :outlined="false"
                    :filled="true"
                    dense
                    :rules="[emailFormat()]"
                    :hide-details="false"
                    class="modern-input tw-w-full"
                    aria-label="Email Address"
                    autocomplete="email"
                    placeholder="e.g. jane@email.com"
                />
            </div>
            <!-- Farm Details Section -->
            <div class="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
                <h2 class="tw-text-lg tw-font-semibold">Farm Details</h2>
                <v-text-field
                    label="Farm Name"
                    dense
                    v-model="form.farmName"
                    :outlined="false"
                    :filled="true"
                    :rules="[required('Farm name'), noDigitFormat()]"
                    :hide-details="false"
                    class="modern-input tw-w-full"
                    aria-label="Farm Name"
                    placeholder="e.g. Green Acres"
                />
                <v-text-field
                    label="Farm Size (acres)"
                    :outlined="false"
                    :filled="true"
                    dense
                    append-icon="mdi-map"
                    @click:append="farmMapDialog = true"
                    v-model="form.farmSize"
                    :rules="[required('Farm size')]"
                    :hide-details="false"
                    class="modern-input tw-w-full"
                    aria-label="Farm Size"
                    placeholder="e.g. 2.5"
                />
                <v-text-field
                    label="Farm Location"
                    dense
                    v-model="form.location.customName"
                    append-icon="mdi-map-marker"
                    @click:append="getUserLocation"
                    :rules="[required('Location')]"
                    :hide-details="false"
                    class="modern-input tw-w-full"
                    aria-label="Farm Location"
                    placeholder="e.g. (1.2345, 36.7890)"
                />
            </div>
            <!-- Password Section -->
            <div class="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
                <h2 class="tw-text-lg tw-font-semibold">Password</h2>
                <v-text-field
                    label="Password"
                    type="password"
                    v-model="form.password"
                    :outlined="false"
                    :filled="true"
                    dense
                    :rules="[required('Password')]"
                    :hide-details="false"
                    class="modern-input tw-w-full"
                    aria-label="Password"
                    autocomplete="new-password"
                    placeholder="e.g. ********"
                />
            </div>
        </div>
        <!-- Terms and Button Section -->
        <div class="tw-mt-8">
            <v-checkbox
                id="checkbox"
                dense
                v-model="form.terms"
                :rules="[check()]"
                :color="'primary'"
                :hide-details="false"
                aria-checked="form.terms"
                aria-label="Agree to Terms and Conditions"
            >
                <template v-slot:label>
                    <div class="tw-text-sm tw-text-gray-600">
                    I agree to the
                    <a
                        class="tw-text-blue-600 hover:tw-text-blue-800 tw-underline"
                        href="#"
                        @click.prevent="openTermsDialog"
                        aria-label="Open Terms and Conditions"
                    >
                        Terms and Conditions
                    </a>
                    </div>
                </template>
            </v-checkbox>
            <div class="tw-flex tw-justify-end tw-mt-4">
                <v-btn
                    color="primary"
                    class="tw-py-3 tw-px-10 tw-rounded-xl tw-text-lg tw-font-semibold tw-shadow-lg"
                    @click="signUpUser"
                    aria-label="Sign Up"
                >
                    Sign Up
                </v-btn>
            </div>
        </div>
        <v-dialog v-model="farmMapDialog" aria-modal="true" role="dialog">
            <FarmMap
                @farm-boundary-updated="handleFarmBoundaryUpdate"
                @farm-boundary-created="handleFarmBoundaryUpdate"
            />
        </v-dialog>
        <terms-and-conditions ref="termsDialog"/>
    </v-app>
</template>
<script>
import axios from 'axios';
import TermsAndConditions from '@/components/auth/TermsAndConditions.vue';
import FarmMap from '@/components/FarmMap.vue';
import validations from '@/utils/validations.js';
import VuePhoneNumberInput from 'vue-phone-number-input';

export default {
  components: {
    FarmMap, TermsAndConditions, VuePhoneNumberInput,
  },
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
        password: '',
        farmName: '',
        farmSize: '',
        location: {
          customName: '',
          lat: '',
          lng: '',
        },
        terms: false,
        fullPhoneNumber: '',
      },
      userRole: 'farmer',
      farmMapDialog: false,
      ...validations,
    };
  },
  watch: {
    // Watch for changes in the custom location name and update lat/lng if possible
    // eslint-disable-next-line func-names
    'form.location.customName': function (val) {
      // Match format: (lat, lng)
      const match = /^\s*\(?\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\)?\s*$/.exec(val);
      if (match) {
        this.form.location.lat = parseFloat(match[1]);
        this.form.location.lng = parseFloat(match[3]);
      }
    },
  },
  methods: {
    // Handles user sign up API call
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
    // Uses browser geolocation to get user's current location
    getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.form.location.lat = position.coords.latitude;
          this.form.location.lng = position.coords.longitude;
          this.form.location.customName = `(${this.form.location.lat.toFixed(4)}, ${this.form.location.lng.toFixed(4)})`;
        },
      );
    },
    // Updates phone number to international format
    onPhoneUpdate(phoneData) {
      this.form.fullPhoneNumber = phoneData.e164 || phoneData.formatInternational;
    },
    openTermsDialog() {
      this.$refs.termsDialog.openDialog();
    },
    // Handles farm boundary update from map dialog
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
/* ...existing code... */
</style>
