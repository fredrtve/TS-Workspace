<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-core](./model-core.md) &gt; [ModelByStateProp](./model-core.modelbystateprop.md)

## ModelByStateProp type

<b>Signature:</b>

```typescript
export declare type ModelByStateProp<TState, TProp extends keyof TState> = TState[TProp] extends ValidStateModelArray<(infer M)> ? M : never;
```
<b>References:</b> [ValidStateModelArray](./model-core.validstatemodelarray.md)

