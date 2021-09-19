import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { _shouldEagerOptions } from '@shared-app/helpers/should-eager-options.helper';
import { SharedModule } from '@shared/shared.module';
import { BaseQuestionComponent, DynamicFormStore, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'dynamic-forms';
import { ImmutableArray } from 'global-types';
import { Observable, of } from 'rxjs';
import { AutoCompleteQuestion, AutoCompleteQuestionBindings } from './auto-complete-question.interface';

@Component({
  selector: 'app-autocomplete-question',
  templateUrl: 'auto-complete-question.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteQuestionComponent<T> 
    extends BaseQuestionComponent<AutoCompleteQuestionBindings<T>, AutoCompleteQuestion<T, object | null>> {

    options$: Observable<ImmutableArray<unknown>>;
    criteria$: Observable<string>;

    private get _options$(): Observable<ImmutableArray<unknown>> {
        return this.stateBindings.options || of([])
    }

    constructor(
        formStore: DynamicFormStore,
        @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
    ) { 
        super(formStore, validationErrorMessages) 
    }

    ngOnInit(): void {
        this.criteria$ = this.control?.valueChanges || of(null);
        if(_shouldEagerOptions(this.question.lazyOptions, this.control)) 
            this.options$ = this._options$;
    }

    triggerOptions(): void{
        if(!this.options$) this.options$ = this._options$;
    }

}

@NgModule({
    declarations: [AutoCompleteQuestionComponent],
    imports:[
      SharedModule,    
      MatFormFieldModule,
      MatInputModule,
    ]
  })
  class AutoCompleteQuestionModule {}