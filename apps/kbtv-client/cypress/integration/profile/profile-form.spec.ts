import { ApiUrl } from "@core/api-url.enum";
import { StateCurrentUser } from "@core/state/global-state.interfaces";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Profile Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    beforeEach(() => {
        cy.intercept('PUT', '**' + ApiUrl.Auth, { statusCode: 204, delay: 100 }).as('update');    
    })

    it('Displays current values and can update phoneNumber and email', () => {  
        cy.login('Leder', '/profil', {}); 

        cy.getCy("profile-action").contains("Oppdater profil").click();

        //Check that certain fields are disabled
        for(const field of ["userName", "firstName", "lastName"])
            cy.getCy("form-"+field).find('mat-form-field').should('have.class', 'mat-form-field-disabled');

        isNotSubmittable();

        const newInfo = { email: "new@new.com", phoneNumber: "32131" };

        //Check validation rules for phone number
        cy.assertTextFormControl("phoneNumber", newInfo.phoneNumber, [
            _stringGen(ValidationRules.PhoneNumberMinLength - 1),
            _stringGen(ValidationRules.PhoneNumberMaxLength + 1)
        ])
        isSubmittable();

        //Check validation rules for email
        cy.assertTextFormControl("email", newInfo.email, ["invalidEmail"])
        
        isSubmittable();
        //Submit and check that new note exists in state
        cy.getCy('submit-form').click();
        cy.wait('@update');
        cy.storeState<StateCurrentUser>().then(state => {
            expect(state.currentUser?.email).to.eq(newInfo.email);
            expect(state.currentUser?.phoneNumber).to.eq(newInfo.phoneNumber);
        })
    });

});