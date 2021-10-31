import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ControlGroupSchema } from 'dynamic-forms';
import { Immutable, Maybe, NotNull } from 'global-types';
import { Observable } from 'rxjs';
import { DeepPartial } from 'ts-essentials';
import { FormSheetWrapperComponent } from './form-sheet-wrapper.component';

/** Represents the configuration for {@link FormSheetWrapperComponent} */
export interface FormSheetWrapperConfig<
    TForm extends object, 
    TInputState extends object = {},
> extends FormSheetConfigurations<TForm, TInputState>, FormSheetState<TForm, TInputState>{
    /** Function that executes when form is submitted. */
    submitCallback?: Maybe<(val: Immutable<NotNull<TForm>>) => void>;
}


/** Represents configuration for opening a form with {@link FormService} */
export interface FormSheetViewConfig<
    TForm extends object, 
    TInputState extends object = {}
> extends FormSheetConfigurations<TForm, TInputState> {
    /** Set to true to enable full screen forms on mobile. Defaults to true */
    fullScreen?: boolean;
    /** Enable to append a query param to the route when opened, making the form a part of the browser history. 
     *  Default is true */
    useRouting?: boolean;
}

export interface FormSheetConfigurations<
    TForm extends object, 
    TInputState extends object = {}
>{
    /** The form config passed to the provided form component */
    formConfig: ControlGroupSchema<TForm, TInputState, any,any>; 
    /** Configuration for the top navigation bar on bottom sheet */
    navConfig: FormSheetNavConfig;
    /** Configuration for the form submit bar */
    actionConfig: FormActionsOptions<TForm>;
    /** A custom class applied to form element */
    formClass?: string
}

/** Represents configuration for opening a form with {@link FormService} */
export interface FormSheetState<TForm extends object, TFormState extends object = never>{
    /** the initial value of the form */
    initialValue?: Maybe<Immutable<DeepPartial<TForm>>>;
    /** Form state required by the form */
    formState?: TFormState | Observable<Immutable<TFormState>>
}

/**  Represents a configuration object for the top navigation bar on the form sheet */
export interface FormSheetNavConfig {
    title: string;
    /** Buttons to be rendered on the top right of the nav bar */
    buttons?: FormSheetNavButton[];
}

/** Represents a button used in the form sheet navigation bar.  */
export interface FormSheetNavButton{
    /** The material icon representing the button */
    icon: string;
    /** The function thats being called on button click */
    callback: (ref: MatBottomSheetRef<FormSheetWrapperComponent, unknown>) => void;
    /** The color of the button */
    color?: "primary" | "accent" | "warn"; 
    /** A description of the button's function */
    aria?: string;
}
/** Represents different options for customizing behaviour of the form actions */
export interface FormActionsOptions<TForm> {
    /** The text of the submit button */
    submitText?: string;
    /** Set to true if the form should have a reset option */
    resettable?: boolean;
    /** The form value that will be set on reset */
    resetState?: Partial<TForm>;
    /** Should the form require the user to be online before submitting? */
    onlineRequired?: boolean;
    /** Can the form submit in pristine state? */
    allowPristine?: boolean;    
    /** Set to true to get the raw form value on submit. 
     * This includes the values of disabled controls. */
    getRawValue?: boolean; 
}

export interface FormActionsComponent<TOptions> {
    options: TOptions;
    formGroup: FormGroup;
    
    formReset: EventEmitter<any>;
    formCancel: EventEmitter<any>;
    formSubmit: EventEmitter<any>;
}