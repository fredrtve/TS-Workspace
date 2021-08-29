import { ApiUrl } from "@core/api-url.enum";
import { Employer, Mission, MissionImage } from "@core/models";
import { StateMissionImages } from "@core/state/global-state.interfaces";

describe('Mission Image Viewer', () => {

    const employer : Employer = { id: '1', name: "test", email: "test@email.com" };
    const mission : Mission = { id: '1', address: 'address', employerId: employer.id };
    const image1 : MissionImage = { id: '1', missionId: "1", fileName: "sample1_ratio=1.33.jpg" }
    const image2 : MissionImage = { id: '2', missionId: "2", fileName: "sample3_ratio=1.33.jpg" }
    const image3 : MissionImage = { id: '3', missionId: "1", fileName: "sample2_ratio=1.33.jpg" }
    const image4 : MissionImage = { id: '4', missionId: "1", fileName: "notexisting.jpg" }

    const assertImageCount = (count: number) => 
        cy.getCy('image-counter').should('contain', count).should('contain', "3")

    const assertImageSrc = (src: string) => 
        cy.getCy("current-image").should('have.attr', 'src').should('include', src);

    beforeEach(() => {
        cy.login("Leder", "/oppdrag/" + mission.id + "/detaljer/bilder", { 
            missions: [mission], missionImages: [image1, image2, image3, image4], employers: [employer]
        });
        cy.getCy('mission-image-item').first().click();
        cy.wait(500);
    })

    it('Display image and image counter', () => {
        assertImageSrc(image1.fileName!);
        assertImageCount(1);
    });

    it('Can change image & update image counter', () => {
        cy.getCy(["image-counter", "next"]).click({force: true});
        assertImageCount(2);
        assertImageSrc(image3.fileName!);
        cy.getCy(["image-counter", "previous"]).click({force: true});
        assertImageCount(1);
        assertImageSrc(image1.fileName!);
    });

    it('Displays not found image if not found', () => {
        cy.getCy(["image-counter", "next"]).click({force: true}).click({force: true});
        cy.wait(600);
        assertImageSrc("notfound.png");
    });

    it('Can delete current image', () => {
        cy.intercept('DELETE', '**' + ApiUrl.MissionImage + '/**', { statusCode: 204, delay: 100 }).as('deleteImage'); 
        cy.getCy('top-nav-action').contains('delete').click().dialogConfirm();
        cy.wait("@deleteImage");
        cy.url().should('not.contain', 'dialog=true');
        cy.storeState<StateMissionImages>().then(state => {
            const imgs = state.missionImages?.filter(x => x.id === image1.id);
            expect(imgs).to.have.lengthOf(0);
        });
    });
})