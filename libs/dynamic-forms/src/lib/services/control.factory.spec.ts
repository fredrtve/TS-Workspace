import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { first, map } from "rxjs/operators";
import { hasRequiredField } from "../../test-assets/has-required-field.helper";
import { ProviderShellComponent } from "../../test-assets/provider-shell.component";
import { DynamicFormBuilder } from "../builder/dynamic-form.builder";
import { _createControlArray, _createControlField, _createControlGroup } from "../builder/type.helpers";
import { ControlOptions, DynamicControlFieldOptions } from "../interfaces";

type TestState = Required<Omit<ControlOptions, "controlClass$" | "asyncValidators">>

const bindOptionsToState = (controlCfg: any, keys: string[]) => {
    const builder = new DynamicFormBuilder<any, TestState>();
    for(const key of keys)
        controlCfg[key] = builder.bindState(<any> key) 
}

const assertCreateControl = (control: AbstractControl, type: any, value: any) => {
    expect(control).toBeInstanceOf(type);
    expect(control.value).toEqual(value);
}
const assertConfigureControl = (control: AbstractControl, state: TestState, testValue: any, done?: Function) => {
    expect(control.disabled).toBe(state.disabled$);
    if(state.validators$?.length) expect(control.validator).not.toBeNull();
    else expect(control.validator).toBeNull();
}

