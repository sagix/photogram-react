import Images from './Images';

describe("Images", () => {

    describe("create", () => {
        beforeAll(() => {
            global.caches = null;
        })
        afterAll(() => {
            global.caches = undefined;
        })
        test("happy path", () => {
            expect(() => Images.create()).not.toThrowError();
        })
    });

    describe("execute", () => {
        test("put an image in storage", async () => {
            await expect(Images.createNull().execute("id", [createPng()])).resolves.toEqual([{
                name: "not_data.png",
                url: "/project/id/images/not_data.png/"
            }]);
        });

        test("ignores non image type", async () => {
            await expect(Images.createNull().execute("id", [createFile("file.txt", "", "plain/text")])).resolves.toEqual([]);
        });

        test("fails if quota is exceeded", async () => {
            await expect(Images.createNull({
                factory: () => { throw new TypeError("Bad url") }
            }).execute("id", [createPng()])).rejects.toThrow("Bad url");
        });
    });

    describe("Clear", () => {
        test("returns null if present", async () => {
            const images = Images.createNull();
            await images.execute("id", [createPng()]);
            await expect(images.clear("id")).resolves.toEqual(null);
        });
        
        test("fails if not present", async () => {
            await expect(Images.createNull().clear("id")).rejects.toThrow("Cannot delete the cache: id");
        });

        test("fails if if empty", async () => {
            const images = Images.createNull();
            await images.execute("id", []);
            await expect(Images.createNull().clear("id")).rejects.toThrow("Cannot delete the cache: id");
        });
    })
});

function createPng({ name = "not_data.png", content = "" } = {}) {
    return createFile(name, content, 'image/png')
}

function createFile(name, content, type) {
    return new File([content], name, { type: type })
}