const NAME = 'Priemka-0.2';

const FILES = [
  '/index.html',
  //'/404.html',
  '/css/main.min.css',

  '/vednor/js/script.js',
  '/server.js',
  '/service-worker.js',
  '/sw-register.js',
  '/js/main.min.js',

  '/img/icons/64x64.png',
  '/img/icons/128x128.png',
  '/img/icons/152x152.png',
  '/img/icons/256x256.png',
  '/img/icons/512x512.png'
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
