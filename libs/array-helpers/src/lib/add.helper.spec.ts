import { _add } from "./add.helper";


const entities = [{id: 1, value: 10}, {id: 2, value: 20}, {id: 3, value: 30}, {id: 4, value: 40}]

describe('_add', () => {

    beforeEach(() => {});
  
    it('should add object to start of array', () => {
        const sampleEntity = {id: 5, value: 10};
        const res = _add(entities, sampleEntity)
        expect(res.length).toBe(entities.length + 1);
        expect(res[0].id).toBe(5);
    });
  
    it('should return new array with item if input array is null', () => {
        const sampleEntity = {id: 5, value: 10};
        const res = _add(null, sampleEntity)
        expect(res.length).toBe(1);
        expect(res[0].id).toBe(5);
    });

});
  