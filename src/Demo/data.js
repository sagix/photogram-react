import Csv from './csv'

class Repository {

    constructor() {
        this.project = null
    }

    colors = [
        '#F44336', '#E91E63', '#9C27B0', '#3F51B5',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688',
        '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
        '#FFC107', '#FF9800', '#FF5722', '#795548'
    ]

    list() {
        throw Error("no list")
    }

    demo() {
        var identifier = "demo";
        var name = "Le fardeau (démo)";
        var base = new URL(window.location.href)
        return new Csv().execute(new URL("demo/data.csv", base)).then(data => {
            this.project = {
                key: identifier,
                name: name,
                data: this._mergeDateWithImages(data, base),
                colors: this._calculateColors(data),
                template: "small",
            }
            return Promise.resolve(this.project);
        })
    }

    get(id) {
        if (this.project == null) {
            return this.demo();
        } else {
            return Promise.resolve(this.project)
        }
    }

    delete(id) {
        throw Error("no delete")
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
                project.colors[data.label] = this.colors[Object.keys(project.colors).length]
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
        this.project = project;
    }

    _mergeDateWithImages(data, base) {
        return data.map(d => {
            return Object.assign(d, {
                url: new URL(`/demo/${d.id}.jpg`, base)
            })
        })
    }

    _calculateColors(data) {
        let unique = [...new Set(data.map(d => d.label).filter(p => p !== null && p !== ""))]
        return Object.assign({}, ...unique.map((p, i) => ({ [p]: this.colors[i] })))
    }
}

export default Repository
