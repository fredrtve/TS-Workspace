import { ApiUrl } from "@core/api-url.enum";
import { User } from "@core/models";
import { Roles } from "@core/roles.enum";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";
import { cyTag } from "cypress/support/commands";

describe('User Password Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    const user : User = { 
        userName: "test", firstName: "first", lastName: "last", phoneNumber: "321321", email: "email@bs.no",
        role: Roles.Ansatt
    }

    beforeEach(() => {
        cy.intercept('PUT', '**' + ApiUrl.Users + '/**/NewPassword', { statusCode: 204, delay: 100 }).as('update');   
        cy.intercept('GET', '**' + ApiUrl.Users, { statusCode: 204, delay: 100 });   
    })

    it('Can fill in form with validation', () => {  
        cy.login('Leder', '/brukere', { users:  [user] }); 
        cy.getCy("user-list-card").find(cyTag("new-password-button")).click();

        cy.getCy("form-userName").find('mat-form-field').should('have.class', 'mat-form-field-disabled');

        isNotSubmittable();

        const newPassword = "newPassword";

        cy.assertTextFormControl("newPassword", newPassword, [
            _stringGen(ValidationRules.UserPasswordMaxLength + 1),
            _stringGen(ValidationRules.UserPasswordMinLength - 1)
        ])

        cy.getCy("form-confirmPassword", "input").type("notsamepassword");

        isNotSubmittable();

        cy.getCy("form-confirmPassword", "input").clear().type(newPassword);

        isSubmittable();

        cy.getCy('submit-form').click();
        cy.wait('@update');
    });

});