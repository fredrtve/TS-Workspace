import { ApiUrl } from "@core/api-url.enum";
import { Employer } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Mission Note Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.Employer, { statusCode: 204, delay: 100 }).as('create');    
    })

    it('can fill in form and create mission note', () => {  
        cy.login('Leder', '/data', {}); 

        cy.getCy("data-property-picker").click();
        cy.getCy('select-employers').click();

        cy.getCy('bottom-bar-action').filter(':contains("Lag ny")').click();

        isNotSubmittable();

        const newModel: Employer = { name: "newname", phoneNumber: "232131", address: "newaddress", email: "new@email.com" };

        //Check validation rules for name then fill in valid value
        cy.assertTextFormControl("name", newModel.name, [
            _stringGen(ValidationRules.NameMaxLength + 1)
        ])
        isSubmittable();

        //Check validation rules for phoneNumber then fill in valid value
        cy.assertTextFormControl("phoneNumber", newModel.phoneNumber!, [
            _stringGen(ValidationRules.PhoneNumberMaxLength + 1),
            _stringGen(ValidationRules.PhoneNumberMinLength - 1)
        ])
        isSubmittable();

        //Check validation rules for address then fill in valid value
        cy.assertTextFormControl("address", newModel.address!, [
            _stringGen(ValidationRules.AddressMaxLength + 1)
        ])
        isSubmittable();

        //Check validation rules for email then fill in valid value
        cy.assertTextFormControl("email", newModel.email!, ["invalidemail"])
        isSubmittable();

        //Submit and check that new note exists in state
        cy.getCy('submit-form').click();
        cy.wait('@create');
        cy.storeState<ModelState>().then(state => {
            const model = state.employers![0];
            expect(model.id).to.exist;
            expect(model.name).to.eq(newModel.name);
            expect(model.phoneNumber).to.eq(newModel.phoneNumber);        
            expect(model.address).to.eq(newModel.address);       
            expect(model.email).to.eq(newModel.email);
        })
    });

});