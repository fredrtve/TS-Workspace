import { WeekCriteriaForm, WeekCriteriaFormState } from "@shared-timesheet/forms/week-criteria-controls.const";
import { FormSheetViewConfig } from "form-sheet";
import { Immutable } from "global-types";

export const UserTimesheetWeekCriteriaFormSheet: Immutable<FormSheetViewConfig<WeekCriteriaForm, WeekCriteriaFormState>> =
{ 
    formConfig: { 
        ...WeekCriteriaForm, 
        controls: {
            ...WeekCriteriaForm.controls, 
            user: { required$: true, viewOptions: {} } 
        } 
    },
    navConfig: {title: "Velg filtre"}, 
    actionConfig: { submitText: "Bruk" },
    fullScreen: false 
}