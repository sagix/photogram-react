import Application from "./index";
import FilesParser from "../FilesParser";
import ProjectsDataSource from "./ProjectsDataSource";

describe("Application", () => {

    describe("create", () => {
        beforeAll(() => {
            global.crypto = null;
            global.caches = null;
        })
        afterAll(() => {
            global.crypto = undefined;
            global.caches = undefined;
        })
        test("happy path", () => {
            expect(() => Application.create()).not.toThrowError();
        })
    });

    describe("add", () => {
        test("csv", async () => {
            const csv = createCsv();
            const expected = await FilesParser.createNull().parse("default_name", [csv]);
            expected.name = "Project (0)";
            await expect(Application.createNull().add([csv])).resolves.toEqual([expected]);
        });

        test("csv with webkitRelativePath", async () => {
            const csv = createCsv();
            csv.webkitRelativePath = "csv"
            const expected = await FilesParser.createNull().parse("default_name", [csv]);
            expected.name = "csv";
            await expect(Application.createNull().add([csv])).resolves.toEqual([expected]);
        });

        test("csv with one line ", async () => {
            const csv = createCsv({ content: "1;action;label;periode;fx" });
            const expected = await FilesParser.createNull().parse("default_name", [csv]);
            expected.name = "Project (0)";
            await expect(Application.createNull().add([csv])).resolves.toEqual([expected]);
        });

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
            const application = Application.createNull();
            const project = await addProject(application);
            await expect(application.delete(project.key)).resolves.toEqual([]);
        });

        test("fails is project not present", async () => {
            await expect(Application.createNull().delete("id")).rejects.toThrow("Could not found project with id=id");
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
                await expect(Application.createNull().deleteColor("id", null)).rejects.toThrow("Could not found project with id=id");
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
                await expect(Application.createNull().updateColorDistribution("id", null)).rejects.toThrow("Could not found project with id=id");
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