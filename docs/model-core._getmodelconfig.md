<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-core](./model-core.md) &gt; [\_getModelConfig](./model-core._getmodelconfig.md)

## \_getModelConfig() function

Get model config for given state property

<b>Signature:</b>

```typescript
export declare function _getModelConfig<TState, TModel extends StateModels<TState>, TConfig extends ModelConfig<TState, TModel, ValidModelIdKey<TModel>> = ModelConfig<TState, TModel, ValidModelIdKey<TModel>>>(prop: Immutable<StatePropByModel<TState, TModel>>): Immutable<TConfig>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  prop | Immutable&lt;[StatePropByModel](./model-core.statepropbymodel.md)<!-- -->&lt;TState, TModel&gt;&gt; |  |

<b>Returns:</b>

Immutable&lt;TConfig&gt;

