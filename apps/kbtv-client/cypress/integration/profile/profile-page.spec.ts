import { Roles } from "@core/roles.enum";
import { ModelState } from "@core/state/model-state.interface";

describe('Profile Page', () => {

    const profileActions = () => cy.getCy('profile-action');

    const assertValuesRemovedFromLocalStorage = (props: string[]) => cy.window().then(win => {
        for(const item of props){
            const value = win.localStorage.getItem(item);
            expect(value == null || value === 'undefined', `Is ${item} removed`).to.be.true;
        }
    })
   
    beforeEach(() => {
        cy.login(Roles.Leder, "/profil", {
            missions: [{id: '1', address: 'test'}],
            employers: [{id: '1', name: 'test'}],
        })
    })

    it('Can delete all persisted data and get redirected to login', () => {   
        profileActions().contains('Slett lokal data').click().dialogConfirm();
        cy.wait(1000);
        assertValuesRemovedFromLocalStorage(['accessToken', 'refreshToken', 'currentUser', 'syncConfig', 'syncTimestamp'])
        cy.storeState<any>().then(state => {
            for(const prop of ['missions', 'employers'])
                expect(state[prop], `Is ${prop} deleted`).not.be.ok;
        })
        cy.url().should('contain', '/login')
    })

    it('Can log out', () => {
        profileActions().contains('Logg ut').click();
        assertValuesRemovedFromLocalStorage(['accessToken', 'refreshToken'])
        cy.url().should('contain', '/login')
    })

    it('Can navigate', () => {
        const assertSheet = () => cy.url().should('contain', 'sheet=true').closeForm();
        
        profileActions().contains('Oppdater profil').click();
        assertSheet();
        profileActions().contains('Oppdater passord').click();
        assertSheet();

        profileActions().contains('Aktivitetslogg').click();
        cy.url().should('contain', '/aktivitetslogg')
        cy.navigateBack();

        profileActions().contains('Synkronisering').click();
        cy.url().should('contain', '/synkronisering')
        profileActions().contains('Konfigurasjoner').click();
        assertSheet();
    })

    it('Can delete sync data and resynchronize', () => {
        cy.intercept('https://localhost:44379/api/SyncAll/**', { fixture: 'sync-response', delay: 300}).as("getSync");
        profileActions().contains('Synkronisering').click();
        profileActions().contains('Slett synkronisert data').click().dialogConfirm();
        cy.wait(100).storeState<ModelState>().then(state => {
            expect(state.missions, "missions").to.not.be.ok;
            expect(state.employers, "employers").to.not.be.ok;
        });
        cy.wait("@getSync").storeState<ModelState>().then(state => {
            expect(state.missions, "missions").to.have.lengthOf(2);
            expect(state.employers, "employers").to.have.lengthOf(2);
            expect(state.userTimesheets, "userTimesheets").to.have.lengthOf(2);
        });
    })
})