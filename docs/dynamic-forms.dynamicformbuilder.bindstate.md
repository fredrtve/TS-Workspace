<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [DynamicFormBuilder](./dynamic-forms.dynamicformbuilder.md) &gt; [bindState](./dynamic-forms.dynamicformbuilder.bindstate.md)

## DynamicFormBuilder.bindState() method

Constructs selectors for TState that resolve to reactive observables. Used to bind options to state.

<b>Signature:</b>

```typescript
bindState<TSlice extends keyof TInputState>(slice: TSlice, setter?: null, onlyOnce?: boolean): FormStateSelector<never, PickOr<TInputState, TSlice, never>, TInputState[TSlice], string, TSlice>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  slice | TSlice |  |
|  setter | null |  |
|  onlyOnce | boolean |  |

<b>Returns:</b>

[FormStateSelector](./dynamic-forms.formstateselector.md)<!-- -->&lt;never, PickOr&lt;TInputState, TSlice, never&gt;, TInputState\[TSlice\], string, TSlice&gt;

