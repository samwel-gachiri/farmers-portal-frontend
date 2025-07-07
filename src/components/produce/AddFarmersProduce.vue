<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <v-card
      rounded="xl"
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
        <div class="tw-flex tw-flex-col tw-gap-5">
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
              allow-overflow
              solo
              :allow-new="true"
          >
          </v-combobox>
          <v-combobox
              v-if="false"
              dense
              class="data-input"
              v-model="newProduce.farmingType"
              label="Farming type"
              :items="farmingTypes"
          ></v-combobox>
        </div>
        <div class="tw-flex tw-my-5 tw-flex-col tw-gap-4">
          <v-textarea
              v-model="newProduce.desc"
              dense
              rounded
              class="data-input"
              label="Input produce description"
              :auto-grow="true"
              rows="2"
          ></v-textarea>
          <v-btn
            small
            color="success"
            class="tw-mb-2 tw-mt-[-8px] tw-w-fit"
            :loading="descLoading"
            @click="generateProduceDescription"
            :disabled="!selectedProduce"
          >
            <v-icon left size="18px">mdi-robot</v-icon>
            Generate Description
          </v-btn>
          <div v-if="descError" class="tw-text-red-600 tw-text-xs tw-mt-1">{{ descError }}</div>
          <!-- Markdown preview below the textarea -->
          <div
            v-if="newProduce.desc"
            class="tw-bg-white tw-border tw-border-gray-200 tw-rounded tw-p-3 tw-mb-2 tw-text-sm"
            v-html="descPreview"
            aria-live="polite"
          ></div>
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
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
      newProduceId: '', // Used to store the id of a newly created produce
      imagePreviews: [],
      farmingTypes,
      ...validations,
      loading: false,
      descLoading: false,
      descError: '',
      md: new MarkdownIt({
        html: true,
        xhtmlOut: true,
        breaks: true,
        linkify: true,
        typographer: true,
        strict: true,
      }),
      geminiApiKey: process.env.VUE_APP_GOOGLE_API_KEY,
      gemini: null,
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
    this.gemini = new GoogleGenerativeAI(this.geminiApiKey);
  },
  computed: {
    getCurrentUserId,
    descPreview() {
      // Render Markdown preview from plain text
      return DOMPurify.sanitize(this.md.render(this.newProduce.desc || ''));
    },
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
    /**
     * Adds a new produce to the catalogue and sets newProduceId.
     * Returns the new produce id.
     */
    async addNewProduce() {
      this.loading = true;
      try {
        const response = await axios.post('/farmers-service/produce', {
          name: this.newProduce.name,
          description: this.newProduce.desc,
          farmingType: this.newProduce.farmingType,
        });
        const newProduce = response.data.data;
        // Add new produce to local list for future reference
        this.produceList.push(newProduce);
        this.newProduceId = newProduce.id;
        return newProduce.id;
      } catch (error) {
        this.$toast.error('Error adding new produce:', error.message);
        return '';
      } finally {
        this.loading = false;
      }
    },

    /**
     * Gets the produce id for the selected produce name.
     * If not found, creates a new produce and returns its id.
     */
    async getOrCreateProduceId() {
      const produceName = (this.selectedProduce || '').trim();
      if (!produceName) return '';
      // Try to find existing produce by name (case-insensitive)
      const found = this.produceList.find(
        (produce) => produce.name.toLowerCase() === produceName.toLowerCase(),
      );
      if (found) {
        return found.id;
      }
      // Not found, create new produce
      this.newProduce.name = produceName;
      // eslint-disable-next-line no-return-await
      return await this.addNewProduce();
    },

    /**
     * Adds selected produce to farmer's produces using '/farmer/add-farmer-produce'
     * Ensures produceId is always supplied.
     */
    async addFarmerProduce() {
      if (!this.newProduce.isValid) {
        this.$toast.error('Give enough information');
        return;
      }
      this.loading = true;
      try {
        // Always get or create the produce id
        const produceId = await this.getOrCreateProduceId();
        if (!produceId) {
          this.$toast.error('Failed to get or create produce. Please try again.');
          return;
        }
        // Prepare form data
        const formData = new FormData();
        formData.append('farmerId', getCurrentUserId());
        formData.append('name', this.selectedProduce);
        formData.append('farmProduceId', produceId);
        formData.append('description', this.newProduce.desc);
        formData.append('farmingType', this.newProduce.farmingType);

        if (this.newProduce.images.length) {
          this.newProduce.images.forEach((file) => {
            formData.append('images', file);
          });
        }

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
    async generateProduceDescription() {
      this.descError = '';
      if (!this.selectedProduce) {
        this.descError = 'Please select or enter a produce name first.';
        return;
      }
      this.descLoading = true;
      const systemPrompt = 'You are an expert agricultural assistant. Given a produce name, generate a short, simple Markdown description for a farmer. If it is a crop, include: typical spacing, growth time, fertilizer, and any key info. If not a crop, give relevant farming details. Keep it concise and practical. Do not hallucinate';
      const userPrompt = `Produce: ${this.selectedProduce}${this.newProduce.farmingType ? `\nType: ${this.newProduce.farmingType}` : ''}`;
      try {
        const model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent([systemPrompt, userPrompt]);
        const response = await result.response;
        const text = response.text();
        // Store plain text (Markdown source) in textarea
        this.newProduce.desc = text;
      } catch (err) {
        this.descError = 'Failed to generate description. Try again.';
      } finally {
        this.descLoading = false;
      }
    },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.fetchProduces(); // Refresh produce list when dialog is closed
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
</style>
