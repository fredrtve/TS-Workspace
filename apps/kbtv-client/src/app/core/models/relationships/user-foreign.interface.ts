import { Maybe } from '@fretve/global-types';
import { User } from '../user.interface';

export interface UserForeign {
    userName?: string;
    user?: Maybe<User>;
    fullName?: Maybe<string>;
}