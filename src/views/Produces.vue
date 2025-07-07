<template>
  <default>
    <div v-if="!loading" class="tw-w-full tw-h-screen">
      <!-- Dialogs -->
      <add-farmer-produce
          :farmer-produces="farmer.farmerProduces"
          ref="addFarmerProduce"
          @close="this.addProduceDialog = false"
      ></add-farmer-produce>

      <v-dialog v-model="listingDialog" max-width="500px">
        <create-listing></create-listing>
      </v-dialog>

      <v-dialog v-model="editProduceDialog" max-width="500px">
        <v-card>
          <card-title>Edit Produce</card-title>
          <v-card-text>
            <edit-produce-form
                :key="selectedFarmerProduce?.id"
                :selected-farmer-produce="selectedFarmerProduce"></edit-produce-form>
          </v-card-text>
          <v-card-actions class="tw-justify-end">
            <v-btn color="primary" @click="() => { editProduceDialog = false; fetchFarmerDetails();}">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Main Content -->
      <div>
        <!-- Header -->
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-4 md:tw-pl-0 tw-px-4">
          <div class="tw-flex tw-flex-col">
            <h2 class="tw-text-lg tw-font-semibold">Produces</h2>
            <h2 class="tw-text-lg tw-font-semibold tw-p-2 tw-rounded-lg" style="background-color: gainsboro;">
              {{ farmer.name }}
            </h2>
          </div>
          <v-btn
            v-if="getCurrentUserId === farmer.id"
            icon
            color="primary"
            @click="$refs.addFarmerProduce.openDialog()"
            aria-label="Add Produce"
          >
            <v-icon>mdi-plus</v-icon>
            Add
          </v-btn>
        </div>

        <!-- Responsive Produces Display -->
        <div v-if="!isMobile">
          <!-- Table for desktop -->
          <v-data-table
            :headers="produceTableHeaders"
            :items="farmer.farmerProduces"
            :loading="loading"
            class="elevation-1"
          >
            <!--            :server-items-length="totalElements"-->
            <!-- Custom Row Template -->

<!--          <template v-slot:item.actions="{ item }">-->
<!--                :src="item.imageUrls.length > 0 ? item.imageUrls[0]: ''"-->
          <template v-slot:item.images="{ item }">
            <v-img
                v-for="(imageUrl, i) in item.imageUrls"
                :key="i"
                :src="imageUrl"
                width="100px"
                height="100px"
            />
          </template>
          <template v-slot:item.edit="{ item }">
            <v-btn small @click="()=>{editProduceDialog = true; selectedFarmerProduce = item}">
              <v-icon color="mdi-edit">mdi-pencil</v-icon>
              Edit
            </v-btn>
          </template>
          <template v-slot:item.delete="{  }">
            <v-btn small @click="listingDialog = true">
              <v-icon color="red">mdi-trash-can</v-icon>
              Delete
            </v-btn>
          </template>
          <template v-slot:item.actions="{  }">
            <v-btn small color="secondary" @click="listingDialog = true">sell</v-btn>
          </template>
          <template v-slot:item.description="{ item }">
            <div v-html="renderMarkdown(item.description)"></div>
          </template>
        </v-data-table>
        </div>
        <div v-else>
          <!-- Cards for mobile -->
          <div class="tw-grid tw-grid-cols-1 tw-gap-4 tw-p-2">
            <div
              v-for="item in farmer.farmerProduces"
              :key="item.id"
              class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-4 tw-flex tw-flex-col tw-gap-2 tw-relative"
              aria-label="Produce Card"
            >
              <div class="tw-flex tw-items-center tw-gap-3">
                <v-img
                  v-if="item.imageUrls && item.imageUrls.length"
                  :src="item.imageUrls[0]"
                  width="80"
                  height="80"
                  class="tw-rounded-lg tw-border tw-border-gray-200"
                  alt="Produce image"
                />
                <div>
                  <div class="tw-font-bold tw-text-lg">{{ item.farmProduce.name }}</div>
                  <div class="tw-text-xs tw-text-gray-500">{{ item.farmingType }}</div>
                </div>
              </div>
              <div class="tw-mt-2 tw-text-gray-700 tw-text-sm" v-html="renderMarkdown(item.description)"></div>
              <div class="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                <span class="tw-text-xs tw-px-2 tw-py-1 tw-rounded tw-bg-green-100 tw-text-green-700">{{ item.status }}</span>
              </div>
              <div class="tw-flex tw-gap-2 tw-mt-3">
                <v-btn small color="primary" @click="()=>{editProduceDialog = true; selectedFarmerProduce = item}" aria-label="Edit">
                  <v-icon left>mdi-pencil</v-icon>Edit
                </v-btn>
                <v-btn small color="error" @click="listingDialog = true" aria-label="Delete">
                  <v-icon left>mdi-trash-can</v-icon>Delete
                </v-btn>
                <v-btn small color="secondary" @click="listingDialog = true" aria-label="Sell">
                  Sell
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-else class="tw-flex tw-justify-center tw-items-center tw-h-screen">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <!-- Share Dialog -->
    <v-dialog v-model="showDialog" max-width="400">
      <v-card>
        <v-card-title>Share this profile</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item @click="copyUrl">
              <v-list-item-icon><v-icon>mdi-content-copy</v-icon></v-list-item-icon>
              <v-list-item-title>Copy URL</v-list-item-title>
            </v-list-item>
            <v-list-item @click="shareToWhatsApp">
              <v-list-item-icon><v-icon>mdi-whatsapp</v-icon></v-list-item-icon>
              <v-list-item-title>Share to WhatsApp</v-list-item-title>
            </v-list-item>
            <v-list-item @click="shareToFacebook">
              <v-list-item-icon><v-icon>mdi-facebook</v-icon></v-list-item-icon>
              <v-list-item-title>Share to Facebook</v-list-item-title>
            </v-list-item>
            <v-list-item @click="shareToInstagram">
              <v-list-item-icon><v-icon>mdi-instagram</v-icon></v-list-item-icon>
              <v-list-item-title>Share to Instagram</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Feedback -->
    <v-snackbar v-model="showSnackbar" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </default>
