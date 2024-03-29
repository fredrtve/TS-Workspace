<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [ControlOverridesMap](./dynamic-forms.controloverridesmap.md)

## ControlOverridesMap type

Represents a map of controls and their configurable properties, allowing form state selectors.

<b>Signature:</b>

```typescript
export declare type ControlOverridesMap<TForm extends object, TInputState extends object, TControls extends ControlSchemaMap<any>> = {
    [P in keyof TControls]?: TControls[P] extends ControlFieldSchema<any, any> ? ControlFieldOverrides<TForm, TInputState, TControls[P]> : TControls[P] extends ControlArraySchema<any, any> ? ControlArrayOverrides<TForm, TInputState, TControls[P]> : TControls[P] extends ControlGroupSchema<any, any, any, any> ? ControlGroupOverrides<TForm, TInputState, TControls[P]> : ControlFieldOverrides<TForm, TInputState, any>;
};
```
<b>References:</b> [ControlSchemaMap](./dynamic-forms.controlschemamap.md)<!-- -->, [ControlFieldSchema](./dynamic-forms.controlfieldschema.md)<!-- -->, [ControlFieldOverrides](./dynamic-forms.controlfieldoverrides.md)<!-- -->, [ControlArraySchema](./dynamic-forms.controlarrayschema.md)<!-- -->, [ControlArrayOverrides](./dynamic-forms.controlarrayoverrides.md)<!-- -->, [ControlGroupSchema](./dynamic-forms.controlgroupschema.md)<!-- -->, [ControlGroupOverrides](./dynamic-forms.controlgroupoverrides.md)

