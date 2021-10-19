
import { Immutable, Maybe } from 'global-types';
import { BaseViewOptions } from '../../base-control/base-view-options.interface';
import { ActiveStringFilterConfig } from '../../directives/active-string-filter.config';
import { LazySelectOption } from '../../mixins/lazy-options.mixin';

export interface AutoCompleteOptions<T> extends BaseViewOptions {
    resetable$?: boolean;
    displayWith$?: (value: Maybe<T>) => string;
    activeFilter$?: ActiveStringFilterConfig<T, string>;
    lazyOptions$?: LazySelectOption;
    options$: Immutable<Maybe<T[]>>;
}