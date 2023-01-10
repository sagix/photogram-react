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

    async execute(identifier, files) {
        const imageType = /^image\//;
        const images = Array.from(files).filter(file => imageType.test(file.type));
        return Promise.all(images.map(async file => {
            const fileResult = await readAsArrayBuffer(file);
            return this._writeFile(identifier, fileResult);
        }));
    }

    async clear(identifier) {
        const result = await this._caches.delete(this._name(identifier))
        if (result) {
            return null;
        } else {
            throw Error(`Cannot delete the cache: ${identifier}`);
        }
    }

    async has(identifier) {
        return Promise.resolve(this._caches.has(this._name(identifier)))
    }

    _name(identifier) {
        return 'image-cache-' + identifier;
    }

    async _writeFile(identifier, event) {
        const cache = await this._caches.open(this._name(identifier));
        const headers = new Headers()
        headers.append("Content-Type", event.file.type)
        headers.append("Content-Length", event.file.size)

        await cache.put(
            new Request(`/project/${identifier}/images/${event.file.name}/`),
            new Response(event.result, {
                status: 200,
                statusText: "From Cache",
                headers: headers
            })
        );

        return {
            name: event.file.name,
            url: `/project/${identifier}/images/${event.file.name}/`
        }
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
        if (!this.has[cacheName]) {
            this.caches[cacheName] = this.factory(cacheName);
        }
        return Promise.resolve(this.caches[cacheName]);
    }
    delete(cacheName) {
        if (this.has(cacheName)) {
            delete this.caches[cacheName];
            return Promise.resolve(true);
        }
        return Promise.resolve(false)
    }
    has(cacheName) {
        return this.caches[cacheName] !== undefined;
    }
}