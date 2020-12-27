import { Inject, Injectable } from '@angular/core';
import { HttpRequest } from '@http/interfaces';
import { HttpAction } from '@http/state/http.effect';
import { Immutable } from '@global/interfaces';
import { DispatchedAction, Effect, Prop } from '@state/interfaces';
import { listenTo } from '@state/operators/listen-to.operator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { COMMAND_API_MAP, MODEL_PROP_TRANSLATIONS } from '../../injection-tokens.const';
import { CommandApiMap, KeyVal, ModelConfig } from '../../interfaces';
import { ModelCommand } from '../../model-command.enum';
import { ModelStateConfig } from '../../model-state.config';
import { SaveModelAction } from './save-model.action';

@Injectable()
export class SaveModelHttpEffect<TModel extends {}, TState extends {}> implements Effect<SaveModelAction<TModel, TState>> {
    protected type: string = SaveModelAction
    
    constructor(
        @Inject(COMMAND_API_MAP) private apiMap: CommandApiMap,
        @Inject(MODEL_PROP_TRANSLATIONS) private translations: Readonly<KeyVal<string>>,
    ){ }

    handle$(actions$: Observable<DispatchedAction<SaveModelAction<TModel, TState>>>): Observable<HttpAction> {
        return actions$.pipe(
            listenTo([this.type]),
            map(x => <HttpAction>{ 
                type: HttpAction, propagate: true,
                request: this.createHttpRequest(x.action), 
                stateSnapshot: x.stateSnapshot 
            }),
        )
    }

    protected createHttpRequest(action: Immutable<SaveModelAction<TModel, TState>>): HttpRequest{
        const modelConfig = ModelStateConfig.get<TModel, TState>(action.stateProp);
        if(!modelConfig) console.error(`No model config for property ${action.stateProp}`);

        return {
            apiUrl: action.apiUrlOverride || this.createApiUrl(action, modelConfig),
            body: this.createHttpBody(action),
            method: this.apiMap[action.saveAction].method,
            cancelMessage: this.createCancelMessage(action, modelConfig)
        }
    }

    protected createCancelMessage(
        action: Immutable<SaveModelAction<TModel, TState>>, 
        modelConfig: Immutable<ModelConfig<TModel, TState>>
    ): string{
        const saveWord = action.saveAction === ModelCommand.Update ? "Oppdatering" : "Oppretting";
        const entityWord = this.translations[<string> modelConfig.foreignProp?.toLowerCase()]?.toLowerCase();
        const displayPropWord = this.translations[<string> modelConfig.displayProp?.toLowerCase()]?.toLowerCase();
        const displayPropValue = action.entity[<Prop<Immutable<TModel>>> modelConfig.displayProp];
        return `${saveWord} av ${entityWord} med ${displayPropWord} ${displayPropValue} er reversert!`;
    }
  
    protected createHttpBody(action: Immutable<SaveModelAction<TModel, TState>>): {} {
        return action.entity;
    }

    protected createApiUrl(
        action: Immutable<SaveModelAction<TModel, TState>>, 
        modelConfig: Immutable<ModelConfig<TModel, TState>>
    ): string {
        const suffix = this.apiMap[action.saveAction].suffix;
        if(typeof suffix === "string") return modelConfig.apiUrl + suffix;
        else{ 
            const id = action.entity[<Prop<Immutable<TModel>>> modelConfig.identifier]
            return modelConfig.apiUrl + suffix(id);
        }
    }

}