</template>

<script>
import { getCurrentUserId } from '@/utils/roles.js';
import axios from 'axios';
import CreateListing from '@/components/listing/CreateListing.vue';
import AddFarmerProduce from '@/components/produce/AddFarmersProduce.vue';
import Default from '@/components/layout/Default.vue';
import Auth from '@aws-amplify/auth';
import EditProduceForm from '@/components/produce/EditProduceForm.vue';
import CardTitle from '@/components/shared/CardTitle.vue';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

export default {
  components: {
    CardTitle,
    EditProduceForm,
    Default,
    AddFarmerProduce,
    CreateListing,
  },
  data() {
    return {
      produceTableHeaders: [
        { text: 'Image', value: 'images' },
        { text: 'Produce', value: 'farmProduce.name' },
        { text: 'Description', value: 'description' },
        { text: 'Farming Type', value: 'farmingType' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
        { text: 'Edit', value: 'edit', sortable: false },
        // { text: 'Delete', value: 'delete', sortable: false },
      ],
      farmer: {
        id: '',
        name: '',
        email: '',
        phoneNumber: '',
        createdAt: '2025-01-25T09:38:38.536Z',
        location: {
          latitude: 0.0,
          longitude: 0.0,
          customName: '',
        },
        farmerProduces: [],
      },
      selectedFarmerProduce: null,
      addProduceDialog: false,
      listingDialog: false,
      editProduceDialog: false,
      showDialog: false,
      showSnackbar: false,
      snackbarMessage: '',
      loading: false,
      isMobile: false,
      md: new MarkdownIt({
        html: true,
        xhtmlOut: true,
        breaks: true,
        linkify: true,
        typographer: true,
        strict: true,
      }),
    };
  },
  mounted() {
    this.loading = true;
    this.fetchFarmerDetails();
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    getCurrentUserId,
  },
  methods: {
    fetchFarmerDetails() {
      axios.get(`/farmers-service/farmer?farmerId=${this.$route.params.farmerId}`)
        .then(async (response) => {
          if (response.data.data == null) {
            await this.$store.dispatch('auth/signOut').then(() => {
              // localStorage.removeItem(NOTIFICATIONS);
              if (caches) {
                caches.keys().then((arr) => {
                  arr.forEach((key) => {
                    caches.delete(key);
                  });
                });
              }
              this.$store.commit('setClient', []);
              window.location.href = '/';
              this.$router.push({ name: 'Landing' });
            });
            const user = await Auth.currentAuthenticatedUser();
            if (user !== null && user.attributes.sub === this.$route.params.farmerId) {
              this.farmer = {
                id: user.attributes.sub,
                name: user.attributes.name,
                email: '',
                phoneNumber: user.attributes.phone_number,
                createdAt: '',
                farmerProduces: [],
              };
              axios.post('/farmers-service/farmer', this.farmer).then((res) => {
                if (res.data.success === true) {
                  this.$toast.success('User added to database');
                }
              });
            }
            this.$toast.error('User not found');
            this.$router.go(-1);
          }
          this.farmer = { ...this.farmer, ...response.data.data };
        })
        .catch((e) => {
          this.$toast.error(e.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openShareDialog() {
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    },
    copyUrl() {
      const currentUrl = window.location.href;
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          this.snackbarMessage = 'URL copied to clipboard!';
          this.showSnackbar = true;
        })
        .catch((err) => {
          this.snackbarMessage = 'Failed to copy URL.';
          this.showSnackbar = true;
          this.$toast.error('Failed to copy URL: ', err.message);
        });
    },
    shareToWhatsApp() {
      const currentUrl = encodeURIComponent(window.location.href);
      window.open(`https://wa.me/?text=${currentUrl}`, '_blank');
    },
    shareToFacebook() {
      const currentUrl = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank');
    },
    shareToInstagram() {
      this.snackbarMessage = 'Instagram does not support direct URL sharing.';
      this.showSnackbar = true;
      window.open('https://www.instagram.com', '_blank');
    },
    handleResize() {
      this.isMobile = window.innerWidth < 768;
    },
    renderMarkdown(text) {
      return DOMPurify.sanitize(this.md.render(text || ''));
    },
  },
  watch: {
    listingDialog(newValue) {
      if (newValue !== true) {
        this.fetchFarmerDetails();
      }
    },
  },
};
</script>

<style scoped>
.tw-bg-gradient-to-r {
  background: linear-gradient(to right, #e0f7fa, #e8f5e9);
}
/* Add subtle card hover for mobile cards */
.tw-card-hover:hover {
  box-shadow: 0 4px 14px 0 rgba(0,0,0,0.09);
}
</style>
