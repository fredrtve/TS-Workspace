<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [form-sheet](./form-sheet.md) &gt; [FormSheetWrapperConfig](./form-sheet.formsheetwrapperconfig.md)

## FormSheetWrapperConfig interface

Represents the configuration for [FormSheetWrapperComponent](./form-sheet.formsheetwrappercomponent.md)

<b>Signature:</b>

```typescript
export interface FormSheetWrapperConfig<TForm extends object, TInputState extends object = {}> extends FormSheetConfigurations<TForm, TInputState>, FormSheetState<TForm, TInputState> 
```
<b>Extends:</b> [FormSheetConfigurations](./form-sheet.formsheetconfigurations.md)<!-- -->&lt;TForm, TInputState&gt;, [FormSheetState](./form-sheet.formsheetstate.md)<!-- -->&lt;TForm, TInputState&gt;

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [submitCallback?](./form-sheet.formsheetwrapperconfig.submitcallback.md) | Maybe&lt;(val: Immutable&lt;NotNull&lt;TForm&gt;&gt;) =&gt; void&gt; | <i>(Optional)</i> Function that executes when form is submitted. |

