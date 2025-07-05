<template>
  <div class="tw-min-h-screen tw-bg-gradient-to-br tw-from-green-50 tw-to-emerald-100 tw-px-2 tw-py-4">
    <!-- Main Content -->
    <div class="tw-max-w-6xl tw-mx-auto">
      <div class="tw-grid lg:tw-grid-cols-3 tw-gap-8">

        <!-- Left Panel - Form -->
        <div class="lg:tw-col-span-2">
          <v-card class="tw-shadow-xl tw-rounded-2xl tw-border-0 tw-overflow-hidden">
            <div class="tw-p-6">

              <h1 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-2"><v-icon class="tw-mr-3 tw-text-white">mdi-form-select</v-icon> Sell Your Produce:</h1>
            </div>

            <v-card-text class="tw-p-8">
              <v-form v-model="isValid">
                <!-- Product Selection Section -->
                <div class="tw-mb-8">
                  <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4 tw-flex tw-items-center">
                    <v-icon class="tw-mr-2 tw-text-green-600">mdi-sprout</v-icon>
                    Product Information
                  </h3>

                  <div class="tw-grid md:tw-grid-cols-2 tw-gap-6">
                    <div class="tw-space-y-2">
                      <v-combobox
                          v-model="selectedProduce"
                          :items="formattedFarmerProduces"
                          item-title="farmProduce.name"
                          item-value="id"
                          item-text="name"
                          label="Select Farm Produce"
                          variant="outlined"
                          prepend-inner-icon="mdi-fruit-grapes"
                          @update:model-value="farmProduceListingChanged"
                          return-object
                          class="tw-rounded-lg"
                      ></v-combobox>

                      <v-alert
                          v-if="formattedFarmerProduces?.length === 0"
                          type="info"
                          variant="tonal"
                          class="tw-rounded-lg"
                      >
                        No produce found.
                        <router-link
                            class="tw-underline tw-font-medium"
                            style="color: #2563eb;"
                            :to="{name: 'Produces', params: { farmerId: getCurrentUserId }}"
                        >
                          Add produce first
                        </router-link>
                      </v-alert>
                    </div>

                    <v-combobox
                        v-model="listing.unit"
                        :items="units"
                        label="Unit of Measurement"
                        variant="outlined"
                        prepend-inner-icon="mdi-scale-balance"
                        class="tw-rounded-lg"
                    ></v-combobox>
                  </div>
                </div>

                <!-- Quantity & Pricing Section -->
                <div class="tw-mb-8">
                  <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4 tw-flex tw-items-center">
                    <v-icon class="tw-mr-2 tw-text-green-600">mdi-calculator</v-icon>
                    Quantity & Pricing
                  </h3>

                  <div class="tw-grid md:tw-grid-cols-3 tw-gap-6">
                    <v-text-field
                        v-model="listing.quantity"
                        :label="`Quantity (${listing.unit})`"
                        type="number"
                        variant="outlined"
                        prepend-inner-icon="mdi-package-variant"
                        min="1"
                        class="tw-rounded-lg"
                    ></v-text-field>

                    <vuetify-money
                        v-model="listing.price.price"
                        :label="`Price per ${listing.unit}`"
                        variant="outlined"
                        prepend-inner-icon="mdi-currency-usd"
                        :options="{
                        locale: 'en-US',
                        prefix: 'Ksh. ',
                        length: 11,
                        precision: 2,
                      }"
                        :rules="[required('price')]"
                        class="tw-rounded-lg"
                    ></vuetify-money>

                    <vuetify-money
                        label="Total Amount"
                        variant="outlined"
                        readonly
                        prepend-inner-icon="mdi-cash-multiple"
                        :value="listing.price.price * listing.quantity"
                        :options="vuetifyMoneyOptions"
                        class="tw-rounded-lg tw-bg-green-50"
                    ></vuetify-money>
                  </div>
                </div>

                <!-- Photo Section -->
                <div class="tw-mb-8">
                  <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4 tw-flex tw-items-center">
                    <v-icon class="tw-mr-2 tw-text-green-600">mdi-camera</v-icon>
                    Product Photos
                  </h3>

                  <photo-gallery
                      ref="photoGallery"
                      :photos="listing.photos"
                      @delete-photo="deletePhoto"
                      @add-photo="photoCaptureDialog = true"
                      class="tw-border tw-border-gray-200 tw-rounded-lg tw-p-4"
                  />
                </div>

                <!-- Action Button -->
                <div class="tw-flex tw-justify-center tw-pt-6">
                  <v-btn
                      size="x-large"
                      rounded="xl"
                      :loading="loading"
                      @click="postListing"
                      class="btn btn-primary"
                      elevation="0"
                  >
                    <v-icon class="tw-mr-2">mdi-upload</v-icon>
                    Post Listing
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </div>

        <!-- Right Panel - Preview & Tips -->
        <div class="tw-space-y-6">
          <!-- Listing Preview -->
          <v-card class="tw-shadow-lg tw-rounded-2xl tw-border-0 tw-overflow-hidden">
            <div class="tw-bg-gradient-to-r tw-from-blue-600 tw-to-indigo-600 tw-p-4">
              <h3 class="tw-text-lg tw-font-semibold tw-text-white tw-flex tw-items-center">
                <v-icon class="tw-mr-2 tw-text-white">mdi-eye</v-icon>
                Preview
              </h3>
            </div>

            <v-card-text class="tw-p-6">
              <div class="tw-space-y-4">
                <div class="tw-flex tw-items-center tw-justify-between">
                  <span class="tw-text-sm tw-text-gray-600">Product:</span>
                  <span class="tw-font-medium">{{ selectedProduce?.name || 'Not selected' }}</span>
                </div>

                <div class="tw-flex tw-items-center tw-justify-between">
                  <span class="tw-text-sm tw-text-gray-600">Quantity:</span>
                  <span class="tw-font-medium">{{ listing.quantity }} {{ listing.unit }}</span>
                </div>

                <div class="tw-flex tw-items-center tw-justify-between">
                  <span class="tw-text-sm tw-text-gray-600">Unit Price:</span>
                  <span class="tw-font-medium tw-text-green-600">Ksh. {{ listing.price.price }}</span>
                </div>

                <div class="tw-flex tw-items-center tw-justify-between tw-border-t tw-pt-2">
                  <span class="tw-text-sm tw-font-semibold tw-text-gray-800">Total:</span>
                  <span class="tw-font-bold tw-text-lg tw-text-green-600">
                    Ksh. {{ (listing.price.price * listing.quantity).toFixed(2) }}
                  </span>
                </div>

                <div class="tw-flex tw-items-center tw-justify-between">
                  <span class="tw-text-sm tw-text-gray-600">Photos:</span>
                  <span class="tw-font-medium">{{ listing.photos.length }} uploaded</span>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Tips Card -->
          <v-card class="tw-shadow-lg tw-rounded-2xl tw-border-0 tw-overflow-hidden">
            <div class="tw-bg-gradient-to-r tw-from-amber-500 tw-to-orange-500 tw-p-4">
              <h3 class="tw-text-lg tw-font-semibold tw-text-white tw-flex tw-items-center">
                <v-icon class="tw-mr-2 tw-text-white">mdi-lightbulb</v-icon>
                Tips for Success
              </h3>
            </div>

            <v-card-text class="tw-p-6">
              <div class="tw-space-y-4">
                <div class="tw-flex tw-items-start tw-space-x-3">
                  <v-icon class="tw-text-green-500 tw-mt-1">mdi-check-circle</v-icon>
                  <p class="tw-text-sm tw-text-gray-700">Add clear, high-quality photos of your produce</p>
                </div>

                <div class="tw-flex tw-items-start tw-space-x-3">
                  <v-icon class="tw-text-green-500 tw-mt-1">mdi-check-circle</v-icon>
                  <p class="tw-text-sm tw-text-gray-700">Set competitive prices based on market rates</p>
                </div>

                <div class="tw-flex tw-items-start tw-space-x-3">
                  <v-icon class="tw-text-green-500 tw-mt-1">mdi-check-circle</v-icon>
                  <p class="tw-text-sm tw-text-gray-700">Ensure accurate quantity measurements</p>
                </div>

                <div class="tw-flex tw-items-start tw-space-x-3">
                  <v-icon class="tw-text-green-500 tw-mt-1">mdi-check-circle</v-icon>
                  <p class="tw-text-sm tw-text-gray-700">Update your listing regularly for freshness</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>

    <!-- Photo Capture Dialog -->
    <v-dialog v-model="photoCaptureDialog" max-width="500px">
      <PhotoCapture @captured-photos="handleCapturedPhotos" />
    </v-dialog>
  </div>
