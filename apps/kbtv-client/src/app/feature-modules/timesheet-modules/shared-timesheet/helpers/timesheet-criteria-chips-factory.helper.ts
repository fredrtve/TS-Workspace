import { modelCtx } from "@core/configurations/model/app-model-context"
import { translations } from "@shared-app/constants/translations.const"
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum"
import { CriteriaChipOptions, _criteriaChipsFactory } from "@shared-app/helpers/chips/criteria-chips-factory.helper"
import { AppChip } from "@shared-app/interfaces/app-chip.interface"
import { TimesheetCriteria } from "@shared-timesheet/timesheet-filter/timesheet-criteria.interface"
import { _formatDateRange, _formatShortDate } from "date-time-helpers"
import { Immutable, Maybe } from "global-types"
import { _weakMemoizer } from "global-utils"

const TimesheetCriteriaChipOptions: {[key in keyof TimesheetCriteria]: CriteriaChipOptions<TimesheetCriteria[key]> } = {
    user: { valueFormatter: (val) => val ? (val.lastName + ', ' + val.firstName) : undefined }, 
    mission: { valueFormatter: (val) => val ? modelCtx.getDisplayValue("missions", val) : undefined },
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