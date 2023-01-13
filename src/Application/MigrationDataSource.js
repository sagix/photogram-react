// eslint-disable-next-line no-unused-vars
import IndexedDBProjectsDataSource from "./IndexedDBProjectsDataSource";
// eslint-disable-next-line no-unused-vars
import ProjectsDataSource from "./ProjectsDataSource";

export default class MigrationDataSource {
    /**
     * Create MigrationDataSource.
     * @param {IndexedDBProjectsDataSource} dbSource 
     * @param {ProjectsDataSource} storageSource 
     */
    constructor(dbSource, storageSource) {
        this._dbSource = dbSource;
        this._storageSource = storageSource;
    }

    async list() {
        const listA = await this._dbSource.list();
        const listB = await this._storageSource.list();
        return listA.concat(listB);
    }

    async get(id) {
        try {
            return await this._storageSource.get(id);
        } catch (error) {
            return await this._dbSource.get(id);
        }
    }

    async dirLink(id) {
        try {
            return await this._dbSource.dirLink(id);
        } catch (error) {
            return await this._storageSource.dirLink(id);
        }
    }

    async add(project) {
        await this._source(project).add(project);
        return await this.list();
    }

    async save(project) {
        await this._source(project).save(project);
        return await this.list();
    }

    async delete(id) {
        try {
            await this._storageSource.delete(id);
        } catch (error) {
            await this._dbSource.delete(id);
        }
        return await this.list();
    }

    _source(project) {
        if (project.dirLink) {
            return this._dbSource;
        } else {
            return this._storageSource;
        }
    }
}