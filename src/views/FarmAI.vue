<template>
  <Default>
    <div class="tw-overflow-hidden">
      <div
          v-for="(star, index) in stars"
          :key="index"
          class="star"
          :style="starStyle(star)"
      ></div>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title class="tw-text-xl tw-font-semibold">
          <v-icon large left class="tw-mr-2">mdi-robot-outline</v-icon>
          FarmAI Advisor
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-chip color="white" text-color="primary" class="tw-mr-2">
          <v-icon left small>mdi-weather-cloudy</v-icon>
          {{ weatherStatus }}
        </v-chip>
      </v-toolbar>

      <v-container class="tw-py-6 tw-px-8">
        <v-alert
          type="info"
      >Under development</v-alert>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="tw-rounded-lg tw-shadow-md tw-h-full">
              <v-card-title class="tw-bg-green-50 tw-text-green-800 tw-text-lg tw-font-medium">
                <v-icon color="green" class="tw-mr-2">mdi-sprout-outline</v-icon>
                Crop Growth Insights
              </v-card-title>
              <v-card-text class="tw-p-6">
                <div class="tw-mb-4">
                  <v-select
                      v-model="selectedCrop"
                      :items="crops"
                      label="Select your crop"
                      outlined
                      dense
                      class="tw-rounded-lg"
                      prepend-icon="mdi-corn"
                  ></v-select>
                </div>

                <div v-if="selectedCrop" class="tw-space-y-4">
                  <div class="tw-p-4 tw-bg-blue-50 tw-rounded-lg">
                    <div class="tw-flex tw-items-center tw-mb-2">
                      <v-icon color="blue" class="tw-mr-2">mdi-calendar-check</v-icon>
                      <h3 class="tw-text-blue-800 tw-font-medium">Current Growth Stage</h3>
                    </div>
                    <p class="tw-text-gray-700">{{ cropStages[selectedCrop] }}</p>
                  </div>

                  <div class="tw-p-4 tw-bg-purple-50 tw-rounded-lg">
                    <div class="tw-flex tw-items-center tw-mb-2">
                      <v-icon color="purple" class="tw-mr-2">mdi-lightbulb-on-outline</v-icon>
                      <h3 class="tw-text-purple-800 tw-font-medium">AI Recommendations</h3>
                    </div>
                    <ul class="tw-list-disc tw-list-inside tw-text-gray-700 tw-space-y-1">
                      <li v-for="(tip, index) in cropTips[selectedCrop]" :key="'crop-tip-'+index">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div v-else class="tw-text-center tw-py-8 tw-text-gray-500">
                  <v-icon large color="grey" class="tw-mb-2">mdi-help-circle-outline</v-icon>
                  <p>Select a crop to get AI-powered recommendations</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="tw-rounded-lg tw-shadow-md tw-h-full">
              <v-card-title class="tw-bg-blue-50 tw-text-blue-800 tw-text-lg tw-font-medium">
                <v-icon color="blue" class="tw-mr-2">mdi-cow</v-icon>
                Livestock Development
              </v-card-title>
              <v-card-text class="tw-p-6">
                <div class="tw-mb-4">
                  <v-select
                      v-model="selectedLivestock"
                      :items="livestock"
                      label="Select your livestock"
                      outlined
                      dense
                      class="tw-rounded-lg"
                      prepend-icon="mdi-paw"
                  ></v-select>
                </div>

                <div v-if="selectedLivestock" class="tw-space-y-4">
                  <div class="tw-p-4 tw-bg-green-50 tw-rounded-lg">
                    <div class="tw-flex tw-items-center tw-mb-2">
                      <v-icon color="green" class="tw-mr-2">mdi-chart-line</v-icon>
                      <h3 class="tw-text-green-800 tw-font-medium">Health Indicators</h3>
                    </div>
                    <p class="tw-text-gray-700">{{ livestockHealth[selectedLivestock] }}</p>
                  </div>

                  <div class="tw-p-4 tw-bg-amber-50 tw-rounded-lg">
                    <div class="tw-flex tw-items-center tw-mb-2">
                      <v-icon color="amber" class="tw-mr-2">mdi-medical-bag</v-icon>
                      <h3 class="tw-text-amber-800 tw-font-medium">Care Recommendations</h3>
                    </div>
                    <ul class="tw-list-disc tw-list-inside tw-text-gray-700 tw-space-y-1">
                      <li v-for="(tip, index) in livestockTips[selectedLivestock]" :key="'livestock-tip-'+index">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div v-else class="tw-text-center tw-py-8 tw-text-gray-500">
                  <v-icon large color="grey" class="tw-mb-2">mdi-help-circle-outline</v-icon>
                  <p>Select livestock to get AI-powered care advice</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="tw-mt-4">
          <v-col cols="12">
            <v-card class="tw-rounded-lg tw-shadow-md">
              <v-card-title class="tw-bg-indigo-50 tw-text-indigo-800 tw-text-lg tw-font-medium">
                <v-icon color="indigo" class="tw-mr-2">mdi-robot</v-icon>
                Ask FarmAI

              </v-card-title>
              <v-card-text class="tw-p-6">
                <v-textarea
                    v-model="aiQuestion"
                    outlined
                    label="Ask any farming question..."
                    rows="2"
                    class="tw-rounded-lg"
                    append-icon="mdi-send"
                    @click:append="askAI"
                    @keydown.enter="askAI"
                ></v-textarea>

                <div v-if="aiResponse" class="tw-mt-4 tw-p-4 tw-bg-gray-50 tw-rounded-lg">
                  <div class="tw-flex tw-items-center tw-mb-2">
                    <v-icon color="indigo" class="tw-mr-2">mdi-robot-happy-outline</v-icon>
                    <h3 class="tw-text-indigo-800 tw-font-medium">FarmAI Response</h3>
                  </div>
                  <p class="tw-text-gray-700">{{ aiResponse }}</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

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

