import { Validators } from '@angular/forms';
import { Mission, Timesheet, User, UserTimesheet } from '@core/models';
import { StateMissions, StateTimesheets, StateUsers, StateUserTimesheets } from '@core/state/global-state.interfaces';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { _timesheetFormToSaveModelConverter, _userTimesheetFormToSaveModelConverter } from '@shared-timesheet/forms/timesheet-form-to-save-model.converter';
import { MissionAutoCompleteControl, UserSelectControl } from '@shared/constants/common-controls.const';
import { IonDateControlComponent } from '@shared/scam/dynamic-form-controls/ion-date-time-control.component';
import { TextAreaFieldComponent } from 'mat-dynamic-form-controls';
import { _getISO } from 'date-time-helpers';
import { DynamicFormBuilder, _createControlField, _createControlGroup } from 'dynamic-forms';
import { Immutable, Maybe } from 'global-types';
import { Converter, ModelFormConfig } from 'model/form';

type FormState = TimesheetFormState;
interface TimesheetDateTime { startTime: string; endTime: string; date: string; }

const userBuilder = new DynamicFormBuilder<UserTimesheetForm, StateUserTimesheets & StateMissions>();

export type TimesheetFormState = StateMissions & StateUsers;

export interface UserTimesheetForm {
    missionInput: Maybe<Mission | string>;  
    dateTime: TimesheetDateTime
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
        return {id, missionInput: mission, comment, user, dateTime: {
            startTime: startTime ? _getISO(startTime) : "", 
            endTime: endTime ? _getISO(endTime) : "",
            date: startTime ? _getISO(startTime) : ""
    }}};
    
const grpBuilder = new DynamicFormBuilder<TimesheetDateTime>()  

const DateTimeControlGroup = _createControlGroup<TimesheetDateTime>()({ 
    controlClass$: "timesheet-date-time-control-group",
    viewOptions: {},
    controls: {
        date: _createControlField<IonDateControlComponent>({ 
            viewComponent: IonDateControlComponent, required$: true,
            viewOptions: {
                placeholder$: "Dato", 
                ionFormat$:"YYYY-MMMM-DD",
                datePipeFormat$: "MMM d, y",
            }, 
        }),
        startTime: _createControlField<IonDateControlComponent>({
            viewComponent: IonDateControlComponent, required$: true,
            viewOptions: {
                placeholder$: "Starttid", 
                ionFormat$:"HH:mm",
                datePipeFormat$: "HH:mm",
                minuteValues$: [0,15,30,45],
                defaultValue$: _timeValueDefault(7)
            },
        }),
        endTime: _createControlField<IonDateControlComponent>({         
            viewComponent: IonDateControlComponent, required$: true,
            viewOptions: {
                placeholder$: "Sluttid", 
                ionFormat$:"HH:mm",
                datePipeFormat$: "HH:mm",
                minuteValues$: [0,15,30,45], 
                defaultValue$: _timeValueDefault(12)  
            }, 
        }),
    },
    overrides: {
        endTime: { 
            viewOptions: { min$: grpBuilder.bindForm("startTime", (startTime) => { 
                    const date = startTime ? new Date(new Date(startTime).getTime() + 60e4) : null;
                    return date ? _minMaxTime(date.getHours(), date.getMinutes()) : _minMaxTime(0, 15); 
            })}
        },
        startTime: { 
            viewOptions: { max$: grpBuilder.bindForm("endTime", endTime => { 
                const date = endTime ? new Date(new Date(endTime).getTime() - 60e4) : null;
                return  date ? _minMaxTime(date.getHours(), date.getMinutes()) : _minMaxTime(23, 30);
            })}
        }
    }
});

const CommentControl = _createControlField({ 
    viewComponent: TextAreaFieldComponent, required$: true,
    viewOptions: { placeholder$: "Kommentar", rows$: 3 },
    validators$: [Validators.maxLength(ValidationRules.TimesheetCommentMaxLength)], 
});

const CommonControls = { 
    missionInput: MissionAutoCompleteControl, 
    dateTime: DateTimeControlGroup, 
    comment: CommentControl,
    id: { required$: false, viewOptions: {} },
}

const CommonOptions = {
    missionInput: { required$: true, viewOptions: { options$: userBuilder.bindState("missions") } },
};

export const UserTimesheetModelForm: Immutable<ModelFormConfig<StateUserTimesheets & StateMissions, UserTimesheet, UserTimesheetForm, FormState>> = {
    includes: {prop: "userTimesheets", includes: ["mission"]},
    actionConverter: _userTimesheetFormToSaveModelConverter,
    modelConverter: _modelToForm,
    actionOptions: { getRawValue: true },
    dynamicForm: userBuilder.form({
        controls: CommonControls,
        overrides: CommonOptions
    })
}

const builder = new DynamicFormBuilder<TimesheetForm, StateTimesheets & StateMissions & StateUsers>();

export const TimesheetModelForm: Immutable<ModelFormConfig<StateTimesheets & StateMissions & StateUsers, Timesheet, TimesheetForm, FormState>> = {
    includes: {prop: "timesheets", includes: ["mission", "user"]},
    actionConverter: _timesheetFormToSaveModelConverter,
    modelConverter: _modelToForm,
    actionOptions: { getRawValue: true },
    dynamicForm: builder.form({
        controls: {
            ...CommonControls,
            user: UserSelectControl,
        },
        overrides: { 
            ...CommonOptions,
            user: { viewOptions: { options$: builder.bindState("users") } }
        }
    })
}
