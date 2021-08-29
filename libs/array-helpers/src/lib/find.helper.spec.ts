
import { _find } from "./find.helper";

const entities = [{id: 1, value: 10}, {id: 2, value: 20}, {id: 3, value: 30}, {id: 4, value: 40}]

describe('_find', () => {

    beforeEach(() => {});
  
    it('should find entity based on id', () => {
        const res = _find(entities, 3, "id");
        expect(res).toBeDefined();
        expect(res!.id).toBe(3);
    });

    it('should return undefined if not found', () => {
        const res = _find(entities, 5, "id")
        expect(res).toBe(undefined);
    });

    it('should return undefined if array is null', () => {
        const res = _find(null, 2, "id")
        expect(res).toBe(undefined);
    });

    it('should return undefined if value is null', () => {
        const res = _find(entities, null, "id")
        expect(res).toBe(undefined);
    });
});
  