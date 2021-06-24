import { Timesheet, UserTimesheet } from '@core/models';
import { StateMissions, StateTimesheets, StateUserTimesheets } from '@core/state/global-state.interfaces';
import { ModelState } from '@core/state/model-state.interface';
import { TimesheetForm, UserTimesheetForm } from '@shared-timesheet/forms/save-timesheet-model-forms.const';
import { TimesheetStatus } from '@shared-app/enums/timesheet-status.enum';
import { _getTotalHours, _mergeDateAndTime } from 'date-time-helpers';
import { Immutable } from 'global-types';
import { Converter, ModelFormResult } from 'model/form';
import { ModelCommand, SaveModelAction } from 'model/state-commands';

export const _timesheetFormToSaveModelConverter: Converter<
    ModelFormResult<StateUserTimesheets & StateTimesheets & StateMissions, Timesheet, TimesheetForm>, 
    SaveModelAction<StateUserTimesheets & StateTimesheets & StateMissions, Timesheet>
> = (input) => {      
    const user = input.formValue.user;
    let action = _userTimesheetFormToSaveModelConverter(input);
    return {...action, stateProp: input.stateProp, entity: {...action.entity, userName: user.userName}};
}

export const _userTimesheetFormToSaveModelConverter: Converter<
    ModelFormResult<StateUserTimesheets & StateTimesheets & StateMissions, UserTimesheet, UserTimesheetForm>, 
    SaveModelAction<StateUserTimesheets & StateTimesheets & StateMissions, UserTimesheet>
> = (input) => {      
    const {id, mission, comment, dateTime} = input.formValue;

    var entity: Timesheet = {
        id, comment, missionId: mission?.id,    
        status: TimesheetStatus.Open,     
        startTime: dateTime!.startTime ? _mergeDateAndTime(dateTime!.date, dateTime!.startTime).getTime() : undefined,
        endTime:  dateTime!.endTime ? _mergeDateAndTime(dateTime!.date, dateTime!.endTime).getTime() : undefined,
    }; 
    
    if(input.saveAction === ModelCommand.Create)
        entity.createdAt = new Date().getTime();

    entity.totalHours = _getTotalHours(entity.startTime || 0, entity.endTime || 0)

    return <Immutable<SaveModelAction<ModelState, Timesheet>>>{ 
        type: SaveModelAction,
        entity, 
        stateProp: input.stateProp,
        saveAction: input.saveAction
    }
}
