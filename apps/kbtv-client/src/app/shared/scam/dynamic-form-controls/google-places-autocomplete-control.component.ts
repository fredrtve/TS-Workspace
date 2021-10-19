import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GoogleMapsLoader } from '@core/services/google-maps.loader';
import { FormStateResolver } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { Address, GooglePlacesAutocompleteModule, Options } from 'google-places-autocomplete';
import { BaseControlComponent, BaseViewOptions, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'mat-dynamic-form-controls';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GooglePlacesAutoCompleteOptions extends BaseViewOptions {
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
            [formControl]="control" 
            [required]="vm.required$"
            (onAddressChange)="onAddressChange($event, vm.addressFormatter$)"  matInput />
        
        <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>

        <button mat-icon-button matSuffix *ngIf="vm.resetable$ && control && !control.disabled  && control.value" aria-label="Clear" 
            (tap)="control.setValue(''); control.markAsDirty()">
            <mat-icon>close</mat-icon>
        </button>

        <mat-error *ngIf="control?.dirty && control?.invalid">
            {{ getValidationErrorMessage() }}
        </mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GooglePlacesAutoCompleteControlComponent extends BaseControlComponent<string, GooglePlacesAutoCompleteOptions>  {
    
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
        this.control?.setValue(formatter(address))
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
  