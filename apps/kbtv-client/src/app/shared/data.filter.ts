import { Immutable } from '@fretve/global-types';

export type DataFilterConstructor<TCriteria>  = 
    new (criteria: Immutable<Partial<TCriteria>>, ...args: unknown[]) => DataFilter<unknown, TCriteria>;

export abstract class DataFilter<TRecord, TCriteria>{

    private checksCount: number = 0;

    protected get isCriteriaEmpty(): boolean{ return !this.criteria }

    criteria: Immutable<Partial<TCriteria>>;

    constructor(criteria: Immutable<TCriteria>, private maxChecks?: number, ignoreEmptyCheck?: boolean){
        this.criteria = criteria || {} as Immutable<Partial<TCriteria>>;
        if(ignoreEmptyCheck) 
            this.check = this.checkDefault
        else 
            this.check = this.isCriteriaEmpty ? this.checkEmpty : this.checkDefault;
    }

    check: (record: Immutable<TRecord>) => boolean; 

    containedIn(criteria: Immutable<TCriteria>): boolean {
        return false;
    }; 

    protected abstract addChecks(record: Immutable<TRecord>): boolean;

    protected addEmptyStateChecks(record: Immutable<TRecord>): boolean{
        return true; 
    }

    private checkDefault = (record: Immutable<TRecord>): boolean => { 
        if(!record) return false;
        if(this.maxChecks && this.checksCount >= this.maxChecks) return false;
        
        let exp = true;

        exp = exp && this.addChecks(record);

        if(exp && this.maxChecks) this.checksCount++; //if true, append checksCount

        return exp;
    }

    private checkEmpty = (record: Immutable<TRecord>): boolean => {
        if(!record) return false;
        return this.addEmptyStateChecks(record);
    }

}