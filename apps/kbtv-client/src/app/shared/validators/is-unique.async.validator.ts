import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Immutable, ImmutableArray, Maybe, UnknownState } from 'global-types';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

export function isUniqueAsyncValidator<T>(
    data$: Observable<Maybe<ImmutableArray<T>>>, compareFn?: (x: Immutable<T>, y: string) => boolean): AsyncValidatorFn{ 
    return (control: AbstractControl): Observable<UnknownState | null> => {
        return data$.pipe(first(), map(data => {
            if(!data) return null;

            const invalid = {'isunique': {value: control.value}};
            
            for(let i = 0; i < data.length; i++){
                const obj = data[i];
                if(compareFn){ 
                    if(compareFn(obj, control.value)) return invalid; 
                }
                else if (obj === control.value) return invalid;
            }
            
            return null;
        }))
    };
}