import { DynamicFormBuilder } from "dynamic-forms";
import { DynamicControlGroupComponent, InputFieldComponent } from "mat-dynamic-form-controls";

export interface NameGroup {
    first: string,
    last: string,
}

const builder = new DynamicFormBuilder<NameGroup>();

export const NameGroup = builder.group()({
    viewOptions: {},
    viewComponent: DynamicControlGroupComponent,
    controlClass$: "name-control-group",
    controls: {
        first: builder.field({ 
            viewComponent: InputFieldComponent, 
            viewOptions: { placeholder$: "First Name" }, 
            required$: true
        }),
        last: builder.field({ 
            viewComponent: InputFieldComponent, 
            viewOptions: { placeholder$: "Last Name" }, 
            required$: true
        }),
    },
})