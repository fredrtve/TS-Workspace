<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [ControlFieldSchema](./dynamic-forms.controlfieldschema.md)

## ControlFieldSchema interface

Describes the rendering, value and validation of an form control field

<b>Signature:</b>

```typescript
export interface ControlFieldSchema<TValueType, TControlComponent extends Type<ControlFieldComponent<TValueType, any>> | undefined = undefined> extends DynamicControlField<never, {}, TValueType, TControlComponent>, ControlFieldOverridables<never, {}, GetViewOptionsFromComponent<TControlComponent>> 
```
<b>Extends:</b> [DynamicControlField](./dynamic-forms.dynamiccontrolfield.md)<!-- -->&lt;never, {}, TValueType, TControlComponent&gt;, [ControlFieldOverridables](./dynamic-forms.controlfieldoverridables.md)<!-- -->&lt;never, {}, [GetViewOptionsFromComponent](./dynamic-forms.getviewoptionsfromcomponent.md)<!-- -->&lt;TControlComponent&gt;&gt;
