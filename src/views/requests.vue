<script>

import Default from '@/components/layout/Default';
import googleMapsLoader from '@/components/GoogleMapsLoader';
// import axios from 'axios';

export default {
  components: { Default },
  methods: {
    loadMap() {
      googleMapsLoader.load()
        .then((google) => {
          navigator.geolocation.getCurrentPosition((position) => {
            const map = new google.maps.Map(this.$refs.map, {
              center: { lat: position.coords.latitude, lng: position.coords.longitude },
              zoom: 16,
              heading: 320,
              tilt: 47.5,
              mapId: '8fafea89cad68455',
              rotateControl: true,
            });
            // eslint-disable-next-line no-new
            const marker = new google.maps.Marker({
              position: { lat: position.coords.latitude, lng: position.coords.longitude },
              map,
              // icon: {
              //   url: '../assets/images/buyer_map_icon.png',
              //   scaledSize: new google.maps.Size(40, 40),
              // },
            });

            marker.addListener('click', (event) => {
              this.$toast.success(event.latLng);
            });
          },
          (error) => {
            this.$toast.error(error.message);
          },
          {
            enableHighAccuracy: true,
          });
        })
        .catch((err) => {
          this.$toast.error(err.message);
        });
    },
  },
  mounted() {
    this.loadMap();
    // axios.get('http://localhost:8080/farmers-service/farmers')
    //   .then((value) => console.log(value))
    //   .catch((reason) => console.error(reason));
    // axios.get('https://jsonplaceholder.typicode.com/posts/1')
    //   .then((response) => this.$toast.error(response.data))
    //   .catch((error) => console.error(error));
    // Scene
  },
};
</script>

<template>
  <Default>
    <!--  <img-->
    <!--      src="../assets/images/logo.png"-->
    <!--      alt="Company Logo"-->
    <!--      class="tw-border tw-rounded-lg tw-pl-5"-->
    <!--      loading="lazy"-->
    <!--  />-->
    <div
        class="full-width tw-flex md:tw-flex-row tw-flex-col tw-justify-center tw-items-start tw-w-full tw-min-w-full"
    >
      <!--    nearby farmers and buyers selection pane-->
      <div class="tw-flex tw-flex-col tw-w-full">
        <div class="tw-flex tw-justify-center tw-items-center tw-px-10">
          <v-text-field
              label="Looking for requests?"
              placeholder="Input the name of the farm produce,"
              dense
              class="tw-bg-gray-100 tw-w-2/3"
          >
          </v-text-field>
        </div>
        <div class="tw-border-8 tw-rounded-md" ref="map" style="width: 100%; height: 400px;"></div>
      </div>
      <!--    Produce requests-->
      <div class="tw-w-full">
        <h2 class="title-font tw-font-bold">
          <v-icon>mdi-cash-marker</v-icon>
          BUYERS Requests
        </h2>
        <v-divider/>
        <div>
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
                  <h1>{{ "James Mutinda" }}</h1>
                  <h2>
                    <v-icon>mdi-google-maps</v-icon>
                    {{ "Busia" }}</h2>
                </div>
              </div>
              <h2
                  class="tw-mb-3 tw-ml-4"
              > ⭐⭐⭐ </h2>
              <v-btn
                  class="tw-ml-4"
              >
                View
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped>
.produce-list {
  max-height: 100vh;
  overflow: scroll;
}
.full-width {
  width: 90vw;
}

@media (min-width: 768px) {
  .full-width {
    width: 100vw;
  }
}

@media (min-width: 1300px) {
  .full-width {
    width: 80vw;
  }
}

</style>
