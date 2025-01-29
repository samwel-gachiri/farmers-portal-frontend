<script>
// import Navigation from '@/components/navigation';

// import Default from '@/components/layout/Default';

export default {
  name: 'Landing',
  // components: { Default },
  // components: {
  //   Navigation,
  // },
};
</script>

<template>
  <v-app id="inspire" class=" tw-bg-white">
    <div class="tw-w-full tw-flex tw-flex-col tw-h-full lg:tw-h-full tw-items-center tw-justify-center tw-px-2 lg:tw-px-4">
      <h2 class="c-title blue--text">Little Angels Academy</h2>
      <router-link id="dashboard" :to="{ name: 'Dashboard' }" class="tw-flex tw-flex-col tw-justify-center">
        <v-icon
            size="120"
        >mdi-school-outline</v-icon>
        <div class="c-green-text tw-ml-10">Dashboard <v-icon color="primary">mdi-chevron-right</v-icon></div>
      </router-link>
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
