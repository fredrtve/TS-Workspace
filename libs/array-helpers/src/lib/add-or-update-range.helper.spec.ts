import { sample } from "rxjs/operators";
import { _addOrUpdateRange } from "./add-or-update-range.helper";


const entities = [{id: 1, value: 10}, {id: 2, value: 20}, {id: 3, value: 30}, {id: 4, value: 40}]

describe('_addOrUpdateRange', () => {

    beforeEach(() => {});
  
    it('should add two new objects to start of array', () => {
        const sampleEntites = [{id: 5, value: 10}, {id: 6, value: 10}];
        const res = _addOrUpdateRange(entities, sampleEntites, "id")
        expect(res.length).toBe(entities.length + sampleEntites.length);
        expect(res[0].id).toBe(5);
        expect(res[1].id).toBe(6);
    });

    it('should update two existing objects', () => {
        const sampleEntites = [{id: 1, value: 11}, {id: 3, value: 31}];
        const res = _addOrUpdateRange(entities, sampleEntites, "id")
        expect(res.length).toBe(entities.length);
        expect(res[0].value).toBe(sampleEntites[0].value);
        expect(res[2].value).toBe(sampleEntites[1].value);
    });

    it('should update existing object and add new object', () => {
        const sampleEntites = [{id: 5, value: 11}, {id: 2, value: 31}];
        const res = _addOrUpdateRange(entities, sampleEntites, "id")
        expect(res.length).toBe(entities.length + 1);
        expect(res[0].id).toBe(5);
        expect(res[2].value).toBe(sampleEntites[1].value);
    });

    it('should return copy of new values if input array is null', () => {
        const sampleEntites = [{id: 5, value: 10}, {id: 6, value: 10}];
        const res = _addOrUpdateRange(null, sampleEntites, "id")
        expect(res.length).toBe(sampleEntites.length);
        expect(res === sampleEntites).toBeFalse();
        expect(res[0].id).toBe(5);
        expect(res[1].id).toBe(6);
    });

    it('should return copy of input array if values are null', () => {
        const res = _addOrUpdateRange(entities, null, "id")
        expect(res.length).toBe(entities.length);
        expect(res === entities).toBeFalse();
    });
});
  