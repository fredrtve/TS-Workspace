import { DatePipe, registerLocaleData } from '@angular/common';
import norwayLocale from '@angular/common/locales/nb';
import { Roles } from "@core/roles.enum";
import { ModelState } from '@core/state/model-state.interface';
import { _getDateByDateParams } from '@shared-timesheet/helpers/get-date-by-date-params.helper';
import { StateSyncConfig } from "state-sync";

registerLocaleData(norwayLocale, 'nb-NO');
describe('Profile Page', () => {
    
    const datePipe = new DatePipe("nb-NO");

    beforeEach(() => {
        cy.login(Roles.Leder, "/profil/synkronisering", {
            missions: [{id: '1', address: 'test'}],
            employers: [{id: '1', name: 'test'}],
        })
        cy.getCy('profile-action').contains('Konfigurasjoner').click();
    })

    it('Shows current sync config values', () => {
        cy.fixture<StateSyncConfig>('initial-state').then(({syncConfig}) => {
            cy.getCy("form-refreshTime").should('contain', syncConfig.refreshTime / 60 + " min");
            cy.getCy('form-initialMonthISO','input').invoke('val')
                .should('eq', datePipe.transform(syncConfig.initialTimestamp, "MMMM, YYYY"));
        })
    })

    it('Can update refresh time', () => {
        cy.getCy("form-refreshTime").find('mat-slider').click({force:true});
      
        cy.submitForm();

        cy.fixture<StateSyncConfig>('initial-state').then((old) => {
            cy.storeState<StateSyncConfig>().then((curr) => {
                expect(old.syncConfig.refreshTime, "refreshTime has changed").to.not.eq(curr.syncConfig.refreshTime);
            })
        })
    })    

    it('Can update initialTimestamp and trigger resync', () => {
        cy.intercept('https://localhost:44379/api/SyncAll/**', { fixture: 'sync-response', delay: 500}).as("getSync");

        const dateParams = {year: 2018, month: 2}
        cy.getCy("form-initialMonthISO").wait(1000).click().wait(2000);
        cy.ionDateSelect(dateParams);
        cy.contains("Ferdig").click();
        cy.submitForm();

        cy.log("Has initialTimestamp changed")
        cy.wait(100).storeState<StateSyncConfig>().then(({syncConfig}) => {
            expect(syncConfig.initialTimestamp)
                .to.closeTo(new Date(dateParams.year, dateParams.month).getTime(), 2000);
        });

        cy.wait(100).storeState<ModelState>().then(state => {
            cy.log("Has removed old sync state")
            expect(state.missions, "missions").to.not.be.ok;
            expect(state.employers, "employers").to.not.be.ok;
            expect(state.userTimesheets, "userTimesheets").to.not.be.ok;
        });

        cy.wait("@getSync").storeState<ModelState>().then(state => {
            cy.log("Has received new sync state")
            expect(state.missions, "missions").to.have.lengthOf(2);
            expect(state.employers, "employers").to.have.lengthOf(2);
            expect(state.userTimesheets, "userTimesheets").to.have.lengthOf(2);
        });
    })

})