import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormStateResolver } from 'dynamic-forms';
import { Immutable, Maybe, Prop } from 'global-types';
import { applyMixins } from 'global-utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFieldComponent } from '../base-control/base-field.component';
import { BaseFieldOptions } from '../base-control/base-field-options.interface';
import { FuncModule } from '../directives/func.pipe';
import { LazySelectOption, WithLazyOptions } from '../mixins/lazy-options.mixin';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface SelectOptions<T> extends BaseFieldOptions {
  lazyOptions$?: LazySelectOption;
  valueProp$?: Prop<T>;
  valueFormatter$?: (val: Immutable<T>) => unknown;
  compareWith$?: (o1: Immutable<T>, o2: Immutable<T>) => boolean;
  options$: Immutable<Maybe<T[]>>;
}

type ViewModel<T> = Omit<SelectOptions<T>, "lazyOptions"> & { required$?: boolean }

class SelectControlBase<T> extends BaseFieldComponent<T, SelectOptions<T>> {}
interface SelectControlBase<T> extends WithLazyOptions {}
applyMixins(SelectControlBase, [WithLazyOptions])

@Component({
  template: `
    <mat-form-field *ngIf="vm$ | async; let vm" [color]="vm.color$ || 'accent'" class="w-100">
        <mat-label *ngIf="vm.label$">{{ vm.label$ }}</mat-label>
        <mat-select 
          [placeholder]="vm.placeholder$" 
          [formControl]="formControl" 
          [required]="vm.required$" 
          [compareWith]="vm.compareWith$ || defaultCompareWith"
          (openedChange)="vm.options$ ? null : showOptions()">

            <ng-container *ngIf="vm.options$ else loading; let options">
              <mat-option *ngIf="!vm.required$">Ingen</mat-option>
              <mat-option *ngFor="let option of vm.options$" 
                [value]="vm.valueProp$ ? option[vm.valueProp$] : option">
                  {{ (vm.valueFormatter$ | func : option) || option }}
              </mat-option>
            </ng-container>

            <ng-template #loading>
              <mat-option *ngIf="formControl?.value" [value]="formControl?.value">
                {{ (vm.valueFormatter$ | func : formControl?.value) || formControl?.value }}
              </mat-option>
              <mat-option>Laster inn...</mat-option>
            </ng-template>

        </mat-select>
        <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>
        <mat-error *ngIf="formControl && formControl.dirty && formControl.invalid">
          {{ getValidationErrorMessage() }}
        </mat-error>

    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFieldComponent<T> extends SelectControlBase<T> {

  defaultCompareWith = (o1: unknown, o2: unknown) => o1 === o2;

  vm$: Observable<ViewModel<T>>;

  constructor(
    resolver: FormStateResolver,
    @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
  ) { 
      super(resolver, validationErrorMessages);
      this.showOptionsSubject = new BehaviorSubject(false);
  }

  onControlInit(){
    const {lazyOptions$, options$, ...rest} = this.viewOptionSelectors;
    const lazy$ = lazyOptions$ === undefined ? undefined : this.resolve$(lazyOptions$);
    this.vm$ = combineLatest([
      this.resolveLazyOptions$(this.formControl!, this.resolve$(options$), lazy$), 
      this.resolveSlice$({...rest, required$: this.requiredSelector})
    ]).pipe(
      map(([options$, rest]) => <ViewModel<T>>{options$, ...rest})
    )
  }
  
}
@NgModule({
  declarations: [SelectFieldComponent],
  imports:[
    CommonModule,     
    ReactiveFormsModule,
    ScrollingModule,
    MatFormFieldModule, 
    MatSelectModule,
    FuncModule
  ]
})
class SelectFieldModule {}


