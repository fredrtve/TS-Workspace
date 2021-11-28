import { ValidationErrors } from '@angular/forms';
import { Maybe } from '@fretve/global-types';
import { ValidationErrorMap } from './interfaces';

 /** Responsible for getting the validation error message based on errors on the control */
export function _getValidationErrorMessage(errors: Maybe<Maybe<ValidationErrors>>, messages?: ValidationErrorMap): Maybe<string> {
    if(!errors || !messages) return;
    for(const error of Object.keys(errors)){
      const errFn = messages[error];
      let msg = errFn ? errFn(errors[error]) : undefined;
      if(msg) return msg;
    }
    return;
}