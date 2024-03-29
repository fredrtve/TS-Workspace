<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [ControlArraySchema](./dynamic-forms.controlarrayschema.md)

## ControlArraySchema interface

Represents a group of controls, and relationships between them.

<b>Signature:</b>

```typescript
export interface ControlArraySchema<TInputState extends object, TTemplate extends AbstractDynamicControl<any, TInputState, any, any, any>, TArrayComponent extends Type<ControlArrayComponent<GetValueTypeFromControl<TTemplate>, any>> | undefined = undefined> extends DynamicControlArray<GetValueTypeFromControl<TTemplate>, TInputState, GetValueTypeFromControl<TTemplate>, TTemplate, TArrayComponent>, ControlArrayOverridables<GetValueTypeFromControl<TTemplate>, TInputState, TTemplate, GetViewOptionsFromComponent<TArrayComponent, DefaultControlArrayComponentOptions>> 
```
<b>Extends:</b> [DynamicControlArray](./dynamic-forms.dynamiccontrolarray.md)<!-- -->&lt;[GetValueTypeFromControl](./dynamic-forms.getvaluetypefromcontrol.md)<!-- -->&lt;TTemplate&gt;, TInputState, [GetValueTypeFromControl](./dynamic-forms.getvaluetypefromcontrol.md)<!-- -->&lt;TTemplate&gt;, TTemplate, TArrayComponent&gt;, [ControlArrayOverridables](./dynamic-forms.controlarrayoverridables.md)<!-- -->&lt;[GetValueTypeFromControl](./dynamic-forms.getvaluetypefromcontrol.md)<!-- -->&lt;TTemplate&gt;, TInputState, TTemplate, [GetViewOptionsFromComponent](./dynamic-forms.getviewoptionsfromcomponent.md)<!-- -->&lt;TArrayComponent, [DefaultControlArrayComponentOptions](./dynamic-forms.defaultcontrolarraycomponentoptions.md)<!-- -->&gt;&gt;

