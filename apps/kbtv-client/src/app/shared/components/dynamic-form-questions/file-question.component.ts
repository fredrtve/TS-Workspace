import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BaseQuestionComponent, Question, QuestionComponent, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'dynamic-forms';

export interface FileQuestion extends Question { multiple?: boolean; }

@Component({
  selector: 'app-file-question',
  template: `
  <div class="mt-3 mb-3" fxLayout="column">
    <div class="mat-body-2" *ngIf="question.label">{{ question.label }}</div>
    
    <input (change)="onFileChange($event)" type="file" [attr.multiple]="question.multiple" [attr.required]="required">

    <mat-hint *ngIf="question.hint">{{ question.hint }}</mat-hint>

    <mat-error *ngIf="control && control.dirty && control.invalid">
      {{ getValidationErrorMessage() }}
    </mat-error>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileQuestionComponent extends BaseQuestionComponent<FileQuestion> 
  implements QuestionComponent {

  constructor(@Inject(VALIDATION_ERROR_MESSAGES) validationErrorMessages: ValidationErrorMap) { 
    super(validationErrorMessages) 
  }

  onFileChange(e: Event): void {  
    if(!this.control) return;
    const target = <HTMLInputElement> e.target;    
    if(!target.files) return this.control.reset()
    this.control.markAsDirty();
    this.control.setValue(this.question.multiple ? target.files : target.files[0]);
  }

}