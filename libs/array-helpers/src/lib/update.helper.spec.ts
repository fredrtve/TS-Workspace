import { _convertArrayToObject } from "./convert-array-to-object.helper";
import { _filter } from "./filter.helper";
import { _find } from "./find.helper";
import { _getRangeById } from "./get-range-by-id.helper";
import { _groupBy } from "./group-by.helper";
import { _removeById } from "./remove-by-id.helper";
import { _removeRangeById } from "./remove-range-by-id.helper";
import { _removeRangeByProp } from "./remove-range-by-prop.helper";
import { _sortByBool } from "./sort-by-bool.helper";
import { _sortByDate } from "./sort-by-date.helper";
import { _update } from "./update.helper";

describe('_update', () => {

    beforeEach(() => {});

    it('should update value on entity with given id.', () => {
        const samples = [
            {id: 1, date: 10, val: "one"}, 
            {id: 2, date: 20, val: "two"}, 
            {id: 3, date: 30, val: "three"}, 
            {id: 4, date: 40, val: "four"}
        ];
        const newData = {id: 2, val: "nottwo"}
        const res = _update(samples, newData, "id");
        const updatedEntity = res[1];
        expect(updatedEntity.val).toEqual(newData.val);
        expect(updatedEntity.date).toEqual(20);
    });

    it('should return empty array if input array is null.', () => {
        const res = _update(null, {id: 3}, "id")
        expect(res.length).toBe(0);
    });
});
  