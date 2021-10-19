import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Maybe } from 'global-types';
import { FormSheetWrapperComponent } from '../form-sheet-wrapper.component';
import { FormSheetNavConfig } from '../interfaces';

@Component({
  selector: 'lib-form-sheet-nav-bar',
  templateUrl: './form-sheet-nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSheetNavBarComponent {

  @Input() config: Maybe<FormSheetNavConfig>;
  @Output() close = new EventEmitter<unknown>()

  constructor(private _bottomSheetRef: MatBottomSheetRef<FormSheetWrapperComponent, unknown>) {}

  handleCallback = (callback: (ref: MatBottomSheetRef<FormSheetWrapperComponent, unknown>) => void) => {
    try{
        callback(this._bottomSheetRef)
    }catch(err){
        console.error(err)
    };
  }

}
