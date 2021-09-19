import { ApiUrl } from "@core/api-url.enum";
import { GlobalActions } from "@core/global-actions";
import { Employer, Mission, MissionType, UserTimesheet } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { StatePropByModel } from "model/core/model-core";

describe('Optimistic Http Error', () => {

    const createEntity = <T>(prop: StatePropByModel<ModelState, T>, entity: T) => 
        cy.storeDispatch(GlobalActions.saveModel<any>({ stateProp: <any> prop, entity }));

    const updateEntity = <T>(prop: StatePropByModel<ModelState, T>, entity: T) => 
        cy.storeDispatch(GlobalActions.saveModel<any>({ stateProp: <any> prop, entity }));

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.Mission, { statusCode: 401 });
        cy.intercept('POST', '**' + ApiUrl.Timesheet, { statusCode: 401 }).as("createTimesheet");
        cy.intercept('PUT', '**' + ApiUrl.Timesheet + '/**', { statusCode: 401 });
        cy.intercept('POST', '**' + ApiUrl.Employer, { statusCode: 401 });
        cy.intercept('POST', '**' + ApiUrl.MissionType, { statusCode: 204 });
        cy.login('Leder', '/oppdrag', {});
    })

    it('Should fail subsequent requests & reset state to before request', { browser: '!firefox' }, () => {
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
        cy.wait("@createTimesheet").wait(1000);
        cy.storeState<ModelState>().then(s => {
            expect(s.userTimesheets).to.be.undefined;
            expect(s.employers).to.be.undefined;
            expect(s.missions).to.be.undefined;
            expect(s.missionTypes).to.have.lengthOf(1);
        })
    })

    it('Should display dialog on http error with failed requests', { browser: '!firefox' }, () => {
        cy.goOffline();
        const missions = [{id: '1', address: 'testaddress1'},{id: '2', address: 'testaddress2'},{id: '3', address: 'testaddress3'}]
        for(const mission of missions) 
            createEntity("missions", mission);

        cy.goOnline();

        cy.getCy('optimistic-error-dialog').should('exist').within(() => {
            cy.getCy('error-request-item').first().should('contain', missions[0].address);
            const failedItems = () => cy.getCy('failed-request-item');
            failedItems().should('have.length', missions.length - 1);
            failedItems().eq(0).should('contain', missions[1].address);
            failedItems().eq(1).should('contain', missions[2].address);
            cy.getCy('close-dialog').click();
        })

        cy.getCy('optimistic-error-dialog').should('not.exist')  
    })
    

})