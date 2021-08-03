import { _convertArrayToObject } from "./convert-array-to-object.helper";
import { _filter } from "./filter.helper";
import { _find } from "./find.helper";
import { _getRangeById } from "./get-range-by-id.helper";
import { _groupBy } from "./group-by.helper";
import { _removeById } from "./remove-by-id.helper";

describe('_removeById', () => {

    beforeEach(() => {});

    it('should remove entity with given id', () => {
        const samples = [{id: 1, value: 10}, {id: 2, value: 10}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _removeById(samples, 2, "id")
        expect(res.length).toBe(samples.length - 1);
        for(const entity of res) expect(entity.id).not.toEqual(2);
    });

    it('should return copy of array if no entity was removed', () => {
        const samples = [{id: 1, value: 10}, {id: 2, value: 10}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _removeById(samples, 22, "id")
        expect(res.length).toBe(samples.length);
        expect(res === samples).toBeFalse();
    });

    it('should return empty array if input array is null', () => {
        const res = _removeById<{id: string}>(null, "2", "id")
        expect(res.length).toBe(0);
    });
});
  