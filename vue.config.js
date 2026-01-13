const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const os = require('os');
const DumpVueEnvVarsWebpackPlugin = require('./DumpVueEnvVarsWebpackPlugin.js');
const manifestJSON = require('./public/manifest.json');

const useParallel = os.cpus().length > 1;

module.exports = {
  // Enable parallel processing for faster builds
  parallel: useParallel,

  // Reduce transpileDependencies to only what's truly needed
  // ethers and @stomp/stompjs use private class fields (#) which require transpilation
  // @noble/curves uses optional chaining (?.) which also requires transpilation
  transpileDependencies: [
    'vuetify',
    'vue-apexcharts',
    'apexcharts',
    'ethers',
    '@stomp/stompjs',
    '@noble/curves',
    '@noble/hashes',
  ],

  // Disable source maps in production for faster builds
  productionSourceMap: false,

  devServer: {
    proxy: process.env.VUE_APP_API_BASE_URL,
  },

  configureWebpack: {
    // Enable filesystem caching (Webpack 4 compatible)
    cache: true,

    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },

    plugins: [
      new DumpVueEnvVarsWebpackPlugin({ filename: 'sw-extended.js' }),
      new CompressionPlugin(),
      // Ignore moment.js locales to reduce bundle size significantly
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],

    // Optimize chunk splitting for faster rebuilds
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 20,
        maxAsyncRequests: 20,
        cacheGroups: {
          // Separate vendor chunks for better caching
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
          },
          // Separate heavy libraries into their own chunks
          vuetify: {
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            name: 'vuetify',
            chunks: 'all',
            priority: 20,
          },
          firebase: {
            test: /[\\/]node_modules[\\/]firebase[\\/]/,
            name: 'firebase',
            chunks: 'all',
            priority: 20,
          },
          ethers: {
            test: /[\\/]node_modules[\\/]ethers[\\/]/,
            name: 'ethers',
            chunks: 'all',
            priority: 20,
          },
        },
      },
    },

    // Performance hints
    performance: {
      hints: false,
    },
  },
  chainWebpack: (config) => {
    // Handle .mjs files properly
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');
  },
  pwa: {
    themeColor: manifestJSON.theme_color,
    name: manifestJSON.short_name,
    msTileColor: manifestJSON.background_color,
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      exclude: [
        /\.map$/,
        /manifest\.json$/,
      ],
    },
  },
  // No changes needed for offline page caching if swSrc is set and /offline is part of your build
};
