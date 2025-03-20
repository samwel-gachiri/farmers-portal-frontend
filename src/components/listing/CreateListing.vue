<template>
  <v-card>
    <v-form v-model="isValid" class="tw-py-4 tw-pr-3 tw-flex tw-flex-col tw-justify-center">
      <div class="tw-w-full tw-flex tw-justify-center tw-flex-col">
        <logo-title>
          <h2>Sell your produce</h2>
        </logo-title>
        <div class="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-5 tw-m-5">
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
<!--              :rules="[required('produce')]"-->
          <vuetify-money
              v-model="listing.price.price"
              :label="`Input the price`"
              :options="{
                locale: 'en-US',
                prefix: 'Ksh. ',
                suffix: `/${listing.unit}`,
                length: 11,
                precision: 2,
              }"
              :rules="[required('price')]"
          ></vuetify-money>
          <number-input
              label="Quantity"
              v-model="listing.quantity"
              :min="1"
              :initial-value="listing.quantity"
          ></number-input>
          <v-combobox
              v-model="listing.unit"
              dense
              label="Give in measurement"
              :items="units"
          ></v-combobox>
          <vuetify-money
              label="Total"
              readonly
              :value="listing.price.price * listing.quantity"
              :options="vuetifyMoneyOptions"
          ></vuetify-money>
          <v-btn
              style="background-color: darkgreen; color: white;"
              :disabled="!isValid || listing.farmerProduceId === '' || listing.price.price <= 0"
              :loading="loading"
              @click="postListing "
          >Post<v-icon>mdi-gesture-two-tap</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="tw-text-center tw-mt-6">
      </div>
    </v-form>
  </v-card>
</template>

<script >

import LogoTitle from '@/components/shared/LogoText.vue';
import HelperMixins from '@/mixins/helperMixins.js';
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles.js';
import NumberInput from '@/components/shared/NumberInput.vue';
import validations from '@/utils/validations.js';

export default {
  name: 'CreateListing',
  components: { NumberInput, LogoTitle },
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
      },
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
    postListing() {
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
    },
  },
};
</script>

<style scoped>

</style>
