/* eslint-disable no-console */
import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}pwabuilder-adv-sw.js`, {
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

      // Notify the user that new content is available
      // You can use a modal, toast notification, or a simple alert:
      if (window.confirm('New version available! Refresh to get the latest content?')) {
        window.location.reload(); // Reload the page to apply the new version
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
