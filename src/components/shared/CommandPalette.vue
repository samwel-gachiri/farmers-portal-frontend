<template>
  <div class="command-palette-container">
    <!-- Search Input -->
    <v-text-field
      ref="searchInput"
      v-model="query"
      class="command-palette-input"
      dense
      rounded
      solo-inverted
      hide-details
      clearable
      prepend-inner-icon="mdi-magnify"
      :placeholder="placeholder"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.escape="closeDropdown"
      @keydown.enter="selectFirst"
      @keydown.down.prevent="navigateDown"
      @keydown.up.prevent="navigateUp"
    >
      <template v-slot:append>
        <v-chip x-small class="keyboard-hint" v-if="!isFocused">
          Ctrl+K
        </v-chip>
        <v-btn
          v-if="isOnline && query.length > 2"
          icon
          x-small
          :loading="isLoadingAI"
          @click="askAI"
          title="Ask AI"
        >
          <v-icon small>mdi-robot</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <!-- Results Dropdown -->
    <v-card
      v-if="showDropdown"
      class="command-palette-dropdown"
      elevation="8"
    >
      <!-- Navigation Results -->
      <div v-if="filteredNavigation.length > 0" class="results-section">
        <div class="section-header">
          <v-icon small class="mr-1">mdi-compass</v-icon>
          Navigation
        </div>
        <v-list dense class="nav-results">
          <v-list-item
            v-for="(item, index) in filteredNavigation"
            :key="item.text"
            :class="{ 'highlighted': highlightedIndex === index }"
            @click="navigateTo(item)"
            @mouseenter="highlightedIndex = index"
          >
            <v-list-item-icon class="mr-2">
              <v-icon small :color="item.iconColor || '#2e7d32'">
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="nav-item-title">
                {{ item.text }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="item.parentSection" class="nav-item-subtitle">
                {{ item.parentSection }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon x-small color="grey">mdi-arrow-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>

      <!-- AI Response -->
      <div v-if="aiResponse" class="results-section ai-section">
        <div class="section-header">
          <v-icon small class="mr-1" color="primary">mdi-robot</v-icon>
          Agri-Copilot
        </div>
        <div class="ai-response-content">
          <p>{{ aiResponse }}</p>
          <v-btn
            v-if="aiNavigateRoute"
            small
            color="primary"
            class="mt-2"
            @click="navigateToRoute(aiNavigateRoute)"
          >
            <v-icon small left>mdi-arrow-right</v-icon>
            Go to {{ aiNavigateRoute }}
          </v-btn>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="query.length > 0 && filteredNavigation.length === 0 && !aiResponse && !isLoadingAI" class="no-results">
        <v-icon color="grey" class="mb-2">mdi-magnify-close</v-icon>
        <p>No matching pages found</p>
        <p class="hint" v-if="isOnline">Press Enter to ask AI for help</p>
        <p class="hint" v-else>You're offline - AI search unavailable</p>
      </div>

      <!-- Loading AI -->
      <div v-if="isLoadingAI" class="ai-loading">
        <v-progress-circular indeterminate size="24" color="primary" />
        <span class="ml-2">Asking Agri-Copilot...</span>
      </div>

      <!-- Recent Searches -->
      <div v-if="query.length === 0 && recentSearches.length > 0" class="results-section">
        <div class="section-header">
          <v-icon small class="mr-1">mdi-history</v-icon>
          Recent
        </div>
        <v-list dense>
          <v-list-item
            v-for="recent in recentSearches"
            :key="recent"
            @click.stop="selectRecentSearch(recent)"
          >
            <v-list-item-icon class="mr-2">
              <v-icon small>mdi-clock-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ recent }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>

      <!-- Quick Tips when empty -->
      <div v-if="query.length === 0 && recentSearches.length === 0" class="quick-tips">
        <p class="tip-title">Quick Tips</p>
        <p class="tip">Type a page name to navigate</p>
        <p class="tip">Ask questions like "How do I add a production unit?"</p>
      </div>
    </v-card>
  </div>
</template>

<script>
import Fuse from 'fuse.js';
import axios from 'axios';

export default {
  name: 'CommandPalette',
  props: {
    navigationItems: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: 'Search or ask anything...',
    },
  },
  data() {
    return {
      query: '',
      isFocused: false,
      showDropdown: false,
      highlightedIndex: 0,
      isOnline: navigator.onLine,
      isLoadingAI: false,
      aiResponse: null,
      aiNavigateRoute: null,
      recentSearches: [],
      fuse: null,
    };
  },
  computed: {
    filteredNavigation() {
      if (!this.query || this.query.length < 1) return [];
      if (!this.fuse) return [];

      const results = this.fuse.search(this.query, { limit: 8 });
      return results.map((r) => r.item);
    },
  },
  watch: {
    navigationItems: {
      immediate: true,
      handler(items) {
        this.initFuse(items);
      },
    },
    query() {
      this.highlightedIndex = 0;
      this.aiResponse = null;
      this.aiNavigateRoute = null;
    },
  },
  mounted() {
    // Load recent searches from localStorage
    this.loadRecentSearches();

    // Global keyboard shortcut
    document.addEventListener('keydown', this.handleGlobalKeydown);

    // Online/offline detection
    window.addEventListener('online', () => { this.isOnline = true; });
    window.addEventListener('offline', () => { this.isOnline = false; });
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleGlobalKeydown);
  },
  methods: {
    initFuse(items) {
      if (!items || items.length === 0) return;

      this.fuse = new Fuse(items, {
        keys: [
          { name: 'text', weight: 0.7 },
          { name: 'parentSection', weight: 0.3 },
        ],
        threshold: 0.4,
        distance: 100,
        includeScore: true,
      });
    },

    handleGlobalKeydown(e) {
      // Ctrl+K or Cmd+K to focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.focusInput();
      }
      // / to focus (when not in an input)
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.focusInput();
      }
    },

    focusInput() {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus();
      }
    },

    onFocus() {
      this.isFocused = true;
      this.showDropdown = true;
    },

    onBlur() {
      // Delay to allow click events on dropdown items
      setTimeout(() => {
        this.isFocused = false;
        this.showDropdown = false;
      }, 200);
    },

    closeDropdown() {
      this.showDropdown = false;
      this.query = '';
      if (this.$refs.searchInput) {
        this.$refs.searchInput.blur();
      }
    },

    navigateDown() {
      if (this.highlightedIndex < this.filteredNavigation.length - 1) {
        this.highlightedIndex += 1;
      }
    },

    navigateUp() {
      if (this.highlightedIndex > 0) {
        this.highlightedIndex -= 1;
      }
    },

    selectFirst() {
      if (this.filteredNavigation.length > 0) {
        this.navigateTo(this.filteredNavigation[this.highlightedIndex]);
      } else if (this.query.length > 2 && this.isOnline) {
        this.askAI();
      }
    },

    navigateTo(item) {
      if (!item.link) return;

      // Save to recent searches
      this.saveRecentSearch(item.text);

      // Navigate
      this.$router.push(item.link).catch(() => {});
      this.closeDropdown();
      this.$emit('navigate', item);
    },

    navigateToRoute(routeName) {
      this.$router.push({ name: routeName }).catch(() => {});
      this.closeDropdown();
    },

    selectRecentSearch(searchText) {
      this.query = searchText;
      this.showDropdown = true;
      // Re-focus input to keep dropdown visible
      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
      });
    },

    async askAI() {
      if (!this.isOnline || this.isLoadingAI) return;

      this.isLoadingAI = true;
      this.aiResponse = null;
      this.aiNavigateRoute = null;

      try {
        // Build context with visible navigation items
        const navContext = this.navigationItems
          .map((item) => `- ${item.text}${item.parentSection ? ` (${item.parentSection})` : ''}`)
          .join('\n');

        const { data } = await axios.post('/api/assistant/command-palette', {
          message: this.query,
          context: {
            userRole: this.$store.getters['auth/role'],
            currentRoute: this.$route.name,
            availablePages: navContext,
          },
        });

        this.aiResponse = data.message || data.content;

        // Check for navigation command
        if (this.aiResponse?.includes('NAVIGATE:')) {
          const match = this.aiResponse.match(/NAVIGATE:(\w+)/);
          if (match) {
            this.aiNavigateRoute = match[1];
            this.aiResponse = this.aiResponse.replace(/NAVIGATE:\w+/, '').trim();

            // Notify user of auto-navigation
            this.$toast.info(`Navigating to ${this.aiNavigateRoute}...`);

            // Automatic navigation for high confidence intents
            setTimeout(() => {
              if (this.aiNavigateRoute) {
                this.navigateToRoute(this.aiNavigateRoute);
              }
            }, 1500);
          }
        }
      } catch (error) {
        this.$toast.error('Unable to reach AI service. Please try again later.');
        this.aiResponse = 'AI connection error.';
      } finally {
        this.isLoadingAI = false;
        if (this.query.length > 2) {
          this.saveRecentSearch(this.query);
        }
      }
    },

    loadRecentSearches() {
      try {
        const saved = localStorage.getItem('commandPalette_recent');
        this.recentSearches = saved ? JSON.parse(saved) : [];
      } catch (e) {
        this.recentSearches = [];
      }
    },

    saveRecentSearch(text) {
      if (!text || text.length < 2) return;

      // Remove duplicates and add to front
      this.recentSearches = [
        text,
        ...this.recentSearches.filter((s) => s !== text),
      ].slice(0, 5);

      localStorage.setItem('commandPalette_recent', JSON.stringify(this.recentSearches));
    },
  },
};
</script>

