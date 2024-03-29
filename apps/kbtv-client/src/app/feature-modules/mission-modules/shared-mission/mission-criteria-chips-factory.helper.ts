
import { _criteriaChipsFactory } from "@shared-app/helpers/chips/criteria-chips-factory.helper";
import { AppChip } from "@shared-app/interfaces/app-chip.interface";
import { MissionCriteria } from "@shared/interfaces";
import { _weakMemoizer } from "@fretve/global-utils";
import { _formatDateRange, _formatShortDate } from "date-time-helpers";
import { Maybe, Immutable } from "@fretve/global-types";
import { modelCtx } from "@core/configurations/model/app-model-context";

export const _missionCriteriaChipsFactory = _weakMemoizer(missionCriteriaChipsFactory);

function missionCriteriaChipsFactory(
    criteria: Maybe<Immutable<MissionCriteria>>,
    onUpdate: (val: Immutable<MissionCriteria>) => void
): AppChip[] {
    if(criteria == null) return [];

    return _criteriaChipsFactory<MissionCriteria>(criteria, 
      (prop) => {
            const clone = {...criteria};
            clone[prop] = undefined;
            onUpdate(clone);
      },      
      {
        finished: { valueFormatter: (val) => val ? "Ferdig" : undefined },
        employer: { valueFormatter: (val) => val ? modelCtx.getDisplayValue("employers", val) : undefined },
        dateRange: { valueFormatter: (val) => val ? _formatDateRange(val, _formatShortDate) : undefined }, 
      },
    )
}
