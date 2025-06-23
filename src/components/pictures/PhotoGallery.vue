<template>
  <div>
<!--      <v-icon left>mdi-image-multiple</v-icon>-->
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
      <PhotoCard
          v-for="photo in photos"
          :key="photo.id"
          :photo="photo"
          @delete="$emit('delete-photo', photo.id)"
          @view-location="showLocationDialog"
      />
    </div>

    <!-- Location Dialog -->
    <v-dialog v-model="locationDialog" max-width="500">
      <v-card v-if="selectedPhoto">
        <v-card-title>Photo Location</v-card-title>
        <v-card-text>
          <div class="tw-space-y-2">
            <p><strong>Coordinates:</strong></p>
            <p class="tw-text-sm">{{ selectedPhoto.location.latitude.toFixed(6) }}, {{ selectedPhoto.location.longitude.toFixed(6) }}</p>

            <p><strong>Accuracy:</strong> ±{{ selectedPhoto.location.accuracy }}m</p>
            <p><strong>Captured:</strong> {{ formatDate(selectedPhoto.timestamp) }}</p>

            <v-btn
                color="primary"
                small
                @click="openInMaps"
                class="tw-mt-2"
            >
              <v-icon left small>mdi-map</v-icon>
              View in Maps
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="locationDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import piexif from 'piexifjs';
import PhotoCard from './PhotoCard.vue';

export default {
  name: 'PhotoGallery',
  components: {
    PhotoCard,
  },
  props: {
    photos: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      locationDialog: false,
      selectedPhoto: null,
    };
  },
  methods: {
    showLocationDialog(photo) {
      this.selectedPhoto = photo;
      this.locationDialog = true;
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },

    async readExifFromBlob(blob) {
      try {
        const dataUrl = await this.blobToDataURL(blob);
        const exifData = piexif.load(dataUrl);
        console.log(exifData);
        if (exifData.GPS) {
          const lat = piexif.GPSHelper.dmsRationalToDeg(
            exifData.GPS[piexif.GPSIFD.GPSLatitude],
          );

          const lon = piexif.GPSHelper.dmsRationalToDeg(
            exifData.GPS[piexif.GPSIFD.GPSLongitude],
          );
          return {
            latitude: lat,
            longitude: lon,
            rawExif: exifData.GPS,
          };
        }
        return null;
      } catch (error) {
        console.error('EXIF read error:', error);
        return null;
      }
    },

    // Helper method to convert blob to data URL
    blobToDataURL(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(blob);
      });
    },
    openInMaps() {
      if (this.selectedPhoto) {
        const { latitude, longitude } = this.selectedPhoto.location;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, '_blank');
      }
    },
  },
};
</script>
