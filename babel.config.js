module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    // Required for ethers v6 and @stomp/stompjs which use private class fields (#)
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-private-property-in-object',
  ],
};
