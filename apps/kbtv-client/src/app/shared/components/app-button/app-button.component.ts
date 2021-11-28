import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ButtonTypes } from '@shared-app/enums/button-types.enum';
import { _tryWithLogging } from "@fretve/global-utils";
import { AppButton } from '@shared-app/interfaces/app-button.interface';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonComponent {
  ButtonTypes = ButtonTypes;

  @Input() config: AppButton;
  @Output() fnHandled = new EventEmitter();
  
  constructor() { }

  get buttonClass(): string{
    switch(this.config.type){
      case ButtonTypes.Flat: return "mat-flat-button";
      case ButtonTypes.Icon: return "mat-icon-button";
      case ButtonTypes.Stroked: return "mat-stroked-button";
      case ButtonTypes.Fab: return "mat-fab";
      case ButtonTypes.MiniFab: return "mat-mini-fab";
      default: return "";
    }
  }

  handleFn = (fn: Function, parameters: unknown[] = []) => {
    if(!parameters?.length) parameters = this.config.params || [];
    
    if(parameters) this.fnHandled.emit(_tryWithLogging(() => fn(...parameters)));
    else this.fnHandled.emit(_tryWithLogging(fn()));
  };

}
