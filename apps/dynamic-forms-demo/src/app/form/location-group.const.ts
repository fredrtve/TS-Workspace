import { AbstractDynamicControl, ControlFieldOverridables, DynamicFormBuilder } from "dynamic-forms";
import { DynamicControlGroupComponent, SelectFieldComponent, InputFieldComponent } from "mat-dynamic-form-controls";

export interface Location {
    country: string,
    region: string
}

const locationBuilder = new DynamicFormBuilder<Location, {countries: string[]}>();

export const LocationGroup = locationBuilder.group()({
    viewComponent: DynamicControlGroupComponent,
    viewOptions: {},
    controlClass$: 'location-control-group',
    controls: {
        country: locationBuilder.field<SelectFieldComponent<string>>({ 
            viewComponent: SelectFieldComponent, 
            viewOptions: { options$: [], placeholder$: "Country" }, 
            required$: true
        }),
        region: locationBuilder.field({ 
            viewComponent: InputFieldComponent, 
            viewOptions: { placeholder$: "Region" }
        }),
    },
    overrides: {
        country: { viewOptions: { options$: locationBuilder.bindState("countries") } }
    }
});