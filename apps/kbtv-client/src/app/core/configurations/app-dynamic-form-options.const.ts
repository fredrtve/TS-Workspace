import { DynamicFormDefaultOptions } from "dynamic-forms";
import { DynamicControlGroupComponent } from "mat-dynamic-form-controls";

export const AppDynamicFormOptions : DynamicFormDefaultOptions = {
    groupViewComponent: DynamicControlGroupComponent,
    fieldClass: "app-dynamic-control",
    controlAttributes: [
        { attribute: "data-cy", value: (name) => "form-"+name }
    ]
}