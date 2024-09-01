/* eslint-disable no-console */

import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
    },
    registered() {
    },
    cached() {
    },
    updatefound() {
    },
    updated(registration) {
      // eslint-disable-next-line no-alert,no-restricted-globals
      const confirmationResult = confirm('New update Available! Update App?');
      if (confirmationResult) registration.waiting.postMessage({ action: 'skipWaiting' });
    },
    offline() {
    },
    // eslint-disable-next-line no-unused-vars
    error(error) {
    },
  });

  if ('serviceWorker' in navigator) {
    let refreshing;
    // eslint-disable-next-line no-unused-vars
    navigator.serviceWorker.addEventListener('controllerchange', (e) => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }
}
