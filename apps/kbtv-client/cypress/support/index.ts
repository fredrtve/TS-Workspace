// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
import { Immutable } from 'global-types';
import { StateAction } from 'state-management';
import './commands';

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charLength = chars.length;
export function _stringGen(length: number): string{
    var id = '';
    for ( var i = 0; i < length; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return id;
}

declare global {
    namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      login(role: 'Leder' | 'Mellomleder' | 'Ansatt', redirectUrl: string, syncState?: object): Chainable
      
      navigateBack(): Chainable

      closeForm(): Chainable

      mainFabClick(): Chainable

      storeDispatch<TAction extends StateAction>(action: Immutable<TAction>): Chainable

      storeState<TState>(): Chainable<Immutable<TState>>

      dialogConfirm(): Chainable

      ionSelect(col: number, i: number): Chainable

      ionTimeSelect(params: { hour: number, minutes: number }, minuteInterval?: number): Chainable

      ionDateSelect(params: {year: number, month: number, day: number}): Chainable

      goOffline(): Chainable
  
      goOnline(): Chainable

      getCy(value: string, extendedSelector?: string): Chainable
    }
  }
}