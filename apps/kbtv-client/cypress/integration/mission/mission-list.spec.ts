import { ApiUrl } from "@core/api-url.enum";
import { SaveModelAction } from "model/state-commands";

describe('MissionList', () => {

    const listItems = () => cy.getCy('mission-list-item');
    const chips = () => cy.getCy('bar-chip');
    const bottomActions = () => cy.getCy('bottom-bar-action');
    const topActions = () => cy.getCy('top-nav-action');

    const missionType = { id: '1', name: 'name'}
    const mission = { id: '1', address: 'address', missionTypeId: missionType.id, finished: false, createdAt: new Date().getTime() } 
    const mission2 = { id: '2', address: 'notsame', finished: false, createdAt: new Date().getTime() - 1000 }

    //2. Legge til oppdrag (med nye, med eksisterende, og uten oppdragsgiver/type)
    it('should display existing missions in ascending order', () => {
        cy.login('Leder', '/oppdrag', { missions: [ mission, mission2 ] }); 
  
        listItems().should('have.length', 2);
        listItems().eq(0).should('contain', mission.address);
        listItems().eq(1).should('contain', mission2.address);
    });

    //2. Legge til oppdrag (med nye, med eksisterende, og uten oppdragsgiver/type)
    it('should add new mission to top of list', () => {
        cy.intercept('POST', '**' + ApiUrl.Mission, { statusCode: 204, delay: 100 }).as('createMission')
        cy.login('Leder', '/oppdrag', { missions: [ mission, mission2 ] }); 

        const entity = { id: 'testingmission', address: 'testingmission', finished: false, createdAt: new Date().getTime() };

        cy.storeDispatch({ 
            type: SaveModelAction, stateProp: "missions", saveAction: 0, entity: { id: 'testingmission', address: 'testingmission', finished: false, createdAt: new Date().getTime() }
        });

        cy.wait('@createMission');          
        listItems().eq(0).should('contain', entity.address);    
    });

    //4. Søke oppdrag
    it('Can search for mission and display search chip', () => { 
        cy.login('Leder', '/oppdrag', { missions: [ mission, mission2 ] }); 

        cy.getCy('bottom-bar-action').filter(":contains('Søk')").click();

        cy.getCy('search-bar-input').type(mission2.address);
        cy.wait(500);

        listItems().should('have.length', 1)
        listItems().first().should('contain', mission2.address);

        chips().first().should('contain', mission2.address)
        cy.getCy('bar-chip-remove').click();
        chips().should('not.exist');

        listItems().should('have.length', 2)
    })

    //6. Navigere til kart
    it('Can navigate', () => {
        cy.login('Leder', '/oppdrag', { missions: [ mission, mission2 ] }); 
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

    //7. Filter mission & chips displayes 
    it('Filters mission on criteria and displays removable chips', () => {  
        const missionCriteria = { searchString: mission.address, missionType }   
        cy.login('Leder', '/oppdrag', { missions: [ mission, mission2 ], missionTypes: [ missionType ], missionCriteria }); 

        listItems().should('have.length', 1);
        listItems().first().should('contain', mission.address)

        chips().should('have.length', 2);
        chips().should('contain', missionCriteria.searchString);
        chips().should('contain', missionType.name);

        cy.getCy('bar-chip-remove').click({ multiple: true });

        chips().should('have.length', 0);
        listItems().should('have.length', 2);
    })

})
  