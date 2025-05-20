<template>
  <Default>
    <div class="tw-overflow-hidden">
      <div class="tw-py-6">
        <div>
        </div>
        <div class="tw-rounded-lg tw-p-8">
          <div class="tw-text-lg tw-font-medium">
            <v-icon class="tw-mr-2 tw-bg-white" size="40px" light>mdi-emoticon-happy</v-icon>
            FarmAI
            <h2 class="tw-font-bold tw-text-black tw-pt-3">Uliza maswali kuhusiana na ukulima hapa</h2>
          </div>

          <div class="">
            <div id="chat-messages" class="tw-mt-4 tw-px-4 tw-bg-gray-50 tw-rounded-lg tw-max-h-96 tw-overflow-y-auto">
              <!-- Messages will appear here -->
            </div>
            <div class="tw-mt-4">
              <v-textarea
                  v-model="aiQuestion"
                  outlined
                  rounded
                  autofocus
                  label="Ask any farming question..."
                  rows="2"
                  class="tw-rounded-lg"
              ></v-textarea>
              <v-btn
                  rounded
                  color="primary"
                  class="tw-ml-4"
                  @click="askAI">
                Send
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
import { getCurrentUserId } from '@/utils/roles.js';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

export default {
  components: { Default },
  data() {
    return {
      aiQuestion: '',
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      md: new MarkdownIt({
        html: false, // Disable HTML tags in source
        xhtmlOut: true, // Use '/' to close single tags
        breaks: true, // Convert '\n' to `<br>`
        linkify: true, // Autoconvert URL-like text to links
        typographer: true, // Enable smartquotes and other typographic replacements
      }),
    };
  },
  mounted() {
    this.addMessage('Bot', 'Hello! I\'m farmAI, ready to help!\n**Habari yako!**');
  },
  methods: {
    async askAI() {
      try {
        if (!this.aiQuestion.trim()) {
          this.showSnackbar('Please enter a question', 'error');
          return;
        }

        this.addMessage('User', this.aiQuestion);
        const question = this.aiQuestion;
        this.aiQuestion = '';

        // Create bot message element first
        const botMessageElement = this.addMessage('FarmAI', '...');
        const contentElement = botMessageElement.querySelector('.message-content');

        try {
          const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: getCurrentUserId() || 'RANDOM',
              question,
            }),
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          await this.processStream(response.body.getReader(), contentElement);
          this.showSnackbar('FarmAI has provided recommendations', 'success');
        } catch (error) {
          this.$toast.error('Error:', error.message);
          contentElement.textContent = 'An error occurred while fetching the response. Please try again.';
          this.showSnackbar('Error getting response from FarmAI', 'error');
        }
      } catch (e) {
        this.showSnackbar(e.message, 'error');
      }
    },

    async processStream(reader, contentElement) {
      const decoder = new TextDecoder();
      let content = '';

      try {
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();
          if (done) break;

          content += decoder.decode(value, { stream: true });
          // Update content progressively
          // eslint-disable-next-line no-param-reassign
          contentElement.textContent = content;

          // Auto-scroll to bottom
          const chatContainer = document.getElementById('chat-messages');
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      } catch (error) {
        this.$toast.error('Stream error:', error.message);
        // eslint-disable-next-line no-param-reassign
        contentElement.textContent += '\n[Stream interrupted]';
      }
    },

    addMessage(sender, content) {
      const chatMessages = document.getElementById('chat-messages');
      const messageElement = document.createElement('div');
      const mdContent = DOMPurify.sanitize(this.md.render(content));
      messageElement.className = `tw-mb-3 tw-p-3 tw-rounded-lg tw-shadow-lg ${
        sender === 'User'
          ? 'tw-bg-blue-100 tw-text-blue-800'
          : 'tw-bg-gray-100 tw-text-gray-800'
      }`;

      messageElement.innerHTML = `
        <div class="tw-font-bold ${
  sender === 'User' ? 'tw-text-blue-600' : 'tw-text-green-600'
}">
          ${sender}:
        </div>
        <div class="message-content tw-mt-1">${mdContent}</div>
      `;

      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      return messageElement;
    },

    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
};
</script>

<style scoped>
#chat-messages {
  min-height: 200px;
}
</style>
