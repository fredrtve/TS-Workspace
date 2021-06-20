import { Injectable } from "@angular/core";
import { Model } from "@core/models";
import { AppConfirmDialogService } from "@core/services/app-confirm-dialog.service";
import { ModelState } from '@core/state/model-state.interface';
import { AppModelStatePropTranslations } from "@shared-app/constants/model-state-prop-translations.const";
import { _confirmDeleteDialogFactory } from "@shared-app/helpers/confirm-delete-dialog.factory";
import { Prop } from "global-types";
import { ModelFormService } from 'model/form';
import { DeleteModelAction } from 'model/state-commands';
import { ComponentStore, Store } from 'state-management';
import { ComponentState } from '../interfaces/component-state.interface';
import { PropertyFormMap } from "./property-form.map";
import { UpdateSelectedPropertyAction } from './state/update-selected-property.reducer';

@Injectable()
export class DataManagerFacade  {

    properties: Prop<ModelState>[] = 
        ["missions", "employers", "missionTypes", "inboundEmailPasswords"];

    selectedProperty$ = this.componentStore.selectProperty$("selectedProperty");

    get selectedProperty() {
        return this.componentStore.state.selectedProperty;
    }

    constructor(
        private store: Store<ModelState>,
        private componentStore: ComponentStore<ComponentState>,     
        private confirmService: AppConfirmDialogService,
        private modelFormService: ModelFormService<ModelState>
    ) { }

    updateSelectedProperty = (prop: Prop<ModelState>) => 
        this.componentStore.dispatch(<UpdateSelectedPropertyAction>{ type: UpdateSelectedPropertyAction, selectedProperty: prop })
    
    createItem = (): void => {
        this.selectedProperty ? 
            this.modelFormService.open(PropertyFormMap[this.selectedProperty]) : 
            undefined
    }

    deleteItems = (ids?: string[]): void =>{ 
        if(!ids?.length) return;
        const translation = AppModelStatePropTranslations[this.selectedProperty?.toLowerCase()];
        const word = ids.length > 1 ? translation?.plural : translation?.singular;
        this.confirmService.dialog$.subscribe(x => 
            x.open(_confirmDeleteDialogFactory(`${ids.length} ${word}`, () => this._deleteItems(ids)))
        );
    }

    private _deleteItems(ids: string[]): void{
        this.store.dispatch<DeleteModelAction<ModelState, Model>>({ 
            type: DeleteModelAction, 
            stateProp: this.selectedProperty, 
            payload: {ids} 
        });
    }
}