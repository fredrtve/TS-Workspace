import { ValidatorFn, AbstractControl } from '@angular/forms';
import { UnknownState } from '@fretve/global-types';
import { _validateFileExtension } from '@shared-app/helpers/validate-file-extension.helper';

export function fileExtensionValidator(allowedExtensions: string[]): ValidatorFn{ 
    return (control: AbstractControl): UnknownState | null => {
        if(control.value == null) return null;
        let valid;
        for(let i = 0; i < control.value.length; i++){
            valid = _validateFileExtension(control.value[i], allowedExtensions);
            if(valid === false) break;
        }
        return valid ? null : {'fileextension': {value: control.value}};
    };
}

