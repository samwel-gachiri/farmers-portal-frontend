<template>
  <div class="farmer-dashboard tw-min-h-screen tw-bg-gray-50 tw-p-4 md:tw-p-6 tw-pb-24 font-sans">

    <!-- Top Header / Greeting -->
    <div class="tw-flex tw-justify-between tw-items-end tw-mb-8">
      <div>
        <h1 class="tw-text-3xl tw-font-bold tw-text-gray-900 tw-tracking-tight">
          {{ timeGreeting }}, {{ userName }}
        </h1>
        <p class="tw-text-gray-500 tw-mt-1">
          Here is your farm's daily intelligence report.
        </p>
      </div>
      <div class="tw-hidden md:tw-block">
        <span class="tw-text-sm tw-font-medium tw-text-gray-500">{{ currentDate }}</span>
      </div>
    </div>

    <!-- Row 1: High Priority (Compliance & Weather) -->
    <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-8 tw-mb-8">

      <!-- Compliance Summary (Stair-step Progress) -->
      <div class="lg:tw-col-span-2 tw-bg-[#0A2F1F] tw-text-white tw-rounded-3xl tw-p-8 tw-shadow-xl tw-relative tw-overflow-hidden">
        <!-- Background decoration -->
        <div class="tw-absolute tw-right-0 tw-top-0 tw-h-full tw-w-1/2 tw-bg-white tw-opacity-[0.03] tw-skew-x-12 tw-transform tw-origin-bottom-left"></div>

        <div class="tw-relative tw-z-10">
          <div class="tw-flex tw-justify-between tw-items-start tw-mb-6">
            <div>
              <h2 class="tw-text-lg tw-font-medium tw-text-green-900 tw-mb-1">EUDR Compliance Journey</h2>

              <!-- Stair-step Progress Header -->
              <div class="tw-flex tw-items-baseline tw-gap-2">
                 <span class="tw-text-3xl tw-font-bold tw-tracking-tight">Step {{ currentStep }} of 4</span>
                 <span class="tw-text-xl tw-text-green-900">: {{ currentStepName }}</span>
              </div>
            </div>

            <div class="tw-bg-white/10 tw-p-3 tw-rounded-xl tw-backdrop-blur-sm">
              <i class="mdi mdi-shield-check tw-text-3xl tw-text-green-900"></i>
            </div>
          </div>

          <!-- Progress Stepper UI -->
          <div class="tw-flex tw-gap-2 tw-h-2 tw-mb-6 tw-w-full">
             <div class="tw-flex-1 tw-rounded-full tw-transition-all tw-duration-500" :class="currentStep >= 1 ? 'tw-bg-green-400' : 'tw-bg-white/10'"></div>
             <div class="tw-flex-1 tw-rounded-full tw-transition-all tw-duration-500" :class="currentStep >= 2 ? 'tw-bg-green-400' : 'tw-bg-white/10'"></div>
             <div class="tw-flex-1 tw-rounded-full tw-transition-all tw-duration-500" :class="currentStep >= 3 ? 'tw-bg-green-400' : 'tw-bg-white/10'"></div>
             <div class="tw-flex-1 tw-rounded-full tw-transition-all tw-duration-500" :class="currentStep >= 4 ? 'tw-bg-green-400' : 'tw-bg-white/10'"></div>
          </div>

          <!-- Educational Pro-Tip (Replaces empty space) -->
          <div v-if="currentStep < 3 && !eudrStatus.isPending" class="tw-bg-black/20 tw-p-4 tw-rounded-xl tw-backdrop-blur-md tw-mb-6 tw-border tw-border-white/10 tw-shadow-inner">
             <div class="tw-flex tw-gap-3 tw-items-start">
                 <div class="tw-bg-yellow-400 tw-p-1.5 tw-rounded-lg tw-mt-0.5 tw-shadow-sm">
                    <i class="mdi mdi-lightbulb-on tw-text-[#0A2F1F] tw-text-sm"></i>
                 </div>
                 <p class="tw-text-sm tw-text-white tw-font-medium tw-italic tw-leading-relaxed tw-opacity-95">
                   "Pro-tip: Adding your farm polygon takes less than 2 minutes and unlocks EU markets. Buyers pay a premium for verified land."
                 </p>
             </div>
          </div>

          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-items-end">
            <div class="tw-flex tw-flex-col">
              <span class="tw-text-2xl tw-font-bold">{{ eudrStatus.verifiedUnits }}/{{ eudrStatus.totalUnits }}</span>
              <span class="tw-text-sm tw-text-green-900">Units Verified</span>
            </div>
            <div class="tw-flex tw-flex-col">
              <span class="tw-text-2xl tw-font-bold" :class="eudrStatus.actionRequired > 0 ? 'tw-text-orange-300' : 'tw-text-green-900'">
                  {{ eudrStatus.actionRequired }}
              </span>
              <span class="tw-text-sm tw-text-green-900">Actions Pending</span>
            </div>
            <div class="tw-flex tw-items-center md:tw-justify-end">
              <button
                @click="handlePrimaryAction"
                class="tw-bg-green-400 tw-text-[#0A2F1F] tw-px-6 tw-py-3 tw-rounded-xl tw-font-bold tw-text-sm hover:tw-bg-white tw-transition-colors tw-w-full md:tw-w-auto tw-shadow-lg tw-transform hover:tw-scale-[1.02] active:tw-scale-[0.98]"
              >
                {{ eudrStatus.btnLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actionable Weather (Forecast-Based Advice) -->
      <div class="tw-bg-white tw-rounded-3xl tw-p-8 tw-shadow-lg tw-border tw-border-gray-100 tw-flex tw-flex-col tw-justify-between">
        <div>
          <h3 class="tw-text-gray-500 tw-text-sm tw-font-medium tw-uppercase tw-tracking-wider tw-mb-4">Live Forecast</h3>

          <!-- Loading State -->
          <div v-if="weather.loading" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-32">
             <v-progress-circular indeterminate color="green" size="32"></v-progress-circular>
             <span class="tw-text-xs tw-text-gray-400 tw-mt-2">Updating forecast...</span>
          </div>

          <!-- Error State with Retry -->
          <div v-else-if="isWeatherError" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-32 tw-text-center">
             <i class="mdi mdi-cloud-off-outline tw-text-gray-300 tw-text-4xl tw-mb-2"></i>
             <p class="tw-text-sm tw-text-gray-500 tw-mb-3">Weather service temporarily unavailable</p>
             <button @click="loadWeatherData" class="tw-text-blue-600 tw-text-xs tw-font-bold tw-uppercase tw-tracking-wide hover:tw-bg-blue-50 tw-px-4 tw-py-2 tw-rounded-lg tw-transition tw-border tw-border-blue-100">
                <i class="mdi mdi-refresh tw-mr-1"></i> Retry Connection
             </button>
          </div>

          <!-- Success State -->
          <div v-else class="tw-flex tw-items-center tw-justify-between tw-mb-6">
            <div>
              <div class="tw-text-4xl tw-font-bold tw-text-gray-900">{{ weather.temperature }}°C</div>
              <div class="tw-text-gray-500">{{ weather.condition }}</div>
            </div>
            <div class="tw-text-5xl tw-text-blue-500">
              <i :class="weather.icon"></i>
            </div>
          </div>
        </div>

        <div v-if="!weather.loading && !isWeatherError" class="tw-bg-blue-50 tw-rounded-2xl tw-p-4 tw-border-l-4 tw-border-blue-400">
          <div class="tw-flex tw-gap-3">
            <i class="mdi mdi-information tw-text-blue-500"></i>
            <p class="tw-text-sm tw-text-blue-900 tw-font-medium">
              {{ weather.advice }}
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- Row 2: Market & Operations -->
    <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-8">

      <!-- Market Trends (Actionable) -->
      <div class="tw-bg-white tw-rounded-3xl tw-p-8 tw-shadow-lg tw-border tw-border-gray-100 hover:tw-shadow-xl tw-transition-shadow">
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
          <h3 class="tw-text-gray-800 tw-font-bold tw-text-lg">Market Top Price</h3>
          <span class="tw-bg-green-100 tw-text-green-800 tw-text-xs tw-px-3 tw-py-1 tw-rounded-full tw-font-bold">Live</span>
        </div>

        <div class="tw-mb-4">
          <div class="tw-text-3xl tw-font-bold tw-text-gray-900">KSH {{ market.topPrice }}</div>
          <p class="tw-text-sm tw-text-gray-500">in {{ market.topLocation }} <span class="tw-text-green-600 tw-font-medium">(↑ {{ market.change }}%)</span></p>
        </div>

        <!-- Mini Chart/Trend Line -->
        <div class="tw-h-24 tw-w-full tw-bg-gray-50 tw-rounded-xl tw-overflow-hidden tw-relative tw-mb-4">
          <apexchart type="area" height="100%" :options="chartOptions" :series="chartSeries"></apexchart>
        </div>

        <button class="tw-w-full tw-py-3 tw-rounded-xl tw-border tw-border-gray-200 tw-text-gray-600 tw-font-semibold hover:tw-bg-gray-50 tw-transition">
          View All Prices
        </button>
      </div>

      <!-- Quick Actions (Primary CTA: Register Land) -->
      <div class="tw-bg-white tw-rounded-3xl tw-p-8 tw-shadow-lg tw-border tw-border-gray-100 hover:tw-shadow-xl tw-transition-shadow">
        <h3 class="tw-text-gray-800 tw-font-bold tw-text-lg tw-mb-6">Quick Actions</h3>

        <div class="tw-space-y-4">
          <!-- Primary Action -->
          <button
            @click="registerNewCrop"
            class="tw-w-full tw-flex tw-items-center tw-justify-between tw-bg-[#0A2F1F] tw-text-white tw-p-4 tw-rounded-2xl hover:tw-bg-[#0f422c] tw-transition tw-group"
          >
            <div class="tw-flex tw-items-center tw-gap-4">
              <div class="tw-bg-white/20 tw-p-2 tw-rounded-lg">
                <i class="mdi mdi-map-marker-plus tw-text-xl"></i>
              </div>
              <div class="tw-text-left">
                <div class="tw-font-bold">Register Land</div>
                <div class="tw-text-xs tw-text-green-900">Key for compliance</div>
              </div>
            </div>
            <i class="mdi mdi-arrow-right tw-transform group-hover:tw-translate-x-1 tw-transition"></i>
          </button>

          <!-- Secondary Actions -->
          <div class="tw-grid tw-grid-cols-2 tw-gap-4">
            <button class="tw-p-4 tw-rounded-2xl tw-bg-gray-50 tw-text-gray-700 tw-font-medium hover:tw-bg-gray-100 tw-transition tw-text-left">
              <i class="mdi mdi-sprout tw-text-green-600 tw-mb-2 tw-block tw-text-xl"></i>
              Log Harvest
            </button>
            <button class="tw-p-4 tw-rounded-2xl tw-bg-gray-50 tw-text-gray-700 tw-font-medium hover:tw-bg-gray-100 tw-transition tw-text-left">
              <i class="mdi mdi-truck-delivery tw-text-orange-600 tw-mb-2 tw-block tw-text-xl"></i>
              New Sale
            </button>
          </div>
        </div>
      </div>

      <!-- AI Insight / Activity -->
      <div class="tw-bg-gradient-to-br tw-from-gray-900 tw-to-gray-800 tw-text-white tw-rounded-3xl tw-p-8 tw-shadow-lg">
        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-6">
          <div class="tw-bg-green-500 tw-p-2 tw-rounded-lg">
            <i class="mdi mdi-robot tw-text-white"></i>
          </div>
          <h3 class="tw-font-bold">Agri-Insight</h3>
        </div>

        <p class="tw-text-lg tw-font-light tw-leading-relaxed tw-mb-6 tw-opacity-90">
          "{{ aiInsight }}"
        </p>

        <button
          @click="viewRecommendation"
          class="tw-text-green-900 tw-text-sm tw-font-bold hover:tw-text-green-900 tw-flex tw-items-center tw-gap-1"
        >
          VIEW ANALYSIS <i class="mdi mdi-arrow-right"></i>
        </button>
      </div>

    </div>

    <!-- Floating Agri-Copilot Button -->
    <v-btn
      fixed
      bottom
      right
      rounded
      color="#0A2F1F"
      dark
      x-large
      elevation="6"
      @click="openAgriCopilot"
      class="agri-copilot-fab tw-mb-4 tw-mr-4"
      style="z-index: 50; text-transform: none;"
    >
      <v-icon left>mdi-creation</v-icon>
      <span class="tw-font-bold">Ask Agri-Copilot</span>
    </v-btn>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import VueApexCharts from 'vue-apexcharts';
import { getCurrentUserId } from '@/utils/roles.js';
import dayjs from 'dayjs';

export default {
  name: 'FarmerDashboard',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      currentDate: dayjs().format('dddd, MMMM D, YYYY'),

      eudrStatus: {
        score: 0,
        verifiedUnits: 0,
        totalUnits: 0,
        actionRequired: 0,
        btnLabel: 'Complete Profile',
        status: 'Unverified',
        message: 'Action required',
        isPending: false, // Loading state
      },

      weather: {
        loading: false,
        temperature: '--',
        condition: 'Clear',
        advice: 'Loading forecast...',
        location: 'Nairobi',
        icon: 'mdi-weather-sunny',
      },

      market: {
        topPrice: '150',
        topLocation: 'Thika',
        change: '5',
      },

      recentActivities: [],
      aiInsight: 'Agri-AI is analyzing your farm data.',

      chartOptions: {
        chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 2, colors: ['#10B981'] },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.0 } },
        tooltip: {
          fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => 'KSH' } }, marker: { show: false },
        },
        colors: ['#10B981'],
      },
      chartSeries: [{ name: 'Price', data: [140, 142, 145, 144, 148, 150, 150] }],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    userName() {
      return this.user?.displayName?.split(' ')[0] || 'Farmer';
    },
    timeGreeting() {
      const hour = dayjs().hour();
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
    },
    // Stair-step Logic
    currentStep() {
      if (this.eudrStatus.score === 100) return 4;
      if (this.eudrStatus.verifiedUnits > 0) return 3;
      if (this.eudrStatus.totalUnits > 0) return 2;
      return 1;
    },
    currentStepName() {
      const steps = [
        'Account Created',
        'Land Registered',
        'Units Verified',
        'Export Ready',
      ];
      return steps[this.currentStep - 1] || 'Account Created';
    },
    isWeatherError() {
      // Robust check for any error state
      const c = (this.weather.condition || '').toLowerCase();
      return (
        c === 'offline'
        || c.includes('service unavailable')
        || c.includes('unavailable')
        || this.weather.temperature === '--'
      );
    },
  },
  async mounted() {
    await this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      await Promise.all([
        this.loadComplianceData(),
        this.loadWeatherData(),
        this.loadMarketData(),
        this.loadAIInsight(),
        this.loadRecentActivities(),
      ]);
    },

    async loadComplianceData() {
      this.eudrStatus.isPending = true;
      try {
        const farmerId = getCurrentUserId();
        const response = await axios.get(`/api/production-units/farmer/${farmerId}`);
        const units = response.data?.data || [];

        this.eudrStatus.totalUnits = units.length;

        const compliantUnits = units.filter((u) => u.wgs84Coordinates).length;
        this.eudrStatus.verifiedUnits = compliantUnits;
        this.eudrStatus.actionRequired = this.eudrStatus.totalUnits - compliantUnits;

        if (this.eudrStatus.totalUnits === 0) {
          this.eudrStatus.score = 0;
          this.eudrStatus.status = 'Start Here';
          this.eudrStatus.message = 'Register your first plot';
          this.eudrStatus.btnLabel = 'Register Land';
          this.eudrStatus.actionRequired = 1;
        } else {
          this.eudrStatus.score = Math.round((compliantUnits / this.eudrStatus.totalUnits) * 100);
          this.eudrStatus.status = this.eudrStatus.score === 100 ? 'Compliant' : 'Unverified';
          this.eudrStatus.message = this.eudrStatus.score === 100 ? 'Ready for export' : 'Action required';
          this.eudrStatus.btnLabel = this.eudrStatus.score === 100 ? 'Certified' : 'Fix Issues';
        }
      } catch (error) {
        // Robust fallback
        this.eudrStatus = {
          score: 0,
          verifiedUnits: 0,
          totalUnits: 0,
          actionRequired: 0,
          status: 'System Check',
          message: 'Status unavailable',
          btnLabel: 'Reload',
          isPending: false,
        };
      } finally {
        this.eudrStatus.isPending = false;
      }
    },

    async loadWeatherData() {
      this.weather.loading = true;
      // Reset condition slightly to trigger UI changes if needed, but mainly loading state
      try {
        // 1. Get location from units
        const farmerId = getCurrentUserId();
        const unitsResponse = await axios.get(`/api/production-units/farmer/${farmerId}`);
        const units = unitsResponse.data?.data || [];

        // Default to Nairobi if no units
        let lat = -1.2921;
        let lon = 36.8219;
        this.weather.location = 'Nairobi'; // Default

        if (units.length > 0) {
          // Try to find a valid coordinate
          const unit = units.find((u) => u.latitude && u.longitude) || units[0];
          if (unit.latitude && unit.longitude) {
            lat = unit.latitude;
            lon = unit.longitude;
          }
          this.weather.location = unit.administrativeRegion || unit.unitName || 'Farm Location';
        }

        // 2. Call real Weather API
        const weatherResponse = await axios.get(`/api/v1/weather?latitude=${lat}&longitude=${lon}`);

        if (weatherResponse.data?.current) {
          const current = weatherResponse.data.current;
          this.weather.temperature = Math.round(current.temperature);
          this.weather.condition = current.condition;
          // Use backend provided icon or fallback
          this.weather.icon = current.icon || this.getIconForCondition(current.condition);

          // Generate advice locally based on real condition
          this.weather.advice = this.generateWeatherAdvice(current.condition, current.temperature);
        }
      } catch (e) {
        this.weather.condition = 'Offline';
        this.weather.advice = 'Weather service unavailable.';
        this.weather.icon = 'mdi-weather-cloudy-alert';
      } finally {
        this.weather.loading = false;
      }
    },

    getIconForCondition(condition) {
      const c = condition.toLowerCase();
      if (c.includes('rain') || c.includes('drizzle')) return 'mdi-weather-rainy';
      if (c.includes('cloud')) return 'mdi-weather-cloudy';
      if (c.includes('clear') || c.includes('sun')) return 'mdi-weather-sunny';
      return 'mdi-weather-partly-cloudy';
    },

    generateWeatherAdvice(condition, temp) {
      const c = condition.toLowerCase();
      if (c.includes('rain') || c.includes('drizzle')) return 'Avoid spraying today. Rain expected.';
      if (temp > 28) return 'High temperatures. Ensure irritation if possible.';
      if (c.includes('clear') || c.includes('sun')) return 'Ideal conditions for field work and spraying.';
      return 'Monitor field conditions.';
    },

    async loadMarketData() {
      try {
        const response = await axios.get('/api/v1/market-prices/latest');

        if (response.data && response.data.prices && response.data.prices.length > 0) {
          const prices = response.data.prices;

          // Find highest priced commodity for the "Top Price" highlight
          // Or prioritize Coffee/Tea if available as they are key crops
          const coffee = prices.find((p) => p.produce.toLowerCase().includes('coffee'));
          const showPrice = coffee || prices[0];

          this.market = {
            topPrice: showPrice.pricePerKg,
            topLocation: showPrice.market || 'Global Market', // Backend defaults to 'Global' usually
            change: showPrice.changePercent || 0,
          };

          this.currentPrice = showPrice.pricePerKg;
          this.priceChange = showPrice.changePercent || 0;

          if (showPrice.history) {
            this.marketSeries = [{
              name: 'Price',
              data: showPrice.history.map((h) => h.price),
            }];
          }
        }
      } catch (error) {
        // Keep default safe values
      }
    },

    async loadRecentActivities() {
      try {
        const farmerId = getCurrentUserId();
        const response = await axios.get(`/farmers-service/api/farmers/${farmerId}/activities`);
        if (response.data && Array.isArray(response.data)) {
          this.recentActivities = response.data.map((activity) => ({
            user: activity.userName || this.userName,
            action: activity.description || activity.action || 'updated details',
            time: this.formatTimeAgo(activity.createdAt || new Date()),
          })).slice(0, 5);
        }
      } catch (e) {
        // Silent fail is acceptable for activity feed
      }
    },

    async loadAIInsight() {
      try {
        const farmerId = getCurrentUserId();
        // Try real AI insight endpoint
        const response = await axios.get(`/farmers-service/api/farmers/${farmerId}/insight`);
        if (response.data?.insight) {
          this.aiInsight = response.data.insight;
        } else {
          throw new Error('No insight returned');
        }
      } catch (e) {
        // Fallback: Generate local insight based on profile/crops
        this.generateLocalInsight();
      }
    },

    async generateLocalInsight() {
      try {
        const hasUnits = this.eudrStatus.totalUnits > 0;
        if (!hasUnits) {
          this.aiInsight = 'Register your first production unit to receive personalized crop insights.';
          return;
        }
        // Generic fallback
        this.aiInsight = 'Complete your profile to get more accurate yield predictions.';
      } catch {
        this.aiInsight = 'Agri-AI is analyzing your farm data.';
      }
    },

    formatTimeAgo(date) {
      return dayjs(date).fromNow();
    },

    handlePrimaryAction() {
      if (this.currentStep === 4) {
        // Go to certificate
        // this.$router.push({ name: 'CertificateViewer' });
      } else if (this.currentStep === 1) {
        // Register Land
        this.registerNewCrop();
      } else {
        // Fix issues
        this.goToPendingActions();
      }
    },

    goToPendingActions() {
      this.$router.push({ name: 'FarmerProductionUnits', query: { filter: 'pending' } });
    },

    registerNewCrop() {
      this.$router.push({ name: 'FarmerProductionUnits', query: { action: 'add' } });
    },

    viewRecommendation() {
      this.$router.push({ name: 'FarmAI' });
    },

    openAgriCopilot() {
      this.$router.push({ name: 'FarmAI' });
    },
  },
};
</script>

<style scoped>
/* Specific overrides if needed, but Tailwind handles most */
.farmer-dashboard {
  background-color: #F3F4F6; /* Ensure a nice grey background */
}
</style>
