<template>
  <v-card class="tw-px-4 md:tw-px-8 tw-flex tw-justify-center tw-w-full" flat>
    <v-form v-model="isValid" class="tw-w-full tw-mt-5">
        <div class="tw-flex md:tw-flex-row tw-flex-col tw-gap-5">
          <div class="tw-w-full tw-flex tw-flex-col tw-justify-between">
            <v-text-field
                outlined
                id="name"
                type="text"
                name="name"
                v-model="fullname"
                label="Full Name"
                placeholder="..."
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
                class="tw-flex tw-w-full tw-flex-col tw-justify-start tw-items-start"
            >
              <h2>{{ userLocation.location.customName === '' ? "Give in your location details": "Your Location Details"}}</h2>
              <v-alert
                type="info"
              >This will be used by farmers, buyers and the public to notice you.</v-alert>
              <v-text-field
                  outlined
                  label="My Location"
                  v-model="userLocation.location.customName"
                  class="tw-font-bold tw-w-full"
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
              <v-btn
                  @click="getLocation"
                  class="tw-mb-4"
                  color="primary"
              >
                Use Device Location
                <v-icon color="linear-gradient(green, red)" >mdi-google-maps</v-icon>
              </v-btn>
            </div>
<!--            <v-text-field-->
<!--                id="phone"-->
<!--                type="text"-->
<!--                name="phone"-->
<!--                v-model="phoneNumber"-->
<!--                label="Phone Number"-->
<!--                :rules="[required('Mobile No.')]"-->
<!--            >-->
<!--            </v-text-field>-->
            <div class="tw-mt-8 tw-flex tw-flex-col tw-gap-5">
              <h2 class="tw-bold">Input phone number</h2>
              <phone-number-input
                  v-model="phoneNumber"
                  default-country-code="KE"
                  :preferred-countries="['KE', 'US', 'UG', 'TZ']"
                  @update:phoneNumber="(newValue) => (phoneNumber = newValue)"
              />
            </div>
          </div>
          <div class="tw-w-full">
            <strong>Pinpoint Your Location Here <v-icon>mdi-gesture-two-tap</v-icon></strong>
            <!-- Leaflet Map -->
            <div id="map" class="map-container"></div>
          </div>
        </div>
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
  </v-card>
</template>

<script>
import validations from '@/utils/validations.js';
import { mapGetters, mapState } from 'vuex';
import { getCurrentUserRole, getCurrentUserId } from '@/utils/roles.js';
import axios from 'axios';
import L from 'leaflet';

export default {
  name: 'UserForm',
  data() {
    return {
      initialDetails: {
        fullname: '',
        latitude: '',
        longitude: '',
        customName: '',
        phoneNumber: '',
      },
      fullname: '',
      email: '',
      phoneNumber: '',
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
      map: null,
      marker: null,
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
    this.initMap();
    this.role = getCurrentUserRole();
    this.fullname = this.user.name;
    this.email = this.user.email;
    this.phoneNumber = this.user.phoneNumber;
    axios.get(`${getCurrentUserRole()}s-service/location/${this.role}?${this.role}Id=${getCurrentUserId()}`).then((response) => {
      if (response.data.success === true) {
        const data = response.data.data;
        this.userLocation.location.latitude = data?.latitude;
        this.userLocation.location.longitude = data?.longitude;
        this.userLocation.location.customName = data?.customName;
        if (data.latitude) {
          this.map.panTo([data?.latitude, data?.longitude]);
          this.marker = L.marker([data?.latitude, data?.longitude], {
            icon: L.icon({
              iconUrl: `https://agri-image.s3.us-east-1.amazonaws.com/uploads/${this.role}_map_icon.png`, // Path to your image
              iconSize: [25, 41], // Size of the icon
              iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
              popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png', // Optional shadow
              shadowSize: [41, 41], // Shadow size
            }),
          }).addTo(this.map);
        }
      }
    }).catch((e) => {
      this.$toast.error(e.message);
    }).finally(() => {
      this.initialDetails = {
        fullname: this.fullname,
        latitude: this.userLocation.location.latitude,
        longitude: this.userLocation.location.longitude,
        customName: this.userLocation.location.customName,
        phoneNumber: this.phoneNumber,
      };
    });
  },
  methods: {
    // Initialize the Leaflet map
    initMap() {
      this.map = L.map('map').setView([0, 0], 2); // Default view

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      // Click event to update location
      this.map.on('click', this.updateLocation);
    },

    // Update location based on user click
    updateLocation(event) {
      const { lat, lng } = event.latlng;

      // Update user location
      this.userLocation.location.latitude = lat;
      this.userLocation.location.longitude = lng;

      // Reverse geocode (fetch location name)
      this.getLocationName(lat, lng);

      // Move marker
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }
    },
    async getLocationName(lat, lng) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      this.userLocation.location.customName = data.display_name || 'Unknown Location';
    },
    async updateProfile() {
      this.loading = true;
      // { email: this.email, phoneNumber: this.phoneNumber, name: this.fullname }
      await this.$store.dispatch('auth/updateUser', { name: this.fullname, phoneNumber: this.phoneNumber }).then(() => {
        if (this.hasAuthenticationStatus) {
          this.loading = false;
          if (this.authenticationStatus.variant === 'error') {
            this.$toast.error(this.authenticationStatus.message, 'Error');
          } else {
            this.$toast.success(this.authenticationStatus.message, 'Success');
          }
        }
      }).finally(async () => axios.put(`${getCurrentUserRole()}s-service/${getCurrentUserRole()}`, {
        [`${this.role}Id`]: getCurrentUserId(),
        name: this.fullname,
        phoneNumber: this.phoneNumber ? this.phoneNumber : '',
        email: this.email,
      }).then((response) => {
        if (response.data.success === true) {
          this.$toast.success('Farmer Profile Updated successfully!');
        } else {
          this.$toast.error('Failed to update farmer profile', response.data.msg);
        }
      }).catch((error) => {
        this.$toast.error(error.message);
      }).finally(() => this.saveLocation()));
    },
    getLocation() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.userLocation.location.latitude = position.coords.latitude;
        this.userLocation.location.longitude = position.coords.longitude;
        this.getLocationName(this.userLocation.location.latitude, this.userLocation.location.longitude);
        if (this.marker) {
          this.marker.setLatLng([position.coords.latitude, position.coords.longitude]);
        } else {
          this.marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(this.map);
        }
      },
      (positionError) => {
        this.$toast.error(positionError.message);
      });
    },
    saveLocation() {
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
      }).catch((error) => {
        this.$toast.error(error.message);
      });
    },
  },
};
</script>
<style>
.map-container {
  width: 100%;
  height: 400px;
  margin-top: 10px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
