<template>
  <div class="tw-mb-4">
    <!-- Dropdown Selection -->
    <v-select
        label="Select Camera"
        v-model="selectedCamera"
        :items="cameraOptions"
        item-text="label"
        item-value="id"
        :disabled="disabled"
        dense
        outlined
        :prepend-inner-icon="getCurrentCameraIcon()"
        @change="onCameraChange"
        class="tw-max-w-xs"
    >
      <template v-slot:item="{ item }">
        <div class="tw-flex tw-items-center tw-w-full">
<!--          <v-icon-->
<!--              :color="item.id === selectedCamera ? 'primary' : 'default'"-->
<!--              class="tw-mr-3"-->
<!--          >-->
<!--            {{ getCameraIcon(item.facingMode) }}-->
<!--          </v-icon>-->
          <div class="tw-flex-1">
            <div class="tw-font-medium">{{ item.label }}</div>
            <div class="tw-text-xs tw-text-gray-600 tw-capitalize">
              {{ item.facingMode === 'unknown' ? 'Unknown orientation' : item.facingMode + ' camera' }}
            </div>
          </div>
          <v-chip
              v-if="item.id === selectedCamera"
              x-small
              color="primary"
          >
            Active
          </v-chip>
        </div>
      </template>

      <template v-slot:selection="{ item }">
        <div class="tw-flex tw-items-center">
<!--          <v-icon class="tw-mr-2" small>-->
<!--            {{ getCameraIcon(item.facingMode) }}-->
<!--          </v-icon>-->
          <span class="tw-truncate">{{ item.label }}</span>
        </div>
      </template>
    </v-select>

    <!-- Camera Info -->
<!--    <div v-if="selectedCameraInfo" class="tw-mt-2 tw-p-2 tw-bg-blue-50 tw-rounded tw-text-xs">-->
<!--      <div class="tw-flex tw-items-center">-->
<!--        <v-icon small class="tw-mr-2" color="info">mdi-information</v-icon>-->
<!--        <span>-->
<!--          <strong>{{ selectedCameraInfo.label }}</strong> - -->
<!--          {{ selectedCameraInfo.facingMode === 'environment' ? 'Back Camera' :-->
<!--            selectedCameraInfo.facingMode === 'user' ? 'Front Camera' : 'Camera' }}-->
<!--        </span>-->
<!--      </div>-->
<!--    </div>-->

    <!-- No cameras available -->
    <v-alert v-if="cameras.length === 0" type="warning" dense class="tw-mt-2">
      <div class="tw-flex tw-items-center">
        <v-icon small class="tw-mr-2">mdi-camera-off</v-icon>
        No cameras detected. Please check your camera permissions.
      </div>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'CameraSelector',
  props: {
    cameras: {
      type: Array,
      default: () => [],
    },
    selectedCameraId: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selectedCamera: {
      get() {
        return this.selectedCameraId;
      },
      set(value) {
        this.$emit('camera-selected', value);
      },
    },

    cameraOptions() {
      return this.cameras.map((camera) => ({
        id: camera.id,
        label: camera.label,
        facingMode: camera.facingMode,
      }));
    },

    selectedCameraInfo() {
      return this.cameras.find((camera) => camera.id === this.selectedCameraId);
    },
  },

  methods: {
    getCameraIcon(facingMode) {
      switch (facingMode) {
        case 'user':
          return 'mdi-camera-front';
        case 'environment':
          return 'mdi-camera-rear';
        default:
          return 'mdi-camera';
      }
    },

    getCurrentCameraIcon() {
      if (this.selectedCameraInfo) {
        return this.getCameraIcon(this.selectedCameraInfo.facingMode);
      }
      return 'mdi-camera';
    },

    onCameraChange(cameraId) {
      this.$emit('camera-selected', cameraId);
    },
  },
};
</script>
