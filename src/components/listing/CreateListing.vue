<template>
  <v-card>
    <card-title
        icon="mdi-corn"
    >
      <h1 class="tw-text-lg tw-font-bold tw-text-gray-800">Post Produce</h1>
    </card-title>
    <v-card-text>
      <v-form v-model="isValid" class="tw-py-4 tw-flex tw-flex-col tw-justify-center">
        <div class="tw-w-full tw-flex tw-justify-center tw-flex-col">
  <!--        <logo-title>-->
  <!--          <h2>Sell your produce</h2>-->
  <!--        </logo-title>-->
          <div class="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-5">
            <div class="tw-flex tw-flex-col">
              <v-combobox
                  dense
                  :items="formattedFarmerProduces"
                  title="farmProduce.name"
                  item-value="id"
                  item-text="name"
                  label="Select farm produce"
                  @change="farmProduceListingChanged"
                  return-object
              ></v-combobox>
              <v-alert
                v-if="formattedFarmerProduces?.length === 0"
                type="info"
              >You seem not to have any produce. Please go to <router-link class="tw-underline" style="color: blue;" :to="{name: 'Produces', params: { farmerId: getCurrentUserId }}">My Produces</router-link> to add a produce first.</v-alert>
            </div>
            <v-combobox
                v-model="listing.unit"
                dense
                label="Give in measurement"
                :items="units"
            ></v-combobox>
  <!--              :rules="[required('produce')]"-->
            <number-input
                :label="`Quantity to sell in ${listing.unit}`"
                v-model="listing.quantity"
                :min="1"
                :initial-value="listing.quantity"
            ></number-input>
            <vuetify-money
                v-model="listing.price.price"
                :label="`Input the price`"
                :options="{
                  locale: 'en-US',
                  prefix: 'Ksh. ',
                  suffix: `per ${listing.unit}`,
                  length: 11,
                  precision: 2,
                }"
                :rules="[required('price')]"
            ></vuetify-money>
            <!-- Image Upload Section -->
            <vuetify-money
                label="Total"
                readonly
                :value="listing.price.price * listing.quantity"
                :options="vuetifyMoneyOptions"
            ></vuetify-money>
            <div v-if="false">
              <label class="tw-font-medium">Upload Images (Min: 1, Max: 3)</label>
            </div>
            <v-btn
                style="background-color: darkgreen; color: white;"
                :loading="loading"
                @click="postListing "
            >Post<v-icon>mdi-gesture-two-tap</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="tw-text-center tw-mt-6">
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script >

import HelperMixins from '@/mixins/helperMixins.js';
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles.js';
import NumberInput from '@/components/shared/NumberInput.vue';
import validations from '@/utils/validations.js';
import CardTitle from '@/components/shared/CardTitle.vue';

export default {
  name: 'CreateListing',
  components: { CardTitle, NumberInput },
  mixins: [HelperMixins],
  data() {
    return {
      units: ['KG', 'L'],
      farmer: {
        id: 'string',
        name: 'string',
        email: 'string',
        phoneNumber: 'string',
        createdAt: '2025-01-25T09:38:38.536Z',
        // rating: 3,
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
        unit: '',
        images: [],
      },
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
  },
  methods: {
    farmProduceListingChanged(farmProduce) {
      const farmProduceTense = farmProduce.name;
      this.units = [farmProduceTense, 'KG', 'L'];
      this.listing.unit = 'KG';
      this.listing.farmerProduceId = farmProduce.id;
    },
    previewImages() {
      this.imagePreviews = []; // Clear previous previews
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
    postListing() {
      if (!this.isValid || this.listing.farmerProduceId === '' || this.listing.price.price <= 0) {
        this.$toast.error('Please fill in all of the information');
        return;
      }
      this.loading = true;
      axios.post('/farmers-service/listing', {
        farmerProduceId: this.listing.farmerProduceId,
        price: this.listing.price,
        quantity: this.listing.quantity,
        unit: this.listing.unit,
      }).then((response) => {
        if (response.data.success === true) {
          this.$toast.success('Listing posted successfully');
        } else {
          this.$toast.error(response.data.msg, 'Error creating listing!');
        }
      }).catch((error) => {
        this.$toast.error(error);
      }).finally(() => this.loading === false);
      // this.loading = true;
      // const formData = new FormData();
      // formData.append('farmerProduceId', this.listing.farmerProduceId);
      // formData.append('price', JSON.stringify(this.listing.price));
      // formData.append('quantity', this.listing.quantity);
      // formData.append('unit', this.listing.unit);
      // this.listing.images.forEach((file, index) => {
      //   formData.append(`images[${index}]`, file);
      // });
      // axios.post('/farmers-service/listing', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // })
      //   .then((response) => {
      //     if (response.data.success === true) {
      //       this.$toast.success('Listing posted successfully');
      //     } else {
      //       this.$toast.error(response.data.msg, 'Error creating listing!');
      //     }
      //   })
      //   .catch((error) => {
      //     this.$toast.error('Error creating listing!', error.message);
      //   })
      //   .finally(() => {
      //     this.loading = false;
      //   });
    },
  },
};
</script>

<style scoped>

</style>
