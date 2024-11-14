<template>
  <div class="tw-flex tw-flex-row tw-my-5">
    <v-icon slot="prepend" color="primary">mdi-phone</v-icon>
    <v-select
        v-model="selectedCountry"
        :items="countries"
        item-text="name"
        item-value="code"
        label="Country Code"
        hide-details
        class="country-select tw-bg-gray-100 tw-rounded-lg md:tw-mx-3 tw-mx"
        @change="updatePhoneNumber"
    >
      <template v-slot:prepend-item>
        <v-list-item ripple @click="toggleCountryList">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon>mdi-chevron-down</v-icon>
              Select Country
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-select>
    <v-text-field
        v-model="phoneNumber"
        class="tw-w-full tw-bg-gray-100 tw-rounded-lg tw-mx-3 tw-p-4"
        label="Phone Number"
        placeholder="Enter phone number"
        @input="updatePhoneNumber"
        :rules="phoneRules"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCountry: 'KE', // Default to Kenya
      phoneNumber: '',
      countries: [
        { code: 'KE', name: 'KE (+254)', flag: '🇰🇪' },
        // Add more countries as needed
      ],
      phoneRules: [
        (value) => !!value || 'Phone number is required.',
        (value) => /^\d{10}$/.test(value) || 'Invalid phone number format.',
      ],
    };
  },
  methods: {
    updatePhoneNumber() {
      // Optional: Add logic to format or validate the phone number
    },
    toggleCountryList() {
      // Logic to toggle the country list (if needed)
    },
  },
};
</script>

<style scoped>
.country-select {
  width: 150px; /* Adjust width as needed */
}
</style>
