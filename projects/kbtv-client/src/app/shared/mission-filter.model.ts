import { Mission } from '../core/models';
import { MissionCriteria } from './interfaces';
import { DataFilter } from './data.filter';
import { Immutable, Maybe } from 'global-types';

export class MissionFilter extends DataFilter<Mission, MissionCriteria>{

    protected get isCriteriaEmpty(): boolean{
        return !this.criteria || 
            (this.criteria.finished == null && !this.criteria.searchString && !this.criteria.employer && !this.criteria.missionType)
    }

    private searchStringLower: Maybe<string>;
    private sixtyDaysAgo: Maybe<number>;

    constructor(criteria: Immutable<MissionCriteria>, maxChecks?: number, ignoreEmptyCheck?: boolean){
        super(criteria, maxChecks, ignoreEmptyCheck);
        this.searchStringLower = criteria?.searchString?.toLowerCase();
        if(this.isCriteriaEmpty) this.sixtyDaysAgo = new Date().setDate(new Date().getDate() - 60);
    }

    protected addChecks(mission: Immutable<Mission>): boolean{
        let exp = true;

        if(this.criteria.finished != null)
            exp = exp && ((mission.finished === this.criteria.finished) || (!mission.finished && this.criteria.finished === false));

        if(this.criteria.searchString)
            exp = exp && this.filterSearchString(mission);

        if(this.criteria.employer?.id)
            exp = exp && mission.employerId === this.criteria.employer.id;

        if(this.criteria.missionType?.id)
            exp = exp && mission.missionTypeId === this.criteria.missionType.id;

        return exp;
    }

    protected addEmptyStateChecks(mission: Immutable<Mission>): boolean{
        let exp = mission.createdAt != null && mission.createdAt >= <number> this.sixtyDaysAgo
        exp = exp || mission.lastVisited != null && mission.lastVisited >= <number> this.sixtyDaysAgo;
        return exp;
    }
    
    private filterSearchString(m: Immutable<Mission>): boolean {
        return m != null && this.searchStringLower != null && 
        ( m.address?.toLowerCase().indexOf(this.searchStringLower) !== -1 || 
         ( m.id != null && m.id.indexOf(this.searchStringLower)  !== -1 ) );
    }   
       
};