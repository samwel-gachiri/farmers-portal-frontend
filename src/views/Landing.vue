<script>
// import Navigation from '@/components/navigation';

// import Default from '@/components/layout/Default';

import LogoTitle from '@/components/shared/LogoText';

export default {
  name: 'Landing',
  components: { LogoTitle },
  methods: {
    openSignIn() {
      this.$router.push({ name: 'SignIn', query: { r: btoa(window.location.href) } });
    },
  },
  // components: { Default },
  // components: {
  //   Navigation,
  // },
};
</script>

<template>
  <v-app id="inspire" class=" tw-bg-white">
    <div class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-px-4">
      <logo-title class="md:tw-w-1/3 tw-w-full"></logo-title>
      <h2 style="color: #13361C;" class="tw-mt-4 tw-font-bold">Pahali pa wakulima kupatana na wauzaji</h2>
    </div>
    <div class="tw-w-full tw-flex tw-h-full lg:tw-h-full tw-items-center tw-justify-center tw-px-2 lg:tw-px-4">
      <router-link id="dashboard" :to="{ name: 'Dashboard' }" class="tw-flex tw-flex-col tw-justify-center tw-mx-4">
        <v-icon
            size="120"
            color="primary"
            class=""
        >mdi-truck</v-icon>
        <v-icon
            class="tw--mt-20 tw-mb-16 mr-8"
            size="30"
            color="white"
        >mdi-cow</v-icon>
        <div class="c-green-text tw-ml-4">Dashboard <v-icon color="primary">mdi-flower</v-icon></div>
      </router-link>
      <v-btn
          color="primary"
          rounded
          @click="openSignIn()"
      >
        get started
      </v-btn>
    </div>

  </v-app>
</template>

<style scoped>

h1 {
  font-family: "Roboto Thin",serif;
}
h1, h2, a{
  color: white;
}
.lifted-neu {
  background: #0f0f0f;
  border-radius: 15px;
  min-height: 90vh;
  //box-shadow: 9.91px 9.91px 15px #D9DADE, -9.91px -9.91px 15px #FFFFFF;
}
.lifted {
  background: #EEF0F4;
  border-radius: 15px;
  box-shadow: 9.91px 9.91px 15px #D9DADE, -9.91px -9.91px 15px #FFFFFF;
}
</style>
