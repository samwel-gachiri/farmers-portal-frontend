<template>
  <v-card class="tw-px-4 md:tw-px-8 tw-flex tw-justify-center" flat>
    <div class="tw-w-full md:tw-w-64 tw-mt-4">
      <v-form v-model="isValid">
        <v-text-field
            id="name"
            type="text"
            name="name"
            v-model="fullname"
            label="Full Name"
            class="my-1"
            :rules="[required('Full Name')]"
        >
        </v-text-field>
        <v-text-field
            id="email"
            type="email"
            name="email"
            v-model="email"
            label="Email Address"
            :rules="[required('Email'), emailFormat()]"
            disabled
        >
        </v-text-field>
        <v-text-field
            id="phone"
            type="text"
            name="phone"
            v-model="phone_number"
            label="Phone Number"
            :rules="[required('Mobile No.'), mobileFormat()]"
            disabled
        >
        </v-text-field>
        <v-text-field
            id="karPin"
            type="text"
            name="kraPin"
            v-model="kra_pin"
            label="KRA Pin"
            :rules="[required('KRA PIN'), kraPinFormat()]"
            disabled
        >
        </v-text-field>
        <v-card-actions class="col-sm-6 offset-sm-3">
          <v-btn block small
                 id="userUpdate"
                 color="secondary"
                 @click="updateProfile"
                 :disabled="!isValid"
                 :loading="loading">
            Update Details
          </v-btn>
        </v-card-actions>
      </v-form>
    </div>
  </v-card>
</template>

<script>
import validations from '@/utils/validations';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'UserForm',
  data() {
    return {
      fullname: '',
      email: '',
      phone_number: '',
      kra_pin: '',
      isValid: false,
      ...validations,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    ...mapGetters('auth', ['hasAuthenticationStatus', 'authenticationStatus']),
  },
  mounted() {
    this.fullname = this.user.name;
    this.email = this.user.email;
    this.phone_number = this.user.phone_number;
    this.kra_pin = this.user['custom:kra-pin'];
  },
  methods: {
    async updateProfile() {
      this.loading = true;
      // { email: this.email, phone_number: this.phone_number, name: this.fullname }
      await this.$store.dispatch('auth/updateUser', { name: this.fullname }).then(() => {
        if (this.hasAuthenticationStatus) {
          this.loading = false;
          if (this.authenticationStatus.variant === 'error') {
            this.$toast.error(this.authenticationStatus.message, 'Error');
          } else {
            this.$toast.success(this.authenticationStatus.message, 'Success');
          }
        }
      });
    },
  },
};
</script>
