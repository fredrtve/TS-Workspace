import { Validators } from '@angular/forms';
import { Employer, Mission, User } from '@core/models';
import { _compareProp } from '@shared-app/helpers/compare-with-prop.helper';
import { IonDateControlComponent } from '@shared/scam/dynamic-form-controls/ion-date-time-control.component';
import { isObjectValidator } from '@shared/validators/is-object.validator';
import { DateRange } from 'date-time-helpers';
import { DynamicFormBuilder, _createControl, _createControlGroup } from 'dynamic-forms';
import { AutoCompleteControlComponent, InputControlComponent, SelectControlComponent } from 'mat-dynamic-form-controls';
import { ValidationRules } from '../../shared-app/constants/validation-rules.const';
import { GooglePlacesAutoCompleteControlComponent } from '../scam/dynamic-form-controls/google-places-autocomplete-control.component';

export const PhoneNumberControl = _createControl({
    controlComponent: InputControlComponent,
    viewOptions: { placeholder$: "Kontaktnummer" }, 
    validators$: [
        Validators.minLength(ValidationRules.PhoneNumberMinLength), 
        Validators.maxLength(ValidationRules.PhoneNumberMaxLength)
    ] 
});

export const EmailControl = _createControl({
    controlComponent: InputControlComponent,
    viewOptions: { placeholder$: "Epost" },  
    validators$: [Validators.email] 
});

export const GoogleAddressControl = _createControl({
    controlComponent: GooglePlacesAutoCompleteControlComponent,
    viewOptions: {
        placeholder$: "Adresse", 
        hint$: "F.eks. Slottsplassen 1, 0010 Oslo",
        resetable$: true
    },  
    validators$: [Validators.maxLength(ValidationRules.AddressMaxLength)] 
});

export const NameControl = _createControl({
    controlComponent: InputControlComponent,
    viewOptions: { placeholder$: "Navn"},  
    validators$: [Validators.maxLength(ValidationRules.NameMaxLength)] 
});

export const FirstNameControl = _createControl({
    controlComponent: InputControlComponent, viewOptions: { placeholder$: "Fornavn" },
    validators$: [Validators.maxLength(ValidationRules.NameMaxLength)]
});

export const LastNameControl = _createControl({
    controlComponent: InputControlComponent, viewOptions: { placeholder$: "Etternavn" },
    validators$: [Validators.maxLength(ValidationRules.NameMaxLength)]
});

export const MissionAutoCompleteControl = _createControl<AutoCompleteControlComponent<Mission>>({
    controlComponent: AutoCompleteControlComponent,
    viewOptions: {
        options$: [],
        placeholder$: "Oppdrag",
        lazyOptions$: "all",
        displayWith$: (mission) => mission?.address || "",
        resetable$: true,
        activeFilter$: { 
            criteriaFormatter: (s) => (s !== null && typeof s === "object") ? null : s?.toLowerCase(),
            filter: (m, s) => m.address!.toLowerCase().indexOf(s) !== -1, 
            maxChecks: 50 
        },
    }, 
    validators$:[ isObjectValidator("mission") ],
});

export const EmployerSelectControl = _createControl<SelectControlComponent<Employer>>({
    controlComponent: SelectControlComponent,
    viewOptions: {
        options$: [],
        valueFormatter$: (val) => val.name,
        compareWith$: _compareProp<Employer>("id"),
        lazyOptions$: "all",
        placeholder$: "Velg oppdragsgiver"
    },  
});

export const UserSelectControl = _createControl<SelectControlComponent<User>>({
    controlComponent: SelectControlComponent,
    viewOptions: {
        options$: [],
        valueFormatter$: (val) => val.firstName + ' ' + val.lastName,
        compareWith$: _compareProp<User>("userName"),
        lazyOptions$: "all",
        placeholder$: "Velg ansatt"
    }, 
});

export const UserNameControl = _createControl({
    viewOptions: {placeholder$: "Brukernavn", autoComplete$: "new-password"}, 
    controlComponent: InputControlComponent,
    validators$: [
        Validators.pattern('^[a-zA-Z0-9_.-]*$'),
        Validators.minLength(ValidationRules.UserNameMinLength),
        Validators.maxLength(ValidationRules.UserNameMaxLength)
    ] 
});

export const NewPasswordControl = _createControl({
    controlComponent:  InputControlComponent, required$: true,
    viewOptions: { 
        placeholder$: "Nytt passord", type$: "password", hideable$: true, defaultHidden$: true,
    },
    validators$: [
        Validators.minLength(ValidationRules.UserPasswordMinLength),
        Validators.maxLength(ValidationRules.UserPasswordMaxLength)
    ] 
});

export const ConfirmPasswordControl = _createControl({
    controlComponent:  InputControlComponent, required$: true,
    viewOptions: { 
        placeholder$: "Gjenta nytt passord", type$: "password", hideable$: true, defaultHidden$: true,
    }, 
})

const grpBuilder = new DynamicFormBuilder<DateRange<string>>();
export const DateRangeControlGroup = grpBuilder.group<DateRange<string>>()({ 
    controlClass$: "date-range-control-group",
    controls: {
        start: _createControl<IonDateControlComponent>({
            controlComponent: IonDateControlComponent,
            viewOptions: {
                placeholder$: "Fra dato", 
                width$: "45%",
                ionFormat$:"YYYY-MMMM-DD",
                datePipeFormat$: "MMM d, y"             
            },  
        }),
        end: _createControl<IonDateControlComponent>({
            controlComponent: IonDateControlComponent,
            viewOptions: {
                placeholder$: "Til dato", 
                width$: "45%",
                ionFormat$:"YYYY-MMMM-DD",      
                datePipeFormat$: "MMM d, y"
            },  
        }), 
    },
    viewOptions: {  },
    overrides: {
        start: { viewOptions: { max$: grpBuilder.bindForm("end") } },
        end: { viewOptions: { min$: grpBuilder.bindForm("start") } }
    }
})