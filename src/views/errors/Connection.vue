<template>
  <v-app content="center" class="bg-gradient-blue tw-h-screen tw-flex tw-items-center">
    <div class="tw-w-full tw-flex tw-justify-center tw-flex-col tw-py-10 md:tw-py-16">
      <h2 class="tw-text-center tw-py-3 tw-text-3xl md:tw-text-6xl c-white-text">Ooops!</h2>
      <h2 class="tw-text-center tw-py-2 tw-text-2xl md:tw-text-4xl c-white-text">Unable to connect to the internet</h2>
      <div class="tw-flex tw-justify-center">
        <img width="500" src="/images/connection.svg" alt="no internet">
      </div>
      <div class="tw-flex tw-justify-center tw-flex-col tw-text-center">
        <h5 class="tw-py-6 tw-text-2xl md:tw-text-4xl c-white-text">Check your connection and try again !</h5>
        <v-btn @click="$router.go(-1)" class="tw-w-48 tw-self-center tw-mt-6" color="secondary"><v-icon color="#fff">mdi-refresh</v-icon> Retry</v-btn>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'Connection',
};
</script>

<style scoped>
.bg-gradient-blue {
  background: linear-gradient(-180deg, rgb(17, 76, 172) 0%, rgb(6, 40, 96) 100%);
}
</style>
