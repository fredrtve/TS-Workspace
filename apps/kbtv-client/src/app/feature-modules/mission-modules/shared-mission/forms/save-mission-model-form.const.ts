import { Validators } from '@angular/forms';
import { Employer, Mission, MissionType } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { _missionFormToSaveModelConverter } from '@shared-mission/forms/mission-form-to-save-model.converter';
import { GoogleAddressControl, PhoneNumberControl } from '@shared/constants/common-controls.const';
import { TextAreaControlComponent, AutoCompleteControlComponent, CheckboxControlComponent } from 'mat-dynamic-form-controls';
import { DynamicFormBuilder, _createControl } from 'dynamic-forms';
import { Immutable, Maybe } from 'global-types';
import { Converter, ModelFormConfig } from 'model/form';

export interface MissionForm extends Pick<Mission, "address" | "phoneNumber" | "description" | "id" | "finished"> {
    employerInput: Maybe<string | Employer>, 
    missionTypeInput: Maybe<string | MissionType>
}

const DescriptionControl = _createControl({ 
    controlComponent: TextAreaControlComponent,
    viewOptions: { placeholder$: "Beskrivelse", rows$: 1 }, 
    validators$: [Validators.maxLength(ValidationRules.MissionDescriptionMaxLength)] 
});

const EmployerControl = _createControl<AutoCompleteControlComponent<Employer>>({ 
    controlComponent: AutoCompleteControlComponent,
    viewOptions: {
        options$: [],
        placeholder$: "Oppdragsgiver",
        hint$: "Lag ny eller velg eksisterende oppdragsgiver",
        resetable$: true, 
        lazyOptions$: "all",
        displayWith$: (val) => typeof val === "string" ? val : val?.name || "",
        activeFilter$: { 
            criteriaFormatter: (s) => s?.toLowerCase(), 
            filter: (e, s) => e.name.toLowerCase().indexOf(s) !== -1 
        },
    },  
});

const MissionTypeControl = _createControl<AutoCompleteControlComponent<MissionType>>({ 
    controlComponent: AutoCompleteControlComponent,
    viewOptions: {
        options$: [],
        placeholder$: "Oppdragstype",
        hint$: "Lag ny eller velg eksisterende oppdragstype",
        resetable$: true,
        lazyOptions$: "all",
        displayWith$: (val) => typeof val === "string" ? val : val?.name || "",
        activeFilter$: { 
            criteriaFormatter: (s) => s?.toLowerCase(),
            filter: (e, s) => e.name.toLowerCase().indexOf(s) !== -1 ,
        },
    } 
});

const FinishedControl = _createControl({ 
    controlComponent: CheckboxControlComponent,
    viewOptions: { text$: "Er oppdraget ferdig?" }, 
});

const _missionToMissionFormConverter: Converter<Mission, MissionForm> = ({missionType, employer, ...rest}) => { 
    return {...rest, employerInput: employer?.name, missionTypeInput: missionType?.name }
}
const builder = new DynamicFormBuilder<MissionForm, ModelState>();

const funnyBinder = builder.bindForm("description", (a) => (a != null && a.length != 0) ? true : false);
// const validatorBinder = builder.bindForm("description", (a) => (a != null && a.length != 0) ? [Validators.maxLength(5)] : []);
// const widthBinder = builder.bindForm("description", (a) => (a != null && a.length != 0) ? "100%" : "50%");
// const panelBinder = builder.bindForm("description", (a) => (a != null && a.length != 0) ? "m-5" : "m-1");

export const MissionModelForm: Immutable<ModelFormConfig<ModelState, Mission, MissionForm>> = {
    includes: {prop: "missions", includes: ["employer", "missionType"]},
    actionConverter: _missionFormToSaveModelConverter,
    modelConverter: _missionToMissionFormConverter,
    dynamicForm: builder.form({
        controls: {
            address: GoogleAddressControl,
            phoneNumber: PhoneNumberControl,
            description: DescriptionControl,
            employerInput: EmployerControl,
            missionTypeInput: MissionTypeControl,  
            finished: FinishedControl,
            id: { controlComponent: null, viewOptions: {} },    
        },
        overrides: {
            address: { required$: true, },
            finished: { controlClass$: builder.bindForm("id", (id) => id == null ? 'display-none' : '', true)},
            employerInput: { viewOptions: { options$: builder.bindState("employers") } },
            missionTypeInput: { viewOptions: { options$: builder.bindState("missionTypes") } },
            phoneNumber: {  }
        }
    })
}