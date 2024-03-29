<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-core](./model-core.md) &gt; [\_saveModel](./model-core._savemodel.md)

## \_saveModel() function

Add or update a model and any foreign relationships set on the provided model value according to [ModelConfig](./model-core.modelconfig.md)

<b>Signature:</b>

```typescript
export declare function _saveModel<TState, TModel extends StateModels<TState>>(state: Immutable<TState>, rootStateProp: Immutable<StatePropByModel<TState, TModel>>, rootModel: Immutable<TModel>, preGenIds?: Partial<Record<keyof TState, Record<string, boolean>>>): Immutable<SaveModelResult<TState, TModel>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  state | Immutable&lt;TState&gt; | State containing model and foregin data |
|  rootStateProp | Immutable&lt;[StatePropByModel](./model-core.statepropbymodel.md)<!-- -->&lt;TState, TModel&gt;&gt; |  |
|  rootModel | Immutable&lt;TModel&gt; |  |
|  preGenIds | Partial&lt;Record&lt;keyof TState, Record&lt;string, boolean&gt;&gt;&gt; | A map of pre generated ids for each state. Can be used to optimize if ids need to be generated before calling function. |

<b>Returns:</b>

Immutable&lt;[SaveModelResult](./model-core.savemodelresult.md)<!-- -->&lt;TState, TModel&gt;&gt;

State with model and foreigns added or updated.

