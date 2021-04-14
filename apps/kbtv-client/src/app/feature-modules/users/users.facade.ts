import { Injectable } from "@angular/core";
import { _groupBy } from 'array-helpers';
import { User } from "@core/models";
import { Immutable, ImmutableArray, Maybe } from 'global-types';
import { Store } from 'state-management'
import { map } from "rxjs/operators";
import { StoreState } from './store-state';
import { FetchModelsAction } from "model-state";
import { Roles } from "@core/roles.enum";
import { UpdateUserPasswordAction } from "@actions/user-actions";

@Injectable({providedIn: 'any'})
export class UsersFacade {

  sortedUsers$ = 
    this.store.selectProperty$<User[]>("users").pipe(map(x => x ? this.sortByRole(x) : null));
  
  get users() { return this.store.state.users; }

  constructor(private store: Store<StoreState>) {}

  updatePassword(userName: string, newPassword: string): void{
    this.store.dispatch(<UpdateUserPasswordAction>{ type: UpdateUserPasswordAction, newPassword, userName })
  }

  fetchUsers():void{ this.store.dispatch({type: FetchModelsAction, props: ["users"]}) }
  
  private sortByRole = (users: Maybe<ImmutableArray<User>>): Immutable<User>[] => {
    let grouped = _groupBy(users, "role"); 
    let result: Immutable<User>[] = [];

    for(let role of Object.keys(Roles).map(key => Roles[key as keyof typeof Roles])) 
      if(grouped[role]) result = result.concat(grouped[role])

    return result;
  }
}
