<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-form](./model-form.md) &gt; [ModelFormToSaveModelInput](./model-form.modelformtosavemodelinput.md)

## ModelFormToSaveModelInput interface

The input value passed to converters by the model form when form is submitted.

<b>Signature:</b>

```typescript
export interface ModelFormToSaveModelInput<TForm extends {}, TState extends {}> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [formValue](./model-form.modelformtosavemodelinput.formvalue.md) | Immutable&lt;TForm&gt; | The actual value of the form |
|  [options?](./model-form.modelformtosavemodelinput.options.md) | Maybe&lt;Immutable&lt;Partial&lt;TState&gt;&gt;&gt; | <i>(Optional)</i> Any options used in the form |
|  [saveAction](./model-form.modelformtosavemodelinput.saveaction.md) | SaveAction | The type of action being handled |
|  [stateProp](./model-form.modelformtosavemodelinput.stateprop.md) | Prop&lt;TState&gt; | The state property corresponding with the model |
