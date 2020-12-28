import { ValidationErrors } from '@angular/forms';
import { Maybe } from 'global-types';
import { ValidationErrorMap } from '../validation-error-map.interface';

export function _getValidationErrorMessage(errors: Maybe<Maybe<ValidationErrors>>, messages: ValidationErrorMap): Maybe<string> {
    if(!errors) return;
    for(const error of Object.keys(errors)){
      const errFn = messages[error];
      let msg = errFn ? errFn(errors[error]) : undefined;
      if(msg) return msg;
    }
    return;
}