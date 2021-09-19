import { ApiUrl } from "@core/api-url.enum";
import { GlobalActions } from "@core/global-actions";
import { Mission, MissionNote } from "@core/models";
import { cyTag } from '../../support/commands';

describe('Mission Note List', () => {

    const getNotes = () => cy.getCy('mission-note-item');
    const getNote = (i: number) => getNotes().eq(i - 1);

    const mission : Mission = { id: '1', address: 'address' };
    const note1 : MissionNote = { id: '1', missionId: "1", title: 'title1', content: 'content1', createdAt: new Date().getTime(), createdBy: 'Leder' };
    const note2 : MissionNote = { id: '2', missionId: "2", title: 'title2', content: 'content2' };
    const note3 : MissionNote = { id: '3', missionId: "1", content: 'content3' };

    beforeEach(() => {
        cy.login("Leder", "/oppdrag/" + mission.id + "/detaljer/notater", { 
            missions: [mission], missionNotes: [note1, note2, note3]
        })
    })

    it('should display mission notes for mission', () => {
        getNotes().should('have.length', 2);
        getNote(1).find(cyTag('note-title')).invoke('text').should('eq', note1.title);
        getNote(1).find(cyTag('note-content')).invoke('text').should('eq', note1.content);
        getNote(1).find(cyTag('note-footer')).invoke('text').should('contain', note1.createdBy!);
        getNote(1).find(cyTag('note-footer')).invoke('text').should('contain', new Date(note1.createdAt!).getFullYear());
        getNote(2).find(cyTag('note-content')).invoke('text').should('eq', note3.content);
    });

    it('should add new note to start of list', () => {
        cy.intercept('POST', '**' + ApiUrl.MissionNote, { statusCode: 204, delay: 100 }).as('createMissionNote');
        const newNote = { content: 'newnote', missionId: mission.id };
        cy.storeDispatch(GlobalActions.saveModel<any>({ 
            stateProp: "missionNotes", entity: newNote
        }));
        cy.wait('@createMissionNote');
        getNote(1).find(cyTag('note-content')).invoke('text').should('eq', newNote.content);
    });

    
})