/* eslint-disable global-require */
import Vue from 'vue';
import VueTimeAgo from 'vue-timeago';

Vue.use(VueTimeAgo, {
  name: 'TimeAgo', // Component name, `TimeAgo` by default
  locale: undefined, // Default locale
  locales: {
    'en-US': require('date-fns/locale/en-US'),
    ja: require('date-fns/locale/ja'),
  },
});
