import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { SharedAppModule } from '../shared-app/shared-app.module';
import { AngularMaterialModule } from './angular-material.module';
import {
  ConfirmDialogComponent,
  ListCardComponent, MailToFormViewComponent,
  SelectableCardComponent,
  SimpleTopNavComponent
} from './components';
import { AddToHomeScreenDirective, HttpCommandButtonDirective, LoadingOverlayDirective  } from './directives';
import { ArrayFromNumberPipe, ArraySlicePipe, SortByDatePipe, TransformButtonPipe, TranslatePipe } from './pipes';
import { ActiveStringFilterDirective } from './directives/active-filter.directive';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    SortByDatePipe,
    AddToHomeScreenDirective,
    ArrayFromNumberPipe,
    ActiveStringFilterDirective,
    HttpCommandButtonDirective,
    MailToFormViewComponent,
    SelectableCardComponent,
    ArraySlicePipe,
    TranslatePipe,
    SimpleTopNavComponent,
    TransformButtonPipe,
    ListCardComponent,
    LoadingOverlayDirective
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    GooglePlaceModule,   
    SharedAppModule
  ],
  exports: [
    FormsModule,    
    ReactiveFormsModule,
    AngularMaterialModule,
    GooglePlaceModule,
    ConfirmDialogComponent,
    HttpCommandButtonDirective,
    ActiveStringFilterDirective,
    LoadingOverlayDirective,
    SortByDatePipe,
    TranslatePipe,
    ArrayFromNumberPipe,
    MailToFormViewComponent,
    SelectableCardComponent,
    ArraySlicePipe,
    SimpleTopNavComponent,
    ListCardComponent,
    AddToHomeScreenDirective,    
    TransformButtonPipe,
    SharedAppModule,
  ]
})
export class SharedModule { }
