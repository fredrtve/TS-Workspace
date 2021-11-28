import { Pipe, PipeTransform } from '@angular/core';
import { ImmutableArray, Maybe } from '@fretve/global-types';
import { CurrentUser, StateCurrentUser } from 'state-auth';
import { Store } from 'state-management';

@Pipe({name: 'ifRole', pure: false})
export class IfRolePipe implements PipeTransform {

    private get currentUser(): CurrentUser { return this.store.state.currentUser; }

    constructor(private store: Store<StateCurrentUser>){}

    transform(roles: Maybe<ImmutableArray<string>>) {
        return !roles?.length || (this.currentUser && roles.indexOf(this.currentUser.role)  !== -1)
    }

}
