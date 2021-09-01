import { ApiUrl } from "@core/api-url.enum";
import { Timesheet, User } from "@core/models";
import { Roles } from "@core/roles.enum";
import { StateTimesheets } from "@core/state/global-state.interfaces";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { _getDateByDateParams } from "@shared-timesheet/helpers/get-date-by-date-params.helper";
import { WeekCriteria } from "@shared-timesheet/interfaces";
import { cyTag } from "cypress/support/commands";
import { _getWeekYear } from "date-time-helpers";

describe("Timesheet Admin Week List", () => {

    const thisYear = new Date().getFullYear();

    const user : User = 
        { userName: "user", firstName: "firstName", lastName: "lastName", role: Roles.Leder };

    const timesheetsThisYearDescending: Timesheet[] = [
        { id: '4', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName,
            startTime: _getDateByDateParams(thisYear, 30, 3).getTime(), 
            endTime: _getDateByDateParams(thisYear, 30, 3).getTime(),  
        },
        { id: '3', totalHours: 3, status: TimesheetStatus.Confirmed, userName: user.userName,
            startTime: _getDateByDateParams(thisYear, 10, 5).getTime(), 
            endTime: _getDateByDateParams(thisYear, 10, 5).getTime(),  
        },
        { id: '1', totalHours: 2, status: TimesheetStatus.Open, userName: user.userName,
            startTime: _getDateByDateParams(thisYear, 1, 1).getTime(), 
            endTime: _getDateByDateParams(thisYear, 1, 1).getTime(),  
        },
    ]

    const extraTimesheetLastWeek : Timesheet = { 
        id: '5', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName,
        startTime: _getDateByDateParams(thisYear, 30, 3).getTime(), 
        endTime: _getDateByDateParams(thisYear, 30, 3).getTime(),  
    }

    const timesheetOtherYear: Timesheet = { 
        id: '6', totalHours: 4, status: TimesheetStatus.Open, userName: user.userName,
        startTime: _getDateByDateParams(2020, 30, 3).getTime(), 
        endTime: _getDateByDateParams(2020, 30, 3).getTime(),  
    }

    const listItems = () => cy.getCy("timesheet-week-item");

    const login = (criteria: Partial<WeekCriteria>) => 
        cy.login("Leder", '/timeadministrering/uker;criteria=' + JSON.stringify(criteria || {}), { 
            users: [user], timesheets: [...timesheetsThisYearDescending.slice().reverse(), extraTimesheetLastWeek, timesheetOtherYear]
        });

    const assertItemStatus = (listItem: Cypress.Chainable, status: TimesheetStatus, totalHours: number) => {
        const { icon, color, hourTag } = status === TimesheetStatus.Confirmed ? 
            { icon: 'lock', color: 'accent', hourTag: "confirmed-hours" } : 
            { icon: 'lock_open', color: 'warn', hourTag: "open-hours" };

        listItem.within(() => {
            cy.getCy('confirm-button').should('have.class', color).should('contain', icon);
            cy.getCy(hourTag).should('contain', totalHours);
        })
    }

    beforeEach(() => {
        cy.intercept('GET', '**' + ApiUrl.Timesheet + '**', { statusCode: 204, delay: 100 });
        cy.intercept('GET', '**' + ApiUrl.Users + '**', { statusCode: 204, delay: 100 });
        cy.intercept('PUT', '**' + ApiUrl.Timesheet + '/Status', { statusCode: 204, delay: 100 }).as("updateStatus");
    })

    it('Should set criteria from url and display year and full name in top bar', () => { 
        login({ user, year: thisYear}); 
        cy.getCy("top-nav-title").should('contain', thisYear);
        cy.getCy("top-nav-title").should('contain', user.firstName);
        cy.getCy("top-nav-title").should('contain', user.lastName);
    })

    it('Should redirect to user list if no criteria', () => {
        login({});
        cy.url().should('contain', '/timeadministrering').should('not.contain', '/uker')
    })

    it("Should display only weeks that has timesheets this year and in descending order", () => {
        login({ user, year: thisYear});
        listItems().should('have.length', timesheetsThisYearDescending.length);
        listItems().each(($el, i) => {
            const timesheet = timesheetsThisYearDescending[i];
            cy.wrap($el).find(cyTag('week-label')).should('contain', _getWeekYear(timesheet.startTime).weekNr)
        });
    })

    it("Should display weeks with status icon & color and aggregated work hours for each status", () => {
        login({ user, year: thisYear});
        listItems().each(($el, i) => {
            const timesheet = timesheetsThisYearDescending[i];
            const totalHours = timesheet.totalHours! + (i === 0 ? extraTimesheetLastWeek.totalHours! : 0);
            assertItemStatus(cy.wrap($el), timesheet.status!, totalHours);
        });
    })

    it("Can confirm all timesheets for given week on click", () => {
        login({ user, year: thisYear});

        const lastWeekTimesheet = timesheetsThisYearDescending[0];
        const totalHours = lastWeekTimesheet?.totalHours! + extraTimesheetLastWeek.totalHours!;
        const timesheetIdsThisWeek = [lastWeekTimesheet!.id, extraTimesheetLastWeek.id];

        assertItemStatus(listItems().first(), TimesheetStatus.Open, totalHours);

        listItems().first().find(cyTag('confirm-button')).trigger('pointerdown', { button: 0, force: true });
        cy.wait('@updateStatus');

        assertItemStatus(listItems().first(), TimesheetStatus.Confirmed, totalHours);

        cy.storeState<StateTimesheets>().then(state => {
            const timesheetsThisWeek = state.timesheets?.filter(x => timesheetIdsThisWeek.indexOf(x.id) !== -1);
            timesheetsThisWeek?.forEach(timesheet => {
                expect(timesheet.status).to.equal(TimesheetStatus.Confirmed);
            });   
        });
    })

    it("List item links to employer timesheet list for given week with corresponding weekNr in url", () => {
        login({ user, year: thisYear });
        listItems().first().click();
        const weekNr = _getWeekYear(timesheetsThisYearDescending[0].startTime).weekNr;
        cy.url().should('contain', '/timer;weekNr=' + weekNr);
    })

})