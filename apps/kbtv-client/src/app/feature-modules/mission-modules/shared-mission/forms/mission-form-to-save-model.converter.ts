import { Mission, MissionActivity } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { _appFormToSaveModelConverter } from "@shared/app-form-to-save-model.converter";
import { _convertArrayToObject, _find } from "array-helpers";
import { Immutable } from "global-types";
import { ModelFormResult } from "model/form";
import { MissionForm } from "./save-mission-model-form.const";


export const _missionFormToSaveModelConverter = (input: Immutable<ModelFormResult<ModelState, Mission, MissionForm>>) => {      
    const {employerInput, missionTypeInput, missionActivitiesInput, ...rest} = input.formValue;

    let mission: Partial<Mission> = rest;

    const existingEmployer = (employerInput && typeof employerInput === "object") 
        ? employerInput 
        : _find(input.options?.employers, employerInput, "name");

    if(existingEmployer) mission.employerId = existingEmployer.id;
    else if(employerInput) mission.employer = {name: <string> employerInput};
    else mission.employerId = undefined;
    
    const existingType = (missionTypeInput && typeof missionTypeInput === "object") 
        ? missionTypeInput 
        : _find(input.options?.missionTypes, missionTypeInput, "name");

    if(existingType) mission.missionTypeId = existingType.id;
    else if(missionTypeInput) mission.missionType = {name: <string> missionTypeInput}
    else mission.missionTypeId = undefined;

    if(missionActivitiesInput){
        const missionActivities: MissionActivity[] = [];
        const activityLookup = _convertArrayToObject(input.initialValue?.missionActivities, "activityId");
        for(const activityInput of missionActivitiesInput){
            const activity = (typeof activityInput === "object")
                ? activityInput 
                : ( _find(input.options?.activities, activityInput, "name"));

            if(activity && activityLookup[activity.id!]) continue;

            if(activity) missionActivities.push({ activityId: activity.id })
            else missionActivities.push({ activity: { name: <string> activityInput } })
        }
        mission.missionActivities = missionActivities;
    }
    

    return _appFormToSaveModelConverter({...input, formValue: <Mission> mission})
}