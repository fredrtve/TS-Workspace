import { Component, Directive } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Immutable } from "@fretve/global-types";
import { AllowFormStateSelectors, ControlGroupComponent, DynamicControlMap } from "../lib/interfaces";

export interface TestControlGroupOptions { someOption$: string } ;

export const TestControlGroupComponentSelector = "test-group-component";

@Component({
  template: ``,
  selector: TestControlGroupComponentSelector
})
export class TestControlGroupComponent implements ControlGroupComponent<any, TestControlGroupOptions> {

  formControl: FormGroup;

  viewOptionSelectors: Immutable<AllowFormStateSelectors<TestControlGroupOptions, any, any>>;

  controls: Immutable<DynamicControlMap<any,any>>

  ɵviewOptions?: TestControlGroupOptions;

  constructor() {}
}