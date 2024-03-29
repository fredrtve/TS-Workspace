<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-form](./model-form.md) &gt; [ModelFormConfig](./model-form.modelformconfig.md)

## ModelFormConfig interface

Represents a configuration object for a model form

<b>Signature:</b>

```typescript
export interface ModelFormConfig<TState extends object, TModel extends StateModels<TState>, TForm extends object = TModel extends object ? TModel : object, TInputState extends object = {}> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [actionConverter?](./model-form.modelformconfig.actionconverter.md) | [Converter](./model-form.converter.md)<!-- -->&lt;[ModelFormResult](./model-form.modelformresult.md)<!-- -->&lt;TState, TModel, TForm&gt;, StateAction&gt; | <i>(Optional)</i> A custom converter used to convert form to a state action on submit. Defaults to [\_formToSaveModelConverter](./model-form._formtosavemodelconverter.md) with form value as entity. |
|  [actionOptions?](./model-form.modelformconfig.actionoptions.md) | Partial&lt;FormActionsOptions&lt;TForm&gt;&gt; | <i>(Optional)</i> Configure actions on the form |
|  [dynamicForm](./model-form.modelformconfig.dynamicform.md) | ControlGroupSchema&lt;TForm, TState &amp; TInputState, any, any&gt; | The form being used |
|  [includes?](./model-form.modelformconfig.includes.md) | (x: ModelQuery&lt;TState, TModel, "", ""&gt;) =&gt; RestrictedQuery&lt;TState, TModel, any, any&gt; | <i>(Optional)</i> Configure what relational state that will be mapped to entity and included in form state. |
|  [modelConverter?](./model-form.modelformconfig.modelconverter.md) | Maybe&lt;[Converter](./model-form.converter.md)<!-- -->&lt;DeepPartial&lt;TModel&gt;, Partial&lt;TForm&gt;&gt;&gt; | <i>(Optional)</i> A custom converter used to convert the model data to form. Only required on edit. If null, form value is treated as model |
|  [stateProp](./model-form.modelformconfig.stateprop.md) | StatePropByModel&lt;TState, TModel&gt; | The state property representing TModel state |

