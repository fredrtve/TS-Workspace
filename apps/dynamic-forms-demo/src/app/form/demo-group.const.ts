import { DynamicFormBuilder } from "dynamic-forms";
import { DynamicControlArrayComponent, InputFieldComponent } from "mat-dynamic-form-controls";
import { GenderGroup, GenderSelect } from "./gender-group.const";
import { Location, LocationGroup } from "./location-group.const";
import { NameGroup } from "./name-group.const";

interface DemoForm {
    name: NameGroup,
    occupation: string,
    location: Location,
    gender: GenderSelect,
    otherGender?: string,
    hobbies: string[],
}

export interface DemoFormState { countries: string[] }

const builder = new DynamicFormBuilder<DemoForm, DemoFormState>();

export const DemoGroup = builder.group()({
    viewOptions: {},
    viewComponent: null,
    controls: {
        name: NameGroup,
        occupation: builder.field({ 
            viewComponent: InputFieldComponent, 
            viewOptions: { placeholder$: "Occupation" } 
        }),
        location: LocationGroup,
        gender: GenderGroup,
        hobbies: builder.array({ 
            viewComponent: DynamicControlArrayComponent,
            controlTemplate: builder.field({ viewComponent: InputFieldComponent,viewOptions: { placeholder$: "Hobby" } }), 
            viewOptions: { label$: "Add hobbies" }
        }),
    },
})