import { ApiUrl } from "@core/api-url.enum";
import { Mission } from "@core/models";
import { StateEmployers, StateMissions, StateMissionTypes } from "@core/state/global-state.interfaces";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Mission Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    const missionType = {id: '1', name: 'type'};
    const employer = {id: '1', name: 'employer'}
    const mission = { id: '1', address: "new", phoneNumber: "9234", description: "desc", 
        employerId: employer.id, missionTypeId: missionType.id }

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.Mission, { statusCode: 204, delay: 100 }).as('createMission');
        cy.intercept('PUT', '**' + ApiUrl.Mission + '/**', { statusCode: 204, delay: 100 }).as('updateMission');  
        cy.intercept('DELETE', '**' + ApiUrl.Mission + '/**', { statusCode: 204, delay: 100 }).as('deleteMission');  
    })

    it('can fill in form and create mission', () => {  
        cy.login('Leder', '/oppdrag', { missionTypes: [missionType], employers: [employer]}); 
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

        cy.getCy('form-missionTypeInput').click();
        cy.wait(500);
        autoCompleteItems().should('have.length', 1).first().click();

        //Submit and check that new mission exists in state
        cy.getCy('submit-form').click();
        cy.wait('@createMission');
        cy.storeState<StateMissions>().then(state => {
            const missions = state.missions?.filter(x => x.address === newModel.address);
            expect(missions).to.have.lengthOf(1);
            const mission = missions![0];
            expect(mission!.phoneNumber).to.equal(newModel.phoneNumber);
            expect(mission!.description).to.equal(newModel.description);
            expect(mission!.employerId).to.equal(employer.id);
            expect(mission!.missionTypeId).to.equal(missionType.id);
        })
    });

    it('can create mission with new employer & mission type', () => {  
        cy.login('Leder', '/oppdrag');   
        cy.mainFabClick();
        cy.wait(200);

        const data = {address: 'createMissionTest2', missionTypeInput: 'newMissionType', employerInput: 'newEmployer'};
        cy.getCy('form-address','input').type(data.address);   

        cy.getCy('form-missionTypeInput','input').type(data.missionTypeInput);
        cy.getCy('form-employerInput','input').type(data.employerInput);

        cy.getCy('submit-form').click();
        cy.wait('@createMission');
        cy.storeState<StateMissions & StateEmployers & StateMissionTypes>().then(state => {
            const mission = state.missions?.filter(x => x.address === data.address)[0];
            const employers = state.employers!.filter(x => x.id === mission!.employerId);    
            const types = state.missionTypes!.filter(x => x.id === mission!.missionTypeId);

            expect(employers).to.have.lengthOf(1);
            expect(employers[0].name).to.equal(data.employerInput);

            expect(types).to.have.lengthOf(1);
            expect(types[0].name).to.equal(data.missionTypeInput);
        })

    })

    it('shows current values on update & updates changed values', () => {
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer' , { missionTypes: [missionType], employers: [employer], missions: [mission]});  
        cy.contains('Mer').click();
        cy.contains('Rediger').click();
        cy.wait(200);

        const updatedValues = { address: "updatedAddress", phoneNumber: "3424" }
        //Check that existing values are filled in
        cy.getCy('form-address','input').invoke('val').should('equal', mission.address);      
        cy.getCy('form-phoneNumber','input').invoke('val').should('equal', mission.phoneNumber);   
        cy.getCy('form-description','textarea').invoke('val').should('equal', mission.description);        
        cy.getCy('form-employerInput','input').invoke('val').should('equal', employer.name);
        cy.getCy('form-missionTypeInput','input').invoke('val').should('equal', missionType.name);
        cy.getCy('form-finished','input').should('not.be.checked');

        //Update values
        cy.getCy('form-address','input').clear().type(updatedValues.address);
        cy.getCy('form-phoneNumber','input').clear().type(updatedValues.phoneNumber);
        cy.getCy('form-employerInput','input').clear();
        cy.getCy('form-missionTypeInput','input').clear();

        cy.getCy('submit-form').click();
        cy.wait('@updateMission');

        cy.storeState<StateMissions>().then(state => {
            const missions = state.missions?.filter(x => x.address === updatedValues.address);

            expect(missions).to.have.lengthOf(1);
            expect(missions![0].phoneNumber).to.equal(updatedValues.phoneNumber);
            expect(missions![0].missionTypeId).to.be.undefined;
            expect(missions![0].employerId).to.be.undefined;
        })
    })

    it('Can delete current mission', () => {
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer' , { missionTypes: [missionType], employers: [employer], missions: [mission]});  
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