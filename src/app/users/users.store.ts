import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiUrl } from 'src/app/core/api-url.enum';
import { User } from "src/app/core/models";
import { ObservableStoreBase } from '../core/observable-store/observable-store-base';
import { ApiService } from '../core/services/api.service';
import { ArrayHelperService } from '../core/services/utility/array-helper.service';
import { BaseModelStore } from '../core/state/abstracts/base-model.store';
import { Roles } from '../shared-app/enums';
import { StoreState } from './store-state';

@Injectable({
  providedIn: 'any',
})
export class UsersStore extends BaseModelStore<StoreState> {

  sortedUsers$: Observable<User[]>;
  
  get users(): User[]{ return this.getStateProperty("users"); }

  constructor(
    base: ObservableStoreBase,
    apiService: ApiService,
    private arrayHelperService: ArrayHelperService,
  ) {
    super(base, apiService);

    this.sortedUsers$ = this.modelProperty$("users").pipe(map(this.sortByRole));
  }

  updatePassord$(userName: string, newPassword: string): Observable<boolean>{
    return this.apiService
      .put(`${ApiUrl.Users}/${userName}/NewPassword`, {newPassword, userName});
  }
  
  private sortByRole = (users: User[]): User[] => {
    if(!users) return [];

    let grouped = this.arrayHelperService.groupBy(users, "role"); 
    let result = [];

    for(let role of Object.keys(Roles).map(key => Roles[key])) 
      if(grouped[role]) result = result.concat(grouped[role])

    return result;
  }
}
