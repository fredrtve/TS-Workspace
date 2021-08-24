import { ApiUrl } from "@core/api-url.enum";
import { Employer, Mission, MissionImage } from "@core/models";

describe('Mission Image List', () => {

    const getImages = () => cy.getCy('mission-image-item');
    const getImage = (i: number) => getImages().eq(i - 1);

    const employer : Employer = { id: '1', name: "test", email: "test@email.com" };
    const mission : Mission = { id: '1', address: 'address', employerId: employer.id };
    const image1 : MissionImage = { id: '1', missionId: "1", fileName: "sample1_ratio=1.33.jpg" }
    const image2 : MissionImage = { id: '2', missionId: "2", fileName: "sample2_ratio=1.33.jpg" }
    const image3 : MissionImage = { id: '3', missionId: "1", fileName: "sample2_ratio=1.33.jpg" }
    const image4 : MissionImage = { id: '4', missionId: "1", fileName: "notexisting.jpg" }

    beforeEach(() => {
        cy.login("Leder", "/oppdrag/" + mission.id + "/detaljer/bilder", { 
            missions: [mission], missionImages: [image1, image2, image3, image4], employers: [employer]
        })
    })

    it('should display mission images for mission', () => {
        getImages().should('have.length', 3)
        getImage(1).should('have.attr', 'src').should('include', image1.fileName);
        getImage(2).should('have.attr', 'src').should('include', image3.fileName);
        cy.wait(200);
        getImage(3).should('have.attr', 'src').should('include', "notfound.png");
    });

    it('can select images, get selection count and delete selected images', () => {
        cy.intercept('POST', '**' + ApiUrl.MissionImage + '/DeleteRange', { statusCode: 204, delay: 100 }).as('deleteMissionImg');

        getImage(1).trigger('pointerdown', { button: 0});

        cy.getCy('top-nav-title').should('contain', '1 bilde valgt');

        getImage(2).trigger('pointerdown', { button: 0});

        cy.getCy('top-nav-title').should('contain', '2 bilder valgt');

        cy.getCy('top-nav-action').filter(":contains('delete_forever')").click().dialogConfirm();

        getImages().should('have.length', 1);
    }); 

    it('should add new image to start of list', () => {
        cy.intercept('POST', '**' + ApiUrl.MissionImage, { statusCode: 204, delay: 100 }).as('createMissionImage');
        cy.getCy('mission-image-list-upload').invoke('removeAttr', 'style').attachFile('sample-image-1.jpg');
        getImages().should('have.length', 4);
        getImage(1).should('have.attr', 'src').should('include', "blob:");
    });

    it('can open mail form with employer email prefilled', () => {
        cy.getCy('bottom-bar-action').filter(":contains('Send')").click();
        cy.getCy('form-sheet-title').should('contain', 'Send bilder');
        cy.getCy('form-email','input').invoke('val').should('contain', employer.email)
    });

    it('open image viewer when clicked', () => {
        getImage(1).click();
        cy.url().should('contain', 'dialog=true');  
    });
    
})