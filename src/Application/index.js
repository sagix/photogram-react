import FilesParser from '../FilesParser'
import Images from '../FilesParser/Images'
import ProjectsDataSource from './ProjectsDataSource';

class Application {

    /**
     * 
     * @param {ProjectsDataSource} dataSource 
     * @param {FilesParser} filesParser 
     * @param {Images} images 
     */
    constructor(dataSource, filesParser, images) {
        this._dataSource = dataSource;
        this._filesParser = filesParser;
        this._images = images
    }

    static create() {
        return new Application(ProjectsDataSource.create(), FilesParser.create(), Images.create());
    }

    static createNull({ dataSource } = { dataSource: ProjectsDataSource.createNull() }) {
        // share image instance to share the memory cache
        const images = Images.createNull();
        return new Application(dataSource, FilesParser.createNull(images), images);
    }

    colors = [
        '#F44336', '#E91E63', '#9C27B0', '#3F51B5',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688',
        '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
        '#FFC107', '#FF9800', '#FF5722', '#795548'
    ]

    async list() {
        return await this._dataSource.list();
    }

    async get(id) {
        return this._dataSource.get(id);
    }

    async delete(id) {
        const projects = await this._dataSource.delete(id);
        await this._images.clear(id);
        return projects;
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
        await this._dataSource.save(project);
    }

    async updateColor(id, colors) {
        const project = await this.get(id);
        Object.keys(colors).forEach((key) => {
            project.colors[key] = colors[key];
        });
        await this._dataSource.save(project);
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
        await this._dataSource.save(project);
    }

    async updateColorDistribution(id, distribution) {
        const project = await this.get(id);
        project.colorDistribution = distribution;
        await this._dataSource.save(project);
    }

    async updateFontFamily(id, fontFamily) {
        const project = await this.get(id);
        project.fontFamily = fontFamily;
        await this._dataSource.save(project);
    }

    async updateTemplate(id, template) {
        const project = await this.get(id);
        project.template = template;
        await this._dataSource.save(project);
    }

    async updateMainPicture(id, mainPicture) {
        const project = await this.get(id);
        project.mainPicture = mainPicture;
        await this._dataSource.save(project);
    }

    async add(files) {
        const fileArray = Array.from(files);
        const projects = await this._dataSource.list();
        const name = this._name(files, `Project (${projects.length})`)
        const project = await this._filesParser.parse(name, fileArray);
        return await this._dataSource.add(project);
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
