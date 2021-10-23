import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AllowFormStateSelectors, ControlComponentRenderer, ControlGroupComponent, DynamicControlGroup, DynamicFormsModule, DynamicHostDirective, FormStateResolver, ValidControlObject } from 'dynamic-forms';
import { Observable } from 'rxjs';

export interface DynamicFormGroupOptions { label$?: string }

@Component({
  selector: 'lib-dynamic-control-group',
  template: `
  <style>
  .control-container{
    flex-direction: row;
    box-sizing: border-box;
    display: flex;
    align-content: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  </style>
  <ng-container>  
  <ng-container *ngIf="options$ | async; let options">
    <mat-label *ngIf="options.label$">{{ options.label$ }}</mat-label>
  </ng-container>
  <div class="control-container">   
    <ng-container *dynamicHost>
    
    </ng-container>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicControlGroupComponent implements ControlGroupComponent<DynamicFormGroupOptions> {
    @ViewChild(DynamicHostDirective, { static: true }) dynamicHost: DynamicHostDirective;

    options$: Observable<DynamicFormGroupOptions>;

    formGroup: FormGroup;

    viewOptionSelectors: AllowFormStateSelectors<DynamicFormGroupOptions, any, any>

    controls: ValidControlObject<any>

    constructor(
      private controlRenderer: ControlComponentRenderer,
      private resolver: FormStateResolver,
    ) {}

    ngOnInit(): void {
      this.options$ = this.resolver.resolveSlice$<DynamicFormGroupOptions>(this.viewOptionSelectors); 
      this.controlRenderer.renderControls(this.controls, this.formGroup, this.dynamicHost.viewContainerRef);
    }
}
@NgModule({
  declarations: [DynamicControlGroupComponent],
  imports:[
    CommonModule,   
    ReactiveFormsModule,
    MatFormFieldModule,  
    DynamicFormsModule,
  ],
})
class DynamicControlGroupModule {}