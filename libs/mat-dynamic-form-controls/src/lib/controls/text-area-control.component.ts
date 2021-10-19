import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormStateResolver } from 'dynamic-forms';
import { Observable } from 'rxjs';
import { BaseViewOptions } from '../base-control/base-view-options.interface';
import { BaseControlComponent } from '../base-control/base-control.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface TextAreaOptions extends BaseViewOptions {
  rows$: number;
}

type ViewModel = TextAreaOptions & { required$?: boolean }

@Component({
  template: `
    <mat-form-field *ngIf="vm$ | async; let vm" [color]="vm.color$ || 'accent'" class="w-100">
        <mat-label *ngIf="vm.label$">{{ vm.label$ }}</mat-label>
        
        <textarea matInput 
            [rows]="vm.rows$"
            [placeholder]="vm.placeholder$" 
            [formControl]="control" 
            [required]="vm.required$">
        </textarea> 

        <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>

        <mat-error *ngIf="control && control.dirty && control.invalid">
          {{ getValidationErrorMessage() }}
        </mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextAreaControlComponent extends BaseControlComponent<string, TextAreaOptions>  {

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
  declarations: [TextAreaControlComponent],
  imports:[
    CommonModule, 
    ReactiveFormsModule,  
    MatFormFieldModule,
    MatInputModule,    
  ]
})
class TextAreaControlModule {}