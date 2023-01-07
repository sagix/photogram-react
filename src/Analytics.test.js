import { cleanPageName } from './Analytics'
import Uuidv4 from './FilesParser/uuidv4'

describe("Analytics", () => {
    describe("id as number", () => {
        test("in last position", () => {
            expect(cleanPageName("page/01")).toEqual("page/{id}");
        });

        test("in middle position", () => {
            expect(cleanPageName("page/01/edit")).toEqual("page/{id}/edit");
        });
    });
    
    describe("id as uuid", () => {
        test("in last position", () => {
            expect(cleanPageName(`page/${Uuidv4.createNull().generate()}`)).toEqual("page/{id}");
        });

        test("in middle position", () => {
            expect(cleanPageName(`page/${Uuidv4.createNull().generate()}/edit`)).toEqual("page/{id}/edit");
        });
    });

    describe("identity", () => {
        test("null", () => {
            expect(cleanPageName(null)).toBeNull();
        });

        test("undefined", () => {
            expect(cleanPageName(undefined)).toBeUndefined();
        });

        test("string", () => {
            expect(cleanPageName("string")).toEqual("string");
        });
    });


});