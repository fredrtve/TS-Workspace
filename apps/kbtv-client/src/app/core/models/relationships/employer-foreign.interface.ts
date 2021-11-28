import { Maybe } from '@fretve/global-types';
import { Employer } from '../employer.interface';

export interface EmployerForeign {
    employerId?: string;
    employer?: Maybe<Employer>;
}