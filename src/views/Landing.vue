/* eslint-disable */
<template>
  <v-app id="inspire">
    <div class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-start tw-py-5 md:tw-border-t-2 tw-border-t-0 tw-border-black md:tw-shadow-none tw-shadow-md">
      <logo-title class=""></logo-title>
    </div>

    <div class="tw-w-full tw-flex tw-flex-col tw-h-full lg:tw-h-full md:tw-items-center tw-items-start tw-justify-center tw-bg-gray-100">
      <h2 style="color: #13361C;" class="md:tw-text-6xl tw-text-3xl  md:tw-mt-0 tw-mt-8 md:tw-mx-0 tw-mx-10">Agriconnect Portals</h2>
      <h2 style="color: #13361C;" class="tw-mt-3 md:tw-font-bold  md:tw-mx-0 tw-mx-10">A place where farmers and buyers meet, interact and trade</h2>
      <v-divider
          :thickness="20"
          class="border-opacity-100 tw-w-64 tw-h-4"
          color="primary"
      ></v-divider>
      <div class="tw-flex md:tw-flex-row tw-flex-col tw-gap-8 tw-m-10">
        <v-card
            v-for="(user, index) in userTypes"
            :key="index"
            class="user-type-item tw-py-8 tw-px-10 tw-w-full"
            style="border-radius: 20px;"
            @click="openSignIn(user.name)"
        >
          <v-img
              v-if="user.name === 'Buyer'"
              src="@/assets/images/buyer.png"
              width="150"
              height="150"
          ></v-img>
          <v-img
              v-if="user.name === 'Farmer'"
              src="@/assets/images/farmer.png"
              width="150"
              height="150"
          ></v-img>
          <v-img
              v-if="user.name === 'Admin'"
              src="@/assets/images/admin.png"
              width="150"
              height="150"
          ></v-img>
          <h2 class="user-type-text tw-text-lg tw-font-extrabold tw-mt-2">{{ user.name }} Portal</h2>
          <h2 style="color: #7a7a7a;" class="c-blue-text tw-font-light tw-text-md"> {{ user.name }} Start Here</h2>
        </v-card>
      </div>
    </div>
  </v-app>
</template>

<script>
// import Navigation from '@/components/navigation.vue';

// import Default from '@/components/layout/Default.vue';
import Auth from '@aws-amplify/auth';
import AuthConfig from '@/utils/aws-exports.js';

import LogoTitle from '@/components/shared/LogoText.vue';
import { NOTIFICATIONS } from '@/utils/const.js';
import { getCurrentUserRole } from '@/utils/roles.js';

export default {
  name: 'Landing',
  data() {
    return {
      userTypes: [
        {
          name: 'Farmer',
          icon: '',
        },
        {
          name: 'Buyer',
          icon: '',
        },
        {
          name: 'Admin',
          icon: '',
        },
      ],
    };
  },
  components: { LogoTitle },
  methods: {
    async openSignIn(name) {
      const userName = name.toString().toLowerCase();
      if (userName === 'farmer') {
        Auth.configure(AuthConfig.FarmerAuth);
      }
      if (userName === 'buyer') {
        Auth.configure(AuthConfig.BuyerAuth);
      }
      if (userName === 'buyer') {
        Auth.configure(AuthConfig.AdminAuth);
      }
      console.log(getCurrentUserRole());
      console.log(userName);
      if (getCurrentUserRole() !== userName) {
        await this.$store.dispatch('auth/signOut');
        localStorage.removeItem(NOTIFICATIONS);
        if (caches) {
          caches.keys().then((arr) => {
            arr.forEach((key) => {
              caches.delete(key);
            });
          });
        }
      }
      await this.$store.dispatch('auth/setViewRole', userName);
      await this.$router.push({ name: 'SignIn', query: { r: btoa(window.location.href) } });
    },
  },
  // components: { Default },
  // components: {
  //   Navigation,
  // },
};
</script>

<style scoped>

h1 {
  font-family: "Roboto Thin",serif;
}
h1, h2, a{
  color: white;
}
.user-type-text{
  color: #13361C;
}
.lifted-neu {
  background: #0f0f0f;
  border-radius: 15px;
  min-height: 90vh;
  box-shadow: 9.91px 9.91px 15px #D9DADE, -9.91px -9.91px 15px #FFFFFF;
}
.lifted {
  background: #EEF0F4;
  border-radius: 15px;
  box-shadow: 9.91px 9.91px 15px #D9DADE, -9.91px -9.91px 15px #FFFFFF;
}
</style>
