<template>
  <v-app id="inspire">
    <v-main>
      <div class="tw-flex tw-h-full md:tw-flex-row tw-flex-col tw-rounded-lg">
        <!--Form part-->
        <div class="tw-flex tw-flex-col tw-m-3 tw-w-full tw-items-center tw-justify-center">
          <v-card
              class="md:tw-p-5 tw-p-2 md:tw-mx-0 tw-mx-3"
              elevation="2"
          >
            <card-title>Sign up</card-title>
            <v-form
                v-model="form.isValid"
                class="tw-px-4 tw-fex tw-flex-col"
            >
              <phone-number-input
                  class="tw-my-3"
                  v-model="form.phoneNumber"
                  default-country-code="KE"
                  :no-country-selector="false"
                  :preferred-countries="['KE', 'US', 'UG', 'TZ']"
              />
              <v-text-field
                  label="Full names"
                  class="tw-my-5"
                  dense
                  v-model="form.fullName"
                  :rules="required('Name')"
              >
                <v-icon slot="prepend" color="primary">mdi-account</v-icon>
              </v-text-field>
              <v-text-field
                  class="tw-my-3"
                  dense
                  id="password"
                  label="Password"
                  :type="passwordField"
                  v-model="form.password"
                  :rules="[required('Password'), minLength('password', 8), lowerCaseFormat(), upperCaseFormat(), digitFormat(), specialCharFormat()]"
              >
                <v-icon slot="prepend" color="primary">mdi-lock</v-icon>
                <v-icon slot="append" color="primary" class="tw-cursor-pointer" @click="passwordField = passwordField === 'password' ? 'text' : 'password'">{{ passwordField === 'password' ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              </v-text-field>
              <v-text-field
                  class="tw-mb-5 my-3"
                  id="ConfirmPassword"
                  dense
                  label="Confirm Password"
                  :type="passwordConfirmField"
                  v-model="form.confirmPassword"
                  :rules="[required('Confirm Password'), confirmPassword('Confirm Password', form.password)]"
              >
                <v-icon slot="prepend" color="primary">mdi-lock</v-icon>
                <v-icon slot="append" color="primary" class="tw-cursor-pointer" @click="passwordConfirmField = passwordConfirmField === 'password' ? 'text' : 'password'">{{ passwordConfirmField === 'password' ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              </v-text-field>
              <v-checkbox
                  id="checkbox"
                  dense
                  v-model="form.terms"
                  :rules="[check()]"
              >
                <div slot="label">Accept Terms and Conditions</div>
              </v-checkbox>
              <router-link
                  to="SignIn"
              >Already have an account? Sign in</router-link>
              <div class="tw-my-6 tw-mx tw-w-full">
                <v-btn
                    block
                    color="primary"
                    @click="onSignUp"
                    :disabled="!form.isValid"
                >Sign up</v-btn>
              </div>
            </v-form>
          </v-card>
          <div/>
        </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import validations from '@/utils/validations';
import CardTitle from '@/components/shared/CardTitle';
import { FB_SIGNUP } from '@/utils/const';

export default {
  components: { CardTitle },
  data() {
    return {
      form: {
        fullName: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        userType: '',
        terms: '',
        isValid: false,
      },
      userTypes: ['Farmer', 'Buyer'],
      ...validations,
      selectedCountry: 'KE',
      passwordField: 'password',
      passwordConfirmField: 'password',
      show: false,
    };
  },
  methods: {
    async onSignUp() {
      const payload = {
        username: `+254${this.form.phoneNumber.slice(1)}`,
        password: this.form.password,
        attributes: {
          picture: 'https://images.app.goo.gl/CS3uJKWnP61jdUNQ7',
          name: this.form.fullName,
          'custom:role': this.form.userType, // Custom attribute for user type
        },
      };
      await this.$store.dispatch('auth/signUp', payload)
        .then(() => {
          if (this.hasAuthenticationStatus) {
            if (this.authenticationStatus.variant === 'error') {
              this.$toast.error(this.authenticationStatus.message, 'Error');
            } else {
              this.$analytics.logEvent(FB_SIGNUP, {
                name: this.form.fullname,
                // email: this.form.email,
              });
              this.$toast.success(this.authenticationStatus.message, 'Success');
            }
          }
        })
        .catch((reason) => {
          this.$toast.error(reason.message);
        });
    },
  },
};
</script>
<style scoped>
</style>
