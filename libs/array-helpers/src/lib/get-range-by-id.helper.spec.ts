import { _convertArrayToObject } from "./convert-array-to-object.helper";
import { _filter } from "./filter.helper";
import { _find } from "./find.helper";
import { _getRangeById } from "./get-range-by-id.helper";

const entities = [{id: 1, value: 10}, {id: 2, value: 20}, {id: 3, value: 30}, {id: 4, value: 40}]

describe('_getRangeById', () => {

    beforeEach(() => {});
  
    it('should find entities', () => {
        const res = _getRangeById(entities, [1, 3], "id");
        expect(res.length).toBe(2);
    });
  
    it('should find only one entity', () => {
        const res = _getRangeById(entities, [1, 5], "id");
        expect(res.length).toBe(1);
    });

    it('should return empty array if none are found', () => {
        const res = _getRangeById(entities, [5,6], "id")
        expect(res.length).toBe(0);
    });

    it('should return empty array if array is null', () => {
        const res = _getRangeById(null, [1, 2], "id")
        expect(res.length).toBe(0);
    });

    it('should return empty array if no ids', () => {
        const res = _getRangeById(entities, [], "id")
        expect(res.length).toBe(0);
    });
});
  