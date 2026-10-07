const CACHE = 'we-know-him-web-v23'
const APP_SHELL = [
  './', './index.html', './styles.css', './manifest.webmanifest',
  './trial-casefile/', './trial-casefile/index.html', './trial-casefile/styles.css', './trial-casefile/app.js', './trial-casefile/ui.js', './trial-casefile/storage.js',
  './src/app.js', './src/core/engine.js', './src/core/storage.js',
  './src/data/story.js', './src/data/full-story.js', './src/data/media-manifest.js', './src/data/audio-manifest.js', './src/data/generated-voice-takes.js', './src/data/characters.js', './src/data/glossary.js', './src/data/player-copy.js',
  './assets/audio/bgm-inquiry.mp3', './assets/audio/bgm-pressure.mp3', './assets/audio/bgm-truth.mp3', './assets/audio/bgm-aftermath.mp3',
  './icons/icon-192.png', './icons/icon-512.png',
  './assets/images/lin-message-v2.webp', './assets/images/lin-phone-natural-v4.webp', './assets/images/liang-deadline-v2.webp',
  './assets/images/song-receipts-v2.webp', './assets/images/runner-box-v2.webp',
  './assets/images/verify-official-v2.webp', './assets/images/cast-reference.webp',
  './assets/images/victim-meeting.webp', './assets/images/sample-confirm.webp', './assets/images/delivery-box-ref.webp',
  './assets/images/lu-archive-v3.webp', './assets/images/jiang-consent-v3.webp',
  './assets/images/zhou-refund-v3.webp', './assets/images/lin-fake-video-v3.webp',
  './assets/images/lu-replies-v3.webp', './assets/images/lin-final-edit-v3.webp',
  './assets/images/xu-salary-v5.webp', './assets/images/ai-identity-check-v5.webp',
  './assets/images/evidence-wall-v5.webp', './assets/images/consent-interview-v5.webp',
  './assets/images/ending-clear-v5.webp', './assets/images/ending-witness-exit-v5.webp',
  './assets/images/transition-lab-v6.webp', './assets/images/roundtable-player-v6.webp',
  './assets/characters/01-lin.webp', './assets/characters/02-shen.webp', './assets/characters/03-zhou.webp',
  './assets/characters/04-tang.webp', './assets/characters/05-lu.webp', './assets/characters/06-xu.webp',
  './assets/characters/07-jiang.webp', './assets/characters/08-song.webp', './assets/characters/09-liang.webp'
]

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  const codeAsset = event.request.mode === 'navigate' || /\.(?:js|css|webmanifest)$/.test(url.pathname)
  if (codeAsset) {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone()
      caches.open(CACHE).then(cache => cache.put(event.request, copy))
      return response
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))))
    return
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (!response || response.status !== 200 || response.type === 'opaque') return response
    const copy = response.clone()
    caches.open(CACHE).then(cache => cache.put(event.request, copy))
    return response
  })))
})
