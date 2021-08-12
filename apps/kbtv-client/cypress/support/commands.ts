import { NgZone } from "@angular/core";
import 'cypress-file-upload';
import { LoginResponse } from "state-auth";
import { SetPersistedStateAction } from "state-db";
import { Store } from "state-management";
import { StateSyncConfig } from "state-sync";

Cypress.Commands.add('login', (role: 'Leder' | 'Mellomleder' | 'Ansatt', redirectUrl: string, initState: object) => {
  window.localStorage.clear();
  window.indexedDB.deleteDatabase("kbtvDb");
  cy.intercept('https://localhost:44379/api/SyncAll/**', { fixture: 'sync-response'}).as('sync');
  cy.fixture('initial-state').then((initialState: LoginResponse & StateSyncConfig) => {
      initialState.user.role = role;
      localStorage.setItem('accessToken', JSON.stringify(initialState.accessToken.token));
      localStorage.setItem('accessTokenExpiration', JSON.stringify((new Date().getTime() + 100000)));
      localStorage.setItem('refreshToken', JSON.stringify(initialState.refreshToken!));
      localStorage.setItem('currentUser', JSON.stringify(initialState.user));   
      localStorage.setItem('syncConfig', JSON.stringify(initialState.syncConfig)); 
      cy.visit( redirectUrl );
      cy.wait(100);
      cy.storeDispatch<SetPersistedStateAction>({ type: SetPersistedStateAction, state: initState, storageType: "localStorage"}) 
  })
});

Cypress.Commands.add('navigateBack', () => {
  cy.get('.cancel-button > .mat-button').last().click();
});

Cypress.Commands.add('closeForm', () => {
  cy.get('mat-bottom-sheet-container').contains('close').click();
  cy.wait(400);
});

Cypress.Commands.add('mainFabClick', () => {
  Cypress.log({ name: 'mainFabClick' });
  cy.get('.fab-container').find('.mat-fab').last().click();
});

Cypress.Commands.add('storeDispatch', (action) => {
  cy.window().then(window => {
    const win = <{store: Store<any>, ngZone: NgZone}> <unknown> window;
    win.ngZone.run(() => win.store.dispatch(action) )
  })
});

Cypress.Commands.add('storeState', () => {
  cy.window().then(window => {
    const win = <{store: Store<any>}> <unknown> window;
    return win.store.state;
  })
});

Cypress.Commands.add('confirmDelete', () => {
  cy.get('.mat-dialog-actions').contains('Slett').click();
});