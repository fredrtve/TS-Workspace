import { DateRange, _getISO } from "date-time-helpers";
import { DynamicFormBuilder } from "dynamic-forms";
import { StateSyncConfig } from "state-sync";

const builder = new DynamicFormBuilder<{dateRange: DateRange<string>}, StateSyncConfig>();

export const SyncModelDateRangeOptions = {
    start: { 
        viewOptions: {
            min$: builder.bindState("syncConfig", (cfg) => cfg.initialTimestamp ? _getISO(cfg.initialTimestamp) : undefined ),
            max$: builder.bindForm("dateRange.end")
        }
    },
    end: {
        viewOptions: {
            min$: builder.bind(["dateRange.start"], ["syncConfig"], (f,s) => 
                f['dateRange.start'] || (s.syncConfig?.initialTimestamp ? _getISO(s.syncConfig.initialTimestamp) : undefined))
        }
    }
}