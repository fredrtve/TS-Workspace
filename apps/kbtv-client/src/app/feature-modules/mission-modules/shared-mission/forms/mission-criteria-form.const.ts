import { Mission } from '@core/models';
import { StateEmployers, StateMissions } from '@core/state/global-state.interfaces';
import { DateRangeControlGroup, EmployerSelectControl } from '@shared/constants/common-controls.const';
import { SyncModelDateRangeOptions } from '@shared/constants/common-form-state-setters.const';
import { MissionCriteria } from '@shared/interfaces';
import { DateRange } from 'date-time-helpers';
import { DynamicFormBuilder } from '@fretve/dynamic-forms';
import { FormSheetViewConfig } from 'form-sheet';
import { Immutable } from '@fretve/global-types';
import { AutoCompleteFieldComponent, RadioGroupFieldComponent } from '@fretve/mat-dynamic-form-controls';
import { StateSyncConfig } from 'state-sync';

export type MissionCriteriaFormState = StateMissions & StateEmployers & StateSyncConfig;

export interface MissionCriteriaForm extends Required<Omit<MissionCriteria, "searchString" | "dateRange">> { 
    searchString: Mission |  string;
    dateRange: DateRange<string>
};

const builder = new DynamicFormBuilder<MissionCriteriaForm, MissionCriteriaFormState>();

const SearchStringControl = builder.field<AutoCompleteFieldComponent<Mission>>({
    viewComponent:  AutoCompleteFieldComponent, 
    viewOptions: {
        options$: [],
        displayWith$: (val) => typeof val === "string" ? val : val?.address || "",
        lazyOptions$: "all",
        placeholder$: "Søk med adresse",
        resetable$: true,
        filterConfig$: { 
            criteriaFormatter: (s) => s?.toLowerCase(), 
            filter: (e, s) => e.address!.toLowerCase().indexOf(s) !== -1, 
            maxChecks: 50 
        },
    }, 
});

const FinishedControl = builder.field<RadioGroupFieldComponent<boolean>>({
    viewComponent:  RadioGroupFieldComponent,
    viewOptions: {   
        label$: "Velg status",
        valueFormatter$: (finished) => finished ? "Ferdig" : "Aktiv",
        options$: [false, true]
    }, 
});

const MissionCriteriaForm = builder.group()({  
    viewOptions:{}, viewComponent: null,
    controls: {
        searchString: SearchStringControl,
        employer: EmployerSelectControl,
        dateRange: DateRangeControlGroup,
        finished: FinishedControl,
    },
    overrides: { 
        employer: { viewOptions: { options$: builder.bindState("employers"), } },
        searchString: { viewOptions: { options$: builder.bindState("missions") } },
        dateRange: { overrides: SyncModelDateRangeOptions },
    }
});

export const MissionCriteriaFormSheet: Immutable<FormSheetViewConfig<MissionCriteriaForm, MissionCriteriaFormState>> = {
    formConfig: MissionCriteriaForm, 
    navConfig: { title: "Velg filtre" },
    actionConfig: { 
        submitText: "Bruk",
        resettable: true, 
        resetState: {finished: false},
    }
}