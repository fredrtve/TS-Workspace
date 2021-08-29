
import { _sortByDate } from "./sort-by-date.helper";

describe('_sortByDate', () => {

    beforeEach(() => {});

    it('should sort array in ascending order.', () => {
        const samples = [{id: 1, date: 200}, {id: 2, date: 3500}, {id: 3, date: new Date()}, {id: 4, date: 400}]
        const res = _sortByDate(samples, "date", "asc");
        expect(res).toBeDefined();
        for(let i = 1; i < res!.length; i++) 
            expect(res![i - 1].date < res![i].date).toBeTrue();
    });

    it('should sort array in descending order.', () => {
        const samples = [{id: 1, date: 200}, {id: 2, date: 3500}, {id: 3, date: new Date()}, {id: 4, date: 400}]
        const res = _sortByDate(samples, "date", "desc");
        expect(res).toBeDefined();
        for(let i = 1; i < res!.length; i++) 
            expect(res![i - 1].date > res![i].date).toBeTrue();
    }); 

    it('should sort falsy values last when ascending order.', () => {
        const samples = [{id: 1, date: undefined}, {id: 2, date: 3500}, {id: 3, date: null}, {id: 4, date: 400}]
        const res = _sortByDate(samples, "date", "asc");
        expect(res![samples.length - 1].date).toBeFalsy();
        expect(res![samples.length - 2].date).toBeFalsy();
    }); 

    it('should sort falsy values last when descending order.', () => {
        const samples = [{id: 1, date: undefined}, {id: 2, date: 3500}, {id: 3, date: null}, {id: 4, date: 400}]
        const res = _sortByDate(samples, "date", "desc");
        expect(res![samples.length - 1].date).toBeFalsy();
        expect(res![samples.length - 2].date).toBeFalsy();
    }); 

    it('should return null if input array is null.', () => {
        const res = _sortByDate(null, "date", "asc")
        expect(res).toBe(null);
    });
});
  