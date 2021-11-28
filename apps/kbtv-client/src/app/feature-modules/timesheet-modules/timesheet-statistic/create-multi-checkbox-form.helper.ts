import { CheckboxFieldComponent } from '@fretve/mat-dynamic-form-controls';
import { ControlGroupSchema, DynamicFormBuilder, _createControlField } from '@fretve/dynamic-forms';
import { Immutable, Prop, UnknownState } from '@fretve/global-types';

export interface MultiCheckboxForm<TState> { selections: Record<Prop<TState>, boolean> }

export interface KeyOptions<TState = UnknownState> { key: Prop<TState>, text: string }


export function _createMultiCheckboxForm<TState extends object = object>(
    keys: KeyOptions<TState>[], 
    baseForm?: Partial<Omit<ControlGroupSchema<MultiCheckboxForm<TState>, {}, any,any>, "controls">>
): Immutable<ControlGroupSchema<MultiCheckboxForm<TState>, {}, any, null>> {

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

    return <Immutable<ControlGroupSchema<MultiCheckboxForm<TState>, {}, any, null>>> builder.group()({
        controls: {
            selections: {
                controls: <any> controls,
                viewOptions: { label$: "Velg kolonner", },
                controlClass$: "multi-checkbox-group",
            } 
        },  
        viewOptions:{},  
        viewComponent: null,
        overrides:{},
        ...(<any> baseForm || {}),
    });
}