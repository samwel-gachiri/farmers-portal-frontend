<template>
  <div class="flex justify-center mt-8">
    <v-app>
      <v-container>
        <logo-title>
          <h2>Andika unachouza</h2>
        </logo-title>
        <v-row align="center" justify="center" class="tw-gap-0">
          <v-col cols="12" class="tw-m-0 tw-p-0 tw-border">
            <v-combobox
                v-model="selectedProduce"
                :items="produceList"
                item-text="name"
                item-value="id"
                label="Select Produce"
                outlined
                @change="handleProduceSelection"
            ></v-combobox>
          </v-col>
          <v-col cols="12" class="tw-border">
            <v-list-item-group class="tw-overflow-y-scroll tw-grid tw-grid-cols-4">
              <v-list-item class="tw-flex tw-justify-between tw-rounded-lg tw-bg-green-800 tw-m-2 tw-p-0" v-for="(farmerProduce, i) in farmerProduces" :key="i">{{farmerProduce.farmProduce.name}}
                <v-icon class="hover:tw-visible tw-invisible" size="20" color="error">mdi-close-circle</v-icon>
              </v-list-item>
            </v-list-item-group>
          </v-col>
          <v-col cols="12" class="">
            <v-text-field
                v-model="newProduceName"
                label="New Produce Name"
                outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" @click="addNewProduce">Add New Produce</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles';
import LogoTitle from '@/components/shared/LogoText';

export default {
  name: 'add-farmer-produce',
  components: { LogoTitle },
  data() {
    return {
      produceList: [], // To store list of produces fetched from '/produce'
      selectedProduce: null, // To store the selected produce by user
      newProduceName: '', // To store the name of new produce entered by user
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
            description: '', // Add description if needed
            farmingType: '', // Add farmingType if needed
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
