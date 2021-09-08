import { WeekCriteria } from '@shared-timesheet/interfaces';
import { WeekToTimesheetCriteriaAdapter } from '@shared-timesheet/timesheet-filter/week-to-timesheet-criteria.adapter';
import { _getWeeksInYear, _getWeekYear } from 'date-time-helpers';
import { _createAction, _createReducers, _on, _payload } from 'state-management';
import { ComponentStoreState } from '../store-state.interface';

export const UserTimesheetWeekLocalActions = {
    setTimesheetCriteria: _createAction("Set Timesheet Criteria", _payload<{ weekCriteria: Partial<WeekCriteria> }>()),
    nextWeek: _createAction("User Timesheet Next Week", _payload<{ currYear: number, currWeekNr: number }>()),
    previousWeek: _createAction("User Timesheet Prev Week"),
}

export const UserTimesheetWeekLocalReducers = _createReducers<ComponentStoreState>(
    _on(UserTimesheetWeekLocalActions.setTimesheetCriteria, (state, action) => ({
        timesheetCriteria: new WeekToTimesheetCriteriaAdapter(action.weekCriteria),
        weekCriteria: action.weekCriteria
    })),
    _on(UserTimesheetWeekLocalActions.nextWeek, (state, action) => {
        const {currYear, currWeekNr} = action; 
        let {year, weekNr} = {...state.weekCriteria}

        if(!year) year = currYear;
        if(!weekNr) weekNr = currWeekNr;

        if((year >= currYear) && (weekNr >= currWeekNr)) return; //If already current week, ignore 
    
        if(weekNr >= _getWeeksInYear(state.weekCriteria.year)){   
            year++; //New year if week nr is over total weeks for year
            weekNr = 1; //Start of new year     
        }
        else weekNr++;
      
        return {
            timesheetCriteria: new WeekToTimesheetCriteriaAdapter({year, weekNr}),
            weekCriteria: {year, weekNr}
        }
    }),
    _on(UserTimesheetWeekLocalActions.previousWeek, (state) => {
        let {weekNr, year} = {...state.weekCriteria};

        const wy = _getWeekYear();
        if(!year) year = wy.year;
        if(!weekNr) weekNr = wy.weekNr
        
        if(weekNr <= 1) {
            year--; //Go to previous year if new week is less than 1
            weekNr = _getWeeksInYear(year); //Set to max week in previous year
        }
        else weekNr--;  

        return {
            timesheetCriteria: new WeekToTimesheetCriteriaAdapter({year, weekNr}),
            weekCriteria: {year, weekNr}
        } 
    })
)
