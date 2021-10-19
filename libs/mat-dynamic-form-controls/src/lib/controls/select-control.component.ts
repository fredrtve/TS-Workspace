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
import { BaseControlComponent } from '../base-control/base-control.component';
import { BaseViewOptions } from '../base-control/base-view-options.interface';
import { FuncModule } from '../directives/func.pipe';
import { LazySelectOption, WithLazyOptions } from '../mixins/lazy-options.mixin';
import { VALIDATION_ERROR_MESSAGES } from '../injection-tokens.const';
import { ValidationErrorMap } from '../interfaces';

export interface SelectOptions<T> extends BaseViewOptions {
  lazyOptions$?: LazySelectOption;
  valueProp$?: Prop<T>;
  valueFormatter$?: (val: Immutable<T>) => unknown;
  compareWith$?: (o1: Immutable<T>, o2: Immutable<T>) => boolean;
  options$: Immutable<Maybe<T[]>>;
}

type ViewModel<T> = Omit<SelectOptions<T>, "lazyOptions"> & { required$?: boolean }

class SelectControlBase<T> extends BaseControlComponent<T, SelectOptions<T>> {}
interface SelectControlBase<T> extends WithLazyOptions {}
applyMixins(SelectControlBase, [WithLazyOptions])

@Component({
  template: `
    <mat-form-field *ngIf="vm$ | async; let vm" [color]="vm.color$ || 'accent'" class="w-100">
        <mat-label *ngIf="vm.label$">{{ vm.label$ }}</mat-label>
        <mat-select 
          [placeholder]="vm.placeholder$" 
          [formControl]="control" 
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
              <mat-option *ngIf="control?.value" [value]="control?.value">
                {{ (vm.valueFormatter$ | func : control?.value) || control?.value }}
              </mat-option>
              <mat-option>Laster inn...</mat-option>
            </ng-template>

        </mat-select>
        <mat-hint *ngIf="vm.hint$">{{ vm.hint$ }}</mat-hint>
        <mat-error *ngIf="control && control.dirty && control.invalid">
          {{ getValidationErrorMessage() }}
        </mat-error>

    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectControlComponent<T> extends SelectControlBase<T> {

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
      this.resolveLazyOptions$(this.control!, this.resolve$(options$), lazy$), 
      this.resolveSlice$({...rest, required$: this.requiredSelector})
    ]).pipe(
      map(([options$, rest]) => <ViewModel<T>>{options$, ...rest})
    )
  }
  
}
@NgModule({
  declarations: [SelectControlComponent],
  imports:[
    CommonModule,     
    ReactiveFormsModule,
    ScrollingModule,
    MatFormFieldModule, 
    MatSelectModule,
    FuncModule
  ]
})
class SelectControlModule {}


