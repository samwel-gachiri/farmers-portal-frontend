<template>
  <div class="tw-flex tw-flex-col tw-justify-center tw-px-3">
    <logo-title class="tw-mb-3">
    </logo-title>
    <div class="tw-gap-0">
          <v-combobox
              v-model="selectedProduce"
              :items="produceList"
              item-text="name"
              item-value="id"
              label="Select Produce"
              outlined
              @change="handleProduceSelection"
          ></v-combobox>
<!--          <v-list-item-group class="tw-overflow-y-scroll tw-grid tw-grid-cols-4">-->
<!--            <v-list-item class="tw-flex tw-justify-between tw-m-2 tw-p-0" v-for="(farmerProduce, i) in farmerProduces" :key="i">{{farmerProduce.farmProduce.name}}-->
<!--              <v-icon class="hover:tw-visible tw-invisible" size="20" color="error">mdi-close-circle</v-icon>-->
<!--            </v-list-item>-->
<!--          </v-list-item-group>-->
          <v-textarea
              v-model="newProduceDesc"
              label="Input Produce description"
              outlined
          ></v-textarea>
          <v-combobox
              v-model="newProduceFarmingType"
              label="Farming type"
              :items="farmingTypes"
              outlined
          ></v-combobox>
          <div class="tw-flex tw-justify-center tw-items-center">
            <v-btn color="primary" @click="addNewProduce">
              <v-icon>mdi-leaf</v-icon>
              Add My Produce
            </v-btn>
          </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles.js';
import LogoTitle from '@/components/shared/LogoText.vue';
import { farmingTypes } from '@/assets/data/farmingTypes.js';

export default {
  name: 'add-farmer-produce',
  components: { LogoTitle },
  data() {
    return {
      produceList: [], // To store list of produces fetched from '/produce'
      selectedProduce: null, // To store the selected produce by user
      newProduceName: '', // To store the name of new produce entered by user
      newProduceDesc: '',
      newProduceFarmingType: '',
      farmingTypes,
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
      try {
        const response = await axios.get('/produce');
        this.produceList = response.data.data;
      } catch (error) {
        this.$toast.error('Error fetching produces:', error.message);
      }
    },
    // Handles selection of produce from v-select
    handleProduceSelection() {
      if (this.selectedProduce) {
        this.addFarmerProduce(this.selectedProduce.id);
      }
    },
    // Adds a new produce based on user input
    async addNewProduce() {
      if (this.newProduceName) {
        try {
          const response = await axios.post('/produce', {
            name: this.newProduceName,
            description: this.newProduceDesc, // Add description if needed
            farmingType: this.newProduceFarmingType, // Add farmingType if needed
          });
          const newProduce = response.data.data;
          this.produceList.push(newProduce); // Add new produce to local list
          this.addFarmerProduce(newProduce.id); // Add new produce to farmer's produces
        } catch (error) {
          this.$toast.error('Error adding new produce:', error.message);
        }
      }
    },
    // Adds selected produce to farmer's produces using '/farmer/add-farmer-produce'
    async addFarmerProduce(produceId) {
      if (produceId == null) {
        this.newProduceName = this.selectedProduce;
        await this.addNewProduce(this.selectedProduce);
      }
      let farmerHasProduce = false;
      this.farmerProduces.forEach((farmerProduce) => {
        if (farmerProduce.farmProduce.id === produceId) {
          this.$toast.error('Farmer already has produce');
          farmerHasProduce = true;
        }
      });
      if (!farmerHasProduce) {
        try {
          await axios.post('/farmer/add-farmer-produce', {
            farmerId: getCurrentUserId(),
            farmerProducesId: [produceId],
          }).then((response) => {
            if (response.data.success === true) {
              this.farmerProduces = response.data.data;
              this.$toast.success('Added successfully to farmer!');
            } else {
              this.$toast.error('Addition failed!', response.data.msg);
            }
          });
        } catch (error) {
          this.$toast.error('Error adding produce to farmer!', `${error}`);
        }
      }
    },
  },
};
</script>

<style lang="scss">
/* Add your Tailwind CSS styles or customize Vuetify components here */
</style>
