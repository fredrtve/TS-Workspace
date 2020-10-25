import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiUrl } from 'src/app/core/api-url.enum';
import { User } from "src/app/core/models";
import { ApiService } from '../core/services/api.service';
import { BaseModelStore } from '../core/services/state/abstracts/base-model.store';
import { ObservableStoreBase } from '../core/services/state/observable-store-base';
import { Roles } from '../shared-app/enums';
import { _groupBy } from '../shared-app/helpers/array/group-by.helper';
import { StoreState } from './store-state';

@Injectable({
  providedIn: 'any',
})
export class UsersStore extends BaseModelStore<StoreState> {

  sortedUsers$: Observable<User[]> = this.modelProperty$<User[]>("users").pipe(map(x => this.sortByRole(x)));
  
  get users(): User[]{ return this.getStateProperty("users"); }

  constructor(
    base: ObservableStoreBase,
    apiService: ApiService,
  ) {
    super(base, apiService);

    this.sortedUsers$ = this.modelProperty$("users").pipe(map(this.sortByRole));
  }

  updatePassword(userName: string, newPassword: string): void{
    this.apiService
      .put(`${ApiUrl.Users}/${userName}/NewPassword`, {newPassword, userName}).subscribe();
  }
  
  private sortByRole = (users: User[]): User[] => {
    if(!users) return [];

    let grouped = _groupBy(users, "role"); 
    let result = [];

    for(let role of Object.keys(Roles).map(key => Roles[key])) 
      if(grouped[role]) result = result.concat(grouped[role])

    return result;
  }
}
