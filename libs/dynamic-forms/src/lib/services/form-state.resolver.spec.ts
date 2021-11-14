import { FormControl, FormGroup } from "@angular/forms";
import { Immutable } from "global-types";
import { asapScheduler, combineLatest } from "rxjs";
import { bufferCount, debounceTime, finalize, map, take, tap } from "rxjs/operators";
import { DynamicFormBuilder } from "../builder/dynamic-form.builder";
import { DynamicFormStore } from "./dynamic-form.store";
import { FormStateResolver } from "./form-state.resolver";

interface TestState { state1: string, state2: number }
interface TestForm { prop1: string, prop2: { nested1: string }}

const initialForm: Immutable<TestForm> = { prop1: "test1", prop2: { nested1: "test2"}};
const newForm: Immutable<TestForm> = { prop1: "new1", prop2: { nested1: "new2"}};
const initialState: Immutable<TestState> = { state1: "test1", state2: 2 };
const newState: Immutable<TestState> = { state1: "new1", state2: 4 };
const builder = new DynamicFormBuilder<TestForm, TestState>();

describe("Form State Resolver", () => {

    let store: DynamicFormStore<TestState>;
    let resolver: FormStateResolver;
    

    beforeEach(() => {
        store = new DynamicFormStore();
        store.form = new FormGroup({
            prop1: new FormControl(),
            prop2: new FormGroup({
                nested1: new FormControl()
            })
        });
        store.form.setValue(initialForm);
        store.setState(initialState);
        resolver = new FormStateResolver(store);
    });

    it('Should create single state prop only observable', (done) => {
        resolver.resolve$<string>(builder.bindState("state1")).pipe(take(2), bufferCount(2)).subscribe(([val1, val2]) => {
            expect(val1).toEqual(initialState.state1);
            expect(val2).toEqual(newState.state1);
            done();
        });
        Promise.resolve().then(x => store.setState({state1: newState.state1}));
    });

    it('Should create state only observable', (done) => {
        resolver.resolve$<TestState>(builder.bindState(["state1", "state2"], (s) => s)).pipe(take(2), bufferCount(2)).subscribe(([val1, val2]) => {
            expect(val1).toEqual(initialState);
            expect(val2).toEqual(newState);
            done();
        });
        Promise.resolve().then(x => store.setState(newState));
    });

    it('Should create single nested form prop only observable', (done) => {
        resolver.resolve$<string>(builder.bindForm("prop2.nested1")).pipe(take(2), bufferCount(2)).subscribe(([val1, val2]) => {
            expect(val1).toEqual(initialForm.prop2.nested1);
            expect(val2).toEqual(newForm.prop2.nested1);
            done();
        });
        Promise.resolve().then(x => store.form.patchValue({ prop2: { nested1: newForm.prop2.nested1 } }))
    });
    
    it('Should create form only observable', (done) => {
        resolver.resolve$<TestForm>(builder.bindForm(["prop1", "prop2"], (f) => f)).pipe(take(2), bufferCount(2)).subscribe(([val1, val2]) => {
            expect(val1).toEqual(initialForm);
            expect(val2).toEqual(newForm);
            done();
        });
        Promise.resolve().then(x => store.form.patchValue(newForm))
    });

    it('Should create form and state observable', (done) => {
        resolver.resolve$<any>(builder.bind(["prop1"], ["state1"], (f,s) => [f.prop1,s.state1])).pipe(
            take(2), bufferCount(2)).subscribe(([val1, val2]) => {
            expect(val1).toEqual([initialForm.prop1, initialState.state1]);
            expect(val2).toEqual([newForm.prop1, newState.state1]);
            done();
        });
        Promise.resolve().then(x => {
            store.form.patchValue(newForm);
            store.setState({state1: newState.state1});
        })
    });

    it('Should create form and state observable from observer selector', (done) => {
        resolver.resolve$<any>(builder.bindObserver(["prop1"], ["state1"], 
            (f,s) => combineLatest([f.pipe(map(x => x.prop1)),s.pipe(map(x => x.state1))]))).pipe(
            take(2), bufferCount(2)).subscribe(([val1, val2]) => {
            expect(val1).toEqual([initialForm.prop1, initialState.state1]);
            expect(val2).toEqual([newForm.prop1, newState.state1]);
            done();
        });
        Promise.resolve().then(x => {
            store.form.patchValue(newForm);
            store.setState({state1: newState.state1});
        })
    });

    it('Should create slice of multiple resolvers', (done) => {
        const slice = { test1: builder.bindForm("prop1"), test2: builder.bindState("state1"), test3: "somevalue" }
        resolver.resolveSlice$<any>(slice).pipe(
            debounceTime(0, asapScheduler),
            take(2), bufferCount(2)).subscribe(([val1, val2]) => {
            expect(val1).toEqual({test1: initialForm.prop1, test2: initialState.state1, test3: slice.test3});
            expect(val2).toEqual({test1: newForm.prop1, test2: newState.state1, test3: slice.test3});
            done();
        });
        Promise.resolve().then(x => {
            store.form.patchValue(newForm);
            store.setState({state1: newState.state1});
        })
    });

    it('Should resolve values without selector', (done) => {
        resolver.resolve$<any>("test").pipe(take(1)).subscribe(val => {
            expect(val).toEqual("test");
            done();
        });
    });

    it('Should create observable that completes after first emission', (done) => {
        let emissions = 0;
        resolver.resolve$<string>(builder.bindForm("prop2.nested1", null, true)).pipe(
            tap(x => emissions = emissions + 1),
            finalize(() => {
                expect(emissions).toEqual(1);
                done();
            })
        ).subscribe();
    });
});