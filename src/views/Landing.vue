<template>
  <div class="tw-bg-gradient-to-br tw-from-[#f7f5ee] tw-to-[#e6f4ea] tw-min-h-screen tw-flex tw-flex-col tw-relative">
    <!-- Responsive Glassmorphism Navbar -->
    <nav class="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-z-50 tw-bg-[#f7f5ee] tw-bg-opacity-80 tw-backdrop-blur-lg tw-shadow-lg tw-border-b tw-border-[#e6e1c3]">
      <div class="tw-max-w-7xl tw-mx-auto tw-flex tw-items-center tw-justify-between tw-px-6 tw-py-3">
        <div class="tw-flex tw-items-center">
          <!-- Creative logo: AGRIBackUp with SVG leaf accent -->
          <span class="tw-font-extrabold tw-text-green-700 tw-text-3xl md:tw-text-4xl tw-tracking-tight tw-select-none tw-drop-shadow-sm tw-flex tw-items-center">
            AGRI
            <span class="tw-text-blue-700 tw-bg-gradient-to-r tw-from-blue-700 tw-to-green-900 tw-bg-clip-text tw-text-transparent tw-ml-1">
              Back
            </span>
            <span class="tw-text-yellow-500 tw-ml-1 tw-font-black tw-drop-shadow">Up</span>
          </span>
        </div>
        <div class="tw-flex tw-items-center tw-space-x-2">
          <router-link
            to="/signin"
            class="tw-hidden sm:tw-inline-block tw-text-green-700 tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-green-100 tw-transition"
            aria-label="Login"
          >
            Login
          </router-link>
          <router-link
            to="/home"
            class="tw-bg-green-600 hover:tw-bg-green-700 tw-text-white tw-font-semibold tw-px-6 tw-py-2 tw-rounded-lg tw-shadow tw-transition"
            aria-label="Get Started"
          >
            Get Started
          </router-link>
        </div>
      </div>
    </nav>
    <!-- Spacer for navbar height -->
    <div class="tw-h-24"></div>
    <!-- Cozy Curved SVG Line Background with agricultural colors -->
    <svg
      class="tw-absolute tw-left-0 tw-w-full tw-h-56 tw-z-0 tw-pointer-events-none"
      style="top: 90px; min-width:100vw;"
      viewBox="0 0 1440 224"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0,112 Q720,224 1440,112"
        stroke="#b6a16b"
        stroke-width="12"
        fill="none"
        opacity="0.18"
      />
      <ellipse cx="200" cy="60" rx="120" ry="32" fill="#e6e1c3" opacity="0.18"/>
      <ellipse cx="1240" cy="180" rx="80" ry="24" fill="#b6e4a3" opacity="0.18"/>
    </svg>

    <!-- Above the Fold -->
    <section class="tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-between tw-px-10 tw-pt-20 tw-pb-12 tw-max-w-6xl tw-mx-auto">
      <div class="tw-flex-1 tw-mb-12 md:tw-mb-0">
        <h1 class="tw-text-4xl md:tw-text-6xl tw-font-bold tw-text-[#3d5a2a] tw-mb-6 tw-drop-shadow">
          Connect Directly to Buyers and Boost Your Farm’s Profits
        </h1>
        <p class="tw-text-xl tw-text-[#6b4f2c] tw-mb-8 tw-drop-shadow-sm">
          AgriBackup links Kenyan farmers to global markets with fair prices and AI insights.
        </p>
        <div class="tw-flex tw-gap-6 tw-mb-6">
          <button
            @click="goHome"
            class="tw-bg-green-900 hover:tw-bg-[#5e9442] tw-text-white tw-font-semibold tw-py-4 tw-px-10 tw-rounded-xl tw-shadow-lg tw-border tw-border-[#e6e1c3] tw-transition tw-text-xl"
            aria-label="Join Now"
          >
            Join Now
          </button>
          <button
            @click="showDialog = true"
            class="tw-bg-[#f7e9b0] hover:tw-bg-[#f3d97c] tw-text-[#6b4f2c] tw-font-semibold tw-py-4 tw-px-10 tw-rounded-xl tw-shadow-lg tw-border tw-border-[#e6e1c3] tw-transition tw-text-xl"
            aria-label="Learn How It Works"
          >
            Learn How It Works
          </button>
        </div>
      </div>
      <div class="tw-flex-1 tw-flex tw-justify-center">
        <img
          src="@/assets/images/happy-farmer.jpg"
          alt="Smiling farmer using AgriBackup app"
          class="tw-rounded-2xl tw-shadow-2xl tw-w-96 tw-h-96 tw-object-cover tw-bg-[#f7f5ee] tw-border-4 tw-border-[#e6e1c3]"
        />
      </div>
    </section>

    <!-- For Farmers -->
      <section class="tw-bg-[#f7f5ee] tw-py-12 tw-px-10 tw-max-w-6xl tw-mx-auto tw-rounded-2xl tw-shadow-lg tw-mb-12 tw-flex tw-flex-col md:tw-flex-row tw-items-start tw-border-2 tw-border-[#b6a16b] tw-w-2/3">
        <div class="tw-flex-1 tw-mb-8 md:tw-mb-0">
          <h2 class="tw-text-3xl tw-font-semibold tw-text-[#3d5a2a] tw-mb-4">For Farmers</h2>
          <ul class="tw-list-disc tw-list-inside tw-text-lg tw-text-[#6b4f2c] tw-mb-6">
            <li>Sell directly, earn more</li>
            <li>Get AI-powered farming tips</li>
            <li>Access real-time market prices</li>
          </ul>
          <button
            @click="joinAsFarmer"
            class="tw-bg-green-800 hover:tw-bg-[#5e9442] tw-text-white tw-font-semibold tw-py-3 tw-px-8 tw-rounded-xl tw-shadow tw-border tw-border-[#e6e1c3] tw-transition tw-text-lg"
            aria-label="Join as a Farmer"
          >
            Join as a Farmer
          </button>
        </div>
        <div class="tw-flex-1 tw-flex tw-justify-center">
          <img
            src="@/assets/images/farmer-phone.jpg"
            alt="Farmer checking prices on phone"
            class="tw-rounded-2xl tw-shadow-lg tw-w-72 tw-h-72 tw-object-cover tw-bg-[#f7f5ee] tw-border-4 tw-border-[#e6e1c3]"
          />
        </div>
      </section>

    <!-- For Buyers -->
    <section class="tw-bg-[#f7f5ee] tw-py-12 tw-px-10 tw-max-w-6xl tw-mx-auto tw-rounded-2xl tw-shadow-lg tw-mb-12 tw-flex tw-flex-col md:tw-flex-row-reverse tw-items-center">
      <div class="tw-flex-1 tw-mb-8 md:tw-mb-0">
        <h2 class="tw-text-3xl tw-font-semibold tw-text-[#2a4f6b] tw-mb-4">For Buyers</h2>
        <ul class="tw-list-disc tw-list-inside tw-text-lg tw-text-[#6b4f2c] tw-mb-6">
          <li>Source fresh produce from verified farmers</li>
          <li>Transparent pricing, direct transactions</li>
        </ul>
        <button
          @click="joinAsBuyer"
          class="tw-bg-blue-800 hover:tw-bg-[#7bb661] tw-text-white tw-font-semibold tw-py-3 tw-px-8 tw-rounded-xl tw-shadow tw-border tw-border-[#e6e1c3] tw-transition tw-text-lg tw-mb-2"
          aria-label="Join as a Buyer"
        >
          Join as a Buyer
        </button>
      </div>
      <div class="tw-flex-1 tw-flex tw-justify-center tw-px-3">
        <img
          src="@/assets/images/buyer-inspect.jpg"
          alt="Buyer inspecting produce"
          class="tw-rounded-2xl tw-shadow-lg tw-w-72 tw-h-72 tw-object-cover tw-bg-[#f7f5ee] tw-border-4 tw-border-[#e6e1c3]"
        />
      </div>
    </section>

    <!-- For Exporters -->
    <div class="tw-w-full tw-flex tw-justify-start tw-items-start">
      <section class="tw-bg-[#f7f5ee] tw-py-12 tw-px-10 tw-max-w-6xl tw-mx-auto tw-rounded-2xl tw-shadow-lg tw-mb-12 tw-flex tw-flex-col md:tw-flex-row-reverse tw-items-center">
        <div class="tw-flex-1 tw-mb-8 md:tw-mb-0">
          <h2 class="tw-text-3xl tw-font-semibold tw-text-[#b6a16b] tw-mb-4">For Exporters</h2>
          <ul class="tw-list-disc tw-list-inside tw-text-lg tw-text-[#6b4f2c] tw-mb-6">
            <li>Source fresh produce from verified farmers</li>
            <li>Transparent pricing, direct transactions</li>
          </ul>
          <button
            @click="becomeExporter"
            class="tw-bg-black hover:tw-bg-black tw-text-white tw-font-semibold tw-py-3 tw-px-8 tw-rounded-xl tw-shadow tw-border tw-border-[#e6e1c3] tw-transition tw-text-lg"
            aria-label="Become a Certified Exporter"
          >
            Become a Certified Exporter
          </button>
        </div>
        <div class="tw-flex-1 tw-flex tw-justify-center tw-px-3">
          <img
            src="@/assets/images/exporter.jpg"
            alt="Buyer inspecting produce"
            class="tw-rounded-2xl tw-shadow-lg tw-w-72 tw-h-72 tw-object-cover tw-bg-[#f7f5ee] tw-border-4 tw-border-[#e6e1c3]"
          />
        </div>
      </section>
    </div>

    <!-- Digital Inclusion / USSD -->
    <section v-if="false" class="tw-bg-white tw-py-10 tw-px-6 tw-max-w-6xl tw-mx-auto tw-rounded-xl tw-shadow-md tw-mb-8 tw-flex tw-flex-col md:tw-flex-row tw-items-center">
      <div class="tw-flex-1 tw-mb-6 md:tw-mb-0">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-yellow-700 tw-mb-2">Digital Inclusion</h2>
        <ul class="tw-list-disc tw-list-inside tw-text-gray-700 tw-mb-4">
          <li>No smartphone? Use USSD to connect</li>
          <li>Text <span class="tw-font-bold tw-text-green-700">*123#</span> to start selling</li>
          <li>Inclusive for all Kenyan farmers</li>
        </ul>
        <router-link
          to="/ussd"
          class="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-text-white tw-font-semibold tw-py-2 tw-px-5 tw-rounded-lg tw-shadow tw-transition"
          aria-label="Explore USSD Access"
        >
          Explore USSD Access
        </router-link>
      </div>
      <!-- <div class="tw-flex-1 tw-flex tw-justify-center">
        <img
          src="@/assets/images/farmer-ussd.jpg"
          alt="Farmer texting on basic phone"
          class="tw-rounded-xl tw-shadow-md tw-w-64 tw-h-64 tw-object-cover tw-bg-gray-100"
        />
      </div> -->
    </section>

    <!-- Map Preview & AI Mention -->
    <section class="tw-max-w-6xl tw-mx-auto tw-px-6 tw-py-8 tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-gap-8">
      <div class="tw-flex-1 tw-flex tw-flex-col tw-items-start">
        <h3 class="tw-text-xl tw-font-semibold tw-text-green-700 tw-mb-2">See Connections Near You</h3>
        <p class="tw-text-gray-700 tw-mb-4">AgriBackup’s map shows buyers and farmers nearby for fast, local deals.</p>
        <img
          src="@/assets/images/map-preview.jpg"
          alt="AgriBackup geolocation map preview"
          class="tw-rounded-xl tw-shadow-md tw-w-full tw-max-w-md tw-bg-gray-100"
        />
      </div>
      <div class="tw-flex-1 tw-flex tw-flex-col tw-items-start">
        <h3 class="tw-text-xl tw-font-semibold tw-text-blue-700 tw-mb-2">AI-Powered Farming</h3>
        <p class="tw-text-gray-700 tw-mb-4">Get personalized crop advice and market insights. <router-link to="/ai" class="tw-text-blue-600 hover:tw-underline">Read More</router-link></p>
        <img
          src="@/assets/images/ai-advice.jpg"
          alt="AI-powered farming tips"
          class="tw-rounded-xl tw-shadow-md tw-w-full tw-max-w-md tw-bg-gray-100"
        />
      </div>
    </section>

    <!-- Testimonials & Partners -->
    <section v-if="false" class="tw-bg-gray-50 tw-py-10 tw-px-6 tw-max-w-6xl tw-mx-auto tw-rounded-xl tw-shadow-md tw-mb-8">
      <h2 class="tw-text-2xl tw-font-semibold tw-text-green-700 tw-mb-6">What Our Users Say</h2>
      <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-8">
        <div class="tw-bg-white tw-rounded-lg tw-shadow tw-p-6 tw-flex-1">
          <p class="tw-text-gray-800 tw-italic">“AgriBackup helped me double my profits in 3 months!”</p>
          <span class="tw-block tw-mt-2 tw-font-semibold tw-text-green-700">– Mary, Smallholder Farmer</span>
        </div>
        <div class="tw-bg-white tw-rounded-lg tw-shadow tw-p-6 tw-flex-1">
          <p class="tw-text-gray-800 tw-italic">“I source fresh produce directly, saving time and money.”</p>
          <span class="tw-block tw-mt-2 tw-font-semibold tw-text-blue-700">– John, Buyer</span>
        </div>
      </div>
      <div class="tw-flex tw-items-center tw-justify-center tw-mt-8 tw-gap-6">
        <!-- <img src="@/assets/images/partner-logo1.png" alt="Partner Logo 1" class="tw-h-10 tw-object-contain" />
        <img src="@/assets/images/partner-logo2.png" alt="Partner Logo 2" class="tw-h-10 tw-object-contain" />
        <img src="@/assets/images/partner-logo3.png" alt="Partner Logo 3" class="tw-h-10 tw-object-contain" /> -->
      </div>
    </section>

    <!-- Final CTA & Footer -->
    <footer class="tw-bg-green-700 tw-text-white tw-py-8 tw-px-6 tw-mt-auto">
      <div class="tw-max-w-6xl tw-mx-auto tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-between">
        <div class="tw-mb-4 md:tw-mb-0">
          <h2 class="tw-text-xl tw-font-semibold">Ready to transform your farm?</h2>
        </div>
        <router-link
          to="/signup"
          class="tw-bg-white tw-text-green-700 tw-font-semibold tw-py-3 tw-px-6 tw-rounded-lg tw-shadow tw-transition hover:tw-bg-green-100"
          aria-label="Join AgriBackup Now"
        >
          Join Now
        </router-link>
      </div>
      <div class="tw-mt-6 tw-text-center tw-text-sm tw-opacity-80">
        &copy; 2024 AgriBackup. All rights reserved. | <router-link to="/contact" class="tw-underline tw-text-white">Contact Us</router-link>
      </div>
    </footer>

    <!-- Learn How It Works Dialog -->
    <div v-if="showDialog" class="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-40">
      <div class="tw-bg-white tw-rounded-xl tw-shadow-xl tw-p-8 tw-max-w-lg tw-w-full tw-relative">
        <button @click="showDialog = false" class="tw-absolute tw-top-3 tw-right-3 tw-text-gray-400 hover:tw-text-gray-700 tw-text-xl" aria-label="Close">&times;</button>
        <h2 class="tw-text-2xl tw-font-bold tw-text-green-700 tw-mb-4">How AgriBackup Works</h2>
        <ul class="tw-list-disc tw-list-inside tw-text-gray-700 tw-mb-4">
          <li><span class="tw-font-semibold">For Farmers:</span> Sell directly, earn more, get AI-powered tips, access real-time prices.</li>
          <li><span class="tw-font-semibold">For Buyers:</span> Source fresh produce, transparent pricing, direct transactions.</li>
          <li><span class="tw-font-semibold">For Exporters:</span> Access certified produce, connect with trusted farmers, easy onboarding.</li>
        </ul>
        <div class="tw-flex tw-justify-end">
          <button @click="showDialog = false" class="tw-bg-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-semibold hover:tw-bg-green-700 tw-transition">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  data() {
    return {
      showDialog: false,
    };
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' });
    },
    joinAsBuyer() {
      // eslint-disable-next-line sonarjs/no-duplicate-string
      this.$store.dispatch('auth/setViewRole', 'buyer');
      this.$router.push({ path: '/browse-listings' });
    },
    becomeExporter() {
      this.$store.dispatch('auth/setViewRole', 'exporter');
      this.$router.push({ name: 'SignIn' });
    },
    joinAsFarmer() {
      this.$store.dispatch('auth/setViewRole', 'farmer');
      this.$router.push({ name: 'Listings' });
    },
  },
};
</script>

<style scoped>
/* Glassmorphism effect for navbar */
nav {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
}
/* No extra styles needed; Tailwind handles layout and responsiveness */
</style>
