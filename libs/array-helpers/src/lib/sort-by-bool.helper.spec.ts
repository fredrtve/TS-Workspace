import { _convertArrayToObject } from "./convert-array-to-object.helper";
import { _filter } from "./filter.helper";
import { _find } from "./find.helper";
import { _getRangeById } from "./get-range-by-id.helper";
import { _groupBy } from "./group-by.helper";
import { _removeById } from "./remove-by-id.helper";
import { _removeRangeById } from "./remove-range-by-id.helper";
import { _removeRangeByProp } from "./remove-range-by-prop.helper";
import { _sortByBool } from "./sort-by-bool.helper";

describe('_sortByBool', () => {

    beforeEach(() => {});

    it('should sort array with true values first when specified', () => {
        const samples = [{id: 1, bool: false}, {id: 2, bool: true}, {id: 3, bool: true}, {id: 4, bool: false}]
        const res = _sortByBool(samples, "bool", true)
        expect(res[0].bool).toBeTrue();
        expect(res[1].bool).toBeTrue();
    });

    it('should sort array with falsy values first when specified', () => {
        const samples = [{id: 1, bool: false}, {id: 2, bool: true}, {id: 3, bool: null}, {id: 4, bool: true}]
        const res = _sortByBool(samples, "bool", false)
        expect(res[0].bool).toBeFalsy();
        expect(res[1].bool).toBeFalsy();
    });

    it('should sort array with falsy values first when unspecified', () => {
        const samples = [{id: 1, bool: false}, {id: 2, bool: true}, {id: 3, bool: true}, {id: 4, bool: null}]
        const res = _sortByBool(samples, "bool")
        expect(res[0].bool).toBeFalsy();
        expect(res[1].bool).toBeFalsy();
    });

    it('should return empty array if input array is null', () => {
        const res = _sortByBool(null, "bool", true)
        expect(res.length).toBe(0);
    });
});
  