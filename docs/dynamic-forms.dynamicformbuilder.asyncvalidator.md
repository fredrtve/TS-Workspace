<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [DynamicFormBuilder](./dynamic-forms.dynamicformbuilder.md) &gt; [asyncValidator](./dynamic-forms.dynamicformbuilder.asyncvalidator.md)

## DynamicFormBuilder.asyncValidator() method

Constructs an observable selector for TState that returns an async validator.

<b>Signature:</b>

```typescript
asyncValidator<TFormSlice extends string, TStateSlice extends keyof TInputState>(formSlice: ValidFormSlice<DeepRequired<TForm>, TFormSlice>[], stateSlice: TStateSlice[], setter: FormStateSelectorFn<Observable<DeepPropsObject<ConstructSliceFromPath<TFormSlice, TForm>, TFormSlice>>, Observable<Partial<PickOr<TInputState, TStateSlice, never>>>, AsyncValidatorFn>): AsyncValidatorSelector<ConstructSliceFromPath<TFormSlice, TForm>, PickOr<TInputState, TStateSlice, never>, string, TStateSlice>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  formSlice | [ValidFormSlice](./dynamic-forms.validformslice.md)<!-- -->&lt;DeepRequired&lt;TForm&gt;, TFormSlice&gt;\[\] |  |
|  stateSlice | TStateSlice\[\] |  |
|  setter | [FormStateSelectorFn](./dynamic-forms.formstateselectorfn.md)<!-- -->&lt;Observable&lt;DeepPropsObject&lt;ConstructSliceFromPath&lt;TFormSlice, TForm&gt;, TFormSlice&gt;&gt;, Observable&lt;Partial&lt;PickOr&lt;TInputState, TStateSlice, never&gt;&gt;&gt;, AsyncValidatorFn&gt; |  |

<b>Returns:</b>

[AsyncValidatorSelector](./dynamic-forms.asyncvalidatorselector.md)<!-- -->&lt;ConstructSliceFromPath&lt;TFormSlice, TForm&gt;, PickOr&lt;TInputState, TStateSlice, never&gt;, string, TStateSlice&gt;

