/* eslint-disable */
<template>
  <v-app id="inspire">
    <v-dialog v-model="farmMapDialog">
      <FarmMap
          @farm-boundary-updated="handleFarmBoundaryUpdate"
          @farm-boundary-created="handleFarmBoundaryUpdate"
      />
    </v-dialog>
    <terms-and-conditions ref="termsDialog"/>
    <div class="background-animation">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <v-main style="height: 100vh; max-height: 100vh;">
      <v-app-bar
          color="primary"
      >
        <template v-slot:image>
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
        </template>
        <v-app-bar-title class="tw-text-white">Sign Up Form</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn
            icon
        >
          <router-link  :to="{name: 'Home'}">
            <v-icon color="white">mdi-home</v-icon>
            Go Home
          </router-link>
        </v-btn>
      </v-app-bar>
      <div class="tw-w-full tw-flex tw-flex-row tw-p-4">
        <div class="tw-hidden md:tw-block md:tw-w-1/2">
          <v-img lazy-src="@/assets/images/happy-farmer.jpg"></v-img>
        </div>
        <!--        form part-->
        <div class="tw-bg-blue tw-flex tw-flex-col  tw-justify-center tw-items-center tw-w-full md:tw-w-1/2 tw-h-full">
          <v-card
              flat
              style="border-radius: 20px; border: 4px solid #f6eeee;"
              draggable="true"
          >
<!--              <card-title>Sign In As {{form.userType ? form.userType[0].toUpperCase() + form.userType.slice(1) : ""}}</card-title>-->
<!--            <div class="tw-flex tw-flex-col tw-justify-center tw-items-center">-->
<!--                <h6 class="tw-text-sm tw-text-black tw-mb-3">Fill in your details below</h6>-->
<!--            </div>-->
            <v-stepper
                flat
                v-model="step" class="tw-p-4">
              <h6 class="tw-font-bold tw-mt-2 tw-mb-4">{{steps[step - 1].title}}</h6>
              <v-form v-if="step === 1" v-model="isValid1" class="tw-flex tw-flex-col">
                <vue-phone-number-input
                    v-model="form.phoneNumber"
                    :default-country-code="'KE'"
                    :preferred-countries="['KE', 'US', 'GB']"
                    show-code-on-list
                    @update="onPhoneUpdate"
                />
                <div
                  class="tw-mb-5 tw-mt-10"
                >
                  <v-text-field
                      v-model="form.email"
                      label="Email"
                      outlined
                      dense
                      :rules="[emailFormat()]"
                  >
                  </v-text-field>
                </div>
                <div class="tw-mx-3 tw-mb-5 tw-flex tw-justify-center tw-items-center">
                  <v-btn
                      rounded
                      :loading="loading"
                      color="primary"
                      @click="continueStepOne"
                      :disabled="!isValid1"
                  >Login</v-btn>
                </div>
                <v-divider></v-divider>
                <div class="tw-mx-3 tw-mb-5 tw-flex tw-justify-center tw-items-center">
                  <v-btn
                      class="tw-mt-3 tw-mx-8 tw-mb-3"
                      color="white"
                      @click="signInWithGooglePopup"
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
                    v-if="userIsCreatingSecondProfile"
                    type="info"
                >Creating a {{form.userType}} profile</v-alert>
                <v-text-field
                    label="Full Name"
                    outlined
                    class="tw-my-5"
                    dense
                    v-model="form.name"
                    :rules="[required('Name'), noDigitFormat()]"
                >
                </v-text-field>
                <div
                    v-if="hasNotGivenPhoneNumber"
                    class="tw-mb-5"
                >
                  <vue-phone-number-input
                      v-model="form.phoneNumber"
                      :default-country-code="'KE'"
                      :preferred-countries="['KE', 'US', 'GB']"
                      show-code-on-list
                      @update="onPhoneUpdate"
                  />
                </div>
                <div v-if="form.userType === 'farmer'">
                  <v-text-field
                      label="Farm name"
                      dense
                      v-model="form.farmName"
                      outlined
                      class="tw-my-5"
                      :rules="[required('Farm name'), noDigitFormat()]"
                  >
                  </v-text-field>
                  <v-text-field
                      label="Farm Size (acres)"
                      outlined
                      class="tw-my-5"
                      dense
                      append-icon="mdi-map"
                      @click:append="farmMapDialog = true"
                      v-model="form.farmSize"
                      :rules="[required('Farm size')]"
                  >
                  </v-text-field>
                  <v-text-field
                      label="Farm Location"
                      outlined
                      class="tw-my-5"
                      dense
                      v-model="form.location.customName"
                      append-icon="mdi-map-marker"
                      @click:append="getUserLocation"
                      :rules="[required('Name')]"
                  >
                  </v-text-field>
                </div>
                <div v-if="form.userType === 'exporter'">
                  <v-text-field
                      label="Licence Id"
                      dense
                      v-model="form.licenseId"
                      outlined
                      class="tw-my-5"
                      :rules="[required('License Id')]"
                  >
                  </v-text-field>
                </div>
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
                  >Sign Up</v-btn>
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
        </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import validations from '@/utils/validations.js';
