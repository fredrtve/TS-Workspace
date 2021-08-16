import { Question } from 'dynamic-forms';
import { Immutable, Prop } from 'global-types';
import { ActiveStringFilterConfig } from '@shared/interfaces';
import { LazySelectOption } from '@shared-app/helpers/should-eager-options.helper';

export interface AutoCompleteQuestionBindings<T> { options: Immutable<T[]> }

export interface AutoCompleteQuestion<T, TFormState extends object | null> extends Question<AutoCompleteQuestionBindings<T>, TFormState> {
    valueProp?: Prop<T>;
    resetable?: boolean;
    valueFormatter?: (val: T) => unknown;  
    displayWith?: (value: T) => string;
    activeFilter?: ActiveStringFilterConfig<T, string>;
    lazyOptions: LazySelectOption;
}