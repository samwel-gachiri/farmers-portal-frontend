<script>

import Default from '@/components/layout/Default';
import { viewPermissions, getCurrentUserRole, getCurrentUserId } from '@/utils/roles';

export default {
  components: { Default },
  computed: {
    getCurrentUserId,
    getCurrentUserRole,
  },
  methods: {
    viewPermissions,
  },
  mounted() {
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
    <div v-if="viewPermissions(['Buyer'])">
      <h2>What is my name</h2>
      <div>user: {{ getCurrentUserId }}</div>
      <div>role: {{ getCurrentUserRole }}</div>
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
