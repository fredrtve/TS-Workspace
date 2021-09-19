import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared/shared.module';
import { BaseQuestionComponent, DynamicFormStore, Question, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'dynamic-forms';

export interface CheckboxQuestion extends Question {
  text: string;
}

@Component({
  selector: 'app-checkbox-question',
  template: `  
    <div class="mat-body-2" *ngIf="question.label">{{ question.label }}</div>

    <mat-checkbox style="margin-bottom:16px"
        [color]="question.color || 'accent'" 
        [formControl]="control" 
        [required]="required" >
        {{ question.text }}
    </mat-checkbox>

    <mat-hint *ngIf="question.hint">{{ question.hint }}</mat-hint>

    <mat-error *ngIf="control && control.dirty && control.invalid">
      {{ getValidationErrorMessage() }}
    </mat-error>
  `,
  styles: [` :host { overflow: hidden } `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxQuestionComponent extends BaseQuestionComponent<null, CheckboxQuestion> {

  constructor(
    formStore: DynamicFormStore,
    @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
  ) { 
    super(formStore, validationErrorMessages) 
  }

}

@NgModule({
  declarations: [CheckboxQuestionComponent],
  imports:[
    SharedModule,
    MatFormFieldModule,
    MatCheckboxModule,
  ]
})
class CheckboxQuestionModule {}