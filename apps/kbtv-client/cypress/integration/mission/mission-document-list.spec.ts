import { ApiUrl } from "@core/api-url.enum";
import { SaveModelFileAction } from "@core/global-actions";
import { Employer, Mission, MissionDocument } from "@core/models";
import { SaveModelAction } from "model/state-commands";

describe('Mission Document List', () => {

    const getDocuments = () => cy.getCy('mission-document-item');
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

        getDocument(1).trigger('pointerdown', { button: 0});

        cy.getCy('top-nav-title').should('contain', '1 dokument valgt');

        getDocument(2).trigger('pointerdown', { button: 0});

        cy.getCy('top-nav-title').should('contain', '2 dokumenter valgt');

        cy.getCy('top-nav-action').filter(":contains('delete_forever')").click().dialogConfirm();

        getDocuments().should('have.length', 1);
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
        getDocument(1).trigger('pointerdown', { button: 0});
        cy.wait(500);
        cy.getCy('top-nav-action').filter(":contains('send')").click();
        cy.getCy('form-sheet-title').should('contain', 'Send dokumenter');
        cy.getCy('form-email','input').invoke('val').should('contain', employer.email)
    });
    
})