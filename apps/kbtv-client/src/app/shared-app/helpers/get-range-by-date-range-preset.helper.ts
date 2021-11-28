import { DateRangePresets } from "../enums/date-range-presets.enum";
import { DateRange, _getLastDayOfYear, _getMonthRange, _getWeekRange, _getYearRange } from 'date-time-helpers';
import { DateInput, Immutable, Maybe } from '@fretve/global-types';

export function _getRangeByDateRangePreset(preset: Maybe<DateRangePresets>, getISO?: boolean, lowerBound?: DateInput): Maybe<Immutable<DateRange>> {
    switch (preset) {
      case DateRangePresets.CurrentWeek:
        return _getWeekRange(new Date(), getISO);
      case DateRangePresets.CurrentMonth:
        return _getMonthRange(new Date(), getISO);
      case DateRangePresets.CurrentYear:
        return _getYearRange(new Date(), getISO);
      case DateRangePresets.ShowAll:{
        const start = new Date(lowerBound || 0);   
        const end = _getLastDayOfYear(new Date());
        return {
          start: getISO ? start.toISOString() : start, 
          end: getISO ? end.toISOString() : end
        };
      }
      default: return undefined;
    }
  }