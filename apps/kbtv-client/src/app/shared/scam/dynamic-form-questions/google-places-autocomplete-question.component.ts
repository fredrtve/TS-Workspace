import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GoogleMapsLoader } from '@core/services/google-maps.loader';
import { SharedModule } from '@shared/shared.module';
import { BaseQuestionComponent, DynamicFormStore, Question, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { Address, GooglePlacesAutocompleteModule, Options } from 'google-places-autocomplete';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GooglePlacesAutoCompleteQuestion extends Question {
    options?: Partial<Options>;
    addressFormatter?: (address: Address) => string; 
    resetable?: boolean;
}

@Component({
  selector: 'app-google-places-autocomplete-question',
  template: `
    <mat-form-field *ngIf="mapsLoaded$ | async" [color]="question.color || 'accent'" class="w-100">
        <mat-label *ngIf="question.label">{{ question.label }}</mat-label>
        <input lib-google-places-autocomplete
            [options]="googleOptions"
            [placeholder]="question.placeholder" 
            [formControl]="control" 
            [required]="required"
            (onAddressChange)="onAddressChange($event)"  matInput />
        
        <mat-hint *ngIf="question.hint">{{ question.hint }}</mat-hint>

        <button mat-icon-button matSuffix *ngIf="question.resetable && control && !control.disabled  && control.value" aria-label="Clear" 
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
export class GooglePlacesAutoCompleteQuestionComponent extends BaseQuestionComponent<null, GooglePlacesAutoCompleteQuestion>  {
    
    googleOptions: Immutable<Partial<Options>> = {
        types: ['geocode'],
        componentRestrictions: { country: "no" }
    };

    mapsLoaded$: Observable<boolean> = this.googleMapsLoader.load$.pipe(map(x => true));

    addressFormatter = (address: Address) => address.formatted_address

    constructor(
        formStore: DynamicFormStore,
        private googleMapsLoader: GoogleMapsLoader,
        @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
    ) { 
        super(formStore, validationErrorMessages) 
    }
      
    onAddressChange(address: Address){
        this.control?.setValue(this.addressFormatter(address))
    }

    protected onQuestionChanges(value: GooglePlacesAutoCompleteQuestion): void{
        super.onQuestionChanges(value);

        if(this.question.addressFormatter) 
            this.addressFormatter = this.question.addressFormatter
        if(this.question.options)
            this.googleOptions = {...this.googleOptions, ...this.question.options}
    }   

}

@NgModule({
    declarations: [GooglePlacesAutoCompleteQuestionComponent],
    imports:[
      SharedModule,  
      GooglePlacesAutocompleteModule, 
      MatFormFieldModule,
      MatInputModule,
    ]
  })
class GooglePlacesAutoCompleteQuestionModule {}
  