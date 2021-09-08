import { ApiUrl } from "@core/api-url.enum";
import { Mission, Timesheet, User } from "@core/models";
import { Roles } from "@core/roles.enum";
import { StateTimesheets } from "@core/state/global-state.interfaces";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { _getDateByDateParams } from "@shared-timesheet/helpers/get-date-by-date-params.helper";
import { WeekCriteria } from "@shared-timesheet/interfaces";
import { cyTag } from "cypress/support/commands";
import norwayLocale from '@angular/common/locales/nb';
import { DatePipe, registerLocaleData } from '@angular/common';

registerLocaleData(norwayLocale, 'nb-NO');

describe("Timesheet Admin List", () => {

    const datePipe = new DatePipe('nb-NO');
    const thisYear = new Date().getFullYear();
    const thisWeek = 10;

    const user : User = 
        { userName: "user", firstName: "firstName", lastName: "lastName", role: Roles.Leder };
    
    const mission : Mission = { id: '1', address : 'testaddress' }

    const timesheetsDescending: Timesheet[] = [
        { id: '4', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName, missionId: mission.id,
            comment: "test4",
            startTime: _getDateByDateParams(thisYear, thisWeek, 6).getTime() + 4e6, 
            endTime: _getDateByDateParams(thisYear, thisWeek, 6).getTime() + 6e6,  
        },
        { id: '3', totalHours: 3, status: TimesheetStatus.Confirmed, userName: user.userName, missionId: mission.id,
            comment: "test3",
            startTime: _getDateByDateParams(thisYear, thisWeek, 4).getTime() + 4e6, 
            endTime: _getDateByDateParams(thisYear, thisWeek, 4).getTime() + 12e6,  
        },
        { id: '1', totalHours: 2, status: TimesheetStatus.Open, userName: user.userName, missionId: mission.id,
            comment: "test1",
            startTime: _getDateByDateParams(thisYear, thisWeek, 2).getTime() + 5e6, 
            endTime: _getDateByDateParams(thisYear, thisWeek, 2).getTime() + 10e6,  
        },
    ]

    const timesheetOtherWeek: Timesheet = { 
        id: '6', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName,
        startTime: _getDateByDateParams(2021, thisWeek + 1, 3).getTime(), 
        endTime: _getDateByDateParams(2021, thisWeek + 1, 3).getTime(),  
    }

    const listItems = () => cy.getCy("timesheet-item");

    const login = (criteria: Partial<WeekCriteria>, weekNr: number | null) => 
        cy.login("Leder", `/timeadministrering/uker;criteria=${JSON.stringify(criteria || {})}/timer;weekNr=${weekNr}`, { 
            users: [user], missions: [mission], timesheets: [...timesheetsDescending.slice().reverse(), timesheetOtherWeek]
        });

    const assertItemStatus = (listItem: Cypress.Chainable, status: TimesheetStatus) => {
        const { icon, color } = status === TimesheetStatus.Confirmed ? 
            { icon: "lock", color: "accent" } : { icon: "lock_open", color: "warn"}
        listItem.find(cyTag('confirm-button')).should('contain', icon).invoke('attr', 'color').should('eq', color);   
    }

    const assertTimesheetStatus = (id: string, status: TimesheetStatus) => {
        cy.storeState<StateTimesheets>().then(state => {
            const timesheet = state.timesheets?.find(x => x.id === id);
            expect(timesheet).to.exist;
            expect(timesheet!.status).to.equal(status); 
        });
    }

    beforeEach(() => {
        cy.intercept('GET', '**' + ApiUrl.Timesheet + '**', { statusCode: 204, delay: 100 });
        cy.intercept('GET', '**' + ApiUrl.Users + '**', { statusCode: 204, delay: 100 });
        cy.intercept('PUT', '**' + ApiUrl.Timesheet + '/Status', { statusCode: 204, delay: 100 }).as("updateStatus");
    })

    it('Should set criteria from url and display weekNr, year and full name in top bar', () => { 
        login({ user, year: thisYear}, thisWeek); 
        cy.getCy("top-nav-title").should('contain', thisYear);
        cy.getCy("top-nav-title").should('contain', thisWeek);
        cy.getCy("top-nav-title").should('contain', user.firstName);
        cy.getCy("top-nav-title").should('contain', user.lastName);
    })

    it('Should redirect to user list if no criteria', () => {
        login({}, thisWeek);
        cy.url().should('contain', '/timeadministrering').should('not.contain', '/uker')
    })

    it('Should redirect to user list if no week number', () => {
        login({ user, year: thisYear}, null);
        cy.url().should('contain', '/timeadministrering').should('not.contain', '/uker')
    })

    it("Should display this weeks timesheets ascending with status icon and color, date time and mission address", () => {
        login({ user, year: thisYear}, thisWeek);
        listItems().should('have.length', timesheetsDescending.length);
        listItems().each(($el, i) => {
            const timesheet = timesheetsDescending[i];
            assertItemStatus(cy.wrap($el), timesheet.status!);
            cy.wrap($el).should('contain', mission.address);
            cy.wrap($el).should('contain', timesheet.comment);
            cy.wrap($el).should('contain', datePipe.transform(timesheet.startTime, "longDate"))
            cy.wrap($el).should('contain', `${datePipe.transform(timesheet.startTime, "shortTime")} - ${datePipe.transform(timesheet.endTime, "shortTime")}`)
        });
    })

    it("Can toggle timesheet status on click", () => {
        login({ user, year: thisYear}, thisWeek);

        const firstTimesheet = timesheetsDescending[0];
        assertItemStatus(listItems().first(), TimesheetStatus.Open);

        //Toggle once
        listItems().first().find(cyTag('confirm-button')).click();
        cy.wait('@updateStatus');

        assertItemStatus(listItems().first(), TimesheetStatus.Confirmed);
        assertTimesheetStatus(firstTimesheet.id!, TimesheetStatus.Confirmed);

        //Toggle twice
        listItems().first().find(cyTag('confirm-button')).click();
        cy.wait('@updateStatus');

        assertItemStatus(listItems().first(), TimesheetStatus.Open);
        assertTimesheetStatus(firstTimesheet.id!, TimesheetStatus.Open);
    })

    it("Can open edit form or details dialog on click based on status", () => {
        login({ user, year: thisYear}, thisWeek);
       
        //Click on open timesheet
        listItems().first().find(cyTag('item-content')).click({force: true});
       
        cy.url().should('contain', 'sheet=true');
        cy.get('mat-dialog-container').should('not.exist');

        cy.closeForm();

        //Click on confirmed timesheet
        listItems().eq(1).find(cyTag('item-content')).click({force: true});

        cy.url().should('not.contain', 'sheet=true');
        cy.get('mat-dialog-container').should('exist');
    })

})