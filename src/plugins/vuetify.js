// eslint-disable-next-line import/no-extraneous-dependencies
import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#034EA2',
        secondary: '#F8AB10',
        accent: '#EFEFEF',
        error: '#FF5252',
        info: '#616060',
        success: '#4CAF50',
        warning: '#FFC107',
        primary1: '#5d95f2',
      },
    },
  },
  icons: {
    iconfont: 'mdi',
  },
});
