import { readAsArrayBuffer } from './FileReader';

class Images {
    constructor(caches) {
        this._caches = caches
    }

    static create() {
        return new Images(caches)
    }

    static createNull() {
        return new Images(new StubbedCaches())
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
        return this._caches.delete('image-cache-' + identifier)
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
                    })).catch(error => Promise.reject(error))

            }).then(_ => {
                return {
                    name: event.file.name,
                    url: `/project/${identifier}/images/${event.file.name}/`
                }
            })

    }
}

export default Images

class StubbedCaches {
    open(name) {
        return Promise.resolve(new StubbedCache());
    }
    delete(name) {

    }
}

class StubbedCache {
    put(request, response) {
        return Promise.resolve(null);
    }
}