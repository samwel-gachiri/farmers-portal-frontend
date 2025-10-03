<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="headline">
        <v-icon left color="primary">mdi-lightbulb-outline</v-icon>
        Suggest Improvement
      </v-card-title>

      <v-card-text>
        <p class="mb-4">Help us improve AgriBackup by sharing your suggestions and feedback.</p>

        <v-form ref="feedbackForm" v-model="valid">
          <v-text-field
            v-model="feedback.title"
            label="Title"
            :rules="[rules.required]"
            outlined
            dense
            class="mb-3"
          />

          <v-textarea
            v-model="feedback.description"
            label="Description"
            :rules="[rules.required, rules.minLength]"
            outlined
            rows="4"
            hint="Please provide details about your suggestion or the issue you're experiencing"
            persistent-hint
            class="mb-3"
          />

          <v-select
            v-model="feedback.category"
            :items="categories"
            label="Category"
            outlined
            dense
            class="mb-3"
          />

          <v-text-field
            v-model="feedback.email"
            label="Email (optional)"
            type="email"
            outlined
            dense
            hint="We'll use this to follow up if needed"
            persistent-hint
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="submitting"
          :disabled="!valid"
          @click="submitFeedback"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'FeedbackDialog',
  data() {
    return {
      dialog: false,
      valid: false,
      submitting: false,
      feedback: {
        title: '',
        description: '',
        category: '',
        email: '',
      },
      categories: [
        'User Interface',
        'Features',
        'Performance',
        'Bug Report',
        'Other',
      ],
      rules: {
        required: (value) => !!value || 'This field is required.',
        minLength: (value) => (value && value.length >= 10) || 'Please provide at least 10 characters.',
      },
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.resetForm();
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    resetForm() {
      this.feedback = {
        title: '',
        description: '',
        category: '',
        email: '',
      };
      if (this.$refs.feedbackForm) {
        this.$refs.feedbackForm.resetValidation();
      }
    },

    async submitFeedback() {
      if (!this.$refs.feedbackForm.validate()) return;

      this.submitting = true;

      try {
        // Here you would typically send the feedback to your backend
        // For now, we'll just simulate the submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.$toast.success('Thank you for your feedback! We appreciate your input.');
        this.closeDialog();
      } catch (error) {
        this.$toast.error('Failed to submit feedback. Please try again.');
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.headline {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}
</style>
