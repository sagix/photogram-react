import Images from './images'

class Repository{

    list(){
        return Promise.resolve(this._projects)
    }

    get(id){
        let result = this._projects.filter(project => project.key == id)
        if(result.length == 0){
            return Promise.reject(new Error(`Could not found project with id=${id}`))
        }
        return Promise.resolve(result[0])
    }

    add(files){
        var projects = this._projects
        var index = this._index(projects);
        return Promise.all([new Images(index).execute(files)]).then( results => {
            let [images] = results
            console.log(images);

            projects.push({
              key: index,
              name: 'Project (' + (index + 1) + ')',
              files: Array.from(images),
              type: "small",
            })
            try{
                localStorage.setItem('projects', JSON.stringify(projects));
                return projects
            }catch (error){
                return Promise.reject({
                    message: 'Cannot save project',
                    cause: error
                })
            }

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

}

export default Repository
