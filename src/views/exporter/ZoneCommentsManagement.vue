<template>
  <Default>
    <div class="tw-p-6 tw-space-y-4">
      <h1 class="tw-text-2xl tw-font-bold">Zone Comments</h1>
      <p class="tw-text-gray-600">Placeholder view: view and moderate comments added to zones (audit trail).</p>
      <v-alert type="info" outlined dense>
        Backend endpoint suggestion: GET /api/admin-service/zones/{zoneId}/comments
      </v-alert>
    </div>
  </Default>
</template>
<script>
import Default from '@/components/layout/Default.vue';

export default { name: 'ZoneCommentsManagement', components: { Default } };
</script>
