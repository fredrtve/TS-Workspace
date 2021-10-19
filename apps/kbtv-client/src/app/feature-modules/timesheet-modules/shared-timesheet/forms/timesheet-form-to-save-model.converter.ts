import { GlobalActions } from '@core/global-actions';
import { Mission, Model, Timesheet, UserTimesheet } from '@core/models';
import { StateMissions, StateTimesheets, StateUserTimesheets } from '@core/state/global-state.interfaces';
import { TimesheetStatus } from '@shared-app/enums/timesheet-status.enum';
import { TimesheetForm, UserTimesheetForm } from '@shared-timesheet/forms/save-timesheet-model-forms.const';
import { _getTotalHours, _mergeDateAndTime } from 'date-time-helpers';
import { Immutable } from 'global-types';
import { ModelFormResult } from 'model/form';

type FormState = StateUserTimesheets & StateTimesheets & StateMissions;

export const _timesheetFormToSaveModelConverter = (input: Immutable<ModelFormResult<FormState, Timesheet, TimesheetForm>>) => {      
    const user = input.formValue.user;
    let action = _userTimesheetFormToSaveModelConverter(input);
    return {...action, stateProp: input.stateProp, entity: {...action.entity, userName: user.userName}};
}

export const _userTimesheetFormToSaveModelConverter = (input: Immutable<ModelFormResult<FormState, UserTimesheet, UserTimesheetForm>>) => {      
    const {id, missionInput, comment, dateTime} = input.formValue;
   
    var entity: Timesheet = {
        id, comment, missionId: (<Mission> missionInput)?.id,    
        status: TimesheetStatus.Open,     
        startTime: dateTime!.startTime ? _mergeDateAndTime(dateTime!.date, dateTime!.startTime).getTime() : undefined,
        endTime:  dateTime!.endTime ? _mergeDateAndTime(dateTime!.date, dateTime!.endTime).getTime() : undefined,
    }; 
    
    if(!id) entity.createdAt = new Date().getTime();

    entity.totalHours = _getTotalHours(entity.startTime || 0, entity.endTime || 0)

    return GlobalActions.saveModel<Model>({ 
        entity, 
        stateProp: input.stateProp
    })
}
