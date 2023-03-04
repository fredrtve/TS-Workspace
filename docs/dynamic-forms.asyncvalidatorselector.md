<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [AsyncValidatorSelector](./dynamic-forms.asyncvalidatorselector.md)

## AsyncValidatorSelector interface

Represents a selector for async validators

<b>Signature:</b>

```typescript
export interface AsyncValidatorSelector<TForm extends object, TInputState extends object, TFormSlice extends string, TStateSlice extends keyof TInputState> extends ReactiveSelector<TFormSlice, TStateSlice> 
```
<b>Extends:</b> [ReactiveSelector](./dynamic-forms.reactiveselector.md)<!-- -->&lt;TFormSlice, TStateSlice&gt;

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [ɵform?](./dynamic-forms.asyncvalidatorselector._form.md) | TForm | <i>(Optional)</i> |
|  [ɵstate?](./dynamic-forms.asyncvalidatorselector._state.md) | TInputState | <i>(Optional)</i> |
|  [selectorType](./dynamic-forms.asyncvalidatorselector.selectortype.md) | "asyncValidator" |  |
|  [setter](./dynamic-forms.asyncvalidatorselector.setter.md) | [FormStateSelectorFn](./dynamic-forms.formstateselectorfn.md)<!-- -->&lt;Observable&lt;DeepPropsObject&lt;TForm, TFormSlice&gt;&gt;, Observable&lt;Partial&lt;TInputState&gt;&gt;, AsyncValidatorFn&gt; |  |
