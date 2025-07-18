<template>
    <v-app class="tw-p-8 tw-bg-white tw-shadow-xl tw-rounded-2xl tw-max-w-5xl tw-mx-auto tw-mt-10">
        <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-8">
            <!-- Personal Details Section -->
            <div class="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
                <h2 class="tw-text-lg tw-font-semibold tw-text-green-600">Personal Details</h2>
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
            <!-- Business Details Section -->
            <div class="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
                <h2 class="tw-text-lg tw-font-semibold tw-text-green-600">Business Details</h2>
                <v-text-field
                    label="Business Name"
                    dense
                    v-model="form.businessName"
                    :outlined="false"
                    :filled="true"
                    :rules="[required('Business name'), noDigitFormat()]"
                    :hide-details="false"
                    class="modern-input tw-w-full"
                    aria-label="Business Name"
                    placeholder="e.g. Buyer Ltd"
                />
            </div>
            <!-- Password Section -->
            <div class="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
                <h2 class="tw-text-lg tw-font-semibold tw-text-green-600">Password</h2>
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
                :color="mode === 'exporter' ? 'teal' : 'primary'"
                :hide-details="mode === 'exporter' ? 'auto' : false"
                aria-checked="form.terms"
                aria-label="Agree to Terms and Conditions"
            >
                <template v-slot:label>
                    <div class="tw-text-sm" :class="mode === 'exporter' ? 'tw-text-gray-700' : 'tw-text-gray-600'">
                    I agree to the
                    <a
                        :class="mode === 'exporter' ? 'tw-text-teal-600 hover:tw-text-teal-800' : 'tw-text-green-600 hover:tw-text-blue-800'"
                        href="#"
                        @click.prevent="openTermsDialog"
                        class="tw-underline"
                        aria-label="Open Terms and Conditions"
                    >
                        Terms and Conditions
                    </a>
                    </div>
                </template>
            </v-checkbox>
            <div class="tw-flex tw-justify-end tw-my-2">
                <v-btn
                    color="primary"
                    class="tw-px-8 tw-py-3 tw-rounded-xl tw-font-semibold tw-text-lg tw-shadow"
                    @click="signUpUser"
                    aria-label="Sign Up"
                >
                  Sign Up
                </v-btn>
            </div>
        </div>
        <terms-and-conditions ref="termsDialog"/>
    </v-app>
</template>
<script>
// add default and phone number prop here
import axios from 'axios';
import TermsAndConditions from '@/components/auth/TermsAndConditions.vue';
import validations from '@/utils/validations.js';
import VuePhoneNumberInput from 'vue-phone-number-input';

export default {
  components: { TermsAndConditions, VuePhoneNumberInput },
  data() {
    return {
      form: {
        name: '',
        phoneNumber: '',
        email: '',
        businessName: '',
        password: '', // Added password field
        licenseId: '',
        terms: false,
        fullPhoneNumber: '',
      },
      ...validations,
      mode: 'exporter', // or 'farmer' based on your logic
    };
  },
  methods: {
    async signUpUser() {
      try {
        const user = {
          id: this.user.uid,
          uid: this.user.uid,
          name: this.form.name,
          email: this.form.email,
          phoneNumber: this.form.fullPhoneNumber,
          createdAt: '',
          preferredProduces: [],
          location: {
            latitude: this.form.location.lat,
            longitude: this.form.location.lng,
            customName: '',
          },
        };
        const saveResponse = await axios.post('/buyers-service/buyer',
          user);
        if (saveResponse.data.success === true) {
          this.user = { ...this.user, ...saveResponse.data.data };
          this.$toast.success('Buyer\'s profile set up', 'success');
        } else {
          this.$toast.error(saveResponse.data.msg, 'Error');
        }
      } catch (error) {
        this.$toast.error('Error signing up user:', error.message);
      }
    },
    onPhoneUpdate(phoneData) {
      // Get the full international number with country code
      this.form.fullPhoneNumber = phoneData.e164 || phoneData.formatInternational;
    },
    openTermsDialog() {
      this.$refs.termsDialog.openDialog();
    },
  },
};
</script>
<style>
/* ...existing code... */
</style>
