<script>

import axios from 'axios';

export default {
  data() {
    return {
      latitude: null,
      longitude: null,
      custom_location: 'Busia',
    };
  },
  methods: {
    getLocation() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}
&location_type=ROOFTOP&result_type=street_address&key=AIzaSyBg4If8nCsc4dsBA9DQ8IYnXArfqOJRjyE`;
        try {
          const response = await axios.get(url);
          console.log(response.data);
          this.custom_location = response.data.plus_code.compound_code;
        } catch (error) {
          console.error('Error fetching location:', error);
          this.$toast.error('Error fetching location name');
        }
      });
    },
  },
};
</script>

<template>
  <div
      class="no-scroll-width tw-flex md:tw-flex-row tw-flex-col"
  >
<!-- Profile details    -->
    <div
      class="tw-h-full tw-border-b-4 md:tw-w-1/3 tw-w-full tw-flex tw-flex-col tw-justify-start md:tw-items-start tw-items-center tw-gap-5 tw-ml-2 tw-pb-3"
    >
      <v-img
          height="200px"
          width="200px"
          class="tw-border tw-mt-2"
      />
      <div class="tw-flex tw-gap-5">
        <v-btn
            small
            outlined
        >connect</v-btn>
        <v-btn
            small
            outlined
        >
          <v-icon>mdi mdi-share</v-icon>
          Share
        </v-btn>
      </div>
      <div
          class="tw-flex tw-flex-col tw-gap-5"
      >
        <h2
            class="tw-font-bold"
        >{{ "JAMES MUTINDA" }}</h2>
        <h2>Rating:   {{ "⭐⭐⭐" }}</h2>
        <div
            class="tw-flex tw-w-full tw-flex-row tw-justify-between"
        >
          <div
              class="tw-flex tw-flex-col"
          >Location:
            <span class="tw-font-bold">{{ custom_location }}</span>
            <h2>{{ latitude }}</h2>
            <h2>{{ longitude }}</h2>
          </div>
          <v-btn
              @click="getLocation"
          >
            <v-icon color="primary" >mdi-google-maps</v-icon>
          </v-btn>
        </div>
        <v-btn
            outlined
        >
          <v-icon>mdi mdi-pen</v-icon>
          Edit profile
        </v-btn>
        <router-link
            to="Dashboard"
        >
          <v-icon class="">mdi-web</v-icon>
          Home
        </router-link>
      </div>
    </div>
<!-- Produces   -->
    <div
        class="tw-w-full tw-border-l-4 tw-flex tw-justify-center tw-flex-col"
    >
      <h2 class="title tw-font-extrabold tw-m-4 tw-shadow-2xl">My Farm Produces
        <v-icon class="">mdi-cow</v-icon>
        <v-icon class="">mdi-corn</v-icon>
      </h2>
      <div
        class="produce-list tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-w-full tw-gap-5 tw-bg-gray-100"
      >
        <div
            v-for="(produce, i) in ['TOMATOES', 'VEGETABLES','ONIONS', 'POTATOES', 'FLOWERS']"
            v-bind:key="i"
            class="tw-m-4 tw-p-4 tw-shadow-lg tw-border-4 tw-rounded-lg tw-bg-white"
        >
          <div
              class="tw-my-3 tw-flex tw-flex-row"
          >
            <v-icon
                size="100px"
            >mdi mdi-image</v-icon>
            <div class="tw-flex tw-flex-col tw-justify-center tw-items-start">
              {{ produce }}
              <h3>A vegetable, sweet</h3>
            </div>
          </div>
          <h2
              class="tw-mb-3 tw-ml-4"
          > ⭐⭐⭐ </h2>
          <v-btn
              class="tw-ml-4"
          >
            <v-icon>mdi-plus-circle</v-icon>
            list for sale
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scroll-width {
  max-width: 100vw;
}
.produce-list {
  max-height: 100vh;
  overflow: scroll;
}
.title{
  font-family: "trebuc";
}
</style>
