<template>
  <v-app id="inspire">
    <v-main>
      <div class="main-bg tw-flex md:tw-flex-row tw-flex-col tw-h-full tw-gap-5 tw-rounded-lg">
        <!--Ad part-->
        <div class="tw-flex tw-justify-center tw-items-center tw-w-full tw-p-4">
          <logo-title class="">
            <div>
              <v-icon color="green">mdi-map-marker-radius</v-icon><h2></h2>
            </div>
          </logo-title>
        </div>
<!--        form part-->
        <div class="tw-flex md:tw-justify-start tw-justify-center tw-items-center tw-w-full">
          <div
              class="md:tw-p-5 tw-p-2 md:tw-mr-10 tw-mb-8 tw-border tw-bg-gray-100 tw-rounded"
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
                    :loading="loading"
                    color="primary"
                    type="submit"
                    :disabled="!isValid"
                >Login</v-btn>
              </div>
            </v-form>
          </div>
          <div></div>
        </div>
<!--        other options-->
      </div>
    </v-main>
  </v-app>
</template>
<script>
import validations from '@/utils/validations';
// import PhoneInput from '@/components/layout/components/PhoneInput';
import CardTitle from '@/components/shared/CardTitle';
import AuthMixins from '@/mixins/AuthMixins';
import LogoTitle from '@/components/shared/LogoText';
import { isAuthenticated } from '@/utils/roles';

export default {
  components: { LogoTitle, CardTitle },
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
      loading: false,
    };
  },
  mixins: [AuthMixins],
  computed: {
    isAuthenticated,
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
  },
};
</script>
<style scoped>
.main-bg {
  background: white;
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
