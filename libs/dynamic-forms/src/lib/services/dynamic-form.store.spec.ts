import { bufferCount, first, take } from "rxjs/operators";
import { DynamicFormStore } from "./dynamic-form.store";

describe("Dynamic Form Store", () => {

    it('Should set and subscribe to state', (done) => {
        const store = new DynamicFormStore<any>();
        const state = {test: true};
        store.state$.pipe(take(2),bufferCount(2)).subscribe(([val1, val2]) => { 
            expect(val1).toEqual({});
            expect(val2 === state).toBeFalse();
            expect(val2).toEqual(state) 
            done();
        });
        Promise.resolve().then(x => store.setState(state))
    })

    it('Should merge new state with existing state', () => {
        const store = new DynamicFormStore<any>();
        const initialState = {test1: true, test2: false};
        store.setState(initialState);
        const newState = {test3: true, test4: false};
        store.setState(newState);
        expect(store.state).toEqual({...initialState, ...newState})
    })

})