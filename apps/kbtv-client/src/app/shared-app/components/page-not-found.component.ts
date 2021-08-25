import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
  <style>
    .container{
        flex-direction: column;
        box-sizing: border-box;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        height:100%;
        color:white;
    }
  </style>
  <span class="container">  
      <span class="mat-display-1 m-0">
          404 
      </span>
      <span class="mat-h1">
          Denne siden finnes ikke!
      </span>
  </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {
    constructor(){}
}
