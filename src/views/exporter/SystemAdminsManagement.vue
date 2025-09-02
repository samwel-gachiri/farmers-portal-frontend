<template>
  <Default>
    <div class="tw-p-6 tw-space-y-4">
      <h1 class="tw-text-2xl tw-font-bold">System Admins Management</h1>
      <p class="tw-text-gray-600">Placeholder view: implement listing, creation, and role/permission management for system administrators.</p>
      <v-alert type="info" outlined dense>
        Backend endpoint suggestion: GET /api/exporters-service/exporter/system-admins
      </v-alert>
    </div>
  </Default>
</template>
<script>
import Default from '@/components/layout/Default.vue';

export default { name: 'SystemAdminsManagement', components: { Default } };
</script>
