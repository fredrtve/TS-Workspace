import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { FormStateResolver } from '@fretve/dynamic-forms';
import { combineLatest, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFieldComponent } from '../base-control/base-field.component';
import { BaseFieldOptions } from '../base-control/base-field-options.interface';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface SliderOptions extends BaseFieldOptions {
  tickInterval$?: number;
  min$?: number;
  max$?: number;
  thumbLabel$?: boolean;
  valueSuffix$?: string;
}

@Component({
  template: `  
    <style>
      .slider-container{
        display: flex;
        align-items: center;
      }
      mat-slider{
        flex: 1 1 0%;
        box-sizing: border-box;
      }
    </style>
    <ng-container *ngIf="vm$ | async; let vm">
      <div class="mat-body" *ngIf="vm.viewOptions.labe$l">{{ vm.viewOptions.label$ }}</div>

      <mat-hint *ngIf="vm.viewOptions.hint$" class="mat-caption">{{ vm.viewOptions.hint$ }}</mat-hint>
      
      <div class="slider-container">
          <span class="mat-body">{{ vm.controlValue + " " + (vm.viewOptions?.valueSuffix$ || '') }}</span>
          <mat-slider [color]="vm.viewOptions.color$ || 'accent'" [value]="vm.controlValue" 
              (input)="updateValue($event.value)"
              [thumbLabel]="vm.viewOptions.thumbLabel$"
              [tickInterval]="vm.viewOptions.tickInterval$ || 1"
              [min]="vm.viewOptions.min$"
              [max]="vm.viewOptions.max$">
          </mat-slider>
      </div>

      <mat-error *ngIf="formControl && formControl.dirty && formControl.invalid">
        {{ getValidationErrorMessage() }}
      </mat-error>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderFieldComponent extends BaseFieldComponent<number, SliderOptions> {

    vm$: Observable<{controlValue: number, viewOptions: SliderOptions}>;

    constructor(
      resolver: FormStateResolver,
      @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
    ) { 
        super(resolver, validationErrorMessages);
    }
    
    onControlInit(): void {
      this.vm$ = combineLatest([
        this.resolveOptions$(),
        merge(of(this.formControl!.value), this.formControl!.valueChanges).pipe(
          map(x => x || 0)
        )
      ]).pipe(
        map(([viewOptions, controlValue]) => ({viewOptions, controlValue}))
      )
    }

    updateValue(val: number){
        if(!this.formControl) return;
        this.formControl.setValue(val);
        this.formControl.markAsDirty();
    }

}
@NgModule({
  declarations: [SliderFieldComponent],
  imports:[
    CommonModule,   
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule
  ],
  exports: [SliderFieldComponent],
})
export class SliderFieldModule {}