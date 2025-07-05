/* eslint-disable no-console */
import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n'
        + 'For more details, visit https://goo.gl/AFskqB',
      );
    },
    registered() {
      console.log('Service worker has been registered.');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
    },
    updated() {
      console.log('New content is available; please refresh.');

      // Show a non-blocking banner to prompt user to refresh
      if (!document.getElementById('sw-update-banner')) {
        const banner = document.createElement('div');
        banner.id = 'sw-update-banner';
        banner.textContent = 'A new version is available. Click here to refresh.';
        banner.style.position = 'fixed';
        banner.style.bottom = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.backgroundColor = '#2563eb'; // tw-blue-600
        banner.style.color = '#fff';
        banner.style.padding = '10px';
        banner.style.textAlign = 'center';
        banner.style.cursor = 'pointer';
        banner.style.zIndex = '9999';
        banner.onclick = () => window.location.reload();
        document.body.appendChild(banner);
      }
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.');

      // You can also notify the user that they are offline:
      const offlineBanner = document.createElement('div');
      offlineBanner.textContent = 'You are offline. Some features may not be available.';
      offlineBanner.style.position = 'fixed';
      offlineBanner.style.top = '0';
      offlineBanner.style.left = '0';
      offlineBanner.style.width = '100%';
      offlineBanner.style.backgroundColor = 'red';
      offlineBanner.style.color = 'white';
      offlineBanner.style.padding = '10px';
      offlineBanner.style.textAlign = 'center';
      document.body.appendChild(offlineBanner);
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}
