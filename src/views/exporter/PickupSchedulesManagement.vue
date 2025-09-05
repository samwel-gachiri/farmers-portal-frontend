<template>
  <Default>
    <div class="tw-p-6 tw-space-y-6">
      <div class="tw-space-y-1">
        <h1 class="tw-text-2xl tw-font-bold tw-text-gray-900">Pickup Schedules</h1>
        <p class="tw-text-sm tw-text-gray-600">Create and manage efficient multi‑stop collection routes.</p>
      </div>
      <div class="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100 tw-p-4">
        <PickupRoutes />
      </div>
    </div>
  </Default>
</template>
<script>
import Default from '@/components/layout/Default.vue';
import PickupRoutes from '@/views/PickupRoutes.vue';

export default { name: 'PickupSchedulesManagement', components: { Default, PickupRoutes } };
</script>
