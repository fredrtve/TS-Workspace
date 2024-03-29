<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-core](./model-core.md) &gt; [ExtractedModelState](./model-core.extractedmodelstate.md)

## ExtractedModelState type

Represents the extracted models from saving a model. Ordered by state prop.

<b>Signature:</b>

```typescript
export declare type ExtractedModelState<TState> = {
    [P in keyof Partial<TState>]: TState[P] extends ValidStateModelArray<StateModels<TState>> ? {
        withExistingId: TState[P];
        withGeneratedId: TState[P];
    } : never;
};
```
<b>References:</b> [ValidStateModelArray](./model-core.validstatemodelarray.md)<!-- -->, [StateModels](./model-core.statemodels.md)

