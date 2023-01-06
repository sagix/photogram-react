import { readAsText, readAsArrayBuffer } from './FileReader';

describe("FileReader", () => {
    test("readAsText", async () => {
        const file = createFile({ content: "text" });
        const result = await readAsText(file);
        expect(result.result).toEqual("text");
    });
    test("readAsArrayBuffer", async () => {
        const file = createFile({ content: "text" });
        const result = await readAsArrayBuffer(file);
        expect(String.fromCharCode.apply(null, new Uint8Array(result.result))).toEqual("text");
    });
});

function createFile({ name = "file.txt", content = "", type = "plain/text" }) {
    return new File([content], name, { type: type })
}