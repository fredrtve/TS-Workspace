import { DatePipe } from "@angular/common";
import { _getFirstDayOfYear, _getISO, _getLastDayOfYear } from "date-time-helpers";
import { registerLocaleData } from '@angular/common';
import norwayLocale from '@angular/common/locales/nb';
import { TimesheetCriteria } from "@shared-timesheet/timesheet-filter/timesheet-criteria.interface";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { Mission, User } from "@core/models";
import { Roles } from "@core/roles.enum";
import { DateRangePresets } from "@shared-app/enums/date-range-presets.enum";
import { ApiUrl } from "@core/api-url.enum";
import { Maybe } from "global-types";
import { StoreState } from "src/app/feature-modules/timesheet-modules/timesheet-statistic/state/store-state";

registerLocaleData(norwayLocale, 'nb-NO');

describe('Timesheet Filter', () => {

    const datePipe = new DatePipe("nb-NO");

    const getPresetOption = (group: keyof TimesheetCriteria, text: string) => 
        cy.get(`.form-${group} mat-radio-button`).filter(`:contains("${text}")`);

    const getStatusText = (status: Maybe<TimesheetStatus>) => 
        !status ? 'Begge' : (status === TimesheetStatus.Open ? 'Åpen' : 'Låst');
        
    const getFullName = (u: User) => `${u.firstName!} ${u.lastName!}`;

    const mission : Mission = { id: '1', address: 'test' };
    const user : User = { userName: "test", firstName: "first", lastName: "last", role: Roles.Ansatt }    
    const mission2 : Mission = { id: '2', address: 'test2' };
    const user2 : User = { userName: "test2", firstName: "first2", lastName: "last2", role: Roles.Ansatt }

    const existingCriteria: TimesheetCriteria = { 
        status: TimesheetStatus.Open, mission, user, dateRangePreset: DateRangePresets.Custom,
        dateRange: { start: _getISO(new Date().setMonth(3)), end: _getISO(new Date().setMonth(5)) },
    }

    beforeEach(() => {
        cy.intercept('GET', '**' + ApiUrl.Users, { statusCode: 204, body: [user, user2] }, );
        cy.intercept('GET', '**' + ApiUrl.Timesheet + '**', { statusCode: 204, body: [] }, );

        cy.login('Leder', '/timestatistikk', { 
            timesheetStatisticTimesheetCriteria: existingCriteria, users: [user, user2], missions: [mission, mission2] 
        });  
        cy.contains('Filtre').click();
        cy.wait(200); 
    })

    it('Shows existing values & can update values', () => {  
        const { dateRange, status } = existingCriteria;

        //Check that existing values are filled in   
        cy.get('.form-user').should('contain', getFullName(user))  
        cy.get('.form-mission input').invoke('val').should('eq', mission.address);
        getPresetOption("dateRangePreset", "Velg tid").should('have.class', 'mat-radio-checked');
        cy.get('.form-start input').invoke('val').should('eq', datePipe.transform(dateRange!.start, "MMM d, y"));
        cy.get('.form-end input').invoke('val').should('eq', datePipe.transform(dateRange!.end, "MMM d, y"));
        getPresetOption("status", getStatusText(status)).should('have.class', 'mat-radio-checked');
        //Update values
        const newValues: TimesheetCriteria = { 
            status: TimesheetStatus.Confirmed, 
            user: user2, mission: mission2, 
            dateRangePreset: DateRangePresets.CurrentYear,
        }

        cy.get('.form-user').click().wait(700);
        cy.get('mat-option').filter(`:contains("${getFullName(user2)}")`).click();

        cy.get('.form-mission input').clear().type(mission2.address!).wait(500);
        cy.get(".mat-autocomplete-panel").children().first().click();

        getPresetOption("dateRangePreset", "I år").click();

        getPresetOption("status", getStatusText(newValues.status)).click();

        //Submit and check that new mission exists in state
        cy.contains('Bruk').click();
        cy.storeState<StoreState>().then(state => {
            const criteria = state.timesheetStatisticTimesheetCriteria;
            expect(criteria.user?.userName).to.equal(newValues.user?.userName);
            expect(criteria.mission?.address).to.equal(newValues.mission?.address);
            expect(criteria.dateRangePreset).to.equal(DateRangePresets.CurrentYear);
            expect(criteria.dateRange).to.not.be.undefined;
            expect((<Date> criteria.dateRange!.start).getTime()).to.equal(_getFirstDayOfYear().getTime())
            expect((<Date> criteria.dateRange!.end).getTime()).to.equal(_getLastDayOfYear().getTime())
        })
    });

    it('can reset values', () => {
        cy.contains('Nullstill').click();

        cy.get('.form-user').should('contain', 'Velg ansatt'); 
        cy.get('.form-mission input').invoke('val').should('not.be.ok');
        cy.get(`.form-dateRangePreset mat-radio-button`).should('not.have.class', 'mat-radio-checked');
        getPresetOption("status", "Begge").should('have.class', 'mat-radio-checked');
    })

});