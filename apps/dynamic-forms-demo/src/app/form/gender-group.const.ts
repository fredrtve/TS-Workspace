import { DynamicFormBuilder } from "dynamic-forms";
import { RadioGroupFieldComponent, InputFieldComponent } from "mat-dynamic-form-controls";

export interface GenderSelect { selected: string, other: string  };

const genderBuilder = new DynamicFormBuilder<GenderSelect>();

export const GenderGroup = genderBuilder.group()({
    viewComponent: null,
    viewOptions: {},
    controls:{
        selected: genderBuilder.field<RadioGroupFieldComponent<string>>({ 
            viewComponent: RadioGroupFieldComponent, 
            viewOptions: { options$: [ "Male", "Female", "Other" ], label$: "Gender" }
        }),
        other: genderBuilder.field({ 
            viewComponent: InputFieldComponent, 
            viewOptions: { placeholder$: "Specify gender" } 
        }),
    },
    overrides: {
        other: { 
            controlClass$: genderBuilder.bindForm("selected", (gender) => gender === "Other" ? '' : 'hide-control')
        }
    }
})