import { Inject, Injectable } from "@angular/core";
import { ColDef } from "ag-grid-community";
import { ImmutableArray, Maybe, UnknownState } from "@fretve/global-types";
import { UnknownModelState, _getModelConfig } from "model/core";
import { ModelFetcherActions, StateFetchingStatus } from "model/state-fetcher";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { Store } from 'state-management';
import { MODEL_STATE_PROP_TRANSLATIONS, ModelStatePropTranslations  } from "model/shared";
import { ModelColDefFactory } from "../model-col-def.factory";

export interface ViewModel { colDefs: Maybe<ColDef[]>, rowData: ImmutableArray<unknown>, noRowsText: string }

@Injectable()
export class ModelDataTableFacade  {

    private modelPropertySubject = new BehaviorSubject<Maybe<string>>(null)

    get modelIdentifier(): Maybe<string> { 
        return this.modelPropertySubject.value ? 
        _getModelConfig<any,any>(this.modelPropertySubject.value)?.idProp : null
    }

    vm$: Observable<ViewModel> = this.modelPropertySubject.asObservable().pipe(
        distinctUntilChanged(),
        map(x => { return { prop: x, colDefs: x ? this.colDefFactory.createColDefs(x) : [] }}),
        switchMap(x => 
            combineLatest([
                this.getNoRowsText$(x.prop),
                x.prop ? this.store.selectProperty$(x.prop) : of(null)
            ]).pipe(
                map(([noRowsText, models]) => { 
                    return <ViewModel> { colDefs: x.colDefs, rowData: models || [], noRowsText }
                })
            )
        ),
    )

    constructor(
        private store: Store<UnknownModelState & StateFetchingStatus<UnknownState>>,
        private colDefFactory: ModelColDefFactory,    
        @Inject(MODEL_STATE_PROP_TRANSLATIONS) private translations: ModelStatePropTranslations
    ) { }

    updateSelectedProperty = (prop: string): void => {
        this.store.dispatch(ModelFetcherActions.fetch<any>({ props: [prop] }));
        this.modelPropertySubject.next(prop); 
    }

    private getNoRowsText$(prop: Maybe<string>): Observable<string>{
        return this.store.selectProperty$("fetchingStatus").pipe(map(fetchingStatus => {
            if(!prop) return 'Ingen data model valgt';
            if(!navigator.onLine) return "Mangler internett-tilkobling";
            const translatedProp = this.translations[prop.toLowerCase()]?.plural.toLowerCase() || 'data';
            switch((fetchingStatus || {})[prop]){
                case 'failed': return `Det oppsto en feil ved innhenting av ${translatedProp}`;
                case 'fetching': return `Laster inn ${translatedProp}...`;
                default: return `Finner ingen ${translatedProp}`;
            }
        }), distinctUntilChanged())
    }
}