import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormStateResolver } from 'dynamic-forms';
import { Observable } from 'rxjs';
import { BaseFieldComponent } from '../base-control/base-field.component';
import { BaseFieldOptions } from '../base-control/base-field-options.interface';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface CheckboxOptions extends BaseFieldOptions {
  text$: string;
}

type ViewModel = CheckboxOptions & { required$?: boolean }

@Component({
  template: `  
  <ng-container *ngIf="vm$ | async; let vm">
    <div class="mat-body-2" *ngIf="vm.label$">{{ vm.label$ }}</div>

    <mat-checkbox style="margin-bottom:16px"
        [color]="vm.color$ || 'accent'" 
        [formControl]="control" 
        [required]="vm.required$" >
        {{ vm.text$ }}
    </mat-checkbox>

    <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>

    <mat-error *ngIf="control && control.dirty && control.invalid">
      {{ getValidationErrorMessage() }}
    </mat-error>
  </ng-container>
  `,
  styles: [` :host { overflow: hidden } `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxFieldComponent extends BaseFieldComponent<boolean, CheckboxOptions> {
  
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
  declarations: [CheckboxFieldComponent],
  imports:[
    CommonModule,   
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
  ]
})
class CheckboxControlModule {}