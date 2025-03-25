<template>
  <v-app>
    <logo-title></logo-title>
    <div class="tw-flex tw-flex-col tw-items-center tw-p-6">
      <v-card class="tw-w-96 tw-p-6">
        <v-card-title class="tw-text-center tw-text-xl tw-font-bold">Forgot Password</v-card-title>
        <v-card-text>
          <v-form v-model="isValid">
<!--            <phone-number-input-->
<!--                class="tw-mt-6 tw-mb-3 tw-mx-5"-->
<!--                v-model="phoneNumber"-->
<!--                default-country-code="KE"-->
<!--                :preferred-countries="['KE', 'US', 'UG', 'TZ']"-->
<!--                @update:phoneNumber="(newValue) => (phoneNumber = newValue)"-->
<!--            />-->
            <v-text-field
                label="Input email"
                class="tw-mt-6"
                v-model="phoneNumber"
                placeholder="email@example.com"
                :rules="[emailFormat()]"
            >
              <v-icon slot="prepend" color="primary">mdi-email</v-icon>
            </v-text-field>
            <div class="tw-w-full tw-flex tw-flex-row-reverse">
              <router-link :to="{name: 'SignIn' }" class="tw-my-3">Back to Log In</router-link>
            </div>
            <v-btn color="primary" @click="sendCode" block :disabled="!isValid" :loading="loading">Send Reset Code</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import Auth from '@aws-amplify/auth';
import LogoTitle from '@/components/shared/LogoText.vue';
import Validations from '@/utils/validations.js';

export default {
  components: { LogoTitle },
  data() {
    return {
      loading: false,
      phoneNumber: '',
      isValid: false,
      ...Validations,
    };
  },
  methods: {
    async sendCode() {
      this.loading = true;
      try {
        await Auth.forgotPassword(this.phoneNumber);
        this.$emit('codeSent', this.phoneNumber);
      } catch (error) {
        this.$toast.error('Error sending reset code', error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
