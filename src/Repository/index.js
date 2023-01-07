import FilesParser from '../FilesParser'
import Images from '../FilesParser/Images'

class Repository {

    constructor(localStorage, filesParser, images) {
        this._localStorage = localStorage
        this._filesParser = filesParser;
        this._images = images
    }

    static create() {
        return new Repository(localStorage, FilesParser.create(), Images.create());
    }

    static createNull({ localStorage } = { localStorage: {} }) {
        // share image instance to share the memory cache
        const images = Images.createNull();
        return new Repository(new StubbedLocalstorage({ config: localStorage }), FilesParser.createNull(images), images);
    }

    colors = [
        '#F44336', '#E91E63', '#9C27B0', '#3F51B5',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688',
        '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
        '#FFC107', '#FF9800', '#FF5722', '#795548'
    ]

    list() {
        return Promise.resolve(this._projects)
    }

    get(id) {
        let result = this._projects.filter(project => project.key === id)
        if (result.length === 0) {
            return Promise.reject(new Error(`Could not found project with id=${id}`))
        }
        return Promise.resolve(result[0])
    }

    delete(id) {
        var projects = this._projects
        let result = projects.filter(project => project.key !== id)
        if (result.length === projects.length) {
            return Promise.reject(new Error(`Could not found project with id=${id}`))
        } else {
            try {
                this._localStorage.setItem('projects', JSON.stringify(result));
                return this._images.clear(id).then(_ => {
                    return result;
                });
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }

    update(id, data) {
        return this.get(id).then((project) => {
            project.data = project.data.map(item => {
                if (item.id === data.id) {
                    return {
                        id: data.id,
                        url: data.url,
                        sequence: data.sequence,
                        action: data.action,
                        label: data.label,
                        periode: data.periode,
                        fx: data.fx,
                    }
                } else {
                    return item
                }
            })

            if (data.label && project.colors[data.label] === undefined) {
                project.colors[data.label] = this.colors[Object.keys(project.colors).length % this.colors.length]
            }

            this.save(id, project)
        })
    }

    updateColor(id, colors) {
        return this.get(id).then((project) => {
            Object.keys(colors).forEach((key) => {
                project.colors[key] = colors[key]
            })

            this.save(id, project)
        })
    }

    deleteColor(id, key) {
        return this.get(id).then((project) => {
            project.colors[key] = undefined;
            project.data = project.data.map(item => {
                if (key === item.label) {
                    return Object.assign(item, {
                        label: undefined,
                    })
                } else {
                    return item
                }
            });
            this.save(id, project)
        });
    }

    updateColorDistribution(id, distribution) {
        return this.get(id).then((project) => {
            project.colorDistribution = distribution;
            this.save(id, project)
        })
    }

    updateFontFamily(id, fontFamily) {
        return this.get(id).then((project) => {
            project.fontFamily = fontFamily;
            this.save(id, project)
        })
    }

    updateTemplate(id, template) {
        return this.get(id).then((project) => {
            project.template = template;
            this.save(id, project)
        })
    }

    updateMainPicture(id, mainPicture) {
        return this.get(id).then((project) => {
            project.mainPicture = mainPicture;
            this.save(id, project)
        })
    }

    save(id, project) {
        const projects = this._projects;
        const pp = projects.find(p => project.key === p.key);
        projects[projects.indexOf(pp)] = project
        this._localStorage.setItem('projects', JSON.stringify(projects));
    }

    add(files) {
        var projects = this._projects
        var name = this._name(files, `Project (${projects.length})`)
        return this._filesParser.parse(name, files).then(project => {
            projects.push(project);
            try {
                this._localStorage.setItem('projects', JSON.stringify(projects));
                return projects
            } catch (error) {
                return Promise.reject(error)
            }
        });
    }

    get _projects() {
        return JSON.parse(this._localStorage.getItem('projects')) || []
    }

    _name(files, defaultName) {
        if (files.length === 0) {
            return defaultName
        }
        let relativePath = files[0].webkitRelativePath
        if (relativePath) {
            return relativePath.split('/')[0];
        }
        return defaultName
    }

}

export default Repository

class StubbedLocalstorage {
    constructor({ config }) {
        this._config = config;
        this.store = {};
    }
    setItem(key, value) {
        if (this._config.setItem) {
            this._config.setItem(key, value, () => this._setItem(key, value));
        } else {
            this._setItem(key, value)
        }
    }
    _setItem(key, value) {
        this.store[key] = value;
    }
    getItem(key) {
        return this.store[key] || null;
    }
}
