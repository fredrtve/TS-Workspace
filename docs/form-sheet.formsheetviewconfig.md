<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [form-sheet](./form-sheet.md) &gt; [FormSheetViewConfig](./form-sheet.formsheetviewconfig.md)

## FormSheetViewConfig interface

Represents configuration for opening a form with [FormService](./form-sheet.formservice.md)

<b>Signature:</b>

```typescript
export interface FormSheetViewConfig<TForm extends object, TInputState extends object = {}> extends FormSheetConfigurations<TForm, TInputState> 
```
<b>Extends:</b> [FormSheetConfigurations](./form-sheet.formsheetconfigurations.md)<!-- -->&lt;TForm, TInputState&gt;

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [fullScreen?](./form-sheet.formsheetviewconfig.fullscreen.md) | boolean | <i>(Optional)</i> Set to true to enable full screen forms on mobile. Defaults to true |
|  [useRouting?](./form-sheet.formsheetviewconfig.userouting.md) | boolean | <i>(Optional)</i> Enable to append a query param to the route when opened, making the form a part of the browser history. Default is true |

