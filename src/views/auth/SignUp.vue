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
          <div class="tw-w-full tw-pt-4">
            <router-link class="tw-ml-4 tw-bg-yellow-400 tw-rounded-none tw-p-2 tw-mt-4" :to="{name: 'Landing'}">Go Home</router-link>
          </div>
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
                >Sign Up As {{form.userType ? form.userType[0].toUpperCase() + form.userType.slice(1) : ""}}</card-title>
                <v-form
                    v-model="form.isValid"
                    class="tw-px-4 tw-fex tw-flex-col"
                >
<!--                  <phone-number-input-->
<!--                      class="tw-mt-6 tw-ml-3"-->
<!--                      v-model="form.phoneNumber"-->
<!--                      default-country-code="KE"-->
<!--                      :preferred-countries="['KE', 'US', 'UG', 'TZ']"-->
<!--                      @update:phoneNumber="(newValue) => (form.phoneNumber = newValue)"-->
<!--                  />-->
                  <v-text-field
                      label="Input email"
                      class="tw-mt-6"
                      v-model="form.email"
                      placeholder="email@example.com"
                      :rules="[emailFormat()]"
                  >
                    <v-icon slot="prepend" color="primary">mdi-email</v-icon>
                  </v-text-field>
                  <v-text-field
                      label="Full names"
                      class="tw-my-5"
                      dense
                      v-model="form.fullName"
                      :rules="[required('Name'), noDigitFormat()]"
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
                    <v-btn
                        block
                        color="primary"
                        :loading="loading"
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
// import { FB_SIGNUP } from '@/utils/const.js';
import AuthMixins from '@/mixins/AuthMixins.js';
import { getCurrentUserRole, getCurrentUserId } from '@/utils/roles.js';
import LogoTitle from '@/components/shared/LogoText.vue';
import TermsAndConditions from '@/components/auth/TermsAndConditions.vue';
import Auth from '@aws-amplify/auth';
import AuthConfig from '@/utils/aws-exports.js';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  components: { TermsAndConditions, LogoTitle, CardTitle },
  data() {
    return {
      form: {
        fullName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: '',
        userType: getCurrentUserRole(),
        terms: '',
        isValid: false,
      },
      user: {
        id: 'string',
        name: 'string',
        email: 'string',
        phoneNumber: 'string',
        createdAt: '2025-01-25T09:38:38.536Z',
      },
      ...validations,
      selectedCountry: 'KE',
      passwordField: 'password',
      passwordConfirmField: 'password',
      show: false,
      loading: false,
    };
  },
  mixins: [AuthMixins],
  computed: {
    getCurrentUserId,
    getCurrentUserRole,
    ...mapGetters('auth', ['hasAuthenticationStatus', 'authenticationStatus']),
  },
  mounted() {
    const userRole = getCurrentUserRole();
    if (userRole === '' || userRole == null) {
      this.$router.push({ name: 'Landing' });
    }
    if (userRole === 'farmer') {
      Auth.configure(AuthConfig.FarmerAuth);
    }
    if (userRole === 'buyer') {
      Auth.configure(AuthConfig.BuyerAuth);
    }
    if (userRole === 'admin') {
      Auth.configure(AuthConfig.AdminAuth);
    }
  },
  methods: {
    openTermsDialog() {
      this.$refs.termsDialog.openDialog();
    },
    async onSignUp() {
      this.loading = true;
      const payload = {
        username: this.form.email,
        password: this.form.password,
        attributes: {
          name: this.form.fullName,
        },
      };
      await this.$store.dispatch('auth/signUp', payload)
        .then(async (response) => {
          if (this.hasAuthenticationStatus) {
            if (this.authenticationStatus.variant === 'error') {
              this.$toast.error(this.authenticationStatus.message, 'Error');
            } else {
              // this.$analytics.logEvent(FB_SIGNUP, {
              //   name: this.form.fullname,
              //   // email: this.form.email,
              // });
              this.user = {
                id: response.userSub,
                name: this.form.fullName,
                email: this.form.email,
                phoneNumber: '',
                createdAt: '',
                [`${getCurrentUserRole() === 'buyer' ? 'preferredProduces' : 'farmerProduces'}`]: [],
              };
              await axios.post(`/${getCurrentUserRole()}s-service/${getCurrentUserRole()}`,
                this.user).then(async (saveResponse) => {
                if (saveResponse.data.success === true) {
                  await this.signInUser(this.form.email, this.form.password)
                    .then(() => {
                      this.$router.push({
                        name: 'Dashboard',
                      });
                      this.$toast.success(`${this.form.fullName} signed up successfully as ${this.form.userType}!`, 'Success');
                    })
                    .catch((reason) => {
                      this.$toast.error(reason.message, 'Error');
                    });
                } else {
                  this.$toast.error(saveResponse.data.msg, 'Error');
                }
              }).catch((e) => this.$toast.error(e.message, 'Error'));
            }
          } else {
            this.$toast.error('Authentication status not found!');
          }
        })
        .catch((e) => this.$toast.error(e.message, 'Error'))
        .finally(() => {
          this.loading = false;
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
