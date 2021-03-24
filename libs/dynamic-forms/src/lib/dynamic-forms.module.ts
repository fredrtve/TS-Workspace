import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DynamicControlGroupComponent } from './components/dynamic-control-group.component';
import { DynamicFormComponent } from './components/dynamic-form.component';
import { FormActionsComponent } from './components/form-actions.component';
import { DynamicHostDirective } from './dynamic-host.directive';

/** Responsible for declaring components and exporting the {@link DynamicFormComponent} */
@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicControlGroupComponent,
    FormActionsComponent,
    DynamicHostDirective
  ],
  imports: [ 
    CommonModule, 
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  exports: [
    DynamicFormComponent
  ],
  providers: [],
})
export class DynamicFormsModule { }
