self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
    let req = event.request;

    if(req.method === 'GET' && req.url.includes('/images/')){
        event.respondWith(caches.match(event.request));
    }
});
