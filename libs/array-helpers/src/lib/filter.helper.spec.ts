
import { _filter } from "./filter.helper";

const entities = [{id: 1, value: 10}, {id: 2, value: 20}, {id: 3, value: 30}, {id: 4, value: 40}]

describe('_filter', () => {

    beforeEach(() => {});
  
    it('should filter entities based on expression', () => {
        const res = _filter(entities, (e) => e.value > 20)
        expect(res.length).toBe(2);
        expect(res[0].value).toBeGreaterThan(20);
    });
    
    it('should return empty array if null value', () => {
        const res = _filter(null, (e) => true)
        expect(res.length).toBe(0);
    });
});
  