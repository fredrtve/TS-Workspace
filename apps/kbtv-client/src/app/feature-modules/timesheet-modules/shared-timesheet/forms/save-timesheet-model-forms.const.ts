import { Validators } from '@angular/forms';
import { Mission, Timesheet, User, UserTimesheet } from '@core/models';
import { StateMissions, StateTimesheets, StateUsers, StateUserTimesheets } from '@core/state/global-state.interfaces';
import { _timesheetFormToSaveModelConverter, _userTimesheetFormToSaveModelConverter } from '@shared-timesheet/forms/timesheet-form-to-save-model.converter';
import { MissionAutoCompleteControl, UserSelectControl } from '@shared/constants/common-controls.const';
import { IonDateQuestion, IonDateQuestionComponent } from '@shared/scam/dynamic-form-questions/ion-date-time-question.component';
import { TextAreaQuestion, TextAreaQuestionComponent } from '@shared/scam/dynamic-form-questions/text-area-question.component';
import { _getISO } from 'date-time-helpers';
import { DynamicControl, DynamicControlGroup, _formStateBinding, _formStateSetter } from 'dynamic-forms';
import { Immutable, Maybe } from 'global-types';
import { Converter, ModelFormConfig } from 'model/form';

type FormState = TimesheetFormState;
interface TimesheetDateTime { startTime: string; endTime: string; date: string; }

export type TimesheetFormState = StateMissions & StateUsers & { 
    defaultStartTime: string, defaultEndTime: string, startTimeMax: string, endTimeMin: string 
};

export interface UserTimesheetForm {
    mission: Maybe<Mission>;  
    dateTime: Partial<TimesheetDateTime>
    comment: string;
    id?: string
}
export interface TimesheetForm extends UserTimesheetForm {
    user: User;
}

const _timeValueDefault = (hours: number = 0, minutes: number = 0): string => 
    new Date(new Date().getFullYear(), 1, 1, hours, minutes, 0).toISOString();

const _minMaxTime = (hours: number = 0, minutes: number = 0): string => 
    new Date(Date.UTC(new Date().getFullYear(), 1, 1, hours, minutes, 0)).toISOString();

const _modelToForm: Converter<Timesheet, Partial<TimesheetForm>> = 
    ({id, mission, startTime, endTime, comment, user}) => {
        return {id, mission, comment, user, dateTime: {
            startTime: startTime ? _getISO(startTime) : "", 
            endTime: endTime ? _getISO(endTime) : "",
            date: startTime ? _getISO(startTime) : ""
    }}};
    
const DateTimeControlGroup: Immutable<DynamicControlGroup<TimesheetDateTime, FormState>> = { 
    panelClass: "timesheet-date-time-question-group",
    controls: {
        date: { required: true, questionComponent: IonDateQuestionComponent, 
            question: <IonDateQuestion<{dateTime?: TimesheetDateTime}>>{
                placeholder: "Dato", 
                width: "42%",
                ionFormat:"YYYY-MMMM-DD",
                datePipeFormat: "MMM d, y",
            }, 
        },
        startTime: { required: true,
            questionComponent: IonDateQuestionComponent,
            question: <IonDateQuestion<FormState>>{
                placeholder: "Starttid", 
                width: "20%",
                ionFormat:"HH:mm",
                datePipeFormat: "HH:mm",
                minuteValues: [0,15,30,45],
                stateBindings: {
                    max: _formStateBinding<FormState, string>()(["startTimeMax"], (f) => f.startTimeMax),
                    defaultValue: _formStateBinding<FormState, string>()(["defaultStartTime"], (f) => f.defaultStartTime)
                }
            },  
        },
        endTime: { required: true,          
            questionComponent: IonDateQuestionComponent, 
            question: <IonDateQuestion<FormState>>{
                placeholder: "Sluttid", 
                width: "20%",
                ionFormat:"HH:mm",
                datePipeFormat: "HH:mm",
                minuteValues: [0,15,30,45],    
                stateBindings: {
                    min: _formStateBinding<FormState, string>()(["endTimeMin"], (f) => f.endTimeMin),
                    defaultValue: _formStateBinding<FormState, string>()(["defaultEndTime"], (f) => f.defaultEndTime)
                }     
            }, 
        },
    }
}

