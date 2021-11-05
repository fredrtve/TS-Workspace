import { DatePipe } from "@angular/common";
import { StateMissionCriteria } from "@shared-mission/interfaces";
import { MissionCriteria } from "@shared/interfaces";
import { _getISO } from "date-time-helpers";
import { registerLocaleData } from '@angular/common';
import norwayLocale from '@angular/common/locales/nb';

registerLocaleData(norwayLocale, 'nb-NO');

describe('Mission Filter', () => {

    const datePipe = new DatePipe("nb-NO");

    const existingCriteria: MissionCriteria = { 
        searchString: "test", employer: {id: "test", name: "test"},
        dateRange: { start: _getISO(new Date().setMonth(3)), end: _getISO(new Date().setMonth(5)) },
        finished: false
    }

    const finishTxt = (finished: boolean) => finished ? 'Ferdig' : 'Aktiv';

    beforeEach(() => {
        cy.login('Leder', '/oppdrag', { missionCriteria: existingCriteria });  
        cy.contains('Filtre').click();
        cy.wait(200);
     
    })

    // Create mission with only required fields (check that form cant submit for each field filled)
    it('Shows existing values & can update values', () => {  

        const finishTxt = (finished: boolean) => finished ? 'Ferdig' : 'Aktiv';
        
        //Check that existing values are filled in
        cy.getCy('form-searchString','input').invoke('val').should('eq', existingCriteria.searchString)    
        cy.getCy('form-employer').should('contain', existingCriteria.employer!.name)  
        cy.getCy('form-end','input').invoke('val').should('eq', datePipe.transform(existingCriteria.dateRange!.end, "MMM d, y"));
        cy.getCy('form-start','input').invoke('val').should('eq', datePipe.transform(existingCriteria.dateRange!.start, "MMM d, y"));
        cy.getCy('form-finished','.mat-radio-checked').contains(finishTxt(existingCriteria.finished!)) 

        //Update values
        const newValues: Partial<MissionCriteria> = { 
            searchString: "newtest", finished: false
        }

        cy.getCy('form-searchString','input').clear().type(newValues.searchString!);
        cy.getCy('form-finished').contains(finishTxt(newValues.finished!)).click();

        //Submit and check that new mission exists in state
        cy.getCy('submit-form').click();
        cy.storeState<StateMissionCriteria>().then(state => {
            expect(state.missionCriteria.searchString).to.equal(newValues.searchString);
            expect(state.missionCriteria.finished).to.equal(newValues.finished);
        })
    });

    it('can reset values', () => {
        cy.getCy('reset-form').click();

        cy.getCy('form-searchString','input').invoke('val').should('be.empty')    
        cy.getCy('form-employer').should('not.contain', existingCriteria.employer!.name)  
        cy.getCy('form-end','input').invoke('val').should('be.empty');
        cy.getCy('form-start').click(); 
        cy.getCy('form-start','input').invoke('val').should('be.empty')
        cy.getCy('form-finished','.mat-radio-checked').contains(finishTxt(false)) 
    })

});

