import { readAsText } from "../FilesParser/FileReader";

export default class IndexedDBProjectsDataSource {
    /**
     * 
     * @param {IDBFactory} indexedDB 
     * @param {FileHandleWrapper} fileHandle
     */
    constructor(indexedDB, fileHandle) {
        this._indexedDB = indexedDB
        this._fileHandle = fileHandle
        this.dbName = "projects";
        this.storeName = "store";
    }

    static create() {
        return new IndexedDBProjectsDataSource(indexedDB, new FileHandleWrapper());
    }


    static createNull({ projects, saveInError } = { projects: undefined, saveInError: false }) {
        let dbState = {};
        let fsState = {};

        if (projects !== undefined) {
            for (const project of projects) {
                const dirLink = project.dirLink;
                delete project.dirLink;
                dbState[project.key] = {
                    id: project.key,
                    data: project,
                    fileSystemDirectoryHandle: dirLink,
                };
                fsState[dirLink.name] = project;
            }
        }
        return new IndexedDBProjectsDataSource(
            saveInError ? new ErrorIndexedDB(dbState) : new StubbedIndexedDB(dbState),
            new StubbedFileHandle(fsState),
        );
    }

    async list() {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.getAll();
            request.onsuccess = event => {
                resolve(event.target.result.map(entry => this._transform(entry)));
            };
            request.onerror = event => {
                reject(event.target.error);
            };
        });
    }

    async add(data) {
        const fileSystemDirectoryHandle = data.dirLink;
        delete data.dirLink;
        await this._add(data.key, data, fileSystemDirectoryHandle);
        await this._fileHandle.write(fileSystemDirectoryHandle, "data.json", data);
        return this.list();
    }

    async _add(id, data, fileSystemDirectoryHandle) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.put({ id, fileSystemDirectoryHandle, data }, id);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = event => {
                reject(event.target.error);
            };
        });
    }

    async dirLink(id) {
        return (await this._get(id)).dirLink;
    }

    async get(id) {
        try {
            const projectDb = await this._get(id);
            const projectFs = await this._fileHandle.read(projectDb.dirLink, "data.json");
            projectFs.dirLink = projectDb.dirLink;
            return projectFs;
        } catch (error) {
            throw new Error(`Could not found project with id=${id}`, { cause: error });
        }
    }

    async _get(id) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.get(id);
            request.onsuccess = event => {
                if (event.target.result) {
                    resolve(this._transform(event.target.result));
                } else {
                    reject(new Error(`Could not found project with id=${id}`));
                }
            };
            request.onerror = event => {
                reject(event.target.error);
            };
        });
    }

    _transform(entry) {
        const project = entry.data;
        project.dirLink = entry.fileSystemDirectoryHandle;
        return project;
    }

    async save(data) {
        const projectDb = await this._save(data.key, data);
        await this._fileHandle.write(projectDb.dirLink, "data.json", data);
        return this.list();
    }

    async _save(id, data) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.get(id);
            request.onsuccess = event => {
                const result = event.target.result;
                const updatedData = { ...result, ...{ data: data } };
                const updateRequest = store.put(updatedData, id);
                updateRequest.onsuccess = () => {
                    resolve(this._transform(updatedData));
                };
                updateRequest.onerror = event => {
                    reject(event.target.error);
                };
            };
            request.onerror = event => {
                reject(event.target.error);
            };
        });
    }

    async delete(id) {
        await this._delete(id);
        return this.list();
    }

    async _delete(id) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.delete(id);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = event => {
                reject(event.target.error);
            };
        });
    }

    /**
     * Returns a db request.
     * @returns {IDBOpenDBRequest} request
     */
    async open() {
        if (this._db) {
            return this._db;
        } else {
            this._db = await this._open();
            return this._db;
        }
    }


    async _open() {
        return new Promise((resolve, reject) => {
            const request = this._indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                db.createObjectStore(this.storeName, { keypath: "id" });
            };
            request.onsuccess = event => {
                resolve(event.target.result);
            };
            request.onerror = event => {
                reject(event.target.error);
            };
        });
    }
}

const ErrorRequest = (error) => new Proxy({}, {
    set: function (target, name, value, receiver) {
        if (name === "onerror") {
            value({ target: { error: error } });
        }
        return Reflect.set(target, name, value, receiver);
    }
});

const SuccessRequest = (result) => new Proxy({}, {
    set: function (target, name, value, receiver) {
        if (name === "onsuccess") {
            value({ target: { result: result } });
        }
        return Reflect.set(target, name, value, receiver);
    }
});

class StubbedFileHandle {
    constructor(fsState) {
        this.store = fsState;
    }
    async write(dirHandle, _, data) {
        this.store[dirHandle.name] = data;
    }
    async read(dirHandle, _) {
        return this.store[dirHandle.name];
    }
}

class FileHandleWrapper {
    /**
     * Write data in file
     * @param {FileSystemDirectoryHandle} dirHandle 
     * @param {string} name 
     * @param {object} data
     */
    async write(dirHandle, name, data) {
        await this._checkPermission(dirHandle, "readwrite");
        const fileHandle = await dirHandle.getFileHandle(name, { create: true })
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(JSON.stringify(data));
        await writableStream.close();
    }
    /**
     * Read data from file
     * @param {FileSystemDirectoryHandle} dirHandle 
     * @param {string} name 
     * @param {object} data
     */
    async read(dirHandle, name) {
        await this._checkPermission(dirHandle, "read");
        const fileHandle = await dirHandle.getFileHandle(name);
        const file = await fileHandle.getFile();
        const result = await readAsText(file);
        return JSON.parse(result.result);
    }

    async _checkPermission(dirHandle, mode) {
        const options = { mode: mode };
        const permission = (await dirHandle.requestPermission(options));
        if (permission !== 'granted') {
            throw Error(`Permission for ${dirHandle.name} was ${permission}`);
        }
    }
}

class ErrorIndexedDB {
    open() {
        return ErrorRequest(new Error("Cannot open database"));
    }
}

class StubbedIndexedDB {
    constructor(initialValue) {
        this.store = initialValue;
    }

    open() {
        return SuccessRequest(this);
    }

    transaction() {
        const dbStore = this.store;
        return {
            objectStore() {
                return {
                    store: dbStore,
                    get(key) {
                        const result = this.store[key];
                        if (result) {
                            return SuccessRequest(result);
                        } else {
                            return ErrorRequest(new Error(`Cannot found ${key}`))
                        }

                    },
                    getAll() {
                        const result = Object.values(this.store);
                        return SuccessRequest(result);
                    },
                    put(value, key) {
                        this.store[key] = value;
                        return SuccessRequest(undefined);
                    },
                    delete(key) {
                        if (this.store[key]) {
                            delete this.store[key];
                            return SuccessRequest(undefined);
                        } else {
                            return ErrorRequest(new Error(`Cannot found ${key}`));
                        }
                    }
                };
            }
        };
    }
}