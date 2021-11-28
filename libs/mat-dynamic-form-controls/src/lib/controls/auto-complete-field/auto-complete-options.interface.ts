
import { Immutable, Maybe } from '@fretve/global-types';
import { BaseFieldOptions } from '../../base-control/base-field-options.interface';
import { FilterConfig } from '../../helpers/filter.config';
import { LazySelectOption } from '../../mixins/lazy-options.mixin';

export interface AutoCompleteOptions<T> extends BaseFieldOptions {
    resetable$?: boolean;
    displayWith$?: (value: Maybe<T>) => string;
    filterConfig$: FilterConfig<T, string>;
    lazyOptions$?: LazySelectOption;
    options$: Maybe<Immutable<T[]>>;
}