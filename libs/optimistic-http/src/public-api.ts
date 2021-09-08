/**
 * A library for sending optimistic http requests.  
 * @remarks 
 * The library ensures that http requests are executed sequentially and http errors handled correctly.
 * @packageDocumentation
 */

export * from './lib/http.queuer';
export * from './lib/interfaces';
export * from './lib/optimistic-http.module';

export * from './lib/constants/injection-tokens.const';

export * from './lib/create-action-request-map.helper';

export * from './lib/state/actions'
