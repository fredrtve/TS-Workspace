import { ComponentRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { ProviderShellComponent } from "../../test-assets/provider-shell.component";
import { TestControlArrayComponent } from "../../test-assets/test-control-array.component";
import { TestFieldComponent } from "../../test-assets/test-control-field.component";
import { TestControlGroupComponent } from "../../test-assets/test-control-group.component";
import { DynamicFormBuilder } from "../builder/dynamic-form.builder";
import { _createControlArray, _createControlField, _createControlGroup } from "../builder/type.helpers";
import { DYNAMIC_FORM_DEFAULT_OPTIONS } from "../injection-tokens.const";
import { AllowFormStateSelectors, ControlComponent, ControlOptions, DynamicFormDefaultOptions } from "../interfaces";

describe("Control Component Renderer", () => {

    const getFixture = (): ComponentFixture<ProviderShellComponent> => TestBed.createComponent(ProviderShellComponent);

    let fixture: ComponentFixture<ProviderShellComponent>;
    
    const assertBaseControl = (
        compRef: ComponentRef<ControlComponent<any, any>>, 
        controlCfg: AllowFormStateSelectors<ControlOptions,any,any>, 
        control: AbstractControl): void => {
        expect(compRef!.instance.formControl).toBe(control);
        expect(compRef!.instance.viewOptionSelectors).toBeDefined();
        const compEl = <HTMLElement> compRef!.location.nativeElement;
        expect(compEl.classList.contains(<string> controlCfg.controlClass$)).toBe(true);
        if(control instanceof FormGroup)
            expect(compEl.classList.contains(defaultOptions.groupClass!)).toBe(true);
        else if(control instanceof FormArray)
            expect(compEl.classList.contains(defaultOptions.arrayClass!)).toBe(true);
        else
            expect(compEl.classList.contains(defaultOptions.fieldClass!)).toBe(true);
    }

    const defaultOptions: DynamicFormDefaultOptions = {    
        groupClass: "default-group", arrayClass: "default-array", fieldClass: "default-field",
    }

    beforeEach(() => {
        TestBed.configureTestingModule({ 
            declarations: [ProviderShellComponent],
            providers: [
                { provide: DYNAMIC_FORM_DEFAULT_OPTIONS, useValue: defaultOptions }
            ]
        });
    });

    afterEach(() => {
        document.body.removeChild(fixture.debugElement.nativeElement);
        fixture.destroy();
    })

    it('should render control field with properties set & default class', () => {
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const testControl = _createControlField({
            viewComponent:  TestFieldComponent,
            viewOptions: { width$: "" },
            required$: false,
            controlClass$: "test-class"
        });

        let control = new FormControl();
        let compRef = renderer.renderControl(testControl, control, vcRef);

        expect(vcRef.length).toBe(1);
        assertBaseControl(compRef!, testControl, control);
        expect(compRef!.componentType).toBe(TestFieldComponent);
        expect(compRef!.instance.viewOptionSelectors.width$).toEqual(testControl.viewOptions.width$);
        expect(compRef!.instance.requiredSelector).toEqual(testControl.required$);
    })

    it('should not render control field when no view component specified', () => {
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const testControl = _createControlField({ viewOptions: { } });
        renderer.renderControl(testControl, new FormControl(), vcRef);
        expect(vcRef.length).toBe(0);
    })

    it('should render control group with specified component & properties set & default class', () => {
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const testGroup = _createControlGroup<{ test: string }>()({
            viewComponent:  TestControlGroupComponent,
            controls: {
                test: _createControlField({ viewOptions: {} })
            },
            viewOptions: { someOption$: "something" },
            controlClass$: "test-class"
        });

        let formGroup = new FormGroup({});
        let compRef = renderer.renderControl(testGroup, formGroup, vcRef);

        expect(vcRef.length).toBe(1);
        assertBaseControl(compRef!, testGroup, formGroup);
        expect(compRef!.componentType).toBe(TestControlGroupComponent);
        expect(compRef!.instance.viewOptionSelectors.someOption$).toEqual(testGroup.viewOptions.someOption$);
        expect(compRef!.instance.controls).toEqual(testGroup.controls);
    })

    it('should render control group with default component', () => {
        TestBed.overrideProvider(DYNAMIC_FORM_DEFAULT_OPTIONS, {
            useValue: <DynamicFormDefaultOptions> { groupViewComponent: TestControlGroupComponent }
        });
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const testGroup = _createControlGroup<any>()({ controls: { }, viewOptions: { } });
        let compRef = renderer.renderControl(testGroup, new FormGroup({}), vcRef);
        expect(compRef!.componentType).toBe(TestControlGroupComponent);
    })

    it('should throw error if no group component specified', () => {
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const testGroup = _createControlGroup<any>()({ controls: { }, viewOptions: { } });
        const action = () => renderer.renderControl(testGroup, new FormGroup({}), vcRef);
        expect(action).toThrowError();
    })

    it('should render control array with specified component & properties set & default class', () => {
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const testArr = _createControlArray({
            viewComponent:  TestControlArrayComponent,
            controlTemplate: _createControlField({ viewOptions: {} }),
            viewOptions: { someOption$: "something" },
            controlClass$: "test-class"
        });

        let formArray = new FormArray([]);
        let compRef = renderer.renderControl(testArr, formArray, vcRef);

        expect(vcRef.length).toBe(1);
        assertBaseControl(compRef!, testArr, formArray);
        expect(compRef!.componentType).toBe(TestControlArrayComponent);
        expect(compRef!.instance.viewOptionSelectors.someOption$).toEqual(testArr.viewOptions.someOption$);
        expect(compRef!.instance.controlTemplate).toEqual(testArr.controlTemplate);
    })

    it('should render control array with default component', () => {
        TestBed.overrideProvider(DYNAMIC_FORM_DEFAULT_OPTIONS, {
            useValue: <DynamicFormDefaultOptions> { arrayViewComponent: TestControlArrayComponent }
        });
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const testArr = _createControlArray({ viewOptions: { testOption$: "" }, controlTemplate: <any>{} });
        let compRef = renderer.renderControl(testArr, new FormArray([]), vcRef);
        expect(compRef!.componentType).toBe(TestControlArrayComponent);
    })

    it('should throw error if no array component specified', () => {
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const testArr = _createControlArray({ viewOptions: { testOption$: "" }, controlTemplate: <any>{} });
        const action = () => renderer.renderControl(testArr, new FormArray([]), vcRef);;
        expect(action).toThrowError();
    })

    it('shoud render group of controls', () => {
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const stringField = _createControlField({ viewComponent: TestFieldComponent, viewOptions: { width$: "" } });
        const testGroup = _createControlGroup<{ field: string, group: {field: string}, arr: string[] }>()({
            viewComponent:  TestControlGroupComponent, viewOptions: { someOption$: "something" },
            controls: {
                field: stringField,
                group: _createControlGroup<{field: string}>()({ 
                    viewComponent: TestControlGroupComponent, viewOptions: { someOption$: "" }, controls: { field: stringField}
                }),
                arr: _createControlArray({ viewComponent: TestControlArrayComponent, controlTemplate: stringField, viewOptions: { someOption$: "" }})
            },
        });

        let formGroup = new FormGroup({ field: new FormControl(), group: new FormGroup({}), arr: new FormArray([]) });

        renderer.renderControls(testGroup.controls, formGroup, vcRef);

        expect(vcRef.length).toBe(3);
    })

    it('shoud throw error if control is missing from group on render', () => {
        fixture = getFixture();
        let { renderer, vcRef } = fixture.componentInstance;
        const testGroup = _createControlGroup<{ field: string }>()({
            viewComponent:  TestControlGroupComponent, viewOptions: { someOption$: "something" },
            controls: { field: _createControlField({ viewComponent: TestFieldComponent, viewOptions: { width$: "" } }) },
        });

        let formGroup = new FormGroup({ });

        const action = () => renderer.renderControls(testGroup.controls, formGroup, vcRef);

        expect(action).toThrowError();
    })

    it('should update control class reactively with selector', (done) => {
        fixture = getFixture();
        let { renderer, vcRef, store } = fixture.componentInstance;
        
        let binding = new DynamicFormBuilder<any, {reactiveClass: string}>().bindState("reactiveClass")

        const testControl = _createControlField({
            viewComponent:  TestFieldComponent,
            viewOptions: { width$: "" },
            controlClass$: <any> binding
        });
        
        let compRef = renderer.renderControl(testControl, new FormControl(), vcRef);
        const compEl = <HTMLElement> compRef!.location.nativeElement; 

        const reactiveClass1 = "reactive-class-added-1";
        store.setState({ reactiveClass: reactiveClass1 })
        
        setTimeout(() =>  { 
            expect(compEl.classList.contains(reactiveClass1)).toBe(true);

            const reactiveClass2 = "reactive-class-added-2";
            store.setState({ reactiveClass: reactiveClass2 })
            setTimeout(() =>  { 
                expect(compEl.classList.contains(reactiveClass2)).toBe(true);
                expect(compEl.classList.contains(reactiveClass1)).toBe(false); //Check that prev class is removed
                done();
            })
        })
    })
});