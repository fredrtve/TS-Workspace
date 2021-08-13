import { User } from "@core/models";
import { Roles } from "@core/roles.enum";
import { _filter } from "array-helpers";
import { Immutable, ImmutableArray, Maybe } from "global-types";

const filter = (x: User) => x.role !== Roles.Oppdragsgiver
export function _noEmployersFilter(users: Maybe<ImmutableArray<User>>): Immutable<User>[] {
    return _filter(users, filter)
}