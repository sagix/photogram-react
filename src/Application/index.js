import Csv from '../FilesParser/Csv';
import { readAsText } from '../FilesParser/FileReader';
import Images from '../FilesParser/Images';
import Uuidv4 from '../FilesParser/uuidv4';
import IndexedDBProjectsDataSource from './IndexedDBProjectsDataSource';
import MigrationDataSource from './MigrationDataSource';
import ProjectsDataSource from './ProjectsDataSource';

const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688',
    '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
    '#FFC107', '#FF9800', '#FF5722', '#795548'
]

class Application {

    /**
     * Create Application
     * @param {MigrationDataSource} dataSource 
     * @param {Images} images 
     * @param {Uuidv4} uuidv4 
     */
    constructor(dataSource, images, uuidv4) {
        this._csv = new Csv();
        this._dataSource = dataSource;
        this._images = images;
        this._uuidv4 = uuidv4;
    }

    static create() {
        return new Application(new MigrationDataSource(
            IndexedDBProjectsDataSource.create(),
            ProjectsDataSource.create(),
        ), Images.create(), Uuidv4.create());
    }

    static createNull({
        dataSource = new MigrationDataSource(
            IndexedDBProjectsDataSource.createNull(),
            ProjectsDataSource.createNull(),
        ),
        images = Images.createNull()
    } = {}) {
        return new Application(dataSource, images, Uuidv4.createNull());
    }

    async list() {
        return await this._dataSource.list();
    }

    async get(id) {
        return await this._dataSource.get(id);
    }

    async requestPermission(id) {
        const dirHandle = (await this._dataSource.dirLink(id));
        if (dirHandle) {
            const options = { mode: 'readwrite' };
            const permission = (await dirHandle.requestPermission(options));
            if (permission !== 'granted') {
                throw new Error(`Permission for ${dirHandle.name} was ${permission}`);
            }
        } else {
            throw new Error("No directory is defined");
        }
    }

    async needsPermission(id) {
        const dirHandle = (await this._dataSource.dirLink(id));
        if (dirHandle) {
            const options = { mode: 'readwrite' };
            const permission = (await dirHandle.queryPermission(options));
            return permission === 'prompt'
        } else {
            return false;
        }
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
            project.colors[data.label] = colors[Object.keys(project.colors).length % colors.length];
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

    async updateDefaultColor(id, color) {
        const project = await this.get(id);
        project.defaultColor = color
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

    async updatePrintSpaceAround(id, printSpaceAround) {
        const project = await this.get(id);
        project.printSpaceAround = printSpaceAround;
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
        const name = this._name(fileArray, `Project (${projects.length})`)
        const identifier = this._uuidv4.generate()
        const images = await this._images.execute(identifier, fileArray);
        const data = await this._csv.execute(fileArray);
        const project = {
            key: identifier,
            name: name,
            data: this._mergeDateWithImages(data, images),
            colors: Application._calculateColors(data),
            template: "small",
        };
        return await this._dataSource.add(project);
    }

    /**
     * Open a directory.
     * @param {FileSystemDirectoryHandle} dirHandle 
     * @returns list of projects
     */
    async open(dirHandle) {
        const project = await this._parse(dirHandle);
        return await this._dataSource.add(project);
    }

    async _parse(dirHandle) {
        const fileArray = [];
        for await (const value of dirHandle.values()) {
            if (value.kind === "file") {
                fileArray.push(await value.getFile());
            }
        }
        const jsonData = fileArray.find(file => file.name === "data.json")

        if (jsonData) {
            const json = (await readAsText(jsonData)).result;
            const project = JSON.parse(json);
            project.dirLink = dirHandle;
            await this._images.execute(project.key, fileArray);
            return project;
        } else {
            const identifier = this._uuidv4.generate();

            const urls = await this._images.execute(identifier, fileArray);
            const name = dirHandle.name;
            const data = await this._csv.execute(fileArray);

            const project = {
                key: identifier,
                name: name,
                data: this._mergeDateWithImages(data, urls),
                colors: Application._calculateColors(data),
                template: "small",
                dirLink: dirHandle,
            };
            if (project.data.length !== 0) {
                project.mainPicture = project.data[0].url;
            }
            return project;
        }
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
        });
    }

    static _calculateColors(data) {
        let unique = [...new Set(data.map(d => d.label).filter(p => p !== null && p !== ""))]
        return Object.assign({}, ...unique.map((p, i) => ({ [p]: colors[i % colors.length] })))
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
