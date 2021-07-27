import { Mission } from "@core/models"
import { ModelState } from "@core/state/model-state.interface"
import { CriteriaChipOptions, _criteriaChipsFactory } from "@shared-app/helpers/chips/criteria-chips-factory.helper"
import { AppChip } from "@shared-app/interfaces/app-chip.interface"
import { translations } from "@shared-app/constants/translations.const"
import { TimesheetCriteria } from "@shared-timesheet/timesheet-filter/timesheet-criteria.interface"
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum"
import { _weakMemoizer } from "global-utils"
import { _formatDateRange, _formatShortDate } from "date-time-helpers"
import { Immutable, Maybe } from "global-types"
import { _getModelDisplayValue } from "model/core"

const TimesheetCriteriaChipOptions: {[key in keyof TimesheetCriteria]: CriteriaChipOptions<TimesheetCriteria[key]> } = {
    user: { valueFormatter: (val) => val ? (val.lastName + ', ' + val.firstName) : undefined }, 
    mission: { valueFormatter: (val) => val ? _getModelDisplayValue<ModelState, Mission>("missions", val) : undefined },
    dateRange: { valueFormatter: (val) => val ? _formatDateRange(val, _formatShortDate) : undefined }, 
    dateRangePreset: { ignored: true },
    status: { valueFormatter: (val) => val ? translations[TimesheetStatus[val]?.toLowerCase()] : undefined }, 
}

export const _timesheetCriteriaChipsFactory = _weakMemoizer(timesheetCriteriaChipsFactory);

function timesheetCriteriaChipsFactory(
    criteria: Maybe<Immutable<TimesheetCriteria>>,
    onUpdate: (val: Immutable<TimesheetCriteria>) => void
): AppChip[] {
    if(criteria == null) return [];
    return _criteriaChipsFactory<TimesheetCriteria>(
        criteria, 
        (prop) => onUpdate(resetCriteriaProp(prop, criteria)),
        TimesheetCriteriaChipOptions
    )
}

function resetCriteriaProp(prop: keyof Immutable<TimesheetCriteria>, criteria: Immutable<TimesheetCriteria>): Immutable<TimesheetCriteria> {
    const clone = {...criteria || {}};
    clone[prop] = undefined;
    if(prop === "dateRange") clone.dateRangePreset = undefined;
    return clone;
}