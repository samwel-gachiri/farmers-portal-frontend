import { Loader } from 'google-maps';

const apiKey = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;
console.log(apiKey);
const loader = new Loader(apiKey, {
  libraries: ['maps'],
});

export default loader;
