import { AbstractControl, FormGroup } from "@angular/forms";
import { DeepPropsObject, Immutable, UnknownState } from "global-types";
import { combineLatest, Observable, of } from "rxjs";
import { map, startWith, switchMap } from "rxjs/operators";

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
        const props = path.split('.');
        controlListeners.push(of(null).pipe(switchMap(x => {
            const control = deepSelectControl(form, props);
            if(control === null) throw new Error(`No control found for path ${path} on form ${form}`);
            return control.valueChanges.pipe(startWith(control.value))
        })))
    }
    return combineLatest(controlListeners).pipe(map(x => {
        const mappedValues: UnknownState = {};
        for(let i = 0; i < paths.length; i++){
            const path = <string> paths[i];
            mappedValues[basePath ? path.substring(basePath.length + 1, path.length) : path] = x[i]   
        }
        return <DeepPropsObject<TForm, TFormSlice>> mappedValues;
    }))
  }
  
function deepSelectControl(
    form: AbstractControl, 
    props: Immutable<string[]>, 
    max: number = props.length - 1, 
    index: number = 0 ): AbstractControl | null {
    const t = form.get(props[index])
    if(t === null) return null;  
    if(index === max) return t;
    return deepSelectControl(t, props, max, ++index)
}