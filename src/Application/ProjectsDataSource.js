export default class ProjectsDataSource {
    constructor(localStorage) {
        this._localStorage = new AsyncLocalstorage(localStorage);
    }

    static create() {
        return new ProjectsDataSource(localStorage);
    }

    static createNull({ projects, saveInError } = { projects: undefined, saveInError: false }) {
        let initialValue;
        if (projects !== undefined) {
            initialValue = { projects: JSON.stringify(projects) };
        }
        return new ProjectsDataSource(
            saveInError ? new QuotaExceededLocalstorage(initialValue) : new StubbedLocalstorage(initialValue)
        );
    }

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

    async add(project) {
        const projects = await this._projects()
        projects.push(project);
        await this._localStorage.setItem('projects', JSON.stringify(projects));
        return projects
    }

    async save(project) {
        const projects = await this._projects();
        const pp = projects.find(p => project.key === p.key);
        if (pp !== undefined) {
            projects[projects.indexOf(pp)] = project;
        }
        await this._localStorage.setItem('projects', JSON.stringify(projects));
        return projects;
    }

    async delete(id) {
        const projects = await this._projects();
        let result = projects.filter(project => project.key !== id)
        if (result.length === projects.length) {
            throw new Error(`Could not found project with id=${id}`);
        } else {
            await this._localStorage.setItem('projects', JSON.stringify(result));
            return result;
        }
    }

    async _projects() {
        const projects = await this._localStorage.getItem('projects')
        return JSON.parse(projects) || [];
    }
}

class AsyncLocalstorage {
    /**
     * 
     * @param {Storage} localStorage 
     */
    constructor(localStorage) {
        this._localStorage = localStorage
    }
    async setItem(key, value) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this._localStorage.setItem(key, value));
            } catch (error) {
                reject(error)
            }
        });
    }
    async getItem(key) {
        return new Promise((resolve) => {
            resolve(this._localStorage.getItem(key));
        });
    }
}

class StubbedLocalstorage {
    constructor(initialValue) {
        this.store = initialValue || {};
    }
    setItem(key, value) {
        this.store[key] = value;
    }
    getItem(key) {
        return this.store[key] || null;
    }
}

class QuotaExceededLocalstorage {
    constructor(initialValue) {
        this.store = initialValue || {};
    }
    setItem() {
        throw new DOMException("QuotaExceededError");
    }
    getItem(key) {
        return this.store[key] || null;
    }
}
