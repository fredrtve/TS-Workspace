import { Pipe, PipeTransform } from '@angular/core';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { Maybe } from '@fretve/global-types';

@Pipe({name: 'transformButton'})
export class TransformButtonPipe implements PipeTransform {

  transform(button: AppButton, newValues: Partial<AppButton>): Maybe<AppButton> {
    return button ? {...button, ...newValues} : null;
  }

}
