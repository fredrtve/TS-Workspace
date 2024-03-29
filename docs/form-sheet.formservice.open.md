<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [form-sheet](./form-sheet.md) &gt; [FormService](./form-sheet.formservice.md) &gt; [open](./form-sheet.formservice.open.md)

## FormService.open() method

Opens the specified form as a form sheet

<b>Signature:</b>

```typescript
open<TForm extends object, TInputState extends object = {}, TCustomResults = never>(view: Immutable<FormSheetViewConfig<TForm, TInputState>>, state: FormSheetState<TForm, TInputState>, submitCallback?: (val: Immutable<NotNull<TForm>>) => void): MatBottomSheetRef<FormSheetWrapperComponent, Immutable<NotNull<TForm> | TCustomResults>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  view | Immutable&lt;[FormSheetViewConfig](./form-sheet.formsheetviewconfig.md)<!-- -->&lt;TForm, TInputState&gt;&gt; | The view config for the form sheet |
|  state | [FormSheetState](./form-sheet.formsheetstate.md)<!-- -->&lt;TForm, TInputState&gt; | The state of the form |
|  submitCallback | (val: Immutable&lt;NotNull&lt;TForm&gt;&gt;) =&gt; void | An optional callback that gets called when the form is submitted. |

<b>Returns:</b>

MatBottomSheetRef&lt;[FormSheetWrapperComponent](./form-sheet.formsheetwrappercomponent.md)<!-- -->, Immutable&lt;NotNull&lt;TForm&gt; \| TCustomResults&gt;&gt;

A reference to the bottom sheet with the form.

