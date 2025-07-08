<template>
  <v-app>
    <!-- Navigation -->
    <v-app-bar app color="white" elevate-on-scroll>
      <v-container class="py-0">
        <v-row align="center">
          <v-col cols="6" sm="4" md="3">
            <v-btn text class="pa-0" @click="scrollTo('hero')">
              <v-avatar size="40" class="mr-2">
                <v-img src="@/assets/images/logo.png"></v-img>
              </v-avatar>
              <span class="text-h6 tw-font-weight-bold primary--text">AgriConnect</span>
            </v-btn>
          </v-col>

          <v-col cols="6" sm="8" md="9" class="tw-text-right">
<!--            <v-app-bar-nav-icon @click="drawer = !drawer" class="tw-hidden-md-and-up"></v-app-bar-nav-icon>-->
            <div class="tw-hidden-sm-and-down">
<!--              <v-btn text color="primary" @click="scrollTo('features')">Features</v-btn>-->
<!--              <v-btn text color="primary" @click="scrollTo('benefits')">Benefits</v-btn>-->
<!--              <v-btn text color="primary" @click="scrollTo('success')">Success Stories</v-btn>-->
              <v-btn rounded color="primary" class="ml-3" @click="getStarted">Go to Application</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary app right>
      <v-list nav dense>
        <v-list-item @click="scrollTo('hero')">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item @click="scrollTo('features')">
          <v-list-item-title>Features</v-list-item-title>
        </v-list-item>
        <v-list-item @click="scrollTo('benefits')">
          <v-list-item-title>Benefits</v-list-item-title>
        </v-list-item>
        <v-list-item @click="scrollTo('success')">
          <v-list-item-title>Success Stories</v-list-item-title>
        </v-list-item>
        <v-list-item @click="scrollTo('cta')">
          <v-list-item-title class="primary--text tw-font-weight-bold">Get Started</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Hero Section -->
    <section id="hero" class="hero-section">
      <v-container>
        <div class="tw-flex tw-flex-center tw-flex-col tw-justify-center tw-items-center">
          <h2 style="font-size: 72px; color: #1c8e1d">AGRI<span style="color: #1e1e8e">CONNECT</span></h2>
          <v-img
              src="@/assets/images/landing_page.jpg"
              style="border-radius: 40px;"
              max-height="500px"
          ></v-img>
        </div>
        <v-row align="center">
          <v-col cols="12" md="6" class="pr-md-10">
            <h1 class="text-h3 tw-text-md-h2 tw-font-weight-bold tw-mb-6">
              <span class="primary--text">Farmers</span> &
              <span class="secondary--text">Buyers</span>
              Connected
            </h1>

            <p class="tw-text-h6 tw-mb-8">
              A modern platform bridging the gap between agricultural producers and markets
            </p>

            <v-list dense class="transparent mb-8">
              <v-list-item v-for="(item, i) in heroPoints" :key="i">
                <v-list-item-icon>
                  <v-icon color="success">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-body-1">{{ item }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon class="gradient-icon">mdi-leaf</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-body-1"><span class="">FarmAI</span> - AI insights on crop growth and livestock rearing</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <div class="d-flex flex-wrap">
              <v-btn x-large color="primary" class="mr-4 mb-4" @click="scrollTo('cta')">
                Get Started
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
              <v-btn x-large outlined color="primary" class="mb-4" @click="scrollTo('features')">
                Learn More
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="text-center">
            <v-img
                src="@/assets/images/farmer_buyer_greetings.png"
                class="d-inline-block farmer-img"
            ></v-img>
