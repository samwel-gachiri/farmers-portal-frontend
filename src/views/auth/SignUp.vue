<template>
  <v-app id="inspire">
    <v-main>
      <div class="tw-flex tw-h-full tw-flex-col tw-my-8 tw-mx-8 md:tw-p-8 tw-py-8 tw-gap-5 tw-rounded-lg">
        <header class="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-p-4">
          <div class="tw-flex tw-border tw-justify-center tw-flex-col">
            <h2 class="c-title c-green-text tw-text-2xl tw-font-bold tw-mb-4 md:tw-mb-0 md:tw-mr-4">
              Welcome To AgriConnect
              {{ form.userType }}
            </h2>
            <h2>Where farmers meet buyers</h2>
          </div>
          <img
              src="../../assets/images/logo.png"
              alt="Company Logo"
              class="tw-border tw-rounded-lg"
              width="100"
              height="100"
              loading="lazy"
          />
        </header>
        <div class="tw-flex tw-w-full tw-justify-center">
          <v-card
              class="md:tw-p-5 tw-p-2"
              draggable="true"
              elevation="2"
          >
            <card-title>Sign up</card-title>
            <phone-input />
            <password-form
                v-if="false"
                class="tw-w-full tw-border"
            />
            <div
                class="tw-mx-5 tw-pl-4 tw-my-6 tw-justify-end"
            >
              <router-link
                  to="SignIn"
              >Already have an account? Sign in</router-link>
            </div>
            <div class="tw-my-6 tw-mx-3">
              <v-btn
                  block
                  color="primary"
              >Login</v-btn>
            </div>
          </v-card>
        </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import validations from '@/utils/validations';
import PhoneInput from '@/components/layout/components/PhoneInput';
import CardTitle from '@/components/shared/CardTitle';
import PasswordForm from '@/components/layout/partials/nav/PasswordForm';

export default {
  components: { PasswordForm, CardTitle, PhoneInput },
  data() {
    return {
      form: {
        password: '',
        email: '',
        userType: null,
      },
      userTypes: ['Farmer', 'Buyer'],
      ...validations,
      selectedCountry: 'KE',
    };
  },
};
</script>
<style scoped>
</style>
