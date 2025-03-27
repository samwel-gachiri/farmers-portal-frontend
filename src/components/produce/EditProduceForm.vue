<template>
  <div class="tw-flex tw-flex-col tw-justify-center tw-mt-4">
    <v-form v-model="updatedProduce.isValid" class="tw-gap-0">
      <v-row>
        <v-col>
          <v-text-field
              v-model="updatedProduce.name"
              label="Produce Name"
              outlined
              disabled
          ></v-text-field>
        </v-col>
        <v-col>
          <v-combobox
              v-model="updatedProduce.farmingType"
              label="Farming Type"
              :items="farmingTypes"
              outlined
          ></v-combobox>
        </v-col>
      </v-row>
      <v-textarea
          v-model="updatedProduce.desc"
          dense
          outlined
          label="Produce Description"
      ></v-textarea>
      <v-file-input
          label="Update Produce Image(s)"
          v-model="updatedProduce.newImages"
          accept="image/*"
          multiple
          outlined
          chips
          counter
          :rules="[validateImages]"
          @change="previewImages"
      ></v-file-input>
      <div v-if="imagePreviews.length || updatedProduce.imageUrls.length">
        <h2 class="blue--text">Image Previews</h2>
        <v-row>
          <v-col v-for="(image, index) in [...updatedProduce.imageUrls]" :key="index" cols="4">
            <v-img :src="image" aspect-ratio="1" contain>
              <v-btn @click="removeImage(image)" class="tw-opacity-0 hover:tw-opacity-100">remove</v-btn>
            </v-img>
          </v-col>
          <v-col v-for="(image, index) in [...imagePreviews]" :key="index" cols="4">
            <v-img :src="image" aspect-ratio="1" contain></v-img>
          </v-col>
        </v-row>
      </div>
      <div class="tw-flex tw-justify-center tw-items-center">
        <v-btn :loading="loading" :disabled="!updatedProduce.isValid" color="primary" @click="updateProduce">
          Update Produce
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios';
import { farmingTypes } from '@/assets/data/farmingTypes.js';
import validations from '@/utils/validations.js';

export default {
  name: 'update-farmer-produce',
  props: {
    selectedFarmerProduce: Object,
  },
  data() {
    return {
      updatedProduce: {
        isValid: false,
        id: this.selectedFarmerProduce.id,
        name: this.selectedFarmerProduce.farmProduce.name,
        desc: this.selectedFarmerProduce.description,
        farmingType: this.selectedFarmerProduce.farmingType,
        imageUrls: this.selectedFarmerProduce.imageUrls || [],
        removedImages: [],
        newImages: [],
      },
      imagePreviews: [],
      farmingTypes,
      ...validations,
      loading: false,
    };
  },
  methods: {
    removeImage(image) {
      this.updatedProduce.imageUrls = this.updatedProduce.imageUrls.filter((item) => item !== image);
      this.updatedProduce.removedImages.push(image);
    },
    previewImages() {
      this.imagePreviews = [];
      if (this.updatedProduce.newImages) {
        this.updatedProduce.newImages.forEach((file) => {
          this.imagePreviews.push(URL.createObjectURL(file));
        });
      }
    },
    validateImages(value) {
      return value.length <= 3 || 'You can upload up to 3 images only';
    },
    async updateProduce() {
      this.loading = true;
      const formData = new FormData();
      formData.append('id', this.updatedProduce.id);
      formData.append('description', this.updatedProduce.desc);
      formData.append('farmingType', this.updatedProduce.farmingType);
      formData.append('removedImageUrls', this.updatedProduce.removedImages);
      this.updatedProduce.newImages.forEach((file) => {
        formData.append('newImages', file);
      });
      try {
        const response = await axios.put(`/farmers-service/farmer/update-farmer-produce/${this.updatedProduce.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.success) {
          this.$toast.success('Produce updated successfully!');
        } else {
          this.$toast.error('Update failed:', response.data.msg);
        }
      } catch (error) {
        this.$toast.error('Error updating produce:', error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
/* Tailwind CSS styles */
</style>
