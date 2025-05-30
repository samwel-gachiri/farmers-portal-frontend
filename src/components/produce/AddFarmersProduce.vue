<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <v-card
      rounded
      class="tw-flex tw-flex-col tw-justify-center tw-mt-4 action-panel"
    >
      <v-toolbar flat>
        <v-avatar size="40" class="tw-mr-2">
          <v-icon>mdi-corn</v-icon>
        </v-avatar>
        <v-toolbar-title>Add produce</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form v-model="newProduce.isValid" class="tw-gap-0">
        <div class="tw-flex tw-flex-row tw-gap-5">
          <v-combobox
              dense
              class="data-input"
              v-model="selectedProduce"
              :items="produceList.map((produce)=>produce.name)"
              label="Select or Enter Produce"
              clearable
              hide-no-data
              :rules="[required('Produce Name')]"
              :filter="() => true"
          >
<!--              @change="handleProduceInput"-->
<!--            <v-icon slot="prepend" color="primary" >mdi-text-search</v-icon>-->
          </v-combobox>
          <v-combobox
              dense
              class="data-input"
              v-model="newProduce.farmingType"
              label="Farming type"
              :items="farmingTypes"
          ></v-combobox>
        </div>
        <div class="tw-flex tw-my-5 tw-flex-col tw-gap-4">
          <v-textarea
              v-if="false"
              v-model="newProduce.desc"
              dense
              rounded
              class="data-input"
              label="Input produce description"
          ></v-textarea>
          <h6 class="tw-font-bold">{{newProduce.images.length > 1 ? 'Images': 'Image'}} Preview</h6>
          <v-file-input
              class="data-input"
              label="Provide Produce Image(s)"
              v-model="newProduce.images"
              accept="image/*"
              multiple
              dense
              chips
              counter
              :rules="[validateImages]"
              @change="previewImages"
          ></v-file-input>
          <div v-if="newProduce.images.length > 0" class="tw-flex tw-flex-row tw-justify-center tw-align-center">
            <v-img
                v-for="(image, index) in imagePreviews" :key="index"
                :src="image" aspect-ratio="1" contain
                width="100px"
                height="100px"
            ></v-img>
          </div>
        </div>
        <div class="tw-flex tw-justify-center tw-items-center">
          <v-btn :loading="loading" color="primary" @click="addFarmerProduce" style="color: white;" rounded>
            Add Produce
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
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
      dialog: false,
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
      return value.length <= 3 || 'Maximum images is 3';
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
      if (!this.newProduce.isValid) {
        this.$toast.error('Give enough information');
        return;
      }
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
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss">
.data-input {
  background-color: #FEEED5;
  border-radius: 10px;
  margin: 5px;
}
.action-panel {
  background-color: #FFF8F0;
  padding: 5px;
  border-radius: 10px;
}
/* Add your Tailwind CSS styles or customize Vuetify components here */
</style>
