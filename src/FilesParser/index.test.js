import FilesParser from './index'
import Csv from './Csv'
import Uuidv4 from './uuidv4';

describe('Parser', () => {

    test('parse data.csv and image', async () => {
        const identifier = Uuidv4.createNull().generate();
        const csv = createCsvFile({ name: "data.csv", content: "1" });
        const png = createPngFile({ name: "1.png" });
        const data = await new Csv().execute([csv]);
        data[0].url = `/project/${identifier}/images/1.png/`
        const result = FilesParser.createNull().parse("name", [csv, png]);
        await expect(result).resolves.toEqual({
            key: identifier,
            name: "name",
            data: data,
            template: "small",
            colors: {},
        });
    })

    test('parse only data.csv', async () => {
        const csv = createCsvFile({ name: "data.csv", content: "1" });
        const data = await new Csv().execute([csv]);
        const result = FilesParser.createNull().parse("name", [csv]);
        await expect(result).resolves.toEqual({
            key: Uuidv4.createNull().generate(),
            name: "name",
            data: data,
            template: "small",
            colors: {},
        });
    })

    test('fails with no files', async () => {
        const result = FilesParser.createNull().parse("name", []);
        await expect(result).rejects.toThrow("Could not found data.csv")
    });
});

function createCsvFile({ name = "not_data.csv", content = "" } = {}) {
    return new File([content], name, { type: 'text/csv' })
}

function createPngFile({ name = "not_data.png", content = "" } = {}) {
    return new File([content], name, { type: 'image/png' })
}