import { ApiUrl } from "@core/api-url.enum";
import { InboundEmailPassword } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Inbound Email Password Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.InboundEmailPassword, { statusCode: 204, delay: 100 }).as('create');    
        cy.intercept('GET', '**' + ApiUrl.InboundEmailPassword + '**', { statusCode: 200 }, ); 
    })

    it('can fill in form and create inbound email password', () => {  
        cy.login('Leder', '/data', {}); 

        cy.getCy("data-property-picker").click();
        cy.getCy('select-inboundEmailPasswords').click();

        cy.getCy('bottom-bar-action').filter(':contains("Lag ny")').click();

        isNotSubmittable();

        const newModel: InboundEmailPassword = { password: "newpassword" };

        //Check validation rules for password
        cy.assertTextFormControl("password", newModel.password!, [
            _stringGen(ValidationRules.InboundEmailPasswordLength + 1)
        ])
        isSubmittable();
        
        //Submit and check that new note exists in state
        cy.getCy('submit-form').click();
        cy.wait('@create');
        cy.storeState<ModelState>().then(state => {
            const model = state.inboundEmailPasswords![0];
            expect(model.id).to.exist;
            expect(model.password).to.eq(newModel.password)
        })
    });

});