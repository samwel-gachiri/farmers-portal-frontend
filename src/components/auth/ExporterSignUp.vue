<template>
    <v-app class="tw-p-8 tw-bg-white tw-shadow-xl tw-rounded-2xl tw-max-w-5xl tw-mx-auto tw-mt-10">
        <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-8">
            <!-- Personal Details Section -->
            <div class="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
                <h2 class="tw-text-2xl tw-font-semibold tw-text-blue-600">Exporter Sign Up</h2>
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
                    placeholder="e.g. John Doe"
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
                    placeholder="e.g. john@email.com"
                />
            </div>
            <!-- Company Details Section -->
            <div class="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
                <h2 class="tw-text-2xl tw-font-semibold tw-text-blue-600">Company Details</h2>
                <v-text-field
                    label="Company Name"
                    dense
                    v-model="form.businessName"
                    :outlined="false"
                    :filled="true"
                    :rules="[required('Company name'), noDigitFormat()]"
                    :hide-details="false"
                    class="modern-input tw-w-full"
                    aria-label="Company Name"
                    placeholder="e.g. Exporters Ltd"
                />
            </div>
            <!-- License & Agreement Section -->
            <div class="tw-flex-1 tw-flex tw-flex-col tw-gap-4">
                <h2 class="tw-text-2xl tw-font-semibold tw-text-blue-600">License & Agreement</h2>
                <v-text-field
                    label="License ID"
                    dense
                    v-model="form.licenseId"
                    :outlined="false"
                    :filled="true"
                    :rules="[required('License Id')]"
                    :hide-details="false"
                    class="modern-input tw-w-full"
                    aria-label="License ID"
                    placeholder="e.g. LIC123456"
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
        licenseId: '',
      },
      ...validations,
    };
  },
  methods: {
    async signUpUser() {
      try {
        const user = {
          id: this.user.uid,
          name: this.form.name,
          email: this.form.email,
          phoneNumber: this.form.fullPhoneNumber,
          licenseId: this.form.licenseId,
        };
        const saveResponse = await axios.post('/farmers-service/exporter',
          user);
        if (saveResponse.data.success === true) {
          this.user = { ...this.user, ...saveResponse.data.data };
          this.$toast.success(`${this.userRole} profile set up`, 'success');
        } else {
          this.$toast.error(saveResponse.data.msg, 'Error');
        }
      } catch (e) {
        this.$toast.error(e.message, 'Error');
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
</style>
