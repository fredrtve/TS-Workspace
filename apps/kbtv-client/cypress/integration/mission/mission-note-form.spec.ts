import { ApiUrl } from "@core/api-url.enum";
import { Mission, MissionNote } from "@core/models";
import { StateMissionNotes } from "@core/state/global-state.interfaces";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Mission Note Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    const mission: Mission = { id: '1', address: "new", phoneNumber: "9234", description: "desc" }
    const note: MissionNote= { id: '1', title: "tests", content: "notecontent", missionId: mission.id }

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.MissionNote, { statusCode: 204, delay: 100 }).as('createNote');
        cy.intercept('PUT', '**' + ApiUrl.MissionNote + '/**', { statusCode: 204, delay: 100 }).as('updateNote');  
        cy.intercept('DELETE', '**' + ApiUrl.MissionNote + '/**', { statusCode: 204, delay: 100 }).as('deleteNote');       
    })

    it('can fill in form and create mission note', () => {  
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer/notater', {missions: [mission]});
        cy.mainFabClick();
        cy.wait(600);

        isNotSubmittable();

        const newNote: MissionNote = { title: "testtitle", content: "testcontent" };

        //Check validation rules for title
        cy.getCy('form-content','textarea').type(_stringGen(ValidationRules.MissionNoteContentMaxLength + 1), {delay: 0});   
        cy.submitForm().getCy('form-content','mat-error').should('exist');
        isNotSubmittable();

        cy.getCy('form-content','textarea').clear().type(newNote.content!);   
        //Check that it is submittable with only content
        isSubmittable(); 

        //Check validation rules for title
        cy.getCy('form-title','input').type(_stringGen(ValidationRules.MissionNoteTitleMaxLength + 1));   
        cy.submitForm().getCy('form-title','mat-error').should('exist');
        isNotSubmittable();

        cy.getCy('form-title','input').clear().type(newNote.title!);   
        isSubmittable();

        //Submit and check that new note exists in state
        cy.getCy('submit-form').click();
        cy.wait('@createNote');
        cy.storeState<StateMissionNotes>().then(state => {
            const note = state.missionNotes![0];
            expect(note.id).to.exist;
            expect(note.title).to.equal(newNote.title);
            expect(note.content).to.equal(newNote.content);
        })
    });

    it('shows current values on update & updates changed values', () => {
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer/notater', {missions: [mission], missionNotes: [note]});
        cy.getCy("edit-note").click();
        cy.wait(200);

        const updatedValues = { title: "updatedAddress", content: "updatedContent" }
        //Check that existing values are filled in
        cy.getCy('form-title','input').invoke('val').should('equal', note.title);      
        cy.getCy('form-content','textarea').invoke('val').should('equal', note.content);   

        //Update values
        cy.getCy('form-title','input').clear().type(updatedValues.title);
        cy.getCy('form-content','textarea').clear().type(updatedValues.content);

        cy.getCy('submit-form').click();
        cy.wait('@updateNote');

        cy.storeState<StateMissionNotes>().then(state => {
            const note = state.missionNotes![0];
            expect(note.title).to.equal(updatedValues.title);
            expect(note.content).to.be.equal(updatedValues.content);
        })
    })

    it('Can delete current mission note', () => {
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer/notater', {missions: [mission], missionNotes: [note]}); 
        cy.getCy('edit-note').click();
        cy.wait(200);

        cy.getCy('form-sheet-action').filter(":contains('delete_forever')").click().dialogConfirm();
        cy.wait('@deleteNote');

        cy.storeState<StateMissionNotes>().then(state => {
            expect(state.missionNotes).to.have.lengthOf(0);
        })
    })
});