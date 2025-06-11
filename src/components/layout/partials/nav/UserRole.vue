<template>
  <div>
<!--    <button @click="TOOGLE_USER_ROLE">{{ role }}</button>-->
    <h6 class="tw-ml-2 tw-mt-4 tw-text-md tw-font-bold tw-text-gray-800">{{role[0].toUpperCase() + role.slice(1)}} section</h6>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState({
      role: (state) => state.auth.role,
    }),
  },
  methods: {
    ...mapMutations('auth', ['TOOGLE_USER_ROLE']),
  },
};
</script>
