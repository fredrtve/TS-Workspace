
import { _groupBy } from "./group-by.helper";

describe('_groupBy', () => {

    beforeEach(() => {});

    it('should group objects by selected property', () => {
        const samples = [{id: 1, value: 10}, {id: 2, value: 10}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _groupBy(samples, "value")
        expect(res[10].length).toBe(2);
        expect(res[30].length).toBe(1);
        expect(res[40].length).toBe(1);
    });

    it('should group null values in "null" string property', () => {
        const samples = [{id: 1, value: 10}, {id: 2, value: null}, {id: 3, value: null}, {id: 4, value: 40}]
        const res = _groupBy(samples, "value")
        expect(res['null'].length).toBe(2);
    });

    it('should group undefined values in "undefined" string property', () => {
        const samples = [{id: 1, value: 10}, {id: 2, value: undefined}, {id: 3, value: undefined}, {id: 4, value: 40}]
        const res = _groupBy(samples, "value")
        expect(res['undefined'].length).toBe(2);
    });

    it('should return empty object if array is null', () => {
        const res = _groupBy(null, "value")
        expect(Object.keys(res).length).toBe(0);
    });
});
  