<style scoped>
.command-palette-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.command-palette-input {
  background: rgba(255, 255, 255, 0.1) !important;
}

.command-palette-input >>> .v-input__slot {
  background: rgba(241, 245, 249, 0.9) !important;
  border: 1px solid #e2e8f0 !important;
}

.command-palette-input >>> input {
  color: #1e293b !important;
  caret-color: #1e293b !important;
}

.command-palette-input >>> input::placeholder {
  color: #94a3b8 !important;
}

.command-palette-input:focus-within >>> .v-input__slot {
  background: white !important;
  border-color: #2e7d32 !important;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.1) !important;
}

.keyboard-hint {
  font-size: 10px !important;
  height: 18px !important;
  background: #e2e8f0 !important;
  color: #64748b !important;
}

.command-palette-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  border-radius: 12px !important;
  border: 1px solid #e2e8f0;
}

.results-section {
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.results-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 4px 16px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
}

.nav-results >>> .v-list-item {
  min-height: 40px;
  border-radius: 6px;
  margin: 0 8px;
}

.nav-results >>> .v-list-item.highlighted {
  background: #f1f5f9;
}

.nav-item-title {
  font-size: 13px !important;
  font-weight: 500;
}

.nav-item-subtitle {
  font-size: 11px !important;
  color: #94a3b8 !important;
}

.ai-section {
  background: linear-gradient(135deg, #f0f9ff, #f0fdf4);
}

.ai-response-content {
  padding: 8px 16px 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #334155;
}

.ai-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #64748b;
  font-size: 13px;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  color: #94a3b8;
  text-align: center;
}

.no-results p {
  margin: 0;
}

.no-results .hint {
  font-size: 12px;
  margin-top: 4px;
}

.quick-tips {
  padding: 16px;
  color: #64748b;
}

.tip-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.tip {
  font-size: 12px;
  margin: 4px 0;
}
</style>
