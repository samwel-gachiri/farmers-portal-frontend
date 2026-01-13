<template>
  <div class="legal-page">
    <AppHeader />
    <div class="tw-max-w-4xl tw-mx-auto tw-px-6 tw-py-24">
      <h1 class="tw-text-4xl tw-font-bold tw-text-gray-900 tw-mb-2">AgriBackup Strategic Privacy Policy</h1>
      <div class="tw-text-gray-500 tw-mb-8 tw-flex tw-flex-col sm:tw-flex-row sm:tw-gap-6">
        <p><strong>Effective Date:</strong> January 13, 2026</p>
        <p><strong>Version:</strong> 1.0 (Production-Ready)</p>
      </div>

      <div class="tw-prose tw-prose-lg tw-text-gray-700">

        <h2 class="tw-text-2xl tw-font-bold tw-mt-8 tw-mb-4">1. Vision for Data Integrity</h2>
        <p>At AgriBackup, we believe that data is the "new soil" of the agricultural industry. Our mission is to protect the market access of hardworking producers by transforming raw geolocation and production data into a "License to Trade" in the global economy. This policy outlines how we secure that value for you.</p>

        <h2 class="tw-text-2xl tw-font-bold tw-mt-8 tw-mb-4">2. Data We Collect (The "Signal")</h2>
        <p>We focus exclusively on high-signal data required for global compliance and system performance:</p>
        <ul class="tw-list-none tw-pl-0 tw-space-y-4 tw-mt-4">
          <li class="tw-pl-4 tw-border-l-4 tw-border-green-500">
            <strong>Identity Data:</strong> Name, contact information, and professional role (Farmer or Exporter).
          </li>
          <li class="tw-pl-4 tw-border-l-4 tw-border-green-500">
            <strong>Compliance Data:</strong> GPS farm polygons, production unit boundaries, and crop types. This data is essential for satellite-based deforestation verification.
          </li>
          <li class="tw-pl-4 tw-border-l-4 tw-border-green-500">
            <strong>Technical Data:</strong> Geolocation (for weather accuracy), IP addresses, and session tokens (stored for 30 days to ensure a seamless "always-on" experience).
          </li>
        </ul>

        <h2 class="tw-text-2xl tw-font-bold tw-mt-8 tw-mb-4">3. Strategic Use of Information</h2>
        <p>We do not collect data for the sake of "big data" hoarding. Every piece of information has a technical purpose:</p>
        <ul class="tw-list-disc tw-pl-6 tw-space-y-2 tw-mt-2">
          <li><strong>Verification:</strong> Using satellite imagery to prove your production units are 100% deforestation-free.</li>
          <li><strong>Optimization:</strong> Providing real-time, actionable weather and market insights based on your farm’s precise location.</li>
          <li><strong>Automation:</strong> Generating "Audit-Ready" certificates to eliminate manual red tape for exporters.</li>
        </ul>

        <h2 class="tw-text-2xl tw-font-bold tw-mt-8 tw-mb-4">4. Controlled Data Sharing</h2>
        <p>AgriBackup is not a data broker. We share information only under these three conditions:</p>
        <ul class="tw-list-disc tw-pl-6 tw-space-y-2 tw-mt-2">
          <li><strong>Authorized Export:</strong> When you authorize an exporter to view your "Compliance Score" to facilitate a sale.</li>
          <li><strong>Regulatory Filing:</strong> When you explicitly submit a report to authorities (e.g., for EUDR 2026 compliance).</li>
          <li><strong>Service Infrastructure:</strong> With our secure cloud partners (Google Cloud Platform) who provide the "engine" for our system.</li>
        </ul>

        <h2 class="tw-text-2xl tw-font-bold tw-mt-8 tw-mb-4">5. Global Rights & Governance</h2>
        <p>As a global company, we adhere to the highest international standards, including the Kenya Data Protection Act (2019) and EU GDPR:</p>
        <ul class="tw-list-disc tw-pl-6 tw-space-y-2 tw-mt-2">
          <li><strong>The Right to Erasure:</strong> You may request the deletion of your account and farm polygons at any time.</li>
          <li><strong>Data Portability:</strong> You own your data. You can export your compliance history whenever you need it.</li>
          <li><strong>Accuracy:</strong> You have the right to rectify any incorrect boundary mappings to ensure your compliance score is fair.</li>
        </ul>

        <h2 class="tw-text-2xl tw-font-bold tw-mt-8 tw-mb-4">6. Technical Security (The "Shield")</h2>
        <p>We utilize enterprise-grade security to protect your supply chain:</p>
        <ul class="tw-list-disc tw-pl-6 tw-space-y-2 tw-mt-2">
          <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols.</li>
          <li><strong>Ledger Consensus:</strong> Critical compliance milestones are recorded on the Hedera public ledger to provide an immutable "proof of truth" that cannot be tampered with.</li>
        </ul>

        <h2 class="tw-text-2xl tw-font-bold tw-mt-8 tw-mb-4">7. Changes to this Policy</h2>
        <p>In an era of rapid technological evolution, this policy may be updated. Users will be notified of significant changes via their dashboard or our Weekly Global System Tour.</p>

        <div class="tw-mt-16 tw-pt-8 tw-border-t tw-border-gray-200">
          <p class="tw-font-bold tw-text-lg tw-text-gray-900">Samuel Gachiri</p>
          <p class="tw-text-gray-600">CEO, AgriBackup</p>
          <p class="tw-mt-4 tw-text-green-600 tw-font-medium tw-italic">Building Transparent Supply Chains for a Resilient Future.</p>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

export default {
  name: 'PrivacyPolicy',
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style scoped>
.legal-page {
  background-color: #f9fafb;
  min-height: 100vh;
}
</style>
