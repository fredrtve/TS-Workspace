import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmDialogModule } from 'confirm-dialog';
import { DynamicFormsModule } from 'dynamic-forms';
import { FormSheetModule } from 'form-sheet';
import { ModelFormComponent } from './model-form.component';

@NgModule({
    declarations: [ ModelFormComponent ],
    imports: [
        CommonModule,
        DynamicFormsModule,
        FormSheetModule,
        ConfirmDialogModule,
    ],
    exports: [ ModelFormComponent ],
    providers: [],
})
export class ModelFormModule { }
  