<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-management](./state-management.md) &gt; [\_on](./state-management._on.md)

## \_on variable

Helper function that creates a reducer

<b>Signature:</b>

```typescript
_on: <TState, TActionCreator extends ((payload: any) => any) | (() => {
    readonly type: any;
})>(action: TActionCreator, reducerFn: ReducerFn<TState, InferCreatorAction<TActionCreator>>) => Reducer<TState, InferCreatorAction<TActionCreator>>
```