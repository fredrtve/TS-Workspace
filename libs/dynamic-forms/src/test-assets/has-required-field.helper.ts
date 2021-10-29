import { AbstractControl, FormGroup } from "@angular/forms";

export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
    if (abstractControl.validator) {
        const validator = abstractControl.validator({}as AbstractControl);
        if (validator && validator.required) return true;       
    }
    if((<FormGroup> abstractControl)['controls']) {
        for (const controlName in (<FormGroup> abstractControl)['controls']) {
            if ((<FormGroup> abstractControl)['controls'][controlName]) {
                if (hasRequiredField((<FormGroup> abstractControl)['controls'][controlName])) {
                    return true;
                }
            }
        }
    }
    return false;
};