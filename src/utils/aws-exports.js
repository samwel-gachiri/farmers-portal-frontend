const config = {
  Auth: {
    // identityPoolId: process.env.VUE_APP_IDENTITY_POOL_ID,
    region: process.env.VUE_APP_AWS_REGION,
    userPoolId: process.env.VUE_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.VUE_APP_USER_POOL_WEB_CLIENT_ID,
    mandatorySignIn: false,
  },
};
export default config;
