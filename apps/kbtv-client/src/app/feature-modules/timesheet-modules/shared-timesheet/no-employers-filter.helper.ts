import { User } from "@core/models";
import { Roles } from "@core/roles.enum";
import { _filter } from "@fretve/array-helpers";
import { Immutable, ImmutableArray, Maybe } from "@fretve/global-types";

const filter = (x: User) => x.role !== Roles.Oppdragsgiver
export function _noEmployersFilter(users: Maybe<ImmutableArray<User>>): Immutable<User>[] {
    return _filter(users, filter)
}