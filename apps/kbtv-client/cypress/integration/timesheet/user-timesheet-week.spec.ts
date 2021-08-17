import { ApiUrl } from "@core/api-url.enum";
import { UserTimesheet } from "@core/models";
import { StateUserTimesheets } from "@core/state/global-state.interfaces";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { cyTag } from "cypress/support/commands";
import { _getFirstDayOfWeek, _getWeekYear } from "date-time-helpers";
import { SaveModelAction } from "model/state-commands";

describe('User Timesheet Week', () => {

    const oneHour = 3.6e6;
    const oneDay = 24*oneHour;
    const startOfWeek = _getFirstDayOfWeek().getTime();

    const timesheetBars = () => cy.getCy('timesheet-bar');
    const assertTimesheetBar = (timesheet: UserTimesheet) => {
        const timesheetWeekDay = new Date(timesheet.startTime!).getDate();
        const colorClass = timesheet.status === TimesheetStatus.Confirmed ? 'accent' : 'warn';
        cy.getCy('day-label')
            .filter(`:contains("${timesheetWeekDay}")`)
            .parents(cyTag('day-container'))
            .find(cyTag('timesheet-bar'))
            .should('contain', timesheet.totalHours)
            .should('have.class', colorClass);
    }

    const timesheet1: UserTimesheet = { id: '1', totalHours: 2, status: TimesheetStatus.Confirmed,
        startTime: startOfWeek, 
        endTime: startOfWeek + 2*oneHour
    }
    const timesheet2: UserTimesheet = { id: '2', totalHours: 3, 
        startTime: startOfWeek + oneDay, 
        endTime: startOfWeek + oneDay + 3*oneHour
    }
    const timesheet3: UserTimesheet = { id: '3', totalHours: 4, 
        startTime: startOfWeek - 4*oneDay, 
        endTime: startOfWeek - 4*oneDay + 4*oneHour
    }

    before(() => cy.clock(startOfWeek))

    beforeEach(() => {   
        cy.login('Leder', '/mine-timer', { userTimesheets: [timesheet1, timesheet2, timesheet3]});
    })

    it('Should display date information for current week as default', () => {   
        const title = () => cy.getCy('top-nav-title');
        const dayLabels = () => cy.getCy('day-label'); 
        //Should displays current week and year in title
        title().contains(_getWeekYear(new Date).year);
        title().contains(_getWeekYear(new Date).weekNr);

        //Should display labels with correct day of month (for mobile with 5 weekday view)
        for(let i = 0; i < 5; i++) 
            dayLabels().eq(i).should('contain', new Date(startOfWeek).getDate() + i);
       
        //Should highlight current day, which is start of week
        dayLabels().first().should('have.class', 'accent')
        
    })

    it('Should display current week timesheets correctly', () => {
        //Should display timesheets for current week
        timesheetBars().should('have.length', 2);

        //Check timesheets for this week has correct position, totalhours & color
        assertTimesheetBar(timesheet1);
        assertTimesheetBar(timesheet2);

        //Check that open timesheets open form
        timesheetBars().eq(1).click();
        cy.url().should('contain', 'sheet=true');
        cy.closeForm();

        //Check that confirmed timesheets open info dialog
        timesheetBars().eq(0).click();
        cy.getCy('timesheet-card-dialog').should('exist')
    })

    it('Can change week on desktop and get correct timesheets', () => {
        cy.viewport(1280, 875); //Force desktop to switch week (swipe neccesary for mobile)
        cy.getCy('previous-week').click(); //switch week
        timesheetBars().should('have.length', 1);
        assertTimesheetBar(timesheet3);
    })

    it('Should show new timesheet in correct place', () => {
        cy.intercept('POST', '**' + ApiUrl.Timesheet, { statusCode: 204, delay: 100 }).as('createTimesheet');
        const newTimesheet: UserTimesheet = { id: '5', totalHours: 8, 
            startTime: startOfWeek + 2*oneDay, 
            endTime: startOfWeek + 2*oneDay + 8*oneHour
        };
        cy.storeDispatch<SaveModelAction<StateUserTimesheets, UserTimesheet>>({
            type: SaveModelAction, saveAction: 0, stateProp: "userTimesheets", entity: newTimesheet
        });
        timesheetBars().should('have.length', 3);
        assertTimesheetBar(newTimesheet);
    });

})