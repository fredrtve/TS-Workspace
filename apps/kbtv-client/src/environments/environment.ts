// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false, 
  testing: true,
  apiUrl: 'https://localhost:44379/api',
  baseUrl: '',
  googleMapsKey: 'AIzaSyBUWZmwjGN92B3PoNS6x6qpOmc3xrP55d8', 
  inboundEmailDomain: 'rapporter.bjbygg.no',
  resourceFolders: {
    baseUrl: 'https://bjbygg-assets.azureedge.net',
    missionImage: 'oppdrag-bilder',
    missionImageThumbnail: 'oppdrag-thumbnail',
    originalMissionImage: 'oppdrag-original',
    document: 'documents',
    missionHeader: 'missionheader',
  },
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
