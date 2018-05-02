import {readAsArrayBuffer} from './FileReader';

class Images{
    constructor(identifier){
        this.identifier = identifier
    }

 execute(files){
    let imageType = /^image\//;
    return Promise.all(
        Array.from(files)
        .filter(file => imageType.test(file.type))
        .map(file => readAsArrayBuffer(file))
    ).then ( fileResults =>
        Promise.all(
            fileResults.map(fileResult => this._writeFile(fileResult))
        )
    )
}

 _writeFile(event){
    return caches.open('image-cache-'+this.identifier)
    .then( cache => {
        let h = new Headers()
        h.append("Content-Type", event.file.type)
        h.append("Content-Length", event.file.size)

        return cache.put(
                new Request(`/project/${this.identifier}/images/${event.file.name}/`),
                new Response(event.result, {
                    status: 200,
                    statusText: "From Cache",
                    headers: h
            })).catch(error => {
            return Promise.reject({
                message: `Could not cache image: /images/${event.file.name}`,
                cause: error
            })
        })

    }).then(_ =>{
        return {
            name: event.file.name,
            url:`/project/${this.identifier}/images/${event.file.name}/`
        }
    })

}
}

export default Images
