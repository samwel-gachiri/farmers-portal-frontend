<template>
  <v-container fluid>
    <v-card>
      <card-title icon="mdi-camera">Take Picture</card-title>
      <v-card-text>
        <div v-if="checkingPermissions" class="tw-mb-1 tw-text-center tw-py-8">
          <v-progress-circular indeterminate color="primary" class="tw-mb-4"></v-progress-circular>
          <p>Checking permissions...</p>
        </div>
        <div v-if="!checkingPermissions" class="tw-mb-4">
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <!-- Camera Permission -->
            <div class="tw-flex tw-items-center tw-p-3 tw-rounded tw-border">
              <v-icon
                  :color="permissionStates.camera === 'granted' ? 'success' :
                   permissionStates.camera === 'denied' ? 'error' : 'warning'"
                  class="tw-mr-3"
              >
                {{ permissionStates.camera === 'granted' ? 'mdi-check-circle' :
                  permissionStates.camera === 'denied' ? 'mdi-close-circle' : 'mdi-help-circle' }}
              </v-icon>
              <div>
                <h6 class="tw-font-semibold">Camera Access</h6>
                <p class="tw-text-sm tw-capitalize">{{ permissionStates.camera }}</p>
              </div>
            </div>

            <!-- Location Permission -->
            <div class="tw-flex tw-items-center tw-p-3 tw-rounded tw-border">
              <v-icon
                  :color="permissionStates.geolocation === 'granted' ? 'success' :
                   permissionStates.geolocation === 'denied' ? 'error' : 'warning'"
                  class="tw-mr-3"
              >
                {{ permissionStates.geolocation === 'granted' ? 'mdi-check-circle' :
                  permissionStates.geolocation === 'denied' ? 'mdi-close-circle' : 'mdi-help-circle' }}
              </v-icon>
              <div>
                <h6 class="tw-font-semibold">Location Access</h6>
                <p class="tw-text-sm tw-capitalize">{{ permissionStates.geolocation }}</p>
              </div>
            </div>
          </div>

          <!-- Request Permissions Button -->
          <v-btn
              v-if="permissionStates.camera !== 'granted' || permissionStates.geolocation !== 'granted'"
              color="primary"
              @click="requestPermissions"
              :loading="loading"
              class="tw-mt-4"
          >
            Request Permissions
          </v-btn>
        </div>
        <!-- Camera Interface -->
        <div v-if="hasLocationPermission && hasCameraPermission">
<!--          <v-card-title>-->
<!--            <v-icon left>mdi-camera</v-icon>-->
<!--            Geotagged Photo Capture-->
            <!--        &lt;!&ndash; Current Camera Info &ndash;&gt;-->
            <!--        <v-chip v-if="getCurrentCameraInfo()" color="info" small>-->
            <!--          <v-icon left small>mdi-camera</v-icon>-->
            <!--          {{ getCurrentCameraInfo().label }}-->
            <!--        </v-chip>-->
