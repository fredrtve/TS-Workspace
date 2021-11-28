import { DynamicFormDefaultOptions } from "@fretve/dynamic-forms";
import { DynamicControlGroupComponent } from "@fretve/mat-dynamic-form-controls";

export const AppDynamicFormOptions : DynamicFormDefaultOptions = {
    groupViewComponent: DynamicControlGroupComponent,
    fieldClass: "app-dynamic-control",
    controlAttributes: [
        { attribute: "data-cy", value: (name) => "form-"+name }
    ]
}