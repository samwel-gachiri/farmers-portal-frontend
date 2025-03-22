/* eslint-disable */
<template>
  <v-app id="inspire">
    <v-main>
      <div class="tw-w-full tw-flex  md:tw-flex-row tw-flex-col-reverse">
          <!--Ad part-->
          <div style="height: 100vh;" class="ad-gradient tw-flex tw-justify-center tw-items-center  md:tw-visible tw-invisible">
          </div>
          <!--        form part-->
          <div style="height: 100vh;" class="tw-border-4 tw-bg-blue tw-flex tw-flex-col  tw-justify-center tw-items-center tw-w-full tw-h-full">
            <div class="tw-w-full">
              <router-link class="tw-ml-4 tw-bg-yellow-400 tw-rounded-none tw-p-2 tw-mt-4" :to="{name: 'Landing'}">Go Home</router-link>
            </div>
            <logo-title class="tw-my-8">
            </logo-title>
            <v-card
                 style="border-radius: 20px;"
                draggable="true"
            >
              <card-title>Sign In As {{form.userType ? form.userType[0].toUpperCase() + form.userType.slice(1) : ""}}</card-title>
              <v-form v-model="isValid" @submit.prevent="onSubmit">
<!--                <phone-number-input-->
<!--                    class="tw-mt-6 tw-mb-3 tw-mx-5"-->
<!--                    v-model="form.phoneNumber"-->
<!--                    default-country-code="KE"-->
<!--                    :preferred-countries="['KE', 'US', 'UG', 'TZ']"-->
<!--                    @update:phoneNumber="(newValue) => (form.phoneNumber = newValue)"-->
<!--                />-->
                <v-text-field
                    label="Input email"
                    class="tw-mt-6 tw-mx-5"
                    v-model="form.phoneNumber"
                    placeholder="email@example.com"
                    :rules="[emailFormat()]"
                >
                  <v-icon slot="prepend" color="primary">mdi-email</v-icon>
                </v-text-field>
                <div class="tw-flex tw-flex-row tw-gap-3 tw-mx-5">
                  <v-icon slot="prepend" color="primary">mdi-lock</v-icon>
                  <v-text-field
                      id="password"
                      label="Password"
                      class="tw-bg-gray-100 tw-rounded-lg"
                      dense
                      :type="passwordField"
                      v-model="form.password"
                      :rules="[required('Password')]"
                  >
                    <v-icon slot="append" color="primary" class="tw-cursor-pointer" @click="passwordField = passwordField === 'password' ? 'text' : 'password'">{{ passwordField === 'password' ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                  </v-text-field>
                </div>
                <div
                    class="tw-flex tw-justify-center tw-items-center tw-mt-2"
                >
                  <div
                      class="tw-border-0 tw-w-full tw-ml-5 tw-mt-3 tw-mb-1 tw-text-white"
                      @click="toSignUp"
                  ><h2 class="tw-text-sm">Don't have an account? Sign Up</h2>
                  </div>
<!--                  <div-->
<!--                      class="tw-border-0 tw-w-full tw-ml-3 tw-mt-3 tw-mb-1 tw-text-white"-->
<!--                      @click="toForgotPassword"-->
<!--                  ><h2 class="tw-text-sm">Forgot password?</h2>-->
<!--                  </div>-->
                </div>
                <div class="tw-mx-3">
                  <v-btn
                      block
                      rounded
                      :loading="loading"
                      color="primary"
                      type="submit"
                      :disabled="!isValid"
                  >Login</v-btn>
                  <div class="tw-flex tw-flex-row tw-w-full tw-justify-center tw-items-center">
                    <v-divider />
                    <h2 class="tw-text-xl">OR</h2>
                    <v-divider/>
                  </div>
                  <GoogleSignIn/>
                </div>
              </v-form>
            </v-card>
            <div></div>
          </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import validations from '@/utils/validations.js';
// import PhoneInput from '@/components/layout/components/PhoneInput';
import CardTitle from '@/components/shared/CardTitle.vue';
import AuthMixins from '@/mixins/AuthMixins.js';
import LogoTitle from '@/components/shared/LogoText.vue';
import { getCurrentUserRole, isAuthenticated } from '@/utils/roles.js';
import GoogleSignIn from '@/components/auth/GoogleSignIn.vue';
import Auth from '@aws-amplify/auth';
import AuthConfig from '@/utils/aws-exports.js';

export default {
  components: { GoogleSignIn, LogoTitle, CardTitle },
  data() {
    return {
      form: {
        password: '',
        phoneNumber: '',
        email: '',
        userType: getCurrentUserRole(),
      },
      ...validations,
      selectedCountry: 'KE',
      passwordField: 'password',
      passwordConfirmField: 'password',
      show: false,
      isValid: false,
      loading: false,
    };
  },
  mixins: [AuthMixins],
  computed: {
    isAuthenticated,
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
    async onSubmit() {
      this.loading = true;
      await this.signInUser(this.form.phoneNumber, this.form.password)
        .then((user) => {
          this.loading = false;
          if (user != null) {
            this.$toast.success('Signed in successfully!', `${user.attributes.name}`);
            this.$router.push({ name: 'Dashboard' });
          } else {
            this.$toast.error('Login failed');
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(err.message);
        });
    },
    toSignUp() {
      this.$router.push({
        name: 'SignUp',
      });
    },
    toForgotPassword() {
      this.$router.push({
        name: 'ForgotPassword',
      });
    },
  },
};
</script>
<style scoped>
* {
  color: black  ;
}
.ad-gradient {
  background-image: url("../../assets/images/futuristic_city.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 500px;
}
.main-bg {
  position: relative;
  background-image: url("../../assets/images/pexels-enginakyurt-1435904.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

@media (min-width: 768px) {     .h-80 {         height: 70vh     } }
.neumorphism {
  box-shadow:  -5px 5px 10px #bebebe,
  5px -5px 10px #ffffff;
}
</style>
