<template>
  <Default>
    <div class="tw-p-6 tw-space-y-4">
      <h1 class="tw-text-2xl tw-font-bold">Pickup Schedules</h1>
      <p class="tw-text-gray-600">Manage multi-stop pickup routes. This wraps the existing PickupRoutes view.</p>
      <PickupRoutes />
    </div>
  </Default>
</template>
<script>
import Default from '@/components/layout/Default.vue';
import PickupRoutes from '@/views/PickupRoutes.vue';

export default { name: 'PickupSchedulesManagement', components: { Default, PickupRoutes } };
</script>
