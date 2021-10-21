
import { InputControlComponent } from "../../test-controls";
import { DynamicFormBuilder } from "../dynamic-form.builder";
import { GenericFormStateSelector } from "../interfaces";
import { _isFormStateSelector } from "./type.helpers";
import { _mergeOverridesWithControls } from "./merge-group-options.helper";

interface TestForm { phone1: string, address1: string, group1: TestFormGroup}
interface TestFormGroup { phone2: string, address2: string, group2: TestFormGroup2 }
interface TestFormGroup2 { phone3: string, address3: string }
interface TestState { state1: string, state2: { name: string, num: number} }
const grp1Builder = new DynamicFormBuilder<TestFormGroup, TestState>();
const grp2Builder = new DynamicFormBuilder<TestFormGroup2, TestState>();
const builder = new DynamicFormBuilder<TestForm, TestState>();
const phone3WidthFinalBinding = builder.bind(['group1.phone2'], ["state1"], (f,s) => "");
const address3WidthBinding = grp1Builder.bind(['group2.phone3'], [], (f,s) => "");
const testForm = builder.form({
    controls: {
        phone1: builder.control({ controlComponent: InputControlComponent, viewOptions: { width$: "" } }),
        address1: builder.control({ controlComponent: InputControlComponent, viewOptions: { width$: "" } }),
        group1: builder.group<TestFormGroup>()({
            controls:{
                phone2: builder.control({ controlComponent: InputControlComponent, viewOptions: { width$: "" } }),
                address2: builder.control({ controlComponent: InputControlComponent, viewOptions: { width$: "" } }),
                group2: builder.group<TestFormGroup2>()({
                    controls:{
                        phone3: builder.control({ controlComponent: InputControlComponent, viewOptions: { width$: "" } }),
                        address3: builder.control({ controlComponent: InputControlComponent, viewOptions: { width$: "" } }),
                    },
                    viewOptions: {},
                    overrides: {
                        phone3: { viewOptions: { width$: grp2Builder.bind(['address3'], [], (f,s) => "") }},
                    }
                })
            },
            viewOptions: {},
            overrides: {
                group2: {
                    viewOptions: { },
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
                    viewOptions: { test: "isFinal" },
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

        const slice = selector.formSlice[0];
        expect(slice).toBe("group1." + address3WidthBinding.formSlice[0]);

        expect((<any> group2.viewOptions).test).toBe("isFinal");

        const group1 = merged.group1.controls;
        expect(group1.address2.viewOptions.width$).toBe("");
        expect(group1.phone2.viewOptions.width$).toBe("");

        expect(merged.address1.viewOptions.width$).toBe("");
        expect(merged.phone1.viewOptions.width$).toBe("isFinal");
    })
})