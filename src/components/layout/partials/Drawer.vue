<template>
  <div>
    <v-list dense>
      <div class="tw-px-4 tw-py-3 md:tw-py-5 tw-mb-8">
        <router-link :to="{ name: 'Dashboard'}">
<!--          <img width="80" style="rotate: -17deg" :src="require('@/assets/images/samwel.png')" alt="Profile Logo" class="tw-rounded-full tw-object-cover tw-border-4 tw-border-teal-500 tw-shadow-md" />-->
          <avatar
          >samwel gachiri</avatar>
        </router-link>
      </div>
      <template v-for="item in items">
        <v-list-item
            :key="item.text"
            link
            :to="item.link"
            active-class="nav-active"
            class="tw-mx-6 md:tw-mt-2 mdi-lis tw-mt-5"
        >
          <v-list-item-action>
            <v-icon color="black">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="tw-text-black tw-font-bold">
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <!--    <claims-modal v-if="$route.name !== 'Dashboard'" />-->
  </div>
</template>

<script>
import avatar from '@/components/layout/partials/nav/Avatar';

export default {
  name: 'Drawer',
  components: { avatar },
  data: () => ({
    items: [
      { icon: 'mdi-account-group', text: 'Community', link: { name: 'Dashboard' } },
      { icon: 'mdi-tractor', text: 'Sell produce', link: { name: '', query: { toSamwel: true } } },
      { icon: 'mdi-library-shelves', text: 'My Sales', link: { name: '' } },
    ],
  }),
};
</script>

<style scoped>
.tw-font-bold {
  font-weight: 600!important;
}
.nav-active{
  background-color: #a6a6a5;
  color: white;
  margin-right: 1.5rem;
  margin-left: 1.5rem;
}
</style>
