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
            <h1 class="tw-text-xl tw-text-h3 tw-text-md-h2 tw-font-bold tw-font-weight-bold tw-mb-5">
              Welcome to <span class="">Agriconnect</span>
            </h1>
            <v-card
                 style="border-radius: 20px;"
                draggable="true"
            >
<!--              <card-title>Sign In As {{form.userType ? form.userType[0].toUpperCase() + form.userType.slice(1) : ""}}</card-title>-->
              <div class="tw-flex tw-flex-col tw-justify-center tw-items-center">
                <h6 class="tw-text-sm tw-text-black tw-mb-3">Fill in your details below</h6>
                <v-avatar size="50" color="primary lighten-4" class="">
                  <v-img
                      v-if="form.userType.toLowerCase() === 'farmer'"
                      src="@/assets/images/farmer.png"
                  ></v-img>
                  <v-img
                      v-if="form.userType.toLowerCase() === 'buyer'"
                      src="@/assets/images/buyer.png"
                  ></v-img>
                  <v-img
                      v-if="form.userType.toLowerCase() === 'admin'"
                      src="@/assets/images/admin.png"
                  ></v-img>
                </v-avatar>
                <h2 class="tw-font-bold">{{ form.userType.toUpperCase() }}</h2>
              </div>
              <v-stepper v-model="step" class="tw-p-4">
                <h2 class="tw-font-bold tw-mt-2 tw-mb-4">{{steps[step - 1].title}}</h2>
                <v-form v-if="step === 1" v-model="isValid1" class="tw-flex tw-flex-col">
                  <phone-number-input
                      class="tw-mb-3"
                      v-model="form.phoneNumber"
                      default-country-code="KE"
                      :preferred-countries="['KE', 'US', 'UG', 'TZ']"
                      @update:phoneNumber="(newValue) => (form.phoneNumber = newValue)"
                  />
                  <!--                <div class="tw-flex tw-flex-row tw-gap-3 tw-mx-5 tw-mt-4">-->
                  <!--                  <v-icon color="primary">mdi-email</v-icon>-->
                  <!--                  <v-text-field-->
                  <!--                      class="tw-bg-gray-200 tw-rounded-lg tw-mt-0"-->
                  <!--                      v-model="form.phoneNumber"-->
                  <!--                      placeholder="email@example.com"-->
                  <!--                      :rules="[emailFormat()]"-->
                  <!--                  >-->
                  <!--                  </v-text-field>-->
                  <!--                </div>-->
                  <!--                <v-text-field-->
                  <!--                    prepend-icon="mdi-lock"-->
                  <!--                    class="tw-rounded-lg tw-mt-0"-->
                  <!--                    id="password"-->
                  <!--                    :type="passwordField"-->
                  <!--                    placeholder="********"-->
                  <!--                    v-model="form.password"-->
                  <!--                    :rules="[required('Password')]"-->
                  <!--                >-->
                  <!--                  <v-icon slot="append" color="primary" class="tw-cursor-pointer" @click="passwordField = passwordField === 'password' ? 'text' : 'password'">{{ passwordField === 'password' ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>-->
                  <!--                </v-text-field>-->
<!--                  <div-->
<!--                      class="tw-flex tw-justify-center tw-items-center tw-mt-2"-->
<!--                  >-->
                    <!--                  <div class="tw-flex tw-flex-row tw-gap-3 tw-mx-5 tw-mt-4">-->
                    <!--                    <v-tooltip text="Create account">-->
                    <!--                      <template v-slot:activator="{ props }">-->
                    <!--                        <router-link-->
                    <!--                            v-bind="props"-->
                    <!--                            :to="{name: 'SignUp'}"-->
                    <!--                        >-->
                    <!--                          <h2 class="tw-text-sm">Create new account?</h2>-->
                    <!--                          <v-icon>mdi-account-plus</v-icon>-->
                    <!--                        </router-link>-->
                    <!--                      </template>-->
                    <!--                    </v-tooltip>-->
                    <!--                  </div>-->
                    <!--                  <div-->
                    <!--                      class="tw-border-0 tw-w-full tw-ml-3 tw-mt-3 tw-mb-1 tw-text-white"-->
                    <!--                      @click="toForgotPassword"-->
                    <!--                  ><h2 class="tw-text-sm">Forgot password?</h2>-->
                    <!--                  </div>-->
<!--                  </div>-->
                  <div class="tw-mx-3 tw-mb-5 tw-flex tw-justify-center tw-items-center">
                    <v-btn
                        rounded
                        :loading="loading"
                        color="primary"
                        @click="continueStepOne"
                        :disabled="!isValid1 || form.phoneNumber.length < 8"
                    >Login</v-btn>
                    <!--                  <div class="tw-flex tw-flex-row tw-w-full tw-justify-center tw-items-center">-->
                    <!--                    <v-divider />-->
                    <!--                    <h2 class="tw-text-xl">OR</h2>-->
                    <!--                    <v-divider/>-->
                    <!--                  </div>-->
                    <!--&lt;!&ndash;                  <GoogleSignIn/>&ndash;&gt;-->
                  </div>
                  <v-divider></v-divider>
                  <div class="tw-mx-3 tw-mb-5 tw-flex tw-justify-center tw-items-center">
                    <v-btn
                        class="tw-mt-3 tw-mx-8 tw-mb-3"
                        color="white"
                        @click="signInWithGoogleRedirect"
                        outlined
                        large
                        style="border: 1px solid #dadce0; border-radius: 4px; text-transform: none;"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" width="30px" height="30px" alt="Google Logo">
                      <span style="color: #3c4043; font-size: 14px; font-weight: 500;">Sign in with Google</span>
                    </v-btn>
                  </div>
                </v-form>
                <v-form v-if="step === 2" v-model="isValid2" class="tw-flex tw-flex-col">
                  <v-alert
                      type="info"
                      v-if="userIsCreatingSecondProfile"
                  >Creating a {{form.userType}} profile</v-alert>
                  <v-text-field
                      :placeholder="`Enter (Your or ${form.userType === 'farmer'? 'Farm': 'Business'} ) name`"
                      prepend-icon="mdi-account"
                      outlined
                      class="tw-my-5"
                      dense
                      v-model="form.name"
                      :rules="[required('Name'), noDigitFormat()]"
                      autofocus
                  >
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
                  <div class="tw-mx-3 tw-mb-5 tw-flex tw-justify-center tw-items-center tw-gap-3">
                    <v-btn
                        icon
                        rounded
                        @click="step = 1"
                    >Back</v-btn>
                    <v-btn
                        rounded
                        :loading="loading"
                        color="primary"
                        @click="continueStepTwo"
                        :disabled="!isValid2"
                    >login</v-btn>
                  </div>
                </v-form>
                <v-form v-if="step === 4" v-model="isValid4" class="tw-flex tw-flex-col">
                  <div  style="width: 250px;">
                    <v-otp-input
                        v-model="otp"
                    ></v-otp-input>
                  </div>
                  <div class="tw-mx-3 tw-mb-5 tw-flex tw-justify-center tw-items-center tw-gap-3">
                    <v-btn
                        icon
                        rounded
                        @click="userMustBeSignedUp? step = 2: step = 1"
                    >Back</v-btn>
                    <v-btn
                        rounded
                        :loading="loading"
                        color="primary"
                        @click="verifyOtp"
                        :disabled="!isValid4"
                    >confirm</v-btn>
                  </div>
                </v-form>

              </v-stepper>
            </v-card>
            <div class="tw-w-full tw-mt-8 tw-flex tw-justify-center tw-items-center">
              <v-btn
                  outlined
              >
                <router-link  :to="{name: 'Home'}">
                  <v-icon>mdi-home</v-icon>
                </router-link>
              </v-btn>
            </div>
          </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import validations from '@/utils/validations.js';
import AuthMixins from '@/mixins/AuthMixins.js';
import { getCurrentUserRole, isAuthenticated } from '@/utils/roles.js';
// import GoogleSignIn from '@/components/auth/GoogleSignIn.vue';
// import Auth from '@aws-amplify/auth';
// import AuthConfig from '@/utils/aws-exports.js';
import { auth } from '@/firebase.js';
import {
  RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithRedirect, getRedirectResult, setPersistence, browserLocalPersistence, onAuthStateChanged,
// eslint-disable-next-line import/extensions
} from 'firebase/auth';
import axios from 'axios';
import { throttleer as grecaptcha } from 'vue-infinite-loading/src/utils.js';

export default {
  data() {
    return {
      step: 1,
      steps: [
        { title: 'Enter Phone number' }, // search for the user
        { title: 'Give in your name' }, // if not found or is in another table, accept terms too
        { title: 'Details of your business' }, // if not found and is buyer
        { title: 'Enter OTP sent to you phone' }, // if found from the db
      ],
      form: {
        name: '',
        businessType: '',
        password: '',
        phoneNumber: '',
        email: '',
        userType: getCurrentUserRole(),
      },
      ...validations,
      selectedCountry: 'KE',
      passwordField: 'password',
      passwordConfirmField: 'password',
      isValid1: false,
      isValid2: false,
      isValid3: false,
      isValid4: false,
      show: false,
      isValid: false,
      loading: false,
      isSignInWithGoogle: false,
      isSignInWithPhone: true,
      isExistenceChecked: false,
      existAs: {
        farmer: false,
        buyer: false,
      },
      userIsCreatingSecondProfile: false,
      userMustBeSignedUp: false,
      otp: '',
      isOtpGiven: false,
      user: {
        uid: '',
        accessToken: '', // and other credentials too
      },
    };
  },
  mixins: [AuthMixins],
  computed: {
    isAuthenticated,
  },
  async mounted() {
    try {
      await this.initAuth();
      // Check user role only after auth state is confirmed
      const userRole = getCurrentUserRole();
      if (!userRole) {
        this.$router.push({ name: 'Home' });
      }
    } catch (e) {
      this.$toast.error(`Error: ${e.message}`);
    }
  },
  destroyed() {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
  },
  methods: {
    initAuth() {
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              this.user.uid = user.uid;
              // console.log('User logged in:', user);
              // Handle both Google and Phone auth users here
              if (user.providerData.some((provider) => provider.providerId === 'google.com')) {
                this.handleGoogleUser(user);
              } else if (user.providerData.some((provider) => provider.providerId === 'phone')) {
                this.handlePhoneUser(user);
              }
            } else {
              // console.log('No user logged in');
              this.checkRedirectResult(); // Only check redirect when no user exists
            }
          });
        });
    },
    async checkRedirectResult() {
      const result = await getRedirectResult(auth);

      if (result) {
        this.isSignInWithGoogle = true;
        this.isSignInWithPhone = false;
        this.$toast.success(`Signed in as ${result.user.email}`);
        await this.handleGoogleUser(result);
      }
    },
    async signInWithGoogleRedirect() {
      try {
        this.isSignInWithPhone = false;
        this.isSignInWithGoogle = true;
        const googleAuthProvider = new GoogleAuthProvider();
        googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
        // Explicitly await the redirect
        await signInWithRedirect(auth, googleAuthProvider);
      } catch (e) {
        this.$toast.error(`Failed to start Google Sign-In: ${e.message}`);
      }
    },
    handleGoogleUser(user) {
      // const credentials = GoogleAuthProvider.credentialFromResult(results);
      this.isSignInWithGoogle = true;
      this.isSignInWithPhone = false;
      this.user.uid = user.uid;
      this.user.accessToken = user.accessToken;
      this.form.name = user.displayName;
      this.form.email = user.email;
      this.checkFarmerOrBuyerExistence();
    },
    handlePhoneUser(user) {
      // const credentials = GoogleAuthProvider.credentialFromResult(results);
      this.isSignInWithPhone = true;
      this.isSignInWithGoogle = false;
      this.user.uid = user.uid;
      this.user.accessToken = user.accessToken;
      this.form.phoneNumber = user.phoneNumber;
      this.checkFarmerOrBuyerExistence();
    },
    continueStepOne() {
      this.isSignInWithPhone = true;
      this.isSignInWithGoogle = false;
      this.checkFarmerOrBuyerExistence();
    },
    async continueStepTwo() {
      if (this.isSignInWithPhone) {
        this.goToOTP();
      } else if (this.isSignInWithGoogle) {
        await this.signUpUser();
        await this.login();
      }
    },
    checkFarmerOrBuyerExistence() {
      axios.get('/farmers-service/user/farmer-or-buyer-existence', {
        params: {
          phoneNumber: this.form.phoneNumber,
          email: this.form.email,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.existAs = response.data.data;
            this.isExistenceChecked = true;
            // MATCHES
            if ((this.form.userType.toLowerCase() === 'farmer' && this.existAs.farmer)
                || (this.form.userType.toLowerCase() === 'buyer' && this.existAs.buyer)
            ) {
              this.userMustBeSignedUp = false;
              if (this.isSignInWithPhone) {
                this.goToOTP();
              }
              if (this.isSignInWithGoogle) {
                this.login();
              }
            } else if ((this.form.userType.toLowerCase() === 'farmer' && this.existAs.buyer)// SIGNING IN WITH DIFFERENT PROFILE
                || (this.form.userType.toLowerCase() === 'buyer' && this.existAs.farmer)) {
              // add them to the usertype now then step 4
              this.userIsCreatingSecondProfile = true;
              this.userMustBeSignedUp = true;
              this.step = 2;
            } else { // NEEDS TO SIGN UP
              this.userMustBeSignedUp = true;
              this.step = 2;
            }
          } else {
            this.$toast.error(response.data.msg);
          }
        });
    },
    async signUpUser() {
      try {
        const user = {
          id: this.user.uid,
          name: this.form.name,
          email: this.form.email,
          phoneNumber: this.form.phoneNumber,
          createdAt: '',
          [`${this.form.userType === 'buyer' ? 'preferredProduces' : 'farmerProduces'}`]: [],
        };
        const saveResponse = await axios.post(`/${this.form.userType}s-service/${this.form.userType}`,
          user);
        if (saveResponse.data.success === true) {
          this.$toast.success(`${this.form.userType} profile set up`, 'success');
        } else {
          this.$toast.error(saveResponse.data.msg, 'Error');
        }
      } catch (e) {
        this.$toast.error(e.message, 'Error');
      }
    },
    goToOTP() {
      this.step = 4;
      this.sendOtp();
    },
    async sendOtp() {
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear(); // Removes the reCAPTCHA widget
          window.recaptchaVerifier = null; // Clean up reference
        }
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            'expired-callback': () => {
              // Response expired. Ask user to solve reCAPTCHA again.
              this.$toast.error('Recaptcha expired');
            },
          });
        }
        const appVerifier = window.recaptchaVerifier;
        window.confirmationResult = await signInWithPhoneNumber(auth, this.form.phoneNumber, appVerifier);
        this.$toast.success('SMS sent to your mobile number');
      } catch (e) {
        // Handle errors (e.g., invalid phone number, quota exceeded)
        this.$toast.error('SMS not sent', e.message);
        window.recaptchaVerifier.render().then((widgetId) => {
          grecaptcha.reset(widgetId);
        });
      }
    },
    async verifyOtp() {
      try {
        const confirmationResult = await window.confirmationResult.confirm(this.otp);
        this.user = {
          uid: confirmationResult.user.uid,
          accessToken: confirmationResult.user.accessToken,
        };
        // Handle successful sign-in (e.g., redirect to home page)
        await this.login();
      } catch (error) {
        // Handle errors (e.g., invalid code)
        this.$toast.error(error.message);
      }
    },
    async login() {
      if (this.userMustBeSignedUp) {
        await this.signUpUser();
      }
      const response = await axios.get(`/${getCurrentUserRole()}s-service/${getCurrentUserRole()}?${getCurrentUserRole()}Id=${this.user.uid}`);
      if (response.data.data == null) this.$toast.error('User not found');
      const user = { ...this.user, ...response.data.data };
      await this.$store.dispatch('auth/signIn', {
        user,
      });
      this.$toast.success('Signed in successfully!', `${this.form.name}`);
      this.$router.push({ name: 'Dashboard' });
    },
    // async onSubmit() {
    //   this.loading = true;
    //   await this.signInUser(this.form.phoneNumber, this.form.password)
    //     .then((user) => {
    //       this.loading = false;
    //       if (user != null) {
    //         this.$toast.success('Signed in successfully!', `${user.attributes.name}`);
    //         this.$router.push({ name: 'Dashboard' });
    //       } else {
    //         this.$toast.error('Login failed');
    //       }
    //     })
    //     .catch((err) => {
    //       this.loading = false;
    //       this.$toast.error(err.message);
    //     });
    // },
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
  background-color: #f3ecec;
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
