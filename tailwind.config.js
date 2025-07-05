module.exports = {
  prefix: 'tw-',
  content: [ // <-- RENAME 'purge' to 'content'
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
    './src/**/*.js',
  ],
  theme: {
    extend: {
      screens: {
        '2xl': '1536px',
      },
    },
  },
  // variants: {}, // Variants is also deprecated in v3, but usually doesn't cause a direct error
  plugins: [],
  // future: {} // The 'future' key is also deprecated in v3 as these features are now default
};