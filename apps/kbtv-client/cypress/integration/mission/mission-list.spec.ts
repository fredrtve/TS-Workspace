import { ApiUrl } from "@core/api-url.enum";
import { SaveModelAction } from "model/state-commands";

describe('MissionList', () => {

    const missionType = { id: '1', name: 'name'}
    const mission = { id: '1', address: 'address', missionTypeId: missionType.id, finished: false, createdAt: new Date().getTime() } 
    const mission2 = { id: '2', address: 'notsame', finished: false, createdAt: new Date().getTime() - 1000 }

    //2. Legge til oppdrag (med nye, med eksisterende, og uten oppdragsgiver/type)
    it('should display existing missions in ascending order', () => {
        cy.login('Leder', '/oppdrag', { missions: [ mission, mission2 ] }); 

        const listItems = () => cy.get('.cdk-virtual-scroll-content-wrapper').children("app-list-item");

        listItems().should('have.length', 2);
        listItems().first().find('.list-item-content')
            .should(el => expect(el.text().trim()).to.eq(mission.address));
        listItems().eq(1).find('.list-item-content')
            .should(el => expect(el.text().trim()).to.eq(mission2.address));
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
        cy.get('.cdk-virtual-scroll-content-wrapper').children().first().find('.list-item-content')
            .should(el => expect(el.text().trim()).to.eq(entity.address))
        
    });

    //4. Søke oppdrag
    it('Can search for mission and display search chip', () => { 
        cy.login('Leder', '/oppdrag', { missions: [ mission, mission2 ] }); 

        cy.contains('Søk').click();
        const firstItemContent = 
            () => cy.get('.cdk-virtual-scroll-content-wrapper').children().first().find('.list-item-content');

        cy.get('.search-bar input').type(mission2.address);
        cy.wait(500);
        firstItemContent().should(el => expect(el.text().trim()).to.eq(mission2.address));

        cy.get('mat-chip').first().should('contain', mission2.address)
        cy.get('.mat-chip-remove').click();
        cy.get('mat-chip').should('not.exist');

        firstItemContent().should(el => expect(el.text().trim()).not.eq(mission2.address));
    })

    //6. Navigere til kart
    it('Can navigate', () => {
        cy.login('Leder', '/oppdrag', { missions: [ mission, mission2 ] }); 
        //Navigate to map
        cy.contains('travel_explore').click();
        cy.url().should('contain', '/kart');
        cy.navigateBack();
        //Navigate to mission
        cy.get('app-list-item').first().click();
        cy.url().should('contain', '/detaljer');
        cy.navigateBack();
        //Navigate to mission form
        cy.get('.fab').click();
        cy.contains('Registrer oppdrag').should('exist');
        cy.closeForm();
        //Navigate to mission filter 
        cy.contains('Filtre').click();
        cy.contains('Velg filtre').should('exist');
    })

    //7. Filter mission & chips displayes 
    it('Filters mission on criteria and displays removable chips', () => {  
        const missionCriteria = { searchString: mission.address, missionType }   
        cy.login('Leder', '/oppdrag', { missions: [ mission, mission2 ], missionTypes: [ missionType ], missionCriteria }); 

        cy.get('.list-item-content').should('have.length', 1);
        cy.get('.list-item-content').should(el => expect(el.text().trim()).to.eq(mission.address));

        cy.get('mat-chip').should('have.length', 2);
        cy.get('mat-chip').should('contain', missionCriteria.searchString);
        cy.get('mat-chip').should('contain', missionType.name);

        cy.get('.mat-chip-remove').click({ multiple: true });

        cy.get('mat-chip').should('have.length', 0);
        cy.get('.list-item-content').should('not.have.length', 1);
    })

})
  