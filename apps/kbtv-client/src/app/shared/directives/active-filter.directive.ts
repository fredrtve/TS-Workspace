import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { debounceAfterFirst } from '@shared/operators/debounce-after-first.operator';
import { _filter } from 'array-helpers';
import { Immutable, ImmutableArray } from 'global-types';
import { BehaviorSubject, combineLatest, merge, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ActiveStringFilterConfig } from '../interfaces/active-string-filter-config.interface';

@Directive({
  selector: '[appActiveStringFilter]'
})
export class ActiveStringFilterDirective<TRecord> {

    private optionsSubject = new BehaviorSubject<ImmutableArray<TRecord>>([]);

    @Input('appActiveStringFilterOptions') set options(value: ImmutableArray<TRecord>){
        if(value === this.optionsSubject.value) return;
        this.optionsSubject.next(value)
    }

    private _config: ActiveStringFilterConfig<TRecord>;
    @Input('appActiveStringFilterConfig') set config(value: ActiveStringFilterConfig<TRecord>){
        if(value === this._config) return;
        this._config = value;
        this.initalizeObserver();
    }

    private viewRef: EmbeddedViewRef<{$implicit: unknown}>;

    private searchLower: string;

    private checkCount: number = 0;

    constructor(    
        _viewContainer: ViewContainerRef,
        _template: TemplateRef<{$implicit: unknown}>) { 
        this.viewRef = _viewContainer.createEmbeddedView(_template);
    }

    private initalizeObserver(): void {
        if(!this._config) return;

        const stringObserver$ = merge(
            of(this._config.initialString),
            this._config.stringChanges$
        )
        this.viewRef.context.$implicit = combineLatest([
            stringObserver$,
            this.optionsSubject.asObservable()
        ]).pipe(
            filter(([criteria]) => !criteria || typeof criteria === "string"), 
            debounceAfterFirst(this._config.customDebounceTime || 400),
            map(([criteria, options]) => {
                this.checkCount = 0; //reset check counter
                if(!criteria) //If no search, just take first n items
                    return this._config.maxChecks ? 
                    options?.slice(0, this._config.maxChecks) : options; 
                else {
                    this.searchLower = criteria.toLowerCase();
                    return _filter<TRecord>(options, (t) => this.filterRecord(t));
                }
        }))
    }

    private filterRecord = (record: Immutable<TRecord>): boolean => {
        if(!record) return false;
        if(this._config.maxChecks && this.checkCount >= this._config.maxChecks) return false; 
        let exp = false;
        for(var i = this._config.stringProps.length; i--;){
            const value = <string> record[this._config.stringProps[i]];
            exp = exp || value.toLowerCase().indexOf(this.searchLower) !== -1
        }
        if(exp && this._config.maxChecks) this.checkCount++;
        return exp;
    }


}