export default {
  components: { Default },
  data() {
    return {
      selectedCrop: null,
      selectedLivestock: null,
      aiQuestion: '',
      aiResponse: '',
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      weatherStatus: 'Sunny, 28°C',
      crops: ['Maize', 'Wheat', 'Rice', 'Soybeans', 'Potatoes', 'Tomatoes'],
      livestock: ['Cattle', 'Poultry', 'Sheep', 'Goats', 'Pigs', 'Fish'],
      cropStages: {
        Maize: 'Vegetative stage (V6) - 6 leaves fully emerged',
        Wheat: 'Flowering stage - Monitor for fungal diseases',
        Rice: 'Tillering stage - Ensure proper water management',
        Soybeans: 'Pod development stage - Watch for insect pressure',
        Potatoes: 'Tuber initiation - Maintain consistent moisture',
        Tomatoes: 'Fruit development - Monitor calcium levels',
      },
      livestockHealth: {
        Cattle: 'Good overall health. Watch for signs of heat stress.',
        Poultry: 'Normal activity levels. Check water quality.',
        Sheep: 'Healthy wool growth. Monitor for parasites.',
        Goats: 'Active and feeding well. Check hoof condition.',
        Pigs: 'Good weight gain. Ensure proper ventilation.',
        Fish: 'Normal feeding behavior. Check water oxygen levels.',
      },
      cropTips: {
        Maize: [
          'Apply nitrogen fertilizer at 8-leaf stage',
          'Monitor for armyworm infestation',
          'Ensure soil moisture is consistent',
          'Consider side-dressing if leaves show yellowing',
        ],
        Wheat: [
          'Check for rust diseases weekly',
          'Avoid excessive nitrogen at this stage',
          'Monitor for aphid populations',
          'Prepare for harvest in 3-4 weeks',
        ],
        Rice: [
          'Maintain 2-3 inches of standing water',
          'Apply potassium if leaf edges yellow',
          'Watch for rice blast symptoms',
          'Weed control is critical now',
        ],
        Soybeans: [
          'Monitor for soybean cyst nematode',
          'Ensure adequate phosphorus levels',
          'Watch for white mold in dense canopies',
          'Consider foliar fungicide if disease pressure is high',
        ],
        Potatoes: [
          'Hill soil around plants to prevent greening',
          'Monitor for Colorado potato beetle',
          'Maintain consistent soil moisture',
          'Watch for early blight symptoms',
        ],
        Tomatoes: [
          'Provide calcium to prevent blossom end rot',
          'Prune suckers to improve air circulation',
          'Monitor for tomato hornworm',
          'Mulch to maintain soil moisture',
        ],
      },
      livestockTips: {
        Cattle: [
          'Provide shade and cool drinking water',
          'Rotate pastures to prevent overgrazing',
          'Supplement with minerals if needed',
          'Monitor for foot rot in wet conditions',
        ],
        Poultry: [
          'Ensure clean water available at all times',
          'Provide adequate ventilation in housing',
          'Monitor for signs of respiratory disease',
          'Adjust feed protein levels as needed',
        ],
        Sheep: [
          'Check for internal parasites regularly',
          'Provide mineral supplements',
          'Trim hooves if overgrown',
          'Monitor for signs of flystrike',
        ],
        Goats: [
          'Ensure secure fencing to prevent escapes',
          'Provide browse material for enrichment',
          'Monitor for signs of CAE',
          'Keep mineral supplements available',
        ],
        Pigs: [
          'Ensure proper ventilation in housing',
          'Provide wallows or cooling in heat',
          'Monitor feed conversion ratios',
          'Watch for signs of respiratory issues',
        ],
        Fish: [
          'Monitor water quality parameters daily',
          'Adjust feeding based on water temperature',
          'Watch for signs of stress or disease',
          'Maintain proper aeration',
        ],
      },
      stars: [],
      starCount: 150,
    };
  },
  created() {
    this.generateStars();
  },
  methods: {
    askAI() {
      if (!this.aiQuestion.trim()) {
        this.snackbarText = 'Please enter a question';
        this.snackbarColor = 'error';
        this.snackbar = true;
        return;
      }

      // Simulate AI response
      this.aiResponse = `Based on your question about "${this.aiQuestion}", our AI recommends: 
      \n1. Conduct soil tests to determine nutrient levels
      \n2. Implement crop rotation to improve soil health
      \n3. Monitor weather forecasts for optimal planting times
      \n4. Consider precision agriculture techniques for better yields`;

      this.snackbarText = 'FarmAI has provided recommendations';
      this.snackbarColor = 'success';
      this.snackbar = true;

      // In a real app, you would call an API here
      // axios.post('/api/ai-query', { question: this.aiQuestion })
      //   .then(response => {
      //     this.aiResponse = response.data.answer;
      //   })
    },
    generateStars() {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.starCount; i++) {
        this.stars.push({
          size: Math.random() * 3 + 1,
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random(),
          delay: Math.random() * 5,
          duration: Math.random() * 3 + 2,
        });
      }
    },
    starStyle(star) {
      return {
        width: `${star.size}px`,
        height: `${star.size}px`,
        left: `${star.x}%`,
        top: `${star.y}%`,
        opacity: star.opacity,
        animationDelay: `${star.delay}s`,
        animationDuration: `${star.duration}s`,
      };
    },
  },
};
</script>

<style scoped>
/* You can add custom styles here if needed */
.tw-rounded-xl {
  border-radius: 1rem;
}
.tw-rounded-lg {
  border-radius: 0.75rem;
}
.space-container {
  background: linear-gradient(to bottom, #000000 0%, #1a1a2e 100%);
  overflow: hidden;
  z-index: -1;
}

.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.4);
  animation: twinkle infinite alternate;
}

@keyframes twinkle {
  0% {
    transform: scale(1);
    opacity: 0.2;
  }
  100% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Add some larger "stars" that could represent distant galaxies */
.star:nth-child(3n) {
  background-color: #9bb0ff;
  box-shadow: 0 0 8px 1px #9bb0ff;
}

.star:nth-child(5n) {
  background-color: #a6f6ff;
  box-shadow: 0 0 8px 1px #a6f6ff;
}

.star:nth-child(7n) {
  background-color: #ffd3a6;
  box-shadow: 0 0 8px 1px #ffd3a6;
}
</style>
