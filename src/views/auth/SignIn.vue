<template>
  <v-app id="inspire">
    <v-main>
      <div v-if="!form.userType" class="tw-h-full">
        <div class="tw-flex h-80 md:tw-flex-row tw-flex-col-reverse tw-justify-start tw-gap-5 tw-items-center tw-px-12">
          <h1
            style="font-size: 46px"
            class="c-green-text tw-font-bold"
          >Log in to access your account</h1>
          <img
              src="../../assets/images/logo.png"
              alt="Company Logo"
              class="tw-border tw-rounded-lg tw-pl-5"
              loading="lazy"
          />
        </div>
        <div class="tw-flex md:tw-flex-row tw-flex-col tw-w-full tw-gap-5 tw-p-12">
          <div
            v-for="(user, index) in userTypes"
            :key="index"
            class="tw-flex tw-flex-row tw-w-full tw-border-b-4 tw-border-black tw-pb-5 hover:tw-bg-gray-100"
            @click="form.userType = user"
          >
            <h2 style="font-size: 32px"
              class="tw-font-bold tw-w-full c-green-text"
            >{{ user }}</h2>
            <v-icon
                size="30px"
                large
                color="black"
                class="font-weight-bold tw-font-bold"
            >mdi-arrow-right</v-icon>
          </div>
        </div>
      </div>
      <div v-else class="tw-flex tw-h-full tw-flex-col tw-my-8 tw-mx-8 md:tw-p-8 tw-py-8 tw-gap-5 tw-rounded-lg">
        <header class="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-p-4">
          <h2 class="c-title c-green-text tw-text-2xl tw-font-bold tw-mb-4 md:tw-mb-0 md:tw-mr-4">
            Welcome To AgriConnect
            {{ form.userType }}
          </h2>
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
            <card-title>Sign in</card-title>
            <phone-input />
            <div class="tw-flex tw-flex-row tw-gap-3 tw-mr-3">
              <v-icon slot="prepend" color="primary">mdi-lock</v-icon>
              <v-text-field
                  id="password"
                  label="Password"
                  class="tw-bg-gray-100 tw-rounded-lg"
                  v-model="form.password"
                  :rules="[required('Password')]"
              >
                <v-icon slot="append" color="primary" class="tw-cursor-pointer" @click="passwordField = passwordField === 'password' ? 'text' : 'password'">{{ passwordField === 'password' ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              </v-text-field>
            </div>
            <div
                class="tw-mx-5 tw-pl-4 tw-my-6 tw-justify-end"
            >
              <router-link
                  to="signup"
              >Don't have an account? Sign up</router-link>
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

export default {
  components: { CardTitle, PhoneInput },
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
@media (min-width: 768px) {     .h-80 {         height: 80%     } }
</style>
