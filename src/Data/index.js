import Images from './images'
import Csv from './csv'

class Repository{

    list(){
        return Promise.resolve(this._projects)
    }

    get(id){
        let result = this._projects.filter(project => project.key == id)
        if(result.length === 0){
            return Promise.reject(new Error(`Could not found project with id=${id}`))
        }
        return Promise.resolve(result[0])
    }

    delete(id){
        var projects = this._projects
        let result = projects.filter(project => project.key != id)
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

    add(files){
        var projects = this._projects
        var index = this._index(projects);
        return Promise.all([
            new Images(index).execute(files),
            new Csv().execute(files)
        ]).then( results => {
            let [images, data] = results

            projects.push({
              key: index,
              name: 'Project (' + (index + 1) + ')',
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
        let colors = [
            '#F44336','#E91E63','#9C27B0','#3F51B5',
            '#2196F3','#03A9F4','#00BCD4','#009688',
            '#4CAF50','#8BC34A','#CDDC39','#FFEB3B',
            '#FFC107','#FF9800','#FF5722','#795548'
        ]
        let unique = [...new Set(data.map(d => d.place))]
        return Object.assign({}, ...unique.map((p, i) => ({[p]: colors[i]})))
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
