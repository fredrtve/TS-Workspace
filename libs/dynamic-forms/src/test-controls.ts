import { DynamicFormBuilder } from './public-api';
import { TestFieldComponent } from './test-assets/test-control-field.component';
import { TestControlGroupComponent } from './test-assets/test-control-group.component';


  const builder = new DynamicFormBuilder<{ arr: { nest1: string, nest2: string}[], fun: string}, {state: string[], state2: string}>();
  const iBuilder = new DynamicFormBuilder<{ nest1: string, nest2: string}>();

  const stringControl = builder.field<TestFieldComponent<string>>({
    required$: true,
    viewComponent: TestFieldComponent,
    viewOptions: { width$: "" }
  });
 
  const group = builder.group<{ nest1: string, nest2: string}>()({
    viewComponent: TestControlGroupComponent,
    disabled$: true,
    controls: {
      nest1: stringControl,
      nest2: stringControl
    },
    viewOptions: { someOption$: ""  },
    overrides: {
      nest1: { disabled$: iBuilder.bindForm("nest1", (arr) => true) }
    }
  });

  const arr = builder.array({
    controlTemplate: group,
    viewOptions: { testOption$: "" },
    templateOverrides: {
      disabled$: true
    }
  }) 

  const form = builder.form({
    controls: {
      fun: stringControl,
      arr: arr
    },
    overrides: {
      arr:{
        viewOptions: {  testOption$: builder.bind(["fun"], ["state"], (f,s) => "" )  }
      }
    }
  })