const CommentControl: Immutable<DynamicControl<string, null, TextAreaQuestion>> = { 
    required: true, questionComponent: TextAreaQuestionComponent,
    question: { placeholder: "Kommentar", rows: 3 },
    validators: [Validators.maxLength(400)], 
}

const CommonControls = { mission: {...MissionAutoCompleteControl, required: true}, dateTime: DateTimeControlGroup, comment: CommentControl }

const CommonStateSetters = [
    _formStateSetter<UserTimesheetForm, FormState>()(["dateTime.startTime"], [], f => { 
        const date = f["dateTime.startTime"] ? new Date(new Date(f["dateTime.startTime"]).getTime() + 60e4) : null;
        return { endTimeMin: date ? _minMaxTime(date.getHours(), date.getMinutes()) : _minMaxTime(0, 15) } 
    }),
    _formStateSetter<UserTimesheetForm, FormState>()(["dateTime.endTime"], [], f => { 
        const date = f["dateTime.endTime"] ? new Date(new Date(f["dateTime.endTime"]).getTime() - 60e4) : null;
        return { startTimeMax:  date ? _minMaxTime(date.getHours(), date.getMinutes()) : _minMaxTime(23, 30) } 
    }),
    { defaultStartTime:  _timeValueDefault(7), defaultEndTime: _timeValueDefault(12) }
]

export const CreateUserTimesheetModelForm: Immutable<ModelFormConfig<StateUserTimesheets & StateMissions, UserTimesheet, UserTimesheetForm, FormState>> = {
    includes: {prop: "userTimesheets", foreigns: "all"}, 
    actionConverter: _userTimesheetFormToSaveModelConverter,
    dynamicForm: {
        submitText: "Legg til", options: { getRawValue: true },   
        controls: CommonControls,
        formStateSetters: CommonStateSetters
    }
}

export const EditUserTimesheetModelForm: Immutable<ModelFormConfig<StateUserTimesheets & StateMissions, UserTimesheet, UserTimesheetForm, FormState>> = {
    includes: {prop: "userTimesheets", foreigns: "all"},
    actionConverter: _userTimesheetFormToSaveModelConverter,
    modelConverter: _modelToForm,
    dynamicForm: {
        submitText: "Oppdater", options: { getRawValue: true }, 
        controls: {
            ...CommonControls,
            id: { required: true, questionComponent: null },
        },
        formStateSetters: CommonStateSetters
    }
}

export const EditTimesheetModelForm: Immutable<ModelFormConfig<StateTimesheets & StateMissions & StateUsers, Timesheet, TimesheetForm, FormState>> = {
    includes: {prop: "timesheets", foreigns: "all"},
    actionConverter: _timesheetFormToSaveModelConverter,
    modelConverter: _modelToForm,
    dynamicForm: {
        submitText: "Oppdater", options: { getRawValue: true }, 
        controls: {
            user: UserSelectControl,
            ...CommonControls,
            id: { required: true, questionComponent: null },
        },
        formStateSetters: CommonStateSetters
    }
}

export const CreateTimesheetModelForm: Immutable<ModelFormConfig<StateTimesheets & StateMissions & StateUsers, Timesheet, TimesheetForm, FormState>> = {
    includes: {prop: "timesheets", foreigns: "all"}, 
    actionConverter: _timesheetFormToSaveModelConverter,
    dynamicForm: {
        submitText: "Legg til", options: { getRawValue: true },   
        controls: {
            user: UserSelectControl,
            ...CommonControls
        },
        formStateSetters: CommonStateSetters
    }
}