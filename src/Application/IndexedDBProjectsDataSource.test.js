import IndexedDBProjectsDataSource from "./IndexedDBProjectsDataSource";

describe("ProjectsDataSource", () => {
    describe("create", () => {
        beforeAll(() => {
            global.indexedDB = null;
        })
        afterAll(() => {
            global.indexedDB = undefined;
        });
        test("happy path", () => {
            expect(() => IndexedDBProjectsDataSource.create()).not.toThrow();
        });
    });

    describe("list", () => {
        test("nothing", async () => {
            await expect(IndexedDBProjectsDataSource.createNull().list()).resolves.toEqual([]);
        });

        test("one project", async () => {
            const source = IndexedDBProjectsDataSource.createNull();
            await source.add(createProject());
            await expect(source.list()).resolves.toEqual([createProject()]);
        });
    })

    describe("get", () => {
        test("returns the project", async () => {
            const source = IndexedDBProjectsDataSource.createNull();
            await source.add(createProject());
            await expect(source.get("key")).resolves.toEqual(createProject());
        });

        test("fails is project not found", async () => {
            await expect(IndexedDBProjectsDataSource.createNull().get("key")).rejects.toThrow("Could not found project with id=key");
        });
    });

    describe("add", () => {
        test("one project", async () => {
            const source = IndexedDBProjectsDataSource.createNull();
            await expect(source.add(createProject())).resolves.toEqual([createProject()]);
        });

        test("fails on error", async () => {
            const source = IndexedDBProjectsDataSource.createNull({ saveInError: true });
            await expect(source.add(createProject({}))).rejects.toThrow();
        });
    });

    describe("save", () => {
        test("one existing project", async () => {
            const source = IndexedDBProjectsDataSource.createNull();
            await source.add(createProject());
            await expect(source.save(createProject({ data: ["new"] }))).resolves.toEqual([createProject({ data: ["new"] })]);
        });

        test("fails if project does not exist", async () => {
            const source = IndexedDBProjectsDataSource.createNull();
            await expect(source.save(createProject())).rejects.toThrow();
        });
    })

    describe("delete", () => {
        test("one existing project", async () => {
            const source = IndexedDBProjectsDataSource.createNull();
            await source.add(createProject());
            await expect(source.delete("key")).resolves.toEqual([]);
        });

        test("fails if project does not exist", async () => {
            const source = IndexedDBProjectsDataSource.createNull();
            await expect(source.delete("key")).rejects.toThrow();
        });

        test("fails on error", async () => {
            const source = IndexedDBProjectsDataSource.createNull({ projects: [createProject()], saveInError: true });
            await expect(source.delete("key")).rejects.toThrow();
        });
    });

    describe("dirLink", () => {
        test("one existing project", async () => {
            const source = IndexedDBProjectsDataSource.createNull({ projects: [createProject()] });
            await expect(source.dirLink("key")).resolves.toEqual({ name: "dir" });
        })
        test("fails if project does not exist", async () => {
            const source = IndexedDBProjectsDataSource.createNull();
            await expect(source.dirLink("key")).rejects.toThrow()
        })
    });
});

function createProject({ data } = { data: [] }) {
    return {
        data: data,
        key: "key",
        colors: {},
        dirLink: { name: "dir" },
    }
}