import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Prop } from 'global-types';

export function isSamePasswordsValidator<TForm>(controlName1: Prop<TForm>, controlName2: Prop<TForm>): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => { 
        const control1 = group.get(controlName1);
        const control2 = group.get(controlName2);
        if(control1?.dirty && control2?.dirty && (control1.value !== control2.value)){
            control2?.setErrors({'issamepasswords': false});   
        }
        return null;
    }     
    
}