
import { Immutable, Maybe } from 'global-types';
import { BaseFieldOptions } from '../../base-control/base-field-options.interface';
import { ActiveStringFilterConfig } from '../../directives/active-string-filter.config';
import { LazySelectOption } from '../../mixins/lazy-options.mixin';

export interface AutoCompleteOptions<T> extends BaseFieldOptions {
    resetable$?: boolean;
    displayWith$?: (value: Maybe<T>) => string;
    activeFilter$?: ActiveStringFilterConfig<T, string>;
    lazyOptions$?: LazySelectOption;
    options$: Immutable<Maybe<T[]>>;
}