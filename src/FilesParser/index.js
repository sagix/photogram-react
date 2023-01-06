import Images from './Images'
import Csv from './Csv'
import Uuidv4 from './uuidv4.js'

export default class FileParser{

    constructor(uuidv4, images) {
        this._uuidv4 = uuidv4;
        this._images = images;
        this._csv = new Csv()
    }

    static create() {
        return new FileParser( Uuidv4.create(), Images.create());
    }

    static createNull() {
        return new FileParser( Uuidv4.createNull(), Images.createNull());
    }

    parse(name, files) {
        var identifier = this._uuidv4.generate()
        return Promise.all([
            this._images.execute(identifier, files),
            this._csv.execute(files)
        ]).then(results => {
            let [images, data] = results
            return {
                key: identifier,
                name: name,
                data: this._mergeDateWithImages(data, Array.from(images)),
                colors: this._calculateColors(data),
                template: "small",
            }
        })
    }

    _mergeDateWithImages(data, images) {
        return data.map(d => {
            let results = images.filter(i => i.name.startsWith(`${d.id}.`))
            if (results.length === 0) {
                return d
            } else {
                return Object.assign(d, {
                    url: results[0].url
                })
            }
        })
    }

    _calculateColors(data) {
        let unique = [...new Set(data.map(d => d.label).filter(p => p !== null && p !== ""))]
        return Object.assign({}, ...unique.map((p, i) => ({ [p]: this.colors[i % this.colors.length] })))
    }
}