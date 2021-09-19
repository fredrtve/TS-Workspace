import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '@shared/shared.module';
import { BaseQuestionComponent, DynamicFormStore, Question, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'dynamic-forms';
import { Immutable } from 'global-types';

export interface RadioGroupQuestionBindings<T> { options: Immutable<T[]> }

export interface RadioGroupQuestion<T, TFormState extends object | null> extends Question<RadioGroupQuestionBindings<T>, TFormState> {
    defaultOption?: string;
    valueFormatter?: (val: T) => unknown;
    valueSetter?: (val: T) => unknown;
    divider?: boolean;
}

@Component({
  selector: 'app-radio-group-question',
  template: `
    <style> mat-radio-group > * { margin-right: 8px } </style>
    <div class="pb-2">
        <div class="mat-body-2" *ngIf="question.label">{{ question.label }}</div>
        <mat-radio-group [formControl]="control" [color]="question.color || 'accent'">
            <mat-radio-button *ngIf="question.defaultOption"
              [checked]="control?.value == null">
            {{ question.defaultOption }}
            </mat-radio-button>
            <mat-radio-button *ngFor="let option of stateBindings.options | async" 
                [value]="(question.valueSetter | func : option) || option">
                {{ (question.valueFormatter | func : option) || option }}
            </mat-radio-button>
        </mat-radio-group>
        <mat-hint *ngIf="question.hint">{{ question.hint }}</mat-hint>
        <mat-error *ngIf="control && control.dirty && control.invalid">
          {{ getValidationErrorMessage() }}
        </mat-error>
        <mat-divider *ngIf="question.divider" style="margin-top:8px!important"></mat-divider>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioGroupQuestionComponent<T> extends BaseQuestionComponent<RadioGroupQuestionBindings<T>, RadioGroupQuestion<T, object | null>> {

  constructor(
    formStore: DynamicFormStore,
    @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
  ) { 
      super(formStore, validationErrorMessages) 
  }

}

@NgModule({
  declarations: [RadioGroupQuestionComponent],
  imports:[
    SharedModule,
    MatFormFieldModule,
    MatRadioModule,
  ]
})
class RadioGroupQuestionModule {}