import AuthMixins from '@/mixins/AuthMixins.js';
import { getCurrentUserRole, isAuthenticated } from '@/utils/roles.js';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
// import GoogleSignIn from '@/components/auth/GoogleSignIn.vue';
// import Auth from '@aws-amplify/auth';
// import AuthConfig from '@/utils/aws-exports.js';
import { auth } from '@/firebase.js';
import {
  RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, setPersistence, browserLocalPersistence, onAuthStateChanged,
// eslint-disable-next-line import/extensions
} from 'firebase/auth';
import axios from 'axios';
import { throttleer as grecaptcha } from 'vue-infinite-loading/src/utils.js';
import TermsAndConditions from '@/components/auth/TermsAndConditions.vue';
import FarmMap from '@/components/FarmMap.vue';

export default {
  components: { FarmMap, TermsAndConditions, VuePhoneNumberInput },
  data() {
    return {
      metaInfo: {
        title: 'Sign In',
      },
      step: 1,
      steps: [
        { title: 'Enter Phone number' }, // search for the user
        { title: 'Add Farmer Details' }, // if not found or is in another table, accept terms too
        { title: 'Details of your business' }, // if not found and is buyer
        { title: 'Enter OTP sent to you phone' }, // if found from the db
      ],
      form: {
        name: '',
        businessType: '',
        password: '',
        phoneNumber: '',
        fullPhoneNumber: '',
        email: '',
        // exporter
        licenseId: '',
        // farmer
        farmSize: '',
        farmName: '',
        location: {
          customName: '',
          lat: '',
          lng: '',
        },
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
      hasNotGivenPhoneNumber: true,
      show: false,
      isValid: false,
      loading: false,
      isSignInWithGoogle: false,
      isSignInWithPhone: true,
      isExistenceChecked: false,
      existAs: {
        farmer: false,
        buyer: false,
        exporter: false,
      },
      userIsCreatingSecondProfile: false,
      userMustBeSignedUp: false,
      otp: '',
      isOtpGiven: false,
      user: {
        uid: '',
        accessToken: '', // and other credentials too
      },
      farmMapDialog: false,
    };
  },
  mixins: [AuthMixins],
  computed: {
    isAuthenticated,
  },
  async mounted() {
    try {
      // await this.initAuth();
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
    openTermsDialog() {
      this.$refs.termsDialog.openDialog();
    },
    handleFarmBoundaryUpdate(payload) {
      // eslint-disable-next-line no-unused-vars
      const { geometry, area, location } = payload;
      this.form.farmSize = `${area.toFixed(5)} acres`;
      this.form.location.lat = location.lat.toFixed(4);
      this.form.location.lng = location.lng.toFixed(4);
      this.form.location.customName = `(${this.form.location.lat}, ${this.form.location.lng})`;
      this.farmMapDialog = false;
      this.$toast.success('Farm size received as', area.toString());
    },
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
    async signInWithGooglePopup() {
      try {
        this.isSignInWithPhone = false;
        this.isSignInWithGoogle = true;
        const googleAuthProvider = new GoogleAuthProvider();
        googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
        // Explicitly await the redirect
        const result = await signInWithPopup(auth, googleAuthProvider);
        this.handleGoogleUser(result.user);
      } catch (e) {
        this.$toast.error(`Failed to start Google Sign-In: ${e.message}`);
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
      this.hasNotGivenPhoneNumber = !this.form.fullPhoneNumber || this.form.fullPhoneNumber.length < 4;
      this.steps[1].title = `Add ${this.form.userType ? this.form.userType[0].toUpperCase() + this.form.userType.slice(1) : ''} Details`;
      this.checkFarmerOrBuyerExistence();
    },
    async continueStepTwo() {
      if (this.isSignInWithPhone) {
        this.goToOTP();
      } else if (this.isSignInWithGoogle) {
        await this.login();
      }
    },
    checkFarmerOrBuyerExistence() {
      axios.get('/farmers-service/user/check-existence', {
        params: {
          phoneNumber: this.form.fullPhoneNumber,
          email: this.form.email,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.existAs = response.data.data;
            this.isExistenceChecked = true;
            // MATCHES
            if (
              (this.form.userType.toLowerCase() === 'farmer' && this.existAs.farmer)
                || (this.form.userType.toLowerCase() === 'buyer' && this.existAs.buyer)
                || (this.form.userType.toLowerCase() === 'exporter' && this.existAs.exporter)
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
    onPhoneUpdate(phoneData) {
      // Get the full international number with country code
      this.form.fullPhoneNumber = phoneData.e164 || phoneData.formatInternational;
    },
    getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.form.location.lat = position.coords.latitude;
          this.form.location.lng = position.coords.longitude;
          this.form.location.customName = `(${this.form.location.lat.toFixed(4)}, ${this.form.location.lng.toFixed(4)})`;
        },
      );
    },
    async signUpUser() {
      try {
        if (this.form.userType === 'farmer' || this.form.userType === 'buyer') {
          const user = {
            id: this.user.uid,
            name: this.form.name,
            email: this.form.email,
            phoneNumber: this.form.fullPhoneNumber,
            createdAt: '',
            // farmer
            farmSize: this.form.farmSize.replace('acres', '').replace('acre', '').trim(),
            farmName: this.form.farmName,
            [`${this.form.userType === 'buyer' ? 'preferredProduces' : 'farmerProduces'}`]: [],
            location: {
              id: this.user.uid,
              latitude: this.form.location.lat,
              longitude: this.form.location.lng,
              customName: '',
            },
          };
          const saveResponse = await axios.post(`/${this.form.userType}s-service/${this.form.userType}`,
            user);
          if (saveResponse.data.success === true) {
            this.$toast.success(`${this.form.userType} profile set up`, 'success');
          } else {
            this.$toast.error(saveResponse.data.msg, 'Error');
          }
        }
        if (this.form.userType === 'exporter') {
          const user = {
            id: this.user.uid,
            name: this.form.name,
            email: this.form.email,
            phoneNumber: this.form.fullPhoneNumber,
            licenseId: this.form.licenseId,
          };
          const saveResponse = await axios.post('/farmers-service/exporter',
            user);
          if (saveResponse.data.success === true) {
            this.$toast.success(`${this.form.userType} profile set up`, 'success');
          } else {
            this.$toast.error(saveResponse.data.msg, 'Error');
          }
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
        window.confirmationResult = await signInWithPhoneNumber(auth, this.form.fullPhoneNumber, appVerifier);
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
      // fetching the users credentials and putting them into state
      let response = '';
      if (getCurrentUserRole() === 'farmer' || getCurrentUserRole() === 'buyer') {
        response = await axios.get(`/${getCurrentUserRole()}s-service/${getCurrentUserRole()}?${getCurrentUserRole()}Id=${this.user.uid}`);
        if (response.data.data == null) {
          await this.signUpUser();
          const response2 = await axios.get(`/${getCurrentUserRole()}s-service/${getCurrentUserRole()}?${getCurrentUserRole()}Id=${this.user.uid}`);
          if (response2.data.data == null) {
            this.$toast.error('user not found');
          }
        }
      } else if (getCurrentUserRole() === 'exporter') {
        response = await axios.get(`/farmers-service/${getCurrentUserRole()}/${this.user.uid}`);
        if (response.data.data == null) {
          await this.signUpUser();
          const response2 = await axios.get(`/${getCurrentUserRole()}s-service/${getCurrentUserRole()}?${getCurrentUserRole()}Id=${this.user.uid}`);
          if (response2.data.data == null) {
            this.$toast.error('user not found');
          }
        }
      }
      const user = { ...this.user, ...response.data.data };
      await this.$store.dispatch('auth/signIn', {
        user,
      });
      const mode = this.$route.query.mode;
      // const exporterId = this.$route.query.exporterId;
      const encodedRedirect = this.$route.query.r;
      const redirectPath = encodedRedirect ? atob(encodedRedirect) : '/';

      if (mode === 'exporter') {
        // You can fetch exporter info here if needed using exporterId
        this.$router.push(redirectPath);
      } else if (mode === 'self') {
        // Maybe redirect to a specific dashboard
        this.$router.push({ name: 'Dashboard' }); // or redirectPath if dynamic
      }

      this.$toast.success('Signed in successfully!', `${this.form.name}`);
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
</style>
