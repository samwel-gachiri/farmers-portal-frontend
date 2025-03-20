<template>
  <v-dialog v-model="isOpen" max-width="800px">
    <v-card v-if="selectedFarmer">
      <v-card-title>
        <span class="text-h5">{{ selectedFarmer.farmer.name }}</span>
      </v-card-title>

      <v-card-subtitle>
        Location: {{ selectedFarmer.customName }}
      </v-card-subtitle>

      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="6">
            <v-btn :color="isConnected ? 'red' : 'green'" @click="toggleConnection">
              {{ isConnected ? "Disconnect" : "Connect" }}
            </v-btn>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <h3 class="mt-4">Products</h3>
        <v-chip-group v-if="farmerProducts.length">
          <v-chip v-for="product in farmerProducts" :key="product.id" color="primary">
            {{ product.name }}
          </v-chip>
        </v-chip-group>
        <p v-else>No products available</p>

        <v-divider class="my-4"></v-divider>

        <h3>Listings</h3>
        <v-data-table
            :headers="headers"
            :items="listings"
            item-value="id"
            class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-text-field
                v-model="orderQuantities[item.id]"
                label="Quantity"
                type="number"
                dense
                class="mr-2"
            ></v-text-field>
            <v-btn color="primary" @click="orderListing(item)">Order</v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    selectedFarmer: Object,
    buyerId: String,
  },
  data() {
    return {
      isOpen: false,
      listings: [],
      farmerProducts: [],
      isConnected: false,
      orderQuantities: {},
      headers: [
        { text: 'Produce', value: 'farmerProduce.farmProduce.name' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Unit', value: 'unit' },
        { text: 'Price', value: 'price.price' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  watch: {
    selectedFarmer: {
      immediate: true,
      handler(newFarmer) {
        if (newFarmer) {
          this.isOpen = true;
          this.fetchListings();
          this.fetchFarmerProducts();
          this.checkConnection();
        }
      },
    },
  },
  methods: {
    async fetchListings() {
      try {
        const response = await axios.get('/farmers-service/listing/farmer', {
          params: { farmerId: this.selectedFarmer.farmer.id, pageable: { page: 0, size: 10 } },
        });
        this.listings = response.data.data.content || [];
      } catch (error) {
        console.error('Error fetching listings:', error.message);
      }
    },

    async fetchFarmerProducts() {
      try {
        const response = await axios.get('/farmers-service/products', {
          params: { farmerId: this.selectedFarmer.farmer.id },
        });
        this.farmerProducts = response.data.data || [];
      } catch (error) {
        console.error('Error fetching farmer products:', error.message);
      }
    },

    async checkConnection() {
      try {
        const response = await axios.get(`/connection-service/farmers/${this.buyerId}`);
        const connectedFarmers = response.data.data || [];
        this.isConnected = connectedFarmers.some((f) => f.farmerId === this.selectedFarmer.farmer.id);
      } catch (error) {
        this.$toast.error('Error checking connection:', error.message);
      }
    },

    async toggleConnection() {
      const url = this.isConnected ? '/connection-service/disconnect' : '/connection-service/connect';
      try {
        const response = await axios({
          method: this.isConnected ? 'DELETE' : 'POST',
          url,
          data: { farmerId: this.selectedFarmer.farmer.id, buyerId: this.buyerId },
        });
        if (response.data.success) this.isConnected = !this.isConnected;
      } catch (error) {
        this.$toast.error('Error updating connection:', error.message);
      }
    },

    async orderListing(listing) {
      const quantity = Number(this.orderQuantities[listing.id]);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        this.$toast.error('Enter a valid quantity.');
        return;
      }

      try {
        const response = await axios.post('/farmers-service/listing/order', {
          listingId: listing.id,
          buyerId: this.buyerId,
          quantity,
        });
        if (response.data.success) this.$toast.success('Order placed successfully!');
        else this.$toast.error(response.data.msg);
      } catch (error) {
        this.$toast.error('Error placing order:', error.message);
      }
    },

    closeDialog() {
      this.isOpen = false;
      this.$emit('close');
    },
  },
};
</script>
