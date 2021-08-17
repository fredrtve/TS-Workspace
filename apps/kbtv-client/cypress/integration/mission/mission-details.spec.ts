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
        cy.getCy("header-title").should('contain', mission.address!);
        cy.getCy("mission-header-image").should('have.attr', 'src').should('include', mission.fileName);
        cy.getCy("mission-phoneNumber").should('have.attr', 'href').should('include', mission.phoneNumber);
        cy.getCy("mission-directions").should('have.attr', 'href').should('include', mission.address);

        cy.contains(mission.phoneNumber!);
        cy.contains(mission.description!);
        cy.contains(employer.name!);
    });

    it('Displays not found image if image not found', () => {
        init({ missions: [{...mission, fileName: 'doesntexist.jpg'}], employers: [employer] });
        cy.wait(400);
        cy.getCy("mission-header-image").should('have.attr', 'src').should('include', 'notfound');
    })

    it('Displays add image if no image set & can add image', () => {
        init({ missions: [{...mission, fileName: null}], employers: [employer] });
        cy.intercept('PUT', '**/UpdateHeaderImage', { statusCode: 204, delay: 100 }).as('updateMission');
        cy.getCy("upload-header-image-button").should('be.visible');
        cy.getCy('upload-header-image-input').invoke('removeAttr', 'style').attachFile('sample-image-1.jpg');
        cy.storeState<StateMissions>().then(state => {
            const updated = state.missions?.filter(x => x.id === mission.id)[0];
            expect(updated!.fileName).is.not.null;
        })
    })

    it('Can add mission images & shows counter', () => {
        init({ missions: [mission], employers: [employer] });
        cy.intercept('POST', '**/' + ApiUrl.MissionImage, { statusCode: 204, delay: 100 }).as('addMissionImage');
        cy.getCy('upload-images-input').invoke('removeAttr', 'style').attachFile(['sample-image-1.jpg', 'sample-image-2.jpg']);
        cy.getCy('mission-images').find('[right-side]').should('have.text', 2)
        cy.storeState<StateMissionImages>().then(state => {
            const images = state.missionImages?.filter(x => x.missionId === mission.id);
            expect(images).has.lengthOf(2);
        })
    })

    it('Address transitions to top nav bar on scroll', () => {
        init({ missions: [mission], employers: [employer] });
        cy.getCy("header-title").should('contain', mission.address!);
        cy.getCy('top-nav-title').should('not.contain', mission.address!);
        cy.getCy('header-layout-scroll-container').scrollTo(0, 1000);
        cy.getCy('top-nav-title').should('contain', mission.address!);
    })

    it('Can navigate', () => {
        init({ missions: [mission], employers: [employer] });
        
        cy.getCy('mission-images').click();
        cy.url().should('contain', '/bilder').navigateBack();

        cy.getCy('mission-documents').click();
        cy.url().should('contain', '/dokumenter').navigateBack();

        cy.getCy('mission-notes').click();
        cy.url().should('contain', '/notater').navigateBack();

        cy.getCy('bottom-bar-action').filter(`:contains("Timer")`).click();
        cy.url().should('contain', '/timer').navigateBack();
    })

    it('Updates last visited on mission on entry', () => {
        cy.login('Leder', '/oppdrag', { missions: [mission] });
        cy.getCy('mission-list-item').filter(`:contains("${mission.address}")`).click();
        cy.wait(500);
        cy.storeState<StateMissions>().then(state => {
            const updated = state.missions?.filter(x => x.id === mission.id)[0];
            console.log(updated);
            expect(updated!.lastVisited).is.closeTo(new Date().getTime(), 100000);
        })
    })
});