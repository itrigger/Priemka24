const NAME = 'Priemka-0.2';

const FILES = [
  //'/wp-content/themes/priemka/index.php',
  //'/404.html',
  '/wp-content/themes/priemka/assets/css/main.min.css',
  '/wp-content/themes/priemka/assets/libs/js/swiper-bundle.min.js',
  '/wp-content/themes/priemka/server.js',
  '/wp-content/themes/priemka/service-worker.js',
  '/wp-content/themes/priemka/sw-register.js',
  '/wp-content/themes/priemka/assets/js/main.min.js',

  '/wp-content/themes/priemka/assets/img/icons/64x64.png',
  '/wp-content/themes/priemka/assets/img/icons/128x128.png',
  '/wp-content/themes/priemka/assets/img/icons/152x152.png',
  '/wp-content/themes/priemka/assets/img/icons/256x256.png',
  '/wp-content/themes/priemka/assets/img/icons/512x512.png'
]

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(NAME).then((cache) => cache.addAll(FILES)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== NAME) {
            return caches.delete(key)
          }
        })
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then(
        (response) =>
          response ||
          fetch(e.request).then((response) =>
            caches.open(NAME).then((cache) => {
              if (e.request.method === 'GET') {
                cache.put(e.request, response.clone())
              }
              return response
            })
          )
      )
      .catch(() => caches.match('404.html'))
  )
})
