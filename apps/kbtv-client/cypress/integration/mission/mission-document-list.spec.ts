import { ApiUrl } from "@core/api-url.enum";
import { SaveModelFileAction } from "@core/global-actions";
import { Employer, Mission, MissionDocument } from "@core/models";
import { SaveModelAction } from "model/state-commands";

describe('Mission Document List', () => {

    const getDocuments = () => cy.get('app-mission-document-list .main-content > div').children();
    const getDocument = (i: number) => getDocuments().eq(i - 1);

    const employer : Employer = { id: '1', name: "test", email: "test@email.com" };
    const mission : Mission = { id: '1', address: 'address', employerId: employer.id };
    const doc1 : MissionDocument = { id: '1', name: 'test1', missionId: "1", fileName: "sample1.pdf" }
    const doc2 : MissionDocument = { id: '2', name: 'test2', missionId: "2", fileName: "sample2.txt" }
    const doc3 : MissionDocument = { id: '3', name: 'test3', missionId: "1", fileName: "sample2.txt" }
    const doc4 : MissionDocument = { id: '4', name: 'test4', missionId: "1", fileName: "notexisting.txt" }

    beforeEach(() => {
        cy.login("Leder", "/oppdrag/" + mission.id + "/detaljer/dokumenter", 
            { missions: [mission], missionDocuments: [doc1, doc2, doc3, doc4], employers: [employer] });

    })

    it('should display mission documents for mission with correct extension', () => {
        getDocuments().should('have.length', 3);
        [doc1, doc3, doc4].forEach((doc, i) => {
            getDocument(i+1).contains(doc.name);
            getDocument(i+1).contains(doc.fileName!.split('.')[1], { matchCase: false });
        });
    });

    it('can select documents, get selection count and delete selected documents', () => {
        cy.intercept('POST', '**' + ApiUrl.MissionDocument + '/DeleteRange', { statusCode: 204, delay: 100 }).as('deleteMissionDoc');  

        cy.get('app-selectable-card').eq(0)
            .trigger('pointerdown', { button: 0});

        cy.get('app-main-top-nav-bar .title-container').should('contain', '1 dokument valgt');

        cy.get('app-selectable-card').eq(2)
            .trigger('pointerdown', { button: 0});

        cy.get('app-mission-document-list app-main-top-nav-bar .title-container')
            .should('contain', '2 dokumenter valgt');

        cy.get('app-mission-document-list app-main-top-nav-bar')
            .contains('delete_forever').click().confirmDelete();

        cy.get('app-selectable-card').should('have.length', 1);
    }); 

    it('should add new document to start of list', () => {
        cy.intercept('POST', '**' + ApiUrl.MissionDocument, { statusCode: 204, delay: 100 }).as('createMissionDoc');
        const newDoc = { name: 'newdocument', missionId: mission.id };
        cy.storeDispatch<SaveModelFileAction<MissionDocument>>({ 
            type: SaveModelAction, stateProp: "missionDocuments", saveAction: 0, entity: newDoc, file: new File([], "test.txt")
        });
        getDocument(1).should('contain', newDoc.name);
    });

    it('can open mail form for selected documents with employer email prefilled', () => {
        cy.get('app-selectable-card').eq(0)
            .trigger('pointerdown', { button: 0});
        cy.get('app-mission-document-list app-main-top-nav-bar').contains('send').click();
        cy.contains('Send dokumenter');
        cy.get('.form-email input').invoke('val').should('contain', employer.email)
    });
    
})