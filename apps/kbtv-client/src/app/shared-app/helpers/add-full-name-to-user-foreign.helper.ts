import { _convertArrayToObject } from '@fretve/array-helpers';
import { User } from '@core/models';
import { UserForeign } from '@core/models/relationships/user-foreign.interface';
import { Immutable, ImmutableArray, Maybe } from '@fretve/global-types';

export function _setFullNameOnUserForeigns<TEntity extends UserForeign>(
    entities: Maybe<ImmutableArray<TEntity>>,
    users: Maybe<ImmutableArray<User>>
  ): Maybe<Immutable<TEntity>[]> {
    const clone = entities?.slice();
    if (!clone || !users) return clone;

    let usersObj = _convertArrayToObject(users, "userName");

    for(let i = 0; i < clone.length; i++){
      const entity = clone[i];
      const user = entity.userName ? usersObj[entity.userName] : null;
      if(user) clone[i] = {...entity, fullName: user.firstName + " " + user.lastName};
    }

    return clone;
  }