</template>

<script>
import HelperMixins from '@/mixins/helperMixins.js';
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles.js';
import validations from '@/utils/validations.js';
import CardTitle from '@/components/shared/CardTitle.vue';
import PhotoGallery from '@/components/pictures/PhotoGallery.vue';
import PhotoCapture from '@/components/pictures/PhotoCapture.vue';

export default {
  name: 'CreateListing',
  components: {
    PhotoCapture,
    PhotoGallery,
    // eslint-disable-next-line vue/no-unused-components
    CardTitle,
  },
  mixins: [HelperMixins],
  data() {
    return {
      units: ['KG', 'L'],
      selectedProduce: null,
      farmer: {
        id: 'string',
        name: 'string',
        email: 'string',
        phoneNumber: 'string',
        createdAt: '2025-01-25T09:38:38.536Z',
        location: {
          latitude: 0.0,
          longitude: 0.0,
          customName: '',
        },
        farmerProduces: [
          {
            id: 'string',
            farmer: 'string',
            farmProduce: {
              id: 'string',
              name: 'string',
              description: 'string',
              farmingType: 'string',
              status: 'INACTIVE',
            },
            status: 'INACTIVE',
          },
        ],
      },
      listing: {
        farmerProduceId: '',
        quantity: 1,
        price: {
          price: 0,
          currency: 'KSH',
        },
        unit: 'KG',
        photos: [],
      },
      photoCaptureDialog: false,
      imagePreviews: [],
      isValid: false,
      ...validations,
      loading: false,
    };
  },
  mounted() {
    axios.get(`/farmers-service/farmer?farmerId=${getCurrentUserId()}`).then((response) => {
      if (response.data.data == null) throw Error('User not found');
      this.farmer = { ...this.farmer, ...response.data.data };
    }).catch((e) => {
      this.$toast.error(e.message);
    });
  },
  computed: {
    getCurrentUserId,
    formattedFarmerProduces() {
      return this.farmer.farmerProduces.map((item) => ({
        id: item.id,
        name: item.farmProduce.name,
      }));
    },
    vuetifyMoneyOptions() {
      return {
        locale: 'en-US',
        prefix: 'Ksh. ',
        length: 11,
        precision: 2,
      };
    },
  },
  methods: {
    farmProduceListingChanged(farmProduce) {
      if (farmProduce) {
        this.selectedProduce = farmProduce;
        const farmProduceTense = farmProduce.name;
        this.units = [farmProduceTense, 'KG', 'L'];
        this.listing.unit = 'KG';
        this.listing.farmerProduceId = farmProduce.id;
      }
    },
    handleCapturedPhotos(photos) {
      this.listing.photos.push(...photos);
      this.$toast.success('Photos added successfully');
      this.photoCaptureDialog = false;
    },
    deletePhoto(photoId) {
      const index = this.listing.photos.findIndex((photo) => photo.id === photoId);
      if (index > -1) {
        URL.revokeObjectURL(this.listing.photos[index].url);
        this.listing.photos.splice(index, 1);
      }
    },
    previewImages() {
      this.imagePreviews = [];
      if (this.listing.images) {
        this.listing.images.forEach((file) => {
          this.imagePreviews.push(URL.createObjectURL(file));
        });
      }
    },
    validateImages(value) {
      // eslint-disable-next-line no-mixed-operators
      return value.length >= 1 && value.length <= 3 || 'You must upload between 1 and 3 images';
    },
    async postListing() {
      if (!this.isValid || this.listing.farmerProduceId === '' || this.listing.price.price <= 0) {
        this.$toast.error('Please fill in all required information');
        return;
      }

      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('farmerProduceId', this.listing.farmerProduceId);
        formData.append('unit', this.listing.unit);
        formData.append('quantity', this.listing.quantity);
        formData.append('price', this.listing.price.price);
        formData.append('currency', this.listing.price.currency);

        if (this.listing.photos.length) {
          this.listing.photos.forEach((photo) => {
            formData.append('images', photo.url);
          });
        }

        const response = await axios.post('/farmers-service/listing', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.success) {
          this.farmerProduces = response.data.data;
          this.$toast.success('Listing posted successfully!');
          // Reset form
          this.resetForm();
        } else {
          this.$toast.error(`Failed to post listing: ${response.data.msg}`);
        }
      } catch (error) {
        this.$toast.error(`Error posting listing: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.selectedProduce = null;
      this.listing = {
        farmerProduceId: '',
        quantity: 1,
        price: {
          price: 0,
          currency: 'KSH',
        },
        unit: 'KG',
        photos: [],
      };
    },
  },
};
</script>

<style scoped>
/* Additional custom styles if needed */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
}
</style>
