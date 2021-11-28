import { Component, Directive } from "@angular/core";
import { FormArray } from "@angular/forms";
import { Immutable } from "@fretve/global-types";
import { AbstractDynamicControl, AllowFormStateSelectors, ControlArrayComponent } from "../lib/interfaces";

export interface TestControlArrayOptions { someOption$: string } ;

export const TestControlArrayComponentSelector = "test-array-component";

@Component({
  template: ``,
  selector: TestControlArrayComponentSelector
})
export class TestControlArrayComponent implements ControlArrayComponent<any[], TestControlArrayOptions> {

  formControl: FormArray;

  viewOptionSelectors: Immutable<AllowFormStateSelectors<TestControlArrayOptions, any, any>>;

  controlTemplate: Immutable<AbstractDynamicControl<any, any, any, any, any>>

  ɵviewOptions?: TestControlArrayOptions;

  constructor() {}
}