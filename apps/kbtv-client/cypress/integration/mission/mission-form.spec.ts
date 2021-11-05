import { ApiUrl } from "@core/api-url.enum";
import { Activity, Mission, MissionActivity } from "@core/models";
import { StateActivities, StateEmployers, StateMissionActivities, StateMissions } from "@core/state/global-state.interfaces";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Mission Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    const employer = {id: '1', name: 'employer'};
    const activity : Activity = { id: '1', name: "testactivity1" };
    const activity2 : Activity = { name: "testactivity2" };
    const mission = { id: '1', address: "new", phoneNumber: "9234", description: "desc", 
        employerId: employer.id }
    const missionActivity :MissionActivity = { id: "1", missionId: mission.id, activityId: activity.id}

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.Mission, { statusCode: 204, delay: 100 }).as('createMission');
        cy.intercept('PUT', '**' + ApiUrl.Mission + '/**', { statusCode: 204, delay: 100 }).as('updateMission');  
        cy.intercept('DELETE', '**' + ApiUrl.Mission + '/**', { statusCode: 204, delay: 100 }).as('deleteMission');  
    })

    it('can fill in form and create mission', () => {  
        cy.login('Leder', '/oppdrag', { employers: [employer], activities: [activity]}); 
        cy.mainFabClick();
        cy.wait(600);

        isNotSubmittable();

        const newModel : Mission = { address: 'testaddress', phoneNumber: 'asdadsa', description: "testdesc" }

        //Check that google autocomplete exist and has items
        cy.getCy('form-address','input').type('Furuberget 17');   
        cy.get('.pac-container').children().should('have.length.above', 1)

        //Check that it is submittable with only address
        cy.assertTextFormControl("address", newModel.address!, [
            _stringGen(ValidationRules.AddressMaxLength + 1)
        ])
        isSubmittable();

        //Check that it is not submittable with invalid phoneNumbers
        cy.assertTextFormControl("phoneNumber", newModel.phoneNumber!, [
            _stringGen(ValidationRules.PhoneNumberMaxLength + 1),
            _stringGen(ValidationRules.PhoneNumberMinLength - 1)
        ])
        isSubmittable();

        //Check that it is not submittable with invalid description
        cy.assertTextFormControl("description", newModel.description!, [
            _stringGen(ValidationRules.MissionDescriptionMaxLength + 1),
        ], "textarea")
        isSubmittable();

        const autoCompleteItems = () => cy.get(".mat-autocomplete-panel").children();

        //Check autocompletes are visible and can be selected
        cy.getCy('form-employerInput').click();
        cy.wait(500);
        autoCompleteItems().should('have.length', 1).first().click();

        cy.getCy('form-missionActivitiesInput','input').wait(100).type(activity2.name+'{enter}').wait(100); 
        cy.getCy('form-missionActivitiesInput').click().wait(100);
        autoCompleteItems().should('have.length', 1).first().click();
        cy.getCy('form-missionActivitiesInput').find("mat-chip")
            .should('have.length',2)
            .should('contain', activity.name)
            .should('contain', activity2.name);

        //Submit and check that new mission exists in state
        cy.getCy('submit-form').click();
        cy.wait('@createMission');
        cy.storeState<StateMissions & StateMissionActivities & StateActivities>().then(state => {
            const missions = state.missions?.filter(x => x.address === newModel.address);
            expect(missions).to.have.lengthOf(1);
            const mission = missions![0];
            expect(mission!.phoneNumber).to.equal(newModel.phoneNumber);
            expect(mission!.description).to.equal(newModel.description);
            expect(mission!.employerId).to.equal(employer.id);
            
            const missionActivities = state.missionActivities?.filter(x => x.missionId === mission.id);
            expect(missionActivities).to.have.lengthOf(2);
            const activityIds = missionActivities?.map(x => x.activityId);
            const activities = state.activities?.filter(x => activityIds?.indexOf(x.id) !== -1);
            expect(activities).to.have.lengthOf(2);
            const newActivity = activities?.find(x => x.id !== activity.id);
            expect(newActivity!.name).to.equal(activity2.name);
        })
    });

    it('can create mission with new employer', () => {  
        cy.login('Leder', '/oppdrag');   
        cy.mainFabClick();
        cy.wait(200);

        const data = {address: 'createMissionTest2', employerInput: 'newEmployer'};
        cy.getCy('form-address','input').type(data.address);   

        cy.getCy('form-employerInput','input').type(data.employerInput);

        cy.getCy('submit-form').click();
        cy.wait('@createMission');
        cy.storeState<StateMissions & StateEmployers>().then(state => {
            const mission = state.missions?.filter(x => x.address === data.address)[0];
            const employers = state.employers!.filter(x => x.id === mission!.employerId);    

            expect(employers).to.have.lengthOf(1);
            expect(employers[0].name).to.equal(data.employerInput);
        })

    })

    it('shows current values on update & updates changed values', () => {
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer' , { 
            employers: [employer], missions: [mission], activities: [activity], missionActivities: [missionActivity]
        });  
        cy.contains('Mer').click();
        cy.contains('Rediger').click();
        cy.wait(200);

        const updatedValues = { address: "updatedAddress", phoneNumber: "3424", activity: activity2 }
        //Check that existing values are filled in
        cy.getCy('form-address','input').invoke('val').should('equal', mission.address);      
        cy.getCy('form-phoneNumber','input').invoke('val').should('equal', mission.phoneNumber);   
        cy.getCy('form-description','textarea').invoke('val').should('equal', mission.description);        
        cy.getCy('form-employerInput','input').invoke('val').should('equal', employer.name);
        cy.getCy('form-missionActivitiesInput').find('mat-chip').should('have.length', 1).should('contain', activity.name);
        cy.getCy('form-finished','input').should('not.be.checked');

        //Update values
        cy.getCy('form-address','input').clear().type(updatedValues.address);
        cy.getCy('form-phoneNumber','input').clear().type(updatedValues.phoneNumber);
        cy.getCy('form-employerInput','input').clear();
        cy.getCy('form-missionActivitiesInput', "input").type(updatedValues.activity.name+"{enter}");

        cy.getCy('submit-form').click();
        cy.wait('@updateMission');

        cy.storeState<StateMissions & StateActivities & StateMissionActivities>().then(state => {
            const missions = state.missions?.filter(x => x.address === updatedValues.address);

            expect(missions).to.have.lengthOf(1);
            expect(missions![0].phoneNumber).to.equal(updatedValues.phoneNumber);
            expect(missions![0].employerId).to.be.undefined;

            const missionActivities = state.missionActivities?.filter(x => x.missionId === missions![0].id);
            expect(missionActivities).to.have.lengthOf(2);
            const activityIds = missionActivities?.map(x => x.activityId);
            const activities = state.activities?.filter(x => activityIds?.indexOf(x.id) !== -1);
            expect(activities).to.have.lengthOf(2);
            const newActivity = activities?.find(x => x.id !== activity.id);
            expect(newActivity!.name).to.equal(activity2.name);
        })
    })

    it('Can delete current mission', () => {
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer' , { employers: [employer], missions: [mission]});  
        cy.getCy('bottom-bar-action').filter(":contains('Mer')").click();
        cy.contains('Rediger').click();
        cy.wait(200);

        cy.getCy('form-sheet-action').filter(":contains('delete_forever')").click().dialogConfirm();
        cy.wait('@deleteMission');

        cy.storeState<StateMissions>().then(state => {
            const missions = state.missions?.filter(x => x.id === mission.id);
            expect(missions).to.have.lengthOf(0);
        })
    })
});