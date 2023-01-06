import Images from './Images';

describe("Images", () => {
    test("insert a image", async () => {
        await expect(Images.createNull().execute("id", [createPng({})])).resolves.toEqual([{
            name: "not_data.png",
            url: "/project/id/images/not_data.png/"
        }]);
    });
    test("other not image files should be ignored", async () => {
        await expect(Images.createNull().execute("id", [createFile("file.txt", "", "plain/text")])).resolves.toEqual([]);
    });

    describe("Clear", () => {
        test("returns true if present", async () => {
            const images = Images.createNull();
            await images.execute("id", [createPng()]);
            await expect(images.clear("id")).resolves.toEqual(null);
        });
        test("returns false is not present", async () => {
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