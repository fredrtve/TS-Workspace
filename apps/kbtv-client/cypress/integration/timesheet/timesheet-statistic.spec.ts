import { DatePipe, registerLocaleData } from "@angular/common";
import norwayLocale from '@angular/common/locales/nb';
import { ApiUrl } from "@core/api-url.enum";
import { Activity, Mission, MissionActivity, Timesheet, User } from "@core/models";
import { Roles } from "@core/roles.enum";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { TimesheetSummary } from "@shared-timesheet/interfaces";
import { TimesheetCriteria } from "@shared-timesheet/timesheet-filter/timesheet-criteria.interface";
import { _getFirstDayOfMonth, _getFirstDayOfWeek, _getFirstDayOfYear, _getStartOfDayTime, _getWeekYear } from "date-time-helpers";
import { Maybe } from "@fretve/global-types";

registerLocaleData(norwayLocale, 'nb-NO');

describe('Timesheet Statistic', () => {

    const datePipe = new DatePipe("nb-NO");

    const getStatusText = (status: Maybe<TimesheetStatus>) => 
        !status ? 'Begge' : (status === TimesheetStatus.Open ? 'Åpen' : 'Låst');
        
    const getFullName = (u: User) => `${u.firstName!} ${u.lastName!}`;

    const mission : Mission = { id: '1', address: 'test' };
    const user : User = { userName: "test", firstName: "first", lastName: "last", role: Roles.Ansatt }   
    const activity : Activity = { id: '1', name: "testactivity" };
    const missionActivity : MissionActivity = { id: '1', missionId: mission.id, activityId: activity.id };

    const getAllCriteria: TimesheetCriteria = { 
        dateRange: { start: 0, end: new Date().getTime() + 1e15 },
    }

    const login = (criteria: Partial<TimesheetCriteria>, timesheets: Timesheet[]) => 
        cy.login('Leder', '/timestatistikk', { 
            timesheetStatisticTimesheetCriteria: criteria, missions: [mission], 
            timesheets, activities: [activity], missionActivities: [missionActivity]
        }); 

    const getChipWithText = (text: string) => cy.getCy('bar-chip').filter(`:contains('${text}')`);
    const colId = (prop: keyof Timesheet | keyof TimesheetSummary) => `[col-id^="${prop}"]`

    beforeEach(() => {
        cy.intercept('GET', '**' + ApiUrl.Users, { statusCode: 200, body: [user], delay: 200 }).as('getUsers');
        cy.intercept('GET', '**' + ApiUrl.Timesheet + '**', { statusCode: 200, body: [] }, ); 
    })

    it('Should display row correctly when no grouping', () => {
        const timesheet : Timesheet = { 
            id: '5', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName,
            startTime: new Date().getTime() - 5e6, 
            endTime: new Date().getTime(),  
            missionActivityId: missionActivity.id
        }

        login(getAllCriteria, [timesheet]); 
        cy.wait('@getUsers');
        getChipWithText('Ingen').click();  

        cy.get('[row-index="0"]').should('exist').within(() => {
            cy.get(colId('date')).should('contain', datePipe.transform(timesheet.startTime, "d. MMM YYYY")); 
            cy.get(colId('startTime')).should('contain', datePipe.transform(timesheet.startTime, "HH:mm"));
            cy.get(colId('endTime')).should('contain', datePipe.transform(timesheet.endTime, "HH:mm"));
            cy.get(colId('fullName')).should('contain', getFullName(user));
            cy.get(colId(<any> 'mission')).should('contain', mission.address);
            cy.get(colId(<any> 'missionActivity')).should('contain', activity.name);
            cy.get(colId('status')).should('contain', getStatusText(timesheet.status));
            cy.get(colId('totalHours')).should('contain', timesheet.totalHours);
        })
    })

    it('Should display row correctly when grouped by day', () => {
        const today = _getStartOfDayTime(new Date());

        const openTimesheet: Timesheet = {  
            id: '1', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName, startTime: today 
        }

        const confirmedTimesheet: Timesheet = {  
            id: '2', totalHours: 3, status: TimesheetStatus.Confirmed, userName: user.userName, startTime: today + 6e5 
        }

        login(getAllCriteria, [openTimesheet, confirmedTimesheet]); 

        cy.wait('@getUsers');
        getChipWithText('Dag').click();
        
        cy.get('[row-index="0"]').should('exist').within(() => {
            cy.get(colId('date')).should('contain', datePipe.transform(today, "d. MMM YYYY"))   
            cy.get(colId('fullName')).should('contain', getFullName(user))
            cy.get(colId('openHours')).should('contain', openTimesheet.totalHours)
            cy.get(colId('confirmedHours')).should('contain', confirmedTimesheet.totalHours)
        }) 
    })

    it('Should display row correctly when grouped by week', () => {
        const thisWeek = _getFirstDayOfWeek(new Date()).getTime();
        const openTimesheet: Timesheet = {  
            id: '1', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName, startTime: thisWeek 
        }

        const confirmedTimesheet: Timesheet = {  
            id: '2', totalHours: 3, status: TimesheetStatus.Confirmed, userName: user.userName, startTime: thisWeek + 6e6 
        }

        login(getAllCriteria, [openTimesheet, confirmedTimesheet]);

        cy.wait('@getUsers');
        getChipWithText('Uke').click();

        const weekYear = _getWeekYear(thisWeek);

        cy.get('[row-index="0"]').should('exist').within(() => {
            cy.get(colId('year')).should('contain', weekYear.year)          
            cy.get(colId('weekNr')).should('contain', weekYear.weekNr)  
            cy.get(colId('fullName')).should('contain', getFullName(user))
            cy.get(colId('openHours')).should('contain', openTimesheet.totalHours)
            cy.get(colId('confirmedHours')).should('contain', confirmedTimesheet.totalHours)
        }) 
    })

    it('Should display row correctly when grouped by month', () => {
        const thisMonth = _getFirstDayOfMonth(new Date()).getTime();
        const openTimesheet: Timesheet = {  
            id: '1', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName, startTime: thisMonth 
        }

        const confirmedTimesheet: Timesheet = {  
            id: '2', totalHours: 3, status: TimesheetStatus.Confirmed, userName: user.userName, startTime: thisMonth + 7e8 
        }

        login(getAllCriteria, [openTimesheet, confirmedTimesheet]); 

        cy.wait('@getUsers');
        getChipWithText('Måned').click();

        cy.get('[row-index="0"]').should('exist').within(() => {
            cy.get(colId('year')).should('contain', new Date(thisMonth).getFullYear())          
            cy.get(colId('month')).should('contain', datePipe.transform(thisMonth, "MMM"))  
            cy.get(colId('fullName')).should('contain', getFullName(user))
            cy.get(colId('openHours')).should('contain', openTimesheet.totalHours)
            cy.get(colId('confirmedHours')).should('contain', confirmedTimesheet.totalHours)
        }) 
    })

    it('Should display row correctly when grouped by year', () => {
        const thisYear = _getFirstDayOfYear(new Date()).getTime();
        const openTimesheet: Timesheet = {  
            id: '1', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName, startTime: thisYear 
        }

        const confirmedTimesheet: Timesheet = {  
            id: '2', totalHours: 3, status: TimesheetStatus.Confirmed, userName: user.userName, startTime: thisYear + 7e9 
        }

        login(getAllCriteria, [openTimesheet, confirmedTimesheet]); 

        cy.wait('@getUsers');
        getChipWithText('År').click();

        cy.get('[row-index="0"]').should('exist').within(() => {
            cy.get(colId('year')).should('contain', new Date(thisYear).getFullYear())       
            cy.get(colId('fullName')).should('contain', getFullName(user))
            cy.get(colId('openHours')).should('contain', openTimesheet.totalHours)
            cy.get(colId('confirmedHours')).should('contain', confirmedTimesheet.totalHours)
        })
    })

    it('Shows total hours for all timesheets in floating bottom row', () => {
        const timesheets : Timesheet[] = [];
        let totalConfirmedHours = 0;
        let totalOpenHours = 0;
        for(let i = 1; i < 20; i++){
            const status = i % 2 ? TimesheetStatus.Open : TimesheetStatus.Confirmed;
            const totalHours = Math.random() * 10;
            timesheets.push({id: i.toString(), startTime: i * 7e9, totalHours, status})
            if(status === TimesheetStatus.Open) totalOpenHours+=totalHours;
            else totalConfirmedHours+=totalHours;
        }

        login(getAllCriteria, timesheets); 

        cy.wait('@getUsers');
        getChipWithText('Ingen').click();

        cy.get('.ag-floating-bottom').should('exist').within(() => {
            cy.get(colId('totalHours')).should('contain', Math.round((totalOpenHours + totalConfirmedHours) * 10) / 10)
        })

        getChipWithText('Dag').click();
        cy.wait(300);
        cy.get('.ag-floating-bottom').should('exist').within(() => {
            cy.get(colId('confirmedHours')).should('contain', Math.round(totalConfirmedHours * 10) / 10)
        })
    })
});