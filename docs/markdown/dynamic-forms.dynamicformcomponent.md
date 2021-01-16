<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [DynamicFormComponent](./dynamic-forms.dynamicformcomponent.md)

## DynamicFormComponent class

Responsible for rendering a dynamic form with a [DynamicForm](./dynamic-forms.dynamicform.md) configuration.

<b>Signature:</b>

```typescript
export declare class DynamicFormComponent extends ControlComponentLoaderComponent implements FormComponent<DynamicForm<{}, {}>, {}, unknown> 
```
<b>Extends:</b> ControlComponentLoaderComponent

<b>Implements:</b> [FormComponent](./dynamic-forms.formcomponent.md)<!-- -->&lt;[DynamicForm](./dynamic-forms.dynamicform.md)<!-- -->&lt;{}, {}&gt;, {}, unknown&gt;

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(componentFactoryResolver, cdRef, validationErrorMessages, formStore, formBuilder)](./dynamic-forms.dynamicformcomponent._constructor_.md) |  | Constructs a new instance of the <code>DynamicFormComponent</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [config](./dynamic-forms.dynamicformcomponent.config.md) |  | [DynamicForm](./dynamic-forms.dynamicform.md)<!-- -->&lt;{}, {}&gt; |  |
|  [disableOnOffline](./dynamic-forms.dynamicformcomponent.disableonoffline.md) |  | boolean |  |
|  [dynamicHost](./dynamic-forms.dynamicformcomponent.dynamichost.md) |  | DynamicHostDirective |  |
|  [formSubmitted](./dynamic-forms.dynamicformcomponent.formsubmitted.md) |  | EventEmitter&lt;unknown&gt; |  |
|  [resetEnabled$](./dynamic-forms.dynamicformcomponent.resetenabled_.md) |  | Observable&lt;boolean&gt; |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [checkPasswords(group)](./dynamic-forms.dynamicformcomponent.checkpasswords.md) |  |  |
|  [getValidationErrorMessage()](./dynamic-forms.dynamicformcomponent.getvalidationerrormessage.md) |  |  |
|  [onCancel()](./dynamic-forms.dynamicformcomponent.oncancel.md) |  |  |
|  [onReset()](./dynamic-forms.dynamicformcomponent.onreset.md) |  |  |
|  [onSubmit()](./dynamic-forms.dynamicformcomponent.onsubmit.md) |  |  |
