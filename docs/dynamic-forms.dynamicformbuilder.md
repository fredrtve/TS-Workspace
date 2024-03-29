<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [DynamicFormBuilder](./dynamic-forms.dynamicformbuilder.md)

## DynamicFormBuilder class

Responsible for constructing type safe forms for a given TForm and TInputState.

<b>Signature:</b>

```typescript
export declare class DynamicFormBuilder<TForm extends object, TInputState extends object = {}> 
```

## Remarks

Does not perform runtime checks, primarily used for type safe compilation.

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [array](./dynamic-forms.dynamicformbuilder.array.md) |  | &lt;TTemplate extends import("../interfaces").[AbstractDynamicControl](./dynamic-forms.abstractdynamiccontrol.md)<!-- -->&lt;any, TInputState, any, any, any&gt;, TArrayComponent extends import("@angular/core").Type&lt;import("../interfaces").[ControlArrayComponent](./dynamic-forms.controlarraycomponent.md)<!-- -->&lt;any, any&gt;&gt; \| undefined = undefined&gt;(control: import("./interfaces").[ControlArraySchema](./dynamic-forms.controlarrayschema.md)<!-- -->&lt;TInputState, TTemplate, \[TArrayComponent\] extends \[import("ts-essentials").UnionToIntersection&lt;TArrayComponent&gt;\] ? TArrayComponent : undefined&gt;) =&gt; import("./interfaces").[ControlArraySchema](./dynamic-forms.controlarrayschema.md)<!-- -->&lt;TInputState, TTemplate, \[TArrayComponent\] extends \[import("ts-essentials").UnionToIntersection&lt;TArrayComponent&gt;\] ? TArrayComponent : undefined&gt; | Constructs a type safe [ControlArraySchema](./dynamic-forms.controlarrayschema.md)<!-- -->. |
|  [field](./dynamic-forms.dynamicformbuilder.field.md) |  | typeof \_createControlField | Constructs a type safe [ControlFieldSchema](./dynamic-forms.controlfieldschema.md)<!-- -->. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [asyncValidator(formSlice, stateSlice, setter)](./dynamic-forms.dynamicformbuilder.asyncvalidator.md) |  | Constructs an observable selector for TState that returns an async validator. |
|  [bind(formSlice, stateSlice, setter, onlyOnce)](./dynamic-forms.dynamicformbuilder.bind.md) |  | Constructs selectors for TForm and TState that resolve to reactive observables. Used to bind options to form or state. |
|  [bindForm(slice, setter, onlyOnce)](./dynamic-forms.dynamicformbuilder.bindform.md) |  | Constructs selectors for TForm that resolve to reactive observables. Used to bind options to form. |
|  [bindForm(slice, setter, onlyOnce)](./dynamic-forms.dynamicformbuilder.bindform_1.md) |  |  |
|  [bindForm(slice, setter, onlyOnce)](./dynamic-forms.dynamicformbuilder.bindform_2.md) |  |  |
|  [bindObserver(formSlice, stateSlice, setter)](./dynamic-forms.dynamicformbuilder.bindobserver.md) |  | Constructs selectors for TForm and TState with observable setters |
|  [bindState(slice, setter, onlyOnce)](./dynamic-forms.dynamicformbuilder.bindstate.md) |  | Constructs selectors for TState that resolve to reactive observables. Used to bind options to state. |
|  [bindState(slice, setter, onlyOnce)](./dynamic-forms.dynamicformbuilder.bindstate_1.md) |  |  |
|  [bindState(slice, setter, onlyOnce)](./dynamic-forms.dynamicformbuilder.bindstate_2.md) |  |  |
|  [group()](./dynamic-forms.dynamicformbuilder.group.md) |  | Create a function for creating type safe [ControlGroupSchema](./dynamic-forms.controlgroupschema.md) for a specified TGroup. |

