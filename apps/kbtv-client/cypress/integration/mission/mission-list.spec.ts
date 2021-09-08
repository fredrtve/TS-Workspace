import { ApiUrl } from "@core/api-url.enum";
import { GlobalActions } from "@core/global-actions";
import { Mission } from "@core/models";
import { StateMissionCriteria } from "@shared-mission/interfaces";
import { MissionCriteria } from "@shared/interfaces";
import { _formatDateRange, _formatShortDate, _getFirstDayOfMonth, _getLastDayOfMonth } from "date-time-helpers";

describe('MissionList', () => {

    const listItems = () => cy.getCy('mission-list-item');
    const chips = () => cy.getCy('bar-chip');
    const bottomActions = () => cy.getCy('bottom-bar-action');
    const topActions = () => cy.getCy('top-nav-action');
    const missionType = { id: '1', name: 'typeName'}
    const employer = { id: '1', name: 'employerName'};
    const missions : Mission[] = [
        { id: '1', address: 'addr1', missionTypeId: missionType.id, finished: false, createdAt: new Date().getTime() },
        { id: '2', address: 'addr2', employerId: employer.id, finished: false, createdAt: new Date().getTime() - 1000 },    
        { id: '3', address: 'addr3', finished: true, createdAt: new Date().getTime() - 1000 },
        { id: '4', address: 'addr4', employerId: employer.id, missionTypeId: missionType.id, finished: true, createdAt: new Date().getTime() - 1000 },    
    ]

    it('should display existing missions in ascending order', () => {
        cy.login('Leder', '/oppdrag', { missions }); 
  
        listItems().should('have.length', 2);
        listItems().eq(0).should('contain', missions[0].address);
        listItems().eq(1).should('contain', missions[1].address);
    });

    it('should add new mission to top of list', () => {
        cy.intercept('POST', '**' + ApiUrl.Mission, { statusCode: 204, delay: 100 }).as('createMission')
        cy.login('Leder', '/oppdrag', { missions }); 

        const entity = { id: 'testingmission', address: 'testingmission', finished: false, createdAt: new Date().getTime() };

        cy.storeDispatch(GlobalActions.saveModel<any>({ 
            stateProp: "missions", saveAction: 0, entity: { id: 'testingmission', address: 'testingmission', finished: false, createdAt: new Date().getTime() }
        }));

        cy.wait('@createMission');          
        listItems().eq(0).should('contain', entity.address);    
    });

    it('Can search for mission and display search chip', () => { 
        cy.login('Leder', '/oppdrag', { missions }); 

        cy.getCy('bottom-bar-action').filter(":contains('Søk')").click();

        cy.getCy('search-bar-input').type(missions[1].address!);
        cy.wait(500);

        listItems().should('have.length', 1)
        listItems().first().should('contain', missions[1].address);

        chips().first().should('contain', missions[1].address)
        cy.getCy('bar-chip-remove').click();
        chips().should('not.exist');

        listItems().should('have.length', 2)
    })

    it('Can navigate', () => {
        cy.login('Leder', '/oppdrag', { missions }); 
        //Navigate to map
        topActions().filter(":contains('travel_explore')").click();
        cy.url().should('contain', '/kart');
        cy.navigateBack();
        //Navigate to mission
        listItems().first().click();
        cy.url().should('contain', '/detaljer');
        cy.navigateBack();
        //Navigate to mission form
        cy.mainFabClick();
        cy.getCy("form-sheet-title").should('contain', "Registrer");
        cy.closeForm();
        //Navigate to mission filter 
        bottomActions().filter(":contains('Filtre')").click();
        cy.getCy("form-sheet-title").should('contain', "Velg filtre");
    })

    it('Filters mission on criteria', () => {  
        const missionCriteria : MissionCriteria = { 
            searchString: missions[3].address, 
            missionType, employer,
            finished: true,  
            dateRange: { start: _getFirstDayOfMonth(), end: _getLastDayOfMonth() }
        }

        cy.login('Leder', '/oppdrag', { missions, missionTypes: [missionType], employers: [employer], missionCriteria }); 

        listItems().should('have.length', 1);
        listItems().first().should('contain', missions[3].address)
    })

    it('Displays removable chips for each criteria', () => {  
        const missionCriteria : MissionCriteria = { 
            searchString: missions[3].address, 
            missionType, employer,
            finished: true,  
            dateRange: { start: _getFirstDayOfMonth(), end: _getLastDayOfMonth() }
        } 
        cy.login('Leder', '/oppdrag', { missionCriteria }); 

        chips().should('have.length', 5);
        chips().should('contain', missionCriteria.searchString);
        chips().should('contain', missionType.name);
        chips().should('contain', employer.name);
        chips().should('contain', "Ferdig");
        chips().should('contain', _formatDateRange(missionCriteria.dateRange!, _formatShortDate));

        cy.getCy('bar-chip-remove').click({ multiple: true });

        chips().should('have.length', 0);
        cy.storeState<StateMissionCriteria>().then(state => {
            for(const prop in missionCriteria) 
                expect(state.missionCriteria[<keyof MissionCriteria> prop]).to.be.undefined;
        })
    })
})
  