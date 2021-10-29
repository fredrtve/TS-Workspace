import { FormGroup } from "@angular/forms";
import { DeepPropsObject, Immutable, UnknownState } from "global-types";
import { asapScheduler, combineLatest, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map, startWith } from "rxjs/operators";

 /** An rxjs operator used to listen to value changes on form controls from a form group
  * @param form - The form group containing the controls
 * @param paths - The paths to the controls that should be selected. Supports nested controls with syntax "group1.control2"
 * @returns The slice of state with paths as keys with corresponding values
 */
  export function _formControlsChanges$<TForm, TFormSlice extends string>(
      form: FormGroup, 
      paths: Immutable<TFormSlice[]>,
      basePath?: string): Observable<DeepPropsObject<TForm, TFormSlice>> {
    const controlListeners: Observable<unknown>[] = [];
    for(const path of paths){
        const fullPath = basePath ? basePath + '.' + path : path;
        const control = form.get(fullPath);
        if(control === null) throw new Error(`No control found for path ${fullPath} on form ${form}`);
        controlListeners.push(control.valueChanges.pipe(startWith(control.value), distinctUntilChanged()));
    }
    return combineLatest(controlListeners).pipe(debounceTime(0, asapScheduler), map(x => {
        const mappedValues: UnknownState = {};
        for(let i = 0; i < paths.length; i++){
            mappedValues[paths[i]] = x[i]   
        }
        return <DeepPropsObject<TForm, TFormSlice>> mappedValues;
    }))
}
  