<!-- eslint-disable sonarjs/no-duplicate-string -->
<template>
  <div class="landing-wrap tw-min-h-screen tw-flex tw-flex-col tw-relative">
    <!-- Animated gradient background + decorative blobs -->
    <div class="bg-gradient-layer"></div>
    <svg class="bg-blobs" viewBox="0 0 1200 800" aria-hidden="true">
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#d1fae5" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="g2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#bfdbfe" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#bfdbfe" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="g3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fde68a" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#fde68a" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle class="blob blob-a" cx="220" cy="140" r="220" fill="url(#g1)" />
      <circle class="blob blob-b" cx="980" cy="120" r="200" fill="url(#g2)" />
      <circle class="blob blob-c" cx="1000" cy="620" r="240" fill="url(#g3)" />
    </svg>
    <div class="noise-overlay" aria-hidden="true"></div>

    <!-- Glass Navbar -->
    <nav class="nav-glass tw-fixed tw-top-0 tw-left-0 tw-w-full tw-z-[60]">
      <div class="tw-max-w-7xl tw-mx-auto tw-flex tw-items-center tw-justify-between tw-px-6 tw-py-3">
        <div class="tw-flex tw-items-center tw-gap-2">
          <span class="brand-title tw-font-extrabold tw-text-2xl md:tw-text-3xl tw-tracking-tight tw-select-none tw-flex tw-items-baseline">
            AGRI<span class="brand-gradient">Back</span><span class="tw-text-yellow-500 tw-ml-0.5 tw-font-black">Up</span>
          </span>
        </div>
        <div class="tw-flex tw-items-center tw-gap-2">
          <button
            class="btn-ghost tw-hidden sm:tw-inline-flex"
            aria-label="Login"
            @click="handleLogin"
          >Login</button>
          <button
            class="btn-gradient tw-p-2"
            aria-label="Get Started"
            @click="handleSignup"
          >Get Started</button>
        </div>
      </div>
    </nav>
    <div class="tw-h-20"></div>

    <!-- Hero -->
    <section class="tw-relative tw-z-10 tw-max-w-7xl tw-mx-auto tw-w-full tw-px-6 tw-pt-10 md:tw-pt-14 tw-pb-6 md:tw-pb-10">
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-10 tw-items-center">
        <div>
          <h1 class="hero-title">
            Connect with Buyers. Grow Profits. Farm Smarter.
          </h1>
          <p class="hero-sub">
            AgriBackup links farmers to markets with transparent pricing, real-time demand, and AI insights—without middlemen.
          </p>
          <div class="tw-flex tw-flex-wrap tw-gap-3 tw-mt-6">
            <button @click="goHome" class="btn-gradient tw-px-6 tw-py-3">Join Now</button>
            <button @click="showDialog = true" class="btn-glass-outline tw-px-6 tw-py-3">How it works</button>
          </div>
          <div class="tw-flex tw-gap-4 tw-mt-6">
            <div class="stat-chip"><span class="tw-font-bold">{{ farmerCountDisplay }}</span> farmers</div>
            <div class="stat-chip"><span class="tw-font-bold">{{ buyerCountDisplay }}</span> buyers</div>
            <div class="stat-chip"><span class="tw-font-bold">AI</span> assisted</div>
          </div>
        </div>
        <div>
          <div class="hero-media">
            <img src="@/assets/images/happy-farmer.jpg" alt="Smiling farmer using AgriBackup app" />
            <div class="floating-tag tag-green"><span>Fair Prices</span></div>
            <div class="floating-tag tag-blue"><span>Direct Deals</span></div>
            <div class="floating-tag tag-gold"><span>Export Ready</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Audience features: Farmers / Buyers / Exporters -->
    <section class="tw-relative tw-z-10 tw-max-w-7xl tw-mx-auto tw-w-full tw-px-6 tw-pb-6 md:tw-pb-10">
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
        <div class="card-glass">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
            <h2 class="tw-text-xl tw-font-bold tw-text-gray-800">For Farmers</h2>
            <v-icon color="green">mdi-sprout</v-icon>
          </div>
          <ul class="tw-text-[14px] tw-text-gray-700 tw-space-y-2 tw-mt-2">
            <li>Sell directly, earn more</li>
            <li>AI-powered crop insights</li>
            <li>Live market prices</li>
          </ul>
          <button @click="joinAsFarmer" class="btn-ghost tw-mt-4">Join as Farmer</button>
        </div>
        <div class="card-glass">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
            <h2 class="tw-text-xl tw-font-bold tw-text-gray-800">For Buyers</h2>
            <v-icon color="blue">mdi-cart-outline</v-icon>
          </div>
          <ul class="tw-text-[14px] tw-text-gray-700 tw-space-y-2 tw-mt-2">
            <li>Verified farmers and traceability</li>
            <li>Transparent pricing, direct deals</li>
            <li>Bulk orders made simple</li>
            <li>Add and manage your farmers</li>
          </ul>
          <div class="tw-flex tw-gap-2 tw-mt-4">
            <button @click="joinAsBuyer" class="btn-ghost">Join as Buyer</button>
            <button @click="goManageFarmers" class="btn-glass-outline tw-px-3 tw-py-2">Manage Farmers</button>
          </div>
        </div>
        <div class="card-glass">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
            <h2 class="tw-text-xl tw-font-bold tw-text-gray-800">For Exporters</h2>
            <v-icon color="amber">mdi-earth-arrow-right</v-icon>
          </div>
          <ul class="tw-text-[14px] tw-text-gray-700 tw-space-y-2 tw-mt-2">
            <li>Register and manage farmer networks</li>
            <li>Quality control with QR codes</li>
            <li>Compliance-ready documentation</li>
          </ul>
          <button @click="becomeExporter" class="btn-ghost tw-mt-4">Become Exporter</button>
        </div>
      </div>
    </section>

    <!-- Innovation section: Map + AI panels -->
    <section class="tw-relative tw-z-10 tw-max-w-7xl tw-mx-auto tw-w-full tw-px-6 tw-pb-6 md:tw-pb-12">
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
        <div class="panel-glass">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
            <h3 class="tw-text-lg tw-font-bold tw-text-green-800">See Connections Near You</h3>
            <v-icon color="green">mdi-map-search</v-icon>
          </div>
          <p class="tw-text-[14px] tw-text-gray-700 tw-mb-3">Find buyers and farmers nearby for faster local deals.</p>
          <img
            src="@/assets/images/map-preview.jpg"
            alt="AgriBackup geolocation map preview"
            class="panel-image"
          />
        </div>
        <div class="panel-glass">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
            <h3 class="tw-text-lg tw-font-bold tw-text-blue-800">AI-Powered Farming</h3>
            <v-icon color="blue">mdi-robot-happy-outline</v-icon>
          </div>
          <p class="tw-text-[14px] tw-text-gray-700 tw-mb-3">Personalized crop advice and market insights.
            <router-link to="/ai" class="tw-text-blue-600 hover:tw-underline">Read more</router-link></p>
          <img
            src="@/assets/images/ai-advice.jpg"
            alt="AI-powered farming tips"
            class="panel-image"
          />
        </div>
      </div>
    </section>

    <!-- Steps: How it works -->
    <section class="tw-relative tw-z-10 tw-max-w-7xl tw-mx-auto tw-w-full tw-px-6 tw-pb-10">
      <h3 class="tw-text-center tw-text-2xl tw-font-extrabold tw-text-gray-800 tw-mb-6">How AgriBackup Works</h3>
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
        <div class="step-card">
          <div class="step-badge">1</div>
          <h4 class="tw-font-bold tw-text-gray-800 tw-mb-1">Sign up & set your role</h4>
          <p class="tw-text-[14px] tw-text-gray-600">Farmer, Buyer or Exporter—custom experience for each.</p>
        </div>
        <div class="step-card">
          <div class="step-badge">2</div>
          <h4 class="tw-font-bold tw-text-gray-800 tw-mb-1">Create or browse listings</h4>
          <p class="tw-text-[14px] tw-text-gray-600">High-quality listings with images, quantity and pricing.</p>
        </div>
        <div class="step-card">
          <div class="step-badge">3</div>
          <h4 class="tw-font-bold tw-text-gray-800 tw-mb-1">Deal directly, grow profits</h4>
          <p class="tw-text-[14px] tw-text-gray-600">Connect, negotiate and transact securely—no middlemen.</p>
        </div>
      </div>
    </section>

    <!-- Footer CTA -->
    <footer class="footer-cta tw-mt-auto">
      <div class="tw-max-w-7xl tw-mx-auto tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-between tw-gap-4 tw-px-6">
        <h2 class="tw-text-white tw-text-lg md:tw-text-xl tw-font-semibold">Ready to transform your farm?</h2>
        <router-link to="/signup" class="btn-white">Join Now</router-link>
      </div>
      <div class="tw-text-center tw-text-white tw-text-sm tw-opacity-90 tw-mt-4">
        &copy; 2024 AgriBackup. All rights reserved. | <router-link to="/contact" class="tw-underline tw-text-white">Contact Us</router-link>
      </div>
    </footer>

    <!-- How It Works Dialog -->
    <div
      v-if="showDialog"
      class="tw-fixed tw-inset-0 tw-z-[70] tw-flex tw-items-center tw-justify-center overlay-blur"
      role="dialog" aria-modal="true"
    >
      <div class="dialog-glass">
        <button @click="showDialog = false" class="dialog-close" aria-label="Close">
          <v-icon small>mdi-close</v-icon>
        </button>
        <h2 class="tw-text-xl tw-font-extrabold tw-text-gray-800 tw-mb-2">How AgriBackup Works</h2>
        <ul class="tw-text-[14px] tw-text-gray-700 tw-list-disc tw-list-inside tw-space-y-2 tw-mb-4">
          <li><span class="tw-font-semibold">Farmers:</span> connect directly to buyers to maximize profit.</li>
          <li><span class="tw-font-semibold">Buyers:</span> source quality produce with transparent prices.</li>
          <li><span class="tw-font-semibold">Exporters:</span> manage farmer networks and verify via QR codes.</li>
        </ul>
        <div class="tw-flex tw-justify-end">
          <button @click="showDialog = false" class="btn-gradient tw-px-5 tw-py-2">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LandingPage',
  metaInfo: {
    title: 'AgriBackup - Connect Farmers, Buyers, Exporters & Institutions | Eliminate Middlemen',
    meta: [
      { name: 'description', content: 'AgriBackup connects farmers, buyers, exporters, governments, and institutions worldwide. Sell and buy farm produce directly, eliminate middlemen, access AI-powered insights, and join a global agricultural marketplace.' },
      { name: 'keywords', content: 'AgriBackup, farmers, buyers, exporters, agriculture, farm produce, direct selling, global marketplace, AI farming, eliminate middlemen, institutions, government, food security' },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:title', content: 'AgriBackup - Global Agricultural Marketplace' },
      { property: 'og:description', content: 'Join AgriBackup to connect farmers, buyers, exporters, and institutions. Sell and buy farm produce directly, eliminate middlemen, and access AI-powered insights.' },
      { property: 'og:type', content: 'website' },
      // eslint-disable-next-line sonarjs/no-duplicate-string
      { property: 'og:url', content: 'https://agribackup.com/' },
      // eslint-disable-next-line sonarjs/no-duplicate-string
      { property: 'og:image', content: 'https://agribackup.com/assets/images/happy-farmer.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'AgriBackup - Global Agricultural Marketplace' },
      { name: 'twitter:description', content: 'Connect farmers, buyers, exporters, and institutions worldwide. Sell and buy farm produce directly, eliminate middlemen, and access AI-powered insights.' },
      { name: 'twitter:image', content: 'https://agribackup.com/assets/images/happy-farmer.jpg' },
      { rel: 'canonical', href: 'https://agribackup.com/' },
    ],
    script: [
      {
        type: 'application/ld+json',
        json: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'AgriBackup',
          url: 'https://agribackup.com/',
          description: 'AgriBackup connects farmers, buyers, exporters, governments, and institutions worldwide. Sell and buy farm produce directly, eliminate middlemen, access AI-powered insights, and join a global agricultural marketplace.',
          image: 'https://agribackup.com/assets/images/happy-farmer.jpg',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://agribackup.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        },
      },
    ],
  },
  data() {
    return {
      showDialog: false,
      farmerCountDisplay: '20k+',
      buyerCountDisplay: '3.5k',
    };
  },
  methods: {
    clearViewRole() {
      // eslint-disable-next-line sonarjs/no-duplicate-string
      this.$store.dispatch('auth/setViewRole', '');
    },
    handleLogin() {
      this.clearViewRole();
      this.$router.push({ name: 'SignIn' });
    },
    handleSignup() {
      this.clearViewRole();
      this.$router.push({ name: 'SignUp' });
    },
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
    goManageFarmers() {
      // Prefer exporter management if available, else buyers can manage connections via community
      const target = this.$router.resolve({ name: 'FarmersManagement' });
      if (target && target.resolved && target.resolved.matched && target.resolved.matched.length) {
        this.$router.push({ name: 'FarmersManagement' });
        return;
      }
      // Fallback to community map for buyers to connect/manage
      this.$router.push({ name: 'Community' });
    },
    async fetchCountsSafely() {
      // Non-blocking stats fetch with short timeout and graceful fallback
      try {
        const resp = await axios.get('/api/admin/total-users', { timeout: 2000 });
        const totalFarmers = resp?.data?.totalFarmers;
        const totalBuyers = resp?.data?.totalBuyers;
        if (Number.isFinite(totalFarmers)) this.farmerCountDisplay = this.formatCompact(totalFarmers);
        if (Number.isFinite(totalBuyers)) this.buyerCountDisplay = this.formatCompact(totalBuyers);
      } catch (e) {
        // Silently keep defaults on any error/401/timeout
      }
    },
    formatCompact(n) {
      try {
        const abs = Math.abs(n);
        const sign = n < 0 ? '-' : '';
        if (abs >= 1000000000) return `${sign}${(abs / 1000000000).toFixed(abs >= 10000000000 ? 0 : 1)}b+`;
        if (abs >= 1000000) return `${sign}${(abs / 1000000).toFixed(abs >= 10000000 ? 0 : 1)}m+`;
        if (abs >= 10000) return `${sign}${(abs / 1000).toFixed(abs >= 100000 ? 0 : 1)}k+`;
        if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`;
        return `${n}`;
      } catch (_) { return `${n}`; }
    },
  },
  mounted() {
    // Start fetching after first paint
    requestAnimationFrame(() => this.fetchCountsSafely());
  },
};
</script>

<style scoped>
/* Page background */
.landing-wrap { background: radial-gradient(1200px 600px at 20% -10%, #f3fce9 0%, rgba(243,252,233,0) 60%), radial-gradient(900px 500px at 110% 10%, #e8f4ff 0%, rgba(232,244,255,0) 60%), #fbfdf7; }
.bg-gradient-layer { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(34,197,94,0.06), rgba(14,165,233,0.06)); }
.bg-blobs { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.6; }
.blob { filter: blur(18px); animation: float 12s ease-in-out infinite; }
.blob-b { animation-delay: 2.2s; }
.blob-c { animation-delay: 4.6s; }
.noise-overlay { position: absolute; inset: 0; pointer-events: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0 0 0 0.05 0.08 0.1 0.12"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>'); opacity: 0.12; mix-blend-mode: multiply; }

/* Navbar */
.nav-glass { background: rgba(255,255,255,0.6); border-bottom: 1px solid rgba(255,255,255,0.7); backdrop-filter: saturate(180%) blur(14px); }
.brand-title { color: #166534; }
.brand-gradient { background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }

/* Hero */
.hero-title { font-size: 34px; line-height: 1.1; font-weight: 900; color: #0f172a; letter-spacing: -0.01em; }
@media (min-width: 768px) { .hero-title { font-size: 48px; } }
.hero-sub { color: #334155; font-size: 16px; margin-top: 12px; max-width: 48ch; }
.hero-media { position: relative; border-radius: 18px; padding: 10px; background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.75); box-shadow: 0 18px 40px rgba(2,6,23,0.08); }
.hero-media img { display: block; width: 100%; max-width: 480px; border-radius: 12px; object-fit: cover; }
.floating-tag { position: absolute; top: 8%; right: -6%; transform: rotate(6deg); background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.85); border-radius: 9999px; padding: 6px 12px; box-shadow: 0 10px 26px rgba(2,6,23,0.12); font-size: 12px; color: #0f172a; backdrop-filter: blur(8px); }
.tag-blue { top: auto; bottom: 10%; right: -4%; transform: rotate(-4deg); }
.tag-gold { top: 40%; right: -10%; transform: rotate(2deg); }

/* Cards */
.card-glass { background: rgba(255,255,255,0.65); border: 1px solid rgba(255,255,255,0.8); border-radius: 16px; padding: 18px; box-shadow: 0 12px 32px rgba(2,6,23,0.06); backdrop-filter: saturate(180%) blur(12px); }
.card-glass:hover { box-shadow: 0 16px 38px rgba(2,6,23,0.1); transform: translateY(-2px); transition: 150ms ease; }
.panel-glass { background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.85); border-radius: 16px; padding: 16px; box-shadow: 0 12px 32px rgba(2,6,23,0.06); }
.panel-image { width: 100%; max-width: 520px; height: auto; border-radius: 12px; background: #f1f5f9; }
.step-card { position: relative; background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.85); border-radius: 14px; padding: 16px 14px 14px; box-shadow: 0 10px 28px rgba(2,6,23,0.06); }
.step-badge { position: absolute; top: -12px; left: -12px; width: 34px; height: 34px; border-radius: 9999px; display: grid; place-items: center; color: #075985; font-weight: 800; background: linear-gradient(135deg, #a7f3d0, #bfdbfe, #fde68a); box-shadow: 0 6px 16px rgba(2,6,23,0.12); }
.stat-chip { background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.9); backdrop-filter: blur(8px); border-radius: 9999px; padding: 8px 12px; font-size: 12px; color: #0f172a; }

/* Buttons */
.btn-gradient { background: linear-gradient(135deg, #22c55e 0%, #16a34a 35%, #0ea5e9 100%); color: #fff; border: none; border-radius: 10px; box-shadow: 0 10px 22px rgba(2,6,23,0.12); font-weight: 700; }
.btn-gradient:hover { filter: brightness(1.03); box-shadow: 0 14px 30px rgba(2,6,23,0.16); }
.btn-glass-outline { background: rgba(255,255,255,0.55); color: #0f766e; border: 1px solid rgba(15,118,110,0.25); border-radius: 10px; font-weight: 700; backdrop-filter: blur(8px); }
.btn-glass-outline:hover { background: rgba(255,255,255,0.7); }
.btn-ghost { color: #0f766e; padding: 10px 14px; border-radius: 10px; font-weight: 700; }
.btn-ghost:hover { background: rgba(15,118,110,0.08); }
.btn-white { background: #fff; color: #065f46; font-weight: 800; border-radius: 12px; padding: 10px 18px; box-shadow: 0 12px 24px rgba(2,6,23,0.16); }
.btn-white:hover { background: #f8fafc; }

/* Footer */
.footer-cta { background: linear-gradient(135deg, #16a34a, #0ea5e9); padding: 22px 0; position: relative; z-index: 10; }

/* Dialog */
.overlay-blur { background: radial-gradient(1200px 600px at 50% -10%, rgba(241,255,241,0.6) 0%, rgba(241,255,241,0) 55%); backdrop-filter: blur(8px); }
.dialog-glass { position: relative; width: 100%; max-width: 640px; background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.9); border-radius: 16px; box-shadow: 0 18px 40px rgba(2,6,23,0.2); padding: 18px; margin: 0 16px; }
.dialog-close { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.9); border-radius: 9999px; width: 34px; height: 34px; display: grid; place-items: center; color: #0f172a; }

/* Animations */
@keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(16px) } }
</style>
