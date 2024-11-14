<template>
  <v-app>
    <div class="tw-w-full tw-min-h-full c-bg-gray" >
      <r-f-q-nav />

      <div class="tw-flex tw-min-h-screen tw-bg-bottom" style="background-image: url(/images/rfq.png)">
        <div class="tw-container tw-mx-auto">

          <slot></slot>

        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import RFQNav from '@/components/layout/partials/RFQNav';

export default {
  name: 'Rfq',
  components: { RFQNav },
};
</script>

<style scoped>
.border-blue {
  border-color: var(--blue-color) !important;
}
</style>
