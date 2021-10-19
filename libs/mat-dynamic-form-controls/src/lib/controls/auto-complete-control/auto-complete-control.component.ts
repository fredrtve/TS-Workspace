import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormStateResolver } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { applyMixins } from 'global-utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BaseControlComponent } from '../../base-control/base-control.component';
import { ActiveStringFilterModule } from '../../directives/active-string-filter.directive';
import { FuncModule } from '../../directives/func.pipe';
import { WithLazyOptions } from '../../mixins/lazy-options.mixin';
import { AutoCompleteOptions } from './auto-complete-options.interface';
import { VALIDATION_ERROR_MESSAGES } from '../../injection-tokens.const';
import { ValidationErrorMap } from '../../interfaces';

type ViewModel<T> = AutoCompleteOptions<T> & { criteria$: T | string | null, required$: boolean };

class AutoCompleteControlBase<T> extends BaseControlComponent<T | string, AutoCompleteOptions<T>> {}
interface AutoCompleteControlBase<T> extends WithLazyOptions {}
applyMixins(AutoCompleteControlBase, [WithLazyOptions])

@Component({
  templateUrl: 'auto-complete-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteControlComponent<T> extends AutoCompleteControlBase<T>  {

    vm$: Observable<Immutable<ViewModel<T>>>
    
    constructor( 
      resolver: FormStateResolver,
      @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
    ) { 
        super(resolver, validationErrorMessages);
        this.showOptionsSubject = new BehaviorSubject(false);
    }

    onControlInit(): void {
      const {lazyOptions$, options$, ...rest} = this.viewOptionSelectors;
      const lazy$ = lazyOptions$ === undefined ? undefined : this.resolve$(lazyOptions$);
      this.vm$ = combineLatest([
        this.resolveLazyOptions$(this.control!, this.resolve$(options$), lazy$),
        this.resolveSlice$({...rest, required$: this.requiredSelector }),
        this.control!.valueChanges.pipe(startWith(this.control!.value))
      ]).pipe(
        map(([ options$, rest, criteria$ ]) => <Immutable<ViewModel<T>>> {options$, criteria$, ...rest})
      )
    }
    
}
@NgModule({
    declarations: [AutoCompleteControlComponent],
    imports:[
      CommonModule,       
      ReactiveFormsModule,
      ScrollingModule,
      MatFormFieldModule,
      MatInputModule,  
      MatIconModule,
      MatButtonModule,
      MatAutocompleteModule,
      FuncModule,
      ActiveStringFilterModule
    ]
  })
  class AutoCompleteControlModule {}