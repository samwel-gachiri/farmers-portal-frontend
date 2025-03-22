<template>
  <v-card>
    <v-card-title>
      <span class="text-xl font-bold">Listing Details</span>
    </v-card-title>
    <v-card-text>
      <div v-if="listing">
        <p><strong>ID:</strong> {{ listing.produceListing.id }}</p>
        <p><strong>Price:</strong> {{ listing.produceListing.price.price.toLocaleString() }} {{ listing.produceListing.price.currency }} per {{listing.produceListing.unit}}</p>
        <p><strong>Earnings:</strong> {{ listing.earnings }} {{listing.produceListing.price.currency}}</p>
        <p><strong>Rating:</strong> {{ listing.produceListing.rating }}</p>
        <p><strong>Status:</strong> {{ listing.produceListing.status }}</p>
        <p><strong>Quantity Sold:</strong> {{ listing.quantitySold }} {{ listing.produceListing.unit }}</p>
        <p><strong>Quantity Left:</strong> {{ listing.quantityLeft }} {{ listing.produceListing.unit }}</p>
        <p><strong>No of purchases:</strong> {{ listing.noOfPurchases }} <v-icon>mdi-arrow-down</v-icon></p>

        <v-divider class="my-4"></v-divider>

        <h3 class="text-lg font-bold mb-2">Orders</h3>
        <v-data-table
            :headers="orderHeaders"
            :items="listing.produceListing.listingOrders"
            class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn v-if="item.status === 'PENDING_ACCEPTANCE'" small color="success" @click="acceptOrder(item)">Accept</v-btn>
            <v-btn v-if="item.status === 'BOOKED_FOR_SUPPLY'" small color="success" disabled>confirm pay</v-btn>
            <v-btn v-if="item.status === 'SUPPLIED'" small color="success" @click="confirmPayment(item)">confirm pay</v-btn>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Listing',
  data() {
    return {
      orderHeaders: [
        { text: 'Buyer ID', value: 'buyerId' },
        { text: 'Date Created', value: 'dateCreated' },
        { text: 'Quantity ordered', value: 'quantity' },
        { text: 'Date Accepted', value: 'dateAccepted' },
        { text: 'Date Supplied', value: 'dateSupplied' },
        { text: 'Date Paid', value: 'datePaid' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      listing: {
        quantitySold: 2,
        quantityLeft: 8,
        earnings: 200,
        noOfPurchases: 1,
        produceListing: {
          id: '68d2ad3f-8042-4089-bb97-557bb670580a',
          quantity: 10,
          price: {
            price: 100,
            currency: 'KSH',
          },
          unit: 'pineapples',
          rating: 0,
          status: 'ACTIVE',
          farmerProduce: {
            id: '3cf68e23-a729-40fc-affa-a5e1be7a5473',
            farmProduce: {
              id: 'f209e2c3-b35e-497a-8ffe-8d5b8f0ec7f6',
              name: 'pineapple',
              description: '',
              farmingType: '',
              status: 'ACTIVE',
            },
            status: 'ON_SALE',
          },
          listingOrders: [
            {
              id: '3f4e3ba6-ab11-4ee2-9b27-cff10420aac6',
              buyerId: '8dd3971f-b1b8-45c7-aedd-15f33e5b6cbf',
              dateCreated: '2025-02-11T07:56:31',
              dateAccepted: '2025-02-11T08:01:44',
              dateSupplied: null,
              datePaid: null,
              quantity: 2,
              status: 'BOOKED_FOR_SUPPLY',
            },
          ],
        },
      },
      loading: false,
      intervalId: null,
    };
  },
  props: {
    listingId: {
      type: String,
      default: '',
    },
  },
  mounted() {
    // this.intervalId = setInterval(() => {
    // }, 3000);
    this.fetchListing().then(() => this.connectToSSE());
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    connectToSSE() {
      const eventSource = new EventSource(
        `${process.env.VUE_APP_API_BASE_URL}farmers-service/listing/stream?listingId=${this.listing.produceListing.id}`,
        // `${process.env.VUE_APP_API_BASE_URL}/listing/stream-sse`,
      );

      // Listen for custom event types
      eventSource.addEventListener('supply-confirmed', (event) => {
        this.$toast.success('Supply confirmed for an order you made', `Supply for ${event.data}`);
        this.fetchListing();
      });

      // Listen for custom event types
      eventSource.addEventListener('order-added-to-listing', () => {
        this.$toast.success('Order has been made', 'New order!!!');
        this.fetchListing();
      });

      eventSource.onmessage = (event) => {
        this.$toast.error('Received event:', event.data);
        this.fetchListing();
      };

      eventSource.onopen = () => {
        this.$toast.show('SSE connection opened');
      };

      eventSource.onerror = (error) => {
        this.$toast.error('SSE error:', error.message);
        eventSource.close();
      };
    },
    async fetchListing() {
      this.loading = true;
      try {
        const response = await axios.get('/farmers-service/listing', {
          params: {
            listingId: this.listingId,
          },
        });
        this.listing = response.data.data;
      } catch (error) {
        this.$toast.error('Error fetching listing');
      } finally {
        this.loading = false;
      }
    },
    // Accept an order
    acceptOrder(order) {
      axios.put(`/farmers-service/listing/order/accept?orderId=${order.id}&listingId=${this.listing.produceListing.id}`).then((response) => {
        if (response.data.success === true) {
          this.$toast.success('Order accepted');
        } else {
          this.$toast.error(response.data.msg, 'Failed to accept order');
        }
      })
        .catch((error) => {
          this.$toast.error(error.message);
        })
        .finally(() => {
          this.fetchListing();
        });
    },
    confirmPayment(order) {
      axios.put(`/farmers-service/listing/order/confirm-payment?orderId=${order.id}&listingId=${this.listing.produceListing.id}`).then((response) => {
        if (response.data.success === true) {
          this.$toast.success('Payment confirmed', order.id);
        } else {
          this.$toast.error(response.data.msg, 'Failed to confirm payment');
        }
      })
        .catch((error) => {
          this.$toast.error(error.message);
        })
        .finally(() => {
          this.fetchListing();
        });
    },
  },
};
</script>

<style scoped>

</style>
