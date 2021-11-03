import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, Inject, NgModule, Optional, ViewChild } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FormStateResolver } from "dynamic-forms";
import { applyMixins } from "global-utils";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { BaseFieldComponent } from "../../base-control/base-field.component";
import { FuncModule } from "../../directives/func.pipe";
import { _filterOptions } from "../../helpers/filter-options.helper";
import { VALIDATION_ERROR_MESSAGES } from "../../injection-tokens.const";
import { ValidationErrorMap } from "../../interfaces";
import { WithLazyOptions } from "../../mixins/lazy-options.mixin";
import { AutoCompleteOptions } from "../auto-complete-field/auto-complete-options.interface";

type ViewModel<T> = ChipsAutocompleteFieldOptions<T>;

export interface ChipsAutocompleteFieldOptions<T> extends Omit<AutoCompleteOptions<T>, "resetable$"> { 
  //If set to true, chips are removeable. Default is true. 
  removeableChips$?: boolean;
  //Key codes used to trigger chipEnd event for creating new chips. Default keys are enter & comma
  separatorKeysCodes$?: number[];
}

class ChipsAutoCompleteFieldBase<T> extends BaseFieldComponent<(T | string)[], ChipsAutocompleteFieldOptions<T>> {}
interface ChipsAutoCompleteFieldBase<T> extends WithLazyOptions {}
applyMixins(ChipsAutoCompleteFieldBase, [WithLazyOptions])

@Component({    
    selector: 'lib-chips-auto-complete-field',
    templateUrl: 'chips-auto-complete-field.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsAutocompleteFieldComponent<T> extends ChipsAutoCompleteFieldBase<T> {
    @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;
    
    vm$: Observable<ViewModel<T>>

    valueControl: FormControl = new FormControl();

    selections$: Observable<(T | string)[]>;

    private defaultSeparatorKeysCodes = [ENTER, COMMA] as const;

    constructor(
        resolver: FormStateResolver,
        @Inject(VALIDATION_ERROR_MESSAGES) @Optional() validationErrorMessages?: ValidationErrorMap
    ) { 
      super(resolver, validationErrorMessages);
      this.showOptionsSubject = new BehaviorSubject(false);
    }

    onControlInit(): void {  
        this.selections$ = this.formControl!.valueChanges.pipe(startWith(this.formControl!.value));
        const {lazyOptions$, options$, ...rest} = this.viewOptionSelectors;
        const lazy$ = lazyOptions$ === undefined ? undefined : this.resolve$(lazyOptions$);
        this.vm$ = combineLatest([
          this.resolveLazyOptions$(this.formControl, this.resolve$(options$), lazy$),
          this.resolveSlice$<Partial<ViewModel<T | string>>>(rest),
          this.valueControl.valueChanges.pipe(startWith(this.valueControl!.value))
        ]).pipe(
          map(([options$, rest, criteria$]) => <ViewModel<T>> {
            ...rest,
            removeableChips$: rest.removeableChips$ == null ? true :  rest.removeableChips$,
            separatorKeysCodes$: rest.separatorKeysCodes$ || this.defaultSeparatorKeysCodes,
            options$: criteria$ != null && typeof criteria$ === "object" 
              ? options$ 
              : options$ ? _filterOptions<any, T | string>(options$, rest.filterConfig$!, criteria$) : null
          }),
        )
      }  
      
      add(event: MatChipInputEvent): void {
        const value = <T | string> (event.value || '').trim();
    
        if(value) this.pushValue(value)
        
        event.chipInput!.clear();
    
        this.valueControl.setValue(null);
      }
    
      remove(value: T | string): void {
        const index = this.formControl.value.indexOf(value);
    
        if (index >= 0) {
          let values = [...this.formControl.value];
          values.splice(index, 1);
          this.formControl.setValue(values);  
          this.formControl.markAsDirty();
        }
      }
    
      selected(event: MatAutocompleteSelectedEvent): void {
        this.pushValue(event.option.value);
        this.valueInput.nativeElement.value = '';
        this.valueControl.setValue(null);
      }

      private pushValue(value: T | string): void {
        this.formControl.setValue(this.formControl.value ? [...this.formControl.value, value] : [value]);
        this.formControl.markAsDirty();
      }

}
@NgModule({
    declarations:[       
        ChipsAutocompleteFieldComponent,
    ],
    imports: [
      CommonModule,       
      ReactiveFormsModule,
      ScrollingModule,
      MatFormFieldModule,
      MatInputModule,  
      MatIconModule,
      MatButtonModule,
      MatAutocompleteModule,
      MatChipsModule,
      FuncModule
    ]
})
class ChipsAutocompleteFieldModule {}