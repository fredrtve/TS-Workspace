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
import { map, startWith, tap } from 'rxjs/operators';
import { BaseFieldComponent } from '../../base-control/base-field.component';
import { FuncModule } from '../../directives/func.pipe';
import { _filterOptions } from '../../helpers/filter-options.helper';
import { VALIDATION_ERROR_MESSAGES } from '../../injection-tokens.const';
import { ValidationErrorMap } from '../../interfaces';
import { WithLazyOptions } from '../../mixins/lazy-options.mixin';
import { AutoCompleteOptions } from './auto-complete-options.interface';

type ViewModel<T> = AutoCompleteOptions<T> & { required$: boolean };

class AutoCompleteControlBase<T> extends BaseFieldComponent<T | string, AutoCompleteOptions<T>> {}
interface AutoCompleteControlBase<T> extends WithLazyOptions {}
applyMixins(AutoCompleteControlBase, [WithLazyOptions])

@Component({
  templateUrl: 'auto-complete-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteFieldComponent<T> extends AutoCompleteControlBase<T>  {

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
        this.resolveLazyOptions$(this.formControl!, this.resolve$(options$), lazy$),
        this.resolveSlice$<Partial<ViewModel<T | string>>>({...rest, required$: this.requiredSelector }),
        this.formControl!.valueChanges.pipe(startWith(this.formControl!.value)),
      ]).pipe(
        map(([options$, rest, criteria$]) => <Immutable<ViewModel<T>>> {
          ...rest,
          options$: (options$ && typeof criteria$ === "string") 
            ? _filterOptions(options$, rest.filterConfig$!, criteria$) : options$
        }),
      )
    }

    resetValue():void {
      this.formControl.setValue(''); 
      this.formControl.markAsDirty()
    }
    
}
@NgModule({
    declarations: [AutoCompleteFieldComponent],
    imports:[
      CommonModule,       
      ReactiveFormsModule,
      ScrollingModule,
      MatFormFieldModule,
      MatInputModule,  
      MatIconModule,
      MatButtonModule,
      MatAutocompleteModule,
      FuncModule
    ]
  })
  class AutoCompleteControlModule {}