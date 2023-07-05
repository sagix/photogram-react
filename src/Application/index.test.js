import Application from "./index";
import Csv from "../FilesParser/Csv";
import ProjectsDataSource from "./ProjectsDataSource";
import Uuidv4 from "../FilesParser/uuidv4";
import Images from "../FilesParser/Images";
import IndexedDBProjectsDataSource from "./IndexedDBProjectsDataSource";

describe("Application", () => {

    describe("create", () => {
        beforeAll(() => {
            global.crypto = null;
            global.caches = null;
            global.indexedDB = null;
        })
        afterAll(() => {
            global.crypto = undefined;
            global.caches = undefined;
            global.indexedDB = undefined;
        })
        test("happy path", () => {
            expect(() => Application.create()).not.toThrowError();
        })
    });

    describe("add", () => {
        test("empty csv", async () => {
            const csv = createCsv();
            const expected = {
                key: Uuidv4.createNull().generate(),
                name: "Project (0)",
                data: await new Csv().execute([csv]),
                colors: {},
                template: "small",
            };
            await expect(Application.createNull().add([csv])).resolves.toEqual([expected]);
        });

        test("empty csv with webkitRelativePath", async () => {
            const csv = createCsv();
            csv.webkitRelativePath = "csv"
            const expected = {
                key: Uuidv4.createNull().generate(),
                name: "csv",
                data: await new Csv().execute([csv]),
                colors: {},
                template: "small",
            };
            await expect(Application.createNull().add([csv])).resolves.toEqual([expected]);
        });

        test("csv with one line", async () => {
            const csv = createCsv({ content: "1;action;label;periode;fx" });
            const expected = {
                key: Uuidv4.createNull().generate(),
                name: "Project (0)",
                data: await new Csv().execute([csv]),
                colors: { "label": "#F44336" },
                template: "small",
            };
            await expect(Application.createNull().add([csv])).resolves.toEqual([expected]);
        });

        test('csv with one line and image', async () => {
            const identifier = Uuidv4.createNull().generate();
            const csv = createCsv({ content: "1;action;label;periode;fx" });
            const png = createPng({ name: "1.png" });
            const data = await new Csv().execute([csv]);
            data[0].url = `/project/${identifier}/images/1.png/`
            const expected = {
                key: identifier,
                name: "Project (0)",
                data: data,
                colors: { "label": "#F44336" },
                template: "small",
            };
            const images = Images.createNull();
            await expect(Application.createNull({ images: images }).add([csv, png])).resolves.toEqual([expected]);
            await expect(images.has(identifier)).resolves.toEqual(true);
        })

        test("fails if no data.csv is present", async () => {
            await expect(Application.createNull().add([])).rejects.toThrow("Could not found data.csv");
        });

        test("fails if project cannot be saved", async () => {
            const csv = createCsv();
            const source = Application.createNull({
                dataSource: ProjectsDataSource.createNull({ saveInError: true })
            });
            await expect(source.add([csv])).rejects.toThrow("QuotaExceededError");
        });
    });

    describe("open", () => {

        function createDirHandle(files) {
            return {
                name: "dir",
                values: () => files.map(file => {
                    return {
                        kind: "file",
                        getFile: () => file,
                    }
                })
            };
        }
        test("empty csv", async () => {
            const csv = createCsv();
            const dirHandle = createDirHandle([csv]);
            const expected = {
                key: Uuidv4.createNull().generate(),
                name: "dir",
                data: await new Csv().execute([csv]),
                colors: {},
                template: "small",
                dirLink: dirHandle,
            };
            await expect(Application.createNull().open(dirHandle)).resolves.toEqual([expected]);
        });

        test("csv with one line", async () => {
            const csv = createCsv({ content: "1;action;label;periode;fx" });
            const dirHandle = createDirHandle([csv]);
            const expected = {
                key: Uuidv4.createNull().generate(),
                name: "dir",
                data: await new Csv().execute([csv]),
                colors: { "label": "#F44336" },
                template: "small",
                dirLink: dirHandle,
                mainPicture: undefined,
            };
            await expect(Application.createNull().open(dirHandle)).resolves.toEqual([expected]);
        });

        test('csv with one line and image', async () => {
            const identifier = Uuidv4.createNull().generate();
            const csv = createCsv({ content: "1;action;label;periode;fx" });
            const png = createPng({ name: "1.png" });
            const dirHandle = createDirHandle([csv, png]);
            const data = await new Csv().execute([csv]);
            const imageUrl = `/project/${identifier}/images/1.png/`;
            data[0].url = imageUrl
            const expected = {
                key: identifier,
                name: "dir",
                data: data,
                colors: { "label": "#F44336" },
                template: "small",
                dirLink: dirHandle,
                mainPicture: imageUrl,
            };
            const images = Images.createNull();
            await expect(Application.createNull({ images: images }).open(dirHandle)).resolves.toEqual([expected]);
            await expect(images.has(identifier)).resolves.toEqual(true);
        })

        test("from data.json", async () => {
            const source = Application.createNull();
            const project = createProject();
            delete project.dirLink;
            const json = JSON.stringify(project);
            const dirHandle = createDirHandle([createJson({ content: json })]);
            await expect(source.open(dirHandle)).resolves.toEqual([createProject({ dirLink: dirHandle })]);
        });

        test("fails if no data.csv is present", async () => {
            await expect(Application.createNull().open(createDirHandle([]))).rejects.toThrow("Could not found data.csv");
        });

        test("fails if project cannot be saved", async () => {
            const csv = createCsv();
            const source = Application.createNull({
                dataSource: IndexedDBProjectsDataSource.createNull({ saveInError: true })
            });
            await expect(source.open(createDirHandle([csv]))).rejects.toThrow();
        });
    });


    describe("list", () => {
        test("empty", async () => {
            await expect(Application.createNull().list()).resolves.toEqual([]);
        })

        test("one item", async () => {
            const application = Application.createNull();
            const project = await addProject(application);
            await expect(application.list()).resolves.toEqual([project]);
        });
    });

    describe("delete", () => {
        test("delete one item", async () => {
            const images = Images.createNull();
            const application = Application.createNull({ images: images });
            const project = await addProject(application);
            await expect(application.delete(project.key)).resolves.toEqual([]);
            await expect(images.has(project.key)).resolves.toEqual(false);
        });

        test("fails is project not present", async () => {
            await expect(Application.createNull().delete("id")).rejects.toThrow("");
        });
    });

    describe("get", () => {
        test("returns the project", async () => {
            const application = Application.createNull();
            const project = await addProject(application);
            await expect(application.get(project.key)).resolves.toEqual(project);
        });

        test("fails is project not found", async () => {
            await expect(Application.createNull().get("id")).rejects.toThrow("Could not found project with id=id");
        });
    });

    describe("update", () => {
        test("found element", async () => {
            const application = Application.createNull();
            const project = await addProject(application, createCsv({ content: "1" }));
            const changed = { id: "1", action: "action" };

            await application.update(project.key, changed);

            const actual = await application.get(project.key);
            expect(actual.data).toEqual([changed]);
        });

        test("new label", async () => {
            const application = Application.createNull();
            const project = await addProject(application, createCsv({ content: "1" }));
            const changed = { id: "1", label: "label" };

            await application.update(project.key, changed);

            const actual = await application.get(project.key);
            expect(actual.data).toEqual([changed]);
            expect(actual.colors).toEqual({ "label": "#F44336" });
        });

        test("do nothing if element not found", async () => {
            const application = Application.createNull();
            const project = await addProject(application, createCsv({ content: "1" }));
            const changed = { id: "2", action: "action" };

            await application.update(project.key, changed);

            await expect(application.get(project.key)).resolves.toEqual(project);
        });

        test("fails is project not found", async () => {
            await expect(Application.createNull().update("id", null)).rejects.toThrow("Could not found project with id=id");
        });
    });

    describe("needsPermission", () => {
        test("true", async () => {
            const application = Application.createNull({
                dataSource: IndexedDBProjectsDataSource.createNull({
                    projects: [createProject({ dirLink: createDirLink({ queryPermission: () => "prompt" }) })]
                })
            });
            await expect(application.needsPermission("key")).resolves.toEqual(true);
        });

        test("false if already granted", async () => {
            const application = Application.createNull({
                dataSource: IndexedDBProjectsDataSource.createNull({
                    projects: [createProject({ dirLink: createDirLink({ queryPermission: () => "granted" }) })]
                })
            });
            await expect(application.needsPermission("key")).resolves.toEqual(false);
        });

        test("false if no dirLink present", async () => {
            const application = Application.createNull({
                dataSource: ProjectsDataSource.createNull({
                    projects: [createProject({ dirLink: null })]
                })
            });
            await expect(application.needsPermission("key")).resolves.toEqual(false);
        });
    });

    describe("requestPermission", () => {
        test("granted", async () => {
            const application = Application.createNull({
                dataSource: IndexedDBProjectsDataSource.createNull({
                    projects: [createProject({ dirLink: createDirLink({ requestPermission: () => "granted" }) })]
                })
            });
            await expect(application.requestPermission("key")).resolves.toEqual();
        });

        test("fails when denied", async () => {
            const application = Application.createNull({
                dataSource: IndexedDBProjectsDataSource.createNull({
                    projects: [createProject({ dirLink: createDirLink({ requestPermission: () => "denied" }) })]
                })
            });
            await expect(application.requestPermission("key")).rejects.toThrow("Permission for dir was denied");
        });

        test("false if no dirLink present", async () => {
            const application = Application.createNull({
                dataSource: ProjectsDataSource.createNull({
                    projects: [createProject({ dirLink: null })]
                })
            });
            await expect(application.requestPermission("key")).rejects.toThrow("No directory is defined");
        });
    });

    describe("color", () => {
        describe("update", () => {
            test("update the one found, create the other one", async () => {
                const application = Application.createNull();
                const project = await addProject(application, createCsv({ content: "1;action;label;periode;fx" }));
                const changed = { label: "#000000", other: "#FFFFFF" };

                await application.updateColor(project.key, changed);

                const actual = await application.get(project.key);
                expect(actual.colors).toEqual(changed);
            });
            test("fails is project not found", async () => {
                await expect(Application.createNull().updateColor("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });

        describe("delete", () => {
            test("found color", async () => {
                const application = Application.createNull();
                const project = await addProject(application, createCsv({ content: "1;action;label;periode;fx" }));

                await application.deleteColor(project.key, "label");

                const actual = await application.get(project.key);
                expect(actual.colors).toEqual({});
                expect(actual.data[0].label).toEqual(undefined);
            });

            test("do nothing if element not found", async () => {
                const application = Application.createNull();
                const project = await addProject(application, createCsv({ content: "1;action;label;periode;fx" }));

                await application.deleteColor(project.key, "unkown");

                await expect(application.get(project.key)).resolves.toEqual(project);
            });

            test("fails is project not found", async () => {
                await expect(Application.createNull().deleteColor("id", null)).rejects.toThrow();
            });
        });

        describe("distribution", () => {
            test("update", async () => {
                const application = Application.createNull();
                const project = await addProject(application, createCsv());

                await application.updateColorDistribution(project.key, "card");

                const actual = await application.get(project.key);
                expect(actual.colorDistribution).toEqual("card");
            });

            test("fails is project not found", async () => {
                await expect(Application.createNull().updateColorDistribution("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });
    });

    describe("update", () => {
        describe("font family", () => {
            test("update", async () => {
                const application = Application.createNull();
                const project = await addProject(application, createCsv());

                await application.updateFontFamily(project.key, "font");

                const actual = await application.get(project.key);
                expect(actual.fontFamily).toEqual("font");
            });

            test("fails is project not found", async () => {
                await expect(Application.createNull().updateFontFamily("id", "font")).rejects.toThrow("Could not found project with id=id");
            });
        });
        describe("print space around", () => {
            test("update", async () => {
                const application = Application.createNull();
                const project = await addProject(application, createCsv());

                await application.updatePrintSpaceAround(project.key, true);

                const actual = await application.get(project.key);
                expect(actual.printSpaceAround).toEqual(true);
            });

            test("fails is project not found", async () => {
                await expect(Application.createNull().updatePrintSpaceAround("id", true)).rejects.toThrow("Could not found project with id=id");
            });
        });

        describe("template", () => {
            test("update", async () => {
                const application = Application.createNull();
                const project = await addProject(application, createCsv());

                await application.updateTemplate(project.key, "large");

                const actual = await application.get(project.key);
                expect(actual.template).toEqual("large");
            });
            test("fails is project not found", async () => {
                await expect(Application.createNull().updateColorDistribution("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });

        describe("main picture", () => {

            test("update", async () => {
                const application = Application.createNull();
                const project = await addProject(application, createCsv());

                await application.updateMainPicture(project.key, "2");

                const actual = await application.get(project.key);
                expect(actual.mainPicture).toEqual("2");
            });

            test("fails is project not found", async () => {
                await expect(Application.createNull().updateColorDistribution("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });
    });
});

async function addProject(application, csv = createCsv()) {
    const result = await application.add([csv, createPng()]);
    return result[result.length - 1];
}

function createCsv({ name = "data.csv", content = "" } = {}) {
    return new File([content], name, { type: 'text/csv' });
}

function createPng({ name = "image.png", content = "" } = {}) {
    return new File([content], name, { type: 'image/png' });
}

function createJson({ name = "data.json", content = "" } = {}) {
    return new File([content], name, { type: 'text/json' });
}

function createDirLink({
    name = "dir",
    requestPermission = () => "prompt",
    queryPermission = () => "denied",
} = {}) {
    return {
        name: name,
        requestPermission: requestPermission,
        queryPermission: queryPermission,
    }
}

function createProject({ data = [], dirLink = createDirLink() } = {}) {
    return {
        data: data,
        key: "key",
        colors: {},
        dirLink: dirLink,
    }
}