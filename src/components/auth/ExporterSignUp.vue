<template>
    <div class="tw-space-y-4">
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
            label="Company Name"
            dense
            v-model="form.businessName"
            :outlined="true"
            :filled="false"
            :rules="[required('Farm name'), noDigitFormat()]"
            :hide-details="false"
            class="modern-input"
        />
        <v-text-field
            label="License ID"
            dense
            v-model="form.licenseId"
            :outlined="true"
            :filled="false"
            :rules="[required('License Id')]"
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
    </div>
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
