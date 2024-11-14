<template>
  <nav :class="['tw-w-full tw-flex navv', $route.name === 'Landing' ? 'tw-bg-transparent tw-absolute tw-z-40' : 'tw-bg-white']">
    <div class="tw-container tw-mx-auto">
      <div class="tw-w-full tw-max-w-7xl tw-mx-auto tw-px-2 sm:tw-px-6 lg:tw-px-8">
        <div class="tw-relative tw-flex tw-items-center tw-justify-between tw-h-12">
          <div class="tw-flex-1 tw-flex tw-items-center tw-justify-start sm:tw-items-stretch sm:tw-justify-start">
            <div class="tw-flex-shrink-0">
              <router-link :to="isAuthenticated ? {name: 'Dashboard' } : '/'">
                <img class="tw-block lg:tw-hidden tw-h-12 tw-w-auto tw--mb-12" src="/logo.svg" alt="Workflow logo">
                <img class="tw-hidden lg:tw-block tw-h-16 tw-w-auto tw--mb-12" src="/logo.svg" alt="Workflow logo">
              </router-link>
            </div>
          </div>
          <div class="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2 sm:tw-static sm:tw-inset-auto sm:tw-ml-6 sm:tw-pr-0">
            <!-- Profile dropdown -->
            <avatar v-if="isAuthenticated"/>
          </div>
        </div>
      </div>
    </div>
    <screen-idle :dialog="isIdle" />
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import Avatar from '@/components/layout/partials/nav/Avatar';
import ScreenIdle from '@/components/shared/ScreenIdle';

export default {
  name: 'RFQNav',
  components: { ScreenIdle, Avatar },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    isIdle() {
      return this.$store.state.idleVue.isIdle && this.$store.getters['auth/isAuthenticated'];
    },
  },
};
</script>
<style lang="scss">
.navv {
  @media only screen and (max-width: 480px) {
    background: linear-gradient(-180deg, rgb(0, 42, 80) 0%, rgba(17, 76, 172, 0) 100%);
  }
}
.tw-bg-white1 {
  background: linear-gradient(-180deg, rgb(0, 42, 80) 0%, rgba(17, 76, 172, 0) 100%);
}
</style>
