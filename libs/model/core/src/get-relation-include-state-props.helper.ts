import { Immutable, Prop } from "global-types";
import { ChildRelation, ForeignRelation, RelationInclude, StateModels } from "./interfaces";
import { _getModelConfig } from "./model-state-config-helpers";

export function _getRelationIncludeStateProps<TState, TModel extends StateModels<TState>>(
    {prop, includes}: Immutable<RelationInclude<TState, TModel>>
): Prop<TState>[] {
    const { children, foreigns } = _getModelConfig<TState, TModel>(prop);
    let stateProps: string[] = [<string> prop];

    if(includes?.length){
        for(const relProp of includes){
            const childRel = <ChildRelation<TState, TModel, any>> (<any>children)[relProp];
            if(childRel !== undefined) stateProps.push(<string> childRel.stateProp);
            else{
                const fkRel = <ForeignRelation<TState, TModel, any>> (<any>foreigns)[relProp];
                if(fkRel !== undefined) stateProps.push(<string> fkRel.stateProp);
            }
        }
    }

    return <Prop<TState>[]> stateProps;
}


