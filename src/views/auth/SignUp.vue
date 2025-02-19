<template>
  <v-app id="inspire">
    <v-main>
      <div v-if="!form.userType" class="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-flex tw-justify-center tw-items-start tw-flex-col">
        <div class="tw-w-full tw-flex tw-justify-center tw-items-center tw-p-8">
          <logo-title class=""></logo-title>
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
      <div v-else class="tw-flex md:tw-justify-center tw-justify-start tw-items-center tw-h-full md:tw-flex-row tw-flex-col tw-rounded-lg">
        <div class="tw-flex tw-flex-row-reverse tw-justify-center tw-items-center tw-w-full tw-p-4">
          <logo-title
              :text="`Create an account ${form.userType}`"
              class="">
          </logo-title>
        </div>
        <!--Form part-->
        <div class="tw-flex tw-flex-col tw-m-3 tw-w-full tw-items-start tw-justify-center">
          <div
              class="md:tw-p-5 tw-p-2 tw-mx-5 tw-bg-gray-100 "
              elevation="1"
          >
            <card-title
                icon="mdi-cow"
            >Sign up</card-title>
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
                  :rules="[required('Name')]"
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
          </div>
          <div/>
        </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import validations from '@/utils/validations.js';
import CardTitle from '@/components/shared/CardTitle.vue';
import { FB_SIGNUP } from '@/utils/const.js';
import AuthMixins from '@/mixins/AuthMixins.js';
import axios from 'axios';
import { getCurrentUserRole, getCurrentUserId } from '@/utils/roles.js';
import LogoTitle from '@/components/shared/LogoText.vue';

export default {
  components: { LogoTitle, CardTitle },
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
      farmer: {
        id: 'string',
        name: 'string',
        email: 'string',
        phoneNumber: 'string',
        createdAt: '2025-01-25T09:38:38.536Z',
        produces: [
          {
            id: 'string',
            farmer: 'string',
            farmProduce: {
              id: 'string',
              name: 'string',
              description: 'string',
              farmingType: 'string',
              status: 'INACTIVE',
            },
            status: 'INACTIVE',
          },
        ],
      },
      userTypes: ['Farmer', 'Buyer'],
      ...validations,
      selectedCountry: 'KE',
      passwordField: 'password',
      passwordConfirmField: 'password',
      show: false,
      intervalId: null,
    };
  },
  mixins: [AuthMixins],
  computed: {
    getCurrentUserId,
    getCurrentUserRole,
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
        .then(async () => {
          if (this.hasAuthenticationStatus) {
            if (this.authenticationStatus.variant === 'error') {
              this.$toast.error(this.authenticationStatus.message, 'Error');
            } else {
              this.$analytics.logEvent(FB_SIGNUP, {
                name: this.form.fullname,
                // email: this.form.email,
              });
            }
          }
          await this.signInUser(this.form.phoneNumber, this.form.password)
            .then(() => {
              this.intervalId = setInterval(() => {
                if (getCurrentUserId() != null) {
                  this.farmer = {
                    id: getCurrentUserId(),
                    name: this.form.fullName,
                    email: '',
                    phoneNumber: this.form.phoneNumber,
                    createdAt: '',
                    farmerProduces: [],
                  };
                  axios.post(
                    '/farmer',
                    this.farmer,
                  );
                  this.$router.push({
                    name: 'Profile',
                    params: { farmerId: getCurrentUserId() },
                  });
                  clearInterval(this.intervalId);
                }
              }, 1000);
            });
          this.$toast.success(`${this.form.fullName} signed up successfully!`, 'Success');
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
