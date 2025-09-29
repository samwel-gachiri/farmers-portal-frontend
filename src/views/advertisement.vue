<template>
    <default>
        <div class="tw-min-h-screen tw-bg-gray-900 tw-text-white tw-font-sans">
            <!-- Main Layout -->
            <div class="tw-flex tw-h-screen tw-overflow-hidden">
            <!-- Control Panel -->
            <div class="tw-w-1/2 tw-p-6 tw-overflow-y-auto tw-border-r tw-border-gray-800">
                <div class="tw-mb-8">
                <h1 class="tw-text-2xl tw-font-bold tw-mb-2 tw-text-green-400">Farm Web Generator</h1>
                <p class="tw-text-gray-400">Create your farm's digital presence</p>
                </div>

                <!-- Publish Button -->
                <div class="tw-mb-8">
                <button
                    @click="publishWebsite"
                    class="tw-w-full tw-py-3 tw-px-4 tw-bg-green-600 hover:tw-bg-green-500 tw-rounded-lg tw-font-medium tw-flex tw-items-center tw-justify-center tw-transition-colors"
                    :disabled="!generatedWebsite"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-5 tw-w-5 tw-mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    Publish Website
                </button>
                </div>

                <!-- Produces Selection -->
                <div class="tw-mb-8">
                <h2 class="tw-text-lg tw-font-semibold tw-mb-4 tw-flex tw-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-5 tw-w-5 tw-mr-2 tw-text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                    Select Produces
                </h2>
                <div class="tw-grid tw-grid-cols-2 tw-gap-3">
                    <div
                    v-for="produce in farmerData.farmerProduces"
                    :key="produce.id"
                    class="tw-border tw-border-gray-700 tw-rounded-lg tw-p-3 tw-cursor-pointer hover:tw-bg-gray-800 tw-transition-colors"
                    :class="{ 'tw-border-green-500 tw-bg-gray-800': selectedProduces.includes(produce.id) }"
                    @click="toggleProduce(produce.id)"
                    >
                    <div class="tw-flex tw-items-center">
                        <div class="tw-w-8 tw-h-8 tw-rounded-full tw-bg-gray-700 tw-flex tw-items-center tw-justify-center tw-mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-4 tw-w-4 tw-text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        </div>
                        <span class="tw-text-sm">{{ produce.farmProduce.name }}</span>
                    </div>
                    </div>
                </div>
                </div>

                <!-- Listings Selection -->
                <div class="tw-mb-8">
                <h2 class="tw-text-lg tw-font-semibold tw-mb-4 tw-flex tw-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-5 tw-w-5 tw-mr-2 tw-text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                    </svg>
                    Current Listings
                </h2>
                <div class="tw-space-y-2">
                    <div
                    v-for="listing in listings.data.content"
                    :key="listing.id"
                    class="tw-border tw-border-gray-700 tw-rounded-lg tw-p-3 tw-cursor-pointer hover:tw-bg-gray-800 tw-transition-colors"
                    :class="{ 'tw-border-green-500 tw-bg-gray-800': selectedListings.includes(listing.id) }"
                    @click="toggleListing(listing.id)"
                    >
                    <div class="tw-flex tw-justify-between tw-items-center">
                        <span class="tw-text-sm">{{ listing.farmerProduce.farmProduce.name }}</span>
                        <span class="tw-text-xs tw-bg-gray-700 tw-px-2 tw-py-1 tw-rounded">
                        {{ listing.price.currency }} {{ listing.price.price }} / {{ listing.unit }}
                        </span>
                    </div>
                    </div>
                </div>
                </div>

                <!-- Generate Button -->
                <button
                @click="generateWebsite"
                class="tw-w-full tw-py-3 tw-px-4 tw-bg-blue-600 hover:tw-bg-blue-500 tw-rounded-lg tw-font-medium tw-flex tw-items-center tw-justify-center tw-transition-colors"
                :disabled="generating"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-5 tw-w-5 tw-mr-2 tw-animate-spin" viewBox="0 0 20 20" fill="currentColor" v-if="generating">
                    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-5 tw-w-5 tw-mr-2" viewBox="0 0 20 20" fill="currentColor" v-else>
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                </svg>
                {{ generating ? 'Generating...' : 'Generate Website' }}
                </button>
            </div>

            <!-- Website Preview -->
            <div class="tw-w-1/2 tw-bg-gray-800 tw-overflow-y-auto tw-relative">
                <!-- Loading State -->
                <div v-if="generating" class="tw-absolute tw-inset-0 tw-bg-gray-900 tw-bg-opacity-80 tw-flex tw-items-center tw-justify-center tw-z-10">
                <div class="tw-text-center">
                    <div class="tw-inline-block tw-animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-12 tw-w-12 tw-text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    </div>
                    <p class="tw-mt-4 tw-text-gray-300">Generating your farm website...</p>
                </div>
                </div>

                <!-- Generated Website -->
                <div v-if="generatedWebsite" v-html="generatedWebsite" class="tw-h-full"></div>

                <!-- Empty State -->
                <div v-else class="tw-h-full tw-flex tw-items-center tw-justify-center">
                <div class="tw-text-center tw-p-8 tw-max-w-md">
                    <div class="tw-mx-auto tw-w-24 tw-h-24 tw-rounded-full tw-bg-gray-700 tw-flex tw-items-center tw-justify-center tw-mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-10 tw-w-10 tw-text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    </div>
                    <h3 class="tw-text-xl tw-font-medium tw-mb-2">No Website Preview</h3>
                    <p class="tw-text-gray-400 tw-mb-6">Select your produces and listings, then click "Generate Website"</p>
                </div>
                </div>
            </div>
            </div>
        </div>
    </default>
