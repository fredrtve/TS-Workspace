describe('Home', () => {

    const firstMission = () => cy.get(".mission-list").children().first();

    beforeEach(() => {
        cy.login('Leder', '/'); 
    })

    it('Should display latest visited missions first', () => {        
        const lastMission = () => cy.get(".mission-list").children().last();
        lastMission().find(".list-item-content").invoke('text').then((text) => {
            lastMission().click();
            cy.navigateBack();
            firstMission().find(".list-item-content").should('have.text', text);
        });
    });

    it('Should navigate to mission', () => { 
        firstMission().find(".list-item-content").invoke('text').then((text) => {
            firstMission().click();
            cy.get(".content-header-title").should(el => expect(el.text().trim()).to.eq(text.trim()))
        });
    })

    // Navigating to closest mission

    // Page navigations

    // Displaying sync timestamp

    // Sync button
  })
  