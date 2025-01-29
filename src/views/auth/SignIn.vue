<template>
  <v-app id="inspire">
    <v-main>
      <div class="main-bg tw-flex md:tw-flex-row tw-flex-col tw-h-full tw-gap-5 tw-rounded-lg">
        <!--Ad part-->
        <div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full tw-p-4">
          <div class="tw-w-full tw-flex tw-justify-center md:tw-justify-start tw-flex-row">
            <div class="tw-flex tw-justify-center tw-items-center tw-flex-col tw-border-b-4">
              <h2 class="c-title c-green-text c-blue-text tw-text-2xl tw-font-bold tw-mb-4 md:tw-mb-0 md:tw-mr-4">
                Welcome To Little Angels Academy
              </h2>
            </div>
            <img
                v-if="false"
                src="@/assets/images/logo.png"
                alt="Company Logo"
                class="tw-border tw-rounded-lg"
                width="100"
                height="100"
                loading="lazy"
            />
          </div>
        </div>
<!--        form part-->
        <div class="tw-flex tw-justify-center tw-items-center tw-w-full">
          <div
              class="neumorphism md:tw-p-5 tw-p-2 md:tw-mr-10 tw-mb-8 tw-border tw-bg-gray-100 tw-rounded"
              draggable="true"
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
          </div>
          <div></div>
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
      this.$router.push({
        name: 'SignUp',
      });
    },
  },
};
</script>
<style scoped>
.main-bg {
  //background: rgb(34,195,110);
  //background: linear-gradient(236deg, rgba(34,195,110,1) 0%, rgba(253,187,45,1) 100%);
}
@media (min-width: 768px) {     .h-80 {         height: 70vh     } }
.neumorphism {
  background: #e0e0e0;
  box-shadow:  -5px 5px 10px #bebebe,
  5px -5px 10px #ffffff;
}
</style>
