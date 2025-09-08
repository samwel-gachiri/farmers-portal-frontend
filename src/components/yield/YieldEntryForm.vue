<template>
  <form @submit.prevent="submit" class="yield-entry-form flex flex-col gap-4 p-4 rounded shadow bg-white">
    <div>
      <label class="block font-semibold mb-1">Produce</label>
      <select v-model="form.farmerProduceId" class="input w-full" required>
        <option value="" disabled>Select produce</option>
        <option v-for="produce in produces" :key="produce.id" :value="produce.id">
          {{ produce.name }}
        </option>
      </select>
    </div>
    <div>
      <label class="block font-semibold mb-1">Yield Amount</label>
      <input v-model.number="form.yieldAmount" type="number" min="0.01" step="0.01" class="input w-full" required />
    </div>
    <div>
      <label class="block font-semibold mb-1">Unit</label>
      <select v-model="form.yieldUnit" class="input w-full" required>
        <option value="" disabled>Select unit</option>
        <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
      </select>
    </div>
    <div>
      <label class="block font-semibold mb-1">Harvest Date</label>
      <input v-model="form.harvestDate" type="date" class="input w-full" required />
    </div>
    <div>
      <label class="block font-semibold mb-1">Season (optional)</label>
      <div class="flex gap-2">
        <input v-model="form.seasonYear" type="number" min="2000" max="2100" class="input w-1/2" placeholder="Year" />
        <input v-model="form.seasonName" type="text" class="input w-1/2" placeholder="Season name (e.g. Long Rains)" />
      </div>
    </div>
    <div>
      <label class="block font-semibold mb-1">Notes (optional)</label>
      <textarea v-model="form.notes" class="input w-full" rows="2" placeholder="Any notes about this harvest..."></textarea>
    </div>
    <button type="submit" class="btn btn-success w-full">Save Yield</button>
  </form>
</template>

<script>
export default {
  name: 'YieldEntryForm',
  props: {
    produces: Array,
    units: Array,
    form: Object,
    submit: Function,
  },
};
</script>

<style scoped>
.yield-entry-form {
  max-width: 420px;
}
.input {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
}
.btn-success {
  background: #059669;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
</style>
