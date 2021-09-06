import { ApiUrl } from "@core/api-url.enum";
import { Employer, User } from "@core/models";
import { Roles } from "@core/roles.enum";
import { ModelState } from "@core/state/model-state.interface";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";
import { cyTag } from "cypress/support/commands";

describe('User Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    const employer : Employer = {id:'emp', name: 'bse'}

    const user : User = { 
        userName: "test", firstName: "first", lastName: "last", phoneNumber: "321321", email: "email@bs.no",
        role: Roles.Oppdragsgiver, employerId: employer.id
    }

    beforeEach(() => {
        cy.intercept('PUT', '**' + ApiUrl.Users + '/**', { statusCode: 204, delay: 100 }).as('update');   
        cy.intercept('POST', '**' + ApiUrl.Users, { statusCode: 204, delay: 100 }).as('create'); 
        cy.intercept('GET', '**' + ApiUrl.Users, { statusCode: 204, delay: 100 });   
    })

    it('Can fill in form and create user with employee role', () => {  
        cy.login('Leder', '/brukere', { employers: [employer]}); 
        cy.mainFabClick();

        isNotSubmittable();

        const newValues = { 
            userName: "newuser", firstName: "newfirst", lastName: "newlast", phoneNumber: "3212321", 
            email: "nemail@bs.no", role: Roles.Oppdragsgiver, employerId: employer.id
        };

        cy.assertTextFormControl("userName", newValues.userName, [
            _stringGen(ValidationRules.UserNameMinLength - 1),
            _stringGen(ValidationRules.UserNameMaxLength + 1)
        ]);

        isNotSubmittable();

        cy.assertTextFormControl("password", "newpass", [
            _stringGen(ValidationRules.UserPasswordMinLength - 1),
            _stringGen(ValidationRules.UserPasswordMaxLength + 1)
        ]);

        isNotSubmittable();

        cy.assertTextFormControl("firstName", newValues.firstName, [
            _stringGen(ValidationRules.NameMaxLength + 1)
        ]);  

        isNotSubmittable();

        cy.assertTextFormControl("lastName", newValues.lastName, [
            _stringGen(ValidationRules.NameMaxLength + 1)
        ]);

        isNotSubmittable();

        //Check that employer is hiden until role is selected
        cy.getCy("form-employer").should('be.hidden');

        cy.getCy("form-role").click();
        cy.get('mat-option').contains(newValues.role).click();

        isSubmittable();

        cy.getCy("form-employer").should('not.be.hidden')
            .click().wait(200);

        cy.get("mat-option").contains(employer.name).click();

        cy.assertTextFormControl("phoneNumber", newValues.phoneNumber, [
            _stringGen(ValidationRules.PhoneNumberMinLength - 1),
            _stringGen(ValidationRules.PhoneNumberMaxLength + 1)
        ]);

        cy.assertTextFormControl("email", newValues.email, ["invalidemail"]);

        isSubmittable();

        cy.getCy('submit-form').click();
        cy.wait('@create');
        cy.storeState<ModelState>().then(state => {
            const newUser = state.users![0];
            expect(newUser).to.exist;
            for(const prop in newValues)
                expect((<any> newUser)[prop]).to.eq((<any> newValues)[prop])
        })
    });

    it('Displays current values on update & can update to new values', () => {  
        const employer2 = { id:"new", name:"rde" }
        cy.login('Leder', '/brukere', { employers: [employer,employer2], users: [user]}); 
        cy.getCy("user-list-card").find(cyTag("edit-button")).click();

        isNotSubmittable();

        //Check existing values         
        cy.getCy("form-userName").find('mat-form-field').should('have.class', 'mat-form-field-disabled');
        cy.getCy("form-employer").should("contain", employer.name);
        cy.getCy("form-role").should("contain", user.role);

        for(const prop of ["firstName", "lastName", "phoneNumber", "email"])
             cy.getCy("form-"+prop, "input").invoke("val").should("eq", (<any> user)[prop]);
        
        const newValues = { 
            firstName: "newfirst", lastName: "newlast", role: Roles.Oppdragsgiver, employerId: employer2.id
        };

        cy.assertTextFormControl("firstName", newValues.firstName, [
            _stringGen(ValidationRules.NameMaxLength + 1)
        ]);  

        isSubmittable();

        cy.assertTextFormControl("lastName", newValues.lastName, [
            _stringGen(ValidationRules.NameMaxLength + 1)
        ]);

        cy.getCy("form-employer").should('not.be.hidden')
            .click().wait(200);

        cy.get("mat-option").contains(employer2.name).click();

        cy.getCy('submit-form').click();
        cy.wait('@update');
        cy.storeState<ModelState>().then(state => {
            const updatedUser = state.users![0];
            expect(updatedUser).to.exist;
            expect(updatedUser.phoneNumber).to.eq(user.phoneNumber);
            expect(updatedUser.email).to.eq(user.email);
            for(const prop in newValues)
                expect((<any> updatedUser)[prop]).to.eq((<any> newValues)[prop]);
            
        })
    });

    it("Should set employerId to undefined if role changes from employer", () => {
        cy.login('Leder', '/brukere', { employers: [employer], users: [user]}); 
        cy.wait(300);
        cy.getCy("user-list-card").find(cyTag("edit-button")).click();

        cy.getCy("form-role").click();
        cy.get('mat-option').contains(Roles.Ansatt).click();

        cy.getCy('submit-form').click();
        cy.wait('@update');

        cy.storeState<ModelState>().then(state => {
            const updatedUser = state.users![0];
            expect(updatedUser.role).to.eq(Roles.Ansatt);
            expect(updatedUser.employerId).to.be.undefined;
        }) 
    })
});