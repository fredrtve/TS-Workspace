import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormStateResolver } from '@fretve/dynamic-forms';
import { Observable } from 'rxjs';
import { BaseFieldOptions } from '../base-control/base-field-options.interface';
import { BaseFieldComponent } from '../base-control/base-field.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface TextAreaOptions extends BaseFieldOptions {
  rows$: number;
}

type ViewModel = TextAreaOptions & { required$?: boolean }

@Component({
  template: `
    <mat-form-field *ngIf="vm$ | async; let vm" [color]="vm.color$ || 'accent'" style="width:100%">
        <mat-label *ngIf="vm.label$">{{ vm.label$ }}</mat-label>
        
        <textarea matInput 
            [rows]="vm.rows$"
            [placeholder]="vm.placeholder$" 
            [formControl]="formControl" 
            [required]="vm.required$">
        </textarea> 

        <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>

        <mat-error *ngIf="formControl && formControl.dirty && formControl.invalid">
          {{ getValidationErrorMessage() }}
        </mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextAreaFieldComponent extends BaseFieldComponent<string, TextAreaOptions>  {

  vm$: Observable<ViewModel>;

  constructor(
    resolver: FormStateResolver,
    @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
  ) { 
      super(resolver, validationErrorMessages);
  }

  onControlInit(){
    this.vm$ = this.resolveSlice$<ViewModel>({...this.viewOptionSelectors, required$: this.requiredSelector});
  }

}
@NgModule({
  declarations: [TextAreaFieldComponent],
  imports:[
    CommonModule, 
    ReactiveFormsModule,  
    MatFormFieldModule,
    MatInputModule,    
  ],
  exports: [TextAreaFieldComponent],
})
export class TextAreaFieldModule {}