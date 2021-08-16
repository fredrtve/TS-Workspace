import { StateCurrentUser } from "@core/state/global-state.interfaces";

describe('Side bar', () => {

    const getPage = (page: string) => 
        cy.get('app-nav-item > a').filter(`:contains("${page}")`);

    const openMenu = () => cy.contains('menu').click();

    beforeEach(() => {
        cy.login('Leder', '/', {});
        openMenu();
    })

    it('Should open and close', () => {
        cy.get('mat-sidenav').should('be.visible');
        cy.get('body').click(310, 250);
        cy.get('mat-sidenav').should('not.be.visible');
    })

    it('Should display name, connection status and highlight current page', () => {  
        getPage("Hjem").should('have.class', 'color-accent');  
        cy.storeState<StateCurrentUser>().then(s => {
            cy.get('app-main-side-nav-header')
                .should('contain', `${s.currentUser!.firstName!} ${s.currentUser!.lastName!}`)
                .should('contain', "Tilkoblet internett");

            cy.goOffline();

            cy.get('app-main-side-nav-header')
                .should('contain', "Frakoblet internett");

            cy.goOnline()
        })    
    })

    it('Should toggle admin pages visibility with drop down', () => {
        getPage('Data').should('not.be.visible');
        getPage('Administrering').click();
        getPage('Data').should('be.visible');
        getPage('Administrering').click();
        getPage('Data').should('not.be.visible');
    })

    it('Should navigate to pages', () => {
        const assertions = [
            { page: 'Oppdrag', href: '/oppdrag'},
            { page: 'Hjem', href: '/hjem'},
            { page: 'Timer', href: '/mine-timer'},
            { page: 'Timestatistikk', href: '/timestatistikk'},
            { page: 'Min Profil', href: '/profil'}, 
        ]

        const adminAssertions = [
            { page: 'Data', href: '/data'},
            { page: 'Brukere', href: '/brukere'},
            { page: 'Timer', href: '/timeadministrering'},
        ]

        for(const {page, href} of assertions)
            getPage(page).should('have.attr', 'href').and('include', href);

        cy.get('app-nav-item').filter(`:contains("Administrering")`).within(() => {
            for(const {page, href} of adminAssertions)
                getPage(page).should('have.attr', 'href').and('include', href);
        })
        
    })
})