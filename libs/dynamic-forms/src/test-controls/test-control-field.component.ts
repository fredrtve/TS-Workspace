import { Component } from "@angular/core";
import { Immutable } from "global-types";
import { Observable } from "rxjs";
import { AllowFormStateSelectors, ControlFieldComponent, FormStateSelector, GenericAbstractControl } from "../lib/interfaces";

export interface TestFieldQuestion  {
     type$?: "tel" | "text" | "number" | "email" | "file" | "password";
     width$: string;
}

type ElseString<T> = unknown extends T ? string : T;

@Component({
    template: ``,
    selector: "test-field-component"
})
export class TestFieldComponent<T> implements ControlFieldComponent<ElseString<T>, TestFieldQuestion> {
   
     formControl: GenericAbstractControl<ElseString<T>>;
 
     viewOptionSelectors: Immutable<AllowFormStateSelectors<TestFieldQuestion, any, any>>;
   
     requiredSelector?: Immutable<boolean | FormStateSelector<any, any, boolean | undefined, string, any>>;
   
     ɵviewOptions?: TestFieldQuestion;
     
     constructor() {  }

     resolveOptions$(): Observable<Immutable<TestFieldQuestion>> {
       return<any> {}
     }
 }