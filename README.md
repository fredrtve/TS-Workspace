[Root](./README.md)

# Fredtvet Ts Workspace

A mono repo workspace with a collection of typescript/angular libraries and application primarily built for learning purposes.  

## Applications

|  Application | Description |
|  --- | --- |
|  [Kbtv-client](./apps/kbtv-client/README.md) | An app for managing missions and work hours for a small renovation company |

## Libraries

[API documentation](./docs/index.md)

|  Library | Description |
|  --- | --- |
|  [array-helpers](./libs/array-helpers/README.md) | A library of helper functions related to arrays &amp; object arrays |
|  [cdk-selectable](./libs/cdk-selectable/README.md) | A component development kit used to create a set of selectable components |
|  [confirm-dialog](./libs/confirm-dialog/README.md) | A library for rendering a confirmation dialog that forces the user to take action |
|  [date-time-helpers](./libs/date-time-helpers/README.md) | A library of helper functions for date logic |
|  [dynamic-forms](./libs/dynamic-forms/README.md) | A library for rendering forms dynamically by specifiying a set of controls and components |
|  [mat-dynamic-form-controls](./libs/mat-dynamic-form-controls/README.md) | A library of angular material form controls for dynamic-forms |
|  [form-sheet](./libs/form-sheet/README.md) | A library for rendering dynamic forms in a mat bottom sheet. |
|  [global-types](./libs/global-types/README.md) | A library of generic typescript types |
|  [global-utils](./libs/global-utils/README.md) | A collection of generic utility functions |
|  [google-places-autocomplete](./libs/google-places-autocomplete/README.md) | Clone of https://www.npmjs.com/package/ngx-google-places-autocomplete without use of CommonJS |
|  [model](./libs/model/README.md) | A collection of libraries used to handle relational model state. |
|  [optimistic-http](./libs/optimistic-http/README.md) | A library for sending optimistic http requests. |
|  [state-auth](./libs/state-auth/README.md) | A library with services that assists in authorizing users. |
|  [state-db](./libs/state-db/README.md) | A library for persisting state in a local db. |
|  [state-management](./libs/state-management/README.md) | A library for managing local and global state in a redux like pattern. |
|  [state-sync](./libs/state-sync/README.md) | A library for synchronizing state with an external api. |

## Building libraries

Run `npm run buildLibs` to build all libraries. 
Optionally run `ng build <library>` to build a specified library.

## Running unit tests

Run `ng run {projectName}:test` to execute the unit tests for given project via [Karma](https://karma-runner.github.io).

However the majority lack tests at this moment except 'dynamic-forms', 'model' & 'array-helpers'.

## Running e2e tests

1. Build libraries if not already built.
2. Run `npm run buildTest` to build e2e application.
3. Run `http-server dist/kbtv-client-e2e` to host the application on localhost.
3. Run `ng run kbtv-client:cypress-open` to open test panel via [Cypress](https://www.cypress.io).