<!--          </v-card-title>-->
            <!-- Camera Selection -->
            <CameraSelector
                v-if="availableCameras.length > 0"
                :cameras="availableCameras"
                :selected-camera-id="selectedCameraId"
                :disabled="showCamera"
                @camera-selected="onCameraSelected"
            />

            <!-- Current Location Display -->
            <!--        <div v-if="currentLocation" class="tw-mb-4 tw-p-3 tw-bg-gray-100 tw-rounded">-->
            <!--          <h4 class="tw-text-sm tw-font-semibold tw-mb-2">Current Location:</h4>-->
            <!--          <p class="tw-text-xs">-->
            <!--            Latitude: {{ currentLocation.latitude.toFixed(6) }}<br>-->
            <!--            Longitude: {{ currentLocation.longitude.toFixed(6) }}<br>-->
            <!--            Accuracy: ±{{ currentLocation.accuracy }}m-->
            <!--          </p>-->
            <!--        </div>-->

            <!-- Error Display -->
            <v-alert v-if="cameraError" type="error" dismissible class="tw-mb-4">
              {{ cameraError }}
            </v-alert>

            <!-- Camera Container -->
            <div class="tw-relative">
              <video
                  ref="videoElement"
                  v-show="showCamera"
                  autoplay
                  playsinline
                  class="tw-w-full tw-max-w-md tw-mx-auto tw-block tw-rounded"
              ></video>

              <canvas
                  ref="canvasElement"
                  style="display: none;"
              ></canvas>
            </div>
            <PhotoGallery
                v-if="capturedPhotos.length > 0"
                :photos="capturedPhotos"
                @delete-photo="deletePhoto"
                class="tw-mt-4"
            />

          <v-card-actions class="tw-justify-center">
            <v-btn
                v-if="!showCamera"
                color="primary"
                large
                @click="startCamera"
                :loading="isCapturing"
                :disabled="!selectedCameraId"
            >
              <v-icon left>mdi-camera</v-icon>
              Start Camera
            </v-btn>

            <template v-else>
              <v-btn
                  color="success"
                  large
                  @click="capturePhoto"
                  :disabled="!currentLocation"
                  class="tw-mr-2"
              >
                <v-icon left>mdi-camera-plus</v-icon>
                Capture Photo
              </v-btn>

              <v-btn
                  color="error"
                  large
                  @click="stopCamera"
              >
                <v-icon left>mdi-camera-off</v-icon>
                Stop Camera
              </v-btn>
            </template>
          </v-card-actions>
        </div>

      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
// Add piexifjs import at the top
import piexif from 'piexifjs';
import PhotoGallery from '@/components/pictures/PhotoGallery.vue';
import CardTitle from '@/components/shared/CardTitle.vue';
import CameraSelector from './CameraSelector.vue';

