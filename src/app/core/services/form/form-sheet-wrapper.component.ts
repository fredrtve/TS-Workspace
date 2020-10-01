import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Inject, ViewContainerRef } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { BaseFormSheetWrapperComponent } from './abstracts/base-form-sheet-wrapper.component';
import { FormComponent } from './interfaces/form-component.interface';
import { FormSheetWrapperConfig } from './interfaces/form-sheet-wrapper-config.interface';
import { FormSheetWrapperResult } from './interfaces/form-sheet-wrapper-result.interface';

@Component({
    selector: '',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSheetWrapperComponent extends BaseFormSheetWrapperComponent<FormSheetWrapperConfig<any, FormComponent>> {

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    router: Router,
    _bottomSheetRef: MatBottomSheetRef<FormSheetWrapperComponent, FormSheetWrapperResult>,  
    @Inject(MAT_BOTTOM_SHEET_DATA) config: FormSheetWrapperConfig<any, FormComponent>) { 
        super(componentFactoryResolver, viewContainerRef, router, _bottomSheetRef, config) 
    }
}
