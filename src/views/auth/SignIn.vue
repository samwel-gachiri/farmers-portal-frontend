/* eslint-disable */
<template>
  <v-app id="inspire">
    <div class="background-animation">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <v-main>
      <div class="tw-w-full tw-flex  md:tw-flex-row tw-flex-col-reverse">
          <!--        form part-->
          <div style="height: 100vh;" class="tw-border-4 tw-bg-blue tw-flex tw-flex-col  tw-justify-center tw-items-center tw-w-full tw-h-full">
            <logo-title v-if="false" class="tw-my-8">
            </logo-title>
            <h1 class="tw-text-xl tw-text-h3 tw-text-md-h2 tw-font-bold tw-font-weight-bold tw-mb-5">
              Welcome to <span class="">AgriConnect</span>
            </h1>
            <v-card
                 style="border-radius: 20px;"
                draggable="true"
            >
<!--              <card-title>Sign In As {{form.userType ? form.userType[0].toUpperCase() + form.userType.slice(1) : ""}}</card-title>-->
              <div class="tw-flex tw-flex-col tw-justify-center tw-items-center">
                <h6 class="tw-text-sm tw-text-black tw-mb-3">>Fill in your details below</h6>
                <v-avatar size="50" color="primary lighten-4" class="mb-4">
                  <v-img
                      v-if="form.userType.toLowerCase() === 'farmer'"
                      src="@/assets/images/farmer.png"
                      :class="{ 'scale-up': hover }"
                  ></v-img>
                  <v-img
                      v-if="form.userType.toLowerCase() === 'buyer'"
                      src="@/assets/images/buyer.png"
                      :class="{ 'scale-up': hover }"
                  ></v-img>
                  <v-img
                      v-if="form.userType.toLowerCase() === 'admin'"
                      src="@/assets/images/admin.png"
                      :class="{ 'scale-up': hover }"
                  ></v-img>
                </v-avatar>
              </div>
              <v-form v-model="isValid" @submit.prevent="onSubmit">
<!--                <phone-number-input-->
<!--                    class="tw-mt-6 tw-mb-3 tw-mx-5"-->
<!--                    v-model="form.phoneNumber"-->
<!--                    default-country-code="KE"-->
<!--                    :preferred-countries="['KE', 'US', 'UG', 'TZ']"-->
<!--                    @update:phoneNumber="(newValue) => (form.phoneNumber = newValue)"-->
<!--                />-->
                <div class="tw-flex tw-flex-row tw-gap-3 tw-mx-5 tw-mt-4">
                  <v-icon color="primary">mdi-email</v-icon>
                  <v-text-field
                      class="tw-bg-gray-200 tw-rounded-lg tw-mt-0"
                      v-model="form.phoneNumber"
                      placeholder="email@example.com"
                      :rules="[emailFormat()]"
                  >
                  </v-text-field>
                </div>
                <div class="tw-flex tw-flex-row tw-gap-3 tw-mx-5 tw-mt-2">
                  <v-icon color="primary">mdi-lock</v-icon>
                  <v-text-field
                      class="tw-bg-gray-200 tw-rounded-lg tw-mt-0"
                      id="password"
                      :type="passwordField"
                      placeholder="********"
                      v-model="form.password"
                      :rules="[required('Password')]"
                  >
                    <v-icon slot="append" color="primary" class="tw-cursor-pointer" @click="passwordField = passwordField === 'password' ? 'text' : 'password'">{{ passwordField === 'password' ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                  </v-text-field>
                </div>
                <div
                    class="tw-flex tw-justify-center tw-items-center tw-mt-2"
                >
                  <div class="tw-flex tw-flex-row tw-gap-3 tw-mx-5 tw-mt-4">
                    <v-tooltip text="Create account">
                      <template v-slot:activator="{ props }">
                        <router-link
                            v-bind="props"
                            :to="{name: 'SignUp'}"
                        >
                          <h2 class="tw-text-sm">Create new account?</h2>
                          <v-icon>mdi-account-plus</v-icon>
                        </router-link>
                      </template>
                    </v-tooltip>
                  </div>
<!--                  <div-->
<!--                      class="tw-border-0 tw-w-full tw-ml-3 tw-mt-3 tw-mb-1 tw-text-white"-->
<!--                      @click="toForgotPassword"-->
<!--                  ><h2 class="tw-text-sm">Forgot password?</h2>-->
<!--                  </div>-->
                </div>
                <div class="tw-mx-3 tw-mb-5">
                  <v-btn
                      block
                      rounded
                      :loading="loading"
                      color="primary"
                      type="submit"
                      :disabled="!isValid"
                  >Login</v-btn>
<!--                  <div class="tw-flex tw-flex-row tw-w-full tw-justify-center tw-items-center">-->
<!--                    <v-divider />-->
<!--                    <h2 class="tw-text-xl">OR</h2>-->
<!--                    <v-divider/>-->
<!--                  </div>-->
<!--&lt;!&ndash;                  <GoogleSignIn/>&ndash;&gt;-->
                </div>
              </v-form>
            </v-card>
            <div class="tw-w-full tw-mt-8 tw-flex tw-justify-center tw-items-center">
              <v-card
                  rounded
                  elevate
              >
                <router-link  :to="{name: 'Home'}">
                  <v-icon>mdi-home</v-icon>
                </router-link>
              </v-card>
            </div>
          </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import validations from '@/utils/validations.js';
import AuthMixins from '@/mixins/AuthMixins.js';
import LogoTitle from '@/components/shared/LogoText.vue';
import { getCurrentUserRole, isAuthenticated } from '@/utils/roles.js';
// import GoogleSignIn from '@/components/auth/GoogleSignIn.vue';
import Auth from '@aws-amplify/auth';
import AuthConfig from '@/utils/aws-exports.js';

export default {
  components: { LogoTitle },
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
      this.$router.push({ name: 'Home' });
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
    toForgotPassword() {
      this.$router.push({
        name: 'ForgotPassword',
      });
    },
  },
};
</script>
<style scoped>
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.20;
}

.circle-1 {
  width: 500px;
  height: 500px;
  background: var(--v-primary-base);
  top: -100px;
  left: -100px;
  /* animation: circle-clockwise 15s infinite linear; */
}

.circle-2 {
  width: 400px;
  height: 400px;
  background: var(--v-secondary-base);
  bottom: -100px;
  right: -50px;
  /* animation: circle-clockwise 18s infinite linear; */
  /* animation-delay: 2s; */
}

.circle-3 {
  width: 300px;
  height: 300px;
  background: var(--v-accent-base);
  top: 50%;
  left: 30%;
  /* animation: circle-clockwise 12s infinite linear; */
  /* animation-delay: 4s; */
}

/* Clockwise circular motion */
@keyframes circle-clockwise {
  0% {
    transform: rotate(0deg) translateX(150px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(150px) rotate(-360deg);
  }
}

/* Anticlockwise circular motion */
@keyframes circle-anticlockwise {
  0% {
    transform: rotate(0deg) translateX(200px) rotate(0deg);
  }
  100% {
    transform: rotate(-360deg) translateX(200px) rotate(360deg);
  }
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
