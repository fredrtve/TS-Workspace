import { WeekCriteriaForm, WeekCriteriaFormState } from "@shared-timesheet/forms/week-criteria-controls.const";
import { FormSheetViewConfig } from "form-sheet";
import { Immutable } from "@fretve/global-types";

export const TimesheetAdminWeekCriteriaFormSheet: Immutable<FormSheetViewConfig<WeekCriteriaForm, WeekCriteriaFormState>> =
{
  formConfig: {
    ...WeekCriteriaForm, 
    controls: { ...WeekCriteriaForm.controls, weekNr: { required$: true, viewOptions: {} }},  
  },
  navConfig: {title: "Velg filtre"},
  actionConfig: { submitText: "Bruk", onlineRequired: true }
}