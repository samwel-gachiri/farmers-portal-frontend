<template>
  <div>
    <h6
        class="tw-ml-2 tw-mt-4 tw-text-md tw-font-bold tw-text-gray-800 tw-cursor-pointer tw-hover:tw-text-blue-600 tw-transition-colors"
        @click="showRoleSelector"
    >
      {{role[0].toUpperCase() + role.slice(1)}} section
    </h6>

    <!-- Role Selection Modal/Dropdown -->
    <div
        v-if="isRoleSelectorVisible"
        class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50"
        @click="hideRoleSelector"
    >
      <div
          class="tw-bg-white tw-rounded-lg tw-p-6 tw-shadow-xl tw-max-w-sm tw-w-full tw-mx-4"
          @click.stop
      >
        <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4 tw-text-center">
          Select Your Role
        </h3>

        <div class="tw-space-y-3">
          <button
              @click="selectRole('farmer')"
              class="tw-w-full tw-py-3 tw-px-4 tw-bg-green-500 tw-text-white tw-rounded-lg tw-font-medium tw-hover:tw-bg-green-600 tw-transition-colors tw-focus:tw-outline-none tw-focus:tw-ring-2 tw-focus:tw-ring-green-500 tw-focus:tw-ring-offset-2"
              :class="{ 'tw-ring-2 tw-ring-green-500': role === 'farmer' }"
          >
            🌾 Farmer
          </button>

          <button
              @click="selectRole('buyer')"
              class="tw-w-full tw-py-3 tw-px-4 tw-bg-blue-500 tw-text-white tw-rounded-lg tw-font-medium tw-hover:tw-bg-blue-600 tw-transition-colors tw-focus:tw-outline-none tw-focus:tw-ring-2 tw-focus:tw-ring-blue-500 tw-focus:tw-ring-offset-2"
              :class="{ 'tw-ring-2 tw-ring-blue-500': role === 'buyer' }"
          >
            🛒 Buyer
          </button>
        </div>

        <button
            @click="hideRoleSelector"
            class="tw-w-full tw-mt-4 tw-py-2 tw-px-4 tw-bg-gray-200 tw-text-gray-700 tw-rounded-lg tw-font-medium tw-hover:tw-bg-gray-300 tw-transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      isRoleSelectorVisible: false,
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.auth.role,
    }),
  },
  methods: {
    ...mapMutations('auth', ['setUserRole']),

    showRoleSelector() {
      this.isRoleSelectorVisible = true;
    },

    hideRoleSelector() {
      this.isRoleSelectorVisible = false;
    },

    selectRole(selectedRole) {
      this.setUserRole(selectedRole);
      this.hideRoleSelector();
    },
  },
};
</script>
