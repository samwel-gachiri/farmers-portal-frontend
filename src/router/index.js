import Vue from 'vue';
import VueRouter from 'vue-router';
// eslint-disable-next-line import/extensions
import store from '@/store';
import VueMeta from 'vue-meta';
import Landing from '@/views/Landing.vue';
import Connection from '@/views/errors/Connection.vue';
import Home from '@/views/Home.vue';
import Offline from '@/views/Offline.vue';

Vue.use(VueMeta);

Vue.use(VueRouter);

const ifNotAuthenticated = (_to, _from, next) => {
  if (!store.getters['auth/isAuthenticated']) {
    next();
    return;
  }
  // eslint-disable-next-line sonarjs/no-duplicate-string
  next('/dashboard');
};
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
    path: '/harvest-yields',
    name: 'HarvestAndYields',
    component: () => import('../views/HarvestAndYields.vue'),
    meta: {
      title: 'Harvest & Yields',
      requiresAuth: true,
      roles: ['FARMER'],
      description: 'Manage harvests, yields, and analytics',
      icon: 'mdi-food-apple',
    },
  },
  {
    path: '/yield-recording',
    name: 'YieldRecording',
    component: () => import('../views/YieldRecording.vue'),
    meta: {
      title: 'Yield Recording',
      requiresAuth: true,
      roles: ['FARMER'],
      description: 'Record and manage produce yields',
      icon: 'mdi-chart-bar',
    },
  },
  {
    path: '/harvest-analytics',
    name: 'HarvestAnalytics',
    component: () => import('../views/HarvestAnalytics.vue'),
    meta: {
      title: 'Harvest Analytics',
      requiresAuth: true,
      roles: ['FARMER'],
      description: 'View analytics and insights for harvests and yields',
      icon: 'mdi-chart-areaspline',
    },
  },
  {
    path: '/',
    name: 'Landing',
    // beforeEnter: ifAuthenticated,
    component: Landing,
    meta: {
      title: 'AgriBackup - company',
      metaDescription: 'Farmers & Buyers Connection platform',
    },
  },
  {
    path: '/pickup-routes',
    name: 'PickupRoutes',
    component: () => import('../views/PickupRoutes.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    // beforeEnter: ifAuthenticated,
    component: Home,
  },
  {
    path: '/signin',
    name: 'SignIn',
    // for before enter, i would like for it to check the query mode and if mode is self it can redirect to dashboard
    beforeEnter: (_to, _from, next) => {
      // get the query mode
      const queryMode = _to.query.mode;
      if (!store.getters['auth/isAuthenticated'] || queryMode === 'exporter') {
        next();
        return;
      }
      next('/dashboard');
    },
    // eslint-disable-next-line consistent-return
    component: () => import('../views/auth/SignIn.vue'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    beforeEnter: ifNotAuthenticated,
    component: () => import('../views/auth/SignUp.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/auth/ForgotPassword.vue'),
  },
  {
    path: '/produces/:farmerId',
    name: 'Produces',
    component: () => import('../views/Produces.vue'),
  },
  {
    path: '/my-farm/:farmerId',
    name: 'MyFarm',
    component: () => import('../views/Produces.vue'),
  },
  {
    path: '/listings',
    name: 'Listings',
    component: () => import('../views/Listings.vue'),
  },
  {
    path: '/requests',
    name: 'Requests',
    component: () => import('../views/Requests.vue'),
  },
  {
    path: '/buyer-orders',
    name: 'BuyerOrders',
    component: () => import('../views/buyers/BuyerOrders.vue'),
  },
  {
    path: '/farmer-orders',
    name: 'FarmerOrders',
    component: () => import('../views/farmer/FarmerOrders.vue'),
  },
  {
    path: '/browse',
    name: 'BrowseListings',
    component: () => import('../views/buyers/BrowseListings.vue'),
  },
  {
    path: '/browse-requests',
    name: 'BrowseRequests',
    component: () => import('../views/farmer/BrowseRequests.vue'),
  },
  {
    path: '/users-report',
    name: 'UsersReport',
    component: () => import('../views/admin/UsersReport.vue'),
  },
  {
    path: '/order-report',
    name: 'OrdersReport',
    component: () => import('../views/admin/OrdersReport.vue'),
  },
  {
    path: '/zone-management',
    name: 'ZoneManagement',
    component: () => import('../views/exporter/ZoneManagement.vue'),
  },
  {
    path: '/exporter/system-admins',
    name: 'SystemAdminsManagement',
    component: () => import('../views/exporter/SystemAdminsManagement.vue'),
  },
  {
    path: '/exporter/zone-supervisors',
    name: 'ZoneSupervisorsManagement',
    component: () => import('../views/exporter/ZoneSupervisorsManagement.vue'),
  },
  {
    path: '/exporter/farmers',
    name: 'FarmersManagement',
    component: () => import('../views/exporter/FarmersManagement.vue'),
  },
  {
    path: '/exporter/pickup-schedules',
    name: 'PickupSchedulesManagement',
    component: () => import('../views/exporter/PickupSchedulesManagement.vue'),
  },
  {
    path: '/exporter/zone-comments',
    name: 'ZoneCommentsManagement',
    component: () => import('../views/exporter/ZoneCommentsManagement.vue'),
  },
  {
    path: '/exporter/profile',
    name: 'ExporterProfile',
    component: () => import('../views/exporter/ExporterProfile.vue'),
  },
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
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPassoword.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // beforeEnter: ifAuthenticated,
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/farm-ai',
    name: 'FarmAI',
    component: () => import('../views/FarmAI.vue'),
  },
  {
    path: '/community',
    name: 'Community',
    // beforeEnter: ifAuthenticated,
    component: () => import('../views/Community.vue'),
  },
  {
    path: '/farmer-report',
    name: 'FarmerReport',
    component: () => import('../views/report/farmer_reports.vue'),
  },
  {
    path: '/buyer-report',
    name: 'BuyerReport',
    component: () => import('../views/report/buyer_report.vue'),
  },
  {
    path: '/ad',
    name: 'Advertisement',
    component: () => import('../views/advertisement.vue'),
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
    component: () => import('../views/errors/Error50x.vue'),
  },
  {
    path: '/no-internet',
    name: 'NoInternet',
    component: Connection,
  },
  {
    path: '/offline',
    name: 'Offline',
    component: Offline,
    meta: { public: true },
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/errors/Error404.vue'),
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
