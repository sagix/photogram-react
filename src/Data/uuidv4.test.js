import Uuidv4 from './uuidv4';

describe("Uuidv4", () => {
    test("null uuid", async () => {
        expect(Uuidv4.createNull().generate()).toEqual("10000000-1000-4000-2000-100000000000");
    });
});