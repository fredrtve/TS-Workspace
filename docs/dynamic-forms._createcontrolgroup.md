<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [\_createControlGroup](./dynamic-forms._createcontrolgroup.md)

## \_createControlGroup() function

Create a function for creating type safe [ControlGroupSchema](./dynamic-forms.controlgroupschema.md) for a specified TGroup.

<b>Signature:</b>

```typescript
export declare function _createControlGroup<TForm extends object, TInputState extends object = {}>(): <TControls extends ValidControlSchemaMap<TForm, TInputState>, TGroupComponent extends Maybe<Type<ControlGroupComponent<any, any>>> = undefined>(group: ControlGroupSchema<TForm, TInputState, TControls, NoUnion<TGroupComponent>>) => ControlGroupSchema<TForm, TInputState, TControls, NoUnion<TGroupComponent>>;
```
<b>Returns:</b>

&lt;TControls extends [ValidControlSchemaMap](./dynamic-forms.validcontrolschemamap.md)<!-- -->&lt;TForm, TInputState&gt;, TGroupComponent extends Maybe&lt;Type&lt;[ControlGroupComponent](./dynamic-forms.controlgroupcomponent.md)<!-- -->&lt;any, any&gt;&gt;&gt; = undefined&gt;(group: [ControlGroupSchema](./dynamic-forms.controlgroupschema.md)<!-- -->&lt;TForm, TInputState, TControls, NoUnion&lt;TGroupComponent&gt;&gt;) =&gt; [ControlGroupSchema](./dynamic-forms.controlgroupschema.md)<!-- -->&lt;TForm, TInputState, TControls, NoUnion&lt;TGroupComponent&gt;&gt;

A function that creates type safe [ControlGroupSchema](./dynamic-forms.controlgroupschema.md) for the specified TGroup

