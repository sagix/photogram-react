self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
    let req = event.request;
    //req.headers.entries().forEach( c => console.log(c));
    console.log(event);
    if(req.method === 'GET'
        && req.url.includes('/images/')){

        event.respondWith(async function() {
          // Try to get the response from a cache.
          const cachedResponse = await caches.match(event.request);
          // Return it if we found one.
          if (cachedResponse) return cachedResponse;
          return await fetch(event.request)
        }());
    }
});
