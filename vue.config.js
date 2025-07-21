const CompressionPlugin = require('compression-webpack-plugin');
const DumpVueEnvVarsWebpackPlugin = require('./DumpVueEnvVarsWebpackPlugin.js');
const manifestJSON = require('./public/manifest.json');

module.exports = {
  transpileDependencies: [
    'vuetify',
    'vue-apexcharts',
    'apexcharts',
    '@stomp/stompjs',
    'marked',
  ],
  devServer: {
    proxy: process.env.VUE_APP_API_BASE_URL,
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto', // Required for .mjs files
        },
      ],
    },
    plugins: [
      new DumpVueEnvVarsWebpackPlugin({ filename: 'sw-extended.js' }),
      new CompressionPlugin(),
    ],
  },
  chainWebpack: (config) => {
    // Alternative way to handle .mjs (if the above doesn't work)
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .type('javascript/auto')
      .include.add(/node_modules/)
      .end();
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
