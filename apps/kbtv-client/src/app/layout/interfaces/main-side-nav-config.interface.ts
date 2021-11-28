import { User } from '@core/models/user.interface';
import { Maybe, Immutable } from '@fretve/global-types';

export interface MainSideNavConfig{
    user: Maybe<Immutable<User>>;
    syncTimestamp: number;
    isOnline: boolean;
}