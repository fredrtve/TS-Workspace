import { ModelState } from "@core/state/model-state.interface";

describe("Data Sync", () => {
    it('should merge new data with existing, also deleting specified ids in sync response', () => {
        cy.login("Leder", "/", { missions: [ { id: '1', address: 'test' }, { id: '2', address: 'test2' }]});
        cy.wait(500);
        cy.intercept('https://localhost:44379/api/SyncAll**', { fixture: 'sync-response'}).as('sync');
        cy.getCy('sync-button').click();
        cy.wait('@sync');
        cy.storeState<ModelState>().then(state => {
            const removedMissions = state.missions!.filter(x => x.id === '1' || x.id === '2');
            expect(removedMissions).to.have.lengthOf(0);
            
            expect(state.missions!).to.have.lengthOf(2); 
            expect(state.missionImages!).to.have.lengthOf(2); 
            expect(state.employers!).to.have.lengthOf(2); 
            expect(state.missionTypes!).to.have.lengthOf(2); 
            expect(state.userTimesheets!).to.have.lengthOf(2); 
            expect(state.missionDocuments!).to.be.undefined; 
            expect(state.missionNotes!).to.be.undefined; 
        });
    })
})