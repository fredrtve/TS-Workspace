import { ValidatorFn, AbstractControl } from '@angular/forms';
import { _isNullOrEmpty } from '@shared-app/helpers/is-null-or-empty.helper';
import { UnknownState } from 'global-types';

export function isObjectValidator(name?: string): ValidatorFn{ 
    return (control: AbstractControl): UnknownState | null => {
      const type = typeof control.value;
      const valid = !control.value || (type === "string" && _isNullOrEmpty(control.value)) || typeof control.value === "object";
      return !valid ? {'isobject': {value: control.value, name}} : null;
    };
  }