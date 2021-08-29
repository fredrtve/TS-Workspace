import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { BaseQuestionComponent, DynamicFormStore, Question, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'dynamic-forms';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface IonDateQuestionBindings { min: string, max: string, defaultValue: string}

export interface IonDateQuestion<TFormState extends object | null = null> extends Question<IonDateQuestionBindings, TFormState> {
    ionFormat: string;
    datePipeFormat?: string;
    minuteValues?: number[];
    valueSetter?: (value: string) => unknown;
}

const _dayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag","Torsdag", "Fredag", "Lørdag"]
const _dayShortNames = ["Søn", "Man", "Tir", "Ons","Tor", "Fre", "Lør"]
const _monthNames = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
const _monthShortNames = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"]

@Component({
  selector: 'app-ion-date-question',
  template:`
   <div (tap)="dateTime.click()" class="w-100" [ngStyle]="{'pointer-events': control?.disabled ? 'none' : 'auto'}">
     
      <mat-form-field style="pointer-events:none!important;" class="w-100" [color]="question.color || 'accent'">
        <mat-label *ngIf="question.label">{{ question.label }}</mat-label>
        <input matInput required 
          [disabled]="control?.disabled" 
          [value]="question.datePipeFormat ? (control?.value | date : question.datePipeFormat) : control?.value" 
          [placeholder]="question.placeholder" 
          [attr.aria-label]="question.ariaLabel">  
            <mat-hint *ngIf="question.hint">{{ question.hint }}</mat-hint>

            <mat-error *ngIf="control && control.dirty && control.invalid">
              {{ getValidationErrorMessage() }}
            </mat-error>  
      </mat-form-field>

      <ion-datetime #dateTime appHide 
        cancel-text="Avbryt" done-text="Ferdig"
        [attr.max]="max$ | async"
        [attr.min]="min$ | async"
        [attr.day-names]="dayNames"
        [attr.day-short-names]="dayShortNames"
        [attr.month-names]="monthNames"
        [attr.month-short-names]="monthShortNames"
        [attr.display-format]="question.ionFormat"
        [attr.minute-values]="question.minuteValues"
        [value]="control?.value || (stateBindings.defaultValue | async)"
        (ionChange)="onChange($event.detail.value);">
      </ion-datetime>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonDateQuestionComponent extends BaseQuestionComponent<IonDateQuestionBindings, IonDateQuestion<object | null>> {

  dayNames = _dayNames;
  dayShortNames = _dayShortNames;
  monthNames = _monthNames;
  monthShortNames = _monthShortNames;

  min$?: Observable<string>;
  max$?: Observable<string>;

  constructor(
    @Inject(VALIDATION_ERROR_MESSAGES) validationErrorMessages: ValidationErrorMap, 
    private cdRef: ChangeDetectorRef,
    formStore: DynamicFormStore<object>
  ) { 
    super(validationErrorMessages,formStore);
  }

  onChange(val: string){
    if(!this.control) return;

    const value = this.question.valueSetter ? this.question.valueSetter(val) : val;

    this.control.setValue(value);  
    this.control.markAsDirty();
    this.cdRef.markForCheck();
  }


  protected onQuestionChanges(question: IonDateQuestion<object | null>){
    super.onQuestionChanges(question);
    this.min$ = this.stateBindings.min?.pipe(filter(x => x != null));
    this.max$ = this.stateBindings.max?.pipe(filter(x => x != null));

  }
  
}

@NgModule({
  declarations: [IonDateQuestionComponent],
  imports:[
    SharedModule,
    MatFormFieldModule,
    MatInputModule,   
     
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
class IonDateQuestionModule {}