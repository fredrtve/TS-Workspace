import { Injectable } from "@angular/core";
import { User } from "@core/models";
import { Roles } from "@core/roles.enum";
import { ModelState } from "@core/state/model-state.interface";
import { _groupBy } from '@fretve/array-helpers';
import { Immutable, ImmutableArray, Maybe } from '@fretve/global-types';
import { map } from "rxjs/operators";
import { Store } from 'state-management';
import { UserActions } from "./state/actions.const";
import { StoreState } from './store-state';

@Injectable({providedIn: 'any'})
export class UsersFacade {

  sortedUsers$ = 
    this.store.selectProperty$("users").pipe(map(x => x ? this.sortByRole(x) : null));
  
  get users() { return this.store.state.users; }

  constructor(private store: Store<StoreState>) {}

  updatePassword = (userName: string, newPassword: string) =>
    this.store.dispatch(UserActions.updatePassword({ newPassword, userName }));
  

  fetchUsers = () => 
    this.store.dispatch(UserActions.fetch<ModelState>({ props: ["users"]})) 
  
  private sortByRole = (users: Maybe<ImmutableArray<User>>): Immutable<User>[] => {
    let grouped = _groupBy(users, "role"); 
    let result: Immutable<User>[] = [];

    for(let role of [Roles.Leder, Roles.Mellomleder, Roles.Ansatt, Roles.Oppdragsgiver]) 
      if(grouped[role]) result = result.concat(grouped[role])

    return result;
  }
}
