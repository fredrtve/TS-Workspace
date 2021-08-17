import { Mission } from "@core/models";

describe('Home', () => {

    const mission1 : Mission = { id: '1', address: 'address1', lastVisited: new Date().getTime() } 
    const mission2 : Mission = { id: '2', address: 'address2', lastVisited: new Date().getTime() - 1000 }

    const firstMission = () => cy.getCy('mission-list-item').first();

    beforeEach(() => {
        cy.login('Leder', '/', { missions: [mission1, mission2]}); 
    })

    it('Should display latest visited missions first', () => {    
        firstMission().should('contain', mission1.address)   
    });

    it('Should navigate to mission', () => { 
        firstMission().click();
        cy.url().should('contain', mission1.id + '/detaljer');
    })

    // Navigating to closest mission

    // Page navigations

    // Displaying sync timestamp

    // Sync button
  })
  