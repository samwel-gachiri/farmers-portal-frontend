<template>
  <Default>
    <div class="tw-bg-white tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-2 tw-relative">
      <!-- AI-themed background graphics -->
      <div aria-hidden="true" class="tw-absolute tw-inset-0 tw-pointer-events-none tw-z-0">
        <svg class="tw-absolute tw-top-0 tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-opacity-20" width="480" height="180" viewBox="0 0 480 180" fill="none">
          <ellipse cx="240" cy="90" rx="220" ry="70" fill="#34d399"/>
          <ellipse cx="120" cy="40" rx="60" ry="20" fill="#10b981"/>
          <ellipse cx="360" cy="140" rx="80" ry="30" fill="#6ee7b7"/>
        </svg>
        <svg class="tw-absolute tw-bottom-0 tw-right-0 tw-opacity-10" width="180" height="120" viewBox="0 0 180 120" fill="none">
          <ellipse cx="90" cy="60" rx="80" ry="40" fill="#34d399"/>
          <ellipse cx="140" cy="100" rx="30" ry="10" fill="#10b981"/>
        </svg>
      </div>
      <div class="tw-w-full tw-max-w-xl tw-mt-10 tw-mb-6">
        <div class="tw-flex tw-items-center tw-space-x-3 tw-mb-2">
          <v-icon class="tw-text-green-600" size="32px">mdi-sprout</v-icon>
          <span class="tw-text-2xl tw-font-semibold tw-text-gray-800">FarmAI</span>
        </div>
        <div class="tw-text-base tw-text-gray-500 tw-mb-4">
          Uliza maswali kuhusu ukulima hapa
        </div>
      </div>
      <div class="tw-w-full tw-max-w-xl tw-bg-gray-50 tw-rounded-xl tw-shadow-sm tw-flex tw-flex-col tw-h-[480px] tw-relative tw-z-10">
        <div id="chat-messages" class="tw-flex-1 tw-p-4 tw-overflow-y-auto tw-space-y-3 tw-text-base tw-text-gray-800 tw-bg-transparent">
          <!-- Messages will appear here -->
        </div>
        <div class="tw-border-t tw-border-gray-200 tw-p-3 tw-bg-white">
          <div class="tw-flex tw-items-end tw-space-x-2">
            <v-textarea
              v-model="aiQuestion"
              outlined
              rounded
              hide-details
              placeholder="Andika swali lako hapa..."
              rows="1"
              auto-grow
              class="tw-flex-1 tw-bg-gray-100 tw-rounded-lg tw-border-none focus:tw-ring-2 focus:tw-ring-green-500"
              style="min-height:40px;"
              @keyup.enter="askAI"
            ></v-textarea>
            <v-btn
              color="success"
              class="tw-rounded-full tw-shadow-none"
              :loading="loading"
              :disabled="!aiQuestion.trim()"
              @click="askAI"
              elevation="0"
              min-width="40"
              height="40"
            >
              <v-icon size="22px">mdi-send</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" class="tw-rounded-lg">
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false" class="tw-text-green-700">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </Default>
</template>

<script>
import Default from '@/components/layout/Default.vue';
// eslint-disable-next-line no-unused-vars
import { getCurrentUserId, getCurrentUserRole } from '@/utils/roles.js';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default {
  components: {
    Default,
  },
  data() {
    return {
      loading: false,
      aiQuestion: '',
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
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
  mounted() {
    this.gemini = new GoogleGenerativeAI(this.geminiApiKey);
    this.addMessage('FarmAI', 'Karibu! Uliza swali lolote kuhusu ukulima.');
  },
  methods: {
    getCurrentUserRole,
    async askAI() {
      try {
        if (!this.aiQuestion.trim()) {
          this.showSnackbar('Tafadhali andika swali', 'error');
          return;
        }
        this.addMessage('Wewe', this.aiQuestion);
        this.loading = true;
        const question = this.aiQuestion;
        this.aiQuestion = '';

        // Create bot message element first
        const botMessageElement = this.addMessage('FarmAI', '...');
        const contentElement = botMessageElement.querySelector('.message-content');

        try {
          const model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
          const result = await model.generateContent(question);
          const response = await result.response;
          const text = response.text();

          contentElement.innerHTML = DOMPurify.sanitize(this.md.render(text));
          this.showSnackbar('Jibu limetolewa', 'success');
        } catch (error) {
          contentElement.textContent = 'Hitilafu imetokea. Tafadhali jaribu tena.';
          this.showSnackbar('Hitilafu kupata jibu', 'error');
        }
      } catch (e) {
        this.showSnackbar(e.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    addMessage(sender, content) {
      const chatMessages = document.getElementById('chat-messages');
      const messageElement = document.createElement('div');
      const mdContent = DOMPurify.sanitize(this.md.render(content));
      messageElement.className = sender === 'Wewe'
        ? 'tw-bg-green-50 tw-text-green-900 tw-p-3 tw-rounded-lg tw-self-end'
        : 'tw-bg-white tw-text-gray-800 tw-p-3 tw-rounded-lg tw-shadow-sm tw-self-start';

      messageElement.innerHTML = `
        <div class="tw-text-xs tw-font-semibold tw-mb-1 ${sender === 'Wewe' ? 'tw-text-green-700' : 'tw-text-gray-500'}">${sender}</div>
        <div class="message-content">${mdContent}</div>
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
/* Minimalistic, modern, clean look */
#chat-messages {
  min-height: 180px;
  scrollbar-width: thin;
  scrollbar-color: #d1fae5 #f9fafb;
}
#chat-messages::-webkit-scrollbar {
  width: 6px;
}
#chat-messages::-webkit-scrollbar-thumb {
  background: #d1fae5;
  border-radius: 6px;
}
#chat-messages::-webkit-scrollbar-track {
  background: #f9fafb;
}

/* Ensure background graphics do not overlap content */
.tw-relative {
  position: relative;
}
.tw-absolute {
  position: absolute;
}
.tw-z-0 {
  z-index: 0;
}
.tw-z-10 {
  z-index: 10;
}
.tw-pointer-events-none {
  pointer-events: none;
}
</style>
