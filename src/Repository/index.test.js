import Repository from "./index";
import FilesParser from "../FilesParser";

describe("Repository", () => {

    describe("add", () => {
        test("csv", async () => {
            const csv = createCsv();
            const expected = await FilesParser.createNull().parse("default_name", [csv]);
            expected.name = "Project (0)";
            await expect(Repository.createNull().add([csv])).resolves.toEqual([expected]);
        });

        test("csv with webkitRelativePath", async () => {
            const csv = createCsv();
            csv.webkitRelativePath = "csv"
            const expected = await FilesParser.createNull().parse("default_name", [csv]);
            expected.name = "csv";
            await expect(Repository.createNull().add([csv])).resolves.toEqual([expected]);
        });

        test("csv with one line ", async () => {
            const csv = createCsv({ content: "1;action;label;periode;fx" });
            const expected = await FilesParser.createNull().parse("default_name", [csv]);
            expected.name = "Project (0)";
            await expect(Repository.createNull().add([csv])).resolves.toEqual([expected]);
        });

        test("fails if no data.csv is present", async () => {
            await expect(Repository.createNull().add([])).rejects.toThrow("Could not found data.csv");
        });

        test("fails if quota is exceeded", async () => {
            const csv = createCsv();
            await expect(Repository.createNull({
                localStorage: {
                    setItem: () => { throw new DOMException("QuotaExceededError") }
                }
            }).add([csv]))
                .rejects.toThrow("QuotaExceededError");
        });
    });


    describe("list", () => {
        test("empty", async () => {
            await expect(Repository.createNull().list()).resolves.toEqual([]);
        })

        test("one item", async () => {
            const repository = Repository.createNull();
            const project = await addProject(repository);
            await expect(repository.list()).resolves.toEqual([project]);
        });
    });

    describe("delete", () => {
        test("delete one item", async () => {
            const repository = Repository.createNull();
            const project = await addProject(repository);
            await expect(repository.delete(project.key)).resolves.toEqual([]);
        });

        test("fails is project not present", async () => {
            await expect(Repository.createNull().delete("id")).rejects.toThrow("Could not found project with id=id");
        });


        test("fails if quota is exceeded", async () => {
            const repository = Repository.createNull({
                localStorage: {
                    setItem: (_, value, action) => {
                        if (value === "[]") {
                            throw new DOMException("QuotaExceededError")
                        } else {
                            action()
                        }
                    }
                }
            });
            const project = await addProject(repository);
            await expect(repository.delete(project.key)).rejects.toThrow("QuotaExceededError");
        });
    });

    describe("get", () => {
        test("returns the project", async () => {
            const repository = Repository.createNull();
            const project = await addProject(repository);
            await expect(repository.get(project.key)).resolves.toEqual(project);
        });

        test("fails is project not found", async () => {
            await expect(Repository.createNull().get("id")).rejects.toThrow("Could not found project with id=id");
        });
    });

    describe("update", () => {
        test("found element", async () => {
            const repository = Repository.createNull();
            const project = await addProject(repository, createCsv({ content: "1" }));
            const changed = { id: "1", action: "action" };

            await repository.update(project.key, changed);

            const actual = await repository.get(project.key);
            expect(actual.data).toEqual([changed]);
        });

        test("new label", async () => {
            const repository = Repository.createNull();
            const project = await addProject(repository, createCsv({ content: "1" }));
            const changed = { id: "1", label: "label" };

            await repository.update(project.key, changed);

            const actual = await repository.get(project.key);
            expect(actual.data).toEqual([changed]);
            expect(actual.colors).toEqual({ "label": "#F44336" });
        });

        test("do nothing if element not found", async () => {
            const repository = Repository.createNull();
            const project = await addProject(repository, createCsv({ content: "1" }));
            const changed = { id: "2", action: "action" };

            await repository.update(project.key, changed);

            await expect(repository.get(project.key)).resolves.toEqual(project);
        });

        test("fails is project not found", async () => {
            await expect(Repository.createNull().update("id", null)).rejects.toThrow("Could not found project with id=id");
        });
    });

    describe("color", () => {
        describe("update", () => {
            test("update the one found, create the other one", async () => {
                const repository = Repository.createNull();
                const project = await addProject(repository, createCsv({ content: "1;action;label;periode;fx" }));
                const changed = { label: "#000000", other: "#FFFFFF" };

                await repository.updateColor(project.key, changed);

                const actual = await repository.get(project.key);
                expect(actual.colors).toEqual(changed);
            });
            test("fails is project not found", async () => {
                await expect(Repository.createNull().updateColor("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });

        describe("delete", () => {
            test("found color", async () => {
                const repository = Repository.createNull();
                const project = await addProject(repository, createCsv({ content: "1;action;label;periode;fx" }));

                await repository.deleteColor(project.key, "label");

                const actual = await repository.get(project.key);
                expect(actual.colors).toEqual({});
                expect(actual.data[0].label).toEqual(undefined);
            });

            test("do nothing if element not found", async () => {
                const repository = Repository.createNull();
                const project = await addProject(repository, createCsv({ content: "1;action;label;periode;fx" }));

                await repository.deleteColor(project.key, "unkown");

                await expect(repository.get(project.key)).resolves.toEqual(project);
            });

            test("fails is project not found", async () => {
                await expect(Repository.createNull().deleteColor("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });

        describe("distribution", () => {
            test("update", async () => {
                const repository = Repository.createNull();
                const project = await addProject(repository, createCsv());

                await repository.updateColorDistribution(project.key, "card");

                const actual = await repository.get(project.key);
                expect(actual.colorDistribution).toEqual("card");
            });

            test("fails is project not found", async () => {
                await expect(Repository.createNull().updateColorDistribution("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });
    });

    describe("update", () => {
        describe("font family", () => {
            test("update", async () => {
                const repository = Repository.createNull();
                const project = await addProject(repository, createCsv());

                await repository.updateFontFamily(project.key, "font");

                const actual = await repository.get(project.key);
                expect(actual.fontFamily).toEqual("font");
            });

            test("fails is project not found", async () => {
                await expect(Repository.createNull().updateColorDistribution("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });

        describe("template", () => {
            test("update", async () => {
                const repository = Repository.createNull();
                const project = await addProject(repository, createCsv());

                await repository.updateTemplate(project.key, "large");

                const actual = await repository.get(project.key);
                expect(actual.template).toEqual("large");
            });
            test("fails is project not found", async () => {
                await expect(Repository.createNull().updateColorDistribution("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });

        describe("main picture", () => {

            test("update", async () => {
                const repository = Repository.createNull();
                const project = await addProject(repository, createCsv());

                await repository.updateMainPicture(project.key, "2");

                const actual = await repository.get(project.key);
                expect(actual.mainPicture).toEqual("2");
            });

            test("fails is project not found", async () => {
                await expect(Repository.createNull().updateColorDistribution("id", null)).rejects.toThrow("Could not found project with id=id");
            });
        });
    });
});

async function addProject(repository, csv = createCsv()) {
    const result = await repository.add([csv, createPng()]);
    return result[result.length - 1];
}

function createCsv({ name = "data.csv", content = "" } = {}) {
    return new File([content], name, { type: 'text/csv' });
}

function createPng({ name = "image.png", content = "" } = {}) {
    return new File([content], name, { type: 'image/png' });
}