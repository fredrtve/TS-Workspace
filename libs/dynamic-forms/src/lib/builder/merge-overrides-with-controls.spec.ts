
import { TestFieldComponent } from "../../test-assets/test-control-field.component";
import { DynamicFormBuilder } from "../builder/dynamic-form.builder";
import { _isFormStateSelector } from "../helpers/type.helpers";
import { FormStateSelector, GenericFormStateSelector } from "../interfaces";
import { _mergeOverridesWithControls } from "./merge-overrides-with-controls.helper";

interface TestForm { phone1: string, address1: string, group1: TestFormGroup, arr1: TestFormGroup2[] }
interface TestFormGroup { phone2: string, address2: string, group2: TestFormGroup2}
interface TestFormGroup2 { phone3: string, address3: string }
interface TestState { state1: string, state2: { name: string, num: number} }
const grp1Builder = new DynamicFormBuilder<TestFormGroup, TestState>();
const grp2Builder = new DynamicFormBuilder<TestFormGroup2, TestState>();
const builder = new DynamicFormBuilder<TestForm, TestState>();
const phone3WidthFinalBinding = builder.bind(['group1.phone2'], ["state1"], (f,s) => "");
const address3WidthBinding = grp1Builder.bind(['group2.phone3'], [], (f,s) => "");
const arrBoolBinding = grp2Builder.bind(['phone3'], [], (f,s) => true);

const group2 = builder.group<TestFormGroup2>()({
    controls:{
        phone3: builder.field({ viewComponent: TestFieldComponent, viewOptions: { width$: "" } }),
        address3: builder.field({ viewComponent: TestFieldComponent, viewOptions: { width$: "" } }),
    },
    viewOptions: {},
    overrides: {
        phone3: { viewOptions: { width$: grp2Builder.bind(['address3'], [], (f,s) => "") }},
    }
});
const testForm = builder.form({
    controls: {
        phone1: builder.field({ viewComponent: TestFieldComponent, viewOptions: { width$: "" } }),
        address1: builder.field({ viewComponent: TestFieldComponent, viewOptions: { width$: "" } }),
        arr1: builder.array({ controlTemplate: group2, viewOptions: { }, templateOverrides: { disabled$: arrBoolBinding }}),
        group1: builder.group<TestFormGroup>()({
            controls:{
                phone2: builder.field({ viewComponent: TestFieldComponent, viewOptions: { width$: "" } }),
                address2: builder.field({ viewComponent: TestFieldComponent, viewOptions: { width$: "" } }),
                group2: group2,
            },
            viewOptions: {},
            overrides: {
                group2: {
                    viewOptions: {},
                    overrides:{
                         phone3: { viewOptions: { width$: grp1Builder.bind(['address2'], [], (f,s) => "") }},
                         address3: { viewOptions: { width$: address3WidthBinding }}
                    }
                }
            }
        })
    }, 
    overrides: {
        phone1: { viewOptions: { width$: "isFinal"}},
        group1: {
            overrides:{
                group2: {
                    viewOptions: { testOption$: "isFinal" },
                    overrides:{
                         phone3: { viewOptions: { width$: phone3WidthFinalBinding }}
                    }
                }
            }
        }
    }
})


describe("Merge group options", () => {

    it('Can merge nested values', () => {
        const merged = _mergeOverridesWithControls(testForm.controls, testForm.overrides);
        const group2 = merged.group1.controls.group2;
        expect(group2.controls.phone3.viewOptions.width$).toBe(<any> phone3WidthFinalBinding);
        expect(_isFormStateSelector(group2.controls.address3.viewOptions.width$)).toBe(true);

        const selector = <GenericFormStateSelector><any> group2.controls.address3.viewOptions.width$
        expect(selector.stateSlice.length).toBe(address3WidthBinding.stateSlice.length);
        expect(selector.formSlice.length).toBe(address3WidthBinding.formSlice.length);
        expect(selector.baseFormPath).toBe("group1");

        expect((<any> group2.viewOptions).testOption$).toBe("isFinal");

        const group1 = merged.group1.controls;
        expect(group1.address2.viewOptions.width$).toBe("");
        expect(group1.phone2.viewOptions.width$).toBe("");

        expect(merged.address1.viewOptions.width$).toBe("");
        expect(merged.phone1.viewOptions.width$).toBe("isFinal");

        const arrDisabled = <FormStateSelector<any,any,any,any,any>> merged.arr1.controlTemplate.disabled$;
        expect(arrDisabled.baseFormPath).toEqual("arr1.{index}")
    })
})