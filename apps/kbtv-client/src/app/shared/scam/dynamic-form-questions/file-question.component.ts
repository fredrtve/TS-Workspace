import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared/shared.module';
import { BaseQuestionComponent, DynamicFormStore, Question, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'dynamic-forms';

export interface FileQuestion extends Question { multiple?: boolean; }

@Component({
  selector: 'app-file-question',
  template: `
  <style>
    .container{
      flex-direction: column;
      box-sizing: border-box;
      display: flex;
    }
  </style>
  <div class="mt-3 mb-3 container">
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
export class FileQuestionComponent extends BaseQuestionComponent<null, FileQuestion> {

  constructor(
    formStore: DynamicFormStore,
    @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
  ) { 
    super(formStore, validationErrorMessages) 
  }

  onFileChange(e: Event): void {  
    if(!this.control) return;
    const target = <HTMLInputElement> e.target;    
    if(!target.files) return this.control.reset()
    this.control.markAsDirty();
    this.control.setValue(this.question.multiple ? target.files : target.files[0]);
  }

}

@NgModule({
  declarations: [FileQuestionComponent],
  imports:[
    SharedModule, 
    MatFormFieldModule 
  ]
})
class FileQuestionModule {}
