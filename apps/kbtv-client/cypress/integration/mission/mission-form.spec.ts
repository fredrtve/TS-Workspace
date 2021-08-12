import { ApiUrl } from "@core/api-url.enum";
import { StateEmployers, StateMissions, StateMissionTypes } from "@core/state/global-state.interfaces";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Mission Form', () => {
    
    const isSubmittable = () =>  cy.contains('Legg til').should('not.have.class', 'mat-button-disabled');
    const isNotSubmittable = () => cy.contains('Legg til').should('have.class', 'mat-button-disabled');

    const missionType = {id: '1', name: 'type'};
    const employer = {id: '1', name: 'employer'}
    const mission = { id: '1', address: "new", phoneNumber: "9234", description: "desc", 
        employerId: employer.id, missionTypeId: missionType.id }

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.Mission, { statusCode: 204, delay: 100 }).as('createMission');
        cy.intercept('PUT', '**' + ApiUrl.Mission + '/**', { statusCode: 204, delay: 100 }).as('updateMission');  
        cy.intercept('DELETE', '**' + ApiUrl.Mission + '/**', { statusCode: 204, delay: 100 }).as('deleteMission');  
    })

    // Create mission with only required fields (check that form cant submit for each field filled)
    it('can fill in form and create mission', () => {  
        cy.login('Leder', '/oppdrag', { missionTypes: [missionType], employers: [employer]}); 
        cy.mainFabClick();
        cy.wait(200);

        isNotSubmittable();

        //Check that google autocomplete exist and has items
        cy.get('.form-address input').type('Furuberget 17');   
        cy.get('.pac-container').children().should('have.length.above', 1)

        //Check that it is submittable with only address
        const addr = 'testaddress';
        cy.get('.form-address input').clear().type(addr);   
        isSubmittable();

        //Check that it is not submittable with invalid phoneNumbers
        const isInvalidPhoneNumber = (num: string) => {
            cy.get('.form-phoneNumber input').clear().type(num).type('{enter}');
            cy.get('.form-phoneNumber mat-error').should('exist')
            isNotSubmittable();
        }

        isInvalidPhoneNumber(_stringGen(ValidationRules.PhoneNumberMinLength - 1))
        isInvalidPhoneNumber(_stringGen(ValidationRules.PhoneNumberMaxLength + 1))

        //Check that it is submittable with valid phoneNumber
        const validNum = _stringGen(ValidationRules.PhoneNumberMinLength)
        cy.get('.form-phoneNumber input').clear().type(validNum);
        isSubmittable();

        //Check that it is not submittable with invalid description
        const invalidDesc = _stringGen(ValidationRules.MissionDescriptionMaxLength + 1);
        cy.get('.form-description textarea').clear().type(invalidDesc, {delay: 0}).type('{enter}');
        cy.get('.form-description mat-error').should('exist')
        isNotSubmittable();

        //Check that it is submittable with valid description
        const validDesc = _stringGen(ValidationRules.MissionDescriptionMaxLength);
        cy.get('.form-description textarea').clear().type(validDesc, {delay: 0});
        isSubmittable();

        const autoCompleteItems = () => cy.get(".mat-autocomplete-panel").children();

        //Check autocompletes are visible and can be selected
        cy.get('.form-employerName').click();
        cy.wait(500);
        autoCompleteItems().should('have.length', 1).first().click();

        cy.get('.form-missionTypeName').click();
        cy.wait(500);
        autoCompleteItems().should('have.length', 1).first().click();

        //Submit and check that new mission exists in state
        cy.contains('Legg til').click();
        cy.wait('@createMission');
        cy.storeState<StateMissions>().then(state => {
            const missions = state.missions?.filter(x => x.address === addr);
            expect(missions).to.have.lengthOf(1);
            const mission = state.missions?.filter(x => x.address === addr)[0];
            expect(mission!.phoneNumber).to.equal(validNum);
            expect(mission!.description).to.equal(validDesc);
            expect(mission!.employerId).to.equal(employer.id);
            expect(mission!.missionTypeId).to.equal(missionType.id);
        })
    });

    // Create mission with new employer & new mission type
    it('can create mission with new employer & mission type', () => {  
        cy.login('Leder', '/oppdrag');   
        cy.mainFabClick();
        cy.wait(200);

        const data = {address: 'createMissionTest2', missionTypeName: 'newMissionType', employerName: 'newEmployer'};
        cy.get('.form-address input').type(data.address);   

        cy.get('.form-missionTypeName input').type(data.missionTypeName);
        cy.get('.form-employerName input').type(data.employerName);

        cy.contains('Legg til').click();
        cy.wait('@createMission');
        cy.storeState<StateMissions & StateEmployers & StateMissionTypes>().then(state => {
            const mission = state.missions?.filter(x => x.address === data.address)[0];
            const employers = state.employers!.filter(x => x.id === mission!.employerId);    
            const types = state.missionTypes!.filter(x => x.id === mission!.missionTypeId);

            expect(employers).to.have.lengthOf(1);
            expect(employers[0].name).to.equal(data.employerName);

            expect(types).to.have.lengthOf(1);
            expect(types[0].name).to.equal(data.missionTypeName);
        })

    })

    // Show current values and update
    it('shows current values on update & updates changed values', () => {
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer' , { missionTypes: [missionType], employers: [employer], missions: [mission]});  
        cy.contains('Mer').click();
        cy.contains('Rediger').click();
        cy.wait(200);

        const updatedValues = { address: "updatedAddress", phoneNumber: "3424" }
        //Check that existing values are filled in
        cy.get('.form-address input').invoke('val').should('equal', mission.address);      
        cy.get('.form-phoneNumber input').invoke('val').should('equal', mission.phoneNumber);   
        cy.get('.form-description textarea').invoke('val').should('equal', mission.description);        
        cy.get('.form-employerName input').invoke('val').should('equal', employer.name);
        cy.get('.form-missionTypeName input').invoke('val').should('equal', missionType.name);
        cy.get('.form-finished input').should('not.be.checked');

        //Update values
        cy.get('.form-address input').clear().type(updatedValues.address);
        cy.get('.form-phoneNumber input').clear().type(updatedValues.phoneNumber);
        cy.get('.form-employerName input').clear();
        cy.get('.form-missionTypeName input').clear();

        cy.get('.actions-container').contains('Oppdater').click();
        cy.wait('@updateMission');

        cy.storeState<StateMissions>().then(state => {
            const missions = state.missions?.filter(x => x.address === updatedValues.address);

            expect(missions).to.have.lengthOf(1);
            expect(missions![0].phoneNumber).to.equal(updatedValues.phoneNumber);
            expect(missions![0].missionTypeId).to.be.undefined;
            expect(missions![0].employerId).to.be.undefined;
        })
    })

    //Can delete
    it('Can delete current mission', () => {
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer' , { missionTypes: [missionType], employers: [employer], missions: [mission]});  
        cy.contains('Mer').click();
        cy.contains('Rediger').click();
        cy.wait(200);

        cy.get('lib-form-sheet-nav-bar').contains('delete_forever').click().confirmDelete();
        cy.wait('@deleteMission');

        cy.storeState<StateMissions>().then(state => {
            const missions = state.missions?.filter(x => x.id === mission.id);
            expect(missions).to.have.lengthOf(0);
        })
    })
});