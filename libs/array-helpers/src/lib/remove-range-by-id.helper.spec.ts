
import { _removeRangeById } from "./remove-range-by-id.helper";

describe('_removeRangeById', () => {

    beforeEach(() => {});

    it('should remove entities with given ids', () => {
        const samples = [{id: 1, value: 10}, {id: 2, value: 10}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _removeRangeById(samples, [2,3], "id")
        expect(res.length).toBe(samples.length - 2);
    });

    it('should return empty array if input array is null', () => {
        const res = _removeRangeById<{id: string}>(null, [2,5], "id")
        expect(res.length).toBe(0);
    });

    it('should return copy of array if no ids', () => {
        const samples = [{id: 1, value: 10}, {id: 2, value: 10}, {id: 3, value: 30}, {id: 4, value: 40}]
        const res = _removeRangeById(samples, [], "id")
        expect(res.length).toBe(samples.length);
        expect(res === samples).toBeFalse();
    });
});
  