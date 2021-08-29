import { NgZone } from "@angular/core";
import 'cypress-file-upload';
import { LoginResponse } from "state-auth";
import { SetPersistedStateAction } from "state-db";
import { Store } from "state-management";
import { StateSyncConfig } from "state-sync";

export const cyTag = (value: string) => `[data-cy="${value}"]`;

Cypress.Commands.add('login', (role: 'Leder' | 'Mellomleder' | 'Ansatt', redirectUrl: string, initState: object) => {
  window.localStorage.clear();
  window.indexedDB.deleteDatabase("kbtvDb");
  cy.intercept('https://localhost:44379/api/SyncAll/**', { fixture: 'empty-sync-response'});
  cy.intercept('https://localhost:44379/api/SyncAll**', { fixture: 'empty-sync-response'});
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
  cy.getCy('cancel').last().click();
});

Cypress.Commands.add('closeForm', () => {
  cy.getCy('form-sheet-close').click();
  cy.wait(400);
});

Cypress.Commands.add('mainFabClick', () => {
  cy.getCy('main-fab').last().click();
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

Cypress.Commands.add('dialogConfirm', () => {
  cy.getCy('dialog-confirm').click();
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

Cypress.Commands.add('getCy', (value: string | string[], extendedSelector: string = '') => {
  let selector : string = "";
  if(Array.isArray(value)) 
    for(const val of value) selector = selector + ' ' + cyTag(val);
  else selector = cyTag(value);
  return cy.get(`${selector} ` + extendedSelector);
});

Cypress.Commands.add('submitForm', () => {
  return cy.getCy('submit-form').click({force:true})
});