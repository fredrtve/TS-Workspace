import { ValidatorFn, AbstractControl } from '@angular/forms';
import { UnknownState } from '@fretve/global-types';

export function dateRangeValidator(allowNull?: boolean): ValidatorFn{ 
    return (control: AbstractControl): UnknownState | null => {
      let invalid: boolean;
      
      if(allowNull && control.value == null) invalid = false;
      else invalid = control.value == null || !control.value[0] || !control.value[1];

      return invalid ? {'daterange': {value: control.value}} : null;
    };
  }

