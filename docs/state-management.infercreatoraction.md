<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-management](./state-management.md) &gt; [InferCreatorAction](./state-management.infercreatoraction.md)

## InferCreatorAction type

<b>Signature:</b>

```typescript
export declare type InferCreatorAction<T> = T extends ActionCreator<(infer P), (infer T)> ? P & StateAction<T> : never;
```
<b>References:</b> [ActionCreator](./state-management.actioncreator.md)<!-- -->, [StateAction](./state-management.stateaction.md)

