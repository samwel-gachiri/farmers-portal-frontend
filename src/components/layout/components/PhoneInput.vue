<template>
  <div class="tw-flex tw-flex-row tw-my-5">
    <phone-number-input
        v-model="phoneNumber"
        :default-country="defaultCountry"
        :preferred-countries="['KE', 'US', 'GB']"
    />
<!--        @update:model-value="emitPhoneNumber"-->
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      phoneNumber: this.value, // Input value
      defaultCountry: 'KE', // Default country (Kenya)
    };
  },
  methods: {
    emitPhoneNumber() {
      this.$emit('input', this.phoneNumber); // Emit full number (e.g., +2540712345678)
    },
  },
  watch: {
    value(newVal) {
      this.phoneNumber = newVal; // Keep input value in sync
    },
  },
};
</script>
