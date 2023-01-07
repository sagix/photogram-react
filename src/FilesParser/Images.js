import { readAsArrayBuffer } from './FileReader';

class Images {
    constructor(caches) {
        this._caches = caches
    }

    static create() {
        return new Images(caches)
    }

    static createNull({ factory } = { factory: () => { return new StubbedCache() } }) {
        return new Images(new StubbedCaches(factory))
    }

    execute(identifier, files) {
        let imageType = /^image\//;
        return Promise.all(
            Array.from(files)
                .filter(file => imageType.test(file.type))
                .map(file => readAsArrayBuffer(file))
        ).then(fileResults =>
            Promise.all(
                fileResults.map(fileResult => this._writeFile(identifier, fileResult))
            )
        )
    }

    clear(identifier) {
        return this._caches.delete('image-cache-' + identifier).then(result => {
            if (result) {
                return Promise.resolve(null);
            } else {
                return Promise.reject(Error(`Cannot delete the cache: ${identifier}`));
            }
        })
    }

    _writeFile(identifier, event) {
        return this._caches.open('image-cache-' + identifier)
            .then(cache => {
                let h = new Headers()
                h.append("Content-Type", event.file.type)
                h.append("Content-Length", event.file.size)

                return cache.put(
                    new Request(`/project/${identifier}/images/${event.file.name}/`),
                    new Response(event.result, {
                        status: 200,
                        statusText: "From Cache",
                        headers: h
                    })
                );
            }).then(_ => {
                return {
                    name: event.file.name,
                    url: `/project/${identifier}/images/${event.file.name}/`
                }
            })

    }
}

export default Images

class StubbedCache {
    constructor() {
        this.cache = {};
    }

    put(request, response) {
        this.cache[request.url] = response;
        return Promise.resolve();
    }
}

class StubbedCaches {
    constructor(factory) {
        this.factory = factory;
        this.caches = {};
    }

    open(cacheName) {
        if (!this.caches[cacheName]) {
            this.caches[cacheName] = this.factory(cacheName);
        }
        return Promise.resolve(this.caches[cacheName]);
    }
    delete(cacheName) {
        if (this.caches[cacheName]) {
            delete this.caches[cacheName];
            return Promise.resolve(true);
        }
        return Promise.resolve(false)
    }
}