</template>

<script>
import { GoogleGenerativeAI } from '@google/generative-ai';
import Default from '@/components/layout/Default.vue';

export default {
  name: 'FarmerWebsiteGenerator',
  components: { Default },
  data() {
    return {
      generating: false,
      generatedWebsite: null,
      selectedProduces: [],
      selectedListings: [],

      // Sample farmer data
      farmerData: {
        userProfile: {
          fullName: 'John Kimani Mwangi',
        },
        farmName: "Kimani's Green Valley Farm",
        farmSize: 15,
        location: {
          customName: 'Kiambu County, Central Kenya',
        },
        farmerProduces: [
          {
            id: 'produce_001',
            farmProduce: {
              name: 'Roma Tomatoes',
              description: 'High-quality Roma tomatoes perfect for cooking',
            },
            imageUrls: ['https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400'],
          },
          {
            id: 'produce_002',
            farmProduce: {
              name: 'Sukuma Wiki',
              description: 'Fresh leafy greens rich in nutrients',
            },
            imageUrls: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'],
          },
          {
            id: 'produce_003',
            farmProduce: {
              name: 'Kent Mangoes',
              description: 'Premium export quality mangoes',
            },
            imageUrls: ['https://images.unsplash.com/photo-1553279013-112d2be1eb0d?w=400'],
          },
        ],
      },

      listings: {
        data: {
          content: [
            {
              id: 'listing_001',
              price: {
                price: 80,
                currency: 'KES',
              },
              unit: 'kg',
              farmerProduce: {
                farmProduce: {
                  name: 'Roma Tomatoes',
                },
              },
            },
            {
              id: 'listing_002',
              price: {
                price: 15,
                currency: 'KES',
              },
              unit: 'bunches',
              farmerProduce: {
                farmProduce: {
                  name: 'Sukuma Wiki',
                },
              },
            },
            {
              id: 'listing_003',
              price: {
                price: 120,
                currency: 'KES',
              },
              unit: 'kg',
              farmerProduce: {
                farmProduce: {
                  name: 'Kent Mangoes',
                },
              },
            },
          ],
        },
      },
    };
  },

  methods: {
    toggleProduce(id) {
      if (this.selectedProduces.includes(id)) {
        this.selectedProduces = this.selectedProduces.filter((produceId) => produceId !== id);
      } else {
        this.selectedProduces.push(id);
      }
    },

    toggleListing(id) {
      if (this.selectedListings.includes(id)) {
        this.selectedListings = this.selectedListings.filter((listingId) => listingId !== id);
      } else {
        this.selectedListings.push(id);
      }
    },

    async generateWebsite() {
      this.generating = true;

      try {
        // Filter produces and listings based on selection
        const selectedProducesData = this.farmerData.farmerProduces.filter(
          (p) => this.selectedProduces.includes(p.id),
        );

        const selectedListingsData = this.listings.data.content.filter(
          (l) => this.selectedListings.includes(l.id),
        );

        // Initialize the Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.VUE_APP_GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
Create a futuristic, minimalistic farmer website with these details:

Farmer: ${this.farmerData.userProfile.fullName}
Farm: ${this.farmerData.farmName}
Location: ${this.farmerData.location.customName}

Selected Produces:
${selectedProducesData.map((p) => `- ${p.farmProduce.name}: ${p.farmProduce.description}`).join('\n')}

Current Listings:
${selectedListingsData.map((l) => `- ${l.farmerProduce.farmProduce.name}: ${l.price.currency}${l.price.price} per ${l.unit}`).join('\n')}

Create a COMPLETE HTML document with:
1. Ultra-modern, clean design using Tailwind CSS
2. Dark theme with green accents
3. Minimal text, focus on visuals
4. Product cards with hover effects
5. Smooth animations
6. Mobile-responsive layout
7. Futuristic typography
8. Contact section
9. Use actual Unsplash images for products
10. Include a prominent call-to-action

Make it look like a premium, cutting-edge agricultural showcase. Return ONLY the complete HTML code.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let htmlContent = response.text();

        // Clean up the response
        htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');
        this.generatedWebsite = htmlContent;
      } catch (error) {
        // console.error('Error generating website:', error);
      } finally {
        this.generating = false;
      }
    },

    publishWebsite() {
      alert(`Website published! URL: https://farm-website.example.com/${
        Math.random().toString(36).substring(2, 8)}`);
    },
  },

  mounted() {
    // Select all produces and listings by default
    this.selectedProduces = this.farmerData.farmerProduces.map((p) => p.id);
    this.selectedListings = this.listings.data.content.map((l) => l.id);
  },
};
</script>

<style>
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
