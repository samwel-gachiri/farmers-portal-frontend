<template>
  <Default>
    <v-card>
      <v-card-title>My Orders</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="orders" class="elevation-1">
          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" dark>
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
                v-if="item.status === 'BOOKED_FOR_SUPPLY'"
                color="primary"
                @click="confirmSupply(item)">
              Confirm Supply
            </v-btn>
          </template>
          <template v-slot:item.view="{}">
            <v-btn color="secondary">
              <v-icon color="primary">mdi-notebook</v-icon>
              view
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
</v-card>
    <v-snackbar v-model="snackbar" :color="snackbarColor" top>
      {{ snackbarMessage }}
    </v-snackbar>
  </Default>
</template>

<script>
import axios from 'axios';
import { getCurrentUserId } from '@/utils/roles.js';
import Default from '@/components/layout/Default.vue';

export default {
  components: { Default },
  data() {
    return {
      orders: [],
      headers: [
        { text: 'Produce Name', value: 'produceName' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
        { text: 'View', value: 'view', sortable: false },
      ],
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      eventSources: [],
      metaInfo: {
        title: 'My Orders',
      },
    };
  },
  created() {
    this.fetchOrders();
  },
  beforeDestroy() {
    Object.values(this.eventSources).forEach((source) => {
      source.close();
    });
  },
  methods: {
    setUpEventSources() {
      this.orders.forEach((order) => {
        const listingId = order.listingId;
        if (!this.eventSources[listingId]) {
          this.eventSources[listingId] = new EventSource(
            `${process.env.VUE_APP_API_BASE_URL}farmers-service/listing/stream?listingId=${order.listingId}`,
            // `${process.env.VUE_APP_API_BASE_URL}/listing/stream-sse`,
          );

          // Listen for custom event types
          this.eventSources[listingId].addEventListener('order-accepted', () => {
            this.$toast.success('One of your orders has been accepted for supply!', 'Hurray!');
            this.fetchOrders();
          });

          // Listen for custom event types
          this.eventSources[listingId].addEventListener('supply-confirmed', (event) => {
            this.$toast.success('Supply confirmed for one of your orders', `Supply for ${event.data}`);
            this.fetchOrders();
          });

          // Listen for custom event types
          this.eventSources[listingId].addEventListener('payment-confirmed', () => {
            this.$toast.success('Payment has been confirmed to one of your orders', 'Finished!!');
            this.fetchOrders();
          });

          this.eventSources[listingId].onmessage = (event) => {
            this.$toast.error('Received event:', event.data);
            this.fetchListing();
          };

          this.eventSources[listingId].onopen = () => {
            this.$toast.show('SSE connection opened');
          };

          this.eventSources[listingId].onerror = (error) => {
            this.$toast.error('SSE error:', error.message);
            this.eventSources[listingId].close();
            delete this.eventSources[listingId];
          };
        }
      });
    },
    async fetchOrders() {
      try {
        const buyerId = getCurrentUserId();
        const response = await axios.get(`http://localhost:8080/farmers-service/listing-orders?buyerId=${buyerId}`);
        if (response.data.success) {
          this.orders = response.data.data;
          this.setUpEventSources();
        }
      } catch (error) {
        this.$toast.error('Error fetching orders:', error);
      }
    },
    async confirmSupply(order) {
      try {
        const response = await axios.put(`/farmers-service/listing/order/confirm-supply?orderId=${order.orderId}&listingId=${order.listingId}`);
        if (response.data.success) {
          this.fetchOrders();
        } else {
          this.$toast.error('Failed to update order', response.data.msg);
        }
      } catch (error) {
        this.$toast.error('An error occured', error.message);
      } finally {
        this.snackbar = true;
      }
    },
    getStatusColor(status) {
      const statusColors = {
        PENDING_ACCEPTANCE: 'orange',
        BOOKED_FOR_SUPPLY: 'blue',
        SUPPLIED: 'green',
      };
      return statusColors[status] || 'grey';
    },
  },
};
</script>
