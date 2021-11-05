import { Validators } from '@angular/forms';
import { Activity, Employer, Mission } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { _missionFormToSaveModelConverter } from '@shared-mission/forms/mission-form-to-save-model.converter';
import { GoogleAddressControl, PhoneNumberControl } from '@shared/constants/common-controls.const';
import { DynamicFormBuilder, _createControlField } from 'dynamic-forms';
import { Immutable, Maybe } from 'global-types';
import { AutoCompleteFieldComponent, CheckboxFieldComponent, ChipsAutocompleteFieldComponent, TextAreaFieldComponent } from 'mat-dynamic-form-controls';
import { Converter, ModelFormConfig } from 'model/form';

export interface MissionForm extends Pick<Mission, "address" | "phoneNumber" | "description" | "id" | "finished"> {
    employerInput: Maybe<string | Employer>, 
    missionActivitiesInput?: (Maybe<Activity> | string)[];
}

const DescriptionControl = _createControlField({ 
    viewComponent: TextAreaFieldComponent,
    viewOptions: { placeholder$: "Beskrivelse", rows$: 1 }, 
    validators$: [Validators.maxLength(ValidationRules.MissionDescriptionMaxLength)] 
});

const EmployerControl = _createControlField<AutoCompleteFieldComponent<Employer>>({ 
    viewComponent: AutoCompleteFieldComponent,
    viewOptions: {
        options$: [],
        placeholder$: "Oppdragsgiver",
        hint$: "Lag ny eller velg eksisterende oppdragsgiver",
        resetable$: true, 
        lazyOptions$: "all",
        displayWith$: (val) => typeof val === "string" ? val : val?.name || "",
        filterConfig$: { 
            criteriaFormatter: (s) => s?.toLowerCase(), 
            filter: (e, s) => e.name.toLowerCase().indexOf(s) !== -1 
        },
    },  
});

const FinishedControl = _createControlField({ 
    viewComponent: CheckboxFieldComponent,
    viewOptions: { text$: "Er oppdraget ferdig?" }, 
});

const ActivitiesControl = _createControlField<ChipsAutocompleteFieldComponent<Activity>>({ 
    viewComponent: ChipsAutocompleteFieldComponent,
    viewOptions: {
        options$: [],
        placeholder$: "Aktiviteter",
        hint$: "Lag nye eller velg eksisterende aktiviteter",
        lazyOptions$: "all",
        displayWith$: (val) => typeof val === "string" ? val : val?.name || "",
        filterConfig$: { 
            criteriaFormatter: (s) => s?.toLowerCase(), 
            filter: (e, s) => e.name.toLowerCase().indexOf(s) !== -1 
        },
    }, 
});

const _missionToMissionFormConverter: Converter<Mission, MissionForm> = ({employer, missionActivities, ...rest}) => { 
    return {...rest, 
        employerInput: employer?.name, 
        missionActivitiesInput: missionActivities?.map(x => x.activity)
    }
}
const builder = new DynamicFormBuilder<MissionForm, ModelState>();

export const MissionModelForm: Immutable<ModelFormConfig<ModelState, Mission, MissionForm>> = {
    stateProp: "missions",
    includes: (x) => x.include("employer").include("missionActivities", x => x.include("activity")),
    actionConverter: _missionFormToSaveModelConverter,
    modelConverter: _missionToMissionFormConverter,
    dynamicForm: builder.group()({
        viewOptions:{}, viewComponent: null,
        controls: {
            address: GoogleAddressControl,
            phoneNumber: PhoneNumberControl,
            description: DescriptionControl,
            employerInput: EmployerControl,  
            missionActivitiesInput: ActivitiesControl,
            finished: FinishedControl,
            id: { viewOptions: {} }
        },
        overrides: {
            address: { required$: true, },
            finished: { controlClass$: builder.bindForm("id", (id) => id == null ? 'display-none' : '', true)},
            employerInput: { viewOptions: { options$: builder.bindState("employers") } },
            missionActivitiesInput: { viewOptions: { 
                options$: builder.bindState("activities"), 
                removeableChips$: builder.bindForm("id", (id) => id == null ? true : false)
            } },
            phoneNumber: {  }
        }
    })
}