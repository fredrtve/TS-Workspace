import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FormStateResolver } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { Observable } from 'rxjs';
import { BaseFieldComponent } from '../base-control/base-field.component';
import { BaseFieldOptions } from '../base-control/base-field-options.interface';
import { FuncModule } from '../directives/func.pipe';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface RadioGroupOptions<T> extends BaseFieldOptions {
    defaultOption$?: string;
    valueFormatter$?: (val: T) => unknown;
    valueSetter$?: (val: T) => unknown;
    divider$?: boolean;
    options$: Immutable<T[]>;
}

@Component({
  template: `
    <style> mat-radio-group > * { margin-right: 8px } </style>
    <div class="pb-2" *ngIf="options$ | async; let options">
        <div class="mat-body-2" *ngIf="options.label$">{{ options.label$ }}</div>
        <mat-radio-group [formControl]="formControl" [color]="options.color$ || 'accent'">
            <mat-radio-button *ngIf="options.defaultOption$"
              [checked]="formControl?.value == null">
            {{ options.defaultOption$ }}
            </mat-radio-button>
            <mat-radio-button *ngFor="let option of options.options$" 
                [value]="(options.valueSetter$ | func : option) || option">
                {{ (options.valueFormatter$ | func : option) || option }}
            </mat-radio-button>
        </mat-radio-group>
        <mat-hint *ngIf="options.hint$">{{ options.hint$ }}</mat-hint>
        <mat-error *ngIf="formControl && formControl.dirty && formControl.invalid">
          {{ getValidationErrorMessage() }}
        </mat-error>
        <mat-divider *ngIf="options.divider$" style="margin-top:8px!important"></mat-divider>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioGroupFieldComponent<T> extends BaseFieldComponent<T, RadioGroupOptions<T>> {
  
  options$: Observable<RadioGroupOptions<T>>;

  constructor(
    resolver: FormStateResolver,
    @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
  ) { 
      super(resolver, validationErrorMessages);
  }

  onControlInit(){
    this.options$ = this.resolveOptions$();
  }

}
@NgModule({
  declarations: [RadioGroupFieldComponent],
  imports:[
    CommonModule,   
    ReactiveFormsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatRadioModule,
    FuncModule
  ]
})
class RadioGroupControlModule {}