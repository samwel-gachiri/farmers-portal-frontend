<template>
  <div id="app">
    <router-view/>

    <!-- Floating Trust Badge -->
    <div class="tw-fixed tw-bottom-4 tw-left-4 tw-z-50 tw-flex tw-items-center tw-gap-2 tw-bg-white tw-shadow-lg tw-px-3 tw-py-2 tw-rounded-full tw-border tw-border-green-100 tw-animate-fade-in-up">
      <v-icon color="green darken-1" size="20">mdi-shield-check</v-icon>
      <span class="tw-text-xs tw-font-bold tw-text-green-800 tw-tracking-wide">EUDR VERIFIED</span>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default {
  name: 'App',
  mounted() {
    this.warmUpBackend();
  },
  methods: {
    warmUpBackend() {
      // Fire-and-forget request to wake up Google Cloud Run
      // We use axios directly to bypass any auth interceptors

      // We assume /api/public/health is the correct path relative to the domain
      // If VUE_APP_API_BASE_URL handles the /api part, we might need adjustment,
      // but standard practice with proxy is relative path.
      axios.get('/api/public/health')
        .catch(() => {
          // Silently fail - this is just a warm-up optimization
          // console.debug('Backend warm-up request failed or timed out');
        });
    },
  },
};
</script>
<style>
</style>
<!--<script setup>-->
<!--import { ref, onMounted } from 'vue';-->
<!--import { supabase } from './lib/supabaseClient.js';-->

<!--const instruments = ref([]);-->

<!--async function getInstruments() {-->
<!--  const { data } = await supabase.from('instruments').select();-->
<!--  instruments.value = data;-->
<!--}-->

<!--onMounted(() => {-->
<!--  getInstruments();-->
<!--});-->
<!--</script>-->

<!--<template>-->
<!--  <ul>-->
<!--    <li v-for="instrument in instruments" :key="instrument.id">{{ instrument.name }}</li>-->
<!--  </ul>-->
<!--</template>-->
