<template>
  <v-app id="inspire">
    <terms-and-conditions ref="termsDialog"/>
    <v-main class="">
      <div class="tw-w-full tw-h-full tw-flex md:tw-flex-row tw-flex-col-reverse">
        <!--Ad part-->
        <div class="ad-gradient tw-flex tw-justify-center tw-items-center md:tw-visible tw-invisible">
        </div>
        <!--  FORM part       -->
        <div class="tw-flex tw-flex-col tw-gap-8  tw-justify-center tw-items-center tw-w-full tw-h-full">
          <div>Signing in as {{ form.userType }}</div>
          <div class="tw-flex md:tw-justify-center tw-justify-start tw-items-center tw-h-full tw-flex-col tw-rounded-lg">
            <div class="tw-flex tw-flex-row-reverse tw-justify-center tw-items-center tw-w-full tw-p-4">
              <logo-title
                  :text="`Welcome`"
                  class="">
              </logo-title>
            </div>
            <!--Form part-->
            <div class="tw-flex tw-flex-col tw-m-3 tw-w-full tw-items-center tw-justify-center">
              <v-card
                  style="border-radius: 25px;"
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
                      :preferred-countries="['KE', 'US', 'UG', 'TZ']"
                      @input="onPhoneNumberInput"
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
                    <template v-slot:label>
                      <div>
                        Accept
                        <a class="tw-underline" href="#" @click.prevent="openTermsDialog">Terms and Condition</a>
                      </div>
                    </template>
                  </v-checkbox>
                  <router-link
                      to="SignIn"
                  >Already have an account? Sign in</router-link>
                  <div class="tw-my-6 tw-mx tw-w-full">
                    <h2>{{form.phoneNumber}}</h2>
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
import TermsAndConditions from '@/components/auth/TermsAndConditions.vue';

export default {
  components: { TermsAndConditions, LogoTitle, CardTitle },
  data() {
    return {
      form: {
        fullName: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        userType: getCurrentUserRole(),
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
    openTermsDialog() {
      this.$refs.termsDialog.openDialog();
    },
    onPhoneNumberInput(phoneData) {
      console.log(phoneData);
      this.form.phoneNumber = phoneData?.formattedNumber; // This ensures the international format is stored
    },
    async onSignUp() {
      const payload = {
        username: `+254${this.form.phoneNumber.slice(1)}`,
        password: this.form.password,
        attributes: {
          picture: 'https://images.app.goo.gl/CS3uJKWnP61jdUNQ7',
          name: this.form.fullName,
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
                  axios.post(`/${this.form.userType}-service/farmer`,
                    this.farmer);
                  this.$router.push({
                    name: 'Profile',
                    params: { farmerId: getCurrentUserId() },
                  });
                  clearInterval(this.intervalId);
                }
              }, 1000);
            });
          this.$toast.success(`${this.form.fullName} signed up successfully as ${this.form.userType}!`, 'Success');
        })
        .catch((reason) => {
          this.$toast.error(reason.message);
        });
    },
  },
};
</script>
<style scoped>
* {
  border-radius: 10px;
  font-family: Arial,serif;
}
.ad-gradient {
  background-image: url("../../assets/images/futuristic_city.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 500px;
}
.dialog-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.dialog-card {
  border-radius: 12px;
  background-color: #FFFFFF;
  padding: 24px;
}

.dialog-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
}

.dialog-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}

.user-type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 4px solid black;
  cursor: pointer;
  border-radius: 0;
  transition: background-color 0.3s ease;
}

.user-type-item:hover {
  background-color: #f5f5f5;
}

.user-type-text {
  font-size: 32px;
  font-weight: bold;
  color: #4CAF50; /* Green text color */
}

.arrow-icon {
  font-weight: bold;
}
</style>
