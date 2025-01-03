<template>
  <v-app id="inspire">
    <v-main>
      <div v-if="!form.userType" class="">
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
      <div v-else class="tw-flex tw-h-full tw-flex-col tw-my-2 tw-mx-8 tw-gap-5 tw-rounded-lg">
        <header class="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-p-2">
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
            <v-form v-model="isValid" @submit.prevent="onSubmit">
              <phone-number-input
                  class="tw-my-5 tw-border-4 tw-rounded"
                  v-model="form.phoneNumber"
                  default-country-code="KE"
                  :no-country-selector="false"
                  :preferred-countries="['KE', 'US', 'UG', 'TZ']"
              />
<!--              <v-text-field-->
<!--                  label="email"-->
<!--                  v-model="form.email"-->
<!--                  dense-->
<!--              >-->
<!--                <v-icon slot="prepend">mdi-email</v-icon>-->
<!--              </v-text-field>-->
              <div class="tw-flex tw-flex-row tw-gap-3 tw-mr-3">
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
                  class="tw-mx-5 tw-pl-4 tw-my-6 tw-justify-end"
              >
                <div
                    class="tw-border-0 tw-font-bold"
                    @click="toSignUp"
                >Don't have an account? Sign up
                </div>
              </div>
              <div class="tw-my-6 tw-mx-3">
                <v-btn
                    block
                    color="primary"
                    type="submit"
                    :disabled="!isValid"
                >Login</v-btn>
              </div>
            </v-form>
          </v-card>
        </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import validations from '@/utils/validations';
// import PhoneInput from '@/components/layout/components/PhoneInput';
import CardTitle from '@/components/shared/CardTitle';

export default {
  components: { CardTitle },
  data() {
    return {
      form: {
        password: '',
        phoneNumber: '',
        email: '',
        userType: null,
      },
      userTypes: ['Farmer', 'Buyer'],
      ...validations,
      selectedCountry: 'KE',
      passwordField: 'password',
      passwordConfirmField: 'password',
      show: false,
      isValid: false,
    };
  },
  methods: {
    onSubmit() {
      // this.$store.state.lo
      console.log(this.form);
      const formData = {
        username: `+254${this.form.phoneNumber.slice(1)}`,
        password: this.form.password,
      };
      this.$store.dispatch('auth/signIn', formData).then(() => {
        // this.$store.state.loading = false;
        // if (
        //   this.createUser !== '' && this.createUser.challengeName === 'NEW_PASSWORD_REQUIRED'
        // ) {
        //   this.$router.push({ name: 'CreatePassword' });
        // }
        if (this.hasAuthenticationStatus) {
          if (this.authenticationStatus.variant === 'error') {
            this.$store.commit('SNACKBAR', this.authenticationStatus);
          } else {
            this.$toast.success('Signed in successfully!');
            this.$router.push({ name: 'Dashboard' });
          }
        }
        this.$router.push({ name: 'Dashboard' });
      }).catch((err) => {
        this.$toast.error(err.message);
      });
      // this.$toast.success(this.form.email, this.form.password);
    },
    toSignUp() {
      this.$cookies.set('userType', this.form.userType);
      this.$router.push({
        name: 'SignUp',
      });
    },
  },
};
</script>
<style scoped>
@media (min-width: 768px) {     .h-80 {         height: 70vh     } }
</style>
