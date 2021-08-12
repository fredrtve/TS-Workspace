import { ChangeDetectionStrategy, Component, Injector, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Store } from 'state-management';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'test-client';
  constructor(store: Store<unknown>, ngZone: NgZone){ 
    const testWindow = <any> window;
    if(environment.testing) {
      testWindow.store = store;
      testWindow.ngZone = ngZone;
    };
  }
}