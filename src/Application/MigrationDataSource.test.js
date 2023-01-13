import IndexedDBProjectsDataSource from "./IndexedDBProjectsDataSource";
import MigrationDataSource from "./MigrationDataSource";
import ProjectsDataSource from "./ProjectsDataSource";

describe("MigrationDataSource", () => {
    test("list", async () => {
        const source = setup({
            db: [createDbProject("db")],
            storage: [createStorageProject("storage")],
        });
        await expect(source.list()).resolves.toEqual([createDbProject("db"), createStorageProject("storage")]);
    });

    describe("get", () => {
        test("from db", async () => {
            const source = setup({
                db: [createDbProject("db")],
                storage: [createStorageProject("storage")],
            });
            await expect(source.get("db")).resolves.toEqual(createDbProject("db"));
        });
        test("from storage", async () => {
            const source = setup({
                storage: [createStorageProject("key")],
            });
            await expect(source.get("key")).resolves.toEqual(createStorageProject("key"));
        });
    });

    describe("add", () => {
        test("to db", async () => {
            const source = setup({
                storage: [createStorageProject("key")],
            });
            await expect(source.add(createDbProject("db"))).resolves.toEqual([createDbProject("db"), createStorageProject("key")]);
        });
        test("to storage", async () => {
            const source = setup({
                db: [createDbProject("key")],
            });
            await expect(source.add(createStorageProject("storage"))).resolves.toEqual([createDbProject("key"), createStorageProject("storage")]);
        });
    });

    describe("save", () => {
        test("from db", async () => {
            const source = setup({
                db: [createDbProject("db")],
            });
            await expect(source.save(createDbProject("db", ["new"]))).resolves.toEqual([createDbProject("db", ["new"])]);
        });
        test("from storage", async () => {
            const source = setup({
                storage: [createStorageProject("storage")],
            });
            await expect(source.save(createStorageProject("storage", ["new"]))).resolves.toEqual([createStorageProject("storage", ["new"])]);
        });
    });

    describe("delete", () => {
        test("from db", async () => {
            const source = setup({
                db: [createDbProject("key")],
            });
            await expect(source.delete("key")).resolves.toEqual([]);
        });
        test("from storage", async () => {
            const source = setup({
                storage: [createStorageProject("key")],
            });
            await expect(source.delete("key")).resolves.toEqual([]);
        });
    });

    describe("dirLink", () => {
        test("one existing project in db", async () => {
            const source = setup({
                db: [createDbProject("key")],
            });
            await expect(source.dirLink("key")).resolves.toEqual({ name: "dir" });
        })
        test("ignores if project does not exist", async () => {
            const source = setup();
            await expect(source.dirLink("key")).resolves.toBeUndefined();
        })
    });
});

function setup({ db = [], storage = [] } = {}) {
    const dbSource = IndexedDBProjectsDataSource.createNull({ projects: db });
    const storageSource = ProjectsDataSource.createNull({ projects: storage });
    const source = new MigrationDataSource(dbSource, storageSource);
    return source;
}

function createDbProject(key = "db", data = []) {
    return {
        data: data,
        key: key,
        colors: {},
        dirLink: { name: "dir" },
    }
}

function createStorageProject(key = "storage", data = []) {
    return {
        data: data,
        key: key,
        colors: {},
    }
}