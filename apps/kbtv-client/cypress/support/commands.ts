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
  cy.intercept('https://localhost:44379/api/SyncAll', { fixture: 'sync-response'});
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

Cypress.Commands.add('ionSelect', (col: number, i: number) => {
  return cy.get('ion-picker-column').eq(col)
           .find(`.picker-opts > button[opt-index="${i}"]`);
});

Cypress.Commands.add('ionDateSelect', (params: {year: number, month: number, day: number}) => {
  return cy.ionSelect(0, new Date().getFullYear() - params.year).click({force: true})
    .ionSelect(1, params.month).click({force: true})
    .ionSelect(2, params.day - 1).click({force: true});
});

Cypress.Commands.add('ionTimeSelect', (params: { hour: number, minutes: number }, minuteInterval = 15) => {
  return cy.ionSelect(0, params.hour).click({force: true})
           .ionSelect(1, params.minutes / minuteInterval).click({force: true}); 
});

Cypress.Commands.add('goOffline', () => {
  Cypress.automation('remote:debugger:protocol',
  {
    command: 'Network.enable',
  })
  Cypress.automation('remote:debugger:protocol',
  {
    command: 'Network.emulateNetworkConditions',
    params: {
      offline: true,
      latency: -1,
      downloadThroughput: -1,
      uploadThroughput: -1,
    },
  })
});

Cypress.Commands.add('goOnline', () => {
  Cypress.automation('remote:debugger:protocol',
      {
        command: 'Network.emulateNetworkConditions',
        params: {
          offline: false,
          latency: -1,
          downloadThroughput: -1,
          uploadThroughput: -1,
        },
      })
  Cypress.automation('remote:debugger:protocol',
      {
        command: 'Network.disable',
      })
});