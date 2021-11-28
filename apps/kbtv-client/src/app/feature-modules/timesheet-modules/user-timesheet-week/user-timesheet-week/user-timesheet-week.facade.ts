import { Injectable } from '@angular/core';
import { GroupByPeriod } from '@shared-app/enums/group-by-period.enum';
import { _mapObjectsToWeekdays } from '@shared-app/helpers/object/map-objects-to-weekdays.helper';
import { _getSummariesByType } from '@shared-timesheet/helpers/get-summaries-by-type.helper';
import { WeekCriteria } from '@shared-timesheet/interfaces/week-criteria.interface';
import { TimesheetFilter } from '@shared-timesheet/timesheet-filter/timesheet-filter.model';
import { filterRecords } from '@shared/operators/filter-records.operator';
import { WeekYear, _getWeekYear } from 'date-time-helpers';
import { Immutable, Maybe } from '@fretve/global-types';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentStore, Store } from 'state-management';
import { TimesheetSummary } from '../../shared-timesheet/interfaces';
import { ComponentStoreState, StoreState } from '../store-state.interface';
import { UserTimesheetWeekLocalActions } from './local-state';

@Injectable()
export class UserTimesheetWeekFacade {

    private currWeekYear: WeekYear = _getWeekYear();

    get weekCriteria(){ return this.componentStore.state.weekCriteria; } 
    weekCriteria$ = this.componentStore.selectProperty$("weekCriteria");

    weekDaySummaries$: Observable<Maybe<{ [key: number]: Immutable<TimesheetSummary> }>> = combineLatest([
        this.store.selectProperty$("userTimesheets"),
        this.componentStore.selectProperty$("timesheetCriteria")
    ]).pipe(
        filterRecords(TimesheetFilter),
        map(({records}) =>  {
            if(!records?.length) return;
            const summaries = _getSummariesByType(GroupByPeriod.Day, records);
            return _mapObjectsToWeekdays<TimesheetSummary>(summaries, "date")
        }),
    );
    
    constructor(
        private store: Store<StoreState>,
        private componentStore: ComponentStore<ComponentStoreState>,  
    ){ }
     
    previousWeek = (): void =>  
        this.componentStore.dispatch(UserTimesheetWeekLocalActions.previousWeek())
    
    nextWeek = (): void =>       
        this.componentStore.dispatch(UserTimesheetWeekLocalActions.nextWeek({ 
            currYear: this.currWeekYear.year, 
            currWeekNr: this.currWeekYear.weekNr
        }))

    updateCriteria = (weekCriteria: Partial<WeekCriteria>) => 
        this.componentStore.dispatch(UserTimesheetWeekLocalActions.setTimesheetCriteria({ weekCriteria }))
}