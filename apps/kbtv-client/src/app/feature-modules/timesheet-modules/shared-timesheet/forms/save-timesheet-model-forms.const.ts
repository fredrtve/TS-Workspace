import { Validators } from '@angular/forms';
import { Mission, MissionActivity, Timesheet, User, UserTimesheet } from '@core/models';
import { StateActivities, StateMissionActivities, StateMissions, StateTimesheets, StateUsers, StateUserTimesheets } from '@core/state/global-state.interfaces';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { _timesheetFormToSaveModelConverter, _userTimesheetFormToSaveModelConverter } from '@shared-timesheet/forms/timesheet-form-to-save-model.converter';
import { MissionAutoCompleteControl, UserSelectControl } from '@shared/constants/common-controls.const';
import { IonDateControlComponent } from '@shared/scam/dynamic-form-controls/ion-date-time-control.component';
import { SelectFieldComponent, TextAreaFieldComponent } from '@fretve/mat-dynamic-form-controls';
import { _getISO } from 'date-time-helpers';
import { DynamicFormBuilder, _createControlField, _createControlGroup } from '@fretve/dynamic-forms';
import { Immutable, Maybe } from '@fretve/global-types';
import { Converter, ModelFormConfig } from 'model/form';
import{ _compareProp } from '@shared-app/helpers/compare-with-prop.helper'
import { modelCtx } from '@core/configurations/model/app-model-context';

type FormState = StateMissions & StateActivities & StateMissionActivities;
interface TimesheetDateTime { startTime: string; endTime: string; date: string; }

export type TimesheetFormState = FormState & StateTimesheets & StateUsers;
export type UserTimesheetFormState = FormState & StateUserTimesheets & StateUsers;

export interface UserTimesheetForm {
    missionInput: Maybe<Mission | string>;  
    missionActivity: Maybe<MissionActivity>;
    dateTime: TimesheetDateTime
    comment: string;
    id?: string
}
export interface TimesheetForm extends UserTimesheetForm {
    user: User;
}

const userBuilder = new DynamicFormBuilder<UserTimesheetForm, UserTimesheetFormState>();

const _timeValueDefault = (hours: number = 0, minutes: number = 0): string => 
    new Date(new Date().getFullYear(), 1, 1, hours, minutes, 0).toISOString();

const _minMaxTime = (hours: number = 0, minutes: number = 0): string => 
    new Date(Date.UTC(new Date().getFullYear(), 1, 1, hours, minutes, 0)).toISOString();

const _modelToForm: Converter<Timesheet, Partial<TimesheetForm>> = 
    ({id, missionActivity, startTime, endTime, comment, user}) => {
        return {id, missionInput: missionActivity?.mission, missionActivity, comment, user, dateTime: {
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
    viewComponent: TextAreaFieldComponent,
    viewOptions: { placeholder$: "Kommentar", rows$: 3 },
    validators$: [Validators.maxLength(ValidationRules.TimesheetCommentMaxLength)], 
});

const MissionActivitySelectControl = _createControlField<SelectFieldComponent<MissionActivity>>({
    viewComponent: SelectFieldComponent, required$: true,
    viewOptions: {
        options$: [],
        valueFormatter$: (val) => val.activity?.name,
        compareWith$: _compareProp<MissionActivity>("id"),
        placeholder$: "Velg aktivitet"
    }, 
});

const activitiesSelector = userBuilder.bind(["missionInput"], ["activities", "missionActivities"], (f,s) => { 
    if(!f.missionInput || typeof f.missionInput === "string") return [];
    return modelCtx.get("missionActivities")
        .where(x => x.missionId === (<Mission> f.missionInput).id!).include("activity").run(s);
});

const CommonControls = { 
    missionInput: MissionAutoCompleteControl, 
    missionActivity: MissionActivitySelectControl,
    dateTime: DateTimeControlGroup, 
    comment: CommentControl,
    id: { required$: false, viewOptions: {} },
}

const CommonOptions = {
    missionInput: { required$: true, viewOptions: { options$: userBuilder.bindState("missions") } },
    missionActivity: { 
        viewOptions: { options$: activitiesSelector }, 
        clearValue$: userBuilder.bindForm("missionInput", x => typeof x === "object") 
    }
};

export const UserTimesheetModelForm: Immutable<ModelFormConfig<UserTimesheetFormState, UserTimesheet, UserTimesheetForm>> = {
    stateProp: "userTimesheets",
    includes: x => x.include("missionActivity", x => x.include("activity").include("mission")),
    actionConverter: _userTimesheetFormToSaveModelConverter,
    modelConverter: _modelToForm,
    actionOptions: { getRawValue: true },
    dynamicForm: userBuilder.group()({
        viewOptions: {},
        controls: CommonControls,
        overrides: CommonOptions
    })
}

const builder = new DynamicFormBuilder<TimesheetForm, TimesheetFormState>();

export const TimesheetModelForm: Immutable<ModelFormConfig<TimesheetFormState, Timesheet, TimesheetForm>> = {
    stateProp: "timesheets",
    includes: x => x.include("user").include("missionActivity", x => x.include("activity").include("mission")),
    actionConverter: _timesheetFormToSaveModelConverter,
    modelConverter: _modelToForm,
    actionOptions: { getRawValue: true },
    dynamicForm: builder.group()({
        viewOptions: {},
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
