import { DynamicFormBuilder } from "dynamic-forms";
import { InputFieldComponent, RadioGroupFieldComponent } from "mat-dynamic-form-controls";

export interface GenderSelect { selected: string, other: string  };

const builder = new DynamicFormBuilder<GenderSelect, {state1: string}>();

export const GenderGroup = builder.group()({
    viewComponent: null,
    viewOptions: {},
    controls:{
        selected: builder.field<RadioGroupFieldComponent<string>>({ 
            viewComponent: RadioGroupFieldComponent, 
            viewOptions: { options$: [ "Male", "Female", "Other" ], label$: "Gender" }
        }),
        other: builder.field({ 
            viewComponent: InputFieldComponent, 
            viewOptions: { placeholder$: "Specify gender" } 
        }),
    },
    overrides: {
        other: { 
            controlClass$: builder.bindForm("selected", (gender) => gender === "Other" ? '' : 'hide-control')
        }
    }
})