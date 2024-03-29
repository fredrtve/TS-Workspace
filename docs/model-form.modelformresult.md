<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-form](./model-form.md) &gt; [ModelFormResult](./model-form.modelformresult.md)

## ModelFormResult interface

The input value passed to converters by the model form when form is submitted.

<b>Signature:</b>

```typescript
export interface ModelFormResult<TState extends object, TModel extends StateModels<TState>, TForm = TModel> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [formValue](./model-form.modelformresult.formvalue.md) | TForm | The actual value of the form |
|  [initialValue](./model-form.modelformresult.initialvalue.md) | DeepPartial&lt;TModel&gt; | The initial value of the form |
|  [options?](./model-form.modelformresult.options.md) | Maybe&lt;Partial&lt;TState&gt;&gt; | <i>(Optional)</i> Any options used in the form |
|  [stateProp](./model-form.modelformresult.stateprop.md) | StatePropByModel&lt;TState, TModel&gt; | The state property corresponding with the model |

