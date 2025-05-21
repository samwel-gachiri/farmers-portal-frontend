<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card class="ai-assistant-card">
      <v-toolbar color="primary" dark flat>
        <v-avatar size="40" class="mr-2">
          <v-img src="@/assets/images/ai_avatar.png"></v-img>
        </v-avatar>
        <v-toolbar-title>AgriAI Assistant</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <div class="ai-conversation">
        <div v-for="(message, index) in conversation" :key="index" :class="['message', message.type]">
          <div class="message-content">
            <div class="message-bubble">
              <div v-if="message.type === 'ai'" class="ai-avatar">
                <v-icon color="primary">mdi-robot</v-icon>
              </div>
              <div class="text">
                {{ message.text }}
                <div v-if="message.type === 'ai' && message.actions" class="quick-actions">
                  <v-chip
                      v-for="(action, i) in message.actions"
                      :key="i"
                      small
                      class="mr-1 mb-1"
                      @click="handleQuickAction(action)"
                  >
                    {{ action }}
                  </v-chip>
                </div>
              </div>
              <div v-if="message.type === 'user'" class="user-avatar">
                <v-icon color="green">mdi-account</v-icon>
              </div>
            </div>
            <div class="message-time">
              {{ message.time }}
            </div>
          </div>
        </div>

        <div v-if="isListening" class="listening-indicator">
          <div class="pulse"></div>
          <v-icon color="red">mdi-microphone</v-icon>
          <span>Listening...</span>
        </div>
      </div>

      <v-divider></v-divider>

      <div class="ai-input">
        <v-text-field
            v-model="userInput"
            placeholder="Ask me anything about your farm..."
            outlined
            rounded
            dense
            hide-details
            @keyup.enter="sendMessage"
            ref="inputField"
        >
          <template v-slot:append>
            <v-btn icon @click="toggleVoice" :color="isListening ? 'red' : 'primary'">
              <v-icon>mdi-microphone</v-icon>
            </v-btn>
            <v-btn icon color="primary" @click="sendMessage">
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AiAssistant',
  props: {
    dialog: Boolean,
  },
  data() {
    return {
      userInput: '',
      isListening: false,
      conversation: [
        {
          type: 'ai',
          text: 'Hello! I\'m your AgriAI assistant. How can I help you with your farm today?',
          time: 'Just now',
          actions: ['Field status', 'Irrigation report', 'Pest alerts'],
        },
      ],
    };
  },
  methods: {
    sendMessage() {
      if (!this.userInput.trim()) return;

      // Add user message
      this.conversation.push({
        type: 'user',
        text: this.userInput,
        time: 'Just now',
      });

      // Simulate AI response
      setTimeout(() => {
        this.conversation.push({
          type: 'ai',
          text: this.generateAIResponse(this.userInput),
          time: 'Just now',
          actions: ['Show details', 'View report', 'Take action'],
        });
        this.scrollToBottom();
      }, 1000);

      this.userInput = '';
      this.scrollToBottom();
    },
    generateAIResponse(input) {
      const responses = [
        `I've analyzed your query about "${input}". The soil moisture levels are optimal and no immediate action is needed.`,
        `Regarding "${input}", my sensors show everything is within normal parameters. Would you like a detailed report?`,
        `I've checked the status for "${input}". All systems are functioning properly across your fields.`,
        `For "${input}", I recommend checking the irrigation schedule as we're expecting dry weather soon.`,
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    },
    toggleVoice() {
      this.isListening = !this.isListening;
      if (this.isListening) {
        // Start voice recognition
        this.$refs.inputField.focus();
      }
    },
    handleQuickAction(action) {
      this.userInput = action;
      this.sendMessage();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.ai-conversation');
        container.scrollTop = container.scrollHeight;
      });
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        this.$nextTick(() => {
          this.scrollToBottom();
          this.$refs.inputField.focus();
        });
      }
    },
  },
};
</script>

<style scoped>
.ai-assistant-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
}

.ai-conversation {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
  background: linear-gradient(to bottom, rgba(245, 250, 255, 0.8), rgba(240, 248, 255, 0.9));
}

.message {
  margin-bottom: 16px;
  display: flex;
}

.message.ai {
  justify-content: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 80%;
}

.message-bubble {
  display: flex;
  align-items: flex-end;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.ai .message-bubble {
  background: rgba(230, 240, 255, 0.9);
  border-bottom-left-radius: 4px;
}

.user .message-bubble {
  background: rgba(220, 250, 230, 0.9);
  border-bottom-right-radius: 4px;
  flex-direction: row-reverse;
}

.ai-avatar, .user-avatar {
  margin-right: 8px;
  margin-left: 8px;
  display: flex;
  align-items: center;
}

.text {
  flex-grow: 1;
}

.message-time {
  font-size: 0.7rem;
  color: #666;
  margin-top: 4px;
  text-align: right;
}

.ai .message-time {
  text-align: left;
}

.quick-actions {
  margin-top: 8px;
}

.ai-input {
  padding: 12px;
}

.listening-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 20px;
  margin: 8px 0;
}

.listening-indicator span {
  margin-left: 8px;
}

.pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  margin-right: 8px;
  animation: pulse-animation 1.5s infinite;
}

@keyframes pulse-animation {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.3);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
}

.v-chip {
  cursor: pointer;
  transition: all 0.2s;
}

.v-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
