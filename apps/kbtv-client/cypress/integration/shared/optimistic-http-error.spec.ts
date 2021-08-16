import { ApiUrl } from "@core/api-url.enum";
import { Employer, Mission, MissionType, UserTimesheet } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { StatePropByModel } from "model/core/model-core";
import { SaveModelAction } from "model/state-commands";

describe('Optimistic Http Error', () => {

    const createEntity = <T>(prop: StatePropByModel<ModelState, T>, entity: T) => cy.storeDispatch<SaveModelAction<any,any>>({
        type: SaveModelAction, saveAction: 0, stateProp: <any> prop, entity
    });

    const updateEntity = <T>(prop: StatePropByModel<ModelState, T>, entity: T) => cy.storeDispatch<SaveModelAction<any,any>>({
        type: SaveModelAction, saveAction: 1, stateProp: <any> prop, entity
    });

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.Mission, { statusCode: 401 });
        cy.intercept('POST', '**' + ApiUrl.Timesheet, { statusCode: 401 });
        cy.intercept('PUT', '**' + ApiUrl.Timesheet + '/**', { statusCode: 401 });
        cy.intercept('POST', '**' + ApiUrl.Employer, { statusCode: 401 });
        cy.intercept('POST', '**' + ApiUrl.MissionType, { statusCode: 204 });
        cy.login('Leder', '/oppdrag', {});
    })

    it('Should fail subsequent requests & reset state to before request', () => {
        cy.goOffline();
        //First do one successful to ensure it does not reset
        createEntity<MissionType>("missionTypes", {id: "1", name: "testtype"});

        createEntity<UserTimesheet>("userTimesheets", { id: "1", missionId: "asdsad", comment: "asda" });  
        updateEntity<UserTimesheet>("userTimesheets", { id: "1", comment: "as2233da" });
        createEntity<Employer>("employers", { id: "1", name: "asda" });  
        createEntity<Mission>("missions", { id: "1", address: "asda" });  

        cy.storeState<ModelState>().then(s => {
            expect(s.userTimesheets).to.have.lengthOf(1);
            expect(s.employers).to.have.lengthOf(1);
            expect(s.missions).to.have.lengthOf(1);
            expect(s.missionTypes).to.have.lengthOf(1);
        })

        cy.goOnline(); 
        cy.wait(1500);
        cy.storeState<ModelState>().then(s => {
            expect(s.userTimesheets).to.be.undefined;
            expect(s.employers).to.be.undefined;
            expect(s.missions).to.be.undefined;
            expect(s.missionTypes).to.have.lengthOf(1);
        })
    })

    it('Should display dialog on http error with failed requests', () => {
        cy.goOffline();
        const missions = [{id: '1', address: 'testaddress1'},{id: '2', address: 'testaddress2'},{id: '3', address: 'testaddress3'}]
        for(const mission of missions) 
            createEntity("missions", mission);

        cy.goOnline();

        cy.get('app-optimistic-http-error-dialog').should('exist').within(() => {
            cy.get('app-list-item').first().should('contain', missions[0].address);
            const failedItems = () => cy.get('app-failed-command-list').find('app-list-item');
            failedItems().should('have.length', missions.length - 1);
            failedItems().eq(0).should('contain', missions[1].address);
            failedItems().eq(1).should('contain', missions[2].address);
            cy.contains('Lukk').click();
        })

        cy.get('app-optimistic-http-error-dialog').should('not.exist')  
    })
    

})