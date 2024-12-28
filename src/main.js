import Vue from 'vue';
import VueCookies from 'vue-cookies';
import store from '@/store';
import initialize from '@/utils/initialize';
import Auth from '@aws-amplify/auth';
import AuthConfig from '@/utils/aws-exports';
import VueIziToast from 'vue-izitoast';
import '@/assets/css/tailwind.css';
import '@/assets/css/color/default.css';
import '@/assets/css/nprogress.css';
import '@/assets/css/style.css';
import 'izitoast/dist/css/iziToast.min.css';
import helperMixins from '@/mixins/helperMixins';
import VuePhoneNumberInput from 'vue-phone-number-input';
import router from './router';
import vuetify from './plugins/vuetify';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import App from './App';

Vue.config.productionTip = false;

Vue.mixin(helperMixins);

Vue.use(VueCookies);
Vue.$cookies.config('7d', null, null, true, 'Strict');

Vue.component('phone-number-input', VuePhoneNumberInput);

Vue.use(VueIziToast, { position: 'topRight', timeout: 5000 });
Auth.configure(AuthConfig);

initialize.init(router, store);
new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
