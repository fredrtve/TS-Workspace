import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormStateResolver } from '@fretve/dynamic-forms';
import { Observable } from 'rxjs';
import { BaseFieldComponent } from '../base-control/base-field.component';
import { BaseFieldOptions } from '../base-control/base-field-options.interface';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface FileOptions extends BaseFieldOptions { multiple$?: boolean; }

type ViewModel = FileOptions & { required$?: boolean }

@Component({
  template: `
  <style>
    .container{
      flex-direction: column;
      box-sizing: border-box;
      display: flex;
      margin: 12px 0;
    }
  </style>
  <div class="container" *ngIf="vm$ | async; let vm">
    <div class="mat-body-2" *ngIf="vm.label$">{{ vm.$ }}</div>
    
    <input (change)="onFileChange($event, vm.multiple$)" type="file" [attr.multiple]="vm.multiple$" [attr.required]="vm.required$">

    <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>

    <mat-error *ngIf="formControl && formControl.dirty && formControl.invalid">
      {{ getValidationErrorMessage() }}
    </mat-error>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileFieldComponent extends BaseFieldComponent<FileList, FileOptions> {

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

  onFileChange(e: Event, takeAll: boolean): void {  
    if(!this.formControl) return;
    const target = <HTMLInputElement> e.target;    
    if(!target.files) return this.formControl.reset()
    this.formControl.markAsDirty();
    this.formControl.setValue(target.files);
  }

}
@NgModule({
  declarations: [FileFieldComponent],
  imports:[
    CommonModule,    
    ReactiveFormsModule,
    MatFormFieldModule 
  ],
  exports: [FileFieldComponent]
})
export class FileFieldModule {}
