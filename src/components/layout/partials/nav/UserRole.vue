<template>
  <div>
<!--    <button @click="TOOGLE_USER_ROLE">{{ role }}</button>-->
    <h5 class="tw-ml-2 tw-mt-2">{{role.toUpperCase()}} SECTION</h5>
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
