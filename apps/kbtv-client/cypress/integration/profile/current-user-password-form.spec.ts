import { ApiUrl } from "@core/api-url.enum";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Current User Password Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    const assertPwField = (field: string, value: string) => {
        cy.assertTextFormControl(field, value, [
            _stringGen(ValidationRules.UserPasswordMaxLength + 1),
            _stringGen(ValidationRules.UserPasswordMinLength - 1)
        ]);
    }

    beforeEach(() => {
        cy.intercept('PUT', '**' + ApiUrl.Auth + '/changePassword', { statusCode: 204, delay: 100 }).as('update');    
    })

    it('Can fill in form with validation', () => {  
        cy.login('Leder', '/profil', {}); 

        cy.getCy("profile-action").contains("Oppdater passord").click();

        isNotSubmittable();

        const newPassword = "newPassword";

        assertPwField("oldPassword", "randompassword");
        assertPwField("newPassword", newPassword);

        cy.getCy("form-confirmPassword", "input").type("notsamepassword");

        isNotSubmittable();

        cy.getCy("form-confirmPassword", "input").clear().type(newPassword);

        isSubmittable();

        cy.getCy('submit-form').click();
        cy.wait('@update');
    });

});