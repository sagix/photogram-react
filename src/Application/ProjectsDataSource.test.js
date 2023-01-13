import ProjectsDataSource from "./ProjectsDataSource";

describe("ProjectsDataSource", () => {
    test("create", () => {
        expect(() => ProjectsDataSource.create()).not.toThrow();
    });

    describe("list", () => {
        test("nothing", async () => {
            await expect(ProjectsDataSource.createNull().list()).resolves.toEqual([]);
        });

        test("one project", async () => {
            const source = ProjectsDataSource.createNull();
            await source.add(createProject());
            await expect(source.list()).resolves.toEqual([createProject()]);
        });
    })

    describe("get", () => {
        test("returns the project", async () => {
            const source = ProjectsDataSource.createNull();
            await source.add(createProject());
            await expect(source.get("key")).resolves.toEqual(createProject());
        });

        test("fails is project not found", async () => {
            await expect(ProjectsDataSource.createNull().get("key")).rejects.toThrow("Could not found project with id=key");
        });
    });

    describe("add", () => {
        test("one project", async () => {
            const source = ProjectsDataSource.createNull();
            await expect(source.add(createProject())).resolves.toEqual([createProject()]);
        });

        test("fails if QuotaExceededError", async () => {
            const source = ProjectsDataSource.createNull({ saveInError: true });
            await expect(source.add(createProject({}))).rejects.toThrow("QuotaExceededError");
        });
    });

    describe("save", () => {
        test("one existing project", async () => {
            const source = ProjectsDataSource.createNull();
            await source.add(createProject());
            await expect(source.save(createProject({ data: ["new"] }))).resolves.toEqual([createProject({ data: ["new"] })]);
        });

        test("ignores the update if project does not exist", async () => {
            const source = ProjectsDataSource.createNull();
            await expect(source.save(createProject())).resolves.toEqual([]);
        });
    })

    describe("delete", () => {
        test("one existing project", async () => {
            const source = ProjectsDataSource.createNull();
            await source.add(createProject());
            await expect(source.delete("key")).resolves.toEqual([]);
        });

        test("fails if project does not exist", async () => {
            const source = ProjectsDataSource.createNull();
            await expect(source.delete("key")).rejects.toThrow("Could not found project with id=key");
        });

        test("fails if QuotaExceededError", async () => {
            const source = ProjectsDataSource.createNull({ projects: [{ key: "key" }], saveInError: true });
            await expect(source.delete("key")).rejects.toThrow("QuotaExceededError");
        });
    });

    test("dirLink", async () => {
        const source = ProjectsDataSource.createNull();
        await expect(source.dirLink("key")).resolves.toBeUndefined()
    })

});

function createProject({ data } = { data: [] }) {
    return {
        data: data,
        key: "key",
        colors: {},
    }
}