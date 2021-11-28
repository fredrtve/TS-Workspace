import { ValidatorFn, AbstractControl } from '@angular/forms';
import { UnknownState } from '@fretve/global-types';

export function fileSizeValidator(maxSize: number): ValidatorFn{ 
    return (control: AbstractControl): UnknownState | null => {
        if(control.value == null) return null;
        const invalid = (<File>control.value).size > maxSize;
        return invalid ? {'filesize': {value: control.value, maxSize}} : null;
    };
}

