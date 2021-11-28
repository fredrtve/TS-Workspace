import { Component } from "@angular/core";
import { Immutable } from "@fretve/global-types";
import { Observable } from "rxjs";
import { AllowedFormStateSelector, AllowFormStateSelectors, ControlFieldComponent, FormStateSelector, GenericAbstractControl, ReactiveSelector } from "../lib/interfaces";

export interface TestFieldQuestion  {
     type$?: "tel" | "text" | "number" | "email" | "file" | "password";
     width$: string;
}

type ElseString<T> = unknown extends T ? string : T;

export const TestControlFieldComponentSelector = "test-field-component";

@Component({
    template: ``,
    selector: TestControlFieldComponentSelector
})
export class TestFieldComponent<T> implements ControlFieldComponent<ElseString<T>, TestFieldQuestion> {
   
     formControl: GenericAbstractControl<ElseString<T>>;
 
     viewOptionSelectors: Immutable<AllowFormStateSelectors<TestFieldQuestion, any, any>>;
   
     requiredSelector?: Immutable<AllowedFormStateSelector<boolean | undefined, any, any>>;
   
     ɵviewOptions?: TestFieldQuestion;
     
     constructor() {  }

     resolveOptions$(): Observable<Immutable<TestFieldQuestion>> {
       return<any> {}
     }
 }