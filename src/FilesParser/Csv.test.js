import Csv from './Csv';

describe("Csv", () => {
    test("parse empty file", async () => {
        await expect(new Csv().execute([createFile({
            name: "data.csv",
            content: ""
        })])).resolves.toEqual([]);

    });

    test("parse one line with just id", async () => {
        await expect(new Csv().execute([createFile({
            name: "data.csv",
            content: "1"
        })])).resolves.toEqual([{
            action: undefined,
            fx: undefined,
            id: "1",
            label: "",
            periode: "",
            sequence: "1"
        }]);
    });

    test("parse one line with all information", async () => {
        await expect(new Csv().execute([createFile({
            name: "data.csv",
            content: "1;action;label;periode;fx"
        })])).resolves.toEqual([{
            action: "action",
            fx: "fx",
            id: "1",
            label: "label",
            periode: "periode",
            sequence: "1"
        }]);
    });

    test("Ignore lines that do not start with number", async () => {
        await expect(new Csv().execute([createFile({
            name: "data.csv",
            content: "A"
        })])).resolves.toEqual([]);
    });
    test("fails with no files", async () => {
        await expect(new Csv().execute([createFile()])).rejects.toThrow("Could not found data.csv")
    });
});

function createFile({ name = "not_data.csv", content = "" } = {}) {
    return new File([content], name, { type: 'text/csv' })
}