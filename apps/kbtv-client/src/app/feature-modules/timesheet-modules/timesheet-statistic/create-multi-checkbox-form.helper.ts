import { CheckboxFieldComponent } from 'mat-dynamic-form-controls';
import { DynamicForm, DynamicFormBuilder, _createControlField } from 'dynamic-forms';
import { Immutable, Prop, UnknownState } from 'global-types';

export interface MultiCheckboxForm<TState> { selections: Record<Prop<TState>, boolean> }

export interface KeyOptions<TState = UnknownState> { key: Prop<TState>, text: string }


export function _createMultiCheckboxForm<TState extends object = object>(
    keys: KeyOptions<TState>[], 
    baseForm?: Partial<Omit<DynamicForm<MultiCheckboxForm<TState>, never>, "controls">>
): Immutable<DynamicForm<MultiCheckboxForm<TState>, never>> {

    let controls: Record<string, object> =  { }


    for(const keyOptions of keys){
        controls[keyOptions.key] = _createControlField({
            viewComponent:  CheckboxFieldComponent,
            viewOptions: {   
                width$: "45%",
                text$: keyOptions.text || keyOptions.key, 
            }, 
        });
    }
    
    const builder = new DynamicFormBuilder<MultiCheckboxForm<TState>>();

    return <Immutable<DynamicForm<MultiCheckboxForm<TState>, never>>> builder.form({
        controls: {
            selections: {
                controls: <any> controls,
                viewOptions: { label$: "Velg kolonner", },
                controlClass$: "multi-checkbox-group",
            } 
        },    
        overrides:{},
        ...(baseForm || {}),
    });
}