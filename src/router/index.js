/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
// eslint-disable-next-line import/extensions
import store from "@/store";
import VueMeta from "vue-meta";
import Landing from "@/views/Landing.vue";
import Connection from "@/views/errors/Connection.vue";
import Home from "@/views/Home.vue";
import Offline from "@/views/Offline.vue";

Vue.use(VueMeta);

Vue.use(VueRouter);

const ifNotAuthenticated = (_to, _from, next) => {
  if (!store.getters["auth/isAuthenticated"]) {
    next();
    return;
  }
  // eslint-disable-next-line sonarjs/no-duplicate-string
  next("/dashboard");
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
    path: "/harvest-yields",
    name: "HarvestAndYields",
    component: () => import("../views/HarvestAndYields.vue"),
    meta: {
      title: "Harvest & Yields",
      requiresAuth: true,
      roles: ["FARMER"],
      description: "Manage harvests, yields, and analytics",
      icon: "mdi-food-apple",
    },
  },
  {
    path: "/yield-recording",
    name: "YieldRecording",
    component: () => import("../views/YieldRecording.vue"),
    meta: {
      title: "Yield Recording",
      requiresAuth: true,
      roles: ["FARMER"],
      description: "Record and manage produce yields",
      icon: "mdi-chart-bar",
    },
  },
  {
    path: "/harvest-analytics",
    name: "HarvestAnalytics",
    component: () => import("../views/HarvestAnalytics.vue"),
    meta: {
      title: "Harvest Analytics",
      requiresAuth: true,
      roles: ["FARMER"],
      description: "View analytics and insights for harvests and yields",
      icon: "mdi-chart-areaspline",
    },
  },
  // === FARMER EUDR ROUTES ===
  {
    path: "/farmer/eudr/status",
    name: "FarmerEudrStatus",
    component: () => import("../views/farmer/eudr/FarmerEudrStatus.vue"),
    meta: {
      title: "My EUDR Status",
      requiresAuth: true,
      roles: ["FARMER"],
      description: "View your EUDR compliance status and required actions",
      icon: "mdi-shield-check",
    },
  },
  {
    path: "/farmer/eudr/production-units",
    name: "FarmerProductionUnits",
    component: () => import("../views/farmer/eudr/FarmerProductionUnits.vue"),
    meta: {
      title: "My Production Units",
      requiresAuth: true,
      roles: ["FARMER"],
      description: "Manage your farm production areas and land verification",
      icon: "mdi-map-marker-radius",
    },
  },
  {
    path: "/farmer/eudr/documents",
    name: "FarmerDocuments",
    component: () => import("../views/farmer/eudr/FarmerDocuments.vue"),
    meta: {
      title: "My Documents",
      requiresAuth: true,
      roles: ["FARMER"],
      description: "Upload and manage your EUDR compliance documents",
      icon: "mdi-file-document-multiple",
    },
  },
  {
    path: "/farmer/eudr/monitoring",
    name: "FarmerMonitoring",
    component: () => import("../views/farmer/eudr/FarmerMonitoring.vue"),
    meta: {
      title: "My Farm Monitoring",
      requiresAuth: true,
      roles: ["FARMER"],
      description: "View satellite monitoring and deforestation alerts for your farms",
      icon: "mdi-satellite-variant",
    },
  },
  {
    path: "/farmer/eudr/batches",
    name: "FarmerBatches",
    component: () => import("../views/farmer/eudr/FarmerBatches.vue"),
    meta: {
      title: "My Batches",
      requiresAuth: true,
      roles: ["FARMER"],
      description: "Create and manage your commodity batches",
      icon: "mdi-package-variant",
    },
  },

  // === EXPORTER EUDR ROUTES ===
  {
    path: "/exporter/eudr/dashboard",
    name: "ExporterEudrDashboard",
    component: () => import("../views/exporter/eudr/ExporterEudrDashboard.vue"),
    meta: {
      title: "EUDR Dashboard",
      requiresAuth: true,
      roles: ["EXPORTER"],
      description: "Monitor and manage your suppliers' EUDR compliance status",
      icon: "mdi-shield-account",
    },
  },
  {
    path: "/exporter/eudr/supplier-compliance",
    name: "SupplierCompliance",
    component: () => import("../views/exporter/eudr/SupplierCompliance.vue"),
    meta: {
      title: "Supplier Compliance",
      requiresAuth: true,
      roles: ["EXPORTER"],
      description: "Manage and verify all farmer suppliers' compliance",
      icon: "mdi-account-group",
    },
  },
  {
    path: "/exporter/eudr/risk-management",
    name: "RiskManagement",
    component: () => import("../views/exporter/eudr/RiskManagement.vue"),
    meta: {
      title: "Risk Management",
      requiresAuth: true,
      roles: ["EXPORTER"],
      description: "Assess and mitigate supply chain risks",
      icon: "mdi-alert-octagon",
    },
  },
  {
    path: "/exporter/eudr/batches",
    name: "ExporterBatches",
    component: () => import("../views/exporter/eudr/ExporterBatches.vue"),
    meta: {
      title: "Batch Management",
      requiresAuth: true,
      roles: ["EXPORTER"],
      description: "Manage and track commodity batches from suppliers",
      icon: "mdi-package-variant-closed",
    },
  },
  {
    path: "/exporter/eudr/compliance-reports",
    name: "ExporterReports",
    component: () => import("../views/exporter/eudr/ExporterReports.vue"),
    meta: {
      title: "Compliance Reports",
      requiresAuth: true,
      roles: ["EXPORTER"],
      description: "Generate reports for regulatory submission",
      icon: "mdi-file-chart",
    },
  },
  {
    path: "/exporter/eudr/supply-chain-mapping",
    name: "SupplyChainMapping",
    component: () => import("../views/exporter/eudr/SupplyChainMapping.vue"),
    meta: {
      title: "Supply Chain Mapping",
      requiresAuth: true,
      roles: ["EXPORTER"],
      description: "Visualize and map your entire supply chain",
      icon: "mdi-map-search",
    },
  },
  {
    path: "/exporter/eudr/due-diligence",
    name: "DueDiligence",
    component: () => import("../views/exporter/eudr/DueDiligence.vue"),
    meta: {
      title: "Due Diligence",
      requiresAuth: true,
      roles: ["EXPORTER"],
      description: "Conduct comprehensive supplier due diligence",
      icon: "mdi-gavel",
    },
  },

  // === SYSTEM ADMIN EUDR ROUTES ===
  {
    path: "/admin/eudr/administration",
    name: "EudrAdministration",
    component: () => import("../views/admin/eudr/EudrAdministration.vue"),
    meta: {
      title: "EUDR Administration",
      requiresAuth: true,
      roles: ["SYSTEM_ADMIN"],
      description: "System-wide EUDR administration and oversight",
      icon: "mdi-shield-crown",
    },
  },
  {
    path: "/admin/eudr/data-verification",
    name: "DataVerification",
    component: () => import("../views/admin/eudr/DataVerification.vue"),
    meta: {
      title: "Data Verification",
      requiresAuth: true,
      roles: ["SYSTEM_ADMIN"],
      description: "Verify and validate EUDR compliance data",
      icon: "mdi-database-check",
    },
  },
  {
    path: "/",
    name: "Landing",
    // beforeEnter: ifAuthenticated,
    component: Landing,
    meta: {
      title: "AgriBackup - company",
      metaDescription: "Farmers & Buyers Connection platform",
    },
  },
  {
    path: "/pickup-routes",
    name: "PickupRoutes",
    component: () => import("../views/PickupRoutes.vue"),
  },
  {
    path: "/home",
    name: "Home",
    // beforeEnter: ifAuthenticated,
    component: Home,
  },
  {
    path: "/signin",
    name: "SignIn",
    // for before enter, i would like for it to check the query mode and if mode is self it can redirect to dashboard
    beforeEnter: (_to, _from, next) => {
      // get the query mode
      const queryMode = _to.query.mode;
      if (!store.getters["auth/isAuthenticated"] || queryMode === "exporter") {
        next();
        return;
      }
      next("/dashboard");
    },
    // eslint-disable-next-line consistent-return
    component: () => import("../views/auth/SignIn.vue"),
  },
  {
    path: "/signup",
    name: "SignUp",
    beforeEnter: ifNotAuthenticated,
    component: () => import("../views/auth/SignUp.vue"),
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("../views/auth/ForgotPassword.vue"),
  },
  {
    path: "/produces/:farmerId",
    name: "Produces",
    component: () => import("../views/farm.vue"),
  },
  {
    path: "/add-produce",
    name: "AddFarmerProduce",
    component: () => import("../views/AddFarmerProduce.vue"),
  },
  {
    path: "/my-farm/:farmerId",
    name: "MyFarm",
    component: () => import("../views/farm.vue"),
  },
  {
    path: "/listings",
    name: "Listings",
    component: () => import("../views/Listings.vue"),
  },
  {
    path: "/requests",
    name: "Requests",
    component: () => import("../views/Requests.vue"),
  },
  {
    path: "/buyer-orders",
    name: "BuyerOrders",
    component: () => import("../views/buyers/BuyerOrders.vue"),
  },
  {
    path: "/farmer-orders",
    name: "FarmerOrders",
    component: () => import("../views/farmer/FarmerOrders.vue"),
  },
  {
    path: "/browse",
    name: "BrowseListings",
    component: () => import("../views/buyers/BrowseListings.vue"),
  },
  {
    path: "/my-farmers",
    name: "MyFarmers",
    component: () => import("../views/buyers/MyFarmers.vue"),
  },
  {
    path: "/pickup-planning",
    name: "PickupPlanning",
    component: () => import("../views/buyers/PickupPlanning.vue"),
  },
  {
    path: "/buyer-analytics",
    name: "BuyerAnalytics",
    component: () => import("../views/buyers/BuyerAnalytics.vue"),
  },
  {
    path: "/browse-requests",
    name: "BrowseRequests",
    component: () => import("../views/farmer/BrowseRequests.vue"),
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import("../views/admin/AdminLogin.vue"),
    meta: {
      title: "Admin Login",
      requiresAuth: false,
      public: true,
    },
  },
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: () => import("../components/layout/dashboard/AdminDashboard.vue"),
    meta: {
      title: "Admin Dashboard",
      requiresAuth: true,
      roles: ["ADMIN"],
      icon: "mdi-shield-account",
    },
  },
  {
    path: "/admin/licenses",
    name: "LicenseReview",
    component: () => import("../views/admin/LicenseReview.vue"),
    meta: {
      title: "License Review",
      requiresAuth: true,
      roles: ["ADMIN"],
      icon: "mdi-file-document-check",
    },
  },
  {
    path: "/admin/users-report",
    name: "UsersReport",
    component: () => import("../views/admin/UsersReport.vue"),
    meta: {
      title: "Users Report",
      requiresAuth: true,
      roles: ["ADMIN"],
      icon: "mdi-account-group",
    },
  },
  {
    path: "/admin/orders-report",
    name: "OrdersReport",
    component: () => import("../views/admin/OrdersReport.vue"),
    meta: {
      title: "Orders Report",
      requiresAuth: true,
      roles: ["ADMIN"],
      icon: "mdi-shopping",
    },
  },
  {
    path: "/zone-management",
    name: "ZoneManagement",
    component: () => import("../views/exporter/ZoneManagement.vue"),
  },
  {
    path: "/exporter/system-admins",
    name: "SystemAdminsManagement",
    component: () => import("../views/exporter/SystemAdminsManagement.vue"),
  },
  {
    path: "/exporter/zone-supervisors",
    name: "ZoneSupervisorsManagement",
    component: () => import("../views/exporter/ZoneSupervisorsManagement.vue"),
  },
  {
    path: "/exporter/farmers",
    name: "FarmersManagement",
    component: () => import("../views/exporter/FarmersManagement.vue"),
  },
  {
    path: "/exporter/pickup-schedules",
    name: "PickupSchedulesManagement",
    component: () => import("../views/exporter/PickupSchedulesManagement.vue"),
  },
  {
    path: "/exporter/system-analytics",
    name: "SystemAnalytics",
    component: () => import("../views/exporter/SystemAnalytics.vue"),
  },
  {
    path: "/exporter/zone-comments",
    name: "ZoneCommentsManagement",
    component: () => import("../views/exporter/ZoneCommentsManagement.vue"),
  },
  {
    path: "/exporter/profile",
    name: "ExporterProfile",
    component: () => import("../views/exporter/ExporterProfile.vue"),
  },
  {
    path: "/exporter/supply-chain",
    name: "SupplyChainManagement",
    component: () => import("../views/exporter/SupplyChainManagement.vue"),
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
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/auth/ResetPassoword.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    // beforeEnter: ifAuthenticated,
    component: () => import("../views/Dashboard.vue"),
  },
  {
    path: "/farm-ai",
    name: "FarmAI",
    component: () => import("../views/FarmAI.vue"),
  },
  {
    path: "/community",
    name: "Community",
    // beforeEnter: ifAuthenticated,
    component: () => import("../views/Community.vue"),
  },
  {
    path: "/farmer-report",
    name: "FarmerReports",
    component: () => import("../views/report/farmer_reports.vue"),
  },
  {
    path: "/buyer-report",
    name: "BuyerReport",
    component: () => import("../views/report/buyer_report.vue"),
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../views/Contact.vue"),
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
    path: "/index.html", // or '*' this is for PWA
    beforeEnter: (_to, _from, next) => {
      next("/");
    },
  },
  {
    path: "/error",
    name: "ServerError",
    component: () => import("../views/errors/Error50x.vue"),
  },
  {
    path: "/no-internet",
    name: "NoInternet",
    component: Connection,
  },
  {
    path: "/offline",
    name: "Offline",
    component: Offline,
    meta: { public: true },
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import("../views/errors/Error404.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: {
      title: "Settings",
      requiresAuth: true,
      description: "User settings and preferences",
      icon: "mdi-cog",
    },
  },
];

const router = new VueRouter({
  mode: "history",
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
