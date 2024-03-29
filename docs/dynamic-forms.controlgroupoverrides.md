<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [ControlGroupOverrides](./dynamic-forms.controlgroupoverrides.md)

## ControlGroupOverrides type

Represents an object of configurable properties on TGroup, allowing form state selectors.

<b>Signature:</b>

```typescript
export declare type ControlGroupOverrides<TForm extends object, TInputState extends object, TGroup extends ControlGroupSchema<any, any, any, any>> = Partial<ControlGroupOverridables<TForm, TInputState, TGroup["controls"], Partial<GetViewOptionsFromControl<TGroup>>>>;
```
<b>References:</b> [ControlGroupSchema](./dynamic-forms.controlgroupschema.md)<!-- -->, [ControlGroupOverridables](./dynamic-forms.controlgroupoverridables.md)<!-- -->, [GetViewOptionsFromControl](./dynamic-forms.getviewoptionsfromcontrol.md)

