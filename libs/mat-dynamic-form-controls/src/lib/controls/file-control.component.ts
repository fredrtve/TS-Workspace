import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormStateResolver } from 'dynamic-forms';
import { Observable } from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';
import { BaseViewOptions } from '../base-control/base-view-options.interface';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface FileOptions extends BaseViewOptions { multiple$?: boolean; }

type ViewModel = FileOptions & { required$?: boolean }

@Component({
  template: `
  <style>
    .container{
      flex-direction: column;
      box-sizing: border-box;
      display: flex;
    }
  </style>
  <div class="mt-3 mb-3 container" *ngIf="vm$ | async; let vm">
    <div class="mat-body-2" *ngIf="vm.label$">{{ vm.$ }}</div>
    
    <input (change)="onFileChange($event, vm.multiple$)" type="file" [attr.multiple]="vm.multiple$" [attr.required]="vm.required$">

    <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>

    <mat-error *ngIf="control && control.dirty && control.invalid">
      {{ getValidationErrorMessage() }}
    </mat-error>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileControlComponent extends BaseControlComponent<FileList, FileOptions> {

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
    if(!this.control) return;
    const target = <HTMLInputElement> e.target;    
    if(!target.files) return this.control.reset()
    this.control.markAsDirty();
    this.control.setValue(target.files);
  }

}
@NgModule({
  declarations: [FileControlComponent],
  imports:[
    CommonModule,    
    ReactiveFormsModule,
    MatFormFieldModule 
  ]
})
class FileControlModule {}
