import { ApiUrl } from "@core/api-url.enum";

describe('Login', () => {

  beforeEach(() => {
    cy.intercept('**' + ApiUrl.Auth + '/login').as('login');
    cy.visit('/');
  })

  it('Should redirect to home, get access & refresh token when logged in', { browser: '!firefox' }, () => {
    cy.getCy("form-userName","input").type("leder");
    cy.getCy("form-password","input").type("passord1");
    cy.getCy("submit").click();
    cy.wait("@login");
    cy.url().should('contain', '/hjem');
    cy.should(() => {
      expect(localStorage.getItem('refreshToken')).not.null;
      expect(localStorage.getItem('accessToken')).not.null;
    });
  })

  it('Should get unauthorized warning when wrong credentials', { browser: '!firefox' }, () => {
    cy.getCy("form-userName","input").type("leder");
    cy.getCy("form-password","input").type("wrongpw");
    cy.getCy("submit").click();
    cy.wait("@login");
    cy.getCy('notification').should('exist');
    cy.getCy('notification-title').should('contain', "Brukernavn eller passord er feil!");
  })
})