describe("Control Component Renderer", () => {

    const getFixture = (): ComponentFixture<ProviderShellComponent> => TestBed.createComponent(ProviderShellComponent);

    beforeEach(() => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        TestBed.configureTestingModule({ 
            declarations: [ProviderShellComponent]
        });
    });
    afterEach(() => { jasmine.clock().uninstall(); });

    it('Should create form control with initial value if dynamic control field', () => {
        const { factory } = getFixture().componentInstance;
        const initialValue = "test";
        const control = factory.createControl(_createControlField({ viewOptions: {} }), initialValue);
        assertCreateControl(control, FormControl, initialValue);
    });

    it('Should create form array with initial value if dynamic control array', () => {
        const { factory } = getFixture().componentInstance;
        const initialValue = [ {test: "value1"}, {test: "value2"} ]; 
        const controlFieldCfg = _createControlField({ viewOptions: {} });
        const controlGrpCfg = _createControlGroup<any>()({ controls: { test: controlFieldCfg }, viewOptions: {} })
        const controlCfg = _createControlArray<any>()({ controlTemplate: controlGrpCfg, viewOptions: { testOption$: "" } });
        const control = factory.createControl(controlCfg, initialValue);

        assertCreateControl(control, FormArray, initialValue);
        expect(control.controls.length).toEqual(initialValue.length);
        for(const index in control.controls){
            const entry = <FormGroup> control.controls[index];
            const entryInitialValue = initialValue[index];
            
            assertCreateControl(entry, FormGroup, entryInitialValue);
            assertCreateControl(entry.controls.test, FormControl, entryInitialValue.test);
        }
    });

    it('Should create form group with initial value if dynamic control group', () => {
        const { factory } = getFixture().componentInstance;
        const initialValue = { testField: "test1", testArr: ["test2", "test3"], testGrp: { test: "test4" }}; 
        const controlFieldCfg = _createControlField({ viewOptions: {} });
        const controlCfg = _createControlGroup<typeof initialValue>()({ viewOptions: {}, controls: { 
            testField: controlFieldCfg,
            testArr: _createControlArray<{}>()({ controlTemplate: controlFieldCfg, viewOptions: { testOption$: "" } }),
            testGrp: _createControlGroup<any>()({ controls: { test: controlFieldCfg }, viewOptions: {} }) 
        }});

        const control = factory.createControl(controlCfg, initialValue);
        const nestedArr = <FormArray> control.controls.testArr;
        assertCreateControl(control, FormGroup, initialValue);
        assertCreateControl(control.controls.testField, FormControl, initialValue.testField);
        assertCreateControl(control.controls.testGrp, FormGroup, initialValue.testGrp);
        assertCreateControl((<FormGroup> control.controls.testGrp).controls.test, FormControl, initialValue.testGrp.test);
        assertCreateControl(control.controls.testArr, FormArray, initialValue.testArr);
        expect(nestedArr.controls.length).toEqual(initialValue.testArr.length);
        for(const index in nestedArr.controls)
            assertCreateControl(nestedArr.controls[index], FormControl, initialValue.testArr[index]);
        
    });

    it('Should configure control field with reactive values', (done) => {
        type FormState = TestState & Required<Pick<DynamicControlFieldOptions, "required$">>;
        const { factory, store } = getFixture().componentInstance;
        const initialState: FormState = { 
            required$: false, disabled$: false, validators$: []
        }

        store.setState(initialState);
        let controlCfg: any = { viewOptions: {} }; 
        bindOptionsToState(controlCfg, Object.keys(initialState));
        const control = factory.configureControl(controlCfg, new FormControl());

        Promise.resolve().then(() => { 
            assertConfigureControl(control, initialState, "test");
            expect(hasRequiredField(control)).toBe(initialState.required$);
        
            const newState : FormState = { required$: true, disabled$: false, validators$: [Validators.minLength(1)] };
            store.setState(newState);
            Promise.resolve().then(() => { 
                assertConfigureControl(control, newState, "test");
                expect(hasRequiredField(control)).toBe(newState.required$);

                const newState2 : FormState = { ...newState, disabled$: true };   
          
                store.setState(newState2);
                Promise.resolve().then(() => { 
                    assertConfigureControl(control, newState2, "test");
                    done();
                });
            });
           
        })
    })

    it('Should configure control array with reactive values', (done) => {
        const { factory, store } = getFixture().componentInstance;
        const initialState: TestState = { disabled$: false, validators$: [] }
        store.setState(initialState);
        let controlField = _createControlField({viewOptions: {} });
        let controlArray: any = { viewOptions: {}, controls: [controlField]};
        bindOptionsToState(controlField, Object.keys(initialState)); 
        bindOptionsToState(controlArray, Object.keys(initialState));
        Promise.resolve().then(() => { 
            const control = <FormArray> factory.configureControl(controlArray, new FormArray([new FormControl()]));
            assertConfigureControl(control, initialState, ["test"]);
            assertConfigureControl(control.controls[0], initialState, "test");

            const newState : TestState = { disabled$: false, validators$: [Validators.minLength(1)] };
            store.setState(newState);
            Promise.resolve().then(() => { 
                assertConfigureControl(control, newState, ["test"]);
                assertConfigureControl(control.controls[0], newState, "test");

                const newState2 : TestState = { ...newState, disabled$: true };
                store.setState(newState2);
                Promise.resolve().then(() => { 
                    assertConfigureControl(control, newState2, ["test"]);
                    assertConfigureControl(control.controls[0], newState2, "test");
                    done();
                })
            })
        })
    })

    it('Should configure control group with reactive values', (done) => {
        const { factory, store } = getFixture().componentInstance;
        const initialState: TestState = { disabled$: false, validators$: [] }
        store.setState(initialState);
        let controlField = _createControlField({viewOptions: {} });
        let controlGroup: any = { viewOptions: {}, controls: {field: controlField} };
        bindOptionsToState(controlField, Object.keys(initialState)); 
        bindOptionsToState(controlGroup, Object.keys(initialState));
        Promise.resolve().then(() => { 
            const control = <FormGroup> factory.configureControl(controlGroup, new FormGroup({field: new FormControl()}));

            assertConfigureControl(control, initialState, {field: "test"});
            assertConfigureControl(control.controls.field, initialState, "test");

            const newState : TestState = { disabled$: false, validators$: [Validators.minLength(1)] };
            store.setState(newState);
            Promise.resolve().then(() => { 
                assertConfigureControl(control, newState, {field: "test"});
                assertConfigureControl(control.controls.field, newState, "test");

                const newState2 : TestState = { ...newState, disabled$: true };
                store.setState(newState2);
                Promise.resolve().then(() => { 
                    assertConfigureControl(control, newState2, {field: "test"});
                    assertConfigureControl(control.controls.field, newState2, "test");
                    done();
                })
            })
        })
    })

    it('Should configure control with async validator', (done) => {
        const { factory, store } = getFixture().componentInstance;
        const initialState = { asyncValidatorToggle: false }
        store.setState(initialState);
        const testAsyncValidator = new DynamicFormBuilder<any, any>().asyncValidator("asyncValidatorToggle", 
            (s$) => (control) => s$.pipe(first(), map(x => x ? {asyncErr: "err"} : null))
        );
        let controlCfg: any = { viewOptions: {}, asyncValidators: [testAsyncValidator] }; 
        const control = factory.configureControl(controlCfg, new FormControl());
        control.setValue('test');
        Promise.resolve().then(() => {
            expect(control.asyncValidator).not.toBeNull();
            expect(control.getError("asyncErr")).toBeFalsy();
            store.setState({ asyncValidatorToggle: true });
            control.setValue('test2');
            Promise.resolve().then(() => {
                expect(control.getError("asyncErr")).toBeTruthy();
                done();
            });
        })
    })
});