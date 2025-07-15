<template>
    <div class="tw-space-y-4">
        <terms-and-conditions ref="termsDialog"/>
        <v-text-field
            label="Full Name"
            :outlined="mode !== 'exporter'"
            :filled="mode === 'exporter'"
            dense
            v-model="form.name"
            :rules="[required('Name'), noDigitFormat()]"
            :hide-details="mode === 'exporter' ? 'auto' : false"
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
                :outlined="mode !== 'exporter'"
                :filled="mode === 'exporter'"
                dense
                :rules="[emailFormat()]"
                :hide-details="mode === 'exporter' ? 'auto' : false"
                class="modern-input"
            />
        </div>
        <v-text-field
            label="Business Name"
            dense
            v-model="form.businessName"
            :outlined="mode !== 'exporter'"
            :filled="mode === 'exporter'"
            :rules="[required('Farm name'), noDigitFormat()]"
            :hide-details="mode === 'exporter' ? 'auto' : false"
            class="modern-input"
        />
        <v-checkbox
            id="checkbox"
            dense
            v-model="form.terms"
            :rules="[check()]"
            :color="mode === 'exporter' ? 'teal' : 'primary'"
            :hide-details="mode === 'exporter' ? 'auto' : false"
        >
            <template v-slot:label>
                <div class="tw-text-sm" :class="mode === 'exporter' ? 'tw-text-gray-700' : 'tw-text-gray-600'">
                I agree to the
                <a
                    :class="mode === 'exporter' ? 'tw-text-teal-600 hover:tw-text-teal-800' : 'tw-text-blue-600 hover:tw-text-blue-800'"
                    href="#"
                    @click.prevent="openTermsDialog"
                    class="tw-underline"
                >
                    Terms and Conditions
                </a>
                </div>
            </template>
        </v-checkbox>
    </div>
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
        licenseId: '',
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
        console.error('Error signing up user:', error);
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
<style></style>