<!--            <v-img-->
<!--                src="https://cdn-icons-png.flaticon.com/512/4149/4149685.png"-->
<!--                max-width="300"-->
<!--                class="d-inline-block buyer-img ml-n8"-->
<!--            ></v-img>-->

            <div class="chat-bubble pa-4 rounded-xl secondary lighten-5">
              <v-icon color="secondary" class="mr-2">mdi-chat</v-icon>
              <span class="font-weight-medium">Hello! Let's do business</span>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <div class="hero-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-12">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-10">
            <h2 class="text-h3 tw-font-weight-bold mb-4">Our Platform Features</h2>
            <p class="text-h6 tw-font-weight-regular mx-auto" style="max-width: 600px">
              Designed to empower both farmers and buyers with modern tools
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-card hover class="feature-card pa-6" color="primary lighten-5">
              <div class="d-flex align-center mb-4">
                <v-avatar size="60" color="primary" class="mr-4">
                  <v-icon dark size="32">mdi-sprout</v-icon>
                </v-avatar>
                <h3 class="text-h5 tw-font-weight-bold">For Farmers</h3>
              </div>

              <v-list dense class="transparent">
                <v-list-item v-for="(feature, i) in farmerFeatures" :key="i">
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-body-1">{{ feature }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-img
                  src="https://cdn-icons-png.flaticon.com/512/2920/2920333.png"
                  max-height="180"
                  contain
                  class="mt-4"
              ></v-img>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card hover class="feature-card pa-6" color="secondary lighten-5">
              <div class="d-flex align-center mb-4">
                <v-avatar size="60" color="secondary" class="mr-4">
                  <v-icon dark size="32">mdi-cart</v-icon>
                </v-avatar>
                <h3 class="text-h5 tw-font-weight-bold">For Buyers</h3>
              </div>

              <v-list dense class="transparent">
                <v-list-item v-for="(feature, i) in buyerFeatures" :key="i">
                  <v-list-item-icon>
                    <v-icon color="secondary">mdi-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-body-1">{{ feature }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-img
                  src="https://cdn-icons-png.flaticon.com/512/3737/3737721.png"
                  max-height="180"
                  contain
                  class="mt-4"
              ></v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Benefits Section -->
    <section id="benefits" class="py-12 primary lighten-5">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-10">
            <h2 class="text-h3 tw-font-weight-bold mb-4">Key Benefits</h2>
            <p class="text-h6 tw-font-weight-regular mx-auto" style="max-width: 600px">
              Why our platform is transforming agricultural commerce
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(benefit, i) in benefits" :key="i" cols="12" md="4">
            <v-hover v-slot="{ hover }">
              <v-card
                  :elevation="hover ? 12 : 4"
                  class="pa-6 tw-text-center benefit-card"
                  :color="benefit.color"
                  dark
              >
                <v-avatar v-if="benefit.class != null" size="80" :color="benefit.iconColor" class="mb-4">
                  <v-icon :class="benefit.class" size="40">{{ benefit.icon }}</v-icon>
                </v-avatar>
                <v-avatar v-else size="80" :color="benefit.iconColor" class="mb-4">
                  <v-icon size="40">{{ benefit.icon }}</v-icon>
                </v-avatar>
                <h3 class="text-h5 tw-font-weight-bold mb-3">{{ benefit.title }}</h3>
                <p class="text-body-1">{{ benefit.text }}</p>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Success Stories -->
    <section id="success" class="py-12">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-10">
            <h2 class="text-h3 tw-font-weight-bold mb-4">Success Stories</h2>
            <p class="text-h6 tw-font-weight-regular mx-auto" style="max-width: 600px">
              Real farmers and buyers achieving real results with our platform
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(story, i) in successStories" :key="i" cols="12" md="4">
            <v-card hover class="h-100">
              <v-img
                  :src="story.image"
                  height="200"
                  class="align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              >
                <v-card-title class="white--text">{{ story.title }}</v-card-title>
              </v-img>

              <v-card-text>
                <p class="text-body-1 mb-4">{{ story.description }}</p>

                <div class="d-flex align-center">
                  <v-icon color="success" class="mr-2">mdi-trending-up</v-icon>
                  <span class="font-weight-bold">{{ story.result }}</span>
                </div>
              </v-card-text>

              <v-card-actions>
