import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { BaseQuestionComponent, DynamicFormStore, Question, QuestionComponent, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'dynamic-forms';
import { Maybe } from 'global-types';

export interface InputQuestion extends Question {
  type?: "tel" | "text" | "number" | "email" | "file" | "password";
  hideable?: boolean;
  defaultHidden?: boolean;
  resetable?: boolean;
  autoComplete?: "on" | "off" | "new-password"
}

@Component({
  selector: 'app-input-question',
  template: `
    <mat-form-field [color]="question.color || 'accent'" class="w-100">
      <mat-label *ngIf="question.label">{{ question.label }}</mat-label>

      <input matInput [attr.autocomplete]="question.autoComplete"
        [type]="hideField ? 'password' : (question.type === 'password' ? 'text' : question.type)" 
        [placeholder]="question.placeholder" 
        [formControl]="control" 
        [required]="required" />

      <mat-icon *ngIf="question.hideable" [color]="question.color || 'accent'" matSuffix 
        (tap)="hideField = !hideField">
        {{hideField ? 'visibility_off' : 'visibility'}}
      </mat-icon>

      <mat-hint *ngIf="question.hint">{{ question.hint }}</mat-hint>

      <button mat-icon-button matSuffix *ngIf="question.resetable && !control?.disabled && control?.value" aria-label="Clear" 
        (tap)="control?.setValue(''); control?.markAsDirty()">
        <mat-icon>close</mat-icon>
      </button>

      <mat-error *ngIf="control?.dirty && control?.invalid">
        {{ getValidationErrorMessage() }}
      </mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputQuestionComponent extends BaseQuestionComponent<null, InputQuestion> implements QuestionComponent<null, null, InputQuestion> {

  hideField: Maybe<boolean>;

  constructor(
    @Inject(VALIDATION_ERROR_MESSAGES) validationErrorMessages: ValidationErrorMap,
    formStore: DynamicFormStore) { 
    super(validationErrorMessages, formStore) 
  }

  protected onQuestionChanges(question: InputQuestion): void { 
    super.onQuestionChanges(question);
    this.hideField = question.defaultHidden;
  }

}

@NgModule({
  declarations: [InputQuestionComponent],
  imports:[
    SharedModule, 
    MatFormFieldModule,
    MatInputModule,  
  ]
})
class InputQuestionModule {}
