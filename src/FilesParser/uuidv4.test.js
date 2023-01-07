import Uuidv4 from './uuidv4';

describe("Uuidv4", () => {
    describe("create", () => {
        beforeAll(() => {
            global.crypto = null;
        })
        afterAll(() => {
            global.crypto = undefined;
        })
        test("happy path", () => {
            expect(() => Uuidv4.create()).not.toThrowError();
        })
    });

    test("null uuid", async () => {
        expect(Uuidv4.createNull().generate()).toEqual("10000000-1000-4000-2000-100000000000");
    });
});