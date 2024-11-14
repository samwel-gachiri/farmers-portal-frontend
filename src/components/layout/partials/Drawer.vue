<template>
  <div>
    <v-list dense>
      <div class="tw-px-4 tw-py-3 md:tw-py-10 tw-px-16 tw-mb-8">
        <router-link :to="{ name: 'Dashboard'}">
          <img width="120" src="/logo-light.svg" alt="logo">
        </router-link>
      </div>
      <template v-for="item in items">
        <v-list-item
            :key="item.text"
            link
            :to="item.link"
            active-class="nav-active"
            class="tw-mt-0 md:tw-mt-5"
        >
          <v-list-item-action>
            <v-icon color="#fff">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="tw-text-white tw-font-bold">
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-item
          link
          active-class="nav-active"
          class="tw-mt-0 md:tw-mt-5"
          @click="$root.$emit('modal-opened-claims')"
      >
        <v-list-item-action>
          <v-icon color="#fff">mdi-shield-lock</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="tw-text-white tw-font-bold">
            Make A Claim
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
<!--    <claims-modal v-if="$route.name !== 'Dashboard'" />-->
  </div>
</template>

<script>
// import ClaimsModal from '@/components/shared/ClaimsModal';

export default {
  name: 'Drawer',
  // components: { ClaimsModal },
  data: () => ({
    items: [
      { icon: 'mdi-apps', text: 'Dashboard', link: { name: 'Dashboard' } },
      { icon: 'mdi-shield-plus', text: 'Get Quote', link: { name: 'Request', query: { toRfq: true } } },
      { icon: 'mdi-shield-car', text: 'My Policies', link: { name: 'MyPolicies' } },
      { icon: 'mdi-shield-edit', text: 'Saved Quotes', link: { name: 'SavedQuotes' } },
    ],
  }),
};
</script>

<style scoped>
.tw-font-bold {
  font-weight: 600!important;
}
.nav-active{
  background-color: #012247;
  border-left: #e02020 8px solid;
}
</style>
