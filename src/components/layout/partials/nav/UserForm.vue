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
<!--        <v-text-field-->
<!--            id="email"-->
<!--            type="email"-->
<!--            name="email"-->
<!--            v-model="email"-->
<!--            label="Email Address"-->
<!--            :rules="[required('Email'), emailFormat()]"-->
<!--            disabled-->
<!--        >-->
<!--        </v-text-field>-->
        <div
            class="tw-flex tw-w-full tw-flex-row tw-justify-start tw-items-start"
        >
          <div
              class="tw-flex tw-flex-col"
          >
            <v-text-field
                label="My Location"
                v-model="userLocation.location.customName"
                class="tw-font-bold"
            ></v-text-field>
            <div class="tw-flex tw-flex-row">
              <v-text-field
                  label="latitude"
                  prefix="("
                  suffix=","
                  v-model="userLocation.location.latitude"
              ></v-text-field>
              <v-text-field
                  label="longitude"
                  suffix=")"
                  v-model="userLocation.location.longitude"
              ></v-text-field>
            </div>
          </div>
          <v-btn
              @click="getLocation"
          >
            <v-icon color="linear-gradient(green, red)" >mdi-google-maps</v-icon>
          </v-btn>
        </div>
        <v-text-field
            id="phone"
            type="text"
            name="phone"
            v-model="phone_number"
            label="Phone Number"
            :rules="[required('Mobile No.')]"
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
import validations from '@/utils/validations.js';
import { mapGetters, mapState } from 'vuex';
import { getCurrentUserRole, getCurrentUserId } from '@/utils/roles.js';
import axios from 'axios';

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
      role: '',
      userLocation: {
        location: {
          latitude: 0.0,
          longitude: 0.0,
          customName: '',
        },
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    ...mapGetters('auth', ['hasAuthenticationStatus', 'authenticationStatus']),
    getCurrentUserId,
    getCurrentUserRole,
  },
  mounted() {
    this.role = getCurrentUserRole();
    this.fullname = this.user.name;
    this.email = this.user.email;
    this.phone_number = this.user.phone_number;
    axios.get(`${getCurrentUserRole()}s-service/location/${this.role}?${this.role}Id=${getCurrentUserId()}`).then((response) => {
      if (response.data.success === true) {
        const data = response.data.data;
        this.userLocation.location.latitude = data?.latitude;
        this.userLocation.location.longitude = data?.longitude;
        this.userLocation.location.customName = data?.customName;
      }
    }).catch((e) => {
      this.$toast.error(e.message);
    });
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
    getLocation() {
      this.$toast.show('Collecting location infor');
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.userLocation.location.latitude = position.coords.latitude;
        this.userLocation.location.longitude = position.coords.longitude;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.userLocation.location.latitude},${this.userLocation.location.longitude}
&location_type=ROOFTOP&result_type=street_address&key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              this.$toast.error(`Network response was not ok ${response.statusText}`);
            }
            return response.json(); // or response.text(), response.blob(), etc.
          })
          .then((data) => {
            this.userLocation.location.customName = data.plus_code.compound_code;
            axios.put(`/${this.role}s-service/location/${this.role}`, {
              [`${this.role}Id`]: getCurrentUserId(),
              locationDto: {
                latitude: this.userLocation.location.latitude,
                longitude: this.userLocation.location.longitude,
                customName: this.userLocation.location.customName,
              },
            }).then((response) => {
              if (response.data.success === true) {
                this.$toast.success('Location updated successfully!');
              } else {
                this.$toast.error('Failed to update location', response.data.msg);
              }
            });
          })
          .catch((error) => {
            this.$toast.error('Error fetching location name', error.message);
          });
      },
      (positionError) => {
        this.$toast.error(positionError.message);
      });
    },
  },
};
</script>
