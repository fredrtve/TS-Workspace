import { Directive } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Immutable } from "global-types";
import { AllowFormStateSelectors, ControlGroupComponent, DynamicControlMap } from "../lib/interfaces";

export interface TestControlGroupOptions { someOption$: string } ;
@Directive()
export class TestControlGroupComponent implements ControlGroupComponent<any, TestControlGroupOptions> {

  formControl: FormGroup;

  viewOptionSelectors: Immutable<AllowFormStateSelectors<TestControlGroupOptions, any, any>>;

  controls: Immutable<DynamicControlMap<any,any>>

  constructor() {}
}