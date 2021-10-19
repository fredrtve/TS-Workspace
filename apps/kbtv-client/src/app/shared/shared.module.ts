import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppDynamicFormOptions } from '@core/configurations/app-dynamic-form-options.const';
import { ValidationErrorMessages } from '@core/configurations/validation-error-messages.const';
import { CdkSelectableModule } from 'cdk-selectable';
import { ConfirmDialogModule } from 'confirm-dialog';
import { DYNAMIC_FORM_DEFAULT_OPTIONS } from 'dynamic-forms';
import { FormSheetModule } from 'form-sheet';
import 'hammerjs';
import { DynamicFormGroupOptions, VALIDATION_ERROR_MESSAGES } from 'mat-dynamic-form-controls';
import { SharedAppModule } from '../shared-app/shared-app.module';
import { AngularMaterialModule } from './angular-material.module';
import { BottomSheetMenuComponent } from './bottom-sheet-menu/bottom-sheet-menu.component';
import { AppButtonComponent } from './components/app-button/app-button.component';
import { BottomActionBarComponent } from './components/bottom-action-bar/bottom-action-bar.component';
import { BottomBarIconButtonComponent } from './components/bottom-action-bar/bottom-bar-icon-button.component';
import { ChipsBarComponent } from './components/chips-bar.component';
import { MainSkeletonComponent } from './components/main-skeleton/main-skeleton.component';
import { ScrollNavElevationTogglerDirective } from './components/main-skeleton/scroll-nav-elevation-toggler.directive';
import { MainTopNavBarComponent } from './components/main-top-nav-bar/main-top-nav-bar.component';
import { LoadingOverlayDirective } from './directives';
import { HideDirective } from './directives/hide.directive';
import { ImageRatioResizerDirective } from './directives/image-ratio-resizer.directive';
import { AppFileUrlPipe, ArrayFromNumberPipe, FuncPipe, IsTodayPipe, MergeObjPipe, ObjectToArrayPipe, SortByDatePipe, TransformButtonPipe } from './pipes';
import { AppImageUrlRatioPipe } from './pipes/app-image-url-ratio.pipe';
import { ConvertToGooglePositionPipe } from './pipes/convert-to-google-position.pipe';
import { TransformButtonsPipe } from './pipes/transform-buttons.pipe';


@NgModule({
  declarations: [
    BottomSheetMenuComponent,
    MainSkeletonComponent,
    MainTopNavBarComponent,
    ChipsBarComponent,

    AppButtonComponent,
    BottomActionBarComponent,
    BottomBarIconButtonComponent,
    
    TransformButtonPipe,
    SortByDatePipe,
    IsTodayPipe,
    ArrayFromNumberPipe,
    AppFileUrlPipe,
    ObjectToArrayPipe,
    AppImageUrlRatioPipe,
    ConvertToGooglePositionPipe,
    FuncPipe,
    MergeObjPipe,
    ScrollNavElevationTogglerDirective,   
    LoadingOverlayDirective,  
    ImageRatioResizerDirective, 
    TransformButtonsPipe, 

    HideDirective
  ],
  imports: [
    AngularMaterialModule,
    SharedAppModule,    
    CdkSelectableModule, 
    ConfirmDialogModule,
    FormSheetModule, 
  ],
  exports: [
    AngularMaterialModule,
    SharedAppModule, 
    CdkSelectableModule,
    BottomSheetMenuComponent,
    MainSkeletonComponent,    
    MainTopNavBarComponent,
    ChipsBarComponent,
    AppButtonComponent,
    BottomActionBarComponent,
    TransformButtonPipe,
    SortByDatePipe,
    IsTodayPipe,
    ArrayFromNumberPipe,
    AppFileUrlPipe,
    ObjectToArrayPipe,
    AppImageUrlRatioPipe,
    MergeObjPipe,
    FuncPipe,
    TransformButtonsPipe,
    ConvertToGooglePositionPipe,

    ScrollNavElevationTogglerDirective,
    LoadingOverlayDirective,  
    ImageRatioResizerDirective,
    HideDirective  
  ],
  providers:[
    { provide: VALIDATION_ERROR_MESSAGES, useValue: ValidationErrorMessages},
    { provide: DYNAMIC_FORM_DEFAULT_OPTIONS, useValue: AppDynamicFormOptions } 
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule {}

declare module "dynamic-forms" {
  interface DefaultControlGroupComponentOptions extends DynamicFormGroupOptions { }
}