<template>
  <v-app id="inspire">
    <v-main>
      <div class="tw-flex tw-h-full md:tw-flex-row tw-flex-col tw-rounded-lg">
        <!--Ad part-->
        <div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full tw-p-4">
          <div class="tw-w-full tw-flex tw-flex-row">
            <div class="tw-flex tw-justify-center tw-flex-col">
              <h2 class="c-title c-green-text tw-text-2xl tw-font-bold tw-mb-4 md:tw-mb-0 md:tw-mr-4">
                Welcome To AgriConnect
                {{ form.userType }}
              </h2>
              <h2>Where farmers meet buyers</h2>
            </div>
            <img
                src="@/assets/images/logo.png"
                alt="Company Logo"
                class="tw-border tw-rounded-lg"
                width="100"
                height="100"
                loading="lazy"
            />
          </div>
          <div class="tw-w-full tw-mt-5 tw-flex md:tw-justify-start tw-justify-center tw-items-center">
            <v-btn
                outlined
                rounded
                color="green darken-3"
                class="tw-rounded-lg"
            >
              <v-icon>mdi mdi-sitemap</v-icon>
              View catalogue
            </v-btn>
          </div>
        </div>
        <!--Form part-->
        <div class="tw-flex tw-flex-col tw-m-3 tw-w-full tw-items-start tw-justify-end">
          <v-card
              class="md:tw-w-2/3 md:tw-p-5 tw-p-2 md:tw-mx-0 tw-mx-3"
              elevation="2"
          >
            <card-title>Sign up</card-title>
            <div
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
                  class="tw-my-3"
                  dense
                  v-model="form.fullName"
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
                >Sign up</v-btn>
              </div>
            </div>
            <router-link
                to="/profile"
            >profile</router-link>
          </v-card>
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
        userType: this.$cookies.get('userType'),
        terms: '',
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
      this.$toast.success('hello');
      const payload = {
        username: '+254712345678',
        password: this.form.password,
        attributes: {
          picture: 'https://images.app.goo.gl/CS3uJKWnP61jdUNQ7',
          name: this.form.fullName,
          phone_number: `+254${this.form.phoneNumber.slice(1)}`,
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
          this.$toast.error(reason);
        });
    },
  },
};
</script>
<style scoped>
</style>
