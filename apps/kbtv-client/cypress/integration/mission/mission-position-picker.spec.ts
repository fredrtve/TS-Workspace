import { ApiUrl } from "@core/api-url.enum";
import { Mission } from "@core/models";
import { StateMissions } from "@core/state/global-state.interfaces";

describe('Mission Position Picker', () => {

    const mission : Mission = { 
        id: "detailstest1", address: "testaddress232"
    };

    beforeEach(() => {
        cy.intercept('PUT', '**' + ApiUrl.Mission + '/**', { statusCode: 204, delay: 100 }).as('updateMission');  
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer', { missions: [mission] });
    })

    it('Should display information and update position without user location', () => {       
        cy.getCy('bottom-bar-action').filter(":contains('Mer')").click()
        cy.contains('Merk posisjon').click();
        cy.getCy('position-picker-address').should('contain', mission.address);
        cy.getCy('no-user-position').should('be.visible');
        cy.getCy('submit-marked-position').should('be.disabled');
        cy.get('google-map').click();
        cy.getCy('submit-marked-position').click();
        
        cy.storeState<StateMissions>().then(s => {
            const updated = s.missions![0];
            expect(updated?.position).not.be.undefined;
        })
    });

    it('Should update position to user location', () => {       
        const coords = { latitude: 50, longitude : 50 };
        cy.window().then(win => {
            cy.stub(win.navigator.geolocation, 'getCurrentPosition')
              .callsFake(cb => cb({ coords })) 
        }) 
      
        cy.getCy('bottom-bar-action').filter(":contains('Mer')").click()
        cy.contains('Merk posisjon').click();
        cy.getCy('submit-user-position').click();
        
        cy.storeState<StateMissions>().then(s => {
            const updated = s.missions![0];
            expect(updated?.position?.latitude).equals(coords.latitude);
            expect(updated?.position?.longitude).equals(coords.longitude);
        })
    });

});