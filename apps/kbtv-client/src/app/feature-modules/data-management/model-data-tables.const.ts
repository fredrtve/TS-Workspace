import { InboundEmailPassword } from "@core/models";
import { StateEmployers, StateInboundEmailPassword, StateMissions, StateMissionTypes } from "@core/state/global-state.interfaces";
import { MissionModelForm } from "@shared-mission/forms/save-mission-model-form.const";
import { ModelDataTablesConfig } from 'model/data-table';
import { environment } from "src/environments/environment";
import { EmployerModelForm } from "./forms/employer-model-form.const";
import { MissionTypeModelForm } from "./forms/mission-type-model-form.const";

const mission = MissionModelForm.dynamicForm.controls;
const employer = EmployerModelForm.dynamicForm.controls;

type ModelDataTableState = StateMissions & StateEmployers & StateMissionTypes & StateInboundEmailPassword
export const ModelDataTables: ModelDataTablesConfig<ModelDataTableState> = {
    validationErrorClass: "warn-light",
    baseColDef: {sortable: true, resizable: true, editable: true, lockPosition: true},
    tables: {
        missions: {selectable: true, propertyColDefs: {
            id: {editable: false}, 
            address: { validators: mission.address?.validators$ }, 
            finished: {boolean: true}, 
            phoneNumber: { validators: mission.phoneNumber?.validators$ }, 
            missionTypeId: {}, 
            employerId: {}
        }},
        employers: {selectable: true, propertyColDefs: {
            id: {editable: false}, 
            name: { validators: employer.name.validators$ }, 
            phoneNumber: { validators: employer.phoneNumber!.validators$ }, 
            address: { validators: employer.address!.validators$ }, 
            email: { validators: employer.email!.validators$ }
        }},
        missionTypes: {selectable: true, propertyColDefs: {
            id: {editable: false}, 
            name: { validators: MissionTypeModelForm.dynamicForm.controls.name.validators$ }
        }},
        inboundEmailPasswords: {selectable: true, propertyColDefs: {
            id: {editable: false}, 
            password: {editable: false}, 
            email: {editable: false, valueGetter: (val: InboundEmailPassword) => `${val.password}@${environment.inboundEmailDomain}`}
        }},
    }
}
