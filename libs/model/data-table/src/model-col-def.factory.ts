import { Inject, Injectable } from "@angular/core";
import { ColDef } from "ag-grid-community";
import { _convertArrayToObject } from "array-helpers";
import { KeyVal, UnknownState } from "global-types";
import { ForeignRelation, UnknownModelState, _getModelConfig } from "model/core";
import { MODEL_PROP_TRANSLATIONS } from "model/shared";
import { ModelCommand, ModelCommands } from "model/state-commands";
import { Store } from "state-management";
import { MODEL_DATA_TABLES_CONFIG } from "./injection-tokens.const";
import { ModelDataTable, ModelDataTablesConfig } from "./interfaces";

@Injectable({providedIn: 'any'})
export class ModelColDefFactory {

    private checkBox = {colId: 'checkbox', checkboxSelection: true, width: 42, pinned: 'left', lockPosition: true};

    constructor(
        @Inject(MODEL_DATA_TABLES_CONFIG) private tableConfigs: ModelDataTablesConfig<UnknownModelState>,
        @Inject(MODEL_PROP_TRANSLATIONS) private translations: KeyVal<string>,
        private store: Store<UnknownModelState>
    ){}

    createColDefs(stateProp: string): ColDef[]{
        const table = this.tableConfigs.tables[stateProp];
        if(!table) return [];

        const colDefs: ColDef[] = [];

        if(table.selectable) colDefs.push(this.checkBox)
        
        const modelCfg = _getModelConfig<any,any>(stateProp);

        const fkIdLookup: {[key: string]: ForeignRelation<any,any,any>} = {}
        for(const foreign in modelCfg.foreigns){
            const fkRel = modelCfg.foreigns[foreign];
            fkIdLookup[fkRel.foreignKey] = fkRel;
        }

        for(const prop in table.propertyColDefs)   
            colDefs.push(this.getColDef(prop, stateProp, table, this.tableConfigs.baseColDef, fkIdLookup))
        
        return colDefs;
    }

    private getColDef( 
        modelProp: string, 
        stateProp: string, 
        table: ModelDataTable<UnknownState>, 
        baseColDef: ColDef,
        fkIdLookup: {[key: string]: ForeignRelation<any,any,any>} ): ColDef {

        const propDef = table.propertyColDefs[modelProp]

        let def: ColDef = {
            ...baseColDef,
            field: modelProp,
            headerName: this.translations[modelProp?.toLowerCase()] || modelProp,
            valueSetter: (params) => {      
                const updatedModel =  {...params.data, [modelProp]: params.newValue};
                this.dispatchUpdateAction(updatedModel, stateProp, table)
                return true
            }
        };
        
        if(propDef.valueGetter)
            def.valueGetter = (params) => propDef.valueGetter!(<UnknownState> params.data);

        if(propDef.boolean){
            def['cellEditor'] = 'agSelectCellEditor';
            def['cellEditorParams'] = { values: ['Ja', 'Nei'] }

            def['valueGetter'] = function(params){ return params.data[modelProp] === true ? 'Ja' : 'Nei' }

            def['valueSetter'] = (params) => {
                let val = params.newValue.toLowerCase();
                const res = val === 'ja' ? true : false;
                const updatedModel = {...params.data, [modelProp]: res};
                this.dispatchUpdateAction(updatedModel, stateProp, table)
                return true;
                
            } 
        }

        if(propDef.editable !== undefined) def['editable'] = propDef.editable;
        
        const fkRel = fkIdLookup[modelProp];
        if(fkRel){
            const fkIdProp = modelProp;
            const fkModelCfg = _getModelConfig<any,any>(fkRel.stateProp);

            def['cellEditor'] = 'agSelectCellEditor';
            def['cellEditorParams'] = { 
                values: !fkModelCfg.displayFn ? [] : 
                    Object.keys(_convertArrayToObject(this.store.state[fkModelCfg.stateProp], fkModelCfg.displayFn))
            }
    
            def['valueGetter'] = (params) => { //Get name of foreign obj and display
                const fkId = params.data[fkIdProp];
                if(fkId){
                    const fkEntity = _convertArrayToObject(this.store.state[fkModelCfg.stateProp], fkModelCfg.idProp)[fkId];
                    return fkEntity ? (fkModelCfg.displayFn?.(fkEntity) || fkEntity[fkModelCfg.idProp]) : null;
                }
                else return ''
            };

            def['valueSetter'] = (params) => {
                const hit = !fkModelCfg.displayFn ? undefined : 
                    _convertArrayToObject(this.store.state[fkModelCfg.stateProp], fkModelCfg.displayFn)?.[params.newValue]
        
                if(!hit) return false;
                const updatedModel = {...params.data, [fkIdProp]: hit[fkModelCfg.idProp]};
                this.dispatchUpdateAction(updatedModel, stateProp, table)
                return true;
            }
  
        }

        return def;
    }

    private dispatchUpdateAction(entity: UnknownState, stateProp: string, table: ModelDataTable<UnknownState>): void{
        if(table.onUpdateActionConverter) 
            this.store.dispatch(table.onUpdateActionConverter(entity))
        else 
            this.store.dispatch(ModelCommands.save<any,any>({
                entity, stateProp, saveAction: ModelCommand.Update
            }))
    }
    
}