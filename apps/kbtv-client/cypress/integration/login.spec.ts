describe('Login', () => {

  it('Should redirect to home, get access & refresh token when logged in', () => {
    cy.visit('/')
    cy.get("#mat-input-0").type("leder");
    cy.get("#mat-input-1").type("passord1");
    cy.contains("Logg inn").click();
    cy.wait(2000)
    cy.url().should('contain', '/hjem');
    cy.should(() => {
      expect(localStorage.getItem('refreshToken')).not.null;
      expect(localStorage.getItem('accessToken')).not.null;
    });
  })

  it('Should get unauthorized warning when wrong credentials', () => {
    cy.visit('/')
    cy.get("#mat-input-0").type("leder");
    cy.get("#mat-input-1").type("wrongpw");
    cy.contains("Logg inn").click();
    cy.wait(2000)
    cy.contains("Brukernavn eller passord er feil!").should('exist')
  })
})