export default {
  name: 'PhotoCapture',
  components: {
    CardTitle,
    PhotoGallery,
    CameraSelector,
  },
  data() {
    return {
      // Camera and location states
      hasLocationPermission: false,
      hasCameraPermission: false,
      currentLocation: null,
      locationError: null,

      // Camera stream
      stream: null,

      // Captured photos
      capturedPhotos: [],

      // UI states
      isCapturing: false,
      showCamera: false,
      loading: false,

      // Permission states
      permissionStates: {
        camera: 'prompt', // 'granted', 'denied', 'prompt'
        geolocation: 'prompt',
      },

      // Available cameras
      availableCameras: [],
      selectedCameraId: null,

      // UI states
      checkingPermissions: true,
      cameraError: null,
    };
  },
  mounted() {
    this.checkPermissionsOnLoad();
  },
  computed: {
    canCapturePhoto() {
      return this.hasLocationPermission
          && this.hasCameraPermission
          && this.currentLocation
          && this.showCamera;
    },
  },

  methods: {
    async requestPermissions() {
      this.loading = true;
      this.locationError = null;

      try {
        // Request location permission
        await this.requestLocationPermission();

        // Request camera permission
        await this.requestCameraPermission();

        // Start location tracking
        if (this.hasLocationPermission) {
          this.startLocationTracking();
        }
      } catch (error) {
        this.$toast.error('Permission error:', error.message);
        this.locationError = error.message;
      } finally {
        this.loading = false;
        if (this.hasLocationPermission && this.hasCameraPermission) {
          await this.startCamera();
        }
      }
    },

    async requestLocationPermission() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.hasLocationPermission = true;
            this.currentLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date(),
            };
            resolve();
          },
          (error) => {
            let errorMessage = 'Location access denied';
            // eslint-disable-next-line default-case
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied by user';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out';
                break;
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      });
    },

    async requestCameraPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera if available
          },
        });

        // Test successful, stop the stream for now
        stream.getTracks().forEach((track) => track.stop());
        this.hasCameraPermission = true;
      } catch (error) {
        throw new Error('Camera access denied or unavailable');
      }
    },

    startLocationTracking() {
      if (!navigator.geolocation) return;

      // Watch position for real-time updates
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          };
        },
        (error) => {
          this.$toast.error('Location tracking error:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 30000,
        },
      );
    },

    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
      }
      this.showCamera = false;
    },

    async capturePhoto() {
      if (!this.currentLocation) {
        this.$toast.error('Location not available');
        return;
      }

      const video = this.$refs.videoElement;
      const canvas = this.$refs.canvasElement;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          this.capturedPhotos.push(await this.addGeotagToPhoto(blob));
          this.$toast.success('Photo captured with location data');
        }
      }, 'image/jpeg', 0.9);
    },

    async addGeotagToPhoto(photoBlob) {
      try {
        // Convert blob to data URL
        const arrayBuffer = await photoBlob.arrayBuffer();
        const photoData = new Uint8Array(arrayBuffer);

        // Convert to base64 data URL
        let binary = '';
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < photoData.length; i++) {
          binary += String.fromCharCode(photoData[i]);
        }
        const base64String = btoa(binary);
        const dataUrl = `data:image/jpeg;base64,${base64String}`;

        // Create GPS EXIF data
        const gpsData = this.createGPSExifData();

        // Create complete EXIF dictionary
        const exifDict = {
          '0th': {
            [piexif.ImageIFD.Make]: 'Web Browser',
            [piexif.ImageIFD.Model]: navigator.userAgent.split(' ')[0],
            [piexif.ImageIFD.DateTime]: this.getExifDateTime(),
            [piexif.ImageIFD.Software]: 'Vue Geotagged Camera',
            [piexif.ImageIFD.Artist]: 'farmer', // Set owner as farmer
          },
          Exif: {
            [piexif.ExifIFD.DateTimeOriginal]: this.getExifDateTime(),
            [piexif.ExifIFD.DateTimeDigitized]: this.getExifDateTime(),
            [piexif.ExifIFD.UserComment]: 'Geotagged with Vue Camera App',
          },
          GPS: gpsData,
          '1st': {},
          thumbnail: null,
        };

        // Convert EXIF dictionary to bytes
        const exifBytes = piexif.dump(exifDict);

        // Insert EXIF data into the image
        const newDataUrl = piexif.insert(exifBytes, dataUrl);

        // Convert back to blob
        const newBlob = await this.dataURLToBlob(newDataUrl);

        return {
          id: Date.now(),
          blob: newBlob,
          url: URL.createObjectURL(newBlob),
          location: { ...this.currentLocation },
          timestamp: new Date().toISOString(),
          size: newBlob.size,
          hasEmbeddedGPS: true,
          exif: {
            latitude: this.currentLocation.latitude,
            longitude: this.currentLocation.longitude,
            accuracy: this.currentLocation.accuracy,
            timestamp: this.currentLocation.timestamp,
          },
        };
      } catch (error) {
        this.$toast.error('Error embedding GPS EXIF data:', error.message);
        // Fallback to simple geotagging if EXIF embedding fails
        return this.createSimpleGeotaggedPhoto(photoBlob);
      }
    },

    createGPSExifData() {
      const lat = this.currentLocation.latitude;
      const lon = this.currentLocation.longitude;

      // // Convert decimal degrees to DMS (Degrees, Minutes, Seconds)
      // const latDMS = this.decimalToDMS(Math.abs(lat));
      // const lonDMS = this.decimalToDMS(Math.abs(lon));

      return {
        [piexif.GPSIFD.GPSVersionID]: [2, 2, 0, 0],
        [piexif.GPSIFD.GPSLatitudeRef]: lat >= 0 ? 'N' : 'S',
        [piexif.GPSIFD.GPSLatitude]: piexif.GPSHelper.degToDmsRational(Math.abs(lat)),
        [piexif.GPSIFD.GPSLongitudeRef]: lon >= 0 ? 'E' : 'W',
        [piexif.GPSIFD.GPSLongitude]: piexif.GPSHelper.degToDmsRational(Math.abs(lon)),
        [piexif.GPSIFD.GPSAltitudeRef]: 0,
        [piexif.GPSIFD.GPSTimeStamp]: this.getGPSTimeStamp(),
        [piexif.GPSIFD.GPSDateStamp]: this.getGPSDateStamp(),
        [piexif.GPSIFD.GPSProcessingMethod]: this.encodeProcessingMethod('GPS'),
        [piexif.GPSIFD.GPSMapDatum]: 'WGS-84',
      };
    },

    getGPSTimeStamp() {
      const now = new Date();
      return [
        [now.getUTCHours(), 1],
        [now.getUTCMinutes(), 1],
        [now.getUTCSeconds(), 1],
      ];
    },

    getGPSDateStamp() {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      return `${year}:${month}:${day}`;
    },

    getExifDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
    },

    // Fixed encodeUserComment method
    encodeUserComment(comment) {
      // EXIF UserComment should be encoded as Unicode (UTF-8)
      // The first 8 bytes should be the encoding identifier
      const encoding = [0x55, 0x4E, 0x49, 0x43, 0x4F, 0x44, 0x45, 0x00]; // "UNICODE" + null terminator

      // Convert comment to UTF-8 bytes
      const encoder = new TextEncoder();
      const commentBytes = encoder.encode(comment);

      // Combine encoding marker and comment bytes
      const result = new Uint8Array(encoding.length + commentBytes.length);
      result.set(encoding, 0);
      result.set(commentBytes, encoding.length);

      return result;
    },

    encodeProcessingMethod(method) {
      // GPS Processing Method encoding
      const encoding = [0x41, 0x53, 0x43, 0x49, 0x49, 0x00, 0x00, 0x00]; // ASCII encoding marker
      const methodBytes = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < method.length; i++) {
        methodBytes.push(method.charCodeAt(i));
      }
      return new Uint8Array([...encoding, ...methodBytes]);
    },

    async dataURLToBlob(dataURL) {
      const response = await fetch(dataURL);
      // eslint-disable-next-line no-return-await
      return await response.blob();
    },

    createSimpleGeotaggedPhoto(photoBlob) {
      // Fallback method without EXIF embedding
      return {
        id: Date.now(),
        blob: photoBlob,
        url: URL.createObjectURL(photoBlob),
        location: { ...this.currentLocation },
        timestamp: new Date().toISOString(),
        size: photoBlob.size,
        hasEmbeddedGPS: false,
        exif: {
          latitude: this.currentLocation.latitude,
          longitude: this.currentLocation.longitude,
          accuracy: this.currentLocation.accuracy,
          timestamp: this.currentLocation.timestamp,
        },
      };
    },

    // Enhanced camera switching
    onCameraSelected(cameraId) {
      this.switchCamera(cameraId);
    },

    deletePhoto(photoId) {
      const index = this.capturedPhotos.findIndex((photo) => photo.id === photoId);
      if (index > -1) {
        // Clean up object URL to prevent memory leaks
        URL.revokeObjectURL(this.capturedPhotos[index].url);
        this.capturedPhotos.splice(index, 1);
      }
    },

    async checkPermissionsOnLoad() {
      this.checkingPermissions = true;

      try {
        // Check camera permission
        await this.checkCameraPermission();

        // Check location permission
        await this.checkLocationPermission();

        // If both permissions are granted, get available cameras and start location tracking
        if (this.permissionStates.camera === 'granted' && this.permissionStates.geolocation === 'granted') {
          await this.getAvailableCameras();
          this.startLocationTracking();
          this.hasLocationPermission = true;
          this.hasCameraPermission = true;
        }
      } catch (error) {
        this.$toast.error('Permission check error:', error.message);
      } finally {
        this.checkingPermissions = false;
      }
    },

    async checkCameraPermission() {
      try {
        // Check if Permissions API is supported
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'camera' });
          this.permissionStates.camera = permission.state;

          // Listen for permission changes
          permission.onchange = () => {
            this.permissionStates.camera = permission.state;
            this.hasCameraPermission = permission.state === 'granted';

            if (permission.state === 'granted') {
              this.getAvailableCameras();
            } else if (permission.state === 'denied') {
              this.availableCameras = [];
              this.stopCamera();
            }
          };

          // If granted, check available cameras
          if (permission.state === 'granted') {
            await this.getAvailableCameras();
            this.hasCameraPermission = true;
          }
        } else {
          // Fallback: try to access camera to check permission
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => track.stop());
            this.permissionStates.camera = 'granted';
            this.hasCameraPermission = true;
            await this.getAvailableCameras();
          } catch (error) {
            this.permissionStates.camera = 'denied';
            this.hasCameraPermission = false;
          }
        }
      } catch (error) {
        this.$toast.error('Camera permission check failed:', error.message);
        this.permissionStates.camera = 'denied';
      }
    },

    async checkLocationPermission() {
      try {
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          this.permissionStates.geolocation = permission.state;

          // Listen for permission changes
          permission.onchange = () => {
            this.permissionStates.geolocation = permission.state;
            this.hasLocationPermission = permission.state === 'granted';

            if (permission.state === 'granted') {
              this.startLocationTracking();
            } else if (permission.state === 'denied') {
              this.currentLocation = null;
              if (this.watchId) {
                navigator.geolocation.clearWatch(this.watchId);
              }
            }
          };

          // If granted, start location tracking
          if (permission.state === 'granted') {
            this.startLocationTracking();
            this.hasLocationPermission = true;
          }
        } else {
          // Fallback: try to get location to check permission
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.permissionStates.geolocation = 'granted';
              this.hasLocationPermission = true;
              this.currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date(),
              };
              this.startLocationTracking();
            },
            (error) => {
              this.permissionStates.geolocation = error.code === 1 ? 'denied' : 'prompt';
              this.hasLocationPermission = false;
            },
            { timeout: 1000 },
          );
        }
      } catch (error) {
        this.$toast.error('Location permission check failed:', error.message);
        this.permissionStates.geolocation = 'denied';
      }
    },

    async getAvailableCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.availableCameras = devices
          .filter((device) => device.kind === 'videoinput')
          .map((device) => ({
            id: device.deviceId,
            label: device.label || `Camera ${this.availableCameras.length + 1}`,
            facingMode: this.detectFacingMode(device.label),
          }));

        // Set default camera (prefer back camera)
        if (this.availableCameras.length > 0 && !this.selectedCameraId) {
          const backCamera = this.availableCameras.find((camera) => camera.facingMode === 'environment'
              || camera.label.toLowerCase().includes('back'));
          this.selectedCameraId = backCamera ? backCamera.id : this.availableCameras[0].id;
        }
      } catch (error) {
        this.cameraError = 'Failed to detect available cameras';
      }
    },

    detectFacingMode(label) {
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes('back') || lowerLabel.includes('rear')) {
        return 'environment';
        // eslint-disable-next-line sonarjs/no-same-line-conditional
      } if (lowerLabel.includes('front') || lowerLabel.includes('user')) {
        return 'user';
      }
      return 'unknown';
    },

    async switchCamera(cameraId) {
      if (this.selectedCameraId === cameraId) return;

      const wasStreamActive = !!this.stream;

      // Stop current stream
      if (this.stream) {
        this.stopCamera();
      }

      // Update selected camera
      this.selectedCameraId = cameraId;

      // Restart camera with new device if it was active
      if (wasStreamActive) {
        await this.startCamera();
      }
    },

    // Enhanced startCamera method with camera selection
    async startCamera() {
      try {
        const constraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        // Add device constraint if specific camera is selected
        if (this.selectedCameraId) {
          constraints.video.deviceId = { exact: this.selectedCameraId };
        } else {
          // Fallback to facingMode
          constraints.video.facingMode = 'environment';
        }

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.$refs.videoElement.srcObject = this.stream;
        this.showCamera = true;
        this.cameraError = null;
      } catch (error) {
        this.$toast.error('Camera start error:', error.message);
        this.cameraError = `Failed to start camera: ${error.message}`;

        // If specific camera failed, try with any available camera
        if (this.selectedCameraId && error.name === 'NotFoundError') {
          this.selectedCameraId = null;
          await this.startCamera();
        }
      }
    },

    getCurrentCameraInfo() {
      if (!this.selectedCameraId) return null;
      return this.availableCameras.find((camera) => camera.id === this.selectedCameraId);
    },
  },

  beforeDestroy() {
    // Cleanup
    this.stopCamera();
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    // Clean up object URLs
    this.capturedPhotos.forEach((photo) => {
      URL.revokeObjectURL(photo.url);
    });
  },
};
</script>
<style scoped>

</style>
