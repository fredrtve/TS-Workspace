<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-management](./state-management.md) &gt; [selectProp](./state-management.selectprop.md)

## selectProp variable

An rxjs operator used to select a specified property from state and only emit when its value changes.

<b>Signature:</b>

```typescript
selectProp: <TState, TProp extends Extract<keyof Immutable<TState>, string>>(prop: TProp) => (source: Observable<Immutable<TState>>) => Observable<Immutable<TState>[TProp]>
```