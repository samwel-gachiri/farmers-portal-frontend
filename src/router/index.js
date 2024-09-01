import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '@/store';
import VueMeta from 'vue-meta';
import Landing from '@/views/Landing';
import Connection from '@/views/errors/Connection';

Vue.use(VueMeta);

Vue.use(VueRouter);

// const ifNotAuthenticated = (_to, _from, next) => {
//   if (!store.getters['auth/isAuthenticated']) {
//     next();
//     return;
//   }
//   next('/dashboard');
// };
//
// const ifAuthenticated = (_to, _from, next) => {
//   if (store.getters['auth/isAuthenticated']) {
//     next();
//     return;
//   }
//   next(`/signin?r=${btoa(window.location.href)}`);
// };

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  // {
  //   path: '/signin',
  //   name: 'SignIn',
  //   beforeEnter: ifNotAuthenticated,
  //   component: () => import('../views/auth/SignIn'),
  // },
  // {
  //   path: '/signup',
  //   name: 'SignUp',
  //   beforeEnter: ifNotAuthenticated,
  //   component: () => import('../views/auth/SignUp'),
  // },
  // {
  //   path: '/confirm-otp',
  //   name: 'ConfirmOtp',
  //   beforeEnter: ifNotAuthenticated,
  //   component: () => import('../views/auth/ConfirmOTP'),
  // },
  // {
  //   path: '/confirm-login-otp',
  //   name: 'ConfirmLoginOtp',
  //   beforeEnter: ifNotAuthenticated,
  //   component: () => import('../views/auth/ConfirmLoginOTP'),
  // },
  // {
  //   path: '/forgot-password',
  //   name: 'ForgotPassword',
  //   beforeEnter: ifNotAuthenticated,
  //   component: () => import('../views/auth/password/ForgotPassword'),
  // },
  // {
  //   path: '/reset-password',
  //   name: 'ResetPassword',
  //   beforeEnter: ifNotAuthenticated,
  //   component: () => import('../views/auth/password/ResetPassword'),
  // },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // beforeEnter: ifAuthenticated,
    component: () => import('../views/Dashboard'),
  },
  // {
  //   path: '/buy-cover',
  //   name: 'BuyCover',
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('../views/cover/BuyCover'),
  // },
  // {
  //   path: '/card-response',
  //   name: 'CardRedirect',
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('../views/cover/CardRedirectPage'),
  // },
  // {
  //   path: '/request-for-quotation',
  //   name: 'Request',
  //   component: () => import('../views/rfq/Request'),
  // },
  // {
  //   path: '/saved-quotes',
  //   name: 'SavedQuotes',
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('../views/quotes/SavedQuotes'),
  // },
  // {
  //   path: '/my-policies',
  //   name: 'MyPolicies',
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('../views/policies/MyPolicies'),
  // },
  // {
  //   path: '/my-policies/:policyNo',
  //   name: 'SinglePolicy',
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('../views/policies/SinglePolicy'),
  // },
  //
  // {
  //   path: '/my-policies/:batchNo/renew/:policyNo',
  //   name: 'RenewPolicy',
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('../views/policies/RenewPolicy'),
  // },
  // {
  //   path: '/my-policies/:batchNo/pay-instalment/:policyNo/:quoteId',
  //   name: 'InstalmentPayment',
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('../views/policies/InstalmentPayment'),
  // },
  // {
  //   path: '/notifications',
  //   name: 'Notifications',
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('../views/notifications/Notifications'),
  // },
  // ? last route for pwa default
  {
    path: '/index.html', // or '*' this is for PWA
    beforeEnter: (_to, _from, next) => {
      next('/');
    },
  },
  {
    path: '/error',
    name: 'ServerError',
    component: () => import('../views/errors/Error50x'),
  },
  {
    path: '/no-internet',
    name: 'NoInternet',
    component: Connection,
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/errors/Error404'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, _from, _savedPosition) {
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
  routes,
});

export default router;
