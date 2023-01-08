import FilesParser from '../FilesParser'
import Images from '../FilesParser/Images'

class Application {

    constructor(localStorage, filesParser, images) {
        this._localStorage = new AsyncLocalstorage(localStorage);
        this._filesParser = filesParser;
        this._images = images
    }

    static create() {
        return new Application(localStorage, FilesParser.create(), Images.create());
    }

    static createNull({ localStorage } = { localStorage: {} }) {
        // share image instance to share the memory cache
        const images = Images.createNull();
        return new Application(new StubbedLocalstorage({ config: localStorage }), FilesParser.createNull(images), images);
    }

    colors = [
        '#F44336', '#E91E63', '#9C27B0', '#3F51B5',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688',
        '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
        '#FFC107', '#FF9800', '#FF5722', '#795548'
    ]

    async list() {
        return await this._projects();
    }

    async get(id) {
        let result = (await this._projects()).filter(project => project.key === id)
        if (result.length === 0) {
            throw new Error(`Could not found project with id=${id}`);
        }
        return result[0];
    }

    async delete(id) {
        const projects = await this._projects();
        let result = projects.filter(project => project.key !== id)
        if (result.length === projects.length) {
            throw new Error(`Could not found project with id=${id}`);
        } else {
            await this._localStorage.setItem('projects', JSON.stringify(result));
            await this._images.clear(id);
            return result;
        }
    }

    async update(id, data) {
        const project = await this.get(id);
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
                };
            } else {
                return item;
            }
        });
        if (data.label && project.colors[data.label] === undefined) {
            project.colors[data.label] = this.colors[Object.keys(project.colors).length % this.colors.length];
        }
        await this.save(id, project);
    }

    async updateColor(id, colors) {
        const project = await this.get(id);
        Object.keys(colors).forEach((key) => {
            project.colors[key] = colors[key];
        });
        await this.save(id, project);
    }

    async deleteColor(id, key) {
        const project = await this.get(id);
        project.colors[key] = undefined;
        project.data = project.data.map(item => {
            if (key === item.label) {
                return Object.assign(item, {
                    label: undefined,
                });
            } else {
                return item;
            }
        });
        await this.save(id, project);
    }

    async updateColorDistribution(id, distribution) {
        const project = await this.get(id);
        project.colorDistribution = distribution;
        await this.save(id, project);
    }

    async updateFontFamily(id, fontFamily) {
        const project = await this.get(id);
        project.fontFamily = fontFamily;
        await this.save(id, project);
    }

    async updateTemplate(id, template) {
        const project = await this.get(id);
        project.template = template;
        await this.save(id, project);
    }

    async updateMainPicture(id, mainPicture) {
        const project = await this.get(id);
        project.mainPicture = mainPicture;
        await this.save(id, project);
    }

    async save(id, project) {
        const projects = await this._projects();
        const pp = projects.find(p => project.key === p.key);
        projects[projects.indexOf(pp)] = project
        await this._localStorage.setItem('projects', JSON.stringify(projects));
    }

    async add(files) {
        const fileArray = Array.from(files);
        const projects = await this._projects()
        const name = this._name(files, `Project (${projects.length})`)
        const project = await this._filesParser.parse(name, fileArray);
        projects.push(project);
        await this._localStorage.setItem('projects', JSON.stringify(projects));
        return projects
    }

    async _projects() {
        const projects = await this._localStorage.getItem('projects')
        return JSON.parse(projects) || [];
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

export default Application

class AsyncLocalstorage{
    /**
     * 
     * @param {WindowLocalStorage} localStorage 
     */
    constructor(localStorage){
        this._localStorage = localStorage
    }
    async setItem(key, value){
        return new Promise((resolve, reject) => {
            try{
                resolve(this._localStorage.setItem(key, value));
            } catch (error){
                reject(error)
            }
        });
    }
    async getItem(key){
        return new Promise((resolve, reject) => {
            try{
                resolve(this._localStorage.getItem(key));
            } catch (error){
                reject(error)
            }
        });
    }
}

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
