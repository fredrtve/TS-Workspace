import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GoogleMapsLoader } from '@core/services/google-maps.loader';
import { FormStateResolver } from '@fretve/dynamic-forms';
import { Immutable } from '@fretve/global-types';
import { Address, GooglePlacesAutocompleteModule, Options } from 'google-places-autocomplete';
import { BaseFieldComponent, BaseFieldOptions, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from '@fretve/mat-dynamic-form-controls';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GooglePlacesAutoCompleteOptions extends BaseFieldOptions {
    options$?: Partial<Options>;
    addressFormatter$?: (address: Address) => string; 
    resetable$?: boolean;
}

type ViewModel = GooglePlacesAutoCompleteOptions & { required$?: boolean }

@Component({
  template: `
    <mat-form-field *ngIf="vm$ | async; let vm" [color]="vm.color$ || 'accent'" class="w-100">
        <mat-label *ngIf="vm.label$">{{ vm.label$ }}</mat-label>
        <input lib-google-places-autocomplete
            [options]="vm.options$"
            [placeholder]="vm.placeholder$" 
            [formControl]="formControl" 
            [required]="vm.required$"
            (onAddressChange)="onAddressChange($event, vm.addressFormatter$)"  matInput />
        
        <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>

        <button mat-icon-button matSuffix *ngIf="vm.resetable$ && formControl && !formControl.disabled  && formControl.value" aria-label="Clear" 
            (tap)="formControl.setValue(''); formControl.markAsDirty()">
            <mat-icon>close</mat-icon>
        </button>

        <mat-error *ngIf="formControl?.dirty && formControl?.invalid">
            {{ getValidationErrorMessage() }}
        </mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GooglePlacesAutoCompleteControlComponent extends BaseFieldComponent<string, GooglePlacesAutoCompleteOptions>  {
    
    private defaultOptions: Immutable<Partial<Options>> = {
        types: ['geocode'],
        componentRestrictions: { country: "no" }
    };

    vm$: Observable<Immutable<ViewModel>>

    addressFormatter = (address: Address) => address.formatted_address

    constructor(
        resolver: FormStateResolver,
        private googleMapsLoader: GoogleMapsLoader,
        @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
    ) { 
        super(resolver, validationErrorMessages) 
    }

    onControlInit() {
        this.vm$ = combineLatest([
            this.resolveSlice$<ViewModel>({...this.viewOptionSelectors, required$: this.requiredSelector }),
            this.googleMapsLoader.load$.pipe(map(x => true)),
        ]).pipe(
            map(([compOptions])=> ({ ...compOptions, options$: {...this.defaultOptions, ...compOptions.options$} }))
        )
    }
      
    onAddressChange(address: Address, formatter: (address: Address) => string){
        this.formControl?.setValue(formatter(address))
    } 

}

@NgModule({
    declarations: [GooglePlacesAutoCompleteControlComponent],
    imports:[
      CommonModule,  
      ReactiveFormsModule,
      GooglePlacesAutocompleteModule, 
      MatIconModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
    ]
  })
class GooglePlacesAutoCompleteControlModule {}
  