import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { _hasSameState } from 'global-utils';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { DeepPartial } from 'ts-essentials';
import { FormCanceledByUserEvent } from '../form-canceled-by-user-event.const';
import { FormActionsOptions } from '../interfaces';

/** Responsible for rendering a dynamic form with a {@link DynamicForm} configuration. */
@Component({
  selector: 'lib-form-sheet',
  templateUrl: './form-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSheetComponent<TForm extends object, TInputState extends object>  {
        
    @Input() inputState: Immutable<TInputState>;
    @Input() initialValue: Immutable<DeepPartial<TForm>>;

    @Input() formConfig: Immutable<DynamicForm<TForm, TInputState>>; 
    @Input() actionConfig: Immutable<FormActionsOptions<TForm>>;
    @Input() formClass: string | undefined;

    @Output() formSubmit = new EventEmitter<TForm | typeof FormCanceledByUserEvent>();

    formGroup: FormGroup = new FormGroup({});
    
    resetDisabled$: Observable<boolean>;

    constructor() { }

    ngOnInit(): void {
        if(this.actionConfig.resettable)
            this.resetDisabled$ = this.formGroup.valueChanges.pipe(
                debounceTime(50),
                startWith(true),
                map(x => _hasSameState<Partial<TForm>>(this.formGroup.value, <any> this.actionConfig.resetState || {})),
            );
    }

    onSubmit(){
        let value = this.actionConfig.getRawValue ? this.formGroup.getRawValue() : this.formGroup.value;      
        this.formGroup.markAsPristine();
        this.formSubmit.emit(value);
    }

    onCancel(){
        this.formSubmit.emit(FormCanceledByUserEvent);
    }

    onReset(){
        this.formGroup.reset(this.actionConfig.resetState || {});
        this.formGroup.markAsDirty()
    }
    
}
