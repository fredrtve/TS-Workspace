import { Mission } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { _appFormToSaveModelConverter } from "@shared/app-form-to-save-model.converter";
import { _find } from "array-helpers";
import { Immutable } from "global-types";
import { ModelFormResult } from "model/form";
import { CreateMissionForm } from "./save-mission-model-form.const";

export const _missionFormToSaveModelConverter = (input: Immutable<ModelFormResult<ModelState, Mission, CreateMissionForm>>) => {      
    const {employerName, missionTypeName, ...rest} = input.formValue;

    let mission: Partial<Mission> = rest;

    const existingEmployer = (!employerName || !input.options?.employers) ?  null :
            _find(input.options.employers, employerName, "name");

    if(existingEmployer) mission.employerId = existingEmployer.id;
    else if(employerName) mission.employer = {name: employerName};
    else mission.employerId = undefined;
    
    const existingType = (!missionTypeName || !input.options?.missionTypes) ?  null :
            _find(input.options.missionTypes, missionTypeName, "name");

    if(existingType) mission.missionTypeId = existingType.id;
    else if(missionTypeName) mission.missionType = {name: missionTypeName}
    else mission.missionTypeId = undefined;

    return _appFormToSaveModelConverter({...input, formValue: <Mission> mission})
}