import pFileReader from './FileReader';

class Repository{

    list(){
        return Promise.resolve(this._projects)
    }

    get(id){
        let result = this._projects.filter(project => project.key !== id)
        if(result.length == 0){
            return Promise.reject(new Error(`Could not found project with id=${id}`))
        }
        return Promise.resolve(result[0])
    }

    add(files){
        let imageType = /^image\//;
        return Promise.all(
            Array.from(files)
            .filter(file => imageType.test(file.type))
            .map(file => pFileReader(file))
        ).then ( fileResults =>
            Promise.all(
                fileResults.map(fileResult => this._writeFile(fileResult))
            )
        ).then( files =>{
            let projects = this._projects
            let index = this._index(projects);
            projects.push({
              key: index,
              name: 'Project (' + (index + 1) + ')',
              files: Array.from(files),
              type: "small",
            })
            localStorage.setItem('projects', JSON.stringify(projects));
            return projects
        })
    }

    get _projects(){
        return JSON.parse(localStorage.getItem('projects')) || []
    }

    _index(projects){
        let index
        if(projects.length === 0){
          index = 0;
        }else{
          index = projects[projects.length -1].key + 1;
        }
        return index
    }
    _writeFile(event){
        return caches.open('image-cache')
        .then( cache => {
            let h = new Headers()
            h.append("Content-Type", event.file.type)
            h.append("Content-Length", event.file.size)
            cache.put(
                new Request('/images/'+ event.file.name),
                new Response(event.result, {
                	status: 200,
                	statusText: "From Cache",
                	headers: h
            }))
        }).then(_ =>{
            return '/images/'+ event.file.name
        })

    }

}

export default Repository
