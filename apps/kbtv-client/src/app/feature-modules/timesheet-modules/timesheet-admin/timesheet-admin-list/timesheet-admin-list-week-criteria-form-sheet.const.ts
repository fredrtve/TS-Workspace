import { WeekCriteriaForm, WeekCriteriaFormState } from "@shared-timesheet/forms/week-criteria-controls.const";
import { FormSheetViewConfig } from "form-sheet";
import { Immutable } from "global-types";

export const TimesheetAdminListWeekCriteriaFormSheet: Immutable<FormSheetViewConfig<WeekCriteriaForm, WeekCriteriaFormState>> =
    {
      formConfig: WeekCriteriaForm, 
      navConfig: {title: "Velg filtre"},
      actionConfig: { submitText: "Bruk", onlineRequired: true }
    }