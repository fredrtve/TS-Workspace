<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [ControlComponent](./dynamic-forms.controlcomponent.md)

## ControlComponent interface

<b>Signature:</b>

```typescript
export interface ControlComponent<TValueType, TViewOptions extends object> extends OnControlInit 
```
<b>Extends:</b> [OnControlInit](./dynamic-forms.oncontrolinit.md)

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [formControl](./dynamic-forms.controlcomponent.formcontrol.md) | [GenericAbstractControl](./dynamic-forms.genericabstractcontrol.md)<!-- -->&lt;TValueType&gt; | The control associated with this component |
|  [ɵviewOptions?](./dynamic-forms.controlcomponent._viewoptions.md) | TViewOptions | <i>(Optional)</i> |
|  [viewOptionSelectors](./dynamic-forms.controlcomponent.viewoptionselectors.md) | Immutable&lt;[AllowFormStateSelectors](./dynamic-forms.allowformstateselectors.md)<!-- -->&lt;TViewOptions, any, any&gt;&gt; | Selectors for viewOptions values. Use with [FormStateResolver](./dynamic-forms.formstateresolver.md) to retrieve observable values. |
