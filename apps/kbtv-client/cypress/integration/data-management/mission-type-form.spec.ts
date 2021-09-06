import { ApiUrl } from "@core/api-url.enum";
import { MissionType } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Mission Type Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.MissionType, { statusCode: 204, delay: 100 }).as('create');    
    })

    it('can fill in form and create mission type', () => {  
        cy.login('Leder', '/data', {}); 

        cy.getCy("data-property-picker").click();
        cy.getCy('select-missionTypes').click();

        cy.getCy('bottom-bar-action').filter(':contains("Lag ny")').click();

        isNotSubmittable();

        const newModel: MissionType = { name: "typename" };

        //Check validation rules for name  
        cy.assertTextFormControl("name", newModel.name!, [
            _stringGen(ValidationRules.NameMaxLength + 1)
        ])
        isSubmittable();

        //Submit and check that new note exists in state
        cy.getCy('submit-form').click();
        cy.wait('@create');
        cy.storeState<ModelState>().then(state => {
            const model = state.missionTypes![0];
            expect(model.id).to.exist;
            expect(model.name).to.eq(newModel.name)
        })
    });

});