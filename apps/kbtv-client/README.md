[Root](../../README.md) &gt; [Kbtv-client](./README.md)

# Kbtv Client

A mobile first angular app for managing missions and timesheets for a small renovation company. 

Angular has been chosen as framework primarily for learning purposes. 

[Open live demo](https://kbtv.z16.web.core.windows.net/demo)

## Motivation

Primary motivation for this project is assisting a small renovation company in managing missions and related images, documents and timesheets. In addition there has been a focus on learning new technologies and software principles.

## Features
1. Home page with page navigations, previously viewed missions & quick access to nearest mission.
2. Mission list & map pages for navigating missions.
3. Mission details pages for detailed information, car directions and editing of mission, including images, documents and notes. 
4. Timesheet pages for employees to view and manage timesheets.
5. Timesheet admin pages for approving or editing timesheets for employees.
6. Timesheets statistics page with aggregated timesheets and export capabilities.
7. Data management page to create, edit or delete various data types.
8. User managment page to create, edit or delete users. 
9. Profile page for various settings, updating profile or password, and logging out. 
10. Offline support for most use cases.
11. Responsive design that works on both mobile and desktop

## Running e2e tests

1. Build libraries if not already built.
2. Run `npm run buildTest` to build e2e application.
3. Run `http-server dist/kbtv-client-e2e` to host the application on localhost.
3. Run `ng run kbtv-client:cypress-open` to open test panel via [Cypress](https://www.cypress.io).

## Related projects
- [Kbtv-webapi](https://github.com/fredtvet/Kbtv-webapi/blob/master/README.md) - A compatible web api for use with this application. 