<!--                <v-btn text color="primary">Read Full Story</v-btn>-->
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section id="cta" class="py-12 secondary darken-1 white--text">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="8" class="text-center tw-text-md-left">
            <h2 class="text-h3 tw-font-weight-bold mb-4">Ready to transform your agricultural business?</h2>
            <p class="text-h6 tw-font-weight-regular">
              Join thousands of farmers and buyers already benefiting from our platform
            </p>
          </v-col>

          <v-col cols="12" md="4" class="text-center">
            <v-btn
                x-large
                color="white"
                class="primary--text tw-font-weight-bold"
                @click="getStarted"
            >
              Get Started Now
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Footer -->
    <v-footer color="primary darken-2" dark class="pt-10">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="mb-6 mb-md-0">
            <div class="d-flex align-center mb-4">
              <v-avatar size="40" class="mr-2">
                <v-img src="https://cdn-icons-png.flaticon.com/512/3079/3079158.png"></v-img>
              </v-avatar>
              <span class="text-h6 tw-font-weight-bold">AgriConnect</span>
            </div>
            <p class="text-body-1">
              Connecting farmers and buyers for sustainable agricultural commerce
            </p>

            <div class="mt-4">
              <v-btn
                  v-for="(social, i) in socialLinks"
                  :key="i"
                  icon
                  :color="social.color"
                  class="mr-2"
                  :href="social.link"
                  target="_blank"
              >
                <v-icon>{{ social.icon }}</v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col cols="6" md="2">
            <h4 class="text-h6 tw-font-weight-bold mb-4">Quick Links</h4>
            <v-list dense nav class="transparent">
              <v-list-item
                  v-for="(link, i) in quickLinks"
                  :key="i"
                  @click="scrollTo(link.target)"
              >
                <v-list-item-title>{{ link.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="6" md="2">
            <h4 class="text-h6 tw-font-weight-bold mb-4">Company</h4>
            <v-list dense nav class="transparent">
              <v-list-item
                  v-for="(link, i) in companyLinks"
                  :key="i"
                  @click="scrollTo(link.target)"
              >
                <v-list-item-title>{{ link.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="4">
            <h4 class="text-h6 tw-font-weight-bold mb-4">Newsletter</h4>
            <p class="text-body-1 mb-4">
              Subscribe to get updates on new features and agricultural insights
            </p>

            <v-form @submit.prevent="subscribe">
              <v-text-field
                  v-model="email"
                  label="Your Email"
                  outlined
                  dense
                  type="email"
                  required
                  background-color="white"
                  color="white"
                  class="mb-2"
              ></v-text-field>
              <v-btn
                  color="secondary"
                  block
                  @click="getStarted"
                  type=""
              >
                Subscribe
              </v-btn>
            </v-form>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <div class="text-center tw-text-body-2">
          &copy; {{ new Date().getFullYear() }} AgriConnect. All rights reserved.
        </div>
      </v-container>
    </v-footer>

    <!-- Signup Dialog -->
    <v-dialog v-model="showSignup" max-width="500">
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Get Started
          <v-spacer></v-spacer>
          <v-btn icon @click="showSignup = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-tabs v-model="tab" grow>
            <v-tab>Farmer</v-tab>
            <v-tab>Buyer</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab" class="mt-4">
            <v-tab-item>
              <v-form>
                <v-text-field label="Full Name" outlined dense class="mb-4"></v-text-field>
                <v-text-field label="Email" outlined dense type="email" class="mb-4"></v-text-field>
                <v-text-field label="Farm Location" outlined dense class="mb-4"></v-text-field>
                <v-text-field label="Password" outlined dense type="password" class="mb-4"></v-text-field>
                <v-btn color="primary" block large>Register as Farmer</v-btn>
              </v-form>
            </v-tab-item>

            <v-tab-item>
              <v-form>
                <v-text-field label="Full Name" outlined dense class="mb-4"></v-text-field>
                <v-text-field label="Email" outlined dense type="email" class="mb-4"></v-text-field>
                <v-text-field label="Business Name" outlined dense class="mb-4"></v-text-field>
                <v-text-field label="Password" outlined dense type="password" class="mb-4"></v-text-field>
                <v-btn color="secondary" block large>Register as Buyer</v-btn>
              </v-form>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      email: '',
      showSignup: false,
      tab: 0,
      heroPoints: [
        'No need for farmers to create another website',
        'Eliminate unsold produce with direct connections',
        'Network with nearby farmers and buyers',
        'Comprehensive sales tracking and reporting',
      ],
      farmerFeatures: [
        'Map visibility for your farm location',
        'Sell produce directly to verified buyers',
        'Real-time market price analytics',
        'Connect to global markets',
        'Inventory management tools',
        'Sales reporting dashboard',
      ],
      buyerFeatures: [
        'Find nearby farmers on interactive map',
        'Post requests for specific produce',
        'View farmer profiles and ratings',
        'Bulk ordering capabilities',
        'Quality assurance tracking',
        'Direct messaging with farmers',
      ],
      benefits: [
        {
          title: 'Reduced Waste',
          text: 'Farmers sell produce before it perishes, reducing food waste by up to 80%',
          icon: 'mdi-food-apple',
          iconColor: 'success',
          color: 'primary',
        },
        {
          title: 'Increased Profits',
          text: 'Eliminate middlemen to get better prices for farmers and better deals for buyers',
          icon: 'mdi-cash-multiple',
          iconColor: 'amber',
          color: '#6d7e91',
        },
        {
          title: 'Real-time Data',
          text: 'Comprehensive analytics help farmers optimize production and buyers plan purchases',
          icon: 'mdi-chart-line',
          iconColor: 'info',
          color: 'accent',
        },
        {
          title: 'Farm AI',
          text: 'AI analytics for crop growth and livestock rearing',
          icon: 'mdi-leaf',
          iconColor: '#fff',
          color: 'brown',
          class: 'gradient-icon',
        },
      ],
      successStories: [
        // {
        //   title: 'Organic Tomato Farm',
        //   image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        //   description: 'Increased sales by 120% in first 3 months by connecting directly with local restaurants.',
        //   result: '+120% Sales Increase',
        // },
        // {
        //   title: 'Dairy Cooperative',
        //   image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        //   description: 'Reduced unsold milk by 85% by connecting with local buyers in real-time.',
        //   result: '85% Less Waste',
        // },
        // {
        //   title: 'Local Grocery Chain',
        //   image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        //   description: 'Saved 30% on produce costs by sourcing directly from nearby farms.',
        //   result: '30% Cost Savings',
        // },
      ],
      socialLinks: [
        { icon: 'mdi-facebook', color: 'indigo', link: '#' },
        { icon: 'mdi-twitter', color: 'light-blue', link: '#' },
        { icon: 'mdi-linkedin', color: 'blue darken-3', link: '#' },
        { icon: 'mdi-instagram', color: 'pink', link: '#' },
      ],
      quickLinks: [
        { title: 'Home', target: 'hero' },
        { title: 'Features', target: 'features' },
        { title: 'Benefits', target: 'benefits' },
        { title: 'Success Stories', target: 'success' },
      ],
      companyLinks: [
        { title: 'About Us', target: '' },
        { title: 'Contact', target: '' },
        { title: 'Privacy Policy', target: '' },
        { title: 'Terms of Service', target: '' },
      ],
      meta: {
        title: 'Agriconnect - company',
        metaDescription: 'Farmers & Buyers Connection platform',
      },
    };
  },
  methods: {
    scrollTo(id) {
      this.drawer = false;
      document.getElementById(id).scrollIntoView({
        behavior: 'smooth',
      });
    },
    subscribe() {
      // Handle subscription logic
      this.showSignup = true;
      this.email = '';
    },
    getStarted() {
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style scoped>
/* Custom Styles */
.hero-section {
  background: linear-gradient(135deg, #f5fdf4 0%, #e8f5e9 100%);
  padding: 50px 0 40px;
  position: relative;
}

.hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
  color: #f5fdf4;
}

.hero-wave svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 80px;
}

.farmer-img {
  /* animation: float 6s ease-in-out infinite; */
}

.buyer-img {
  animation: float 6s ease-in-out infinite 1s;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.chat-bubble {
  position: absolute;
  bottom: 40px;
  right: 20px;
  max-width: 200px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.feature-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.benefit-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  height: 100%;
}

/* Vuetify overrides */
.v-application .primary {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
}

.v-application .primary--text {
  color: #2e7d32 !important;
  caret-color: #2e7d32 !important;
}

.v-application .secondary {
  background-color: #ff8f00 !important;
  border-color: #ff8f00 !important;
}

.v-application .secondary--text {
  color: #ff8f00 !important;
  caret-color: #ff8f00 !important;
}

.v-application .accent {
  background-color: #00acc1 !important;
  border-color: #00acc1 !important;
}

.gradient-icon {
  background: linear-gradient(45deg, #8d08e8, #05d30f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
