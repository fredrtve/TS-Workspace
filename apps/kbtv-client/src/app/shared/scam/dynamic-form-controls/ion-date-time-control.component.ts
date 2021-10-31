import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { _getISO, _getLastDayOfYear } from 'date-time-helpers';
import { FormStateResolver } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { BaseFieldComponent, BaseFieldOptions, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'mat-dynamic-form-controls';
import { combineLatest, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface ValueSetterOptional { valueSetter?: (value: string) => string }
interface ValueSetter<T> { valueSetter: (value: string) => T }

export type IonDateOptions<T = string> = BaseFieldOptions & (T extends string ? ValueSetterOptional : ValueSetter<T>) & {
    ionFormat$: string;
    datePipeFormat$?: string;
    minuteValues$?: number[];
    min$?: string, 
    max$?: string, 
    defaultValue$?: string
}

const _dayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag","Torsdag", "Fredag", "Lørdag"]
const _dayShortNames = ["Søn", "Man", "Tir", "Ons","Tor", "Fre", "Lør"]
const _monthNames = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
const _monthShortNames = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"]

@Component({
  template:`
   <div (tap)="dateTime.click()" class="w-100" [ngStyle]="{'pointer-events': formControl?.disabled ? 'none' : 'auto'}"
      *ngIf="vm$ | async; let vm">
     
      <mat-form-field style="pointer-events:none!important;" class="w-100" [color]="vm.viewOptions.color$ || 'accent'">
        <mat-label *ngIf="vm.viewOptions.label$">{{ vm.viewOptions.label$ }}</mat-label>
        <input matInput required 
          [disabled]="formControl?.disabled" 
          [value]="vm.viewOptions.datePipeFormat$ ? (vm.value | date : vm.viewOptions.datePipeFormat$) : vm.value" 
          [placeholder]="vm.viewOptions.placeholder$" 
          [attr.aria-label]="vm.viewOptions.ariaLabel$">  
            <mat-hint *ngIf="vm.viewOptions.hint$">{{ vm.viewOptions.hint$ }}</mat-hint>

            <mat-error *ngIf="formControl && formControl.dirty && formControl.invalid">
              {{ getValidationErrorMessage() }}
            </mat-error>  
      </mat-form-field>

      <ion-datetime #dateTime appHide 
        cancel-text="Avbryt" done-text="Ferdig"
        [attr.max]="vm.viewOptions.max$"
        [attr.min]="vm.viewOptions.min$"
        [attr.day-names]="dayNames"
        [attr.day-short-names]="dayShortNames"
        [attr.month-names]="monthNames"
        [attr.month-short-names]="monthShortNames"
        [attr.display-format]="vm.viewOptions.ionFormat$"
        [attr.minute-values]="vm.viewOptions.minuteValues$"
        [value]="vm.value || vm.defaultValue$"
        (ionChange)="onChange($event.detail.value, vm.viewOptions.valueSetter$);">
      </ion-datetime>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonDateControlComponent<T = string> extends BaseFieldComponent<T, IonDateOptions<T>> {

  private defaultMin = _getISO(new Date(0));
  private defaultMax = _getISO(_getLastDayOfYear());

  dayNames = _dayNames;
  dayShortNames = _dayShortNames;
  monthNames = _monthNames;
  monthShortNames = _monthShortNames;

  vm$: Observable<{ viewOptions: Immutable<IonDateOptions<T>>, value: T, required$?: boolean }>;

  constructor(
    resolver: FormStateResolver,
    private cdRef: ChangeDetectorRef,
    @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
  ) { 
      super(resolver, validationErrorMessages);
  }

  onControlInit(): void {
    this.vm$ = combineLatest([
      merge(of(this.formControl!.value), this.formControl!.valueChanges),
      this.resolveOptions$(),
      this.resolve$(this.requiredSelector)
    ]).pipe(
      map(([value, viewOptions, required$])=> ({value, required$, viewOptions: <Immutable<IonDateOptions<T>>> {
        ...viewOptions,
        min$: viewOptions.min$ || this.defaultMin,  
        max$: viewOptions.max$ || this.defaultMax
      }}))
    );
  }

  onChange(val: string, setter?: (value: string) => T){
    if(!this.formControl) return;
    this.formControl.setValue(setter ? setter(val) : <T><unknown> val);  
    this.formControl.markAsDirty();
    this.cdRef.markForCheck();
  }

}
@NgModule({
  declarations: [IonDateControlComponent],
  imports:[
    SharedModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,   
     
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
class IonDateControlModule {}