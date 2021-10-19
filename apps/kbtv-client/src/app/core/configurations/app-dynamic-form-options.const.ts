import { DynamicFormDefaultOptions } from "dynamic-forms";
import { DynamicControlGroupComponent } from "mat-dynamic-form-controls";

export const AppDynamicFormOptions : DynamicFormDefaultOptions = {
    groupComponent: DynamicControlGroupComponent,
    controlClass: "app-dynamic-control",
}