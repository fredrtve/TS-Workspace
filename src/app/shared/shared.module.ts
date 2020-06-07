import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from './angular-material.module';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FlexLayoutModule } from '@angular/flex-layout';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { DefaultOwlDateTimeIntl } from './customizations/default-owl-date-time-intl';
import { DEFAULT_OWL_DATE_TIME_FORMATS } from './customizations/default-owl-date-time-formats';

import { ArraySlicePipe, ThumbnailPipe, SortByDatePipe, GetEmployerByIdPipe, ArrayFromNumberPipe, FiletypeFromUrlPipe, FileiconFromFiletypePipe } from './pipes'

import { InputListenerDirective, ImageErrorReloaderDirective, AddToHomeScreenDirective, IfRoleDirective, HttpCommandButtonDirective } from './directives';

import { MainNavComponent, MainBottomNavComponent, IconButtonComponent,StrokedButtonComponent, MainSideNavContentComponent, SimpleTopNavComponent, MainTopNavComponent, DetailTopNavComponent} from './layout';

import {
  ConfirmDialogComponent,
  NotificationComponent,
  PageNotFoundComponent,
  ListCardComponent,
  BottomSheetMenuComponent,
  SwipeCardComponent
} from './components';

import { LoginPromptComponent } from './components/login-prompt/login-prompt.component';
import { LoginFormComponent } from './components/login-prompt/login-form/login-form.component';

@NgModule({
  declarations: [
    MainNavComponent,
    MainBottomNavComponent,
    ConfirmDialogComponent,
    IfRoleDirective,
    ArraySlicePipe,
    ThumbnailPipe,
    SortByDatePipe,
    NotificationComponent,
    BottomSheetMenuComponent,
    PageNotFoundComponent,
    IconButtonComponent,
    StrokedButtonComponent,
    ListCardComponent,
    AddToHomeScreenDirective,
    SwipeCardComponent,
    MainSideNavContentComponent,
    MainTopNavComponent,
    InputListenerDirective,
    SimpleTopNavComponent,
    GetEmployerByIdPipe,
    ImageErrorReloaderDirective,
    ArrayFromNumberPipe,
    FiletypeFromUrlPipe,
    FileiconFromFiletypePipe,
    DetailTopNavComponent,
    LoginPromptComponent,
    LoginFormComponent,
    HttpCommandButtonDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LayoutModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    FlexLayoutModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  entryComponents:[
    BottomSheetMenuComponent,
  ],
  providers: [
    {provide: OwlDateTimeIntl, useClass: DefaultOwlDateTimeIntl},
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'no'},
    {provide: OWL_DATE_TIME_FORMATS, useValue: DEFAULT_OWL_DATE_TIME_FORMATS},
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LayoutModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FlexLayoutModule,
    ConfirmDialogComponent,
    IfRoleDirective,
    AddToHomeScreenDirective,
    InputListenerDirective,
    HttpCommandButtonDirective,
    ArraySlicePipe,
    ThumbnailPipe,
    SortByDatePipe,
    MainNavComponent,
    PageNotFoundComponent,
    IconButtonComponent,
    StrokedButtonComponent,
    ListCardComponent,
    SwipeCardComponent,
    SimpleTopNavComponent,
    GetEmployerByIdPipe,
    ArrayFromNumberPipe,
    ImageErrorReloaderDirective,
    FiletypeFromUrlPipe,
    FileiconFromFiletypePipe
  ]
})
export class SharedModule { }
