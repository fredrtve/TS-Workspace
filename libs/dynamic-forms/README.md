[Root](../../README.md) &gt; [dynamic-forms](./README.md)

# Dynamic Forms for Angular
Create reusable and type safe dynamic forms in Angular. 

Demo available on [StackBlitz](https://stackblitz.com/) using angular material control components.

[API documentation](../../docs/dynamic-forms.md)

## Features
 - Type safe form configuration
 - Modularity allowing easy and safe reusability of controls between forms. 
 - Extensible with custom form control components for different themes and/or behavior. 
 - Uses Angular Reactive Forms. 

## Quick Start
 1. Install dynamic-forms 
 2. Install a suitable control component package, or create your own. 
 3. Import `DynamicFormsModule` to an `NgModule`.
````
@NgModule({
  imports: [
    ...
    DynamicFormsModule,
    ...
  ],
  ...
})
export class FeatureModule { }`
````

 4. Define the controls from a specified interface

Create a instance of `DynamicFormBuilder` with the form model and optional form state types. 
 ````
 interface PersonForm { 
	 name: string,
	 country: string, 
	 titles: string[]
}
 interface PersonFormState { countries: string[] }
const builder = new DynamicFormBuilder<PersonForm, PersonFormState >(); 
 ````
 Create the controls of the group using the builder or with the `_createControlField`,  `_createControlGroup` or `_createControlArray` functions.
 ````
  const nameField = _createControlField({ 
	 viewComponent: InputFieldComponent, 
	 viewOptions: { placeholder: "Name" }, 
	 required$: true,
	 validators$: [ Validator.minLength(4), Validators.maxLength(40) ]
 });
 
 const countryField = builder.field<SelectFieldComponent<string>>({ 
	viewComponent: SelectFieldComponent,
	viewOptions: { options$: [] },
	required$: true, 
 });
 
const titleArray = builder.array({
	controlTemplate: builder.field({
		viewComponent: InputFieldComponent, 
		viewOptions: { placeholder: "Tittel" },
    }),
    viewOptions: {}
});
 ````

 - Field value types are dictated by the view component, and has to be specified for generic fields like the `countryField`.
 - The `viewOptions` object represents custom values provided by the `viewComponent`.




 5. Create a group using the builder and the predefined fields
 ````
 const personGroupConfig = builder.group({
	controls: {
		name: nameField,
		country: countryField,
	},
	viewOptions: {},
	overrides: {
		country: { 
			viewOptions: { options$: builder.bindState("countries") }
		} 
	} 
})
  ````
  
 - The `overrides` property allows for overriding properties of the controls.
 - Properties ending with `$` can specify reactive values from the group model and/or form state using the bind functions on the builder. See [Reactive Selectors](#reactive-selectors).
 - By not specifying a `viewComponent`, the group will use a default component to render the controls. See [Setting default options](#setting-default-options)





 6. Render the group using the `<lib-dynamic-form>` component.
 ````
 <lib-dynamic-form
	[config]="personGroupConfig"
	[formGroup]="formGroup"
	[inputState]="inputState"
	[initialValue]="initialValue">
</lib-dynamic-form>
 ````
 The `<lib-dynamic-form>` component builds the form and renders the controls, and it accepts the following inputs: 
 
 - `config` : The group configuration specifying how to build the form. 
 - `formGroup` : A form group instance which allows for tracking the form value and validation.
 - `inputState` : The form state required by the group
 - `initialValue` : The initial value of the group. 
 

 ## Control types
 There are three different types of controls that represent different value types:
 
 - `Array` : Used to represent an array values with an array of controls. 
 - `Group` : Used to represent an object value, where each property represents a control.
 - `Field` :  Used to represent any value compatible with its view component.
## Reactive Selectors
To make the controls reactive, you can bind properties on the control object to other controls or external state with reactive selectors. The selectors can only specify controls or state that is available to the control. All properties that end with `$` supports the use of selectors. 

To create a selector, use the bind functions available on the `DynamicFormBuilder` class. There are 3 types of selectors:

 - `FormStateSelector`: Used to select controls or state, with a setter function to map the selected values to a desired output. 
 - `FormStateObserverSelector`: Similar to `FormStateSelector`, however the setter function provides the values as observables, and requires the output to be observable. 
 - `AsyncValidatorSelector` : A special selector similar to `FormStateObserverSelector`, however the setter requires the return value to be of type `AsyncValidatorFn`. 

## Setting default options
 To configure `DynamicFormDefaultOptions`, use the `DYNAMIC_FORM_DEFAULT_OPTIONS` token to provide the values.
````
@NgModule({
  providers: [
    { provide:  DYNAMIC_FORM_DEFAULT_OPTIONS, useValue: DefaultOptions }
    ...
  ],
})
export class SomeModule { }`
````

The options available are:

 - `arrayViewComponent` : The default view component for array controls.
 - `groupViewComponent` : The default view component for group controls.
 - `groupClass`: A CSS class added to all group components.
 - `arrayClass`: A CSS class added to all array components.
 - `fieldClass`: A CSS class added to all field components.
 - `controlAttributes`: HTML attributes added to all controls.


**If you provide default components, use typescript declaration merging to provide the default component view options interface.** 

````
declare module "dynamic-forms" {
  interface DefaultControlGroupComponentOptions extends SomeGroupOptions { }
  interface DefaultControlArrayComponentOptions extends SomeArrayOptions { }
}
````
 - Extend `DefaultControlGroupComponentOptions` to provide default view options for control groups. 
 - Extend `DefaultControlArrayComponentOptions` to provide default view options for control arrays.
