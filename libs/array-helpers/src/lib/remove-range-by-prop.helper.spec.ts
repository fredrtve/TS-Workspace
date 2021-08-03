import { _convertArrayToObject } from "./convert-array-to-object.helper";
import { _filter } from "./filter.helper";
import { _find } from "./find.helper";
import { _getRangeById } from "./get-range-by-id.helper";
import { _groupBy } from "./group-by.helper";
import { _removeById } from "./remove-by-id.helper";
import { _removeRangeById } from "./remove-range-by-id.helper";
import { _removeRangeByProp } from "./remove-range-by-prop.helper";

describe('_removeRangeByProp', () => {

    beforeEach(() => {});

    it('should remove entities based on given prop with array of values', () => {
        const samples = [{id: 1, value: 10}, {id: 2, value: 10}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _removeRangeByProp(samples, [10, 40], "value")
        expect(res.length).toBe(1);
        expect(res[0].value).toBe(30);
    });

    it('should remove entities based on given prop with single values', () => {
        const samples = [{id: 1, value: 10}, {id: 2, value: 10}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _removeRangeByProp(samples, 10, "value")
        expect(res.length).toBe(2);
        for(const entity of res) expect(entity.value).not.toEqual(10);
    });

    it('should return empty array if input array is null', () => {
        const res = _removeRangeByProp(null, [2,5], "value")
        expect(res.length).toBe(0);
    });
});
  