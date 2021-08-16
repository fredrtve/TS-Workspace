import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { debounceAfterFirst } from '@shared/operators/debounce-after-first.operator';
import { _filter } from 'array-helpers';
import { Immutable, ImmutableArray, Maybe } from 'global-types';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActiveStringFilterConfig } from '../interfaces/active-string-filter-config.interface';

@Directive({selector: '[appActiveStringFilter]'})
export class ActiveStringFilterDirective<TRecord, TCriteria> {

    private optionsSubject = new BehaviorSubject<ImmutableArray<TRecord>>([]);
    private criteriaSubject = new BehaviorSubject<Maybe<TCriteria>>(null);

    @Input('appActiveStringFilterOptions') set options(value: ImmutableArray<TRecord>){
        if(value === this.optionsSubject.value) return;
        this.optionsSubject.next(value)
    }

    @Input('appActiveStringFilterCriteria') set criteria(value: TCriteria){
        if(value === this.criteriaSubject.value) return;
        this.criteriaSubject.next(value)
    }

    private _config: ActiveStringFilterConfig<TRecord, TCriteria>;
    @Input('appActiveStringFilterConfig') set config(value: ActiveStringFilterConfig<TRecord, TCriteria>){
        if(value === this._config) return;
        this._config = value;
        this.initalizeObserver();
    }

    private viewRef: EmbeddedViewRef<{$implicit: unknown}>;

    private checkCount: number = 0;

    constructor(    
        _viewContainer: ViewContainerRef,
        _template: TemplateRef<{$implicit: unknown}>) { 
        this.viewRef = _viewContainer.createEmbeddedView(_template);
    }

    private initalizeObserver(): void {
        if(!this._config) return;

        this.viewRef.context.$implicit = combineLatest([
            this.criteriaSubject.asObservable(),
            this.optionsSubject.asObservable()
        ]).pipe(
            debounceAfterFirst(this._config.customDebounceTime || 400),
            map(([criteria, options]) => {
                this.checkCount = 0; //reset check counter

                if(this._config.criteriaFormatter) 
                    criteria = this._config.criteriaFormatter(criteria);

                const filter = criteria ? this._config.filter : this._config.nullFilter;

                if(!filter) 
                    return this._config.maxChecks ? options?.slice(0, this._config.maxChecks) : options; 

                return _filter<TRecord>(options, (t) => this.filterRecord(t, criteria, filter));         
        }))
    }

    private filterRecord = (
        record: Immutable<TRecord>, 
        criteria: Maybe<TCriteria>, 
        filter: (t: Immutable<TRecord>, c: Maybe<TCriteria>) => boolean
    ): boolean => {
        if(!record) return false;
        if(this._config.maxChecks && this.checkCount >= this._config.maxChecks) return false; 
        let valid = filter(record, criteria);
        if(valid && this._config.maxChecks) this.checkCount++;
        return valid;
    }


}
