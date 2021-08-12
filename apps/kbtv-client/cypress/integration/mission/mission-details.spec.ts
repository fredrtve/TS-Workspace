import { ApiUrl } from "@core/api-url.enum";
import { StateMissionImages, StateMissions } from "@core/state/global-state.interfaces";

describe('Mission Details', () => {

    const employer = { id: "detailstest1", name: 'testemployer', phoneNumber: '43214', address: "employeraddress"};

    const mission = { 
        id: "detailstest1", address: "testaddress232", finished: false, 
        fileName: "sample1_ratio=1.9.jpg", phoneNumber: "32131321",
        description: "test description details",
        employerId: employer.id,
    };

    const init = (state: object) => cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer', state);

    // Create mission with only required fields (check that form cant submit for each field filled)
    it('Displays mission values correctly', () => {       
        init({ missions: [mission], employers: [employer] })  
        //Assert that information displays correclty
        cy.get('.content-header').contains(mission.address!);
        cy.get('.header-container img').should('have.attr', 'src').should('include', mission.fileName);
        // cy.get('a').should('have.attr', 'href').should('include', mission.phoneNumber);
        cy.get('a').filter(':contains("Veibeskrivelse")').should('have.attr', 'href').should('include', mission.address);

        cy.get('a').filter(':contains("'+ mission.phoneNumber + '")').should('have.attr', 'href').should('include', mission.phoneNumber);

        cy.contains(mission.phoneNumber!);
        cy.contains(mission.description!);
        cy.contains(employer.name!);
    });

    it('Displays not found image if image not found', () => {
        init({ missions: [{...mission, fileName: 'doesntexist.jpg'}], employers: [employer] }) 
        cy.get('.header-container img').should('have.attr', 'src').should('include', 'notfound');
    })

    it('Displays add image if no image set & can add image', () => {
        init({ missions: [{...mission, fileName: null}], employers: [employer] });
        cy.intercept('PUT', '**/UpdateHeaderImage', { statusCode: 204, delay: 100 }).as('updateMission');
        cy.get('.header-container').contains('Legg til forsidebilde');
        cy.get('app-mission-details > input').first().invoke('removeAttr', 'style').attachFile('sample-image-1.jpg');
        cy.storeState<StateMissions>().then(state => {
            const updated = state.missions?.filter(x => x.id === mission.id)[0];
            expect(updated!.fileName).is.not.null;
        })
    })

    it('Can add mission images & shows counter', () => {
        init({ missions: [mission], employers: [employer] });
        cy.intercept('POST', '**/' + ApiUrl.MissionImage, { statusCode: 204, delay: 100 }).as('addMissionImage');
        cy.get('app-mission-details > input').last().invoke('removeAttr', 'style').attachFile(['sample-image-1.jpg', 'sample-image-2.jpg']);
        cy.contains('Bilder').siblings().get('[right-side]').contains('2')
        cy.storeState<StateMissionImages>().then(state => {
            const images = state.missionImages?.filter(x => x.missionId === mission.id);
            expect(images).has.lengthOf(2);
        })
    })

    it('Address transitions to top nav bar on scroll', () => {
        init({ missions: [mission], employers: [employer] });
        cy.get('.content-header').contains(mission.address!);
        cy.get('app-header-layout-skeleton .content-container').scrollTo(0, 1000);
        cy.get('app-mission-details app-main-top-nav-bar').contains(mission.address!)
    })

    it('Can navigate', () => {
        init({ missions: [mission], employers: [employer] });
        
        cy.contains('Bilder').click();
        cy.url().should('contain', '/bilder').navigateBack();

        cy.contains('Dokumenter').click();
        cy.url().should('contain', '/dokumenter').navigateBack();

        cy.contains('Notater').click();
        cy.url().should('contain', '/notater').navigateBack();

        cy.contains('Timer').click();
        cy.url().should('contain', '/timer').navigateBack();
    })

});