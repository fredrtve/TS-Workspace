import { _convertArrayToObject } from "./convert-array-to-object.helper";

describe('_convertArrayToObject', () => {

    beforeEach(() => {});
  
    it('should convert object array to key-value object with selector function', () => {
        const entities = [{id: 1, value: 10}, {id: 2, value: 20}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _convertArrayToObject(entities, (e) => e.id)
        expect(Object.keys(res).length).toBe(entities.length);
        expect(res[1].value).toBe(10);
        expect(res[3].value).toBe(30);
    });

    it('should convert object array to key-value object with property string', () => {
        const entities = [{id: 1, value: 10}, {id: 2, value: 20}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _convertArrayToObject(entities, "id")
        expect(Object.keys(res).length).toBe(entities.length);
        expect(res[1].value).toBe(10);
        expect(res[3].value).toBe(30);
    });

    it('should convert object array to key-value object with numeric keys', () => {
        const entities = [{id: 1, value: 10}, {id: 2, value: 20}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _convertArrayToObject(entities, "id")
        expect(Object.keys(res).length).toBe(entities.length);
        expect(res[1].value).toBe(10);
        expect(res[3].value).toBe(30);
    });

    it('should convert object array to key-value object with string keys', () => {
        const entities = [{id: "1", value: 10}, {id: "2", value: 20}, {id: "3", value: 30}, {id: "4", value: 40}]
        const res = _convertArrayToObject(entities, "id")
        expect(Object.keys(res).length).toBe(entities.length);
        expect(res["1"].value).toBe(10);
        expect(res["3"].value).toBe(30);
    });

    it('should convert string array to object with values as keys', () => {
        const entities = ["1", "2","3"]
        const res = _convertArrayToObject(entities)
        expect(Object.keys(res).length).toBe(entities.length);
        expect(res["1"]).toBe("1");
        expect(res["3"]).toBe("3");
    });

    it('should convert numeric array to object with values as keys', () => {
        const entities = [1, 2, 3]
        const res = _convertArrayToObject(entities)
        expect(Object.keys(res).length).toBe(entities.length);
        expect(res[1]).toBe(1);
        expect(res[3]).toBe(3);
    });

    it('should return empty object if null value', () => {
        const res = _convertArrayToObject(null)
        expect(Object.keys(res).length).toBe(0);
    });

    it('should fail with object keys', () => {
        const entities = [{id: {key: 2}, value: 10}, {id: {key: 3}, value: 20}, {id: {key: 4}, value: 30}, {id: {key: 6}, value: 40}];
        const res = _convertArrayToObject(entities, "id");
        expect(Object.keys(res).length).toBe(1);
    });
});
  