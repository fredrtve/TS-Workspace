import { ApplicationModule, ModuleWithProviders, NgModule } from '@angular/core';
import { STORE_EFFECTS, STORE_REDUCERS } from 'state-management';
import { IfRoleDirective } from './if-role.directive';
import { AUTH_COMMAND_API_MAP, AUTH_DEFAULT_REDIRECTS } from './injection-tokens.const';
import { AuthCommandApiMap, DefaultRedirects } from './interfaces';
import { LoginHttpEffect } from './state/login.http.effect';
import { LogoutHttpEffect } from './state/logout.http.effect';
import { RedirectToUrlEffect } from './state/redirect-to-url.effect';
import { AuthReducers } from './state/reducers';
import { RefreshTokenHttpEffect } from './state/refresh-token.http.effect';

/** Responsible for exporting diretives. 
 *  Use forRoot function to inject core providers*/
@NgModule({
    declarations: [IfRoleDirective],
    imports: [ApplicationModule],
    exports: [IfRoleDirective],
})
export class StateAuthModule {
    static forRoot(
        commandApiMap: AuthCommandApiMap, 
        defaultRedirects: DefaultRedirects
    ): ModuleWithProviders<StateAuthModule> {
        return {
            ngModule: StateAuthModule,
            providers: [
                { provide: STORE_EFFECTS, useClass: RefreshTokenHttpEffect, multi: true },  
                { provide: STORE_EFFECTS, useClass: LogoutHttpEffect, multi: true },
                { provide: STORE_EFFECTS, useClass: LoginHttpEffect, multi: true},
                { provide: STORE_EFFECTS, useClass: RedirectToUrlEffect, multi: true},
                
                { provide: STORE_REDUCERS, useValue: AuthReducers, multi: true },
                
                { provide: AUTH_COMMAND_API_MAP, useValue: commandApiMap },
                { provide: AUTH_DEFAULT_REDIRECTS, useValue: defaultRedirects },
            ]
        }
    }
}
  