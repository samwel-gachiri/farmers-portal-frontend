<template>
  <div class="tw-flex tw-flex-col tw-justify-center tw-mt-4">
    <v-form v-model="newProduce.isValid" class="tw-gap-0">
      <v-row>
        <v-col>
          <v-combobox
              v-model="selectedProduce"
              :items="produceList.map((produce)=>produce.name)"
              label="Select or Enter Produce"
              outlined
              clearable
              hide-no-data
              :rules="[required('Produce Name')]"
              :filter="() => true"
          >
<!--              @change="handleProduceInput"-->
<!--            <v-icon slot="prepend" color="primary" >mdi-text-search</v-icon>-->
          </v-combobox>
        </v-col>
        <v-col>
          <v-combobox
              v-model="newProduce.farmingType"
              label="Farming type"
              :items="farmingTypes"
              outlined
          ></v-combobox>
        </v-col>
      </v-row>
      <v-textarea
          v-model="newProduce.desc"
          dense
          outlined
          label="Input produce description"
      ></v-textarea>
      <v-file-input
          label="Provide Produce Image(s)"
          v-model="newProduce.images"
          accept="image/*"
          multiple
          outlined
          chips
          counter
          :rules="[validateImages]"
          @change="previewImages"
      ></v-file-input>
      <div v-if="newProduce.images.length > 0">
        <h2 class="blue--text">{{newProduce.images.length > 1 ? 'Images': 'Image'}} Preview</h2>
        <v-row>
          <v-col v-for="(image, index) in imagePreviews" :key="index" cols="4">
            <v-img :src="image" aspect-ratio="1" contain></v-img>
          </v-col>
        </v-row>
      </div>
      <div class="tw-flex tw-justify-center tw-items-center">
        <v-btn :loading="loading" :disabled="!newProduce.isValid" color="secondary" @click="addFarmerProduce">
          Add Produce
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles.js';
import { farmingTypes } from '@/assets/data/farmingTypes.js';
import validations from '@/utils/validations.js';

export default {
  name: 'add-farmer-produce',
  data() {
    return {
      produceList: [], // To store list of produces fetched from '/produce'
      selectedProduce: null, // To store the selected produce by user
      newProduce: {
        isValid: false,
        name: '',
        desc: '',
        farmingType: '',
        images: [],
      },
      newProduceId: '',
      imagePreviews: [],
      farmingTypes,
      ...validations,
      loading: false,
    };
  },
  props: {
    farmerProduces: {
      type: Array,
      default: () => [
        {
          id: '80a20596-056e-4e45-a010-2e6ef56e4757',
          farmProduce: {
            id: 'e1c0a0f8-307d-435b-a337-421c88feb62e',
            name: 'banana',
            description: '',
            farmingType: '',
            status: 'ACTIVE',
          },
          status: 'ON_FARM',
        },
      ],
    },
  },
  created() {
    this.fetchProduces(); // Fetch produces when component is created
  },
  computed: {
    getCurrentUserId,
  },
  methods: {
    // Fetches list of produces from '/produce' endpoint
    async fetchProduces() {
      this.loading = true;
      try {
        const response = await axios.get('/farmers-service/produce');
        this.produceList = response.data.data;
      } catch (error) {
        this.$toast.error('Error fetching produces:', error.message);
      } finally {
        this.loading = false;
      }
    },
    previewImages() {
      this.imagePreviews = []; // Clear previous previews
      if (this.newProduce.images) {
        this.newProduce.images.forEach((file) => {
          this.imagePreviews.push(URL.createObjectURL(file));
        });
      }
    },
    validateImages(value) {
      // eslint-disable-next-line no-mixed-operators
      return value.length >= 1 && value.length <= 3 || 'You must upload between 1 and 3 images';
    },
    // Handles selection of produce from v-select
    handleProduceInput() {
    },
    // Adds a new produce based on user input
    async addNewProduce() {
      this.loading = true;
      try {
        const response = await axios.post('/farmers-service/produce', {
          name: this.newProduce.name,
          description: this.newProduce.desc,
          farmingType: this.newProduce.farmingType,
        });
        const newProduce = response.data.data;
        this.produceList.push(newProduce); // Add new produce to local list
        this.newProduceId = newProduce.id;
      } catch (error) {
        this.$toast.error('Error adding new produce:', error.message);
      } finally {
        this.loading = false;
      }
    },
    // Adds selected produce to farmer's produces using '/farmer/add-farmer-produce'
    async addFarmerProduce() {
      this.newProduce.name = this.selectedProduce;
      this.loading = true;
      let produceId = '';
      this.produceList.forEach((produce) => {
        if (produce.name.toLowerCase() === this.newProduce.name.toLowerCase()) {
          produceId = produce.id;
        }
      });
      if (produceId === '') {
        await this.addNewProduce();
        produceId = this.newProduceId;
      }
      if (produceId === '') {
        this.$toast.success('New produce added to the catalogue, reload to continue', 'success');
      }
      const formData = new FormData();
      formData.append('farmerId', getCurrentUserId());
      formData.append('name', this.newProduce.name);
      formData.append('farmProduceId', produceId);
      formData.append('description', this.newProduce.desc);
      formData.append('farmingType', this.newProduce.farmingType);

      if (this.newProduce.images.length) {
        this.newProduce.images.forEach((file) => {
          formData.append('images', file);
        });
      }

      try {
        const response = await axios.post('/farmers-service/farmer/add-farmer-produce', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.success) {
          this.farmerProduces = response.data.data;
          this.$toast.success('Added successfully to farmer!');
        } else {
          this.$toast.error('Addition failed!', response.data.msg);
        }
      } catch (error) {
        this.$toast.error('Error adding produce to farmer!', `${error}`);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
/* Add your Tailwind CSS styles or customize Vuetify components here */
</style>
