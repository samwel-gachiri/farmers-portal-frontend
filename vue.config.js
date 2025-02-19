const CompressionPlugin = require('compression-webpack-plugin');
const DumpVueEnvVarsWebpackPlugin = require('./DumpVueEnvVarsWebpackPlugin.js');

const manifestJSON = require('./public/manifest.json');

module.exports = {
  transpileDependencies: [
    'vuetify',
    'vue-apexcharts',
    'apexcharts',
  ],
  devServer: {
    proxy: process.env.VUE_APP_API_BASE_URL,
  },
  configureWebpack: {
    plugins: [
      // We add our plugin here
      new DumpVueEnvVarsWebpackPlugin({ filename: 'sw-extended.js' }),
      new CompressionPlugin(),
    ],
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
};
