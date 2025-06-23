<template>
  <v-card class="tw-relative tw-p-0 tw-overflow-hidden">
    <!-- Make the image the full container -->
    <v-img
        :src="photo.url"
        aspect-ratio="1"
        class="tw-cursor-pointer"
        @click="$emit('view-location', photo)"
    >
      <!-- Location indicator overlay -->
      <div class="tw-absolute tw-top-2 tw-right-2">
        <v-chip small color="success" dark>
          <v-icon left x-small>mdi-map-marker</v-icon>
          GPS
        </v-chip>
      </div>

      <!-- Card text overlay -->
      <div class="tw-absolute tw-bottom-10 tw-left-0 tw-right-0 tw-px-2 tw-py-1 tw-bg-black/50">
        <div class="tw-text-xs tw-text-white">
          <!-- Uncomment if you want to show these details -->
          <!-- <p>{{ formatDate(photo.timestamp) }}</p> -->
          <!-- <p>{{ formatLocation(photo.location) }}</p> -->
          <!-- <p>{{ formatFileSize(photo.size) }}</p> -->
        </div>
      </div>

      <!-- Actions overlay -->
      <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-black/50 tw-p-2">
        <div class="tw-flex tw-items-center">
          <v-btn
              icon
              small
              color="white"
              @click.stop="$emit('view-location', photo)"
              title="View location"
          >
            <v-icon small>mdi-map-marker</v-icon>
          </v-btn>

          <v-btn
              icon
              small
              color="white"
              @click.stop="downloadPhoto"
              title="Download"
          >
            <v-icon small>mdi-download</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
              icon
              small
              color="white"
              @click.stop="$emit('delete', photo.id)"
              title="Delete"
          >
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>
    </v-img>
  </v-card>
</template>

<script>

export default {
  name: 'PhotoCard',
  props: {
    photo: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },

    formatLocation(location) {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      // eslint-disable-next-line no-restricted-properties
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    },

    downloadPhoto() {
      const link = document.createElement('a');
      link.href = this.photo.url;
      link.download = `geotagged-photo-${this.photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>
