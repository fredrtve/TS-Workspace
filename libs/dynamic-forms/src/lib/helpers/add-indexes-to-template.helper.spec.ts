import { DynamicFormBuilder } from "../builder/dynamic-form.builder";
import { _createControlGroup } from "../builder/type.helpers";
import { _addIndexesToTemplate } from "./add-indexes-to-template.helper";

const builder = new DynamicFormBuilder<{ test: { nested1?: string, arr2?: { nested2: string }[] } },any>();
const grpBuilder = new DynamicFormBuilder<{ nested1: string },any>();
describe("Add indexes to template", () => {

    it('Should add indexes to selectors', () => {
        const template = builder.group<{ nested1: string}>()({ 
            viewOptions: { testOption$: { stateSlice: [], formSlice: ["nested1"], setter: () => "", baseFormPath: "test.{index}" } }, 
            controls: {
                nested1: builder.field({ 
                    viewOptions: {}, 
                    disabled$: { stateSlice: [], formSlice: ["nested1"], setter: () => true, baseFormPath: "test.{index}" } 
                })
            },
        });
        const withIndexes = _addIndexesToTemplate(template, 1);
        expect(((<any> withIndexes.viewOptions).testOption$).baseFormPath).toEqual("test.1")
        expect((<any> withIndexes.controls.nested1.disabled$).baseFormPath).toEqual("test.1")
    })

    it('Should not add indexes to second index parameter', () => {
        const template = builder.group<{ arr2?: { nested2: string }[] }>()({ 
            viewOptions: { }, controls: {
                arr2: builder.array({ viewOptions: {},
                    controlTemplate: builder.group<{nested2: string}>()({ viewOptions: {},
                        controls: {
                            nested2: builder.field({  viewOptions: {},
                                disabled$: { stateSlice: [], formSlice: ["nested2"], setter: () => true, baseFormPath: "test.{index}.arr2.{index}" }
                            })
                        }
                    }),
                })
            },
        });
        const withIndexes = _addIndexesToTemplate(template, 1);
        const selector = <any> withIndexes.controls.arr2.controlTemplate.controls.nested2.disabled$;
        expect(selector.baseFormPath).toEqual("test.1.arr2.{index}");
    })
});