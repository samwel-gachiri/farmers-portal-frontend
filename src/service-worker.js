/* eslint-disable no-useless-escape,no-restricted-globals,no-underscore-dangle,no-console */
/* eslint-disable no-undef */

// Change this value every time before you build
const LATEST_VERSION = 'v1.10.1';
const NAME = 'cp';

workbox.setConfig({ debug: false });

workbox.core.setCacheNameDetails({
  prefix: NAME,
  precache: 'precache',
  runtime: 'runtime',
});

// eslint-disable-next-line no-unused-vars
self.addEventListener('activate', (_event) => {
  if (caches) {
    caches.keys().then((arr) => {
      arr.forEach((key) => {
        if (key.indexOf(`${NAME}-precache`) < -1) {
          caches.delete(key).then(() => console.log(`%c Cleared ${key}`, 'background: #333; color: #ff0000'));
        } else {
          caches.open(key).then((cache) => {
            cache.match('version').then((res) => {
              if (!res) {
                cache.put('version', new Response(LATEST_VERSION, { status: 200, statusText: LATEST_VERSION }));
              } else if (res.statusText !== LATEST_VERSION) {
                caches.delete(key).then(() => console.log(`%c Cleared Cache ${LATEST_VERSION}`, 'background: #333; color: #ff0000'));
              } else console.log(`%c Great you have the latest version ${LATEST_VERSION}`, 'background: #333; color: #00ff00');
            });
          });
        }
      });
    });
  }
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

// runtime cache
// 1. stylesheet
workbox.routing.registerRoute(
  new RegExp('\.css$'),
  new workbox.strategies.CacheFirst({
    cacheName: `${NAME}-cache-Stylesheets`,
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7, // cache for one week
        maxEntries: 20, // only cache 20 request
        purgeOnQuotaError: true,
      }),
    ],
  }),
);
// 2. images
workbox.routing.registerRoute(
  new RegExp('\.(png|svg|jpg|jpeg)$'),
  new workbox.strategies.CacheFirst({
    cacheName: `${NAME}-cache-Images`,
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
        maxEntries: 50,
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// 3. fonts
workbox.routing.registerRoute(
  new RegExp('\.(ttf|woff2|woff|eot)$'),
  new workbox.strategies.CacheFirst({
    cacheName: `${NAME}-cache-Fonts`,
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
        maxEntries: 10,
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
// eslint-disable-next-line no-unused-vars, sonarjs/no-duplicate-string
workbox.routing.setCatchHandler(({ event }) => caches.match('/no-internet'));

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, '/no-internet', {});
workbox.routing.registerNavigationRoute('/index.html');

self.addEventListener('message', (msg) => {
  if (msg.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
// workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, '/no-internet', {});
workbox.routing.registerNavigationRoute('/index.html');

// install new service worker when ok, then reload page.
self.addEventListener('message', (msg) => {
  // eslint-disable-next-line eqeqeq
  if (msg.data.action == 'skipWaiting') {
    self.skipWaiting();
  }
});
