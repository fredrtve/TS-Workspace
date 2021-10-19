import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './components/dynamic-form.component';
import { DynamicHostDirective } from './dynamic-host.directive';

/** Responsible for declaring components and exporting the {@link DynamicFormComponent} */
@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicHostDirective
  ],
  imports: [ 
    CommonModule, 
    ReactiveFormsModule,
  ],
  exports: [
    DynamicFormComponent,
    DynamicHostDirective
  ],
  providers: [],
})
export class DynamicFormsModule { 
  constructor(){}
}
