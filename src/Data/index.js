import Images from './images'
import Csv from './csv'
import {uuidv4} from './uuidv4.js'

class Repository{
    colors = [
        '#F44336','#E91E63','#9C27B0','#3F51B5',
        '#2196F3','#03A9F4','#00BCD4','#009688',
        '#4CAF50','#8BC34A','#CDDC39','#FFEB3B',
        '#FFC107','#FF9800','#FF5722','#795548'
    ]

    list(){
        return Promise.resolve(this._projects)
    }

    get(id){
        let result = this._projects.filter(project => project.key === id)
        if(result.length === 0){
            return Promise.reject(new Error(`Could not found project with id=${id}`))
        }
        return Promise.resolve(result[0])
    }

    delete(id){
        var projects = this._projects
        let result = projects.filter(project => project.key !== id)
        if(result.length === projects.length){
            return Promise.reject(new Error(`Could not found project with id=${id}`))
        }
        try{
            localStorage.setItem('projects', JSON.stringify(result));
            return Promise.resolve(result)
                .then(new Images(id).clear())
        }catch (error){
            return Promise.reject(error)
        }
    }

    update(id, data){
        return this.get(id).then((project) => {
                project.data = project.data.map(item => {
                    if(item.id == data.id){
                        return {
                            id: data.id,
                            url: item.url,
                            sequence: data.sequence,
                            action: data.action,
                            place: data.place,
                            periode: data.periode,
                            fx: data.fx,
                        }
                    }else{
                        return item
                    }
                })

                if(data.place && project.colors[data.place] === undefined){
                    project.colors[data.place] = this.colors[Object.keys(project.colors).length]
                }

                this.save(id, project)
        })
    }

    updateColor(id, colors){
        return this.get(id).then((project) => {
                Object.keys(colors).forEach((key) => {
                    project.colors[key] = colors[key]
                })

                this.save(id, project)
        })
    }

    save(id, project){
        const projects = this._projects.map(p => {
            if(project.key == p.key){
                return project
            }else{
                return p
            }
        })
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    add(files){
        var projects = this._projects
        var identifier = uuidv4()
        var name = this._name(files, `Project (${projects.length})`)
        return Promise.all([
            new Images(identifier).execute(files),
            new Csv().execute(files)
        ]).then( results => {
            let [images, data] = results

            projects.push({
              key: identifier,
              name: name,
              data: this._mergeDateWithImages(data, Array.from(images)),
              colors: this._calculateColors(data),
              type: "small",
            })
            try{
                localStorage.setItem('projects', JSON.stringify(projects));
                return projects
            }catch (error){
                return Promise.reject(error)
            }

        })
    }

    get _projects(){
        return JSON.parse(localStorage.getItem('projects')) || []
    }

    _mergeDateWithImages(data, images){
        return data.map(d =>{
            let results = images.filter(i => i.name.startsWith(`${d.id}.`))
            if(results.length === 0){
                return d
            }else{
                return Object.assign(d, {
                    url: results[0].url
                })
            }
        })
    }

    _calculateColors(data){
        let unique = [...new Set(data.map(d => d.place).filter(p => p !== null && p !== ""))]
        return Object.assign({}, ...unique.map((p, i) => ({[p]: this.colors[i]})))
    }

    _name(files, defaultName){
        if(files.length === 0){
            return defaultName
        }
        let relativePath = files[0].webkitRelativePath
        if(relativePath){
            let name = relativePath.split('/')[0]
            if(name){
                return name
            }
        }
        return defaultName
    }

}

export default Repository
