import { Injectable } from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap } from "rxjs/operators";
import { Model } from "src/app/core/models";
import { DeleteModelStateCommand, SaveModelStateCommand } from '../core/model/interfaces';
import { ModelState } from '../core/model/model.state';
import { GetWithRelationsConfig } from '../core/model/state-helpers/get-with-relations.config';
import { Prop } from '../core/model/state.types';
import { ApiService } from '../core/services/api.service';
import { DeleteModelToStateHttpConverter } from '../core/services/model/converters/delete-model-to-state-http.converter';
import { SaveModelToStateHttpConverter } from '../core/services/model/converters/save-model-to-state-http.converter';
import { StateHttpCommandHandler } from '../core/services/state/state-http-command.handler';
import { ArrayHelperService } from '../core/services/utility/array-helper.service';
import { BaseModelStore } from '../core/state/abstracts/base-model.store';
import { DataConfig } from './interfaces/data-config.interface';
import { StoreState } from './interfaces/store-state';

@Injectable({
  providedIn: 'any',
})
export class DataManagementStore extends BaseModelStore<StoreState>  {

    properties: Prop<StoreState>[] = 
        ["missions", "employers", "missionTypes", "documentTypes", "inboundEmailPasswords"];

    selectedProperty$ = this.property$<Prop<ModelState>>("selectedProperty");

    dataConfig$ = this.selectedProperty$.pipe(
        distinctUntilChanged(), 
        filter(x => x != null), 
        switchMap(x => this.getDataConfig$(x)));

    get selectedProperty() {
        return this.getStateProperty<Prop<ModelState>>("selectedProperty")
    }

    constructor(
        apiService: ApiService,
        arrayHelperService: ArrayHelperService,   
        private stateHttpCommandHandler: StateHttpCommandHandler,
        private saveStateHttpConverter: SaveModelToStateHttpConverter<StoreState, SaveModelStateCommand<Model>>,
        private deleteStateHttpConverter: DeleteModelToStateHttpConverter<StoreState, DeleteModelStateCommand>
    ) {
        super(arrayHelperService, apiService);
    }

    updateSelectedProperty = (prop: Prop<ModelState>) => this._setStateVoid({selectedProperty: prop})

    save = (command: SaveModelStateCommand<Model>): void =>{
        command.stateProp = this.selectedProperty;
        this.stateHttpCommandHandler.dispatch(this.saveStateHttpConverter.convert(command));
    }
  
    delete = (command: DeleteModelStateCommand): void => {
        command.stateProp = this.selectedProperty;
        this.stateHttpCommandHandler.dispatch(this.deleteStateHttpConverter.convert(command));
    }

    private getDataConfig$(property: Prop<ModelState>): Observable<DataConfig>{        
        let relationCfg = new GetWithRelationsConfig(property, null, {includeAll: true});

        return combineLatest([
            this.modelProperty$(property), //Combine with modelprop to fetch from server if no neccesary
            this.stateSlice$(relationCfg.includedForeignProps as any)
        ]).pipe(map(([entities, foreigns]) => { 
            const state = {...foreigns} || {};
            state[property] = entities as any;

            return {
                data: entities,
                foreigns,
                selectedProp: property
            }
        }));
    }
}