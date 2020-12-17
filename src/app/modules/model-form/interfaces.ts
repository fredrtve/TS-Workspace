import { DynamicForm } from '@dynamic-forms/interfaces';
import { OptionsFormState } from '@form-sheet/interfaces';
import { Immutable, Maybe } from '@global/interfaces';
import { SaveAction } from '@model/interfaces';
import { Prop } from '@state/interfaces';
import { StateAction } from '@state/state.action';

export type ActionConverter<TInput, TAction extends StateAction> = (input: Immutable<TInput>) => TAction;

export type FormToSaveModelConverter<TForm extends {}, TState extends {}, TAction extends StateAction> = 
    (input: ModelFormToSaveModelInput<TForm, TState>) => TAction

export interface ModelFormConfig<TState extends {}, TForm extends {}, TFormState extends OptionsFormState<Partial<TState>>>
{      
    entityId?: unknown;
    stateProp: Prop<TState>;
    dynamicForm: DynamicForm<TForm, TFormState>;
    actionConverter?: FormToSaveModelConverter<TForm, TState, StateAction>
}

export interface ModelFormToSaveModelInput<TForm extends {}, TState extends {}> {
    formValue: Immutable<TForm>,
    options?: Maybe<Immutable<Partial<TState>>>,
    stateProp: Prop<TState>,
    saveAction: SaveAction,
}

export interface ModelFormViewConfig<TModel extends {}, TState extends {}, TForm extends {}>{
    entity?: Immutable<TModel>;
    foreigns?: Immutable<Partial<TState>>;
    lockedValues?: Immutable<Partial<TForm>>; 
}