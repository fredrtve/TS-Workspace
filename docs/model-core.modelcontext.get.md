<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-core](./model-core.md) &gt; [ModelContext](./model-core.modelcontext.md) &gt; [get](./model-core.modelcontext.get.md)

## ModelContext.get() method

Query for a model in TState

<b>Signature:</b>

```typescript
get<TProp extends keyof TState>(stateProp: TProp): ModelByStateProp<TState, TProp> extends StateModels<TState> ? ModelQuery<TState, ModelByStateProp<TState, TProp>> : any;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  stateProp | TProp | Model state property |

<b>Returns:</b>

[ModelByStateProp](./model-core.modelbystateprop.md)<!-- -->&lt;TState, TProp&gt; extends [StateModels](./model-core.statemodels.md)<!-- -->&lt;TState&gt; ? [ModelQuery](./model-core.modelquery.md)<!-- -->&lt;TState, [ModelByStateProp](./model-core.modelbystateprop.md)<!-- -->&lt;TState, TProp&gt;&gt; : any

A model query object

