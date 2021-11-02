import { DatePipe, registerLocaleData } from "@angular/common";
import norwayLocale from '@angular/common/locales/nb';
import { Activity, Mission, MissionActivity, UserTimesheet } from "@core/models";
import { DateRangePresets } from "@shared-app/enums/date-range-presets.enum";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { TimesheetCriteria } from "@shared-timesheet/timesheet-filter/timesheet-criteria.interface";
import { cyTag } from "cypress/support/commands";
import { _formatDateRange, _formatShortDate } from "date-time-helpers";

registerLocaleData(norwayLocale, 'nb-NO');
const datePipe = new DatePipe("nb-NO");

describe('User Timesheet List', () => {
    
    const listItems = () => cy.getCy('timesheet-list-item');
    const chips = () => cy.getCy('bar-chip');

    const login = (criteria?: TimesheetCriteria) => 
        cy.login('Leder', '/mine-timer/liste;criteria=' + JSON.stringify(criteria || {}), { 
            userTimesheets: [ timesheet1, timesheet2, timesheet3 ], missions: [ mission ], activities: [activity], missionActivities: [missionActivity]
        }); 

    const mission : Mission = { id: "1", address: "testaddress" };
    const activity : Activity = { id: '1', name: "testactivity" };
    const missionActivity : MissionActivity = { id: '1', missionId: mission.id, activityId: activity.id };

    const timesheet1: UserTimesheet = { id: '1', totalHours: 2, status: TimesheetStatus.Open,
        startTime: new Date().setMonth(1), 
        endTime: new Date().setMonth(1), 
        missionActivityId: missionActivity.id
    };
    const timesheet2: UserTimesheet = { id: '2', totalHours: 3, status: TimesheetStatus.Confirmed, 
        startTime: new Date().setMonth(2), 
        endTime: new Date().setMonth(2), 
    };
    const timesheet3: UserTimesheet = { id: '3', totalHours: 4, status: TimesheetStatus.Open,
        startTime: new Date().setMonth(3), 
        endTime: new Date().setMonth(3), 
    };

    it('should display no timesheets if no criteria specified', () => {
        login(); 
        listItems().should('have.length', 0);
    });

    it('Should set criteria from url and display removable chips for each criteria', () => { 
        const criteria : TimesheetCriteria = { 
            status: TimesheetStatus.Open, mission, activity,
            dateRangePreset: DateRangePresets.Custom, 
            dateRange: { start: new Date().setMonth(1), end: new Date().setMonth(2) },
        }  

        login(criteria); 

        listItems().should('have.length', 1);

        chips().should('have.length', 4);
        chips().should('contain', criteria.status === TimesheetStatus.Open ? 'Åpen' : 'Låst');
        chips().should('contain', mission.address);
        chips().should('contain', activity.name);
        chips().should('contain', _formatDateRange(criteria.dateRange!, _formatShortDate));

        cy.getCy('bar-chip-remove').click({ multiple: true });

        listItems().should('have.length', 0);
        chips().should('have.length', 0);
        
    })
 
    it('Filters timesheet on criteria', () => {  
        const criteria : TimesheetCriteria = { 
            status: TimesheetStatus.Open, mission, activity,
            dateRangePreset: DateRangePresets.Custom, 
            dateRange: { start: new Date().setMonth(1), end: new Date().setMonth(5) },
        } 

        login(criteria); 
        listItems().should('have.length', 1);
        chips().filter(`:contains(${mission.address!})`).find(cyTag('bar-chip-remove')).click({force: true});
        chips().filter(`:contains(${activity.name!})`).find(cyTag('bar-chip-remove')).click({force: true});
        listItems().should('have.length', 2);
        chips().filter(`:contains('Åpen')`).find(cyTag('bar-chip-remove')).click({force: true});
        listItems().should('have.length', 3);
    })

    it('Displays timesheet correctly', () => {  
        login({ dateRange: { start: new Date().setMonth(1), end: new Date().setMonth(5) } } ); 
        
        //Check that timesheets display date and are in descending order
        listItems().eq(0).should('contain', datePipe.transform(timesheet3.startTime, 'longDate'))
        listItems().eq(2).should('contain', datePipe.transform(timesheet1.startTime, 'longDate'))

        //Check that mission address displays when mission, else display no mission text
        listItems().eq(0).should('contain', 'Finner ikke oppdrag')
        listItems().eq(2).should('contain', mission.address)
        listItems().eq(2).should('contain', activity.name)

        //Check that status is displayed with a status icon 
        listItems().eq(0).find(cyTag('status-icon')).should('have.text', "lock_open");
        listItems().eq(1).find(cyTag('status-icon')).should('have.text', "lock");

        //Check that list items open card or form based on status
        listItems().eq(0).click();
        cy.url().should('contain', 'sheet=true')
        cy.closeForm();
        listItems().eq(1).click();
        cy.get('mat-dialog-container').should('exist');
    })
})
  