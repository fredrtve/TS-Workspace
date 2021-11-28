import { Immutable } from "@fretve/global-types";
import { ModelCommands } from "model/state-commands";
import { StateModels } from "model/core";
import { ModelFormResult } from "./interfaces";

export const _formToSaveModelConverter = <TState extends object, TModel extends StateModels<TState>>(
    input: Immutable<ModelFormResult<TState, TModel>>
) => ModelCommands.save<TState, TModel>({
        entity: input.formValue,
        stateProp: input.stateProp
    })
