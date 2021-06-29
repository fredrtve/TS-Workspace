import { InboundEmailPassword } from "@core/models";
import { StateEmployers, StateInboundEmailPassword, StateMissions, StateMissionTypes } from "@core/state/global-state.interfaces";
import { ModelDataTablesConfig } from 'model/data-table';
import { environment } from "src/environments/environment";

type ModelDataTableState = StateMissions & StateEmployers & StateMissionTypes & StateInboundEmailPassword
export const ModelDataTables: ModelDataTablesConfig<ModelDataTableState> = {
    baseColDef: {sortable: true, resizable: true, editable: true, lockPosition: true},
    tables: {
        missions: {selectable: true, propertyColDefs: {
            id: {editable: false}, 
            address: {}, 
            finished: {boolean: true}, 
            phoneNumber: {}, 
            missionTypeId: {}, 
            employerId: {}
        }},
        employers: {selectable: true, propertyColDefs: {
            id: {editable: false}, name: {}, phoneNumber: {}, address: {}, email: {}
        }},
        missionTypes: {selectable: true, propertyColDefs: {
            id: {editable: false}, name: {}
        }},
        inboundEmailPasswords: {selectable: true, propertyColDefs: {
            id: {editable: false}, password: {editable: false}, 
            email: {editable: false, valueGetter: (val: InboundEmailPassword) => `${val.password}@${environment.inboundEmailDomain}`}
        }},
    }
}
