import { Mission } from '@core/models';
import { StateMissions, StateUsers } from '@core/state/global-state.interfaces';
import { translations } from '@shared-app/constants/translations.const';
import { DateRangePresets } from '@shared-app/enums/date-range-presets.enum';
import { TimesheetStatus } from '@shared-app/enums/timesheet-status.enum';
import { _getISODateRange } from '@shared-app/helpers/get-iso-date-range.helper';
import { TimesheetCriteria } from '@shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { DateRangeControlGroup, MissionAutoCompleteControl, UserSelectControl } from '@shared/constants/common-controls.const';
import { SyncModelDateRangeOptions } from '@shared/constants/common-form-state-setters.const';
import { IonDateControlComponent } from '@shared/scam/dynamic-form-controls/ion-date-time-control.component';
import { RadioGroupControlComponent } from 'mat-dynamic-form-controls';
import { DateRange, _getISO, _getMonthRange } from 'date-time-helpers';
import { DynamicFormBuilder, _createControl } from 'dynamic-forms';
import { FormSheetViewConfig } from 'form-sheet';
import { Immutable, Maybe } from 'global-types';
import { Converter } from 'model/form';
import { StateSyncConfig } from 'state-sync';
import { DeepPartial } from 'ts-essentials';

export const _criteriaFormToTimesheetCriteria : Converter<UserTimesheetCriteriaForm, TimesheetCriteria> =
    ({customMonthISO, ...rest}) => {
        if(customMonthISO && rest.dateRangePreset === DateRangePresets.CustomMonth)
            rest.dateRange = _getMonthRange(customMonthISO, true);
            
        return <TimesheetCriteria> rest
    } 

export const _timesheetCriteriaToForm : Converter<TimesheetCriteria, DeepPartial<UserTimesheetCriteriaForm>> =
    ({dateRange, ...rest}) => {        
        return {
            ...rest,
            dateRange: !dateRange ? undefined : _getISODateRange(dateRange),
            customMonthISO: (dateRange && rest.dateRangePreset === DateRangePresets.CustomMonth) ? 
                _getISO(dateRange.start) : null
        }
    }

export type TimesheetCriteriaFormState = StateUsers & StateMissions;

export interface TimesheetCriteriaForm extends UserTimesheetCriteriaForm, Required<Pick<TimesheetCriteria, "user">> {};

export interface UserTimesheetCriteriaForm extends Required<Pick<TimesheetCriteria, "dateRangePreset" | "status">> {
    customMonthISO?: Maybe<string>;
    mission: Mission |  string;
    dateRange: DateRange<string>;
};

export type UserTimesheetCriteriaFormState = StateMissions & StateSyncConfig;

const DateRangePresetControl = _createControl<RadioGroupControlComponent<DateRangePresets>>({ 
    required$: true, 
    controlComponent: RadioGroupControlComponent,
    viewOptions: {   
        label$: "Velg tidsrom *",
        valueFormatter$: (val: DateRangePresets) => translations[DateRangePresets[val].toLowerCase()],
        options$: Object.keys(DateRangePresets).filter(k => !isNaN(Number(k))).map(x =>  parseInt(x))
    }, 
});

const CustomMonthControl = _createControl<IonDateControlComponent>({ 
    controlComponent:  IonDateControlComponent,        
    viewOptions: {
        placeholder$: "Velg måned", 
        width$: "50%",
        ionFormat$:"YYYY-MMMM",
        datePipeFormat$: "MMMM, y",                     
    }, 
});

const StatusControl = _createControl<RadioGroupControlComponent<TimesheetStatus>>({ 
    controlComponent:  RadioGroupControlComponent,
    viewOptions: {   
        label$: "Velg status", defaultOption$: "Begge",
        valueFormatter$: (val) => translations[TimesheetStatus[val]?.toLowerCase()],
        options$: [TimesheetStatus.Open, TimesheetStatus.Confirmed],   
    }, 
});

const userBuilder = new DynamicFormBuilder<UserTimesheetCriteriaForm, UserTimesheetCriteriaFormState>();

const CommonControls = {
    mission: {...MissionAutoCompleteControl, required$: false},
    dateRangePreset: DateRangePresetControl,
    dateRange: DateRangeControlGroup,
    customMonthISO: CustomMonthControl,
    status: StatusControl,
}

const CommonOptions = {
    mission: { viewOptions: { options$: userBuilder.bindState("missions") } },
    customMonthISO: {
        required$: userBuilder.bindForm("dateRangePreset", (preset) => preset === DateRangePresets.CustomMonth),
        controlClass$: userBuilder.bindForm("dateRangePreset", 
            (preset) => preset !== DateRangePresets.CustomMonth ? 'display-none' : '')
    },
}

const hideDateRangeOnCustom = userBuilder.bindForm("dateRangePreset", 
    (preset) => preset !== DateRangePresets.Custom ? 'display-none' : 'date-range-control-group');

const onDateRangeCustom = userBuilder.bindForm("dateRangePreset", (preset) => preset === DateRangePresets.Custom);

const UserTimesheetCriteriaForm = userBuilder.form({
    controls: CommonControls,
    overrides:{
        ...CommonOptions, 
        dateRange: { 
            controlClass$: hideDateRangeOnCustom,
            overrides: {
                start: { required$: onDateRangeCustom, viewOptions: SyncModelDateRangeOptions.start.viewOptions },     
                end: { required$: onDateRangeCustom, viewOptions: SyncModelDateRangeOptions.end.viewOptions }
            } 
        }
    }
});

export const UserTimesheetCriteriaFormSheet: Immutable<FormSheetViewConfig<UserTimesheetCriteriaForm, UserTimesheetCriteriaFormState>> = {
    formConfig: UserTimesheetCriteriaForm, 
    navConfig: { title: "Velg filtre" },
    actionConfig: { submitText: "Bruk", resettable: true }
}

const builder = new DynamicFormBuilder<TimesheetCriteriaForm, TimesheetCriteriaFormState>();
const TimesheetCriteriaForm = builder.form({
    controls: {
        user: UserSelectControl,
        ...CommonControls,
    },
    overrides:{   
        ...CommonOptions, 
        user: { viewOptions: { options$: builder.bindState("users") } },
        dateRange: {
            controlClass$: hideDateRangeOnCustom,
            overrides: {
                start: { required$: onDateRangeCustom },     
                end: { required$: onDateRangeCustom }
            }  
        }
    }
});

export const TimesheetCriteriaFormSheet: Immutable<FormSheetViewConfig<TimesheetCriteriaForm, TimesheetCriteriaFormState>> = {
    formConfig: TimesheetCriteriaForm, 
    navConfig: {title: "Velg filtre"},
    actionConfig: { submitText: "Bruk", resettable: true, onlineRequired: true, }
}
