import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlFieldComponent, FormStateResolver } from 'dynamic-forms';
import { Maybe } from 'global-types';
import { Observable } from 'rxjs';
import { BaseFieldComponent } from '../base-control/base-field.component';
import { BaseFieldOptions } from '../base-control/base-field-options.interface';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface InputOptions extends BaseFieldOptions {
  type$?: "tel" | "text" | "number" | "email" | "file" | "password";
  hideable$?: boolean;
  defaultHidden$?: boolean;
  resetable$?: boolean;
  autoComplete$?: "on" | "off" | "new-password"
}

type ViewModel = InputOptions & { required$?: boolean }

@Component({
  template: `
    <mat-form-field *ngIf="vm$ | async;let vm" [color]="vm.color$ || 'accent'" class="w-100">
      <mat-label *ngIf="vm.label$">{{ vm.label$ }}</mat-label>

      <input matInput [attr.autocomplete]="vm.autoComplete$"
        [type]="hideField ? 'password' : (vm.type$ === 'password' ? 'text' : vm.type$)" 
        [placeholder]="vm.placeholder$" 
        [formControl]="formControl" 
        [required]="vm.required$" />

      <mat-icon *ngIf="vm.hideable$" [color]="vm.color$ || 'accent'" matSuffix 
        (tap)="hideField = !hideField">
        {{hideField ? 'visibility_off' : 'visibility'}}
      </mat-icon>

      <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>

      <button mat-icon-button matSuffix *ngIf="vm.resetable$ && !formControl?.disabled && formControl?.value" aria-label="Clear" 
        (tap)="formControl?.setValue(''); formControl?.markAsDirty()">
        <mat-icon>close</mat-icon>
      </button>

      <mat-error *ngIf="formControl?.dirty && formControl?.invalid">
        {{ getValidationErrorMessage() }}
      </mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFieldComponent extends BaseFieldComponent<string, InputOptions> implements ControlFieldComponent<string, InputOptions> {

  hideField: Maybe<boolean>;

  vm$: Observable<ViewModel>;

  constructor(
    resolver: FormStateResolver,
    @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
  ) { 
      super(resolver, validationErrorMessages);
  }

  onControlInit(){
    this.vm$ = this.resolveSlice$<ViewModel>({...this.viewOptionSelectors, required$: this.requiredSelector });
  }

}
@NgModule({
  declarations: [InputFieldComponent],
  imports:[
    CommonModule,    
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,  
    MatIconModule,
    MatButtonModule
  ]
})
class InputControlModule {}
